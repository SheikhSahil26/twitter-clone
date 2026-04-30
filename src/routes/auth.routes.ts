import { Router } from "express";
import type{ Request,Response } from "express";
import { AuthControllers } from "../controllers/auth.controller.js";
import passport from "passport"
import { validate } from '../middlewares/validate.js';
import { UserSchema } from '../schemas/user.schema.js';
import GoogleStrategy from 'passport-google-oidc'
const router = Router()

const authControllers = new AuthControllers();

router.post("/signup",validate(UserSchema),authControllers.signUp)
router.post("/login",authControllers.login)
router.post("/forgot-password",authControllers.forgotPassword)
router.post("/verify-otp",authControllers.verifyOtp);
router.post("/reset-password",authControllers.resetPassword);
router.post("/refresh-token",authControllers.refreshToken)
router.get("/get-otp/:token",authControllers.getOtp)
// router.post("/logout",authControllers.logout)
// router.get('/login/federated/google', passport.authenticate('google'));

export default router;