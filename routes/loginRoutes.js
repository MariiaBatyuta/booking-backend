import express from "express";
import { authGoogle, callbackGoogle, userLogin, userLogout } from "../controllers/loginControllers.js";
import {authMiddleware} from "../middleware/authMiddleware.js"

const loginRouter = express.Router();
const jsonParser = express.json();

loginRouter.post("/login", jsonParser, userLogin);
loginRouter.post("/logout", authMiddleware, userLogout);

loginRouter.post("/auth/google", authGoogle);
loginRouter.post("/auth/google/callback", callbackGoogle);

export default loginRouter;