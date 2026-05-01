import { Router } from "express";
import type{ Request,Response } from "express";
import { AuthControllers } from "../controllers/auth.controller.js";
import passport from "passport"
import GoogleStrategy from 'passport-google-oidc'
import { UserControllers } from "../controllers/user.controller.js";
import { protectedRoutes } from "../middlewares/protectedRoutes.js";
import { UpdateUserSchema } from "../schemas/user.schema.js";
import { upload } from "../middlewares/multer.middleware.js";
import { validate } from "../middlewares/validate.js";
const router = Router()

const userControllers=new UserControllers();

router.get("/get-profile-own",protectedRoutes,userControllers.getOwnProfile)

router.get("/get-profile/:username",protectedRoutes,userControllers.getUserProfile)

router.patch("/update-profile",protectedRoutes,upload.fields([{name:'profile_photo_url',maxCount:1},{name:'cover_image_url',maxCount:1}]),validate(UpdateUserSchema),userControllers.updateProfile)

router.post("/follow-unfollow-user/:username",protectedRoutes,userControllers.followUnfollowUser)

router.get("/get-user-tweets/",protectedRoutes,userControllers.getUserTweets)

router.get("/get-user-tweets/:username",protectedRoutes,userControllers.getUserTweetsByUsername)

router.get("/get-user-followers/:username",protectedRoutes,userControllers.getFollowersByUsername)

router.get("/get-user-followings/:username",protectedRoutes,userControllers.getFollowingsByUsername)

router.get("/user-feed",protectedRoutes,userControllers.getUserFeed);

router.get("/get-user-followers",protectedRoutes,userControllers.getUserFollowers)

router.get("/get-user-followings",protectedRoutes,userControllers.getUserFollowings)

router.get("/get-all-users",protectedRoutes,userControllers.fetchAllUsers)


export default router;