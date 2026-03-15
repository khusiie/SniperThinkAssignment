"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const client_1 = require("@prisma/client");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const { PDFParse } = require('pdf-parse');
const prisma = new client_1.PrismaClient();
const connection = new ioredis_1.default(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null,
});
const worker = new bullmq_1.Worker('file-processing', async (bullJob) => {
    const { jobId, filePath } = bullJob.data;
    const absolutePath = path_1.default.resolve(filePath);
    try {
        // 1️Update job status to PROCESSING
        await prisma.job.update({
            where: { id: jobId },
            data: { status: 'PROCESSING', progress: 10 },
        });
        // 2️Read the uploaded file
        const dataBuffer = await promises_1.default.readFile(absolutePath);
        let text = '';
        // 3️ Parse PDF or treat as text
        if (filePath.toLowerCase().endsWith('.pdf')) {
            const parser = new PDFParse({ data: dataBuffer });
            const pdfData = await parser.getText();
            text = pdfData.text;
        }
        else {
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
        const wordFreq = {};
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
    }
    catch (error) {
        console.error(`[Worker] Job ${jobId} failed:`, error);
        await prisma.job.update({
            where: { id: jobId },
            data: { status: 'FAILED' },
        });
        throw error;
    }
}, {
    connection: connection,
    concurrency: 5, // Process up to 5 jobs simultaneously
    skipVersionCheck: true
});
console.log('Worker started listening for jobs...');
exports.default = worker;
//# sourceMappingURL=file.worker.js.map