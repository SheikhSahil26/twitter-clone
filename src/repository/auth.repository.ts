import type { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import type { User, UserInput } from "../models/user.model.js";
import { db } from "../database/config.js";


const saltRounds = 10;
export class AuthRepository {
    static async signUp(userDetails: UserInput): Promise<Partial<User>> {
        console.log(userDetails, "from models")

        //here hash the password!!
        try {



            // const [alreadyExist] = await db.execute<RowDataPacket[]>(
            //     `select email from users where email=?`,[userDetails.email]

            // )


            const hash_password = await bcrypt.hash(userDetails.password, saltRounds)

            console.log(hash_password)

            let timezone = "Asia/Kolkata" //currently hardcoded will think later how to make it dynamic according to users!!

            const [result] = await db.execute<ResultSetHeader>(
                `insert into users (username,email,f_name,l_name,password_hash,dob,timezone) values (?,?,?,?,?,?,?)`, [userDetails.username, userDetails.email, userDetails.f_name, userDetails.l_name, hash_password, userDetails.dob,timezone]
            )

            console.log(result)

            return {
                id: result.insertId,
                username: userDetails.username,
                email: userDetails.email,
            }

            // return res.status(200).json({
            //     success:"user created successfully"
            // })

        } catch (err: any) {
            console.log(err)
            // return res.status(500).json({
            //     failure:"internal server error!!"
            // })
            if (err.code === "ER_DUP_ENTRY")
                throw new Error("DUPLICATE_EMAIL")

            throw new Error("INTERNAL_ERROR")
        }

    }

 
    static async findByEmail(userEmail: string): Promise<User[]> {

        const [existingUser]: any = await db.execute<RowDataPacket[]>(
            `select * from users where email=?`, [userEmail]
        )
        console.log(existingUser, "user from find by email")
        return existingUser as User[];

    }

    static async findByUsername(username:string):Promise<User[]>{
        const [existingUser]:any = await db.execute<RowDataPacket[]>(
            `select * from users where username=?`,[username]
        )
        return existingUser as User[]
    }

    static async findById(userId: number): Promise<User[]> {
        const [existingUser]: any = await db.execute<RowDataPacket[]>(
            `select * from users where id=?`, [userId]
        )
        return existingUser as User[];
    }




    static async storeOTP(OTP: string, expirytTime: Date, id: number,token:string) {

        try {
            //delete all otp of this user before inserting new otp;
            const [delOtp] = await db.execute<ResultSetHeader>(
                `delete from OTP where user_id=?`, [id]
            )
            const [query] = await db.execute<ResultSetHeader>(
                `insert into OTP (user_id,otp,expiry_time,reset_token) values (?,?,?,?)`, [id, OTP, expirytTime,token]
            )
            console.log(query)
        } catch (err) {
            console.log(err);
        }
    }


    static async getOTP(token: string): Promise<any> {

        const [query]: any = await db.execute<ResultSetHeader>(
            `select * from OTP where reset_token=?`,
            [token]
        )

        console.log(query)

        return query[0];
    }



    static async resetPassword(newPassword: string, userId: number) {

        const hash_password = await bcrypt.hash(newPassword, saltRounds)



        const [query] = await db.execute<ResultSetHeader>(
            `update users set password_hash=? where id=?`, [hash_password, userId]
        )

        console.log(query);
    }


    static async getAttempts(userEmail: string): Promise<number> {

        const [attempts]: any = await db.execute<ResultSetHeader>(
            `select max_login_attempts from users where email=?`, [userEmail]
        )

        console.log(attempts, "from get attempts")

        return attempts[0].max_login_attempts;

    }

    static async setNewAttempts(userEmail: string, attempts: number) {
        if (attempts === 0) {
            const [updateAttempts]: any = await db.execute<ResultSetHeader>(
                `update users set max_login_attempts=3,locked_until=null where email=?`, [userEmail]
            )
        }
        else {
            const [updateAttempts]: any = await db.execute<ResultSetHeader>(
                `update users set max_login_attempts=?,locked_until=null where email=?`, [attempts - 1, userEmail]
            )

        }

    }

    static async setLockTime(userEmail: string, lockTime: any) {
        const [updateLockTime] = await db.execute<ResultSetHeader>(
            `update users set locked_until=? where email=?`, [lockTime,userEmail]
        )
    }
}