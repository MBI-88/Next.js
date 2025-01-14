import videoData from '../data/videos.json'

const fetchVideos = async (url) => {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
    const BASE_URL = 'youtube.googleapis.com/youtube/v3'
    const response = await fetch(`
    https://${BASE_URL}/${url}&maxResults=25&key=${YOUTUBE_API_KEY}
    `)
    return await response.json()
}

export const getCommonVideos = async (url) => {
    try {
        const isDev = process.env.DEVELOPMENT
        const data = isDev ? videoData : await fetchVideos(url)
        if (data?.error) {
            // Mode dev
            return []
        }
        return data?.items.map(item => {
            const id = item.id?.videoId || item.id
            return {
                title: item.snippet.title,
                imgUrl: item.snippet.thumbnails.high.url,
                id,
                description: item.snippet.description,
                publishTime: item.snippet.publishedAt,
                channelTitle: item.snippet.channelTitle,
                statistics: item.statistics ? item.statistics : { viewCount: 0 }
            }
        })
    } catch (e) {
        return []
    }

}

export const getVideos = (searchQuery) => {
    const URL = `search?part=snippet&q=${searchQuery}&type=video`
    return getCommonVideos(URL)
}

export const getPopularVideos = () => {
    const URL = 'videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US'
    return getCommonVideos(URL)

}
export const getYoutubeVideosById = (videoId) => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`
    return getCommonVideos(URL)
}