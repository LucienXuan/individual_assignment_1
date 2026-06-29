# MILA University SRC Election Portal

Name: ____________________  
Student ID: ____________________

## Project Title
Student Representative Council (SRC) Election Portal

## Project Description
This is a full-stack web application for the MILA University SRC election. The system allows an admin to view live election results and allows students to log in, view candidate names and manifestos, and vote only once for each election position.

## Lab Concepts Applied
This project applies the syntax and concepts from the five labs:

- Lab 1: Express server setup, routes and `nodemon`.
- Lab 2: EJS pages and HTML form submission.
- Lab 3: SQLite database setup and read/write operations.
- Lab 4: POST routes and ID-based database operations.
- Lab 5: Session login, hashed passwords, role-based access control and protected routes.

## Features Included
- Role-based login for Admin and Students.
- Admin dashboard to view live election results.
- Student dashboard to view candidates, manifestos and vote.
- Students can vote only once for each position.
- MILA University logo included in the interface.
- Personalized welcome message after login.
- Additional voters and candidates seeded in the database.
- Profile images for candidates using SVG image data.
- Multiple election positions: President and Secretary.
- Security enhancements using sessions, bcrypt password hashing, role checking, duplicate vote checking and `.gitignore` protection.
- Two extra informational routes: `/about` and `/rules`.

## Login Accounts
All passwords are `pass123`.

| Role | Username | Password |
|---|---|---|
| Admin | admin | pass123 |
| Student | s1001 | pass123 |
| Student | s1002 | pass123 |
| Student | s1003 | pass123 |
| Student | s1004 | pass123 |
| Student | s1005 | pass123 |
| Student | s1006 | pass123 |

## Installation Instructions
Run these commands in the project folder:

```bash
npm install
```

Create a `.env` file in the project folder and add:

```bash
SESSION_SECRET=your_secret_key_here
```

Start the server:

```bash
nodemon server.js
```

Open the browser using the forwarded port 3000.

## File Structure

```text
src-election-portal/
├── database.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
├── logo.png
└── views/
    ├── index.ejs
    ├── admin.ejs
    └── student.ejs
```

## Sample Screenshots of Output
Add your own screenshots after running the system:

### Login Page
![Login Page](screenshots/login.png)

### Admin Dashboard
![Admin Dashboard](screenshots/admin.png)

### Student Dashboard
![Student Dashboard](screenshots/student.png)

## Notes
- Do not push `node_modules`, `.env` or `school.db` to GitHub.
- If the database structure does not update, delete `school.db` and run the server again.
