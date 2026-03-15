import { Queue } from 'bullmq';
import Redis from 'ioredis';

const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
  keepAlive: 10000,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

connection.on('error', (err) => {
  console.error('Redis Connection Error (Queue):', err.message);
});

export const fileQueue = new Queue('file-processing', { connection: connection as any });

export const addFileJob = async (jobId: string, filePath: string) => {
  await fileQueue.add('process-file', { jobId, filePath }, {
    jobId: jobId, // Use database job ID as BullMQ job ID
    removeOnComplete: true,
    removeOnFail: false,
  });
};
