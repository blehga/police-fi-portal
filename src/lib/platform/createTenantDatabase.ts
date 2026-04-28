import mysql from "mysql2/promise";

function sanitizeSlug(slug: string) {
  return slug.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}

export async function createTenantDatabase(slug: string) {
  const safeSlug = sanitizeSlug(slug);
  const databaseName = `tenant_${safeSlug}`;

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_ADMIN_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_ADMIN_PORT || 3306),
    user: process.env.MYSQL_ADMIN_USER!,
    password: process.env.MYSQL_ADMIN_PASSWORD!,
    multipleStatements: true,
  });

await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);

await connection.query(
  `CREATE USER IF NOT EXISTS '${process.env.MYSQL_TENANT_USER}'@'%' IDENTIFIED BY '${process.env.MYSQL_TENANT_PASSWORD}'`
);

await connection.query(
  `GRANT ALL PRIVILEGES ON \`${databaseName}\`.* TO '${process.env.MYSQL_TENANT_USER}'@'%'`
);

await connection.query("FLUSH PRIVILEGES");

  await connection.end();

  return {
    databaseName,
    host: process.env.MYSQL_TENANT_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_TENANT_PORT || 3306),
    username: process.env.MYSQL_TENANT_USER || process.env.MYSQL_ADMIN_USER!,
    password: process.env.MYSQL_TENANT_PASSWORD || process.env.MYSQL_ADMIN_PASSWORD!,
  };
}