
import { Worker, Job as BullJob } from 'bullmq';
import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const { PDFParse } = require('pdf-parse');

const prisma = new PrismaClient();

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  keepAlive: 10000,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

connection.on('error', (err) => {
  console.warn('Redis Connection (Worker) - Optional reset:', err.message);
});

const worker = new Worker(
  'file-processing',
  async (bullJob: BullJob) => {
    const { jobId, filePath } = bullJob.data;
    const absolutePath = path.resolve(filePath);

    try {
      // 1️Update job status to PROCESSING
      await prisma.job.update({
        where: { id: jobId },
        data: { status: 'PROCESSING', progress: 10 },
      });

      // 2️Read the uploaded file
      const dataBuffer = await fs.readFile(absolutePath);
      let text = '';

      // 3️ Parse PDF or treat as text
      if (filePath.toLowerCase().endsWith('.pdf')) {
        const parser = new PDFParse({ data: dataBuffer });
        const pdfData = await parser.getText();
        text = pdfData.text;
      } else {
        text = dataBuffer.toString();
      }

      // Debug (optional)
      console.log(`Extracted text length: ${text.length}`);

      await prisma.job.update({
        where: { id: jobId },
        data: { progress: 50 },
      });

      // 4️ Process the text
      const words = text.split(/\s+/).filter((w) => w.length > 0);
      const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);

      // 5️ Extract keywords (top 5 frequent words > 4 chars)
      const wordFreq: Record<string, number> = {};

      words.forEach((w) => {
        const clean = w.toLowerCase().replace(/[^a-z]/g, '');
        if (clean.length > 4) {
          wordFreq[clean] = (wordFreq[clean] || 0) + 1;
        }
      });

      const keywords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map((pair) => pair[0]);

      // 6️ Save results + mark job completed
      await prisma.$transaction([
        prisma.result.create({
          data: {
            jobId: jobId,
            wordCount: words.length,
            paragraphCount: paragraphs.length,
            keywords: keywords,
          },
        }),
        prisma.job.update({
          where: { id: jobId },
          data: {
            status: 'COMPLETED',
            progress: 100,
          },
        }),
      ]);

      console.log(`[Worker] Job ${jobId} completed successfully`);
    } catch (error: any) {
      console.error(`[Worker] Job ${jobId} failed:`, error);

      await prisma.job.update({
        where: { id: jobId },
        data: { status: 'FAILED' },
      });
      throw error;
    }
  },
  {
    connection: connection as any,
    concurrency: 5, // Process up to 5 jobs simultaneously
    skipVersionCheck: true
  }
);

console.log('Worker started listening for jobs...');

export default worker;