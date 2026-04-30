import { db } from "../database/config.js";
import bcrypt from "bcrypt";
import type{ Response } from "express";

import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface UserInput{
    email : string,
    password : string,
    username : string,
    f_name :string,
    l_name :string,
    captcha ?: string,
    remember ?:boolean,
    cover_image ?: string,
    profile_photo_url ?: string,
    dob : Date,
}

export interface User{
    id ?: number,
    f_name : string,
    l_name : string,
    bio : string,
    username : string,
    email: string,
    pass_hash: string,
    cover_image_url ?: string,
    profile_photo_url ?: string,
    dob : Date,
    created_at?: any,
    updated_at?: any
}



import { z } from 'zod';
export const UserSchema = z.object({
  email: z.string().email("Invalid email address"),
  
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100),
    
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    
//   captcha: z.string().min(1, "Captcha is required"),
  
//   remember: z.boolean(),
  
//   // Optional fields: use .optional() or .nullable()
//   cover_image: z.string().url("Invalid cover image URL").optional(),
  
//   profile_photo_url: z.string().url("Invalid profile photo URL").optional(),
  
  // Date of Birth validation
  dob: z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) return new Date(arg);
  }, z.date().refine((date) => date < new Date(), {
    message: "Date of birth must be in the past",
  })),
});





// const saltRounds = 10;
// export class UserModel {
//     static async signUp(userDetails: UserInput):Promise<number>{
//         console.log(userDetails,"from models")

//         //here hash the password!!
//         try{
            
        

//         // const [alreadyExist] = await db.execute<RowDataPacket[]>(
//         //     `select email from users where email=?`,[userDetails.email]
            
//         // )
        

//         const hash_password = await bcrypt.hash(userDetails.password, saltRounds)

//         console.log(hash_password)

//         const [result] = await db.execute<ResultSetHeader>(
//             `insert into users (u_name,email,pass_hash) values (?,?,?)`, [userDetails.username, userDetails.email, hash_password]
//         )

//         console.log(result)

//         return result.insertId;

//         // return res.status(200).json({
//         //     success:"user created successfully"
//         // })

//         }catch(err){
//             console.log(err)
//             // return res.status(500).json({
//             //     failure:"internal server error!!"
//             // })
//             return -1;
//         }
        
//     }

//     static async login(userCredentials : Partial<UserInput>){}

//     static async findByEmail(userEmail:string):Promise<User[]>{
        
//         const [existingUser]:any = await db.execute<RowDataPacket[]>(
//             `select * from users where email=?`,[userEmail]
//         )
//         console.log(existingUser,"user from find by email")
//         return existingUser as User[];
        
//     }

//     static async findById(userId:number):Promise<User[]>{
//         const [existingUser]:any = await db.execute<RowDataPacket[]>(
//             `select * from users where id=?`,[userId]
//         )
//         return existingUser as User[];
//     }




//     static async storeToken(token:string,expirytTime:number,id:number){

//         try{

//             const [query] = await db.execute<ResultSetHeader>(
//             `insert into password_reset_tokens (user_id,token,token_expiry) values (?,?,?)`,[id,token,expirytTime]
//         )

//         console.log(query)





//         }catch(err){
//             console.log(err);
//         }
//     }


//     static async getTokens(token:string):Promise<any>{
        
//         const [query]:any= await db.execute<ResultSetHeader>(
//             `select * from password_reset_tokens where token=?`,
//             [token]
//         )

//         console.log(query)
        
        
        
//         return query;
//     }



//     static async resetPassword(newPassword:string,userId:number){

//         const hash_password = await bcrypt.hash(newPassword, saltRounds)



//         const [query]=await db.execute<ResultSetHeader>(
//             `update users set pass_hash=? where id=?`,[hash_password,userId]
//         )

//         console.log(query);
//     }


//     static async getAttempts(userEmail:string):Promise<number>{
        
//         const [attempts]:any = await db.execute<ResultSetHeader>(
//             `select max_login_attempts from users where email=?`,[userEmail]
//         )

//         console.log(attempts,"from get attempts")
        
//         return attempts[0].max_login_attempts;
        
//     }
    
//      static async setNewAttempts(userEmail:string,attempts:number){
//         if(attempts===0){
//             const [updateAttempts]:any = await db.execute<ResultSetHeader>(
//             `update users set max_login_attempts=3,last_failed_login_time=null where email=?`,[userEmail]
//         )
//         }
//         else {
//             const [updateAttempts]:any = await db.execute<ResultSetHeader>(
//             `update users set max_login_attempts=?,last_failed_login_time=null where email=?`,[attempts-1,userEmail]
//         )

//         }
        
//     }
    
//     static async setLockTime(userEmail:string,lockTime:any){
//         const [updateLockTime] = await db.execute<ResultSetHeader>(
//             `update users set last_failed_login_time=?`,[lockTime]
//         )
//     }

    



// }
