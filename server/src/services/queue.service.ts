import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  enableReadyCheck: false, // Recommended for Upstash/Serverless Redis
  keepAlive: 10000,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

connection.on('error', (err) => {
  // Use warn instead of error to avoid scary red logs on Render dashboard
  console.warn('Redis Connection (Queue) - Optional reset:', err.message);
});

export const fileQueue = new Queue('file-processing', { connection: connection as any });

export const addFileJob = async (jobId: string, filePath: string) => {
  await fileQueue.add('process-file', { jobId, filePath }, {
    jobId: jobId, // Use database job ID as BullMQ job ID
    removeOnComplete: true,
    removeOnFail: false,
  });
};
