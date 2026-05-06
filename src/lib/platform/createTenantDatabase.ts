import mysql from "mysql2/promise";

function requiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} missing`);
  }

  return value;
}

function sanitizeSlug(slug: string) {
  return slug.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}

export async function createTenantDatabase(slug: string) {
  const safeSlug = sanitizeSlug(slug);
  const databaseName = `tenant_${safeSlug}`;

  const adminHost = requiredEnv("MYSQL_ADMIN_HOST");
  const adminPort = Number(requiredEnv("MYSQL_ADMIN_PORT"));
  const adminUser = requiredEnv("MYSQL_ADMIN_USER");
  const adminPassword = requiredEnv("MYSQL_ADMIN_PASSWORD");

  const tenantHost = requiredEnv("MYSQL_TENANT_HOST");
  const tenantPort = Number(requiredEnv("MYSQL_TENANT_PORT"));
  const tenantUser = requiredEnv("MYSQL_TENANT_USER");
  const tenantPassword = requiredEnv("MYSQL_TENANT_PASSWORD");

  const connection = await mysql.createConnection({
    host: adminHost,
    port: adminPort,
    user: adminUser,
    password: adminPassword,
    multipleStatements: true,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``);

  await connection.query(
    `CREATE USER IF NOT EXISTS '${tenantUser}'@'%' IDENTIFIED BY '${tenantPassword}'`
  );

  await connection.query(
    `GRANT ALL PRIVILEGES ON \`${databaseName}\`.* TO '${tenantUser}'@'%'`
  );

  await connection.query("FLUSH PRIVILEGES");

  await connection.end();

  return {
    databaseName,
    host: tenantHost,
    port: tenantPort,
    username: tenantUser,
    password: tenantPassword,
  };
}