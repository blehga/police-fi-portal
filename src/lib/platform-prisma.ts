import { PrismaClient } from "@/generated/platform-client";

const globalForPlatformPrisma = globalThis as unknown as {
  platformPrisma?: PrismaClient;
};

export const platformPrisma =
  globalForPlatformPrisma.platformPrisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPlatformPrisma.platformPrisma = platformPrisma;
}