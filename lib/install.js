/**
 * Installation Wizard Module
 * Provides easy integration for the installation wizard
 */

const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const dotenv = require('dotenv');
const session = require('express-session');

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
    
    // Set default layout for installation wizard (don't use main app's layout)
    installApp.set('layout', false); // Disable default layout, let views specify their own
    
    // Add necessary middleware for the installation wizard
    installApp.use(express.json());
    // Use extended:true so nested fields like database[DB_HOST] parse correctly
    installApp.use(express.urlencoded({ extended: true }));
    
    // Serve static files for installation wizard
    installApp.use(express.static(path.join(packageDir, '../public')));
    
    // Add session support, but reuse parent session if available to avoid conflicts
    installApp.use((req, res, next) => {
      if (req.session) return next();
      return session({
        secret: process.env.SESSION_SECRET || 'install-wizard-secret',
        resave: false,
        saveUninitialized: false,
        rolling: true,
        cookie: {
          maxAge: 30 * 60 * 1000,
          httpOnly: true,
        }
      })(req, res, next);
    });
    
    // Add helper functions to locals
    installApp.locals.installWizard = this;
    
    // Normalize bracket-notation fields (if parent app parsed with extended:false)
    installApp.use((req, res, next) => {
      if (req.method === 'POST' && req.body && Object.keys(req.body).some(k => /\[.+\]/.test(k))) {
        const out = { ...req.body };
        const keys = Object.keys(req.body);
        for (const key of keys) {
          if (!/\[.+\]/.test(key)) continue;
          const value = req.body[key];
          delete out[key];
          const parts = [];
          key.replace(/([^\[\]]+)|(\[([^\[\]]+)\])/g, (m, p1, p2, p3) => {
            if (p1) parts.push(p1);
            if (p3) parts.push(p3);
            return '';
          });
          let cur = out;
          for (let i = 0; i < parts.length; i++) {
            const p = parts[i];
            if (i === parts.length - 1) {
              cur[p] = value;
            } else {
              if (typeof cur[p] !== 'object' || cur[p] === null) cur[p] = {};
              cur = cur[p];
            }
          }
        }
        req.body = out;
      }
      next();
    });

    // Provide old() helper and errors to EJS views within the installer app
    installApp.use((req, res, next) => {
      const oldSnapshot = Object.assign({}, (req.session && req.session._old) || {});
      const errorsSnapshot = Object.assign({}, (req.session && req.session._errors) || {});

      res.locals.errors = errorsSnapshot;
      res.locals.old = (key, fallback = '') => {
        if (!key) return fallback;
        const parts = key.split('.');
        let current = oldSnapshot;
        for (const part of parts) {
          if (current && Object.prototype.hasOwnProperty.call(current, part)) {
            current = current[part];
          } else {
            return fallback;
          }
        }
        return current ?? fallback;
      };

      // Clear after the GET response so POST->redirect->GET shows messages once
      if (req.method === 'GET') {
        res.on('finish', () => {
          try {
            if (req.session) {
              req.session._old = {};
              req.session._errors = {};
            }
          } catch (_) {}
        });
      }
      next();
    });

    // Add a global routeIs helper and make session available in views
    installApp.use((req, res, next) => {
      // Make session available in views
      res.locals.session = req.session;
      // Expose base url for forms/links
      res.locals.baseUrl = finalMountPath;
      
      // Make routeIs available globally in views
      res.locals.routeIs = (name) => {
        const currentRoute = req.app.locals.currentRouteName || '';
        return currentRoute === name;
      };
      
      next();
    });
    
    // Add middleware to ensure currentRouteName is available
    installApp.use((req, res, next) => {
      if (!req.app.locals.currentRouteName) {
        req.app.locals.currentRouteName = '';
      }
      next();
    });
    
    // Provide a resilient back route to avoid 404s if any handler redirects to "install/back"
    installApp.get('/back', (req, res) => {
      const ref = req.get('referer') || '';
      try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const u = new URL(ref, baseUrl);
        const p = (u.pathname || '').toLowerCase();
        if (p.includes('/database')) return res.redirect(finalMountPath + '/database');
        if (p.includes('/verify')) return res.redirect(finalMountPath + '/verify');
        if (p.includes('/requirements')) return res.redirect(finalMountPath + '/requirements');
      } catch (_) {}
      return res.redirect(finalMountPath + '/license');
    });

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