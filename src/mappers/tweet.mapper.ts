import type{CreateTweetInput} from "../schemas/tweet.schema.js";

export function mapTweetFields(input : CreateTweetInput){
    const tweetData : Record<string,any>= {}

    if(input.tweet_content!==undefined){
        tweetData.tweet_content = input.tweet_content
    }
    if(input.parent_tweet_id !== undefined){
        tweetData.parent_tweet_id = input.parent_tweet_id
    }   
    if(input.original_tweet_id!==undefined){
        tweetData.original_tweet_id=input.original_tweet_id
    }   
    if(input.media!==undefined){
        tweetData.media = input.media
    }
    

    return tweetData;
}