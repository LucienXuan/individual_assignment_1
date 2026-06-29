require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(session({
 secret: process.env.SESSION_SECRET,
 resave: false,
 saveUninitialized: false
}));

app.get('/logo.png', (req, res) => {
 res.sendFile(__dirname + '/logo.png');
});

function redirectByRole(req, res) {
 if (req.session.role === 'admin') {
  res.redirect('/admin');
 } else if (req.session.role === 'student') {
  res.redirect('/student');
 } else {
  res.redirect('/');
 }
}

function requireAuth(req, res, next) {
 if (req.session.loggedIn) next();
 else res.redirect('/');
}

function requireAdmin(req, res, next) {
 if (req.session.loggedIn && req.session.role === 'admin') next();
 else redirectByRole(req, res);
}

function requireStudent(req, res, next) {
 if (req.session.loggedIn && req.session.role === 'student') next();
 else redirectByRole(req, res);
}

function buildElectionData(callback) {
 db.all('SELECT * FROM positions', [], (err, positions) => {
  if (err) return console.error(err.message);

  db.all('SELECT * FROM candidates', [], (err, candidates) => {
   if (err) return console.error(err.message);

   db.all('SELECT * FROM voters', [], (err, voters) => {
    if (err) return console.error(err.message);

    db.all('SELECT * FROM votes', [], (err, votes) => {
     if (err) return console.error(err.message);

     const uniqueVoters = [];
     votes.forEach(vote => {
      if (uniqueVoters.indexOf(vote.voter_id) === -1) {
       uniqueVoters.push(vote.voter_id);
      }
     });

     const totalStudents = voters.length;
     const votesCast = uniqueVoters.length;
     let participation = 0;
     if (totalStudents > 0) {
      participation = Math.round((votesCast / totalStudents) * 100);
     }

     positions.forEach(position => {
      let totalForPosition = 0;
      votes.forEach(vote => {
       if (vote.position_id === position.id) {
        totalForPosition++;
       }
      });

      position.candidates = [];
      candidates.forEach(candidate => {
       if (candidate.position_id === position.id) {
        let count = 0;
        votes.forEach(vote => {
         if (vote.candidate_id === candidate.id) {
          count++;
         }
        });

        let percent = 0;
        if (totalForPosition > 0) {
         percent = Math.round((count / totalForPosition) * 100);
        }

        candidate.voteCount = count;
        candidate.percent = percent;
        position.candidates.push(candidate);
       }
      });

      position.totalVotes = totalForPosition;
      position.leadingCandidate = null;
      position.candidates.forEach(candidate => {
       if (!position.leadingCandidate || candidate.voteCount > position.leadingCandidate.voteCount) {
        position.leadingCandidate = candidate;
       }
      });
     });

     callback({
      positions: positions,
      candidates: candidates,
      voters: voters,
      votes: votes,
      totalStudents: totalStudents,
      votesCast: votesCast,
      participation: participation
     });
    });
   });
  });
 });
}

app.get('/', (req, res) => {
 if (req.session.loggedIn) {
  return redirectByRole(req, res);
 }
 res.render('index');
});

app.post('/login', (req, res) => {
 const username = req.body.username;
 const password = req.body.password;

 db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
  if (err) return console.error(err.message);

  if (user && bcrypt.compareSync(password, user.password)) {
   req.session.loggedIn = true;
   req.session.username = user.username;
   req.session.role = user.role;
   req.session.voter_id = user.voter_id;
   redirectByRole(req, res);
  } else {
   res.render('index', { error: 'Invalid username or password!' });
  }
 });
});

app.get('/logout', (req, res) => {
 req.session.destroy();
 res.redirect('/');
});

app.get('/about', (req, res) => {
 res.send('<h1>MILA SRC Election Portal</h1><p>This portal allows admins to view election results and students to vote for SRC candidates.</p><p><a href="/">Back to login</a></p>');
});

app.get('/rules', (req, res) => {
 res.send('<h1>Voting Rules</h1><p>Each student account can submit one vote for each election position only once.</p><p><a href="/">Back to login</a></p>');
});

app.get('/admin', requireAdmin, (req, res) => {
 buildElectionData((data) => {
  res.render('admin', {
   username: req.session.username,
   data: data
  });
 });
});

app.get('/student', requireStudent, (req, res) => {
 const voterId = req.session.voter_id;
 let message = '';

 if (req.query.success) {
  message = 'Thank you. Your vote has been submitted.';
 }

 if (req.query.duplicate) {
  message = 'You have already voted for this position.';
 }

 db.get('SELECT * FROM voters WHERE id = ?', [voterId], (err, voter) => {
  if (err) return console.error(err.message);

  db.all('SELECT * FROM votes WHERE voter_id = ?', [voterId], (err, myVotes) => {
   if (err) return console.error(err.message);

   const votedPositionIds = [];
   myVotes.forEach(vote => {
    votedPositionIds.push(vote.position_id);
   });

   buildElectionData((data) => {
    res.render('student', {
     username: req.session.username,
     voter: voter,
     votedPositionIds: votedPositionIds,
     data: data,
     message: message
    });
   });
  });
 });
});

app.post('/vote', requireStudent, (req, res) => {
 const voterId = req.session.voter_id;
 const positionId = req.body.positionId;
 const candidateId = req.body.candidateId;

 db.get('SELECT * FROM candidates WHERE id = ? AND position_id = ?', [candidateId, positionId], (err, candidate) => {
  if (err) return console.error(err.message);

  if (!candidate) {
   return res.redirect('/student');
  }

  db.get('SELECT * FROM votes WHERE voter_id = ? AND position_id = ?', [voterId, positionId], (err, existingVote) => {
   if (err) return console.error(err.message);

   if (existingVote) {
    return res.redirect('/student?duplicate=1');
   }

   db.run('INSERT INTO votes (voter_id, position_id, candidate_id) VALUES (?, ?, ?)', [voterId, positionId, candidateId], (err) => {
    if (err) {
     return console.error(err.message);
    }

    console.log(`[SYSTEM] '${req.session.username}' voted for candidate ID: ${candidateId} in position ID: ${positionId}`);
    res.redirect('/student?success=1');
   });
  });
 });
});

app.use((req, res) => {
 if (req.session.loggedIn) {
  redirectByRole(req, res);
 } else {
  res.redirect('/');
 }
});

app.listen(PORT, () => {
 console.log(`Server is successfully running on port ${PORT}`);
});
