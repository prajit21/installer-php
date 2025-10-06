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

// Example 2: With existing user model (NO DATABASE CONNECTION REQUIRED!)
console.log('=== Example 2: With Existing User Model (No DB Connection Required) ===');

// Define your existing user model WITHOUT database connection
const ExistingUser = {
  // This represents your existing user model structure
  tableName: 'users',
  sequelize: null, // Will be set when database is connected
  define: function(attributes, options) {
    // Mock define method for compatibility check
    return this;
  }
};

// Check compatibility without database connection
checkUserModelCompatibility(ExistingUser).then(compatibility => {
  console.log('User model compatibility:', compatibility);
  
  if (compatibility.compatible) {
    console.log('✓ User model is compatible - will sync during installation');
    
    // Set the existing user model on the wizard
    // This will be used when the user provides database credentials
    basicWizard.setExistingUserModel(ExistingUser);
    
    console.log('✓ Existing user model set on installation wizard');
    console.log('✓ Database connection will happen at the last step of installation');
  } else {
    console.log('User model compatibility issues:', compatibility.reason);
  }
}).catch(err => {
  console.log('Compatibility check failed (this is normal):', err.message);
});

// Example 3: Check installation status
console.log('=== Example 3: Installation Status ===');
basicWizard.getStatus().then(status => {
  console.log('Installation status:', status);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
console.log(`Installation wizard: http://localhost:${PORT}/install`);
});