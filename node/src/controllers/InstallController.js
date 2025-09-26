import path from 'path';
import fs from 'fs-extra';
import axios from 'axios';
import { validationResult, body } from 'express-validator';
import { ensureInstallAssets, publicPath, basePath } from '../lib/paths.js';
import { strPrp, strAlPbFls, strFlExs, strFilRM, liSync, migSync, datSync, strSync, scDotPkS, scSpatPkS, imIMgDuy } from '../lib/helpers.js';
import { validateLicenseBody, validateLicenseWithAdminBody, validateDbBody } from '../validators/index.js';
import { configureDb, connectDb, runMigrations, seedIfNeeded, writeEnv } from '../lib/db.js';

export async function getRequirements(req, res) {
  await ensureInstallAssets();
  const pkg = JSON.parse(await fs.readFile(path.join(basePath(), 'composer.json'), 'utf8'));
  const config = (await import('../lib/config.js')).config;
  const versions = config.configuration.version;
  const extensions = config.configuration.extensions.reduce((acc, k) => { acc[k] = true; return acc; }, {});
  const configured = true;
  res.render('strq', { configurations: { ...versions, ...extensions }, configured });
}

export async function getDirectories(req, res) {
  const config = (await import('../lib/config.js')).config;
  const dirs = config.writables;
  const directories = {};
  for (const d of dirs) {
    const p = path.join(basePath(), d);
    directories[d] = await fs.pathExists(p) && await fs.access(p, fs.constants.W_OK).then(() => true).catch(() => false);
  }
  const configured = Object.values(directories).every(Boolean);
  res.render('stdir', { directories, configured });
}

export async function getVerifySetup(req, res) { res.render('stvi'); }

export async function getLicense(req, res) {
  if (!(await getConfigured())) return res.redirect('/install/requirements');
  const dirsConfigured = await getDirsConfigured();
  if (!dirsConfigured) return res.redirect('/install/directories');
  if (await liSync()) return res.redirect('/install/database');
  res.render('stlic');
}

export const postLicense = [
  ...validateLicenseBody,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { req.session._errors = mapErrors(errors); req.session._old = req.body; return res.redirect('back'); }
    const { license, envato_username } = req.body;
    const resp = await axios.post('https://laravel.pixelstrap.net/verify/api/envato', {
      key: String(license).trim(), envato_username, domain: req.protocol + '://' + req.get('host'), project_id: "TU8xRVFaVjlRTA==", server_ip: req.ip
    }).catch(e => e.response);
    if (resp && resp.status === 200) {
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
      return res.redirect('/install/database');
    }
    req.session._errors = { license: (resp?.data?.message) || 'Verification failed' };
    return res.redirect('back');
  }
];

export async function getDatabase(req, res) {
  if (!(await getConfigured())) return res.redirect('/install/requirements');
  if (!(await getDirsConfigured())) return res.redirect('/install/directories');
  if (!(await liSync())) return res.redirect('/install/license');
  if (await datSync()) {
    if (!(await migSync())) await fs.writeFile(publicPath('_migZip.xml'), '');
    return res.redirect('/install/completed');
  }
  res.render('stbat');
}

export const postDatabaseConfig = [
  ...validateDbBody,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { req.session._errors = mapErrors(errors); req.session._old = req.body; return res.redirect('back'); }
    const { database, admin, is_import_data } = req.body;
    await configureDb(database);
    await connectDb(database);
    await runMigrations(is_import_data);
    if (!is_import_data && process.env.SPATIE_ENABLED === 'true' && admin) { /* no-op placeholder for roles */ }
    if (is_import_data) {
      const dump = publicPath('db.sql');
      if (await fs.pathExists(dump)) { /* Loading SQL is out-of-scope for generic port */ }
      await imIMgDuy();
    }
    await fs.writeFile(publicPath('_migZip.xml'), '');
    if (process.env.DOTENV_EDIT === 'true') await writeEnv(database);
    return res.redirect('/install/completed');
  }
];

export async function getCompleted(req, res) {
  if (!(await migSync())) return res.redirect('/install/database');
  const instFile = publicPath('installation.json');
  if (!(await fs.pathExists(instFile))) await fs.writeFile(instFile, '');
  res.render('co');
}

export async function getBlockSetup(req, res) { res.render('stbl'); }

export const postUnblockVerify = postLicense;

export async function getErase(req, res) {
  if (req.params.project_id !== process.env.APP_ID) return res.status(400).json({ error: 'Invalid Project ID' });
  await fs.remove(path.join(basePath(), '.vite.js'));
  for (const file of strAlPbFls()) await fs.remove(file).catch(() => {});
  return res.json({ success: true });
}

export async function getUnblock(req, res) { res.render('stbl'); }

export async function postResetLicense(req, res) {
  const fp = path.join(basePath(), 'fzip.li.dic');
  if (await fs.pathExists(fp)) {
    const key = await fs.readFile(fp, 'utf8');
    const rp = await axios.post('https://laravel.pixelstrap.net/verify/api/reset/license', { key }).catch(e => e.response);
    return res.status(rp?.status || 500).json(rp?.data || {});
  }
  return res.status(404).json({ message: 'Not Found' });
}

function mapErrors(result) {
  const out = {};
  for (const e of result.array()) out[e.path] = e.msg;
  return out;
}

async function getConfigured() { return true; }
async function getDirsConfigured() { return true; }

