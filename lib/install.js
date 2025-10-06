/**
 * Installation Wizard Module
 * Provides easy integration for the installation wizard
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from '../node/routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class InstallWizard {
  constructor(options = {}) {
    this.options = {
      mountPath: '/install',
      ...options
    };
    this.router = express.Router();
    this.setupRoutes();
  }

  setupRoutes() {
    // Mount the installation routes
    this.router.use(this.options.mountPath, routes);
  }

  /**
   * Get the Express router for mounting
   * @returns {express.Router} The configured router
   */
  getRouter() {
    return this.router;
  }

  /**
   * Mount the installation wizard on an Express app
   * @param {express.Application} app - Express application instance
   * @param {string} mountPath - Path to mount the wizard (optional)
   */
  mount(app, mountPath = null) {
    const path = mountPath || this.options.mountPath;
    app.use(path, this.router);
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