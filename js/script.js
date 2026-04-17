/**
 * CodeArena - Frontend Script
 * 
 * ============================================================
 * HACKATHON: BACKEND API ENDPOINTS TO IMPLEMENT
 * ============================================================
 *
 * AUTH
 *   POST /api/auth/login          { email, password } -> { token, user }
 *   POST /api/auth/signup         { username, email, password } -> { token, user }
 *   POST /api/auth/logout         {} -> {}
 *   GET  /api/auth/me             -> { user }
 *
 * PROBLEMS
 *   GET  /api/problems            ?difficulty=&tag=&status=&search=&page= -> { problems[], total }
 *   GET  /api/problems/:id        -> { problem }
 *
 * CODE EXECUTION
 *   POST /api/run-code            { problemId, language, code, testCases } -> { results[], stdout, stderr }
 *   POST /api/submit-code         { problemId, language, code } -> { status, runtime, memory, passedCases }
 *
 * SUBMISSIONS
 *   GET  /api/submissions         ?userId=&problemId=&page= -> { submissions[], total }
 *   GET  /api/submissions/:id     -> { submission }
 *
 * LEADERBOARD
 *   GET  /api/leaderboard         ?page=&limit= -> { users[], total }
 *
 * CONTESTS
 *   GET  /api/contests            -> { upcoming[], ongoing[], past[] }
 *   GET  /api/contests/:id        -> { contest }
 *   POST /api/contests/:id/register -> { success }
 *
 * USER
 *   GET  /api/user/:username      -> { profile }
 *   GET  /api/user/stats          -> { solved, streak, rating, heatmap }
 *   PUT  /api/user/profile        { bio, avatar } -> { user }
 *
 * AI HINT
 *   POST /api/ai/hint             { problemId, code, language } -> { hint }
 *
 * ============================================================
 */

// ===== DUMMY DATA =====

const DUMMY_USERS = [
  { rank: 1, username: "tourneysolver", name: "Alex Chen", solved: 847, points: 12450, rating: 2891, avatar: "AC", color: "#58a6ff" },
  { rank: 2, username: "codemaster99", name: "Priya Sharma", solved: 812, points: 11980, rating: 2754, avatar: "PS", color: "#bc8cff" },
  { rank: 3, username: "algo_wizard", name: "Marcus Lee", solved: 798, points: 11200, rating: 2701, avatar: "ML", color: "#3fb950" },
  { rank: 4, username: "devninja42", name: "Sara Kim", solved: 765, points: 10850, rating: 2634, avatar: "SK", color: "#e3b341" },
  { rank: 5, username: "bytecruncher", name: "James Wu", solved: 741, points: 10200, rating: 2589, avatar: "JW", color: "#f85149" },
  { rank: 6, username: "recursion_fan", name: "Lena Patel", solved: 720, points: 9870, rating: 2512, avatar: "LP", color: "#58a6ff" },
  { rank: 7, username: "stackoverflower", name: "Tom Nguyen", solved: 698, points: 9450, rating: 2478, avatar: "TN", color: "#bc8cff" },
  { rank: 8, username: "dp_queen", name: "Aisha Johnson", solved: 675, points: 9100, rating: 2401, avatar: "AJ", color: "#3fb950" },
  { rank: 9, username: "greedy_gopher", name: "Ryan Park", solved: 654, points: 8750, rating: 2356, avatar: "RP", color: "#e3b341" },
  { rank: 10, username: "binarysearch_pro", name: "Mei Zhang", solved: 631, points: 8400, rating: 2289, avatar: "MZ", color: "#f85149" }
];

const DUMMY_SUBMISSIONS = [
  { id: 1, problem: "Two Sum", problemId: 1, status: "Accepted", language: "Python", runtime: "52 ms", memory: "14.2 MB", time: "2 hours ago" },
  { id: 2, problem: "Valid Parentheses", problemId: 6, status: "Accepted", language: "JavaScript", runtime: "68 ms", memory: "12.8 MB", time: "5 hours ago" },
  { id: 3, problem: "Add Two Numbers", problemId: 2, status: "Wrong Answer", language: "C++", runtime: "N/A", memory: "N/A", time: "1 day ago" },
  { id: 4, problem: "Maximum Subarray", problemId: 8, status: "Accepted", language: "Java", runtime: "1 ms", memory: "44.1 MB", time: "2 days ago" },
  { id: 5, problem: "Longest Substring Without Repeating Characters", problemId: 3, status: "Runtime Error", language: "Python", runtime: "N/A", memory: "N/A", time: "3 days ago" },
  { id: 6, problem: "Climbing Stairs", problemId: 11, status: "Accepted", language: "JavaScript", runtime: "45 ms", memory: "11.9 MB", time: "4 days ago" },
  { id: 7, problem: "Median of Two Sorted Arrays", problemId: 4, status: "Time Limit Exceeded", language: "Python", runtime: "N/A", memory: "N/A", time: "5 days ago" },
  { id: 8, problem: "Merge Two Sorted Lists", problemId: 7, status: "Accepted", language: "C++", runtime: "4 ms", memory: "14.5 MB", time: "1 week ago" }
];

const DUMMY_CONTESTS = [
  { id: 1, name: "Weekly Contest 389", status: "upcoming", start: "2026-04-05T10:00:00", duration: "1h 30m", participants: 0, problems: 4 },
  { id: 2, name: "Biweekly Contest 127", status: "upcoming", start: "2026-04-07T14:00:00", duration: "1h 30m", participants: 0, problems: 4 },
  { id: 3, name: "CodeArena Spring Championship", status: "upcoming", start: "2026-04-12T09:00:00", duration: "3h 00m", participants: 0, problems: 6 },
  { id: 4, name: "Weekly Contest 388", status: "ongoing", start: "2026-04-02T10:00:00", duration: "1h 30m", participants: 8421, problems: 4 },
  { id: 5, name: "Weekly Contest 387", status: "past", start: "2026-03-26T10:00:00", duration: "1h 30m", participants: 9102, problems: 4 },
  { id: 6, name: "Biweekly Contest 126", status: "past", start: "2026-03-22T14:00:00", duration: "1h 30m", participants: 7854, problems: 4 },
  { id: 7, name: "Weekly Contest 386", status: "past", start: "2026-03-19T10:00:00", duration: "1h 30m", participants: 8765, problems: 4 }
];

const AI_HINTS = [
  "Think about what data structure allows O(1) lookups. A hash map might be your best friend here.",
  "Consider the sliding window technique — it can reduce O(n²) to O(n) for substring problems.",
  "Dynamic programming often helps when you see overlapping subproblems. Try defining dp[i] as the answer for the first i elements.",
  "Binary search works on any monotonic function, not just sorted arrays. Can you define a condition that's monotonic?",
  "For tree problems, think recursively: what does the function return for a leaf node? Build up from there.",
  "Greedy works when a locally optimal choice leads to a globally optimal solution. Can you prove that here?"
];

const CODE_TEMPLATES = {
  python: `def solution(nums, target):
    # TODO: Implement your solution
    pass

# Test your solution
print(solution([2, 7, 11, 15], 9))`,
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var solution = function(nums, target) {
    // TODO: Implement your solution
};

// Test your solution
console.log(solution([2, 7, 11, 15], 9));`,
  java: `class Solution {
    public int[] solution(int[] nums, int target) {
        // TODO: Implement your solution
        return new int[]{};
    }
}`,
  cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // TODO: Implement your solution
        return {};
    }
};`
};

// ===== UTILITY FUNCTIONS =====

function getDifficultyClass(diff) {
  return { Easy: 'easy', Medium: 'medium', Hard: 'hard' }[diff] || 'easy';
}

function getStatusIcon(status) {
  if (status === 'solved')    return '<span class="status-check" title="Solved">✓</span>';
  if (status === 'attempted') return '<span class="status-partial" title="Attempted">◐</span>';
  return '<span class="status-dash" title="Not Attempted">·</span>';
}

function getSubmissionBadge(status) {
  const map = {
    'Accepted': 'accepted',
    'Wrong Answer': 'wrong',
    'Runtime Error': 'runtime',
    'Time Limit Exceeded': 'tle'
  };
  return `<span class="badge badge-${map[status] || 'wrong'}">${status}</span>`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getCountdown(isoDate) {
  const diff = new Date(isoDate) - new Date();
  if (diff <= 0) return 'Started';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m}m`;
  return `${h}h ${m}m`;
}

function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ===== NAVBAR HTML =====
const LOGO_SVG = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L3 9h5l-1 6 6-8H8l1-6z"/></svg>`;

let currentUser = JSON.parse(sessionStorage.getItem('codearena_user') || 'null');

function renderNavbar(container) {
  const authLinks = currentUser 
    ? `<div style="display:flex;align-items:center;gap:1rem"><a href="dashboard.html" style="font-weight:600;color:var(--text-primary)">${currentUser.username || currentUser.email}</a> <a href="#" id="logout-btn" class="btn btn-danger btn-sm">Log out</a></div>`
    : `<a href="login.html" class="btn btn-ghost btn-sm">Log in</a>
       <a href="signup.html" class="btn btn-primary btn-sm">Sign up</a>`;

  container.innerHTML = `
    <nav class="navbar">
      <a href="index.html" class="nav-brand">
        <div class="nav-logo">${LOGO_SVG}</div>
        CodeArena
      </a>
      <div class="nav-links">
        <a href="index.html">Home</a>
        <a href="problems.html">Problems</a>
        <a href="contests.html">Contests</a>
        <a href="leaderboard.html">Leaderboard</a>
        <a href="dashboard.html">Dashboard</a>
      </div>
      <div class="nav-actions">
        ${authLinks}
      </div>
    </nav>`;
  setActiveNav();

  if (currentUser) {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('codearena_user');
        sessionStorage.removeItem('codearena_token');
        window.location.href = 'index.html';
      });
    }
  }
}

// ===== FOOTER HTML =====
function renderFooter(container) {
  container.innerHTML = `
    <footer>
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="nav-brand" style="justify-content:flex-start;margin-bottom:0.6rem">
            <div class="nav-logo">${LOGO_SVG}</div> CodeArena
          </a>
          <p>A modern platform for competitive programming practice. Sharpen your skills, climb the leaderboard.</p>
        </div>
        <div class="footer-col">
          <h4>Practice</h4>
          <a href="problems.html">All Problems</a>
          <a href="problems.html?difficulty=Easy">Easy</a>
          <a href="problems.html?difficulty=Medium">Medium</a>
          <a href="problems.html?difficulty=Hard">Hard</a>
        </div>
        <div class="footer-col">
          <h4>Compete</h4>
          <a href="contests.html">Contests</a>
          <a href="leaderboard.html">Leaderboard</a>
          <a href="dashboard.html">Dashboard</a>
        </div>
        <div class="footer-col">
          <h4>Account</h4>
          <a href="login.html">Log in</a>
          <a href="signup.html">Sign up</a>
          <a href="profile.html">Profile</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 CodeArena — Built for hackathon participants. All backend APIs are stubs waiting to be implemented.</p>
      </div>
    </footer>`;
}

// ===== PROBLEMS PAGE =====
function initProblemsPage() {
  fetch('data/problems.json')
    .then(r => r.json())
    .then(problems => renderProblemsTable(problems))
    .catch(() => {
      // Fallback: use inline data if fetch fails (file:// protocol)
      renderProblemsTable(window.PROBLEMS_DATA || []);
    });
}

function renderProblemsTable(problems) {
  const searchEl = document.getElementById('search-input');
  const diffEl = document.getElementById('filter-difficulty');
  const tagEl = document.getElementById('filter-tag');
  const statusEl = document.getElementById('filter-status');
  const tbody = document.getElementById('problems-tbody');
  const countEl = document.getElementById('problems-count');
  let currentPage = 1;
  const perPage = 10;

  // Collect all tags
  const allTags = [...new Set(problems.flatMap(p => p.tags))].sort();
  allTags.forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag; opt.textContent = tag;
    tagEl.appendChild(opt);
  });

  function filter() {
    const q = searchEl.value.toLowerCase();
    const diff = diffEl.value;
    const tag = tagEl.value;
    const status = statusEl.value;
    return problems.filter(p => {
      if (q && !p.title.toLowerCase().includes(q)) return false;
      if (diff && p.difficulty !== diff) return false;
      if (tag && !p.tags.includes(tag)) return false;
      if (status && p.status !== status) return false;
      return true;
    });
  }

  function render() {
    const filtered = filter();
    const total = filtered.length;
    const start = (currentPage - 1) * perPage;
    const page = filtered.slice(start, start + perPage);
    countEl.textContent = `${total} problems`;

    tbody.innerHTML = page.map(p => `
      <tr>
        <td>${getStatusIcon(p.status)}</td>
        <td><a href="problem.html?id=${p.id}" class="problem-title-link">${p.id}. ${p.title}</a></td>
        <td><span class="badge badge-${getDifficultyClass(p.difficulty)}">${p.difficulty}</span></td>
        <td>${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</td>
        <td class="acceptance">${p.acceptance}%</td>
      </tr>`).join('');

    renderPagination(total, currentPage, perPage);
  }

  function renderPagination(total, page, per) {
    const pages = Math.ceil(total / per);
    const el = document.getElementById('pagination');
    if (!el) return;
    let html = '';
    if (page > 1) html += `<button class="page-btn" onclick="changePage(${page-1})">‹</button>`;
    for (let i = Math.max(1, page-2); i <= Math.min(pages, page+2); i++) {
      html += `<button class="page-btn ${i===page?'active':''}" onclick="changePage(${i})">${i}</button>`;
    }
    if (page < pages) html += `<button class="page-btn" onclick="changePage(${page+1})">›</button>`;
    el.innerHTML = html;
  }

  window.changePage = (p) => { currentPage = p; render(); };
  [searchEl, diffEl, tagEl, statusEl].forEach(el => el.addEventListener('input', () => { currentPage = 1; render(); }));
  render();
}

// ===== PROBLEM DETAIL PAGE =====
function initProblemPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;

  fetch('data/problems.json')
    .then(r => r.json())
    .then(problems => {
      const p = problems.find(x => x.id === id) || problems[0];
      renderProblemDetail(p);
    })
    .catch(() => renderProblemDetail(null));
}

function renderProblemDetail(p) {
  if (!p) return;
  document.title = `${p.title} - CodeArena`;

  // Header
  document.getElementById('problem-title').textContent = `${p.id}. ${p.title}`;
  document.getElementById('problem-difficulty').innerHTML = `<span class="badge badge-${getDifficultyClass(p.difficulty)}">${p.difficulty}</span>`;
  document.getElementById('problem-tags').innerHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');

  // Description
  document.getElementById('problem-description').innerHTML = `<p>${p.description}</p>`;

  // Examples
  document.getElementById('problem-examples').innerHTML = p.examples.map((ex, i) => `
    <div class="example-block">
      <div class="label">Example ${i+1}</div>
      <code><strong>Input:</strong> ${ex.input}</code><br>
      <code><strong>Output:</strong> ${ex.output}</code>
      ${ex.explanation ? `<br><code><strong>Explanation:</strong> ${ex.explanation}</code>` : ''}
    </div>`).join('');

  // Constraints
  document.getElementById('problem-constraints').innerHTML =
    `<ul class="constraints-list">${p.constraints.map(c => `<li><code>${c}</code></li>`).join('')}</ul>`;

  // Editorial
  document.getElementById('problem-editorial').innerHTML = `<p style="color:var(--text-secondary)">${p.editorial}</p>`;

  // Set default code
  const editor = document.getElementById('code-editor');
  if (editor) editor.value = CODE_TEMPLATES.python;
}

// ===== TABS =====
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('[data-tab-group]') || btn.closest('.problem-tabs, .problem-left');
      const target = btn.dataset.tab;
      const allBtns = group ? group.querySelectorAll('.tab-btn') : document.querySelectorAll('.tab-btn');
      const allContents = document.querySelectorAll('.tab-content');
      allBtns.forEach(b => b.classList.remove('active'));
      allContents.forEach(c => { if (c.dataset.tab === target) c.classList.add('active'); else c.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
}

// ===== LANGUAGE SELECTOR =====
function initLanguageSelector() {
  const sel = document.getElementById('lang-select');
  const editor = document.getElementById('code-editor');
  if (!sel || !editor) return;
  sel.addEventListener('change', () => {
    editor.value = CODE_TEMPLATES[sel.value] || '';
  });
}

// ===== RUN / SUBMIT =====
function initCodeActions() {
  const runBtn = document.getElementById('run-btn');
  const submitBtn = document.getElementById('submit-btn');
  const output = document.getElementById('console-output');

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      // TODO: POST /api/run-code
      output.innerHTML = '<span class="out-info">Running test cases...</span>';
      setTimeout(() => {
        output.innerHTML = `
          <span class="out-success">✓ Test case 1 passed</span><br>
          <span class="out-success">✓ Test case 2 passed</span><br>
          <span class="out-info">Runtime: 52ms · Memory: 14.2 MB</span>`;
      }, 800);
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      output.innerHTML = '<span class="out-info">Submitting solution to backend...</span>';
      
      const user = JSON.parse(sessionStorage.getItem('codearena_user') || '{}');
      if (!user.id) {
        output.innerHTML = '<span class="out-info" style="color:var(--red)">You must be logged in to submit code!</span>';
        return;
      }
      
      const params = new URLSearchParams(window.location.search);
      const problemId = params.get('id') || 1;
      const titleEl = document.getElementById('problem-title');
      const problemTitle = titleEl ? titleEl.textContent.split('. ')[1] : 'Unknown Problem';
      const language = document.getElementById('lang-select').value;
      const code = document.getElementById('code-editor').value;

      try {
        const response = await fetch('http://localhost:5000/api/submit-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            username: user.username,
            problem_id: problemId,
            problem_title: problemTitle,
            language: language,
            code: code
          })
        });
        
        const data = await response.json();
        
        let outHtml = `<span class="out-${data.status === 'Accepted' ? 'success' : 'info'}">${data.status}</span><br>`;
        if(data.status === 'Accepted') {
          outHtml += `<span class="out-info">Runtime: ${data.runtime} · Memory: ${data.memory}</span><br>`;
          outHtml += `<span class="out-info" style="color:var(--accent)">Points awarded! Check Leaderboard</span>`;
        }
        output.innerHTML = outHtml;
      } catch (err) {
        output.innerHTML = '<span class="out-info" style="color:var(--red)">Failed to connect to backend</span>';
      }
    });
  }
}

// ===== AI HINT =====
function initAIHint() {
  const btn = document.getElementById('ai-hint-btn');
  const panel = document.getElementById('ai-hint-panel');
  const hintText = document.getElementById('hint-text');
  const newHintBtn = document.getElementById('new-hint-btn');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      // TODO: POST /api/ai/hint
      hintText.textContent = AI_HINTS[Math.floor(Math.random() * AI_HINTS.length)];
    }
  });

  if (newHintBtn) {
    newHintBtn.addEventListener('click', () => {
      // TODO: POST /api/ai/hint with current code context
      hintText.textContent = AI_HINTS[Math.floor(Math.random() * AI_HINTS.length)];
    });
  }

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== btn) panel.classList.remove('open');
  });
}

// ===== LEADERBOARD =====
async function initLeaderboard() {
  const tbody = document.getElementById('leaderboard-tbody');
  if (!tbody) return;
  
  let usersData = DUMMY_USERS;
  try {
    const response = await fetch('http://localhost:5000/api/leaderboard');
    if (response.ok) {
      const realUsers = await response.json();
      if (realUsers.length > 0) {
        usersData = realUsers;
      }
    }
  } catch (err) {
    console.warn("Could not load real leaderboard, falling back to dummy data");
  }

  tbody.innerHTML = usersData.map(u => {
    const rankClass = u.rank === 1 ? 'rank-gold' : u.rank === 2 ? 'rank-silver' : u.rank === 3 ? 'rank-bronze' : 'rank-num';
    const barWidth = Math.round((u.rating / 3000) * 80);
    return `
      <tr>
        <td><span class="${rankClass}">${u.rank}</span></td>
        <td>
          <div class="user-cell">
            <div class="avatar" style="background:${u.color}18;color:${u.color}">${u.avatar}</div>
            <div>
              <div style="font-weight:600;font-size:0.875rem;letter-spacing:-0.01em">${u.username}</div>
              <div style="font-size:0.75rem;color:var(--text-muted)">${u.name}</div>
            </div>
          </div>
        </td>
        <td style="font-weight:600;font-variant-numeric:tabular-nums">${u.solved}</td>
        <td style="color:var(--accent);font-weight:600;font-variant-numeric:tabular-nums">${Number(u.points).toLocaleString()}</td>
        <td>
          <div class="rating-display">
            <div class="rating-bar-track"><div class="rating-bar-fill" style="width:${barWidth}px"></div></div>
            <span style="font-weight:700;color:var(--purple);font-variant-numeric:tabular-nums">${u.rating}</span>
          </div>
        </td>
      </tr>`;
  }).join('');
}

// ===== SUBMISSIONS PAGE =====
async function initSubmissionsPage() {
  const tbody = document.getElementById('submissions-tbody');
  if (!tbody) return;
  
  let subs = DUMMY_SUBMISSIONS;
  try {
    const res = await fetch('http://localhost:5000/api/submissions');
    if (res.ok) {
      const realSubs = await res.json();
      if (realSubs.length > 0) subs = realSubs;
    }
  } catch (err) {
    console.warn("Could not load real submissions, falling back to dummy data");
  }

  tbody.innerHTML = subs.map(s => `
    <tr>
      <td><a href="problem.html?id=${s.problem_id || s.problemId}" style="color:var(--accent)">${s.problem_title || s.problem}</a></td>
      <td>${getSubmissionBadge(s.status)}</td>
      <td><span class="tag">${s.language}</span></td>
      <td style="color:var(--text-secondary)">${s.runtime}</td>
      <td style="color:var(--text-secondary)">${s.memory}</td>
      <td style="color:var(--text-muted);font-size:0.8rem">${s.created_at ? new Date(s.created_at).toLocaleString() : s.time}</td>
    </tr>`).join('');
}

// ===== CONTESTS PAGE =====
function initContestsPage() {
  // TODO: GET /api/contests
  ['upcoming', 'ongoing', 'past'].forEach(type => {
    const el = document.getElementById(`${type}-contests`);
    if (!el) return;
    const list = DUMMY_CONTESTS.filter(c => c.status === type);
    el.innerHTML = list.map(c => {
      const pillClass = { upcoming: 'pill-upcoming', ongoing: 'pill-ongoing', past: 'pill-past' }[c.status];
      const pillLabel = { upcoming: 'Upcoming', ongoing: 'Live', past: 'Ended' }[c.status];
      const liveDot = c.status === 'ongoing' ? '<span class="live-dot"></span>' : '';
      return `
      <div class="contest-card">
        <div class="contest-status-pill ${pillClass}">${liveDot}${pillLabel}</div>
        <div class="contest-name">${c.name}</div>
        <div class="contest-meta">
          <span class="contest-meta-item"><span class="contest-meta-icon">Cal</span>${formatDate(c.start)}</span>
          <span class="contest-meta-item">${c.duration}</span>
          <span class="contest-meta-item">${c.problems} problems</span>
          ${c.participants > 0 ? `<span class="contest-meta-item">${c.participants.toLocaleString()} registered</span>` : ''}
        </div>
        ${c.status === 'upcoming' ? `<div class="countdown-text" id="cd-${c.id}">Starts in ${getCountdown(c.start)}</div>` : ''}
        <div style="margin-top:1rem;display:flex;gap:0.6rem">
          ${c.status === 'upcoming' ? `<button class="btn btn-primary btn-sm" onclick="registerContest(${c.id})">Register</button>` : ''}
          ${c.status === 'ongoing'  ? `<button class="btn btn-success btn-sm" onclick="enterContest(${c.id})">Enter Contest</button>` : ''}
          ${c.status === 'past'     ? `<button class="btn btn-ghost btn-sm">View Results</button>` : ''}
          <button class="btn btn-ghost btn-sm">Details</button>
        </div>
      </div>`}).join('');
  });

  setInterval(() => {
    DUMMY_CONTESTS.filter(c => c.status === 'upcoming').forEach(c => {
      const el = document.getElementById(`cd-${c.id}`);
      if (el) el.textContent = `Starts in ${getCountdown(c.start)}`;
    });
  }, 60000);
}

window.registerContest = (id) => {
  const btn = event.target;
  btn.textContent = "Registered ✓";
  btn.classList.remove('btn-primary');
  btn.classList.add('btn-success');
  btn.disabled = true;
};
window.enterContest = (id) => {
  const btn = event.target;
  btn.textContent = "Loading Environment...";
  setTimeout(() => window.location.href = 'problems.html', 1000);
};

// ===== DASHBOARD =====
function initDashboard() {
  // TODO: GET /api/user/stats
  renderHeatmap();
  renderMiniCharts();
}

function renderHeatmap() {
  const el = document.getElementById('heatmap');
  if (!el) return;
  const levels = ['', 'l1', 'l2', 'l3', 'l4'];
  let html = '';
  for (let i = 0; i < 364; i++) {
    const r = Math.random();
    const lvl = r > 0.85 ? 'l4' : r > 0.7 ? 'l3' : r > 0.55 ? 'l2' : r > 0.4 ? 'l1' : '';
    html += `<div class="heatmap-cell ${lvl}" title="Day ${i+1}"></div>`;
  }
  el.innerHTML = html;
}

function renderMiniCharts() {
  const el = document.getElementById('mini-chart');
  if (!el) return;
  const vals = [20, 45, 30, 60, 40, 80, 55, 70, 90, 65, 85, 100];
  el.innerHTML = vals.map(v => `<div class="bar" style="height:${v}%"></div>`).join('');
}

// ===== AUTH FORMS =====
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Initial state
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';

    // Real-time validation
    form.addEventListener('input', () => {
      if (form.checkValidity()) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      showFormMessage('login-msg', 'Logging in...', 'accent');
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          showFormMessage('login-msg', data.error || 'Login failed', 'error');
        } else {
          sessionStorage.setItem('codearena_user', JSON.stringify(data.user));
          sessionStorage.setItem('codearena_token', data.token);
          showFormMessage('login-msg', 'Login successful! Redirecting...', 'success');
          setTimeout(() => window.location.href = 'dashboard.html', 800);
        }
      } catch (err) {
        showFormMessage('login-msg', 'Could not connect to server', 'error');
      }
    });
  }

  // Google / GitHub Auth handler
  document.querySelectorAll('.auth-card .btn-ghost').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const provider = btn.textContent.trim().toLowerCase();
      showFormMessage('login-msg', `Simulating ${provider} login...`, 'accent');
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/mock-oauth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          showFormMessage('login-msg', data.error || 'Login failed', 'error');
        } else {
          sessionStorage.setItem('codearena_user', JSON.stringify(data.user));
          sessionStorage.setItem('codearena_token', data.token);
          showFormMessage('login-msg', `${provider} login successful! Redirecting...`, 'success');
          setTimeout(() => window.location.href = 'dashboard.html', 800);
        }
      } catch (err) {
        showFormMessage('login-msg', 'Could not connect to server', 'error');
      }
    });
  });
}

function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Initial state
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.5';
    submitBtn.style.cursor = 'not-allowed';

    // Real-time validation
    form.addEventListener('input', () => {
      const pw = document.getElementById('password').value;
      const cpw = document.getElementById('confirm-password').value;
      
      if (form.checkValidity() && pw === cpw) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
        document.getElementById('signup-msg').style.display = 'none';
      } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';
        
        // Show subtle error if passwords don't match
        if (pw && cpw && pw !== cpw) {
           showFormMessage('signup-msg', 'Passwords do not match', 'error');
        } else {
           document.getElementById('signup-msg').style.display = 'none';
        }
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirm = document.getElementById('confirm-password').value;
      
      if (password !== confirm) {
        return showFormMessage('signup-msg', 'Passwords do not match.', 'error');
      }
      
      showFormMessage('signup-msg', 'Creating account...', 'accent');
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          showFormMessage('signup-msg', data.error || 'Signup failed', 'error');
        } else {
          sessionStorage.setItem('codearena_user', JSON.stringify(data.user));
          sessionStorage.setItem('codearena_token', data.token);
          showFormMessage('signup-msg', 'Account created! Redirecting...', 'success');
          setTimeout(() => window.location.href = 'dashboard.html', 800);
        }
      } catch (err) {
        showFormMessage('signup-msg', 'Could not connect to server', 'error');
      }
    });
  }

  // Google / GitHub Auth handler
  document.querySelectorAll('.auth-card .btn-ghost').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const provider = btn.textContent.trim().toLowerCase();
      showFormMessage('signup-msg', `Simulating ${provider} signup...`, 'accent');
      
      try {
        const response = await fetch('http://localhost:5000/api/auth/mock-oauth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ provider })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          showFormMessage('signup-msg', data.error || 'Signup failed', 'error');
        } else {
          sessionStorage.setItem('codearena_user', JSON.stringify(data.user));
          sessionStorage.setItem('codearena_token', data.token);
          showFormMessage('signup-msg', `${provider} signup successful! Redirecting...`, 'success');
          setTimeout(() => window.location.href = 'dashboard.html', 800);
        }
      } catch (err) {
        showFormMessage('signup-msg', 'Could not connect to server', 'error');
      }
    });
  });
}

function showFormMessage(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'error' ? 'var(--red)' : type === 'success' ? 'var(--green)' : 'var(--accent)';
  el.style.display = 'block';
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const navEl = document.getElementById('navbar');
  const footerEl = document.getElementById('footer');
  if (navEl) renderNavbar(navEl);
  if (footerEl) renderFooter(footerEl);

  const page = window.location.pathname.split('/').pop();
  if (page === 'problems.html') initProblemsPage();
  if (page === 'problem.html') { initProblemPage(); initTabs(); initLanguageSelector(); initCodeActions(); initAIHint(); }
  if (page === 'leaderboard.html') initLeaderboard();
  if (page === 'submissions.html') initSubmissionsPage();
  if (page === 'contests.html') initContestsPage();
  if (page === 'dashboard.html') initDashboard();
  if (page === 'login.html') initLoginForm();
  if (page === 'signup.html') initSignupForm();
});
