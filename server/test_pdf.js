const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs/promises');
const path = require('path');
const pdf = require('pdf-parse');

async function main() {
  const fileRecord = await prisma.file.findFirst({
    where: { id: '4c5bf194-7195-434d-aa7e-d496f476a87b' },
  });

  const absolutePath = path.resolve(fileRecord.filePath);
  console.log('Testing file parse for', absolutePath);

  try {
    const dataBuffer = await fs.readFile(absolutePath);
    console.log('Buffer read, size:', dataBuffer.length);
    const pdfData = await pdf(dataBuffer);
    console.log('Parse success! Words:', pdfData.text.split(' ').length);
  } catch (error) {
    console.error('PARSE ERROR CAUGHT:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
