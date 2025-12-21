import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import nl from './locales/nl.json'

const i18n = createI18n({
    legacy: false,
    locale: 'fr',
    fallbackLocale: 'en',
    globalInjection: true,
    messages: { en, fr, es, nl }
})

export async function fetchLiveTranslations() {
    try {
        const response = await fetch('/api/manage-content')
        const liveData = await response.json()

        Object.keys(liveData).forEach(lang => {
            i18n.global.setLocaleMessage(lang, {
                ...i18n.global.getLocaleMessage(lang),
                ...liveData[lang]
            })
        })
    } catch (err) {
        console.error("Impossible de charger les données live", err)
    }
}

export default i18n