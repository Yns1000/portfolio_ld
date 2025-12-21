import { Redis } from '@upstash/redis'

const redis = Redis.fromEnv()

export default async function handler(req, res) {
    // 1. Récupérer le mot de passe actuel (Priorité : Redis, sinon : Env Vercel)
    let currentStoredPassword = await redis.get('admin_password')
    if (!currentStoredPassword) {
        currentStoredPassword = process.env.ADMIN_PASSWORD
    }

    // Lecture des données (GET) - Aucune sécurité requise pour la lecture publique
    if (req.method === 'GET') {
        const data = await redis.get('translations')
        return res.status(200).json(data || {})
    }

    // Actions sécurisées (POST)
    if (req.method === 'POST') {
        const { password, content, action, newPassword } = req.body

        // 2. Vérification de la clé d'accès
        if (password !== currentStoredPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' })
        }

        // --- ACTION : LOGIN ---
        if (action === 'login') {
            return res.status(200).json({ success: true })
        }

        // --- ACTION : CHANGER LE MOT DE PASSE (Celle qui te manquait) ---
        if (action === 'change-password') {
            if (!newPassword || newPassword.length < 4) {
                return res.status(400).json({ error: 'Nouveau mot de passe invalide' })
            }
            // On sauvegarde le nouveau mot de passe dans Redis
            await redis.set('admin_password', newPassword)
            return res.status(200).json({ success: true })
        }

        // --- ACTION : SAUVEGARDER LE CONTENU (Défaut) ---
        if (content) {
            await redis.set('translations', content)
            return res.status(200).json({ success: true })
        }

        return res.status(400).json({ error: 'Action non reconnue ou contenu manquant' })
    }
}