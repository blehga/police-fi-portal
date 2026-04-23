const { PrismaClient } = require('@prisma/client');
const { writeAuditLog } = require('../src/lib/auditLogger');

const prisma = new PrismaClient();

async function main() {
  const row = await writeAuditLog(prisma, {
    actorUserId: 'test-user-123',
    action: 'CREATE',
    entity: 'FICARD',
    entityId: 'test-card-001',
    details: {
      test: true,
      message: 'helper test via require',
    },
  });

  console.log('Inserted row:', row);
}

main()
  .catch((err: any) => {
    console.error('Audit test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });