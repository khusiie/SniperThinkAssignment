"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobStatus = exports.uploadFile = void 0;
const client_1 = require("@prisma/client");
const queue_service_1 = require("../services/queue.service");
const prisma = new client_1.PrismaClient();
const uploadFile = async (req, res) => {
    try {
        const { userId } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        // 1. Create File record
        const fileRecord = await prisma.file.create({
            data: {
                userId,
                filePath: file.path,
            },
        });
        // 2. Create Job record
        const jobRecord = await prisma.job.create({
            data: {
                fileId: fileRecord.id,
                status: 'PENDING',
            },
        });
        // 3. Add to BullMQ
        await (0, queue_service_1.addFileJob)(jobRecord.id, file.path);
        res.status(201).json({
            message: 'File uploaded and job queued',
            jobId: jobRecord.id,
        });
    }
    catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
exports.uploadFile = uploadFile;
const getJobStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const job = await prisma.job.findUnique({
            where: { id: id },
            include: {
                result: true,
            },
        });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.status(200).json(job);
    }
    catch (error) {
        console.error('Status Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
exports.getJobStatus = getJobStatus;
//# sourceMappingURL=file.controller.js.map