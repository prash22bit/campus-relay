# ⚡ Campus Relay — Full-Stack Growth & Registration Engine

> **NxtWave Growth Intern Challenge: 500 Confirmed Registrations in 7 Days**  
> Built according to the comprehensive Growth Research, Tactical Playbook, and Technical Blueprint.

---

## 🌟 Executive Summary

**Campus Relay** is a production-grade, full-stack web application and growth operating system designed to acquire **500 qualified engineering student registrations** in 7 days for the hands-on workshop:  
👉 **"Build Your First AI Project in 60 Minutes"**

The system solves the core challenge of low-trust campus distribution through a decentralized **Campus Captain network**, an incentivized **peer-referral loop**, real-time validation, and an executive **Growth Analytics Dashboard**.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, React Router 6, Recharts, Lucide Icons, React Hot Toast | Responsive, high-conversion UI, interactive charts, real-time code validation |
| **Backend** | Node.js, Express.js, Mongoose, JWT, Nanoid, Express-Validator, Nodemailer | RESTful API, rate-limiting, attribution tracking, deduplication, CSV export |
| **Database** | MongoDB (Local / Atlas) | Relational attribution models: Students, Captains, Admins |
| **Styling** | Custom Design Tokens (Vanilla CSS / Inter & Plus Jakarta Sans) | Dark-mode glassmorphic aesthetics, mobile-first responsive layout |

---

## 🌟 Experience Architecture: Student-Facing vs. Organizer Portal

### 1. 🎓 Student Experience (`/`, `/register`) — 100% End-User Focused
When an engineering student clicks an Instagram ad, WhatsApp broadcast, or campus poster:
- **Zero internal marketing jargon:** No mentions of growth models, ₹2,000 budgets, 500-seat targets, or marketer sprint cadences.
- **High-Impact Workshop Details:** Clear session value proposition (*"Build Your First AI Project in 60 Minutes"*), 📅 Date & Time (Saturday 7:00 PM IST), ⏱️ 60-min hands-on lab, 💻 In-browser sandbox, 🎓 Verified NxtWave Certificate, and 💸 100% Free Pass.
- **What You'll Actually Build:** Live project breakdown (Connect AI APIs, Prompt Engineering, Streaming UI, 1-Click Cloud Deployment).
- **Instant Registration & Confirmation:** Fast form with real-time referral detection (`CC-` captain codes or `CR-` peer codes).
- **Student-Led Viral Incentive:** *"Invite 2 Classmates & Unlock the AI Developer Starter Pack (Prompt Engineering Toolkit + Complete GitHub Source Code)"* with a 1-click WhatsApp share button.

### 2. 📊 Internal Organizer & Growth Strategy Portal (`/admin/dashboard`)
Designed specifically for NxtWave organizers and challenge evaluators:
- **Executive KPIs:** Live registration velocity, goal progress, channel attribution mix, and branch distribution charts.
- **Searchable Registrations & CSV Export:** Complete student database with 1-click UTF-8 BOM CSV export.
- **Campus Captain Manager:** Onboard, assign targets, and track registrations across colleges.
- **Growth Strategy & Budget Tab:** The complete 500-student tactical playbook, 7-day operating cadence, ₹2,000 budget breakdown, and AI learning reflection notes.

### 3. 📈 Executive Admin & Growth Analytics (`/admin/dashboard`)
- **Real-Time KPIs:** Total registrations, progress against 500-seat goal, viral multiplier, active captains.
- **Interactive Visualizations:**
  - 7-Day Registration Velocity (Daily Trend Bar Chart)
  - Acquisition Channel Mix (Attribution Pie Chart)
  - Engineering Branch Distribution (CSE, IT, AI/DS, ECE, EEE, etc.)
- **Captain Management Console:** Add new campus captains, track individual conversion rates, set targets, or deactivate.
- **Searchable Student Registry:** Real-time filtering by source, branch, college, or search query.
- **1-Click CSV Export:** Excel-compatible UTF-8 BOM CSV download for CRM and workshop communications.

---

## ⚡ Quick Start & Run Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB running locally on `localhost:27017` (or remote URI in `.env`)

### 1. Installation
Run from root to install both backend and frontend dependencies:
```bash
npm run install:all
```

### 2. Database Seeding
Seed the initial admin credentials, campus captains, and realistic historical registration data:
```bash
npm run seed --prefix backend
```

### 3. Run Development Servers
Start both backend (port 5001) and frontend (port 3000) concurrently:
```bash
npm run dev
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5001/api](http://localhost:5001/api)
- **Health Check:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🔐 Default Credentials

| Portal | URL | Username | Password |
| :--- | :--- | :--- | :--- |
| **Admin Dashboard** | [http://localhost:3000/admin/login](http://localhost:3000/admin/login) | `admin` | `campusrelay2024` |

---

## 📡 Key API Routes

### Public Routes
- `POST /api/register`: Submit registration with referral attribution and email dispatch.
- `GET /api/register/validate-code/:code`: Instant validation of captain (`CC-`) or peer (`CR-`) codes.
- `GET /api/health`: Health status and uptime check.

### Admin Routes (Protected via Bearer JWT)
- `POST /api/admin/login`: Authenticate admin and issue 24h JWT.
- `GET /api/admin/dashboard`: Aggregate KPI metrics, daily velocity, channel distribution, and branch data.
- `GET /api/admin/registrations`: Paginated, searchable student registration registry.
- `GET /api/admin/export`: Stream complete registration database as CSV.
- `GET /api/admin/captains`: List active campus captains and their real-time performance.
- `POST /api/admin/captains`: Onboard a new campus captain and generate unique code.
- `DELETE /api/admin/captains/:id`: Soft-deactivate a campus captain.
