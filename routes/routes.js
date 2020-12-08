import { Router } from "../deps.js";
import { hello } from "./controllers/helloController.js";
import * as api from "./apis/apis.js";

const router = new Router();

router.get('/', hello);
router.get('/auth/register', api.showRegistrationForm);
router.post('/auth/register', api.postRegistrationForm);
router.get('/auth/login', api.showLoginForm);
router.post('/auth/login', api.postLoginForm);

router.get("/behavior/reporting", api.behaviorReporting);

router.get('/morningReport', api.showMorningReport);
router.post('/morningReport', api.addMorningReport);

router.get('/eveningReport', api.showEveningReport);
router.post('/eveningReport', api.addEveningReport);

router.get('/behavior/summary', api.getSummarization);
router.post('/behavior/summary', api.postSummarization);

router.get('/weeklyMorningReport', api.getSummarization);

export { router };