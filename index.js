/**
 * BladeLib Node - Installation Wizard Package
 * Main entry point for the npm package
 */

export { default as InstallWizard } from './lib/install.js';
export { UserModel, syncUserModel, checkUserModelCompatibility } from './lib/models.js';
export { configureDb, connectDb, runMigrations, createOrUpdateAdmin } from './node/src/lib/db.js';

// Re-export commonly used utilities
export { 
  strPrp, 
  strAlPbFls, 
  strFlExs, 
  strFilRM, 
  liSync, 
  migSync, 
  datSync, 
  strSync, 
  scDotPkS, 
  scSpatPkS, 
  imIMgDuy, 
  getC, 
  conF, 
  chWr, 
  iDconF 
} from './node/src/lib/helpers.js';

// Version info
export const version = '1.0.0';