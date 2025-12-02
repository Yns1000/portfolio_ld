import { createI18n } from 'vue-i18n'

// Import des fichiers JSON
import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import nl from './locales/nl.json'

const i18n = createI18n({
    legacy: false, // On utilise la Composition API (Vue 3)
    locale: 'en',  // Langue par défaut
    fallbackLocale: 'en',
    globalInjection: true, // Permet d'utiliser $t partout
    messages: {
        en,
        fr,
        es,
        nl
    }
})

export default i18n