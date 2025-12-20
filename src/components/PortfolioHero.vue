<script setup>
import { ref } from 'vue'
import { ArrowRight, User, Globe } from 'lucide-vue-next'

const cardRef = ref(null)
const cardStyle = ref({})

const handleMouseMove = (e) => {
  if (!cardRef.value || window.innerWidth < 1024) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const rotateX = ((y - centerY) / centerY) * -6
  const rotateY = ((x - centerX) / centerX) * 6

  cardStyle.value = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
    transition: 'transform 0.1s ease-out'
  }
}

const handleMouseLeave = () => {
  cardStyle.value = {
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    transition: 'transform 0.8s ease'
  }
}
</script>

<template>
  <section class="hero-wrapper">
    <div class="glow-bg"></div>
    <div class="fade-bottom"></div>

    <div class="decorations-container">
      <div class="dots-cluster">
        <span v-for="n in 15" :key="n" class="dot"></span>
      </div>
      <div class="geo-item geo-square glass-item"></div>
    </div>

    <div class="hero-container">

      <div
          class="visual-side"
          ref="cardRef"
          @mousemove="handleMouseMove"
          @mouseleave="handleMouseLeave"
          :style="cardStyle"
      >
        <div class="blob-aura"></div>
        <img src="/ld.png" alt="Logo" class="hero-logo" />
      </div>

      <div class="text-side">
        <div class="greeting-badge fade-in">
          <Globe :size="14" class="icon" />
          <span>{{ $t('greeting') }}</span>
        </div>

        <h1 class="main-title fade-in">
          {{ $t('intro') }}
        </h1>

        <p class="bio-text fade-in">
          <span v-html="$t('bio')"></span>
        </p>

        <div class="languages-area fade-in">
          <i18n-t keypath="fluent_sentence" tag="p" class="fluent-sentence">
            <template #en>
              <span class="lang-pill"><img src="https://flagcdn.com/w40/gb.png" alt="UK" /> {{ $t('lang_en') }}</span>
            </template>
            <template #es>
              <span class="lang-pill"><img src="https://flagcdn.com/w40/es.png" alt="Spain" /> {{ $t('lang_es') }}</span>
            </template>
            <template #fr>
              <span class="lang-pill"><img src="https://flagcdn.com/w40/fr.png" alt="France" /> {{ $t('lang_fr') }}</span>
            </template>
          </i18n-t>
        </div>

        <div class="cta-group fade-in">
          <a href="#projects" class="btn btn-primary">
            {{ $t('btn_projects') }} <ArrowRight :size="18" />
          </a>
          <a href="#about" class="btn btn-outline">
            {{ $t('btn_about') }} <User :size="18" />
          </a>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* --- Structure de base --- */
.hero-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  overflow: hidden;
  padding: 80px 0 40px 0;
}

.hero-container {
  width: 100%;
  max-width: 1300px; /* Légèrement plus large pour PC */
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column; /* Mobile first: Image en haut, texte en bas */
  align-items: center;
  gap: 2rem;
  z-index: 10;
}

/* --- Ambiance --- */
.glow-bg {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 70vh;
  background: radial-gradient(circle, var(--color-accent) 0%, transparent 70%);
  opacity: 0.12;
  filter: blur(80px);
  pointer-events: none;
}

.fade-bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 150px;
  background: linear-gradient(to bottom, transparent, var(--color-bg));
  z-index: 5;
}

/* --- Texte Side (Alignement vertical strict) --- */
.text-side {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centré par défaut sur mobile */
  text-align: center;
}

.greeting-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 14px;
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.main-title {
  font-size: clamp(2.5rem, 10vw, 5rem);
  font-weight: 900;
  line-height: 1.1;
  color: var(--color-text-main);
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
}

.bio-text {
  font-size: 1.05rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 500px;
  margin-bottom: 2rem;
}

.languages-area {
  width: 100%;
  margin-bottom: 2.5rem;
}

.fluent-sentence {
  color: var(--color-text-muted);
  font-size: 0.95rem;
}

.lang-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px 10px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: 600;
  margin: 4px;
  color: var(--color-text-main);
}
.lang-pill img { width: 16px; border-radius: 2px; }

/* Boutons */
.cta-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 320px;
}

.btn {
  padding: 16px 24px;
  border-radius: 14px;
  font-weight: 800;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s;
}
.btn-primary { background: var(--color-accent); color: white; }
.btn-outline { border: 2px solid var(--color-border); color: var(--color-text-main); }

/* --- Visual Side (Logo) --- */
.visual-side {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-logo {
  width: 90%;
  max-width: 320px; /* Taille mobile */
  height: auto;
  z-index: 2;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.2));
}

.blob-aura {
  position: absolute;
  width: 280px; height: 280px;
  background: var(--color-accent);
  filter: blur(80px);
  opacity: 0.15;
  border-radius: 50%;
  z-index: 0;
}

/* --- Décorations --- */
.decorations-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.dots-cluster {
  position: absolute;
  top: 5%; left: 5%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.dot { width: 4px; height: 4px; background-color: var(--color-text-muted); border-radius: 50%; opacity: 0.15; }
.geo-item {
  position: absolute;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}
.geo-square { width: 40px; height: 40px; bottom: 5%; right: 5%; transform: rotate(15deg); }

/* --- DESKTOP ADJUSTMENTS (L'alignement parfait est ici) --- */
@media (min-width: 1024px) {
  .hero-container {
    flex-direction: row-reverse; /* Logo à droite, texte à gauche */
    justify-content: space-between;
    gap: 4rem;
  }

  .text-side {
    flex: 1;
    align-items: flex-start; /* Alignement vertical strict à gauche */
    text-align: left;
  }

  .main-title {
    margin-left: -4px; /* Ajustement optique pour la lettrine */
  }

  .cta-group {
    flex-direction: row;
    max-width: none;
  }

  .hero-logo {
    max-width: 700px; /* LOGO AGRANDI SUR PC */
  }

  .blob-aura {
    width: 500px; height: 500px;
  }

  .visual-side {
    flex: 1.2;
    transform-style: preserve-3d;
  }

  .dots-cluster { top: 15%; left: 2%; }
  .geo-square { width: 80px; height: 80px; bottom: 15%; right: 40%; }
}

/* Animations */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s ease forwards;
}
@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }
</style>