import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import jwt from "jsonwebtoken"
import { ref } from "node:process";
import { UserService } from "../services/user.service.js";
import { TweetService } from "../services/tweet.service.js";
import { TweetRepository } from "../repository/tweet.repository.js";


const tweetService = new TweetService();

export class TweetControllers {

 

    async createTweet(req: Request, res: Response) {
        console.log(req.body, "this is tweet from controller");
        
        try {
            const userId = (req as any).user.payload.id

    //           const multerFiles = req.files as Express.Multer.File[];

    //           console.log(multerFiles,"this are multer files")
    // const mediaArray = multerFiles?.map(file => ({
    //     tweet_content_url: file.path 
    // })) || [];
            let mediaUrls : string[]= []
    if(Array.isArray(req.files)){
         mediaUrls = req.files?.map((file: any) => '/uploads/' + file.filename) || []
     }
     console.log(mediaUrls,"asdfasd")
    // console.log(mediaArray,"this is media array for tweet")

     let tweetBody = req.body
     tweetBody.media = mediaUrls


            const resp = await tweetService.createTweet(tweetBody, userId)

            if(!resp.success){
                return res.status(resp.statusCode).json({
                    error:resp.error,
                    message : resp.message
                })
            }

            return res.status(resp.statusCode).json({
                success:true,
                message:resp.message,
            })




        } catch (err: any) {
            return res.status(500).json({
                error:"internal server error!!"
            })
        }
    }

    async reTweet(req:Request,res:Response){
        try{
            const tweetId = req.body.tweet_id;
            const userId = (req as any).user.payload.id; // id of user who is retweeting!!;

            const resp = await tweetService.reTweet(tweetId,userId)

            if(!resp.success){
                return res.status(resp.statusCode).json({
                    error:resp.message,
                })
            }

            return res.status(resp.statusCode).json({
                message:resp.message,
                data:resp.data,
            })

        }catch(err){
            return res.status(500).json({
                error:"internal server error!!"
            })
        }
    }

    async likeUnlikeTweet(req:Request,res:Response){
        try{
            const tweetId = Number(req.params.id)
             const userId = (req as any).user.payload.id
        const resp :any = await tweetService.likeUnlikeTweet(tweetId,userId)

        console.log(resp.data)
        console.log("reached like contorller")
        if(!resp.success){
            return res.status(resp.statusCode).json({
                error:resp.message,
            })
        }

        return res.status(resp.statusCode).json({
            message:resp.message,
            data:resp.data
        })


        }catch(err){
            return res.status(500).json({
                error:"internal server error"
            })
        }
       


    }

    async replyOnTweet(req:Request,res:Response){
        try{
            const tweetId = Number(req.params.tweetId);
            const userId = (req as any).user.payload.id;

            let mediaUrls : string[]= []
    if(Array.isArray(req.files)){
         mediaUrls = req.files?.map((file: any) => '/uploads/' + file.filename) || []
     }
     console.log(mediaUrls,"asdfasd")



            const replyTweetBody = req.body;

            replyTweetBody.media = mediaUrls;


            console.log(replyTweetBody,"reply tweet body")

            const resp :any= await tweetService.replyOnTweet(replyTweetBody,tweetId,userId)


            if(!resp.success){
                return res.status(resp.statusCode).json({
                    error:resp.message,
                })
            }

            return res.status(resp.statusCode).json({
                message : resp.message,
            })


        }catch(err){
            return res.status(500).json({
                error:"internal server error"
            })
        }
    }

    async deleteTweet(req:any,res:Response){
        const tweetId = Number(req.params.id);
        const resp = await tweetService.deleteTweet(tweetId);


        return res.status(200).json({
            message:"tweet deleted successfully!!"
        })

    }

    async getTweetById(req:Request,res:Response){

        const tweetId = Number(req.params.tweetId)
        const userId = (req as any).user.payload.id
        console.log(tweetId)

        const resp = await tweetService.getTweetById(tweetId,userId);
       
        
        console.log(resp.data,"controller")
        console.log(resp.data.tweet,"tweet")
        console.log(resp.data.tweetReplies,"replies")

        return res.status(200).json({
            tweet : resp.data.tweet,
            replies : resp.data.tweetReplies,
            message : "tweet fetched successfully"
        })


    }

}
