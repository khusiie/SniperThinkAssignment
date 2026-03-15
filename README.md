# SniperThink Assignment - Setup Instructions

This project consists of a React frontend (Client) and a Node.js/Express backend (Server) with an asynchronous processing system using BullMQ and Redis.

## Prerequisites
- Node.js (v18+)
- Redis (installed and running)
- PostgreSQL (or another database supported by Prisma)

## Project Structure
- `/client`: React + Vite + Tailwind CSS
- `/server`: Node.js + Express + Prisma + BullMQ

---

## Backend Setup (Server)

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the `server` directory:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   REDIS_URL="redis://localhost:6379"
   PORT=5000
   ```

3. **Database Setup**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run the Server**:
   ```bash
   npm run dev
   ```

---

## Frontend Setup (Client)

1. **Install Dependencies**:
   ```bash
   cd client
   npm install
   ```

2. **Run the Frontend**:
   ```bash
   npm run dev
   ```

---

## System Architecture

### Distributed File Processing
- **Multer**: Handles file uploads and enforces a 10MB limit.
- **Prisma**: Managed the PostgreSQL database for storing users, files, and processing results.
- **BullMQ**: Manages the job queue with automatic retries (3 attempts).
- **Redis**: Acts as the message broker for the queue.
- **Worker**: An asynchronous process that parses PDF/TXT files, extracts metadata, and updates the database.

### Concurrency & Scalability
The worker is configured with a concurrency of `5`, allowing it to process multiple files simultaneously.

---

## Troubleshooting
- **Redis Error**: Ensure Redis is running on port 6379.
- **Database Error**: Verify the `DATABASE_URL` in your `.env` file.
- **pdf-parse Error**: Ensure you are using the modern `pdf-parse` (v2.4.5+) which uses the `PDFParse` class.
