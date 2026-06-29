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

const photo1 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23224870"/><circle cx="60" cy="44" r="22" fill="%23f4d78b"/><rect x="30" y="74" width="60" height="34" rx="16" fill="%23f4d78b"/><text x="60" y="114" font-size="14" text-anchor="middle" fill="white">AN</text></svg>';
const photo2 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%237b1e2b"/><circle cx="60" cy="44" r="22" fill="%23f2c9a0"/><rect x="30" y="74" width="60" height="34" rx="16" fill="%23f2c9a0"/><text x="60" y="114" font-size="14" text-anchor="middle" fill="white">CL</text></svg>';
const photo3 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23466b52"/><circle cx="60" cy="44" r="22" fill="%23f3d4b0"/><rect x="30" y="74" width="60" height="34" rx="16" fill="%23f3d4b0"/><text x="60" y="114" font-size="14" text-anchor="middle" fill="white">MG</text></svg>';
const photo4 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%233f3f7a"/><circle cx="60" cy="44" r="22" fill="%23f1cda8"/><rect x="30" y="74" width="60" height="34" rx="16" fill="%23f1cda8"/><text x="60" y="114" font-size="14" text-anchor="middle" fill="white">FS</text></svg>';
const photo5 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%23705a2b"/><circle cx="60" cy="44" r="22" fill="%23f3d9b5"/><rect x="30" y="74" width="60" height="34" rx="16" fill="%23f3d9b5"/><text x="60" y="114" font-size="14" text-anchor="middle" fill="white">DK</text></svg>';
const photo6 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="%232e5d73"/><circle cx="60" cy="44" r="22" fill="%23f4d1aa"/><rect x="30" y="74" width="60" height="34" rx="16" fill="%23f4d1aa"/><text x="60" y="114" font-size="14" text-anchor="middle" fill="white">LY</text></svg>';

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
  photo TEXT
 )`);

 db.run(`CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  voter_id INTEGER,
  position_id INTEGER,
  candidate_id INTEGER,
  UNIQUE(voter_id, position_id)
 )`);

 db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (1, 'Aiman Hakim', 'SRC1001', 'Bachelor of Computer Science')`);
 db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (2, 'Siti Nur Aisyah', 'SRC1002', 'Bachelor of Software Engineering')`);
 db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (3, 'Daniel Tan', 'SRC1003', 'Bachelor of Information Technology')`);
 db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (4, 'Priya Raman', 'SRC1004', 'Bachelor of Computer Science')`);
 db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (5, 'Muhammad Irfan', 'SRC1005', 'Bachelor of Software Engineering')`);
 db.run(`INSERT OR IGNORE INTO voters (id, name, student_no, program) VALUES (6, 'Nur Batrisyia', 'SRC1006', 'Bachelor of Information Technology')`);

 db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('admin', ?, 'admin', NULL)`, [passHash]);
 db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1001', ?, 'student', 1)`, [passHash]);
 db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1002', ?, 'student', 2)`, [passHash]);
 db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1003', ?, 'student', 3)`, [passHash]);
 db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1004', ?, 'student', 4)`, [passHash]);
 db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1005', ?, 'student', 5)`, [passHash]);
 db.run(`INSERT OR IGNORE INTO users (username, password, role, voter_id) VALUES ('s1006', ?, 'student', 6)`, [passHash]);

 db.run(`INSERT OR IGNORE INTO positions (id, title) VALUES (1, 'President')`);
 db.run(`INSERT OR IGNORE INTO positions (id, title) VALUES (2, 'Secretary')`);

 db.run(`INSERT OR IGNORE INTO candidates (id, position_id, name, manifesto, photo) VALUES (1, 1, 'Alex Nelson', 'I will improve student welfare by creating faster feedback channels, stronger student support and transparent SRC updates.', ?)`, [photo1]);
 db.run(`INSERT OR IGNORE INTO candidates (id, position_id, name, manifesto, photo) VALUES (2, 1, 'Chris Lee', 'I will build a more active campus through better events, inclusive clubs and practical communication between students and management.', ?)`, [photo2]);
 db.run(`INSERT OR IGNORE INTO candidates (id, position_id, name, manifesto, photo) VALUES (3, 1, 'Maria Garcia', 'I will represent student voices clearly, promote unity and push for fair academic and co-curricular opportunities.', ?)`, [photo3]);
 db.run(`INSERT OR IGNORE INTO candidates (id, position_id, name, manifesto, photo) VALUES (4, 2, 'Farah Sofea', 'I will keep SRC records organised, ensure meeting updates are shared on time and improve student announcement flow.', ?)`, [photo4]);
 db.run(`INSERT OR IGNORE INTO candidates (id, position_id, name, manifesto, photo) VALUES (5, 2, 'Dinesh Kumar', 'I will make communication clearer by preparing concise minutes, proper schedules and quick follow-up after every SRC discussion.', ?)`, [photo5]);
 db.run(`INSERT OR IGNORE INTO candidates (id, position_id, name, manifesto, photo) VALUES (6, 2, 'Lim Yi Wen', 'I will support an efficient SRC by managing records carefully and helping students access important information easily.', ?)`, [photo6]);
});

module.exports = db;
