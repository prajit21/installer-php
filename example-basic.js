/**
 * Basic example usage of BladeLib Node package
 * This demonstrates how to integrate the installation wizard without database connection
 */

const express = require('express');
const { InstallWizard } = require('./index.js');

const app = express();

// Basic usage - just mount the installation wizard
console.log('=== Basic Installation Wizard Setup ===');

// Create installation wizard instance
const installWizard = new InstallWizard({
  mountPath: '/install'
});

// Mount the wizard on your Express app
installWizard.mount(app);

// Add some basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a simple route to show the wizard is working
app.get('/', (req, res) => {
  res.send(`
    <h1>BladeLib Node Installation Wizard</h1>
    <p>Welcome to the installation wizard!</p>
    <p><a href="/install">Go to Installation Wizard</a></p>
    <p>This example shows how to integrate the installation wizard into your Express app.</p>
  `);
});

// Check installation status
installWizard.getStatus().then(status => {
  console.log('Installation status:', status);
}).catch(err => {
  console.log('Status check failed (this is normal if not installed yet):', err.message);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Installation wizard available at http://localhost:${PORT}/install`);
  console.log('Visit the URL above to start the installation process');
});