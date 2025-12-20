<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  Home,
  Briefcase,
  User,
  Mail,
  Sun,
  Moon,
  Languages
} from 'lucide-vue-next'

import PortfolioHero from './components/PortfolioHero.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'

const { locale } = useI18n()
const isDark = ref(true)
const isLangMenuOpen = ref(false)

const changeLanguage = (lang) => {
  locale.value = lang
  isLangMenuOpen.value = false
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.removeAttribute('data-theme')
  } else {
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

onMounted(() => {
  if (!isDark.value) {
    document.documentElement.setAttribute('data-theme', 'light')
  }
})
</script>

<template>
  <header class="site-header glass-nav">
    <nav class="navbar">

      <div class="nav-links">
        <a href="#" class="nav-item" aria-label="Home">
          <Home :size="20" />
          <span class="nav-text">Home</span>
        </a>
        <a href="#projects" class="nav-item" aria-label="Projects">
          <Briefcase :size="20" />
          <span class="nav-text">Projets</span>
        </a>
        <a href="#about" class="nav-item" aria-label="About">
          <User :size="20" />
          <span class="nav-text">À propos</span>
        </a>
        <a href="#contact" class="nav-item" aria-label="Contact">
          <Mail :size="20" />
          <span class="nav-text">Contact</span>
        </a>
      </div>

      <div class="nav-settings">

        <div class="lang-dropdown-wrapper">
          <button class="icon-btn" @click="isLangMenuOpen = !isLangMenuOpen">
            <Languages :size="20" />
            <span class="current-lang">{{ locale.toUpperCase() }}</span>
          </button>

          <div class="lang-menu glass-panel" v-if="isLangMenuOpen">
            <span @click="changeLanguage('en')" :class="{ active: locale === 'en' }">🇬🇧 EN</span>
            <span @click="changeLanguage('fr')" :class="{ active: locale === 'fr' }">🇫🇷 FR</span>
            <span @click="changeLanguage('nl')" :class="{ active: locale === 'nl' }">🇳🇱 NL</span>
            <span @click="changeLanguage('es')" :class="{ active: locale === 'es' }">🇪🇸 ES</span>
          </div>
        </div>

        <button
            class="theme-toggle icon-btn"
            @click="toggleTheme"
            :aria-label="isDark ? 'Mode clair' : 'Mode sombre'"
        >
          <Sun v-if="!isDark" :size="20" class="icon-sun" />
          <Moon v-else :size="20" class="icon-moon" />
        </button>
      </div>

    </nav>
  </header>

  <main>
    <PortfolioHero />
    <ProjectsSection />
    <AboutSection />
    <ContactSection />
  </main>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
  background-color: var(--color-bg);
  transition: background-color 0.3s, color 0.3s;
}

#app {
  width: 100%;
  max-width: 100%;
  padding: 0 !important;
  margin: 0 auto;
}
</style>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1rem 2rem;
  transition: all 0.3s ease;
}

.glass-nav {
  background: rgba(var(--color-bg-rgb), 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.navbar {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  gap: 2rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 20px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-item {
  color: var(--color-text-muted);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  color: var(--color-accent);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .nav-text { display: none; }
  .nav-links { gap: 1.5rem; padding: 10px 20px; }
}

.nav-settings {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-btn {
  background: transparent;
  border: none;
  color: var(--color-text-main);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-accent);
}

.current-lang {
  font-weight: 700;
  font-size: 0.9rem;
}

.lang-dropdown-wrapper {
  position: relative;
}

.lang-menu {
  position: absolute;
  top: 120%;
  right: 0;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 120px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  backdrop-filter: blur(10px);
}

.lang-menu span {
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.lang-menu span:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-accent);
}

.lang-menu span.active {
  background: var(--color-accent);
  color: var(--color-accent-text);
}

.theme-toggle {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  border: 1px solid var(--color-border);
}

.icon-sun { color: #facc15; animation: spin 0.5s ease-out; }
.icon-moon { color: #a8a29e; animation: fade 0.5s ease-out; }

@keyframes spin { from { transform: rotate(-90deg) scale(0.5); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }
@keyframes fade { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>