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


type ServiceResponse<T> = {
    success: boolean;
    data?: any;
    message?:string,
    error?: string;
    statusCode?: number;
};

// interface GoogleUserInput {
//     googleId: string,
//     email?: string,
//     name?: string,
// }


export class AuthService {

    async signUp(userDetails: UserInput): Promise<ServiceResponse<any>> {

        const alreadyExistEmail = await AuthRepository.findByEmail(userDetails.email);

        const alreadyExistUsername = await AuthRepository.findByUsername(userDetails.username)

        if (alreadyExistEmail.length > 0) {
            return {
                success: false,
                error: "User already exists",
                statusCode: 409
            };
        }
        if (alreadyExistUsername.length > 0) {
            return {
                success: false,
                error: "User already exists",
                statusCode: 409
            };
        }

        const userData = await AuthRepository.signUp(userDetails);

        return {
            success: true,
            data: userData,
            statusCode: 201
        };

    } catch(err: any) {
        if (err.message === "DUPLICATE_EMAIL") {
            return {
                success: false,
                error: "EMAIL_ALREADY_EXIST",
                statusCode: 409,
            }
        }
    }


    async login(userCredentials: UserInput): Promise<ServiceResponse<string>> {
        try {
            const existingUser: any = await AuthRepository.findByEmail(userCredentials.email)
            

            //this ensures that atleast there is a user with the email in the db or not so email validation is completed
            if (existingUser.length === 0) {
                return {
                    success: false,
                    error: "Invalid credentials",
                    statusCode: 401
                };
            }

            // console.log(existingUser, "existing user from login")
            const data: any = existingUser;
            //now check for the correct password!!!
            //to do this we need to compare the hash using bcrypt
            let lockedUntil = existingUser[0].locked_until

            if (lockedUntil && lockedUntil > Date.now()) {
                return {
                    success: false,
                    error: "your account is locked",
                    statusCode: 401
                }
            }
            else if (lockedUntil && lockedUntil < Date.now()) {
                await AuthRepository.setNewAttempts(userCredentials.email, 3);
            }




            const isPassCorrect = await bcrypt.compare(userCredentials.password, data[0].password_hash)
            if (!isPassCorrect) {

                const attempts = await AuthRepository.getAttempts(userCredentials.email)

                if (attempts === 0) {

                    let lockTime = new Date(Date.now() + 2 * 60 * 1000);

                    await AuthRepository.setLockTime(userCredentials.email, lockTime)






                    return {
                        success: false,
                        error: "max login attempts reached",
                        statusCode: 400
                    }
                }
                await AuthRepository.setNewAttempts(userCredentials.email, attempts)


                return {
                    success: false,
                    error: "Invalid credentials",
                    statusCode: 401
                };
            }
            //during login we will set both access and refresh token
            // const refreshToken: any = generateRefreshToken({ id: data[0].id }, userCredentials.remember)

            const accessToken = generateAccessToken({ id: data[0].id , username : existingUser[0].username});


            return {
                success: true,
                data: { accessToken },
                statusCode: 200
            };


        } catch (err) {
            console.log(err);
            return {
                success: false,
                error: "Internal server error",
                statusCode: 500
            };
        }
    }


    async forgotPassword(userEmail: string): Promise<ServiceResponse<string>> {

        try {
            const user: any = await AuthRepository.findByEmail(userEmail);

            // Prevent user enumeration attack
            if (user.length === 0) {
                return {
                    success: true,
                    message: "If email exists, reset link sent",
                    statusCode: 200
                };
            }

            //now that i got assurance that user is present now generate a token (nothing but a random string);
            //store this token in reset_password_tokens table in db with the (expiry time + user_id)
            //and from this route a link will be shared to user which contains this token as query parameter for further steps!!!
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < characters.length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            console.log("hello")


            const token = crypto.createHash('sha256').update(result).digest("hex");
            console.log(token)
            console.log("hello")
            const expiryTime = new Date(Date.now() + (20 * 1000));//20s expiry time

            const OTP = generateOTP(6)

            await AuthRepository.storeOTP(OTP, expiryTime, user[0].id,token);

            // const link = `http://localhost:5000/reset-password?token=${token}`
            // console.log(link, "link")


            return {
                success: true,
                data: {OTP,token},
                statusCode: 200
            };

        } catch (err) {
            return {
                success: false,
                error: "Internal server error",
                statusCode: 500
            };
        }
    }

    async verifyOtp(OTP:string,token:string){
        try{
            const otpFromDb = await AuthRepository.getOTP(token);

            console.log(otpFromDb,"otp from db")

            if(otpFromDb[0].otp!==OTP){
                return {
                    success: false,
                    error: "invalid OTP",
                    statusCode: 400,
                }
            }
            if (Date.now() > otpFromDb[0].expiry_time) {
                return {
                    success: false,
                    error: "otp expired",
                    statusCode: 400
                }
            }


            const link = `http://localhost:5000/reset-password?token=${token}`
            console.log(link, "link")

            return {
                success : true,
                data : link,
                statusCode : 200,
            }


            
        }
        catch(err){
            return {
                success:false,
                statusCode :500
            }
        }
    }

    async getOTP(token:string){
        try{
            
            const otp = await AuthRepository.getOTP(token)

            return {
                success:true,
                data:otp,
                message:"otp got successfully",
                statusCode : 200
            }

        }catch(err:any){
            return {
                success:false,
                message:err.message,
                statusCode : 500
            }
        }
    }
   


    async resetPassword(newPassword: string, id: string): Promise<ServiceResponse<string>> {

        try {
            // const existingToken = await AuthRepository.getOTP(token)
            // console.log(existingToken);

            // if (!existingToken) {
            //     return {
            //         success: false,
            //         error: "invalid OTP",
            //         statusCode: 400,
            //     }
            // }

            // if (Date.now() > existingToken.token_expiry) {
            //     return {
            //         success: false,
            //         error: "otp expired",
            //         statusCode: 400
            //     }
            // }


            await AuthRepository.resetPassword(newPassword, Number(id));

            return {
                success: true,
                statusCode: 200,
            }
        }

        catch (err) {
            return {
                success: false,
                statusCode: 500,
            }
        }



    }
}