// const express = require("express")
import express from "express"
import dotenv from "dotenv"

dotenv.config();
// import fs from "fs"
import path from "path"
// import { buildApiRouter } from './routes/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import svgCaptcha from "svg-captcha";
import session from "express-session";
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session'
import ViewRoutes from "./routes/view.routes.js";
import AuthRoutes from "./routes/auth.routes.js"
import UserRoutes from "./routes/user.routes.js"
import TweetRoutes from "./routes/tweet.routes.js"
import type{ Request,Response } from "express";
const PORT = process.env.PORT;


const __filename = fileURLToPath(import.meta.url);

// Get the directory name from the file path
const __dirname = dirname(__filename);

// const upload = require("./middlewares/file-upload")
// import upload from "./middlewares/file-upload.js"
const app = express();
// app.use(cors());
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "../views"));
app.use('/public', express.static(path.join(process.cwd(), 'src/public')));

app.use(express.static(path.join(__dirname,"../public")))
// app.use("/uploads",express.static(path.join(process.cwd(), 'src/public')));

// app.use("/uploads",express.static('uploads'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());

app.use(session({
  secret : "session_secret",
  resave : false,
  saveUninitialized : true , 
  cookie : {
    secure : false,
  }
}))



// app.get("/",(req:Request, res:Response) => {
//    res.render("home")
// })

app.use("/",ViewRoutes);
app.use("/api/auth",AuthRoutes);
app.use("/api/user",UserRoutes)
app.use("/api/tweet",TweetRoutes)


// app.get('/captcha', function (req:any, res:any) {
//   // Create a random character captcha
//   const captcha = svgCaptcha.create({
//     size: 4,          // Number of characters
//     noise: 2,         // Number of noise lines
//     color: true,      // Colored characters
//     background: '#cc9966' // Background color
//   });

//   console.log(captcha);

//   // console.log(req.session);

//   // Store text in session for validation
//   (req.session as any).captcha = captcha.text;

//   // Send the SVG image to the client
//   res.type('svg');
//   res.status(200).send(captcha.data);
// });

// app.post("/verify-captcha",(req:Request,res:Response)=>{
//     const captcha = req.body.captcha;
//     console.log(req)
//     console.log(captcha,"captcha from user");

//     if((req.session as any).captcha !== captcha){
//       return res.json({
//         error:"invalid captcha"
//       })
//     }


// })






app.listen(PORT,()=>{
    console.log("server started at port",PORT);
})

