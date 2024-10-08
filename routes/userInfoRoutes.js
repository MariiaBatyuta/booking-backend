import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { avatarMiddleware } from "../middleware/avatarMiddleware.js";
import { changeName, changeUserPhoto, getUserInfo } from "../controllers/userInfoControllers.js";
import { saveUserPayment } from "../controllers/paymentControllers.js";

const infoRouter = express.Router();
const jsonParser = express.json();

// get info
infoRouter.get("/info", authMiddleware, getUserInfo);

// change userName
infoRouter.post("/edit", authMiddleware, jsonParser, changeName);

// change photo
infoRouter.post("/edit-avatar", authMiddleware, avatarMiddleware, changeUserPhoto);

// payment
infoRouter.post("/payment/save-payment-method", authMiddleware, jsonParser, saveUserPayment);

export default infoRouter;