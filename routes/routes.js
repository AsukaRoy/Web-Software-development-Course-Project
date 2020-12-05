import { Router } from "../deps.js";
import { hello } from "./controllers/helloController.js";
import * as api from "./apis/apis.js";

const router = new Router();

router.get('/', hello);
router.get('/auth/register', api.showRegistrationForm);
router.post('/auth/register', api.postRegistrationForm);
router.get('/auth/login', api.showLoginForm);
router.post('/auth/login', api.postLoginForm);

router.get('/morningReport', api.showMorningReport);
router.post('/morningReport', api.addMorningReport);

export { router };