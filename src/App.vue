<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  Home,
  Briefcase,
  User,
  Mail,
  Sun,
  Moon,
  Languages,
  Lock // Import de l'icône de connexion
} from 'lucide-vue-next'

import PortfolioHero from './components/PortfolioHero.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
import AdminPanel from './components/AdminPanel.vue'

const { locale } = useI18n()
const isDark = ref(true)
const isLangMenuOpen = ref(false)
const activeSection = ref('home')
const isHovering = ref(false)
const isAdminOpen = ref(false)

const cursorStyle = ref({ transform: 'translate(-100px, -100px)' })

// Surveillance de l'ouverture de l'admin pour rétablir la souris système
watch(isAdminOpen, (open) => {
  if (open) {
    document.documentElement.classList.add('admin-mode')
  } else {
    document.documentElement.classList.remove('admin-mode')
  }
})

const updateCursor = (e) => {
  const size = isHovering.value ? 40 : 20
  cursorStyle.value = {
    transform: `translate(${e.clientX - size / 2}px, ${e.clientY - size / 2}px)`,
    width: `${size}px`,
    height: `${size}px`
  }
}

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

  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', updateCursor)
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, { threshold: 0.3 })

  document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section)
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateCursor)
})
</script>

<template>
  <div v-if="!isAdminOpen" class="custom-cursor" :style="cursorStyle"></div>

  <header class="site-header glass-nav">
    <nav class="navbar">
      <div class="nav-links">
        <a href="#home" class="nav-item" :class="{ active: activeSection === 'home' }" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
          <Home :size="20" />
          <span class="nav-text">Home</span>
        </a>
        <a href="#projects" class="nav-item" :class="{ active: activeSection === 'projects' }" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
          <Briefcase :size="20" />
          <span class="nav-text">Projets</span>
        </a>
        <a href="#about" class="nav-item" :class="{ active: activeSection === 'about' }" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
          <User :size="20" />
          <span class="nav-text">À propos</span>
        </a>
        <a href="#contact" class="nav-item" :class="{ active: activeSection === 'contact' }" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
          <Mail :size="20" />
          <span class="nav-text">Contact</span>
        </a>
      </div>

      <div class="nav-settings">
        <button
            class="icon-btn admin-btn"
            @click="isAdminOpen = true"
            @mouseenter="isHovering = true"
            @mouseleave="isHovering = false"
            title="Administration"
        >
          <Lock :size="20" />
        </button>

        <div class="lang-dropdown-wrapper">
          <button class="icon-btn" @click="isLangMenuOpen = !isLangMenuOpen" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
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
        <button class="theme-toggle icon-btn" @click="toggleTheme" @mouseenter="isHovering = true" @mouseleave="isHovering = false" :aria-label="isDark ? 'Mode clair' : 'Mode sombre'">
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

  <AdminPanel v-if="isAdminOpen" @close="isAdminOpen = false" />

  <footer style="padding: 2rem; text-align: center; opacity: 0.5;">
    {{ $t('footer_rights') }}
  </footer>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: var(--color-bg);
  color: var(--color-text-main);
  min-height: 100%;
}

body {
  overflow-x: hidden;
  transition: background-color 0.5s ease;
}

/* MODIFICATION : On ne cache la souris que si on n'est PAS en mode admin */
@media (min-width: 1024px) {
  html:not(.admin-mode),
  html:not(.admin-mode) body,
  html:not(.admin-mode) a,
  html:not(.admin-mode) button,
  html:not(.admin-mode) input,
  html:not(.admin-mode) textarea {
    cursor: none !important;
  }
}

/* On force le curseur normal pour l'admin */
.admin-mode, .admin-mode * {
  cursor: auto !important;
}

#app {
  width: 100%;
  max-width: 100%;
  padding: 0 !important;
  background-color: var(--color-bg);
}
</style>

<style scoped>
.custom-cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: var(--color-accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
  transition: transform 0.05s linear, width 0.3s ease, height 0.3s ease;
  will-change: transform;
}

.admin-btn {
  color: var(--color-text-muted);
}

.admin-btn:hover {
  color: var(--color-accent) !important;
}

@media (max-width: 1023px) {
  .custom-cursor {
    display: none !important;
  }
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1rem 2rem;
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
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover, .nav-item.active {
  color: var(--color-accent);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--color-accent);
  border-radius: 2px;
  box-shadow: 0 0 10px var(--color-accent);
}

@media (max-width: 768px) {
  .nav-text { display: none; }
  .nav-links { gap: 1.5rem; }
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
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-accent);
}

.lang-dropdown-wrapper { position: relative; }

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
  transition: 0.2s;
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
  justify-content: center;
  border: 1px solid var(--color-border);
}

.icon-sun { color: #facc15; animation: spin 0.5s ease-out; }
.icon-moon { color: #a8a29e; animation: fade 0.5s ease-out; }

@keyframes spin { from { transform: rotate(-90deg) scale(0.5); opacity: 0; } to { transform: rotate(0) scale(1); opacity: 1; } }
@keyframes fade { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>