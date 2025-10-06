/**
 * Installation Wizard Module
 * Provides easy integration for the installation wizard
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import ejsMate from 'ejs-mate';
import dotenv from 'dotenv';
import routes from '../node/routes/index.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class InstallWizard {
  constructor(options = {}) {
    this.options = {
      mountPath: '/install',
      existingUserModel: null, // Store existing user model for later use
      ...options
    };
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    // Mount the installation routes directly on the router
    this.router.use(routes);
  }

  /**
   * Get the Express router for mounting
   * @returns {express.Router} The configured router
   */
  getRouter() {
    return this.router;
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
    
    // Configure view engine if not already configured
    if (!app.get('view engine')) {
      app.engine('ejs', ejsMate);
      app.set('view engine', 'ejs');
    }
    
    // Set views directory if not already set
    if (!app.get('views')) {
      app.set('views', path.join(__dirname, '../node/views'));
    }
    
    // Store wizard instance in app.locals for access in controllers
    app.locals.installWizard = this;
    
    // Mount the router
    app.use(finalMountPath, this.router);
  }

  /**
   * Check if installation is completed
   * @returns {Promise<boolean>} True if installation is completed
   */
  async isInstalled() {
    const { migSync } = await import('../node/src/lib/helpers.js');
    return await migSync();
  }

  /**
   * Get installation status
   * @returns {Promise<Object>} Installation status object
   */
  async getStatus() {
    const { migSync, datSync, liSync } = await import('../node/src/lib/helpers.js');
    
    return {
      isInstalled: await migSync(),
      hasDatabase: await datSync(),
      hasLicense: await liSync(),
      requirements: true, // Always true for now
      directories: true   // Always true for now
    };
  }
}

export default InstallWizard;