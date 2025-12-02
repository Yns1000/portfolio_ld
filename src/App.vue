<script setup>
import { ref } from 'vue'
import PortfolioHero from './components/PortfolioHero.vue'
import IconCommunity from './components/icons/IconCommunity.vue'
import IconDocumentation from './components/icons/IconDocumentation.vue'
import IconTooling from './components/icons/IconTooling.vue'

// État pour le thème (true = sombre par défaut)
const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  // Note: C'est ici qu'on ajouterait la logique pour changer les couleurs CSS si besoin
}
</script>

<template>
  <header>
    <nav class="navbar">
      <div class="nav-icons">
        <a href="#" class="nav-item active"><IconCommunity /></a>
        <a href="#projects" class="nav-item"><IconTooling /></a>
        <a href="#studies" class="nav-item"><IconDocumentation /></a>
      </div>

      <div class="nav-settings">
        <div class="lang-switch">
          <span class="active">EN</span> | <span>FR</span> | <span>NL</span> | <span>ES</span>
        </div>

        <button
            class="theme-toggle"
            @click="toggleTheme"
            :aria-label="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
        >
          <div class="icon-wrapper" :class="{ 'dark-active': isDark }">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-sun"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>

            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          </div>
        </button>
      </div>
    </nav>
  </header>

  <main>
    <PortfolioHero />
  </main>
</template>

<style scoped>
/* Navigation Style */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  width: 100%;
}

.nav-icons {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  color: var(--color-text-muted);
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
}

.nav-item:hover, .nav-item.active {
  color: var(--color-accent);
}

.nav-settings {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.lang-switch span {
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.lang-switch span:hover, .lang-switch span.active {
  opacity: 1;
  color: var(--color-text-main);
}

/* --- Bouton style Shadcn (Outline/Ghost) --- */
.theme-toggle {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2); /* Bordure subtile */
  border-radius: 8px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-main);
  transition: all 0.2s ease;
  overflow: hidden; /* Nécessaire pour l'animation */
}

.theme-toggle:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: var(--color-accent); /* Touche de couleur au survol */
}

/* Wrapper pour positionner les icônes l'une sur l'autre */
.icon-wrapper {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  position: absolute;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); /* Transition fluide */
}

/* --- Animation des icônes --- */

/* État "Soleil" (Light mode) */
.icon-sun {
  transform: rotate(0deg) scale(1);
  opacity: 1;
}

.icon-moon {
  transform: rotate(90deg) scale(0);
  opacity: 0;
}

/* État "Lune" (Dark mode) activé */
.dark-active .icon-sun {
  transform: rotate(-90deg) scale(0);
  opacity: 0;
}

.dark-active .icon-moon {
  transform: rotate(0deg) scale(1);
  opacity: 1;
}
</style>