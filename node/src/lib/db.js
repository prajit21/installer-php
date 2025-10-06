const { Sequelize, DataTypes } = require('sequelize');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const fs = require('fs-extra');
const { UserModel, syncUserModel } = require('../../../lib/models.js');

let sequelize = null;
let User = null;
let hostUserModel = null;

async function configureDb(cfg, existingUserModel = null) {
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

async function connectDb() {
  if (!sequelize) throw new Error('DB not configured');
  await sequelize.authenticate();
}

async function runMigrations() {
  if (!sequelize) throw new Error('DB not configured');
  await sequelize.sync();
}

async function createOrUpdateAdmin(admin) {
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

async function writeEnv(cfg) {
  try {
    // Read existing .env file
    let existingContent = '';
    if (await fs.pathExists('.env')) {
      existingContent = await fs.readFile('.env', 'utf8');
    }
    
    // Parse existing environment variables
    const existingVars = {};
    existingContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        existingVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    // Merge with new database configuration
    const mergedVars = {
      ...existingVars,
      DB_HOST: cfg.DB_HOST,
      DB_PORT: cfg.DB_PORT,
      DB_DATABASE: cfg.DB_DATABASE,
      DB_USERNAME: cfg.DB_USERNAME,
      DB_PASSWORD: cfg.DB_PASSWORD
    };
    
    // Write merged configuration back to .env
    const newContent = Object.entries(mergedVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n') + '\n';
    
    await fs.writeFile('.env', newContent);
  } catch (error) {
    console.error('Error writing .env file:', error);
    // Fallback to append mode if merge fails
    const lines = [
      `DB_HOST=${cfg.DB_HOST}`,
      `DB_PORT=${cfg.DB_PORT}`,
      `DB_DATABASE=${cfg.DB_DATABASE}`,
      `DB_USERNAME=${cfg.DB_USERNAME}`,
      `DB_PASSWORD=${cfg.DB_PASSWORD}`
    ];
    await fs.appendFile('.env', '\n' + lines.join('\n') + '\n');
  }
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

module.exports = {
  configureDb,
  connectDb,
  runMigrations,
  createOrUpdateAdmin,
  writeEnv
};

