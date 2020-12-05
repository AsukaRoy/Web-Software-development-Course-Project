import { Router } from "../deps.js";
import { hello } from "./controllers/helloController.js";


const router = new Router();

router.get('/', hello);

export { router };