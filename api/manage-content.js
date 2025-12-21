import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
    let currentStoredPassword = await redis.get('admin_password')
    if (!currentStoredPassword) {
        currentStoredPassword = process.env.ADMIN_PASSWORD
    }

    if (req.method === 'GET') {
        const data = await redis.get('translations')
        return res.status(200).json(data || {})
    }

    if (req.method === 'POST') {
        const { password, content, action, newPassword } = req.body

        if (password !== currentStoredPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' })
        }

        if (action === 'login') {
            return res.status(200).json({ success: true })
        }

        if (action === 'change-password') {
            if (!newPassword || newPassword.length < 4) {
                return res.status(400).json({ error: 'Nouveau mot de passe invalide' })
            }
            await redis.set('admin_password', newPassword)
            return res.status(200).json({ success: true })
        }

        if (content) {
            await redis.set('translations', content)
            return res.status(200).json({ success: true })
        }

        return res.status(400).json({ error: 'Action non reconnue ou contenu manquant' })
    }
}