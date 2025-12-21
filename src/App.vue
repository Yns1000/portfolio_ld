<script setup>
import { ref, onMounted, onUnmounted, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

import {
  Home,
  Briefcase,
  User,
  Mail,
  Sun,
  Moon,
  Languages,
  Lock
} from 'lucide-vue-next'

import PortfolioHero from './components/PortfolioHero.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import AboutSection from './components/AboutSection.vue'
import ContactSection from './components/ContactSection.vue'
import AdminPortal from './components/admin/AdminPortal.vue'

const { locale, tm } = useI18n()
const isDark = ref(true)
const isLangMenuOpen = ref(false)
const activeSection = ref('home')
const isHovering = ref(false)
const isAdminOpen = ref(false)

const cursorStyle = ref({ transform: 'translate(-100px, -100px)' })

// --- LOGIQUE DES PALETTES DYNAMIQUES ---
watchEffect(() => {
  const paletteId = tm('theme_palette') || 1;
  document.documentElement.setAttribute('data-palette', paletteId);
});

// Surveillance de l'ouverture de l'admin
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
          <Lock :size="18" />
        </button>

        <div class="lang-dropdown-wrapper">
          <button class="icon-btn lang-btn" @click="isLangMenuOpen = !isLangMenuOpen" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
            <Languages :size="18" />
            <span class="current-lang">{{ locale.toUpperCase() }}</span>
          </button>
          <div class="lang-menu glass-panel" v-if="isLangMenuOpen">
            <span @click="changeLanguage('en')" :class="{ active: locale === 'en' }">🇬🇧 EN</span>
            <span @click="changeLanguage('fr')" :class="{ active: locale === 'fr' }">🇫🇷 FR</span>
            <span @click="changeLanguage('nl')" :class="{ active: locale === 'nl' }">🇳🇱 NL</span>
            <span @click="changeLanguage('es')" :class="{ active: locale === 'es' }">🇪🇸 ES</span>
          </div>
        </div>

        <button class="theme-toggle icon-btn" @click="toggleTheme" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
          <Sun v-if="!isDark" :size="18" class="icon-sun" />
          <Moon v-else :size="18" class="icon-moon" />
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

  <AdminPortal v-if="isAdminOpen" @close="isAdminOpen = false" />
</template>

<style>
html, body {
  margin: 0; padding: 0; width: 100%;
  background-color: var(--color-bg);
  color: var(--color-text-main);
  min-height: 100%;
}
body { overflow-x: hidden; transition: background-color 0.5s ease, color 0.5s ease; }

@media (min-width: 1024px) {
  html:not(.admin-mode), html:not(.admin-mode) body, html:not(.admin-mode) a,
  html:not(.admin-mode) button, html:not(.admin-mode) input, html:not(.admin-mode) textarea {
    cursor: none !important;
  }
}
.admin-mode, .admin-mode * { cursor: auto !important; }
#app { width: 100%; max-width: 100%; padding: 0 !important; }
</style>

<style scoped>
/* --- CURSEUR --- */
.custom-cursor {
  position: fixed; top: 0; left: 0; width: 20px; height: 20px;
  background-color: var(--color-accent); border-radius: 50%;
  pointer-events: none; z-index: 9999; mix-blend-mode: difference;
  transition: transform 0.05s linear, width 0.3s ease, height 0.3s ease;
}

/* --- HEADER ET NAVIGATION --- */
.site-header {
  position: fixed; top: 0; left: 0; width: 100%;
  z-index: 1000; padding: 1.2rem 2rem;
  transition: all 0.3s ease;
}

.glass-nav {
  /* On utilise le RGB du fond de la palette avec une opacité maîtrisée */
  background: rgba(var(--color-bg-rgb), 0.7);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-bottom: 1px solid var(--color-border);
}

/* Correction spécifique Light Mode : On ajoute une légère teinte de l'accent pour "colorer" le blanc */
:root[data-theme="light"] .glass-nav {
  background: rgba(var(--color-bg-rgb), 0.85);
  border-bottom: 1px solid rgba(var(--color-accent-rgb), 0.2);
}

.navbar {
  max-width: 1200px; margin: 0 auto;
  display: flex; justify-content: space-between; align-items: center;
}

/* --- CONTENEUR DES LIENS (La Pillule centrale) --- */
.nav-links {
  display: flex; gap: 2rem;
  /* On utilise la couleur de carte du thème pour le fond */
  background: rgba(var(--color-bg-card-rgb), 0.6);
  padding: 8px 24px; border-radius: 50px;
  /* ICI : On force la couleur principale (accent) en bordure pour donner du caractère en Light Mode */
  border: 1.5px solid rgba(var(--color-accent-rgb), 0.3);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

:root[data-theme="light"] .nav-links {
  background: rgba(var(--color-bg-card-rgb), 0.8);
  border-color: rgba(var(--color-accent-rgb), 0.4);
}

.nav-item {
  color: var(--color-text-muted); text-decoration: none;
  display: flex; align-items: center; gap: 10px;
  font-size: 0.9rem; font-weight: 700;
  transition: all 0.3s ease; position: relative;
}

.nav-item:hover, .nav-item.active {
  color: var(--color-accent);
}

.nav-item.active::after {
  content: ''; position: absolute; bottom: -6px; left: 20%; width: 60%;
  height: 2px; background: var(--color-accent);
  border-radius: 2px; box-shadow: 0 0 10px var(--color-accent);
}

/* --- OUTILS (ADMIN, LANG, THEME) --- */
.nav-settings { display: flex; align-items: center; gap: 0.8rem; }

.icon-btn {
  background: rgba(var(--color-bg-card-rgb), 0.6);
  border: 1.5px solid rgba(var(--color-accent-rgb), 0.2);
  color: var(--color-text-main);
  display: flex; align-items: center; gap: 6px;
  padding: 10px; border-radius: 12px;
  cursor: pointer; transition: 0.2s;
}

.icon-btn:hover {
  background: var(--color-accent);
  color: var(--color-accent-text) !important;
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.current-lang { font-size: 0.75rem; font-weight: 800; }

/* MENU LANGUES */
.lang-dropdown-wrapper { position: relative; }
.lang-menu {
  position: absolute; top: 125%; right: 0;
  background: var(--color-bg-card); border: 1px solid var(--color-border);
  border-radius: 16px; padding: 8px; display: flex; flex-direction: column;
  gap: 4px; min-width: 150px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  backdrop-filter: blur(10px);
}

/* =============================================
   RESPONSIVE (On garde tes corrections)
   ============================================= */

@media (max-width: 900px) {
  .site-header { padding: 1rem; }
  .nav-links { gap: 1.5rem; padding: 8px 16px; }
  .nav-text { display: none; } /* On ne garde que les icônes sur tablette/mobile */
}

@media (max-width: 600px) {
  .site-header {
    padding: 0.8rem;
    background: rgba(var(--color-bg-rgb), 0.9); /* Plus opaque sur mobile */
  }
  .navbar { flex-direction: row; justify-content: space-between; gap: 0.5rem; }
  .nav-links { gap: 1.2rem; padding: 8px 12px; }
  .nav-settings { gap: 0.5rem; }
  .icon-btn { padding: 8px; border-radius: 10px; }
}

/* Couleurs icônes thèmes */
.icon-sun { color: #facc15; }
.icon-moon { color: #a8a29e; }
</style>