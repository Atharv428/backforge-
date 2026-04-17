require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve frontend files directly

// Set up PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase/Neon/Vercel Postgres connections
});

// Initialize Database Table
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) DEFAULT '',
        solved INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        rating INTEGER DEFAULT 1200,
        avatar VARCHAR(5) DEFAULT 'U',
        color VARCHAR(10) DEFAULT '#58a6ff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        username VARCHAR(50),
        problem_id INTEGER NOT NULL,
        problem_title VARCHAR(255) NOT NULL,
        language VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        runtime VARCHAR(50) NOT NULL,
        memory VARCHAR(50) NOT NULL,
        code TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ensure columns exist if table was created previously without them
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT ''");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS solved INTEGER DEFAULT 0");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 0");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS rating INTEGER DEFAULT 1200");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(5) DEFAULT 'U'");
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS color VARCHAR(10) DEFAULT '#58a6ff'");
    
    console.log("Users table ready (with leaderboard stats)");
  } catch (err) {
    console.error("Failed to initialize database", err);
  }
};
initDB();

// API Endpoint: Signup
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email or username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const newUser = result.rows[0];
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// API Endpoint: Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });

    res.status(200).json({
      user: { id: user.id, username: user.username, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// API Endpoint: Mock OAuth
app.post('/api/auth/mock-oauth', async (req, res) => {
  const { provider } = req.body;
  const randomId = Math.floor(Math.random() * 10000);
  const email = `${provider}user${randomId}@${provider}.com`;
  const username = `${provider}User${randomId}`;
  
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('oauth_mock_password', salt);

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const newUser = result.rows[0];
    const token = jwt.sign({ id: newUser.id, username: newUser.username }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });

    res.status(200).json({ user: newUser, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during mock OAuth' });
  }
});

// API Endpoint: Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  try {
    // Fetch top 100 users sorted by points, then rating
    const result = await pool.query(
      'SELECT username, name, solved, points, rating, avatar, color FROM users ORDER BY points DESC, rating DESC LIMIT 100'
    );
    
    // Assign ranks
    const users = result.rows.map((u, i) => ({ ...u, rank: i + 1 }));
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// API Endpoint: User Profile
app.get('/api/user/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const result = await pool.query(
      'SELECT id, username, email, name, solved, points, rating, avatar, color FROM users WHERE username = $1',
      [username]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    
    // Calculate global rank
    const user = result.rows[0];
    const rankResult = await pool.query(
      'SELECT COUNT(*) + 1 AS rank FROM users WHERE points > $1 OR (points = $1 AND rating > $2)',
      [user.points, user.rating]
    );
    
    user.rank = parseInt(rankResult.rows[0].rank);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// API Endpoint: Submit Code
app.post('/api/submit-code', async (req, res) => {
  const { user_id, username, problem_id, problem_title, language, code } = req.body;
  try {
    // Simulate backend grading engine
    const statuses = ['Accepted', 'Accepted', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const runtime = Math.floor(Math.random() * 100) + ' ms';
    const memory = (Math.random() * 20 + 10).toFixed(1) + ' MB';

    const result = await pool.query(
      'INSERT INTO submissions (user_id, username, problem_id, problem_title, language, status, runtime, memory, code) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [user_id, username, problem_id, problem_title, language, status, runtime, memory, code]
    );

    // If Accepted, reward user points and increment solved count
    if (status === 'Accepted' && user_id) {
       await pool.query('UPDATE users SET solved = solved + 1, points = points + 10 WHERE id = $1', [user_id]);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit code' });
  }
});

// API Endpoint: Get All Submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM submissions ORDER BY created_at DESC LIMIT 50');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// API Endpoint: Run Code (Simulation)
app.post('/api/run-code', async (req, res) => {
  const { code, language } = req.body;
  setTimeout(() => {
    // Generate a simulated output based on random chance
    const success = Math.random() > 0.2;
    res.status(200).json({
      status: success ? 'Finished' : 'Runtime Error',
      stdout: success ? '✓ Test case 1 passed\n✓ Test case 2 passed\n' : 'Exception in thread "main" java.lang.NullPointerException\n',
      runtime: Math.floor(Math.random() * 100) + ' ms',
      memory: (Math.random() * 10 + 10).toFixed(1) + ' MB'
    });
  }, 800); // Simulate processing time
});

// API Endpoint: User Stats (Dashboard)
app.get('/api/user/stats', async (req, res) => {
  res.status(200).json({
    activity: Array.from({length: 364}, () => Math.random() > 0.6 ? Math.floor(Math.random() * 4) + 1 : 0),
    miniCharts: Array.from({length: 12}, () => Math.floor(Math.random() * 100))
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
module.exports = app;
