import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import uploadRoutes from './routes/upload.routes';
import './workers/file.worker'; // Start the worker

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('SniperThink Backend is Running');
});

app.use('/api', uploadRoutes);

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
