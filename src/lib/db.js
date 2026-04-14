import mysql from "mysql2/promise";
import fs from "fs";

let pool;

function getSSLConfig() {
  if (process.env.DB_CA && fs.existsSync(process.env.DB_CA)) {
    return {
      ca: fs.readFileSync(process.env.DB_CA),
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    };
  }

  return {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  };
}

function getPool() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 4000),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: getSSLConfig(),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

export async function query(sql, params = []) {
  const db = getPool();
  const [rows] = await db.execute(sql, params);
  return rows;
}