import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import jwt from "jsonwebtoken"
import { ref } from "node:process";


const authService = new AuthService();
const JWT_SECRET_KEY: any = "JWT_SECRET_KEY"
export class AuthControllers {
    async signUp(req: Request, res: Response) {
        console.log(req.body)
        try {
            // CAPTCHA validation stays in controller (HTTP concern)
            if ((req.session as any).captcha !== req.body.captchaInput) {
                return res.status(400).json({
                    error: "Invalid captcha"
                });
            }

            const response = await authService.signUp(req.body);

            if (!response.success) {
                return res.status(response.statusCode || 500).json({
                    error: response.error
                });
            }

            return res.status(response.statusCode || 201).json({
                success: true,
                message: "User created successfully",
                data: response.data
            });

        } catch (err) {
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

    async login(req: Request, res: Response) {
        try {
            console.log(req.body,"login credentials")
            const response = await authService.login(req.body);

            if (!response.success) {
                return res.status(response.statusCode || 500).json({
                    error: response.error
                });
            }

            const refreshToken = response.data.refreshToken

            res.cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge : 50*1000,
            })



            return res.status(200).json({
                success: true,
                message: "Logged in successfully",
                token: response.data.accessToken
            });

        } catch (err) {
            return res.status(500).json({
                error: "Internal server error"
            });
        }
    }

    async forgotPassword(req: any, res: Response) {
        try {
            console.log(req.body,"email")
        const response = await authService.forgotPassword(req.body.email);
        console.log(req.body.email)

        if (!response.success) {
            return res.status(response.statusCode || 500).json({
                error: response.error,
            });
        }

        return res.status(200).json({
            success: true,
            message: response.message,
            data: response.data
        });

    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong"
        });
    }
    }
    async getOtp(req:Request,res:Response){
        try{
            const token = req.params.token as string
            const resp = await authService.getOTP(token)

           if(!resp.success){
            return res.status(resp.statusCode).json({
                error:resp.message,
            })
           }    

           return res.status(resp.statusCode).json({
            data:resp.data,
            message:resp.message
           })




        }catch(err){
            return res.status(500).json({
                error:"internal server error"
            })
        }
    }

    async verifyOtp(req:Request,res:Response){
        try{
            const resp= await authService.verifyOtp(req.body.otp,req.body.token);

            if(!resp.success){
                if(resp.statusCode==400){
                    return res.status(400).json({
                        success:false,
                        message : resp.error,
                    })
                }
                else{
                    return res.status(500).json({
                        success:false,
                        error: resp.error
                    })
                }
            }

            return res.status(200).json({
                success:true,
                message : resp.data,
                data:resp.data,
            })



        }catch(err){
            return res.status(500).json({
                error:"Internal Server error"
            })
        }
    }


    async resetPassword(req: any, res: any) {
        try {

            const newPassword = req.body.password
            // const token = req.body.token
            const id = req.body.id;


            const resp = await authService.resetPassword(newPassword, id)

            if(!resp.success){
                if(resp.statusCode===400){
                    return res.status(400).json({
                        error:resp.error
                    })
                }
                else{
                    return res.status(500).json({
                        error:resp.error,
                    })
                }
            }

            return res.status(resp.statusCode).json({
                success:"password updated successfully",
               
            })




        }
        catch (err) {
            console.log(err);
            return res.status(500).json({
                error: "internal server error",
            })
        }
    }

    async refreshToken(req: Request, res: Response) {
        console.log("reached refresh token route")
        try {
            const refreshToken = req.cookies.refreshToken

            console.log(refreshToken, "this is refresh token")

            if (!refreshToken) {
                return res.status(401).json({
                    error: "no refresh token"
                })
            }
            console.log("before decoded")
            const decoded: any = jwt.verify(refreshToken, JWT_SECRET_KEY);

            console.log(decoded, "decoed from refresh token asdfas");

            if (!decoded) {
                return res.status(401).json({
                    error: "refresh token expired login again!!"
                })
            }

            const newAccessToken = jwt.sign({ payload: decoded.payload }, JWT_SECRET_KEY, {
                expiresIn: "10s"
            })

            console.log(newAccessToken, "this is nw")

            return res.json({ accessToken: newAccessToken })




        } catch (err) {
            return res.status(500).json({
                error: "something happened while generating new accesstoken!!"
            })
        }
    }

    async logout(req: Request, res: Response) {
        try {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: false,
                sameSite: "lax"
            })
            return res.status(200).json({
                success: "logged out successfully"
            })

        } catch (err) {
            return res.status(500).json({
                error: "error occured while logging out"
            })
        }
    }



}