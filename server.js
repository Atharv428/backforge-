const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Serve static files from current directory
app.use(express.static(path.join(__dirname, '.')));

const dataDir = path.join(__dirname, 'data');

const loadJson = (filename) => {
    try {
        const filePath = path.join(dataDir, filename);
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
};

const saveJson = (filename, data) => {
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

app.get('/api/problems', (req, res) => {
    res.json(loadJson('problems.json'));
});

app.get('/api/contests', (req, res) => {
    res.json(loadJson('contests.json'));
});

app.get('/api/leaderboard', (req, res) => {
    res.json(loadJson('users.json'));
});

app.get('/api/submissions', (req, res) => {
    res.json(loadJson('submissions.json'));
});

app.get('/api/ai/hint', (req, res) => {
    res.json(loadJson('hints.json'));
});

app.get('/api/contests/:id', (req, res) => {
    const contestId = parseInt(req.params.id);
    const contests = loadJson('contests.json');
    const problems = loadJson('problems.json');
    
    const contest = contests.find(c => c.id === contestId);
    if (contest) {
        contest.problem_list = problems.filter(p => (contest.problemIds || []).includes(p.id));
        return res.json(contest);
    }
    return res.status(404).json({ success: false, message: 'Contest not found' });
});

app.post('/api/contests/:id/register', (req, res) => {
    const contestId = parseInt(req.params.id);
    const contests = loadJson('contests.json');
    
    const contest = contests.find(c => c.id === contestId);
    if (contest) {
        contest.participants = (contest.participants || 0) + 1;
        contest.registered = true;
        saveJson('contests.json', contests);
        return res.json({ success: true, message: `Successfully registered for contest ${contestId}` });
    }
    return res.status(404).json({ success: false, message: 'Contest not found' });
});

// Fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Node.js Express server running on http://localhost:${PORT}`);
});
