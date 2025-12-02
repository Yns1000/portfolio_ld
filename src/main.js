import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import i18n from './i18n' // <--- Import du fichier de config

const app = createApp(App)

app.use(i18n) // <--- Activation du plugin
app.mount('#app')