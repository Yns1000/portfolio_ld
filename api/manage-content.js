import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
    // Lecture des données (GET)
    if (req.method === 'GET') {
        const data = await redis.get('translations')
        return res.status(200).json(data || {})
    }

    // Actions sécurisées (POST)
    if (req.method === 'POST') {
        const { password, content, action } = req.body

        // Vérification du mot de passe
        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ error: 'Mot de passe incorrect' })
        }

        // Si c'est juste une vérification de connexion
        if (action === 'login') {
            return res.status(200).json({ success: true })
        }

        // Si c'est pour sauvegarder
        await redis.set('translations', content)
        return res.status(200).json({ success: true })
    }
}