import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import jwt from "jsonwebtoken"
import { ref } from "node:process";
import { UserService } from "../services/user.service.js";
import { formatTweetData } from "../utils/formatTweets.js";

const userService = new UserService();

export class UserControllers {

    async getOwnProfile(req: Request, res: Response) {
        try {
            const username = (req as any).user.payload.username

            const resp = await userService.getUserProfile(username)


            if (!resp.success) {
                return res.status(400).json({
                    error: "error occured while fetching profile"
                })
            }


            return res.status(200).json({
                success: "profile fetched successfully",
                profileData: resp.data,
            })


        } catch (err) {

            return res.status(500).json({
                error: "internal server error!!!"
            })

        }

    }

    async getUserTweetsByUsername(req:Request,res:Response){
        try {
            const username = req.params.username as string
            const viewerId = (req as any).user.payload.id
            
            const userData:any = await userService.getUserProfile(username)

            const userId = userData.data.id
            
            const resp :any = await userService.getUserTweets(userId, viewerId);


            if (!resp.success) {
                return res.status(resp.statusCode).json({
                    error: resp.message,
                })
            }

            const  userRetweets= formatTweetData(resp.data?.userRetweets)
            const userReplies = formatTweetData(resp.data?.userReplies)
            const userOriginalTweets = formatTweetData(resp.data?.userOriginalTweets)

            console.log(resp.data,"user tweets")
            return res.status(resp.statusCode).json({
                message: resp.message,
                tweets: {userRetweets,userReplies,userOriginalTweets}
            })


        } catch (err) {
            return res.status(500).json({
                error: "internal server error",
            })
        }

    }


    async getUserProfile(req: Request, res: Response) {
        try {
            const username: any = req.params.username?.toString()
            console.log(username, "username")
            const resp = await userService.getUserProfile(username)


            if (!resp.success) {
                return res.status(400).json({
                    error: "error occured while fetching profile"
                })
            }


            return res.status(200).json({
                success: "profile fetched successfully",
                profileData: resp.data,
            })


        } catch (err) {

            return res.status(500).json({
                error: "internal server error!!!"
            })
        }


    }
    async followUnfollowUser(req: Request, res: Response) {
        try {
            const username = req.params.username as string;
            const userId = (req as any).user.payload.id
            const resp = await userService.followUnfollowUser(username, userId)

            if (!resp.success) {
                return res.status(resp.statusCode).json({
                    error: resp.message,
                })
            }

            return res.status(resp.statusCode).json({
                message: resp.message,
                is_followed: resp.message === "followed user",
                
            })




        }
        catch (err) {
            return res.status(500).json({
                error: "internal server error"
            })
        }





    }
    async updateProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).user.payload.id
            const updateBody = req.body

            const files: any = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

            console.log(files, "These are the files object");

            if (files?.profile_photo_url?.[0]) {
                updateBody.profile_photo_url = `/uploads/${files.profile_photo_url[0].filename}`
            }

            if (files?.cover_image_url?.[0]) {
                updateBody.cover_image_url = `/uploads/${files.cover_image_url[0].filename}`;
            }

            const resp = await userService.updateProfile(userId, updateBody);

            if (resp && !resp.success) {
                return res.status(resp.statusCode || 500).json({
                    error: resp.error
                })
            }

            return res.status(200).json({
                message:"profile updated successfully",
            })
        } catch (err) {
            return res.status(500).json({
                error: "internal server error",
            })
        }


    }
    async getUserTweets(req: Request, res: Response) {
        try {
            const userId = (req as any).user.payload.id
            
            
            const resp = await userService.getUserTweets(userId)


            if (!resp.success) {
                return res.status(resp.statusCode).json({
                    error: resp.message,
                })
            }

            const  userRetweets= formatTweetData(resp.data?.userRetweets)
            const userReplies = formatTweetData(resp.data?.userReplies)
            const userOriginalTweets = formatTweetData(resp.data?.userOriginalTweets)

            console.log(resp.data,"user tweets")
            return res.status(resp.statusCode).json({
                message: resp.message,
                tweets: {userRetweets,userReplies,userOriginalTweets}
            })


        } catch (err) {
            return res.status(500).json({
                error: "internal server error",
            })
        }

    }

    async groupTweets(rows: any[]) {
        const map: any = {};
        rows.forEach((row) => {
            if (!map[row.tweet_id]) {
                map[row.tweet_id] = {
                    ...row,
                    media: [],
                }
            }
            //before: row.media_url
            if (row.tweet_content_url) {
                map[row.tweet_id].media.push(row.tweet_content_url)
            }
        })
        return Object.values(map);
    }
    async getUserFeed(req: Request, res: Response) {
        try {
            const userId = (req as any).user.payload.id
            const resp: any = await userService.getUserFeed(userId)


            if (!resp.success) {
                return res.status(resp.statusCode).json({
                    error: resp.message,
                })
            }
            console.log(resp.data, "resp data ion contorller")

            let rows: any = resp.data

            const map: any = {};
            rows.forEach((row: any) => {
                if (!map[row.tweet_id]) {
                    map[row.tweet_id] = {
                        ...row,
                        media: [],
                    }
                }
                //before: row.media_url
                if (row.tweet_content_url) {
                    map[row.tweet_id].media.push(row.tweet_content_url)
                }
            })

            let finalData = Object.values(map)

            console.log("final data", finalData)

            return res.status(resp.statusCode).json({
                message: resp.message,
                feed: finalData,
            })

        } catch (err) {
            return res.status(500).json({
                error: "internal server error",
            })
        }








    }
    async getUserFollowers(req: Request, res: Response) {

        try{
            const userId = (req as any).user.payload.id
    
            const resp:any = await userService.getUserFollowers(userId)
    
             if(!resp.success){
                    return res.status(resp.statusCode).json({
                        error:resp.message,
                    })
                }
    
                return res.status(200).json({
                    followers:resp.data,
                    success:true,
                })
            
        }catch(err){
            return res.status(500).json({
                error:"internal server error"
            })
        }

        
    }
    async getUserFollowings(req: Request, res: Response) {

         try{
            const userId = (req as any).user.payload.id
    
            const resp:any = await userService.getUserFollowings(userId)
    
             if(!resp.success){
                    return res.status(resp.statusCode).json({
                        error:resp.message,
                    })
                }
    
                return res.status(200).json({
                    followings:resp.data,
                    success:true,
                    message:resp.message,
                })
            
        }catch(err){
            return res.status(500).json({
                error:"internal server error"
            })
        }
    }

    async getFollowersByUsername(req:Request,res:Response){
          try{
            const username = req.params.username as string
            const viewerId = (req as any).user.payload.id
    
            const userData:any = await userService.getUserProfile(username)

            const userId = userData.data.id;

            const resp :any = await userService.getUserFollowers(userId, viewerId)
    
             if(!resp.success){
                    return res.status(resp.statusCode).json({
                        error:resp.message,
                    })
                }
    
                return res.status(200).json({
                    followers:resp.data,
                    success:true,
                })
            
        }catch(err){
            return res.status(500).json({
                error:"internal server error"
            })
        }
    }

    async getFollowingsByUsername(req:Request,res:Response){
        try{
            const username = req.params.username as string
            const viewerId = (req as any).user.payload.id
    
            const userData:any = await userService.getUserProfile(username)

            const userId = userData.data.id;

            const resp :any = await userService.getUserFollowings(userId, viewerId)

    
             if(!resp.success){
                    return res.status(resp.statusCode).json({
                        error:resp.message,
                    })
                }
    
                return res.status(200).json({
                    followings:resp.data,
                    success:true,
                    message:resp.message,
                })
            
        }catch(err){
            return res.status(500).json({
                error:"internal server error"
            })
        }
    }


    async fetchAllUsers(req:Request,res:Response){
        try{
            const userId = (req as any).user.payload.id;
            const resp = await userService.fetchAllUsers(userId);
            console.log(resp,"in controller");

            if(!resp.success){
                return res.status(resp.statusCode).json({
                    error:resp.message,
                })
            }

            return res.status(200).json({
                allUsers:resp.data,
                success:true,
            })

        }catch(err){
            return res.status(500).json({
                error:"internal server error"
            })
        }
    }

}
