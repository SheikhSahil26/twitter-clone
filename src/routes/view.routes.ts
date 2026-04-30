import { Router } from "express";

import type{ Request,Response } from "express";
import { protectedRoutes } from "../middlewares/protectedRoutes.js";


const router = Router()


router.get("/",(req:Request,res:Response)=>{
    res.render("homepage")
})

router.get("/login",(req:Request,res:Response)=>{
    res.render("login")
})

router.get("/signup",(req:Request,res:Response)=>{
    res.render("signup")
})

router.get("/profile/:username",(req:Request,res:Response)=>{

    const username = req.params.username;


    res.render("profile",{username:username})
})

router.get("/profile",(req:Request,res:Response)=>{

    res.render("own-profile")
})

router.get("/tweet/:tweetId",(req:Request,res:Response)=>{
    const tweetId = req.params.tweetId;
    res.render("tweet-page",{tweetId});
})

router.get("/feed",(req:Request,res:Response)=>{
    res.render("feed")
})

router.get("/forgot-password",(req:Request,res:Response)=>{
    res.render("forgot-password")
})
router.get("/email",(req:Request,res:Response)=>{
    const token = req.query.token
    res.render("email",{token})
})
router.get("/verify-otp",(req:Request,res:Response)=>{
    const token = req.query.token
    res.render("verify-otp",{token})
})

export default router;
