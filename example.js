/**
 * Example usage of BladeLib Node package
 * This demonstrates how to integrate the installation wizard
 */

import express from 'express';
import { InstallWizard, syncUserModel, checkUserModelCompatibility } from './index.js';
import { Sequelize } from 'sequelize';

const app = express();

// Example 1: Basic usage without existing user model
console.log('=== Example 1: Basic Installation Wizard ===');
const basicWizard = new InstallWizard({
  mountPath: '/install'
});

// Mount the wizard
basicWizard.mount(app);

// Example 2: With existing user model (commented out to avoid database connection issues)
console.log('=== Example 2: With Existing User Model (Demo) ===');
console.log('Note: This example requires a database connection.');
console.log('See example-with-db.js for a complete working example with database.');

// Uncomment the following code if you have a database running:
/*
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  database: 'your_database',
  username: 'your_username',
  password: 'your_password',
  logging: false
});

const ExistingUser = sequelize.define('User', {
  id: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.DataTypes.STRING, allowNull: false },
  email: { type: Sequelize.DataTypes.STRING, allowNull: false, unique: true },
  password: { type: Sequelize.DataTypes.STRING, allowNull: false },
  created_at: { type: Sequelize.DataTypes.DATE },
  updated_at: { type: Sequelize.DataTypes.DATE }
}, {
  tableName: 'users',
  timestamps: true
});

checkUserModelCompatibility(ExistingUser).then(compatibility => {
  console.log('User model compatibility:', compatibility);
  
  if (compatibility.compatible) {
    syncUserModel(sequelize, ExistingUser).then(userModel => {
      console.log('User model synced successfully');
      
      const advancedWizard = new InstallWizard({
        mountPath: '/advanced-install',
        userModel: userModel
      });
      
      advancedWizard.mount(app);
    });
  }
});
*/

// Example 3: Check installation status
console.log('=== Example 3: Installation Status ===');
basicWizard.getStatus().then(status => {
  console.log('Installation status:', status);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Basic installation wizard: http://localhost:${PORT}/install`);
  console.log(`Advanced installation wizard: http://localhost:${PORT}/advanced-install`);
});