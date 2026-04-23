import mysql from "mysql2/promise";

export const platformDb = mysql.createPool({
  host: process.env.PLATFORM_DB_HOST,
  port: Number(process.env.PLATFORM_DB_PORT || 3306),
  user: process.env.PLATFORM_DB_USER,
  password: process.env.PLATFORM_DB_PASSWORD,
  database: process.env.PLATFORM_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});