import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import uploadRoutes from './routes/upload.routes';
import './workers/file.worker'; // Start the worker
import fs from 'fs';
import path from 'path';

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use('/api', uploadRoutes);

// Health Check for Render Connection Diagnostics
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', serverTime: new Date().toISOString() });
});

app.get('/api/ping', (req, res) => {
  res.status(200).send('pong');
});

// Part 1: Simple Interest API
app.post('/api/interest', async (req, res) => {
  const { name, email, step } = req.body;

  if (!name || !email || !step) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const interest = await prisma.interest.create({
      data: { name, email, step }
    });

    res.status(200).json({ message: 'Interest recorded successfully', id: interest.id });
  } catch (error: any) {
    console.error('Interest Error:', error);
    res.status(500).json({ error: 'Failed to record interest' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
