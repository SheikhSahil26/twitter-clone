import type { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import type { User, UserInput } from "../models/user.model.js";
import { db } from "../database/config.js";
import type { AnyARecord } from "node:dns";


const saltRounds = 10;

export class UserRepository {
  static async getUserProfile(username: string): Promise<User> {
    //gets the basic details of the user from the users table only nothing more 
    const [result]:any = await db.execute<RowDataPacket[]>(
      `select id from users where username = ?`,[username]
    )
    console.log(result,"id of profile user")

    const [query]: any = await db.execute<ResultSetHeader>(
      `select *,(select count(*) from connections where followee_id =${result[0].id}) as followings,(select count(*) from connections where to_follow_id=${result[0].id}) as followers from users where username=?`, [username]
    )



    console.log(query)

    return query[0];
  }


  //this shows the users tweets/retweets/replies also in his/her profile page...
  static async getUserTweets(userId: number, viewerId: number = userId): Promise<[]> {
    //A single Tweet comprises of (tweet_content,tweet_id,likes,replies,username of who tweeted,tweeted_by id) 
    //so here to fetch tweet we need to fetch from 3 tables users,tweets,tweet_likes(count only),media table also;

    const [query] = await db.execute<RowDataPacket[]>(
      `SELECT 
    t.tweet_id,
    t.tweet_content,
    t.tweeted_by,
    t.created_at,
    t.parent_tweet_id,
    t.original_tweet_id,
    u.username,
    u.profile_photo_url,
    m.tweet_content_url,
    (select count(*) from tweet_likes tl where tl.tweet_id = t.tweet_id) as like_count,
    (select count(*) from tweets where t.original_tweet_id is not null) as retweet_count,
    (select count(*) from tweets where t.parent_tweet_id is not null) as reply_count,
     EXISTS (
        SELECT 1 FROM tweet_likes 
        WHERE tweet_id = t.tweet_id AND liked_by = ?
    ) AS is_liked
FROM tweets t
JOIN users u ON t.tweeted_by = u.id
LEFT JOIN media m ON t.tweet_id = m.tweet_id
WHERE t.tweeted_by = ? and t.original_tweet_id is null and t.parent_tweet_id is null
ORDER BY t.created_at DESC; `, [viewerId,userId]
    )

    console.log(query.length, "user tweets for profile!!!");



    return query as [];
  }
  static async getUserRetweets(userId: number, viewerId: number = userId): Promise<[]> {
    //A single Tweet comprises of (tweet_content,tweet_id,likes,replies,username of who tweeted,tweeted_by id) 
    //so here to fetch tweet we need to fetch from 3 tables users,tweets,tweet_likes(count only),media table also;

    const [query] = await db.execute<RowDataPacket[]>(
      `SELECT 
    t.tweet_id,
    t.tweet_content,
    t.tweeted_by,
    t.created_at,
    t.parent_tweet_id,
    t.original_tweet_id,
    u.username,
    u.profile_photo_url,
    m.tweet_content_url,
    (select count(*) from tweet_likes tl where tl.tweet_id = t.tweet_id) as like_count,
    (select count(*) from tweets where t.original_tweet_id is not null) as retweet_count,
    (select count(*) from tweets where t.parent_tweet_id is not null) as reply_count,
     EXISTS (
        SELECT 1 FROM tweet_likes 
        WHERE tweet_id = t.tweet_id AND liked_by = ?
    ) AS is_liked
FROM tweets t
JOIN users u ON t.tweeted_by = u.id
LEFT JOIN media m ON t.original_tweet_id = m.tweet_id
WHERE t.tweeted_by = ? and t.original_tweet_id is not null
ORDER BY t.created_at DESC; `, [viewerId,userId]
    )

    console.log(query.length, "user tweets for profile!!!");



    return query as [];
  }
  static async getUserReplies(userId: number, viewerId: number = userId): Promise<[]> {
    //A single Tweet comprises of (tweet_content,tweet_id,likes,replies,username of who tweeted,tweeted_by id) 
    //so here to fetch tweet we need to fetch from 3 tables users,tweets,tweet_likes(count only),media table also;

    const [query] = await db.execute<RowDataPacket[]>(
      `SELECT 
    t.tweet_id,
    t.tweet_content,
    t.tweeted_by,
    t.created_at,
    t.parent_tweet_id,
    t.original_tweet_id,
    u.username,
    u.profile_photo_url,
    m.tweet_content_url,
    (select count(*) from tweet_likes tl where tl.tweet_id = t.tweet_id) as like_count,
    (select count(*) from tweets where t.original_tweet_id is not null) as retweet_count,
    (select count(*) from tweets where t.parent_tweet_id is not null) as reply_count,
     EXISTS (
        SELECT 1 FROM tweet_likes 
        WHERE tweet_id = t.tweet_id AND liked_by = ?
    ) AS is_liked
FROM tweets t
JOIN users u ON t.tweeted_by = u.id
LEFT JOIN media m ON t.tweet_id = m.tweet_id
WHERE t.tweeted_by = ? and t.parent_tweet_id is not null
ORDER BY t.created_at DESC;`, [viewerId,userId]
    )

    console.log(query.length, "user tweets for profile!!!");



    return query as [];
  }




  static async getUserFeed(userId:number):Promise<[]>{
    try{
      const [query] = await db.execute<RowDataPacket[]>(
        `SELECT t.tweet_id, t.tweet_content, t.tweeted_by, t.created_at, t.parent_tweet_id, t.original_tweet_id, u.username, u.profile_photo_url, m.tweet_content_url, (SELECT COUNT(*) FROM tweet_likes tl WHERE tl.tweet_id = t.tweet_id) AS like_count, (select count(*) from tweets where t.original_tweet_id is not null) as retweet_count, (select count(*) from tweets where t.parent_tweet_id is not null) as reply_count, EXISTS ( SELECT 1 FROM tweet_likes WHERE tweet_id = t.tweet_id AND liked_by = ? ) AS is_liked FROM tweets t JOIN users u ON t.tweeted_by = u.id LEFT JOIN media m ON t.tweet_id = m.tweet_id WHERE ( t.tweeted_by IN (SELECT to_follow_id FROM connections WHERE followee_id = ?) ) ORDER BY t.created_at DESC;
 `,[userId,userId]
      )

      console.log(query);

      return query as [];

    }catch(err){
      console.log(err)
      throw new Error("DB_ERR while fethcing followers")
    }

  }
  static async getUserFollowers(userId:number, viewerId: number = userId):Promise<[]>{
    try{
      const [query]:any = await db.execute<RowDataPacket[]>(
        `select id,profile_photo_url,username,f_name,l_name,
        EXISTS (
          SELECT 1 FROM connections
          WHERE followee_id = ? AND to_follow_id = users.id
        ) AS is_followed
        from users where id in (select followee_id from connections where to_follow_id =?)`,[viewerId,userId]
      )

      console.log(query);

      return query as []

    }catch(err){
      throw new Error("DB_ERR while fethcing followers")
    }
  }
  static async getUserFollowings(userId:number, viewerId: number = userId):Promise<[]>{
    try{
      const [query]:any = await db.execute<RowDataPacket[]>(
        `select id,profile_photo_url,username,f_name,l_name,
        EXISTS (
          SELECT 1 FROM connections
          WHERE followee_id = ? AND to_follow_id = users.id
        ) AS is_followed
        from users where id in (select to_follow_id from connections where followee_id =?)`,[viewerId,userId]
      )

      console.log(query,"followings of user");

      return query;

    }catch(err){
      throw new Error("DB_ERR while fethcing followers")
    }
  }
  static async updateProfile(updateBody: Partial<User>, userId: number) {

    console.log(updateBody, "this is update body inside repo")
    console.log(userId, "userId")
    const fields = Object.keys(updateBody).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateBody);

    console.log(fields, "fields")
    console.log(values, "values")

    const [result] = await db.execute<ResultSetHeader>(
      `UPDATE users SET ${fields} WHERE id = ?`,
      [...values, userId] as any[]
    );



  }
  static async followUnfollowUser(username: string, userId: number): Promise<Boolean> {
    //userId here refers to loggedIn users id
    //first we have to check if there is a row in connections table of this two users if there is then do unfollow else do follow 

    //step 1 : find the id of the user from the username provided 
    //step 2 : find a row between these 2 users in connections table 
    //step 3 : if rows>0 delete row and unfollow user else insert row and follow user
    try {
      const [result]: any = await db.execute<RowDataPacket[]>(
        `select id from users where username = ?`, [username]
      )

      console.log(result[0].id);

      const toFollowId = result[0].id


      const [query] = await db.execute<RowDataPacket[]>(
        `select * from connections where followee_id=? and  to_follow_id=? `, [userId, toFollowId]
      )

      if (query.length > 0) {
        const [delQuery] = await db.execute<ResultSetHeader>(
          `delete from connections where followee_id=? and  to_follow_id=? `, [userId, toFollowId]
        )

        return false;
      }

      const [query2] = await db.execute<ResultSetHeader>(
        `insert into connections (followee_id,to_follow_id) values (?,?)`, [userId, toFollowId]
      )

      return true;

    } catch (err) {
      console.log(err)
      throw new Error("DB_ERROR while follow unfollow")
    }



  }

  static async fetchAllUsers(userId:number):Promise<User[]>{
    
    try{
      const [query]:any = await db.execute<RowDataPacket[]>(
        `select id,profile_photo_url,username,f_name,l_name,
        EXISTS (
          SELECT 1 FROM connections
          WHERE followee_id = ? AND to_follow_id = users.id
        ) AS is_followed
        from users where id<>? `,[userId,userId]
      )

      console.log(query,"all users except logged in");

      return query as [];

    }catch(err){
      throw new Error("DB_ERR while fethcing followers")
    }
  }


}
