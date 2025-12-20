import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const data = await redis.get('translations')
        return res.status(200).json(data || {})
    }

    if (req.method === 'POST') {
        const { password, content } = req.body
        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        await redis.set('translations', content)
        return res.status(200).json({ success: true })
    }
}