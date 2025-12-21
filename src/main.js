import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import i18n, { fetchLiveTranslations } from './i18n'

const app = createApp(App)

app.directive('reveal', {
    mounted(el) {
        el.classList.add('reveal')
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    el.classList.add('visible')
                    observer.unobserve(el)
                }
            })
        }, { threshold: 0.15 })
        observer.observe(el)
    }
})

app.use(i18n)

fetchLiveTranslations().then(() => {
    app.mount('#app')
})