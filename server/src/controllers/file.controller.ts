import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { addFileJob } from '../services/queue.service';

const prisma = new PrismaClient();

export const uploadFile = async (req: Request, res: Response) => {
  let userId: string | undefined;
  let uploadedFile: Express.Multer.File | undefined;

  console.log('📥 [Backend] Received upload request');

  try {
    userId = req.body.userId;
    uploadedFile = req.file;

    if (!uploadedFile) {
      console.warn('⚠️ [Backend] No file attached in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // 1. Create File record
    const fileRecord = await prisma.file.create({
      data: {
        userId,
        filePath: uploadedFile.path,
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
    await addFileJob(jobRecord.id, uploadedFile.path);

    res.status(201).json({
      message: 'File uploaded and job queued',
      jobId: jobRecord.id,
    });
  } catch (error: any) {
    console.error('CRITICAL UPLOAD ERROR:', {
      message: error.message,
      stack: error.stack,
      file: uploadedFile ? { path: uploadedFile.path, size: uploadedFile.size } : 'NONE',
      userId: userId || 'NONE'
    });
    res.status(500).json({ 
      error: 'Backend Failure', 
      details: error.message,
      tip: 'Check Render logs for the CRITICAL UPLOAD ERROR block'
    });
  }
};

export const getJobStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: id as string },
      include: {
        result: true,
      },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error: any) {
    console.error('Status Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
