import { Router } from "express";
import type{ Request,Response } from "express";
import { AuthControllers } from "../controllers/auth.controller.js";
import passport from "passport"
import GoogleStrategy from 'passport-google-oidc'
import { UserControllers } from "../controllers/user.controller.js";
import { protectedRoutes } from "../middlewares/protectedRoutes.js";
import { TweetControllers } from "../controllers/tweet.controller.js";
import { validate } from "../middlewares/validate.js";
import { TweetSchema } from "../schemas/tweet.schema.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router()

const tweetControllers = new TweetControllers()


router.post("/create-tweet",protectedRoutes,upload.array("media",4),tweetControllers.createTweet)

router.post("/retweet",protectedRoutes,tweetControllers.reTweet)

router.post("/like-unlike-tweet/:id",protectedRoutes,tweetControllers.likeUnlikeTweet)
router.post("/reply/:tweetId",protectedRoutes,upload.array("media",4),tweetControllers.replyOnTweet);
router.delete("/delete/:id",protectedRoutes,tweetControllers.deleteTweet)

router.get("/get-tweet/:tweetId",protectedRoutes,tweetControllers.getTweetById)


export default router;