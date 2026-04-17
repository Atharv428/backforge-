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

function renderNavbar(container) {
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
        <a href="login.html" class="btn btn-ghost btn-sm">Log in</a>
        <a href="signup.html" class="btn btn-primary btn-sm">Sign up</a>
      </div>
    </nav>`;
  setActiveNav();
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
  fetch('/api/problems')
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

  fetch('/api/problems')
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
    submitBtn.addEventListener('click', () => {
      // TODO: POST /api/submit-code
      output.innerHTML = '<span class="out-info">Submitting solution...</span>';
      setTimeout(() => {
        output.innerHTML = `
          <span class="out-success">Accepted</span><br>
          <span class="out-info">Runtime: 52ms (beats 87.3%) · Memory: 14.2 MB (beats 72.1%)</span><br>
          <span class="out-info">All 57 test cases passed.</span>`;
      }, 1200);
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

  function loadAndShowHint() {
    fetch('/api/ai/hint')
      .then(r => r.json())
      .then(hints => {
        hintText.textContent = hints[Math.floor(Math.random() * hints.length)];
      });
  }

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    if (panel.classList.contains('open')) {
      loadAndShowHint();
    }
  });

  if (newHintBtn) {
    newHintBtn.addEventListener('click', () => {
      loadAndShowHint();
    });
  }

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== btn) panel.classList.remove('open');
  });
}

// ===== LEADERBOARD =====
function initLeaderboard() {
  const tbody = document.getElementById('leaderboard-tbody');
  if (!tbody) return;
  fetch('/api/leaderboard')
    .then(r => r.json())
    .then(users => {
      tbody.innerHTML = users.map(u => {
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
            <td style="color:var(--accent);font-weight:600;font-variant-numeric:tabular-nums">${u.points.toLocaleString()}</td>
            <td>
              <div class="rating-display">
                <div class="rating-bar-track"><div class="rating-bar-fill" style="width:${barWidth}px"></div></div>
                <span style="font-weight:700;color:var(--purple);font-variant-numeric:tabular-nums">${u.rating}</span>
              </div>
            </td>
          </tr>`;
      }).join('');
    });
}

// ===== SUBMISSIONS PAGE =====
function initSubmissionsPage() {
  const tbody = document.getElementById('submissions-tbody');
  if (!tbody) return;
  fetch('/api/submissions')
    .then(r => r.json())
    .then(submissions => {
      tbody.innerHTML = submissions.map(s => `
        <tr>
          <td><a href="problem.html?id=${s.problemId}" style="color:var(--accent)">${s.problem}</a></td>
          <td>${getSubmissionBadge(s.status)}</td>
          <td><span class="tag">${s.language}</span></td>
          <td style="color:var(--text-secondary)">${s.runtime}</td>
          <td style="color:var(--text-secondary)">${s.memory}</td>
          <td style="color:var(--text-muted);font-size:0.8rem">${s.time}</td>
        </tr>`).join('');
    });
}

// ===== CONTESTS PAGE =====
function initContestsPage() {
  fetch('/api/contests')
    .then(r => r.json())
    .then(contests => renderContests(contests))
    .catch(err => {
      console.error('Failed to load contests:', err);
      // Fallback or display error message
    });
}

function renderContests(contests) {
  ['upcoming', 'ongoing', 'past'].forEach(type => {
    const el = document.getElementById(`${type}-contests`);
    if (!el) return;
    const list = contests.filter(c => c.status === type);
    
    if (list.length === 0) {
      if (type === 'ongoing') {
        el.innerHTML = '<div style="color:var(--text-muted);font-size:0.875rem;padding:1rem 0">No contests running right now.</div>';
      } else {
        el.innerHTML = '<div style="color:var(--text-muted);font-size:0.875rem;padding:1rem 0">No contests available.</div>';
      }
      return;
    }

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
          ${c.status === 'upcoming' ? (c.registered ? `<button class="btn btn-success btn-sm" style="opacity:0.8;cursor:default" disabled>Registered</button>` : `<button class="btn btn-primary btn-sm" onclick="registerContest(${c.id}, '${c.name}')">Register</button>`) : ''}
          ${c.status === 'ongoing'  ? `<button class="btn btn-success btn-sm" onclick="enterContest(${c.id}, '${c.name}')">Enter Contest</button>` : ''}
          ${c.status === 'past'     ? `<button class="btn btn-ghost btn-sm" onclick="window.location.href='contest.html?id=${c.id}'">View Results</button>` : ''}
          <button class="btn btn-ghost btn-sm" onclick="window.location.href='contest.html?id=${c.id}'">Details</button>
        </div>
      </div>`}).join('');
  });

  setInterval(() => {
    contests.filter(c => c.status === 'upcoming').forEach(c => {
      const el = document.getElementById(`cd-${c.id}`);
      if (el) el.textContent = `Starts in ${getCountdown(c.start)}`;
    });
  }, 60000);
}

window.registerContest = (id, name) => {
  fetch(`/api/contests/${id}/register`, { method: 'POST' })
    .then(r => r.json())
    .then(res => {
      if (res.success) {
        alert('Successfully registered! Redirecting to LeetCode...');
        if (window.location.pathname.endsWith('contests.html')) {
          initContestsPage();
        } else if (window.location.pathname.endsWith('contest.html')) {
          initContestDetailPage();
        }
        if (name) {
          const slug = name.toLowerCase().replace(/ /g, '-');
          window.open(`https://leetcode.com/contest/${slug}/`, '_blank');
        }
      } else {
        alert(res.message || 'Failed to register');
      }
    })
    .catch(err => alert('Error registering: ' + err));
};

window.enterContest = (id, name) => {
  if (name) {
    const slug = name.toLowerCase().replace(/ /g, '-');
    window.open(`https://leetcode.com/contest/${slug}/`, '_blank');
  } else {
    window.location.href = `contest.html?id=${id}`;
  }
};

// ===== CONTEST DETAIL PAGE =====
function initContestDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (!id) return;

  fetch(`/api/contests/${id}`)
    .then(r => r.json())
    .then(contest => {
      if (contest.success === false) return;
      document.title = `${contest.name} - CodeArena`;
      document.getElementById('contest-title').textContent = contest.name;
      document.getElementById('contest-time').textContent = `Starts: ${formatDate(contest.start)} · Duration: ${contest.duration}`;
      
      if (contest.status === 'upcoming') {
        document.getElementById('contest-countdown').textContent = `Starts in ${getCountdown(contest.start)}`;
      } else if (contest.status === 'ongoing') {
        document.getElementById('contest-countdown').textContent = `Live Now`;
      } else {
        document.getElementById('contest-countdown').textContent = `Ended`;
      }
      
      document.getElementById('contest-participants').textContent = `${contest.participants.toLocaleString()} participants`;

      const actionsEl = document.getElementById('contest-actions');
      if (contest.status === 'upcoming') {
        if (contest.registered) {
          actionsEl.innerHTML = `<button class="btn btn-success" disabled style="opacity:0.8;cursor:default">Registered ✓</button>`;
        } else {
          actionsEl.innerHTML = `<button class="btn btn-primary" onclick="registerContest(${contest.id}, '${contest.name}')">Register</button>`;
        }
      } else if (contest.status === 'ongoing') {
        actionsEl.innerHTML = `<button class="btn btn-success" onclick="enterContest(${contest.id}, '${contest.name}')">Enter Contest</button>`;
      }

      const tbody = document.getElementById('contest-problems-tbody');
      if (contest.problem_list) {
        tbody.innerHTML = contest.problem_list.map(p => `
          <tr>
            <td>${getStatusIcon(p.status)}</td>
            <td><a href="problem.html?id=${p.id}" class="problem-title-link">${p.id}. ${p.title}</a></td>
            <td><span class="badge badge-${getDifficultyClass(p.difficulty)}">${p.difficulty}</span></td>
            <td class="acceptance">${p.acceptance}%</td>
          </tr>`).join('');
      }
    })
    .catch(err => console.error(err));
}

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
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // TODO: POST /api/auth/login { email, password }
    console.log('Login attempt:', { email });
    showFormMessage('login-msg', 'Backend not connected. Implement POST /api/auth/login', 'info');
  });
}

function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm-password').value;
    if (password !== confirm) {
      showFormMessage('signup-msg', 'Passwords do not match.', 'error');
      return;
    }
    // TODO: POST /api/auth/signup { username, email, password }
    console.log('Signup attempt:', { username, email });
    showFormMessage('signup-msg', 'Backend not connected. Implement POST /api/auth/signup', 'info');
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
  if (page === 'contest.html') initContestDetailPage();
  if (page === 'dashboard.html') initDashboard();
  if (page === 'login.html') initLoginForm();
  if (page === 'signup.html') initSignupForm();
});
