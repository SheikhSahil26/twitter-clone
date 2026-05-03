import type { Request, Response } from "express";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { type User, type UserInput } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { UserRepository } from "../repository/user.repository.js";
import { AuthRepository } from "../repository/auth.repository.js";
import { generateRefreshToken, generateAccessToken } from "../utils/generateToken.js";
// import { generateRandomString } from "../utils/generateRandomString.js";
import crypto from "crypto";
import { success } from "zod";
import { generateOTP } from "../utils/generateOTP.js";
import { mapUpdateFields } from "../mappers/user.mapper.js";
import { measureMemory } from "vm";


type ServiceResponse<T> = {
    success: boolean;
    data?: any;
    message?: string,
    error?: string;
    statusCode?: number;
};

// interface GoogleUserInput {
//     googleId: string,
//     email?: string,
//     name?: string,
// }


export class UserService {
    async getUserProfile(username: string) {
        try {
            const profileDetails = await UserRepository.getUserProfile(username);
            console.log(profileDetails, "profile Details")

            return {
                success: true,
                data: profileDetails,
                message: "fetched profile successfully"
            }




        } catch (err) {
            return {
                success: false,
                error: "internal server error",
                statusCode: 500,
            }
        }

    }

    async getUserTweetsByUsername(username: string) {





    }


    async followUnfollowUser(username: string, userId: number) {
        try {




            const followUnfollowStatus = await UserRepository.followUnfollowUser(username, userId)

            return {
                success: true,
                message: followUnfollowStatus ? "followed user" : "unfollowed user",
                statusCode: 200,
            }


        } catch (err: any) {
            return {
                success: false,
                message: err.message,
                statusCode: 500
            }
        }
    }
    async updateProfile(userId: number, updateBody: Partial<User>) {
        try {

            const updateData = mapUpdateFields(updateBody);


            console.log(updateData, "update body")

            await UserRepository.updateProfile(updateData, userId);

            return {
                success: true,
                message: "profile updated successfully",
                statusCode: 200,
            }

        }
        catch {
            return {
                success: false,
                error: "internal server error",
                statusCode: 500,
            }
        }
    }
    async getUserTweets(userId: number, viewerId: number = userId) {
        try {
            const userOriginalTweets: any = await UserRepository.getUserTweets(userId, viewerId);

            console.log(userOriginalTweets, "tweets original in service")

            let userRetweets: any = await UserRepository.getUserRetweets(userId, viewerId);

            let userReplies: any = await UserRepository.getUserReplies(userId, viewerId);

            //i am differentiating this here in thsi service to show in frontned that this are the retweets and original by the user...

            // for(let i =0;i<userTweets.length;i++){
            //     if(userTweets[i].original_tweet_id===null){
            //         userOriginalTweets.push(userTweets[i]);
            //     }
            //     else{
            //         userRetweets.push(userTweets[i]);
            //     }
            // }

            return {
                success: true,
                message: "tweets fetched successfully",
                data: { userOriginalTweets, userRetweets, userReplies },
                statusCode: 200,
            }



        } catch (err: any) {
            return {
                success: false,
                message: err.message,
                statusCode: 500
            }
        }
    }
    async getUserFeed(userId: number) {
        //now in user feed there will be tweets of the followers and followings of the user and if we want then show the user tweets also but not doing it right now and show them in latest tweeted order desc order of created_at

        //step 1 : have to fetch the followers and followings list
        //step2 : 

        try {
            const userFeed = await UserRepository.getUserFeed(userId);

            console.log(userFeed, "tweets of users who the loggedin user follows")

            return {
                success: true,
                message: "feed fetched successfully",
                data: userFeed,
                statusCode: 200,
            }


        } catch (err: any) {
            return {
                success: false,
                message: err.message,
                statusCode: 500,
            }
        }



    }
    async getUserFollowers(userId: number, viewerId: number = userId) {
        try {
            const followers = await UserRepository.getUserFollowers(userId, viewerId);

            return {
                success: true,
                message: "followers fetched successfully",
                data: followers
            }




        } catch (err: any) {
            return {
                success: false,
                message: err.message,
                statusCode: 400,
            }
        }


    }
    async getUserFollowings(userId: number, viewerId: number = userId) {
        try {
            const followings = await UserRepository.getUserFollowings(userId, viewerId);

            return {
                success: true,
                message: "followings fetched successfully",
                data: followings,
                statusCode:200
            }




        } catch (err: any) {
            return {
                success: false,
                message: err.message,
                statusCode: 400,
            }
        }
    }

    async fetchAllUsers(userId:number) {
        try{
            const allUsers = await UserRepository.fetchAllUsers(userId);

        return {
            success:true,
            message:"all users fetched successfully",
            data:allUsers,
            statusCode : 200
        }

        }catch(err:any){
            return {
                success:false,
                message:err.message,
                statusCode : 400
            }
        }
        
    }


}
