

export interface Media {
    tweet_id: number;
    tweet_content_url: string;
}

export interface Tweet {
    tweet_id: number;
    tweet_content?: string; 
    tweeted_by: number;
    created_at: Date;
    parent_tweet_id?: number | null;
    original_tweet_id?: number | null;
    // Relations
    media?: Media[];
}