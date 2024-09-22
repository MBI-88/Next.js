import { findVideoIdByUser, insertStats, updateStats } from "@/lib/db/hasura"
import jwt from "jsonwebtoken"

export default async function stats(req, resp) {
    if (req.method === "POST") {
        try {
            const token = req.cookies.token
            if (!token) {
                resp.status(403).send({})
            } else {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
                const userId = decodedToken.issuer
                const { videoId, favourited, watched = true } = req.body
                if (videoId) {
                    const doesStatsExist = findVideoIdByUser(token, userId, videoId)
                    if (doesStatsExist) {
                        const response = await updateStats(token,
                            { favourited, userId, watched, videoId })
                        resp.status(201).send({ data: response })
                    } else {
                        const response = await insertStats(token,
                            { favourited, userId, watched, videoId })
                        resp.status(200).send({ data: response })
                    }
                }

            }

        } catch (error) {
            resp.status(500).send({ done: false, error: error?.message })

        }
    }

}