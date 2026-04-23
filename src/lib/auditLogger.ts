import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

type PrismaLike = PrismaClient;

type AuditAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGOUT'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'ACCESS_DENIED'
  | 'PASSWORD_CHANGED'
  | 'ROLE_ASSIGNED'
  | 'ROLE_REMOVED';

type AuditEntity =
  | 'AUTH'
  | 'USER'
  | 'ROLE'
  | 'USER_ROLE'
  | 'FICARD'
  | 'PHOTO'
  | 'PERMISSION';

interface AuditLogInput {
  userId?: number | null;
  actorUserId?: string | null;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
}

const SENSITIVE_KEYS = new Set([
  'password',
  'passwordHash',
  'newPassword',
  'oldPassword',
  'token',
  'accessToken',
  'refreshToken',
  'authorization',
  'cookie',
  'secret',
  'apiKey',
  'resetToken',
  'ssn',
]);

function sanitizeAuditDetails(value: unknown, depth = 0): unknown {
  if (depth > 5) return '[truncated]';
  if (value == null) return value;

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeAuditDetails(item, depth + 1));
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};

    for (const [key, val] of Object.entries(obj)) {
      if (SENSITIVE_KEYS.has(key)) {
        out[key] = '[redacted]';
      } else {
        out[key] = sanitizeAuditDetails(val, depth + 1);
      }
    }

    return out;
  }

  if (typeof value === 'string' && value.length > 1000) {
    return `${value.slice(0, 1000)}...[truncated]`;
  }

  return value;
}

async function writeAuditLog(
  prisma: PrismaLike,
  input: AuditLogInput
) {
  return prisma.auditLog.create({
    data: {
      userId: input.userId ?? null,
      actorUserId: input.actorUserId ?? null,
      action: input.action,
      entity: input.entity,
      entityId: input.entityId ?? null,
      details: input.details
        ? (sanitizeAuditDetails(input.details) as Prisma.InputJsonValue)
        : undefined,
    },
  });
}

async function main() {
  const row = await writeAuditLog(prisma, {
    actorUserId: 'test-user-123',
    action: 'CREATE',
    entity: 'FICARD',
    entityId: 'test-card-001',
    details: {
      test: true,
      message: 'helper inline test',
    },
  });

  console.log('Inserted row:', row);
}

main()
  .catch((err) => {
    console.error('Audit test failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });