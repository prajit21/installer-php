/**
 * Installation Wizard Module
 * Provides easy integration for the installation wizard
 */

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Get the directory of this file (package directory, not project directory)
const packageDir = path.dirname(__filename);
const routes = require(path.join(packageDir, '../node/routes/index.js'));

class InstallWizard {
  constructor(options = {}) {
    this.options = {
      mountPath: '/install',
      existingUserModel: null, // Store existing user model for later use
      ...options
    };
  }


  /**
   * Set existing user model for later database sync
   * @param {Object} userModel - Existing user model from host project
   */
  setExistingUserModel(userModel) {
    this.options.existingUserModel = userModel;
  }

  /**
   * Mount the installation wizard on an Express app
   * @param {express.Application} app - Express application instance
   * @param {string} mountPath - Path to mount the wizard (optional)
   */
  mount(app, mountPath = null) {
    const finalMountPath = mountPath || this.options.mountPath;
    
    // Create a sub-app for the installation wizard with its own views
    const installApp = express();
    
    // Configure view engine for install app
    installApp.engine('ejs', ejsMate);
    installApp.set('view engine', 'ejs');
    installApp.set('views', path.join(packageDir, '../node/views'));
    
    // Store wizard instance in app.locals for access in controllers
    installApp.locals.installWizard = this;
    
    // Mount the installation routes on the sub-app
    installApp.use(routes);
    
    // Mount the sub-app on the main app
    app.use(finalMountPath, installApp);
  }

  /**
   * Check if installation is completed
   * @returns {Promise<boolean>} True if installation is completed
   */
  async isInstalled() {
    const { migSync } = require('../node/src/lib/helpers.js');
    return await migSync();
  }

  /**
   * Get installation status
   * @returns {Promise<Object>} Installation status object
   */
  async getStatus() {
    const { migSync, datSync, liSync } = require('../node/src/lib/helpers.js');
    
    return {
      isInstalled: await migSync(),
      hasDatabase: await datSync(),
      hasLicense: await liSync(),
      requirements: true, // Always true for now
      directories: true   // Always true for now
    };
  }
}

module.exports = InstallWizard;