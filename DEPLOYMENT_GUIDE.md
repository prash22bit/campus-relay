# 🚀 Campus Relay — All-in-One Vercel Deployment Guide

Deploy **both the React Frontend and Express Backend together on Vercel** in a single project with **zero CORS issues** and **zero extra servers**!

---

## 🏗️ Architecture on Vercel

```text
campus-relay.vercel.app
 ├── / (and all client routes) ──► React Vite Frontend (Static CDN)
 └── /api/*                    ──► Express REST API (Vercel Serverless Function)
```

- **Frontend & Backend share the exact same domain** — zero CORS configuration needed!
- **Database:** Free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) M0 cluster.

---

## 🗄️ Step 1: Create Free Cloud MongoDB (MongoDB Atlas)

1. Go to **[mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)** and sign in.
2. Click **Create** → Select the **M0 Free** cluster tier (Free Forever).
3. Under **Security Quickstart**:
   - Create a username and password (e.g. `admin` and `your-password`).
   - Under **Network Access / IP Access List**, click **Allow Access from Anywhere** (`0.0.0.0/0`).
4. Click **Connect** → **Drivers** (Node.js) → Copy the connection URI:
   ```text
   mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/campus_relay?retryWrites=true&w=majority
   ```
   *(Be sure to replace `<password>` with your actual database password).*

---

## ⚡ Step 2: Deploy Both Frontend & Backend on Vercel

1. Go to **[vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **Add New...** → **Project**.
3. Select your repository: **`prash22bit/campus-relay`**.
4. Keep the **Root Directory** as default (`.` or leave as root).
5. Vercel automatically detects the root `vercel.json` and build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `frontend/dist`
6. Expand **Environment Variables** and add:
   | Variable | Value |
   | :--- | :--- |
   | `MONGODB_URI` | *Your MongoDB Atlas connection URI from Step 1* |
   | `JWT_SECRET` | `campus_relay_super_secret_jwt_key_2024` |
   | `NODE_ENV` | `production` |
7. Click **Deploy**!

Vercel will build the frontend, deploy the serverless Express API function, and provide your live URL in ~60 seconds:
👉 **`https://campus-relay.vercel.app`**

---

## 🧪 Step 3: Test Your Deployed Application

Once deployed, you can verify everything immediately:

1. **Check Backend API Health**:
   Open: `https://<YOUR-VERCEL-DOMAIN>/api/health`  
   Returns: `{"status":"ok", ...}`

2. **Check Student Workshop Landing Page**:
   Open: `https://<YOUR-VERCEL-DOMAIN>/`  
   Renders the full student workshop page with interactive live lab details and instant registration.

3. **Check Student Registration**:
   Register a test participant. It immediately returns their personal invite code and 1-click WhatsApp share button!

4. **Seed Deployed Database (Initial 6 Captains + Demo Registrations)**:
   From your local terminal:
   ```bash
   cd /path/to/campus-relay
   MONGODB_URI="your_mongodb_atlas_connection_string" npm run seed
   ```

5. **Log in to Admin Dashboard**:
   Open: `https://<YOUR-VERCEL-DOMAIN>/admin/login`  
   - **Username:** `admin`  
   - **Password:** `campusrelay2024`  
   View real-time charts, registrations table, captain leaderboard, and export CSV!
