"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFileJob = exports.fileQueue = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const connection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});
exports.fileQueue = new bullmq_1.Queue('file-processing', { connection: connection });
const addFileJob = async (jobId, filePath) => {
    await exports.fileQueue.add('process-file', { jobId, filePath }, {
        jobId: jobId, // Use database job ID as BullMQ job ID
        removeOnComplete: true,
        removeOnFail: false,
    });
};
exports.addFileJob = addFileJob;
//# sourceMappingURL=queue.service.js.map