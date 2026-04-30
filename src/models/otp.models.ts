
export interface Otp{
    id ?: number,
    user_id : number,
    otp : string,
    expiry_time : Date,
    is_used:boolean,
}
