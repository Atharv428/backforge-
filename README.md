<div align="center">
  <img src="https://img.icons8.com/nolan/96/code.png" alt="Logo" width="80" height="80">

  # 🚀 CodeArena – The Ultimate Coding Platform
  
  **Empowering developers to code, compete, and conquer.** <br>
  A high-performance, full-stack platform inspired by LeetCode and HackerRank, built explicitly for scale, speed, and competitive programming! 

  [![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)](https://backforge-tau.vercel.app/)
  [![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)](#)
  [![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=nodedotjs&logoColor=white)](#)

  [**View Live Demo**](https://backforge-tau.vercel.app/) • [**Report Bug**](#) • [**Request Feature**](#)
</div>

---

## 🌟 Overview

**CodeArena (BackForge)** is a comprehensive, production-ready coding environment. Unlike static templates, this project operates on a completely functional **Express.js Serverless API** wired up to **Vercel Postgres**, allowing real-world data persistence, user authentication, and dynamic leaderboards.

Whether you're prepping for FAANG interviews or hosting a local coding contest, CodeArena provides a fast, responsive, and gorgeous UI to test your logic.

---

## 🏆 Standout Feature: Dynamic Badge & Goodies System!

We believe in rewarding skill. CodeArena operates an **automated tiering engine** embedded inside its leaderboard to gamify the user experience:

- 🏅 **Badge System:** User ratings dictate their global classification.
  - `< 1200 Rating` ➡️ **Beginner** (Gray)
  - `> 1200 Rating` ➡️ **Knight** (Blue)
  - `> 1600 Rating` ➡️ **Master** (Orange)
  - `> 2100 Rating` ➡️ **Grandmaster** (Red)

- 🎁 **Ranking Goodies:** Physical and digital rewards are algorithmically allocated to the absolute best coders!
  - **Rank 1**: 💻👕 (MacBook + T-Shirt)
  - **Rank 2 & 3**: ⌨️🏷️ (Mechanical Keyboard + Stickers)
  - **Rank 4 to 10**: 👕 (Exclusive T-Shirt)

---

## 🔥 Core Features

* 🔐 **Secure Authentication**: JWT-based authentication with bcrypt-hashed passwords. Fallback safety mechanisms included for seamless Mock OAuth.
* 👨‍💻 **Live Code Editor**: Real-time coding interface spanning multiple languages (Python, JavaScript, C++, Java).
* 📈 **Global Leaderboards**: Real-time algorithmic sorting based on points solved and user ELO rating.
* ⚡ **Serverless Ready**: Backend explicitly restructured and optimized to run blazingly fast on Vercel Edge Networks.
* 🗄️ **PostgreSQL Integration**: Complete schema migration directly inside the backend code to ensure tables are always initialized.

---

## 🏗️ System Architecture

CodeArena utilizes a robust **Client-Serverless Architecture**:

```mermaid
graph LR;
    A[Sleek Frontend UI] -->|RESTful APIs| B(Vercel Serverless Functions)
    B -->|Connection Pool| C[(Vercel Postgres DB)]
    B -->|JWT| D[Auth Module]
```

### 🧰 Tech Stack
* **Frontend**: Vanilla HTML5, CSS3, & precise Vanilla JavaScript. (Zero framework bloat for max performance)
* **Backend**: Node.js & Express API (Refactored for Serverless execution)
* **Database**: Vercel PostgreSQL (`pg` module)
* **Hosting**: Vercel (Edge network routing enabled via `vercel.json`)

---

## 🚀 Quick Start (Local Development)

Want to run this beast locally? 

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Atharv428/backforge-.git
   cd backforge-
   ```
2. **Install modules:**
   ```bash
   npm install
   ```
3. **Configure the Database:**
   Create a `.env` file in the root directory and add your Postgres URI:
   ```env
   DATABASE_URL=postgres://user:password@hostname:5432/dbname
   JWT_SECRET=super_secret_key_123
   ```
4. **Start the engine:**
   ```bash
   npm start
   ```
   *The server will boot up on `http://localhost:5000`.*

---

## 🎉 Why this wins Hackathons

* **Fully Functional Backend**: It isn't just a UI mockup. The Express logic securely handles registration, user scoring, and ranking metrics.
* **Flawless Vercel Deployment**: Configured via a meticulous `vercel.json` and a modularized `api/index.js`, breaking free from standard local-only constraints.
* **Gamification done right**: The "Goodies" and "Badge" feature creates immediate user retention and engagement hooks essential to pitching EdTech products!

<div align="center">
  <br>
  <i>Built to Code. Built to Compete. Built to Win.</i>
</div>
