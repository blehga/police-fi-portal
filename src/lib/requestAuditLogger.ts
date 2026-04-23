import { PrismaClient, Prisma } from '@prisma/client';
import { writeAuditLog, AuditAction, AuditEntity } from './auditLogger';

type PrismaLike = PrismaClient | Prisma.TransactionClient;

interface RequestAuditContext {
  actorUserId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  method?: string | null;
  path?: string | null;
}

interface RequestAuditInput {
  userId?: number | null;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string | null;
  details?: Record<string, unknown>;
}

export function createRequestAuditLogger(
  prisma: PrismaLike,
  ctx: RequestAuditContext
) {
  return {
    async log(input: RequestAuditInput) {
      await writeAuditLog(prisma, {
        userId: input.userId ?? null,
        actorUserId: ctx.actorUserId ?? null,
        action: input.action,
        entity: input.entity,
        entityId: input.entityId ?? null,
        details: {
          ...input.details,
          ip: ctx.ip ?? null,
          userAgent: ctx.userAgent ?? null,
          method: ctx.method ?? null,
          path: ctx.path ?? null,
        },
      });
    },
  };
}