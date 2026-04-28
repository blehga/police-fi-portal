import mysql from "mysql2/promise";
import { platformDb } from "./platform-db";

const tenantPools = new Map<string, mysql.Pool>();

export async function getTenantDbBySlug(slug: string) {
  const [rows] = await platformDb.query(
    `
    SELECT
      o.id AS organization_id,
      o.slug,
      d.database_name,
      d.host,
      d.port,
      d.username,
      d.password
    FROM organizations o
    JOIN organization_databases d
      ON d.organization_id = o.id
    WHERE o.slug = ?
      AND o.status IN ('active', 'pending')
      AND d.status = 'active'
    LIMIT 1
    `,
    [slug]
  );

  const result = rows as Array<{
    organization_id: number;
    slug: string;
    database_name: string;
    host: string;
    port: number;
    username: string;
    password: string;
  }>;

  if (!result.length) {
    throw new Error("Organization not found");
  }

  const org = result[0];
  const key = `${org.host}:${org.port}:${org.database_name}:${org.username}`;

  if (!tenantPools.has(key)) {
    tenantPools.set(
      key,
      mysql.createPool({
        host: org.host,
        port: org.port,
        user: org.username,
        password: org.password,
        database: org.database_name,
        waitForConnections: true,
        connectionLimit: 10,
      })
    );
  }

  return {
  organizationId: org.organization_id,
  slug: org.slug,
  databaseName: org.database_name, // ✅ ADD THIS
  db: tenantPools.get(key)!,
};
}