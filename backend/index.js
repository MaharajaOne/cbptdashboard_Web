const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'cbpt',
  password: 'admin',
  port: 5432,
});

const SECRET_KEY = 'Maharaja';

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Login endpoint
app.post('/login', async (req, res) => {
    const { emp_id, password } = req.body;
  
    try {
      const userQuery = await pool.query('SELECT * FROM employee WHERE emp_id = $1', [emp_id]);
      const user = userQuery.rows[0];
  
      if (!user) {
        console.log('User not found for emp_id:', emp_id); // Debug log
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (password !== user.password) {
        console.log('Invalid password for emp_id:', emp_id); // Debug log
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ emp_id: user.emp_id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      console.log('Login successful for emp_id:', emp_id); // Debug log
      res.json({ token });
    } catch (err) {
      console.error('Error during login:', err); // Debug log
      res.status(500).json({ message: 'Error logging in', error: err });
    }
  });
  
// Middleware for token verification
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Role-based access
app.get('/sidebar', authenticate, (req, res) => {
  const { role } = req.user;

  const sidebar = {
    admin: ['Home', 'Time Sheet', 'Products', 'Customers'],
    user: ['Home', 'Time Sheet'],
  };

  res.json({ sidebar: sidebar[role] || [] });
});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));


app.get('/employee-details', authenticate, async (req, res) => {
  try {
    const { emp_id } = req.user;
    const result = await pool.query('SELECT emp_name, role FROM employee WHERE emp_id = $1', [emp_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ name: result.rows[0].emp_name, role: result.rows[0].role });
  } catch (err) {
    console.error('Error fetching employee details:', err);
    res.status(500).json({ message: 'Failed to fetch employee details', error: err });
  }
});


app.get('/publishers', async (req, res) => {
  try {
    const result = await pool.query('SELECT publisher_id, publisher_name FROM publisher');
    res.json(result.rows);  // Send the fetched rows as the response
    // console.log(response.data);
  } catch (err) {
    console.error('Error fetching publishers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/tasks', async (req, res) => {
  const result = await pool.query('SELECT task_id, task_name FROM task');
  res.json(result.rows);
});

app.get('/stages', async (req, res) => {
  const result = await pool.query('SELECT stage_id, stage_name FROM stage');
  res.json(result.rows);
});

app.get('/functions', async (req, res) => {
  const result = await pool.query('SELECT function_id, function_name FROM function');
  res.json(result.rows);
});

// API for saving time log
app.post('/track-time', async (req, res) => {
  const { emp_id, publisher_id, task_id, stage_id, function_id, start_time, end_time, duration } = req.body;
  const result = await pool.query(
      `INSERT INTO time_log (emp_id, publisher_id, task_id, stage_id, function_id, start_time, end_time, duration) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [emp_id, publisher_id, task_id, stage_id, function_id, start_time, end_time, duration]
  );
  res.json(result.rows[0]);
});
