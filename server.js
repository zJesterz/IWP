const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'iwp' folder
app.use(express.static(path.join(__dirname)));

// Route for the login page
app.get('/', (req, res) => {
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

// Route for the academics dashboard after successful login
app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'academics.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`ERP System is running at http://localhost:${port}`);
});