import { Queue } from 'bullmq';
export declare const fileQueue: Queue<any, any, string, any, any, string>;
export declare const addFileJob: (jobId: string, filePath: string) => Promise<void>;
//# sourceMappingURL=queue.service.d.ts.map