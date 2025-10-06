/**
 * Example usage of BladeLib Node package with database
 * This shows how to use the package with an actual database connection
 */

const express = require('express');
const { InstallWizard, syncUserModel, checkUserModelCompatibility, configureDb, connectDb, runMigrations, createOrUpdateAdmin } = require('./index.js');
const { Sequelize } = require('sequelize');

const app = express();

// Database configuration - UPDATE THESE VALUES FOR YOUR DATABASE
const dbConfig = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || '3306',
  DB_DATABASE: process.env.DB_DATABASE || 'myapp',
  DB_USERNAME: process.env.DB_USERNAME || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || 'password'
};

// Admin user configuration
const adminData = {
  first_name: 'Admin',
  last_name: 'User',
  email: 'admin@example.com',
  password: 'admin123456'
};

console.log('=== BladeLib Node with Database Example ===');

// Example 1: Programmatic installation (without web interface)
async function programmaticInstallation() {
  try {
    console.log('Starting programmatic installation...');
    
    // Configure database
    await configureDb(dbConfig);
    console.log('✓ Database configured');
    
    // Connect to database
    await connectDb();
    console.log('✓ Database connected');
    
    // Run migrations
    await runMigrations();
    console.log('✓ Migrations completed');
    
    // Create admin user
    await createOrUpdateAdmin(adminData);
    console.log('✓ Admin user created/updated');
    
    console.log('✓ Installation completed successfully!');
  } catch (error) {
    console.error('Installation failed:', error.message);
    console.log('Make sure your database is running and accessible');
  }
}

// Example 2: Web-based installation wizard
function setupWebWizard() {
  const installWizard = new InstallWizard({
    mountPath: '/install'
  });

  // Mount the wizard
  installWizard.mount(app);
  
  console.log('Web installation wizard mounted at /install');
}

// Example 3: With existing user model (if you have one)
async function setupWithExistingUserModel() {
  try {
    // Create a Sequelize instance for your existing database
    const sequelize = new Sequelize(dbConfig.DB_DATABASE, dbConfig.DB_USERNAME, dbConfig.DB_PASSWORD, {
      host: dbConfig.DB_HOST,
      port: Number(dbConfig.DB_PORT),
      dialect: 'mysql',
      logging: false
    });

    // Define your existing user model (replace this with your actual model)
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

    // Check compatibility
    const compatibility = await checkUserModelCompatibility(ExistingUser);
    console.log('User model compatibility:', compatibility);

    if (compatibility.compatible) {
      // Sync with existing model
      const userModel = await syncUserModel(sequelize, ExistingUser);
      console.log('✓ User model synced successfully');
      
      // Use the synced model for installation
      await configureDb(dbConfig, ExistingUser);
      await connectDb();
      await runMigrations();
      await createOrUpdateAdmin(adminData);
      
      console.log('✓ Installation with existing user model completed!');
    } else {
      console.log('User model is not compatible:', compatibility.reason);
    }
  } catch (error) {
    console.error('Setup with existing user model failed:', error.message);
  }
}

// Setup Express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a simple route
app.get('/', (req, res) => {
  res.send(`
    <h1>BladeLib Node Installation Examples</h1>
    <p>Choose an installation method:</p>
    <ul>
      <li><a href="/install">Web Installation Wizard</a></li>
      <li><a href="/programmatic">Run Programmatic Installation</a></li>
      <li><a href="/existing-model">Test with Existing User Model</a></li>
    </ul>
  `);
});

// Route for programmatic installation
app.get('/programmatic', async (req, res) => {
  await programmaticInstallation();
  res.send('<h2>Programmatic installation completed! Check console for details.</h2>');
});

// Route for existing model test
app.get('/existing-model', async (req, res) => {
  await setupWithExistingUserModel();
  res.send('<h2>Existing model test completed! Check console for details.</h2>');
});

// Setup web wizard
setupWebWizard();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log(`- http://localhost:${PORT}/install (Web Installation Wizard)`);
  console.log(`- http://localhost:${PORT}/programmatic (Programmatic Installation)`);
  console.log(`- http://localhost:${PORT}/existing-model (Test with Existing Model)`);
  console.log('\nMake sure your database is running and accessible!');
});