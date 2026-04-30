import { z } from 'zod';

export const TweetSchema = z.object({
    tweet_content: z.string().max(280).optional(),
    tweeted_by: z.number().positive().optional(),
    parent_tweet_id: z.number().optional().nullable(),
    original_tweet_id: z.number().optional().nullable(),

    // Validate an array of image/video URLs
    media: z.array(
        z.object({
            tweet_content_url: z.string("Invalid media URL")
        })
    ).max(4).optional()
    

})

export type CreateTweetInput = z.infer<typeof TweetSchema>;