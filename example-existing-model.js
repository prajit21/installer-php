/**
 * Example: Installation Wizard with Existing User Model
 * This shows how to use the package with an existing project that has a user model
 * but NO initial database connection required!
 */

import express from 'express';
import path from 'path';
import ejsMate from 'ejs-mate';
import session from 'express-session';
import { InstallWizard, checkUserModelCompatibility } from './index.js';

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

// Add session handling middleware
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

console.log('=== Installation Wizard with Existing User Model ===');

// Step 1: Define your existing user model (NO DATABASE CONNECTION NEEDED!)
// This represents your existing user model from your project
const MyExistingUserModel = {
  tableName: 'users',
  sequelize: null, // Will be set when database connects
  
  // Mock methods for compatibility checking
  define: function(attributes, options) {
    return this;
  },
  
  // This will be called when the database is connected during installation
  findOne: async function(options) {
    // This will be implemented when database connects
    throw new Error('Database not connected yet');
  },
  
  create: async function(data) {
    // This will be implemented when database connects
    throw new Error('Database not connected yet');
  },
  
  update: async function(data) {
    // This will be implemented when database connects
    throw new Error('Database not connected yet');
  }
};

// Step 2: Check compatibility (works without database connection)
checkUserModelCompatibility(MyExistingUserModel).then(compatibility => {
  console.log('User model compatibility check:', compatibility);
  
  if (compatibility.compatible) {
    console.log('✅ Your existing user model is compatible!');
    
    // Step 3: Create installation wizard
    const installWizard = new InstallWizard({
      mountPath: '/install'
    });
    
    // Step 4: Set your existing user model
    // This will be used when the user provides database credentials
    installWizard.setExistingUserModel(MyExistingUserModel);
    
    // Step 5: Mount the wizard
    installWizard.mount(app);
    
    console.log('✅ Installation wizard configured with your existing user model');
    console.log('✅ Database connection will happen at the last step');
    console.log('✅ Your existing users will be preserved and synced');
    
  } else {
    console.log('❌ User model compatibility issues:', compatibility.reason);
    console.log('Missing fields:', compatibility.missingFields);
  }
}).catch(err => {
  console.log('Compatibility check failed:', err.message);
});

// Add a simple route to show the setup
app.get('/', (req, res) => {
  res.send(`
    <h1>Installation Wizard with Existing User Model</h1>
    <p>This example shows how to use the installation wizard with an existing project.</p>
    <p><strong>Key Features:</strong></p>
    <ul>
      <li>✅ No initial database connection required</li>
      <li>✅ Works with existing user models</li>
      <li>✅ Database connection happens at the last step</li>
      <li>✅ Preserves existing users</li>
      <li>✅ Syncs with your existing user model</li>
    </ul>
    <p><a href="/install">Start Installation Wizard</a></p>
    <p><strong>How it works:</strong></p>
    <ol>
      <li>User goes through installation steps</li>
      <li>At the database step, user provides DB credentials</li>
      <li>Package connects to database and syncs with your existing user model</li>
      <li>Admin user is created/updated in your existing users table</li>
      <li>Installation completes with your existing data intact</li>
    </ol>
  `);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 Installation wizard: http://localhost:${PORT}/install`);
  console.log(`\n📝 How to use:`);
  console.log(`1. Visit http://localhost:${PORT}/install`);
  console.log(`2. Go through the installation steps`);
  console.log(`3. At the database step, provide your database credentials`);
  console.log(`4. The wizard will connect and sync with your existing user model`);
  console.log(`5. Your existing users will be preserved and admin will be created/updated`);
});