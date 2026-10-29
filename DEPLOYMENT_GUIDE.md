# 🚀 Campus Relay — Deployment Guide

This guide explains how to deploy the entire full-stack **Campus Relay** application (MongoDB + Express Backend + React Frontend) completely **free of cost** using industry standard platforms:

| Component | Platform | Free Tier Highlights |
| :--- | :--- | :--- |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | 512 MB storage, always free M0 cluster |
| **Backend API** | [Render](https://render.com) (or [Railway](https://railway.app)) | Free web service, automatic HTTPS, continuous deployment |
| **Frontend UI** | [Vercel](https://vercel.com) (or [Netlify](https://netlify.com)) | Global CDN, instant builds, automatic SSL, custom domains |

---

## 📋 Pre-Flight Checklist

1. Push your code to a **GitHub repository** (e.g. `your-username/campus-relay`).
   ```bash
   cd /path/to/campus-relay
   git init
   git add .
   git commit -m "Initial commit: Campus Relay MERN stack"
   git branch -M main
   git remote add origin https://github.com/<your-username>/campus-relay.git
   git push -u origin main
   ```

---

## 🗄️ Step 1: Set Up Free Cloud MongoDB (MongoDB Atlas)

1. Go to **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)** and sign in / sign up.
2. Click **Create Deployment** → Select the **M0 Free** cluster tier (Free Forever).
3. Under **Security Quickstart**:
   - Create a database user (e.g., username `admin`, password `your-strong-password`).
   - Under **IP Access List**, click **Allow Access from Anywhere** (`0.0.0.0/0`) so your cloud backend can connect.
4. Click **Connect** → **Drivers** (Node.js) → Copy the connection string.
   It looks like:
   ```text
   mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/campus_relay?retryWrites=true&w=majority
   ```
   *(Replace `<password>` with your actual password and ensure `/campus_relay` is the database name).*

---

## ⚙️ Step 2: Deploy the Backend API (on Render)

1. Go to **[render.com](https://render.com)** and sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Connect your `campus-relay` GitHub repository.
4. Configure the service settings:
   - **Name:** `campus-relay-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`
5. Scroll down to **Environment Variables** and add:
   - `MONGODB_URI`: *Your MongoDB Atlas connection string from Step 1*
   - `JWT_SECRET`: *A random string (e.g. `campus_relay_super_secret_jwt_key_2024`)*
   - `PORT`: `10000` *(or leave blank; Render provides port automatically)*
   - `NODE_ENV`: `production`
6. Click **Create Web Service**.
   Render will deploy your backend in ~2 minutes and give you a public URL like:
   `https://campus-relay-api.onrender.com`
7. **Verify Backend Health**:
   Open `https://campus-relay-api.onrender.com/api/health` in your browser. You should see:
   `{"status":"ok", ...}`

---

## 💻 Step 3: Deploy the Frontend (on Vercel)

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **Add New...** → **Project** → Import your `campus-relay` repository.
3. Configure the project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** click `Edit` and select `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Expand **Environment Variables** and add:
   - `VITE_API_BASE_URL`: *Your Render backend URL with `/api`*  
     Example: `https://campus-relay-api.onrender.com/api`
5. Click **Deploy**.
   Vercel will build and launch your site in ~45 seconds, providing a global URL like:
   `https://campus-relay.vercel.app`

*(Note: `frontend/vercel.json` is already included to ensure React Router sub-pages like `/register` and `/admin` reload seamlessly).*

---

## 🌱 Step 4: Seed the Deployed Database with Initial Data

You can seed the remote MongoDB Atlas database with the admin user (`admin` / `campusrelay2024`), campus captains, and sample realistic registrations directly from your computer:

```bash
cd /path/to/campus-relay/backend
MONGODB_URI="mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/campus_relay?retryWrites=true&w=majority" npm run seed
```

This populates your live database instantly!

---

## 🔐 Production Portals & URLs

- **Student Workshop Landing Page:** `https://your-app.vercel.app`
- **Direct Registration Link:** `https://your-app.vercel.app/register`
- **Captain Attribution Links:** `https://your-app.vercel.app/?ref=CC-CBIT01`
- **Organizer / Evaluator Portal:** `https://your-app.vercel.app/admin/login`
  - **Username:** `admin`
  - **Password:** `campusrelay2024`
