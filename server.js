const express = require('express');
const path = require('path');
const cors = require('cors');
const students = require('./students.json'); // student data
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files (all .html, css, js, etc.)
app.use(express.static(path.join(__dirname)));

// --- HTML Page Routes ---
// Route for the overview page (default homepage)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'overview.html'));
});

// Route for the overview page (explicit)
app.get('/overview.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'overview.html'));
});

// Route for the login page
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Route for the registration page
app.get('/registerpage.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'registerpage.html'));
});

// Route for the forgot password page
app.get('/forgetten.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'forgetten.html'));
});

// Route for the academics dashboard
app.get('/academics.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'academics.html'));
});

// Route for the students list page
app.get('/students.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'students.html'));
});

// Route for the faculty management page
app.get('/faculty.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'faculty.html'));
});

// --- API Endpoint for Student Data ---
// GET /students?q=<search>
app.get('/students', (req, res) => {
  const q = req.query.q ? req.query.q.toLowerCase() : '';
  const result = students.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.id.toLowerCase().includes(q) ||
    s.email.toLowerCase().includes(q)
  );
  res.json(result);
});

// Start the server
app.listen(port, () => {
  console.log(`ERP System is running at http://localhost:${port}`);
});
