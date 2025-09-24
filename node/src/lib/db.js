import mysql from 'mysql2/promise';
import fs from 'fs-extra';

let pool = null;

export async function configureDb(cfg) {
  pool = mysql.createPool({
    host: cfg.DB_HOST,
    user: cfg.DB_USERNAME,
    password: cfg.DB_PASSWORD,
    port: Number(cfg.DB_PORT || 3306),
    database: cfg.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10
  });
}

export async function connectDb() { if (!pool) throw new Error('DB not configured'); await pool.getConnection().then(c=>c.release()); }

export async function runMigrations(importData) { /* No-op in generic port */ }

export async function seedIfNeeded() { /* No-op */ }

export async function writeEnv(cfg) {
  const lines = [
    `DB_HOST=${cfg.DB_HOST}`,
    `DB_PORT=${cfg.DB_PORT}`,
    `DB_DATABASE=${cfg.DB_DATABASE}`,
    `DB_USERNAME=${cfg.DB_USERNAME}`,
    `DB_PASSWORD=${cfg.DB_PASSWORD}`
  ];
  await fs.appendFile('.env', '\n' + lines.join('\n') + '\n');
}

