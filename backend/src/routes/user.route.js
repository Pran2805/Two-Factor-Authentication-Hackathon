import { Router } from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import express from "express";
import { register, logout, login, verifyOtp, checkAuth } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.route("/verifyOtp").post(verifyOtp)
router.post("/logout", protectedRoute, logout);
router.get("/checkauth", protectedRoute, checkAuth);

export default router;
