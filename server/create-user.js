"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=create-user.js.map