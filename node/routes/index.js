import { Router } from 'express';
import * as InstallController from '../src/controllers/InstallController.js';

const router = Router();

const setRouteName = (name) => (req, res, next) => { req.app.locals.currentRouteName = name; next(); };

router.get('/unblock/:project_id', setRouteName('install.unblock.show'), InstallController.getUnblock);
router.get('/block/:project_id', setRouteName('install.block.api'), InstallController.getBlockProject);
router.post('/resetLicense', setRouteName('install.resetLicense'), InstallController.postResetLicense);
router.get('/erase/:project_id', setRouteName('install.erase'), InstallController.getErase);

router.post('/block/license/verify', setRouteName('install.unblock'), ...[].concat(InstallController.postUnblockVerify));
router.get('/block', setRouteName('install.block.setup'), InstallController.getBlockSetup);

router.get('/', setRouteName('install.requirements'), InstallController.getRequirements);
router.get('/install/requirements', setRouteName('install.requirements'), InstallController.getRequirements);
router.get('/install/directories', setRouteName('install.directories'), InstallController.getDirectories);
router.get('/install/database', setRouteName('install.database'), InstallController.getDatabase);
router.get('/install/verify', setRouteName('install.verify.setup'), InstallController.getVerifySetup);
router.post('/install/verify', setRouteName('install.verify'), ...(InstallController.postVerify || []));
router.get('/install/license', setRouteName('install.license'), InstallController.getLicense);
router.post('/install/license', setRouteName('install.license.setup'), ...[].concat(InstallController.postLicense));
router.post('/install/database', setRouteName('install.database.config'), ...[].concat(InstallController.postDatabaseConfig));
router.get('/install/completed', setRouteName('install.completed'), InstallController.getCompleted);

export default router;

