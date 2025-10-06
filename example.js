/**
 * Example usage of BladeLib Node package
 * This demonstrates how to integrate the installation wizard
 */

import express from 'express';
import path from 'path';
import ejsMate from 'ejs-mate';
import session from 'express-session';
import { InstallWizard, syncUserModel, checkUserModelCompatibility } from './index.js';
import { Sequelize } from 'sequelize';

const app = express();

// Configure view engine and views directory
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'node/views'));

// Add session middleware
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'change-me',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true }
}));

// Add basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for the installation wizard
app.use('/install', express.static(path.join(process.cwd(), 'public/install')));
app.use(express.static(path.join(process.cwd(), 'public')));

// Add routeIs helper function for views
app.locals.routeIs = (name) => app.locals.currentRouteName === name;

// Add session handling middleware (from original app.js)
app.use((req, res, next) => {
  const oldSnapshot = Object.assign({}, req.session._old || {});
  const errorsSnapshot = Object.assign({}, req.session._errors || {});
  res.locals.session = req.session;
  res.locals.errors = errorsSnapshot;
  res.locals.old = (key, fallback = '') => {
    if (!key) return fallback;
    const parts = key.split('.');
    let cur = oldSnapshot;
    for (const p of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return fallback;
      }
    }
    return cur ?? fallback;
  };
  req.session._old = {};
  req.session._errors = {};
  next();
});

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