const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const students = require('./students.json'); // student data
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

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

// --- User Authentication API ---
// POST /login
app.post('/login', (req, res) => {
  try {
    const { username, password, captcha } = req.body;

    // Validate required fields
    if (!username || !password || !captcha) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, password, and captcha are required!' 
      });
    }

    // Read existing users
    let users = [];
    try {
      const usersData = fs.readFileSync('users.json', 'utf8');
      users = JSON.parse(usersData);
    } catch (error) {
      // File doesn't exist or is empty
      return res.status(400).json({ 
        success: false, 
        message: 'No users found. Please register first.' 
      });
    }

    // Find user by username
    const user = users.find(u => u.username === username);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password!' 
      });
    }

    // Check password (in production, compare hashed passwords)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password!' 
      });
    }

    // Return success (don't include password in response)
    const { password: _, ...userResponse } = user;
    res.json({ 
      success: true, 
      message: 'Login successful!',
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error occurred. Please try again.' 
    });
  }
});

// --- User Registration API ---
// POST /register
app.post('/register', (req, res) => {
  try {
    const { fullname, email, username, password } = req.body;

    // Validate required fields
    if (!fullname || !email || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required!' 
      });
    }

    // Read existing users
    let users = [];
    try {
      const usersData = fs.readFileSync('users.json', 'utf8');
      users = JSON.parse(usersData);
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
      users = [];
    }

    // Check for duplicate username or email
    const existingUser = users.find(user => 
      user.username === username || user.email === email
    );

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: existingUser.username === username 
          ? 'Username already exists!' 
          : 'Email already registered!' 
      });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(), // Simple ID generation
      fullname: fullname.trim(),
      email: email.trim().toLowerCase(),
      username: username.trim(),
      password: password, // In production, hash this password!
      createdAt: new Date().toISOString()
    };

    // Add user to array
    users.push(newUser);

    // Save to file
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

    // Return success (don't include password in response)
    const { password: _, ...userResponse } = newUser;
    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully!',
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error occurred. Please try again.' 
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`ERP System is running at http://localhost:${port}`);
});
