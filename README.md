# SniperThink - Distributed File Processing System

A premium, high-performance file processing system built with React, Node.js, and a distributed job queue architecture.

 **Live Site**: [https://sniperthinkassignment.onrender.com/](https://sniperthinkassignment.onrender.com/)

---

## Key Features
- **Neural Document Processing**: Asynchronous file analysis (PDF/TXT) using BullMQ workers.
- **Distributed Queue**: Scalable job management via Upstash Redis.
- **Managed Auth & DB**: PostgreSQL hosted on Supabase (Prisma ORM).
- **Elite UI**: High-fidelity dark-mode interface with Framer Motion animations.
- **Health Diagnostics**: Real-time connection status monitoring in the UI.

---

##  Stack
- **Frontend**: React, Vite, Framer Motion, Lucide Icons, Vanilla CSS (Elite Aesthetics).
- **Backend**: Node.js, Express, TypeScript, Multer.
- **Message Broker**: Redis (via Upstash).
- **Database**: PostgreSQL (via Supabase).
- **ORM**: Prisma.

---

##  Deployment Guide (Render)

### 1. Database (Supabase)
- Create a project on [Supabase](https://supabase.com/).
- Copy the **Connection String** (Transaction mode recommended).

### 2. Redis (Upstash)
- Create a Redis instance on [Upstash](https://upstash.com/).
- **Critical**: Ensure TLS is enabled. Use the provided `rediss://` URL.

### 3. Backend Deployment (Render)
- Create a **Web Service** pointing to the `/server` folder.
- **Build Command**: `npm install && npx prisma generate && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `DATABASE_URL`: Your Supabase connection string.
  - `REDIS_URL`: Your Upstash Redis URL (starts with `rediss://`).
  - `FRONTEND_URL`: `https://sniperthinkassignment.onrender.com`
  - `PORT`: `10000`

### 4. Frontend Deployment (Render)
- Create a **Static Site** pointing to the `/client` folder.
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Your backend service URL (e.g. `https://sniper-kwf7.onrender.com`).

---

## 💻 Local Setup

1. **Clone the Repo**
2. **Setup Backend**
   ```bash
   cd server
   npm install
   npx prisma generate
   npm run dev
   ```
3. **Setup Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

---

##  Environment Variables Summary

| Variable | Service | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | Backend | Supabase PostgreSQL connection |
| `REDIS_URL` | Backend | Upstash Redis connection (with TLS) |
| `FRONTEND_URL` | Backend | CORS security (Restricts API access) |
| `VITE_API_URL` | Frontend | Targeted Backend API URL |

---

##  API Documentation
Detailed endpoint specifications can be found in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).
