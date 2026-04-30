export const formatTweetData = (rows:any) => {
    if (!rows) return [];
    
     const map: Record<number, any> = {};
    rows.forEach((row:any) => {
        if (!map[row.tweet_id]) {
            map[row.tweet_id] = {
                ...row,
                media: [] // Initialize media as an array
            };
            // Clean up the top-level url if you want it only in the media array
            delete map[row.tweet_id].tweet_content_url;
        }
        
        if (row.tweet_content_url) {
            // Avoid adding duplicate URLs if the join created them
            if (!map[row.tweet_id].media.includes(row.tweet_content_url)) {
                map[row.tweet_id].media.push(row.tweet_content_url);
            }
        }
    });
    
    return Object.values(map);
};