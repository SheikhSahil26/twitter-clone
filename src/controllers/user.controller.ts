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
            
            const userData:any = await userService.getUserProfile(username)

            const userId = userData.data.id
            
            const resp :any = await userService.getUserTweets(userId);


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
                
            })




        }
        catch (err) {
            return res.status(500).json({
                error: "internal server error"
            })
        }





    }
    async updateProfile(req: Request, res: Response) {
        const userId = (req as any).user.payload.id
        const updateBody = req.body

        const files: any = req.files as { [fieldname: string]: Express.Multer.File[] };

        console.log(files, "These are the files object");

        const profile_photo_url = files.profile_photo_url[0].path || null;

        const cover_image_url = files.cover_image_url[0].path || null;

        updateBody.profile_photo_url = `/uploads/${files.profile_photo_url[0].filename}`
        updateBody.cover_image_url = `/uploads/${files.cover_image_url[0].filename}`;

        const resp = await userService.updateProfile(userId, updateBody);


        return res.status(200).json({
            message:"profile updated successfully",
        })


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

        const userId = (req as any).user.payload.id

        const resp = await userService.getUserFollowers(userId)

        return res.status(200).json({
            message: "got followers of logged in user"
        })
    }
    async getUserFollowings(req: Request, res: Response) {

        const userId = (req as any).user.payload.id

        const resp = await userService.getUserFollowings(userId)

        return res.status(200).json({
            message: "got followings of logged in user"
        })
    }

    async fetchAllUsers(req:Request,res:Response){
        try{
            const allUsers = await userService.fetchAllUsers();
            console.log(allUsers,"in controller");

            return res.status(200).json({
                allUsers:allUsers,
                success:true,
            })

        }catch(err){
            return res.status(500).json({
                error:"internal server error"
            })
        }
    }

}