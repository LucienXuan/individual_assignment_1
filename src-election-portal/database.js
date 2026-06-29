const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./school.db', (err) => {
 if (err) {
  console.error('Database connection error:', err.message);
 } else {
  console.log('Connected to the SQLite database.');
 }
});

const passHash = bcrypt.hashSync('pass123', 10);

const photo1 = '/images/alex-nelson.jpg';
const photo2 = '/images/chris-lee.jpg';
const photo3 = '/images/maria-garcia.jpg';
const photo4 = '/images/farah-sofea.jpg';
const photo5 = '/images/dinesh-kumar.jpg';
const photo6 = '/images/lim-yi-wen.jpg';
const photo7 = '/images/chris-burkh.jpg';
const photo8 = '/images/sarah-johnson.jpg';
const photo9 = '/images/dave-wilson.jpg';

db.serialize(() => {
 db.run(`CREATE TABLE IF NOT EXISTS voters (
  id INTEGER PRIMARY KEY,
  name TEXT,
  student_no TEXT,
  program TEXT
 )`);

 db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT,
  role TEXT,
  voter_id INTEGER
 )`);

 db.run(`CREATE TABLE IF NOT EXISTS positions (
  id INTEGER PRIMARY KEY,
  title TEXT
 )`);

 db.run(`CREATE TABLE IF NOT EXISTS candidates (
  id INTEGER PRIMARY KEY,
  position_id INTEGER,
  name TEXT,
  manifesto TEXT,
  photo TEXT,
  course TEXT
 )`);

 db.run(`CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  voter_id INTEGER,
  position_id INTEGER,
  candidate_id INTEGER,
  UNIQUE(voter_id, position_id)
 )`);

 function insertSeedData() {
  db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (1, 'Aiman Hakim', 'SRC1001', 'Bachelor of Computer Science')`);
  db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (2, 'Siti Nur Aisyah', 'SRC1002', 'Bachelor of Software Engineering')`);
  db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (3, 'Daniel Tan', 'SRC1003', 'Bachelor of Information Technology')`);
  db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (4, 'Priya Raman', 'SRC1004', 'Bachelor of Computer Science')`);
  db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (5, 'Muhammad Irfan', 'SRC1005', 'Bachelor of Software Engineering')`);
  db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (6, 'Nur Batrisyia', 'SRC1006', 'Bachelor of Information Technology')`);
  db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (7, 'John Doe', 'SRC1007', 'Bachelor of Computer Science')`);

  db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('admin', ?, 'admin', NULL)`, [passHash]);
  db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1001', ?, 'student', 1)`, [passHash]);
  db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1002', ?, 'student', 2)`, [passHash]);
  db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1003', ?, 'student', 3)`, [passHash]);
  db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1004', ?, 'student', 4)`, [passHash]);
  db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1005', ?, 'student', 5)`, [passHash]);
  db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1006', ?, 'student', 6)`, [passHash]);
  db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1007', ?, 'student', 7)`, [passHash]);

  db.run(`INSERT OR IGNORE INTO positions (id, title) VALUES (1, 'President')`);
  db.run(`INSERT OR IGNORE INTO positions (id, title) VALUES (2, 'Secretary')`);
  db.run(`INSERT OR IGNORE INTO positions (id, title) VALUES (3, 'Treasurer')`);

  db.run(`INSERT OR REPLACE INTO candidates (id, position_id, name, manifesto, photo, course) VALUES (1, 1, 'Alex Nelson', 'I will improve student welfare by creating faster feedback channels, stronger student support and transparent SRC updates.', ?, 'Bachelor of Computer Engineering, Year 3, Sem 6')`, [photo1]);
  db.run(`INSERT OR REPLACE INTO candidates (id, position_id, name, manifesto, photo, course) VALUES (2, 1, 'Chris Lee', 'I will build a more active campus through better events, inclusive clubs and practical communication between students and management.', ?, 'Bachelor of Computer Science, Year 3, Sem 6')`, [photo2]);
  db.run(`INSERT OR REPLACE INTO candidates (id, position_id, name, manifesto, photo, course) VALUES (3, 1, 'Maria Garcia', 'I will represent student voices clearly, promote unity and push for fair academic and co-curricular opportunities.', ?, 'Bachelor of Information Technology, Year 2, Sem 4')`, [photo3]);
  db.run(`INSERT OR REPLACE INTO candidates (id, position_id, name, manifesto, photo, course) VALUES (4, 2, 'Farah Sofea', 'I will keep SRC records organised, ensure meeting updates are shared on time and improve student announcement flow.', ?, 'Bachelor of Business Management, Year 2, Sem 4')`, [photo4]);
  db.run(`INSERT OR REPLACE INTO candidates (id, position_id, name, manifesto, photo, course) VALUES (5, 2, 'Dinesh Kumar', 'I will make communication clearer by preparing concise minutes, proper schedules and quick follow-up after every SRC discussion.', ?, 'Bachelor of Accounting, Year 3, Sem 5')`, [photo5]);
  db.run(`INSERT OR REPLACE INTO candidates (id, position_id, name, manifesto, photo, course) VALUES (6, 2, 'Lim Yi Wen', 'I will support an efficient SRC by managing records carefully and helping students access important information easily.', ?, 'Bachelor of Software Engineering, Year 3, Sem 6')`, [photo6]);
  db.run(`INSERT OR REPLACE INTO candidates (id, position_id, name, manifesto, photo, course) VALUES (7, 3, 'Chris Burkh', 'I will ensure SRC funds are managed responsibly, provide transparent financial reports and support student initiatives effectively.', ?, 'Bachelor of Computer Engineering, Year 3, Sem 6')`, [photo7]);
  db.run(`INSERT OR REPLACE INTO candidates (id, position_id, name, manifesto, photo, course) VALUES (8, 3, 'Sarah Johnson', 'I will maintain accurate financial records, oversee budget allocations and promote financial literacy among students.', ?, 'Bachelor of Computer Science, Year 3, Sem 6')`, [photo8]);
  db.run(`INSERT OR REPLACE INTO candidates (id, position_id, name, manifesto, photo, course) VALUES (9, 3, 'Dave Wilson', 'I will manage SRC finances with integrity, ensure fair distribution of funds and support student projects efficiently.', ?, 'Bachelor of Information Technology, Year 2, Sem 4')`, [photo9]);
 }

 db.all(`PRAGMA table_info(candidates)`, (err, columns) => {
  if (!err && !columns.some(col => col.name === 'course')) {
   db.run(`ALTER TABLE candidates ADD COLUMN course TEXT`, insertSeedData);
  } else {
   insertSeedData();
  }
 });
});

module.exports = db;
