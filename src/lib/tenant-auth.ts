// src/lib/tenant-auth.ts
import { getTenantDbBySlug } from "@/lib/tenant-db";

export async function getTenantUserPermissions(
  tenant: string,
  userId: string
): Promise<string[]> {
  const { db } = await getTenantDbBySlug(tenant);

  const [rows]: any = await db.query(
    `
    SELECT DISTINCT p.code
    FROM userrole ur
    JOIN rolepermission rp ON rp.roleId = ur.roleId
    JOIN permission p ON p.id = rp.permissionId
    WHERE ur.userId = ?
    `,
    [userId]
  );

  return rows.map((row: any) => row.code);
}

export async function hasPermission(
  tenant: string,
  userId: string,
  permissionCode: string
): Promise<boolean> {
  const permissions = await getTenantUserPermissions(tenant, userId);
  return permissions.includes(permissionCode);
}