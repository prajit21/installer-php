import { Sequelize, DataTypes } from 'sequelize';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import fs from 'fs-extra';
import { UserModel, syncUserModel } from '../../../lib/models.js';

let sequelize = null;
let User = null;
let hostUserModel = null;

export async function configureDb(cfg, existingUserModel = null) {
  await ensureDatabase(cfg);
  sequelize = new Sequelize(cfg.DB_DATABASE, cfg.DB_USERNAME, cfg.DB_PASSWORD, {
    host: cfg.DB_HOST,
    port: Number(cfg.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false
  });

  // Use existing user model if provided, otherwise create new one
  if (existingUserModel) {
    const userModel = await syncUserModel(sequelize, existingUserModel);
    User = userModel.getModel();
    hostUserModel = existingUserModel;
  } else {
    const userModel = new UserModel(sequelize);
    User = userModel.getModel();
  }
}

export async function connectDb() {
  if (!sequelize) throw new Error('DB not configured');
  await sequelize.authenticate();
}

export async function runMigrations() {
  if (!sequelize) throw new Error('DB not configured');
  await sequelize.sync();
}

export async function createOrUpdateAdmin(admin) {
  if (!User) throw new Error('Models not initialized');
  const name = `${admin.first_name} ${admin.last_name}`.trim();
  const email = admin.email;
  const password = await bcrypt.hash(admin.password, 10);
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    await existing.update({ name, password, email_verified_at: new Date(), system_reserve: true });
    return existing;
  }
  return await User.create({ name, email, password, email_verified_at: new Date(), system_reserve: true });
}

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

async function ensureDatabase(cfg) {
  const connection = await mysql.createConnection({
    host: cfg.DB_HOST,
    port: Number(cfg.DB_PORT || 3306),
    user: cfg.DB_USERNAME,
    password: cfg.DB_PASSWORD
  });
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${cfg.DB_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
  } finally {
    await connection.end();
  }
}

