import mysql from "mysql2/promise";

if (!process.env.PLATFORM_DATABASE_URL) {
  throw new Error("PLATFORM_DATABASE_URL missing");
}

export const platformDb = mysql.createPool(process.env.PLATFORM_DATABASE_URL);