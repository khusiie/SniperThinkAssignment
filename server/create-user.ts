import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 'user_123' },
    update: {},
    create: {
      id: 'user_123',
      name: 'Demo User',
      email: 'demo@sniperthink.com'
    }
  });
  console.log('User created!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
