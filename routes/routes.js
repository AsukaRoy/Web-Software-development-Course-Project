import { Router } from "../deps.js";

import * as api from "./apis/apis.js";
import * as userController from "./controllers/userController.js";
import * as reportController from "./controllers/reportController.js";
import * as summaryController from "./controllers/summaryController.js";

const router = new Router();

router.get('/', userController.showRoot);

router.get('/auth/register', userController.showRegistrationForm);
router.post('/auth/register', userController.postRegistrationForm);

router.get('/auth/login', userController.showLoginForm);
router.post('/auth/login', userController.postLoginForm);
router.get('/auth/logout', userController.logout);

router.get("/behavior/reporting", reportController.behaviorReporting);
router.get('/morningReport', reportController.showMorningReport);
router.post('/morningReport', reportController.addMorningReport);
router.get('/eveningReport', reportController.showEveningReport);
router.post('/eveningReport', reportController.addEveningReport);

router.get('/behavior/summary', summaryController.getSummarization);
router.post('/behavior/summary', summaryController.postSummarization);


router.get('/api/summary', api.getAverageWeeklyReport);
router.get('/api/summary/:year/:month/:day', api.getAverageDailyReport);


export { router };