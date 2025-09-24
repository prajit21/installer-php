import { Router } from 'express';
import * as InstallController from '../src/controllers/InstallController.js';

const router = Router();

const nameRoute = (name, handler) => async (req, res, next) => {
  req.app.locals.currentRouteName = name;
  try { await handler(req, res, next); } catch (e) { next(e); }
};

router.get('/unblock/:project_id', nameRoute('install.unblock.show', InstallController.getUnblock));
router.post('/resetLicense', nameRoute('install.resetLicense', InstallController.postResetLicense));
router.get('/erase/:project_id', nameRoute('install.erase', InstallController.getErase));

router.post('/block/license/verify', nameRoute('install.unblock', InstallController.postUnblockVerify));
router.get('/block', nameRoute('install.block.setup', InstallController.getBlockSetup));

router.get('/install/requirements', nameRoute('install.requirements', InstallController.getRequirements));
router.get('/install/directories', nameRoute('install.directories', InstallController.getDirectories));
router.get('/install/database', nameRoute('install.database', InstallController.getDatabase));
router.get('/install/verify', nameRoute('install.verify.setup', InstallController.getVerifySetup));
router.post('/install/verify', nameRoute('install.verify', InstallController.postVerify));
router.get('/install/license', nameRoute('install.license', InstallController.getLicense));
router.post('/install/license', nameRoute('install.license.setup', InstallController.postLicense));
router.post('/install/database', nameRoute('install.database.config', InstallController.postDatabaseConfig));
router.get('/install/completed', nameRoute('install.completed', InstallController.getCompleted));

export default router;

