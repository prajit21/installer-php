import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { basePath, publicPath } from './paths.js';

export function strPrp() {
  if (!process.env.APP_ID) throw new Error('Removed APP ID');
  return true;
}

export function strAlPbFls() {
  return [
    publicPath('_log.dic.xml'),
    publicPath('fzip.li.dic'),
    publicPath('cj7kl89.tmp'),
    publicPath('_migZip.xml'),
    publicPath('installation.json')
  ];
}

export async function strFilRM(filePath) { if (await fs.pathExists(filePath)) await fs.remove(filePath); }
export async function strFlExs(filePath) { return fs.pathExists(filePath); }

export async function liSync() {
  const licPath = publicPath('_log.dic.xml');
  if (!(await fs.pathExists(licPath))) return false;
  const jD = await fs.readFile(licPath, 'utf8');
  if (!jD) return false;
  const currentUrl = process.env.APP_URL || '';
  if (!/^(?:f|ht)tps?:\/\//i.test(currentUrl)) {
    // allow non-url values like localhost
  }
  const cHost = tryGetHost(currentUrl);
  const dHost = tryGetHost(Buffer.from(jD, 'base64').toString('utf8'));
  const ipFile = publicPath('cj7kl89.tmp');
  if (cHost && dHost && (cHost === dHost || cHost === 'www.' + dHost || 'www.' + cHost === dHost)) return true;
  if (await fs.pathExists(ipFile)) {
    const jiP = await fs.readFile(ipFile, 'utf8');
    const savedIp = Buffer.from(jiP, 'base64').toString('utf8');
    const envIp = process.env.SERVER_ADDR || process.env.REMOTE_ADDR || '';
    if (savedIp && (envIp === savedIp)) return true;
  }
  return (cHost === 'localhost' || cHost === '127.0.0.1');
}

function tryGetHost(u) {
  try { return new URL(/^https?:\/\//.test(u) ? u : `http://${u}`).host; } catch { return null; }
}

export async function strSync() {
  if (await liSync()) {
    if (await fs.pathExists(publicPath('installation.json'))) return true;
    return (await schSync());
  }
  return false;
}

export async function schSync() { return false; }

export async function datSync() { return false; }

export async function migSync() { return fs.pathExists(publicPath('_migZip.xml')); }

export function scDotPkS() { return process.env.DOTENV_EDIT === 'true'; }
export function scSpatPkS() { return process.env.SPATIE_ENABLED === 'true'; }

export async function imIMgDuy() { return true; }

