const path = require('path');
const fs = require('fs-extra');
const axios = require('axios');
const { validationResult, body } = require('express-validator');
const { ensureInstallAssets, publicPath, basePath } = require('../lib/paths.js');
const { strPrp, strAlPbFls, strFlExs, strFilRM, liSync, migSync, datSync, strSync, scDotPkS, scSpatPkS, imIMgDuy, getC, conF, chWr, iDconF } = require('../lib/helpers.js');
const { validateLicenseBody, validateLicenseWithAdminBody, validateDbBody, getAdminValidators } = require('../validators/index.js');
const { configureDb, connectDb, runMigrations, writeEnv, createOrUpdateAdmin } = require('../lib/db.js');

async function getRequirements(req, res) {
  await ensureInstallAssets();
  const c = getC();
  const configurations = { ...c.version, ...c.extensions };
  const configured = conF();
  res.render('strq', { title: 'Requirements', configurations, configured });
}

async function getDirectories(req, res) { return res.redirect('requirements'); }

async function getVerifySetup(req, res) { res.render('stvi', { title: 'Verify' }); }

async function getLicense(req, res) {
  if (!(await getConfigured())) return res.redirect('requirements');
  
  // Skip license verification if SKIP_LICENSE is set to true
  if (process.env.SKIP_LICENSE === 'true') {
    return res.redirect('database');
  }
  
  // Check if license files exist and are valid
  const licPath = publicPath('_log.dic.xml');
  const hasValidLicense = await fs.pathExists(licPath);
  
  if (hasValidLicense && await liSync()) {
    return res.redirect('database');
  }
  
  // Clear previous residual license files if they exist but are invalid
  if (hasValidLicense) {
    for (const f of strAlPbFls()) { try { await fs.remove(f); } catch(e) {} }
  }
  
  res.render('stlic', { title: 'License' });
}

const postLicense = [
  ...validateLicenseBody,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { req.session._errors = mapErrors(errors, true); req.session._old = req.body; return res.redirect('back'); }
    const { license, envato_username } = req.body;
    
    // Check if we're in development/localhost mode
    const isLocalhost = req.get('host').includes('localhost') || req.get('host').includes('127.0.0.1');
    const isDevelopment = process.env.NODE_ENV === 'development' || process.env.SKIP_LICENSE_VERIFICATION === 'true';
    
    let verificationSuccess = false;
    
    if (isLocalhost || isDevelopment) {
      // Skip API verification for localhost/development
      console.log('Skipping license API verification for localhost/development');
      verificationSuccess = true;
    } else {
      // Try API verification for production
      const resp = await axios.post('https://laravel.pixelstrap.net/verify/api/envato', {
        key: String(license).trim(), envato_username, domain: req.protocol + '://' + req.get('host'), project_id: process.env.APP_ID, server_ip: req.ip
      }).catch(e => e.response);
      verificationSuccess = resp && resp.status === 200;
    }
    
    if (verificationSuccess) {
      // Create license files
      const pubDir = path.join(basePath(), 'public');
      await fs.ensureDir(pubDir);
      const fzipPath = publicPath('fzip.li.dic');
      await fs.writeFile(fzipPath, Buffer.from(String(license).trim()).toString('base64'));
      const logPath = publicPath('_log.dic.xml');
      const currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
      const cleaned = currentUrl.replace('block/license/verify', '').replace('install/license', '').replace('install/verify', '');
      if (!(await fs.pathExists(logPath))) {
        await fs.writeFile(logPath, Buffer.from(cleaned).toString('base64'));
      }
      const ipPath = publicPath('cj7kl89.tmp');
      const serverIp = req.socket?.localAddress || req.ip || '';
      await fs.writeFile(ipPath, Buffer.from(serverIp).toString('base64'));
      req.session.licenseVerified = true;
      return res.redirect('database');
    }
    
    req.session._errors = { license: 'Verification failed' };
    return res.redirect('back');
  }
];

async function getDatabase(req, res) {
  if (!(await getConfigured())) return res.redirect('requirements');
  if (!(await getDirsConfigured())) return res.redirect('directories');
  
  // Skip license check if SKIP_LICENSE is set to true
  if (process.env.SKIP_LICENSE !== 'true' && !(await liSync())) {
    return res.redirect('license');
  }
  
  if (await datSync()) {
    if (!(await migSync())) await fs.writeFile(publicPath('_migZip.xml'), '');
    return res.redirect('completed');
  }
  res.render('stbat', { title: 'Database' });
}

const postDatabaseConfig = [
  async (req, res, next) => {
    try {
      const validators = getAdminValidators();
      for (const v of validators) { await v.run(req); }
      return next();
    } catch (e) { return next(e); }
  },
  ...validateDbBody,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { req.session._errors = mapErrors(errors, true); req.session._old = req.body; return res.redirect('back'); }
    const { database, admin, is_import_data } = req.body;
    try {
      // Get existing user model from the installation wizard if available
      let userModel = null;
      if (req.app.locals.installWizard && req.app.locals.installWizard.options.existingUserModel) {
        userModel = req.app.locals.installWizard.options.existingUserModel;
      }
      
      await configureDb(database, userModel);
      await connectDb(database);
      await runMigrations();
      if (!is_import_data && admin) { await createOrUpdateAdmin(admin); }
    } catch (e) {
      const dbFieldErrors = mapDbConnectionError(e);
      req.session._errors = dbFieldErrors;
      req.session._old = req.body;
      return res.redirect('back');
    }
    if (is_import_data) {
      const dump = publicPath('db.sql');
      if (await fs.pathExists(dump)) { /* Loading SQL is out-of-scope for generic port */ }
      await imIMgDuy();
    }
    await fs.writeFile(publicPath('_migZip.xml'), '');
    if (process.env.DOTENV_EDIT === 'true') await writeEnv(database);
    return res.redirect('completed');
  }
];

async function getCompleted(req, res) {
  if (!(await migSync())) return res.redirect('database');
  const instFile = publicPath('installation.json');
  if (!(await fs.pathExists(instFile))) await fs.writeFile(instFile, '');
  res.render('co', { title: 'Installation Completed' });
}

async function getBlockSetup(req, res) { res.render('stbl', { title: 'Verify' }); }

const postUnblockVerify = postLicense;

async function getErase(req, res) {
  if (req.params.project_id !== process.env.APP_ID) return res.status(400).json({ error: 'Invalid Project ID' });
  await fs.remove(path.join(basePath(), '.vite.js'));
  for (const file of strAlPbFls()) await fs.remove(file).catch(() => {});
  return res.json({ success: true });
}

async function getUnblock(req, res) {
  // pHUnBlic(): remove block flag
  await fs.remove(path.join(basePath(), '.vite.js'));
  return res.json({ success: true });
}

async function postResetLicense(req, res) {
  try {
    // Clear all license files like PHP version does
    for (const f of strAlPbFls()) { 
      try { 
        await fs.remove(f); 
      } catch(e) {
        console.log('Error removing file:', f, e.message);
      } 
    }
    
    // Also try to reset via API if license file exists
    const fp = path.join(basePath(), 'fzip.li.dic');
    if (await fs.pathExists(fp)) {
      const key = await fs.readFile(fp, 'utf8');
      const rp = await axios.post('https://laravel.pixelstrap.net/verify/api/reset/license', { key }).catch(e => e.response);
      return res.status(rp?.status || 200).json({ 
        success: true, 
        message: 'License reset successfully',
        ...rp?.data 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'License files cleared successfully' 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

async function getBlockProject(req, res) {
  if (req.params.project_id !== process.env.APP_ID) return res.status(400).json({ error: 'Invalid Project ID' });
  const vite = path.join(basePath(), '.vite.js');
  if (!(await fs.pathExists(vite))) await fs.writeFile(vite, '');
  for (const f of strAlPbFls()) { try { await fs.remove(f); } catch(e) {} }
  return res.json({ success: true });
}

function mapErrors(result, firstOnly = false) {
  const out = {};
  const arr = firstOnly ? result.array({ onlyFirstError: true }) : result.array();
  for (const e of arr) out[e.path] = e.msg;
  return out;
}

function mapDbConnectionError(err) {
  const out = {};
  const code = err?.parent?.code || err?.original?.code || err?.code || '';
  const message = (err?.message || err?.parent?.sqlMessage || '').toString();
  if (message.match(/Access denied/i) || /ER_ACCESS_DENIED_ERROR/.test(code)) {
    out['database.DB_USERNAME'] = 'Access denied: invalid username or password';
    out['database.DB_PASSWORD'] = 'Access denied: invalid username or password';
    return out;
  }
  if (message.match(/Unknown database/i) || /ER_BAD_DB_ERROR/.test(code)) {
    out['database.DB_DATABASE'] = 'Unknown database or insufficient privileges';
    return out;
  }
  if (/ENOTFOUND|EAI_AGAIN/i.test(code) || message.match(/getaddrinfo|not known/i)) {
    out['database.DB_HOST'] = 'Unable to resolve host';
    return out;
  }
  if (/ECONNREFUSED|EHOSTUNREACH|ETIMEDOUT/i.test(code) || message.match(/connect ECONNREFUSED|timeout/i)) {
    out['database.DB_HOST'] = 'Connection refused/unreachable';
    out['database.DB_PORT'] = 'Check port and firewall';
    return out;
  }
  // Default generic mapping
  out['database.DB_HOST'] = message || 'Database connection error';
  return out;
}

async function getConfigured() { return true; }
async function getDirsConfigured() { return true; }

module.exports = {
  getRequirements,
  getDirectories,
  getVerifySetup,
  getLicense,
  postLicense,
  getDatabase,
  postDatabaseConfig,
  getCompleted,
  getBlockSetup,
  postUnblockVerify,
  getErase,
  getUnblock,
  postResetLicense,
  getBlockProject
};

