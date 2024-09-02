import express from "express";
import { authGoogle, callbackGoogle, userLogin, userLogout } from "../controllers/loginControllers.js";
import {authMiddleware} from "../middleware/authMiddleware.js"

const loginRouter = express.Router();
const jsonParser = express.json();

// login
loginRouter.post("/login", jsonParser, userLogin);
loginRouter.post("/logout", authMiddleware, userLogout);
// google login
loginRouter.post("/auth/google", authGoogle);
loginRouter.post("/auth/google/callback", callbackGoogle);

export default loginRouter;