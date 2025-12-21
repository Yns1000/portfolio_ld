import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv()

export default async function handler(req, res) {
    const { lang } = req.query
    const base64Data = await redis.get(`cv_file_${lang}`)

    if (!base64Data) return res.status(404).send('CV non trouvé')

    const buffer = Buffer.from(base64Data.split(',')[1], 'base64')

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="CV_Laurine_Dhilly_${lang.toUpperCase()}.pdf"`)
    res.send(buffer)
}