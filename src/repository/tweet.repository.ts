import type { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import type { User, UserInput } from "../models/user.model.js";
import { db } from "../database/config.js";
import type { Tweet } from "../models/tweet.model.js";




export class TweetRepository {





    static async createTweet(tweetBody: Partial<Tweet>, userId: number): Promise<number> {
        try {
            console.log(tweetBody,"body twet")
            const tweetMedia:any = tweetBody.media || []
            console.log(tweetMedia,"gtweet media in respo")
            const [result] = await db.execute<ResultSetHeader>(
                `insert into tweets (tweet_content,tweeted_by,parent_tweet_id,original_tweet_id) values (?,?,?,?)`, [tweetBody.tweet_content ?? null,
                userId,
                tweetBody.parent_tweet_id ?? null, // Convert undefined to null
                tweetBody.original_tweet_id ?? null]
            )

            const insertId = result.insertId;
            console.log(insertId, 'insert id of tweet')

            tweetMedia.forEach(async(media:any)=>{
                const [query] = await db.execute<ResultSetHeader>(
                    `insert into media (tweet_id,tweet_content_url) values (?,?)`, [insertId, media]
                )
            })
                
            

            return insertId;

        } catch (err) {
            console.log(err)
            throw new Error("DB_ERROR")
        }




    }

    static async reTweet(tweetId: number, userId: number): Promise<number> {
        try {
            //fetch the tweet first so that we will be having the original owner of the tweet from tweet.tweeted_by

            const [result] = await db.execute<RowDataPacket[]>(`select * from tweets where tweet_id=?`, [tweetId]);

            console.log(result[0], "original tweet!!")
            let originalTweet: any = result[0];
            console.log(originalTweet)
            //now i got the original tweet, i will insert new tweet in the tweets table with original_tweet_id field as the id of this fetched tweet.. and tweeted_by as the current logged in user....

            //first i will check if there is a retweet of this tweet by this user if there is already then delete the retweet and if notr then normal flosw of retweet

            const [alreadyRetweet] = await db.execute<RowDataPacket[]>(
                `select * from tweets where original_tweet_id = ? and tweeted_by = ?`, [tweetId, userId]
            )

            if (alreadyRetweet.length > 0) {
                const [delRetweet] = await db.execute<ResultSetHeader>(`delete from tweets where original_tweet_id = ? and tweeted_by=?`, [tweetId, userId]);

                return delRetweet.affectedRows;//to show that a record is being deleted!!!
            }


            const [query] = await db.execute<ResultSetHeader>(
                `insert into tweets (tweet_content,tweeted_by,parent_tweet_id,original_tweet_id) values (?,?,?,?)`, [originalTweet.tweet_content ?? null,
                userId, // retweeted by this userid
                 null, // Convert undefined to null
                originalTweet.tweet_id ?? null]
            )

            console.log(query.insertId, "this is retweet");

            //here in retweet right now i am not including any media files (image or video) for simplicity currently i will fetch the tweet images or video by querying with the help of original_tweet_id to query into media table and get that url to show the retweeet content!!!

            return 0;


            // const [query] = await db.execute<ResultSetHeader>(
            //     `insert into tweets `,
            // )
        }
        catch (err) {
            throw new Error("DB_ERROR")
        }
    }


    static async likeUnlikeTweet(tweetId: number, userId: number): Promise<{ is_liked: boolean; like_count: number }> {

        try {
            const [query] = await db.execute<RowDataPacket[]>(
                `select * from tweet_likes where liked_by=? and tweet_id=?`, [userId,tweetId]
            )
            console.log(tweetId, userId, "values for query!!!")

            if (query.length > 0) {
                const [delQuery] = await db.execute<ResultSetHeader>(`delete from tweet_likes where liked_by=? and tweet_id=?`, [userId,tweetId])

                const [countQuery] = await db.execute<RowDataPacket[]>(
                    `select count(*) as like_count from tweet_likes where tweet_id=?`, [tweetId]
                )

                return {
                    is_liked: false,
                    like_count: Number(countQuery[0]?.like_count ?? 0)
                };
            }

            else {
                const [result] = await db.execute<ResultSetHeader>(`insert into tweet_likes (liked_by,tweet_id) values (?,?)`, [userId, tweetId]);
                const [countQuery] = await db.execute<RowDataPacket[]>(
                    `select count(*) as like_count from tweet_likes where tweet_id=?`, [tweetId]
                )

                return {
                    is_liked: true,
                    like_count: Number(countQuery[0]?.like_count ?? 0)
                };
            }

        } catch (err) {
            console.log(err, "error from like unlike")
            throw new Error("error while like unlike")
        }



    }

    static async replyOnTweet(replyTweetBody:Partial<Tweet>,tweetId: number, userId: number) : Promise<number>{
        try {
            //first get the original tweet 

            const [result] = await db.execute<RowDataPacket[]>(`select * from tweets where tweet_id=?`, [tweetId]);

            console.log(result[0], "original tweet!!")
            let originalTweet: any = result[0];




            const [query] = await db.execute<ResultSetHeader>(
               `insert into tweets (tweet_content,tweeted_by,parent_tweet_id,original_tweet_id) values (?,?,?,?)`, [replyTweetBody.tweet_content ?? null,
                userId, // retweeted by this userid
                originalTweet.tweet_id ?? null, // Convert undefined to null
                null]
            )

            const insertId = query.insertId;

            const tweetMedia = replyTweetBody.media || [];

          
             tweetMedia.forEach(async(media:any)=>{
                const [query] = await db.execute<ResultSetHeader>(
                    `insert into media (tweet_id,tweet_content_url) values (?,?)`, [insertId, media]
                )
            })

            

            return query.insertId;

            




        } catch (err) {
            console.log(err)
            throw new Error("DB_ERROR while reply on tweet")
        }
    }

    static async deleteTweet(tweetId:number){
        const [query] = await db.execute<ResultSetHeader>(
            `delete from tweets where tweet_id=?`,[tweetId]
        )
        //will add try catch later its very boring and time consuming
    }

    //tweet with media
    static async getTweetById(tweetId:number,userId:number){
        console.log(tweetId,"tweet id")
        const [query] = await db.execute<RowDataPacket[]>(
            `SELECT 
    t.tweet_id,
    t.tweet_content,
    t.created_at,
    u.username,
    u.profile_photo_url,
    m.tweet_content_url,
    (SELECT COUNT(*) FROM tweet_likes WHERE tweet_id = t.tweet_id) as like_count,
    (SELECT COUNT(*) FROM tweets WHERE parent_tweet_id = t.tweet_id) as reply_count,
    (SELECT COUNT(*) FROM tweets WHERE original_tweet_id = t.tweet_id) as retweet_count,
    EXISTS (
        SELECT 1 FROM tweet_likes
        WHERE tweet_id = t.tweet_id AND liked_by = ?
    ) AS is_liked
FROM tweets t
LEFT JOIN users u ON t.tweeted_by = u.id
LEFT JOIN media m ON t.tweet_id = m.tweet_id
WHERE t.tweet_id = ?;
`,[userId,tweetId]
        )

        console.log(query,"tweet by id")

        return query


    }

    static async getRepliesById(tweetId:number,userId:number){
        const [query] = await db.execute<RowDataPacket[]>(
            `SELECT 
    t.tweet_id,
    t.tweet_content,
    t.created_at,
    u.username,
    u.profile_photo_url,
    m.tweet_content_url,
     (SELECT COUNT(*) FROM tweet_likes WHERE tweet_id = t.tweet_id) as like_count,
    (SELECT COUNT(*) FROM tweets WHERE parent_tweet_id = t.tweet_id) as reply_count,
    (SELECT COUNT(*) FROM tweets WHERE original_tweet_id = t.tweet_id) as retweet_count,
    EXISTS (
        SELECT 1 FROM tweet_likes
        WHERE tweet_id = t.tweet_id AND liked_by = ?
    ) AS is_liked
FROM tweets t
JOIN users u ON t.tweeted_by = u.id
LEFT JOIN media m ON t.tweet_id = m.tweet_id
WHERE t.parent_tweet_id = ? 
ORDER BY t.created_at ASC; 
`,[userId,tweetId]
        )

        console.log(query,"tweet by id")

        return query;


    }


}
