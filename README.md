# BladeLib Node - Installation Wizard Package

A comprehensive installation wizard package for Node.js/Express applications with automatic user model synchronization.

## Features

- 🚀 **Easy Integration**: Simple npm package that can be installed in any Express project
- 🔄 **User Model Sync**: Automatically syncs with existing user models in your project
- 🛠️ **Database Setup**: Handles database configuration and migrations
- 👤 **Admin User Creation**: Creates or updates admin users during installation
- 📋 **Installation Wizard**: Complete web-based installation process
- 🔐 **License Verification**: Built-in license verification system
- 📊 **Status Checking**: Check installation status and requirements

## Installation

```bash
npm install bladelib-node
```

## Quick Start

### Basic Usage

```javascript
import express from 'express';
import { InstallWizard } from 'bladelib-node';

const app = express();

// Create installation wizard instance
const installWizard = new InstallWizard({
  mountPath: '/install' // Optional: custom mount path
});

// Mount the wizard on your Express app
installWizard.mount(app);

// Or use the router directly
app.use('/install', installWizard.getRouter());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Installation wizard available at http://localhost:3000/install');
});
```

### With Existing User Model

If you already have a user model in your project, the package will automatically sync with it:

```javascript
import express from 'express';
import { InstallWizard, syncUserModel } from 'bladelib-node';
import { Sequelize } from 'sequelize';
import { User } from './models/User.js'; // Your existing user model

const app = express();
const sequelize = new Sequelize(/* your config */);

// Sync with existing user model
const userModel = await syncUserModel(sequelize, User);

// Create installation wizard with existing user model
const installWizard = new InstallWizard({
  mountPath: '/install',
  userModel: userModel
});

installWizard.mount(app);
```

### Programmatic Installation

You can also run the installation programmatically:

```javascript
import { configureDb, connectDb, runMigrations, createOrUpdateAdmin } from 'bladelib-node';

// Database configuration
const dbConfig = {
  DB_HOST: 'localhost',
  DB_PORT: '3306',
  DB_DATABASE: 'myapp',
  DB_USERNAME: 'root',
  DB_PASSWORD: 'password'
};

// Admin user data
const adminData = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'admin@example.com',
  password: 'securepassword'
};

try {
  // Configure and connect to database
  await configureDb(dbConfig, existingUserModel); // Pass existing user model if available
  await connectDb();
  await runMigrations();
  
  // Create admin user
  await createOrUpdateAdmin(adminData);
  
  console.log('Installation completed successfully!');
} catch (error) {
  console.error('Installation failed:', error);
}
```

## API Reference

### InstallWizard Class

#### Constructor Options

```javascript
const installWizard = new InstallWizard({
  mountPath: '/install',        // Path to mount the wizard (default: '/install')
  userModel: userModelInstance  // Existing user model to sync with (optional)
});
```

#### Methods

- `getRouter()` - Returns Express router for manual mounting
- `mount(app, path?)` - Mounts the wizard on an Express app
- `isInstalled()` - Returns Promise<boolean> - Check if installation is completed
- `getStatus()` - Returns Promise<Object> - Get detailed installation status

### User Model Synchronization

#### syncUserModel(sequelize, existingUserModel?, options?)

Synchronizes with an existing user model or creates a new one.

**Parameters:**
- `sequelize` - Sequelize instance
- `existingUserModel` - Existing user model (optional)
- `options` - Configuration options (optional)

**Returns:** Promise<UserModel>

#### checkUserModelCompatibility(userModel)

Checks if a user model is compatible with the installation wizard.

**Parameters:**
- `userModel` - User model to check

**Returns:** Promise<Object> - Compatibility information

### Database Functions

- `configureDb(config, existingUserModel?)` - Configure database connection
- `connectDb()` - Connect to database
- `runMigrations()` - Run database migrations
- `createOrUpdateAdmin(adminData)` - Create or update admin user
- `writeEnv(config)` - Write database config to .env file

## User Model Requirements

The package works with user models that have the following required fields:

- `id` - Primary key (auto-increment)
- `name` - User's full name
- `email` - User's email (unique)
- `password` - Hashed password

Optional fields that will be added if missing:
- `email_verified_at` - Email verification timestamp
- `system_reserve` - Boolean flag for system users

## Installation Process

1. **Requirements Check** - Verifies system requirements
2. **License Verification** - Validates license key (if required)
3. **Database Configuration** - Sets up database connection
4. **User Model Sync** - Synchronizes with existing user model
5. **Admin Creation** - Creates or updates admin user
6. **Completion** - Finalizes installation

## Environment Variables

The package uses the following environment variables:

```env
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=myapp
DB_USERNAME=root
DB_PASSWORD=password
SESSION_SECRET=your-secret-key
APP_ID=your-app-id
DOTENV_EDIT=true
```

## Error Handling

The package provides comprehensive error handling for:

- Database connection issues
- User model compatibility problems
- License verification failures
- Missing required fields
- Installation state conflicts

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For issues and questions, please open an issue on the GitHub repository.