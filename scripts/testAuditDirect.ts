// scripts/testAuditDirect.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL);

  const row = await prisma.auditLog.create({
    data: {
      actorUserId: 'test-user-123',
      action: 'CREATE',
      entity: 'ficard',
      entityId: 'test-card-001',
      details: {
        direct: true,
        message: 'direct prisma insert test',
      } as Prisma.InputJsonValue,
    },
  });

  console.log('Inserted row:', row);

  const found = await prisma.auditLog.findMany({
    where: {
      actorUserId: 'test-user-123',
    },
    orderBy: {
      id: 'desc',
    },
    take: 5,
  });

  console.log('Found rows:', found);
}

main()
  .catch((err) => {
    console.error('Direct Prisma audit test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });