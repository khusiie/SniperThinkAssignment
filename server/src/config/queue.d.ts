import { Queue } from 'bullmq';
import IORedis from 'ioredis';
declare const redisConnection: IORedis;
export declare const fileQueue: Queue<any, any, string, any, any, string>;
export { redisConnection };
//# sourceMappingURL=queue.d.ts.map