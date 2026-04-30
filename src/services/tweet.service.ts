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
import { TweetRepository } from "../repository/tweet.repository.js";
import type { Tweet } from "../models/tweet.model.js";
import { mapTweetFields } from "../mappers/tweet.mapper.js";


type ServiceResponse<T> = {
    success: boolean;
    data?: any;
    message?: string,
    error?: string;
    statusCode: number;
};

// interface GoogleUserInput {
//     googleId: string,
//     email?: string,
//     name?: string,
// }


export class TweetService {
    async createTweet(tweetBody: Tweet, userId: number): Promise<ServiceResponse<any>> {
        try {
            const tweetData = mapTweetFields(tweetBody)

            console.log(tweetBody, "tweet data from service")
            const insertId = await TweetRepository.createTweet(tweetData, userId)



            return {
                success: true,
                data: insertId,
                message: "tweet created successfully",
                statusCode: 200,
            }
        }
        catch (err: any) {
            return {
                success: false,
                error: err.message,
                statusCode: 500,
            }
        }
    }

    async reTweet(tweetId: number, userId: number): Promise<ServiceResponse<any>> {

        const retweetStatus = await TweetRepository.reTweet(tweetId, userId);


        //try catch is remaining later i will add!!!!


        return {
            success : true,
            data : [],
            message : retweetStatus ? "retweet deleted" : "tweet retweeted successfully",
            statusCode : 200,
        }
    }

    async likeUnlikeTweet(tweetId: number, userId: number): Promise<ServiceResponse<any>> {
        try {
            const likedStatus = await TweetRepository.likeUnlikeTweet(tweetId, userId);

            return {
                success: true,
                data: likedStatus,
                message: likedStatus ? "liked your tweet" : "unliked the tweet",
                statusCode: 200
            }

        } catch (err: any) {
            return {
                success: false,
                message: err.message,
                statusCode: 500
            }
        }

    }

    async replyOnTweet(replyTweetBody:Partial<Tweet>,tweetId: number, userId: number) {
        try {

            const insertId = await TweetRepository.replyOnTweet(replyTweetBody,tweetId, userId);

            return {
                success:true,
                message :"replied on tweet",
                statusCode: 200,
            }



        } catch (err:any) {
            return {
                success:false,
                message:err.message,
                statusCode : 500,
            }
        }
    }
    async deleteTweet(tweetId:number){
        const isDeleted = await TweetRepository.deleteTweet(tweetId);
    }


    async getTweetById(tweetId:number){
        const tweet = await TweetRepository.getTweetById(tweetId);
        const tweetReplies = await TweetRepository.getRepliesById(tweetId)

        console.log(tweet,tweetReplies)

        return {
            success:true,
            data:{tweet,tweetReplies},
            statusCode : 200,
        }
    }


}