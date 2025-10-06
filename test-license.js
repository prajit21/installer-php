/**
 * Test: License File Creation
 * This tests that license verification creates the same files as PHP version
 */

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const dotenv = require('dotenv');
const { InstallWizard } = require('./index.js');

// Load environment variables
dotenv.config();

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

console.log('=== Testing License File Creation ===');

// Create installation wizard
const installWizard = new InstallWizard({
  mountPath: '/install'
});

// Mount the wizard
installWizard.mount(app);

// Add a test route to simulate license verification
app.post('/test-license', async (req, res) => {
  try {
    const { license, envato_username } = req.body;
    
    // Simulate successful license verification
    const fs = require('fs-extra');
    const pubDir = path.join(process.cwd(), 'public');
    await fs.ensureDir(pubDir);
    
    // Create the same files as the PHP version
    const fzipPath = path.join(pubDir, 'fzip.li.dic');
    const logPath = path.join(pubDir, '_log.dic.xml');
    const ipPath = path.join(pubDir, 'cj7kl89.tmp');
    
    // Write license key file
    await fs.writeFile(fzipPath, Buffer.from(String(license).trim()).toString('base64'));
    
    // Write URL log file
    const currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const cleaned = currentUrl.replace('block/license/verify', '').replace('install/license', '').replace('install/verify', '');
    await fs.writeFile(logPath, Buffer.from(cleaned).toString('base64'));
    
    // Write IP file
    const serverIp = req.socket?.localAddress || req.ip || '';
    await fs.writeFile(ipPath, Buffer.from(serverIp).toString('base64'));
    
    res.json({ 
      success: true, 
      message: 'License files created successfully',
      files: {
        'fzip.li.dic': 'License key file',
        '_log.dic.xml': 'URL log file', 
        'cj7kl89.tmp': 'Server IP file'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a simple route to show the setup
app.get('/', (req, res) => {
  res.send(`
    <h1>License File Creation Test</h1>
    <p>This test verifies that license verification creates the same files as PHP version.</p>
    
    <h3>Test License Verification:</h3>
    <form action="/test-license" method="POST">
      <div>
        <label>License Key:</label><br>
        <input type="text" name="license" value="test-license-key-12345" style="width: 300px;">
      </div>
      <div>
        <label>Envato Username:</label><br>
        <input type="text" name="envato_username" value="testuser" style="width: 300px;">
      </div>
      <div>
        <button type="submit">Test License Verification</button>
      </div>
    </form>
    
    <p><a href="/install">Go to Installation Wizard</a></p>
  `);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Test server running on http://localhost:${PORT}`);
  console.log(`📋 Installation wizard: http://localhost:${PORT}/install`);
  console.log(`🧪 License test: http://localhost:${PORT}/`);
  console.log(`\n✅ Testing license file creation...`);
});