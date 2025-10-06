const { Router, urlencoded, json } = require('express');
const InstallController = require('../src/controllers/InstallController.js');

const router = Router();

// Ensure request bodies for this router support nested fields
router.use(json());
router.use(urlencoded({ extended: true }));

// Ensure required view locals exist even when host app doesn't provide them
router.use((req, res, next) => {
  // session (optional)
  res.locals.session = req.session || res.locals.session || {};

  // errors map
  if (typeof res.locals.errors !== 'object' || res.locals.errors === null) {
    res.locals.errors = Object.assign({}, (req.session && req.session._errors) || {});
  }

  // old() helper for repopulating forms
  if (typeof res.locals.old !== 'function') {
    const oldSnapshot = Object.assign({}, (req.session && req.session._old) || {});
    res.locals.old = (key, fallback = '') => {
      if (!key) return fallback;
      const parts = String(key).split('.');
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
  }

  // routeIs helper used by layouts
  if (typeof res.locals.routeIs !== 'function') {
    res.locals.routeIs = (name) => {
      const current = req.app.locals.currentRouteName || '';
      return current === name;
    };
  }

  // Reset one-time snapshots if session is present
  if (req.session) {
    req.session._old = {};
    req.session._errors = {};
  }

  next();
});

const setRouteName = (name) => (req, res, next) => { 
  req.app.locals.currentRouteName = name; 
  next(); 
};

router.get('/unblock/:project_id', setRouteName('install.unblock.show'), InstallController.getUnblock);
router.get('/block/:project_id', setRouteName('install.block.api'), InstallController.getBlockProject);
router.post('/resetLicense', setRouteName('install.resetLicense'), InstallController.postResetLicense);
router.get('/resetLicense', setRouteName('install.resetLicense.get'), InstallController.postResetLicense);
router.get('/erase/:project_id', setRouteName('install.erase'), InstallController.getErase);

router.post('/block/license/verify', setRouteName('install.unblock'), ...[].concat(InstallController.postUnblockVerify));
router.get('/block', setRouteName('install.block.setup'), InstallController.getBlockSetup);

// Main installation routes (when mounted at /install, these become /install/, /install/requirements, etc.)
router.get('/', setRouteName('install.requirements'), InstallController.getRequirements);
router.get('/requirements', setRouteName('install.requirements'), InstallController.getRequirements);
router.get('/directories', setRouteName('install.directories'), InstallController.getDirectories);
router.get('/database', setRouteName('install.database'), InstallController.getDatabase);
router.get('/verify', setRouteName('install.verify.setup'), InstallController.getVerifySetup);
router.post('/verify', setRouteName('install.verify'), ...(InstallController.postVerify || []));
router.get('/license', setRouteName('install.license'), InstallController.getLicense);
router.post('/license', setRouteName('install.license.setup'), ...[].concat(InstallController.postLicense));
router.post('/database', setRouteName('install.database.config'), ...[].concat(InstallController.postDatabaseConfig));
router.get('/completed', setRouteName('install.completed'), InstallController.getCompleted);

module.exports = router;