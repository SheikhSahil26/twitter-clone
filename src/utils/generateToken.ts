import jwt from "jsonwebtoken"
import { type User } from "../models/user.model.js"

const JWT_SECRET_KEY : any = "JWT_SECRET_KEY"
export function generateRefreshToken(payload:Partial<User>,remember:any):any{
    //time is more for this refreshToken!

    console.log(payload,"this is payload")

    const refreshToken = jwt.sign({payload},JWT_SECRET_KEY,{
        expiresIn:remember?"50s":"40s"
    })
    
    return refreshToken;
}

export function generateAccessToken(payload:Partial<User>):string{
    //time is less for this accessToken!
    const accessToken = jwt.sign({payload},JWT_SECRET_KEY,{
        expiresIn : "2h"
    })


    return accessToken
}