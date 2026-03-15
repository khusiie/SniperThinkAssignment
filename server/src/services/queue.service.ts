import { Queue } from 'bullmq';
import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const isUpstash = redisUrl.includes('upstash.io') || redisUrl.startsWith('rediss://');

if (!process.env.REDIS_URL) {
  console.warn('⚠️ REDIS_URL not found in environment. Falling back to localhost.');
}

const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false, // Recommended for Upstash/Serverless Redis
  keepAlive: 10000,
  connectTimeout: 10000, // 10 second timeout for initial connection
  tls: isUpstash ? { rejectUnauthorized: false } : undefined,
  retryStrategy(times) {
    if (times > 10) {
      console.error('❌ REDIS CRITICAL FAILURE: Could not connect after 10 attempts.');
      return null; // Stop retrying
    }
    return Math.min(times * 50, 2000);
  },
});

connection.on('error', (err) => {
  console.error('❌ REDIS ERROR:', err.message);
});

connection.on('connect', () => {
  console.log('✅ Connected to Redis');
});

export const fileQueue = new Queue('file-processing', { connection: connection as any });

fileQueue.on('error', (err) => {
  // Silent handler: BullMQ handles internal resets.
});

export const addFileJob = async (jobId: string, filePath: string) => {
  console.log(`🔄 [Queue] Attempting to add process-file job for jobId: ${jobId}`);
  try {
    await fileQueue.add('process-file', { jobId, filePath }, {
      jobId: jobId, // Use database job ID as BullMQ job ID
      removeOnComplete: true,
      removeOnFail: false,
    });
    console.log('✅ [Queue] Job successfully added to BullMQ');
  } catch (err: any) {
    console.error('❌ [Queue] Failed to add job to BullMQ:', err.message);
    throw err;
  }
};
