<script setup>
import { ref } from 'vue'
import { ArrowRight, User, Globe, Download } from 'lucide-vue-next'

const cardRef = ref(null)
const cardStyle = ref({})

const handleMouseMove = (e) => {
  if (!cardRef.value || window.innerWidth < 1024) return
  const rect = cardRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const centerX = rect.width / 2
  const centerY = rect.height / 2

  const rotateX = ((y - centerY) / centerY) * -5
  const rotateY = ((x - centerX) / centerX) * 5

  cardStyle.value = {
    transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`,
    transition: 'transform 0.1s ease-out'
  }
}

const handleMouseLeave = () => {
  cardStyle.value = {
    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)',
    transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)'
  }
}
</script>

<template>
  <section id="home" class="hero-wrapper">
    <div class="glow-bg"></div>
    <div class="fade-bottom-mask"></div>

    <div class="decorations-layer">
      <div class="dots-magnetic-grid">
        <span v-for="n in 25" :key="n" class="dot"></span>
      </div>

      <div class="geo-shape geo-square glass-item"></div>
      <div class="geo-shape geo-l-shape glass-item"></div>
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
        <img src="/ld.png" alt="aurine Dhilly - Portfolio Management International" class="hero-logo" />
      </div>

      <div class="text-side">
        <div class="greeting-badge fade-in">
          <Globe :size="14" class="icon-accent" />
          <span>{{ $t('greeting') }}</span>
        </div>

        <h1 class="main-title fade-in" style="animation-delay: 0.1s">
          {{ $t('intro') }}
        </h1>

        <p class="bio-text fade-in" style="animation-delay: 0.2s">
          <span v-html="$t('bio')"></span>
        </p>

        <div class="languages-display fade-in" style="animation-delay: 0.3s">
          <i18n-t keypath="fluent_sentence" tag="p" class="fluent-sentence">
            <template #en>
              <span class="lang-pill"><img src="https://flagcdn.com/w40/gb.png" alt="EN" /> {{ $t('lang_en') }}</span>
            </template>
            <template #es>
              <span class="lang-pill"><img src="https://flagcdn.com/w40/es.png" alt="ES" /> {{ $t('lang_es') }}</span>
            </template>
            <template #fr>
              <span class="lang-pill"><img src="https://flagcdn.com/w40/fr.png" alt="FR" /> {{ $t('lang_fr') }}</span>
            </template>
          </i18n-t>
        </div>

        <div class="cta-group fade-in" style="animation-delay: 0.4s">
          <a href="#projects" class="btn btn-primary">
            {{ $t('btn_projects') }} <ArrowRight :size="18" />
          </a>
          <a href="#about" class="btn btn-outline">
            {{ $t('btn_about') }} <User :size="18" />
          </a>
        </div>

        <div class="cv-inline-wrapper fade-in" style="animation-delay: 0.5s">
          <a :href="$t('cv_link')" download class="cv-premium-pill">
            <div class="glow-effect"></div>
            <Download :size="18" />
            <span>{{ $t('btn_cv') }}</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg);
  overflow: visible;
  overflow-x: clip;
  padding: 100px 0 60px 0;
}

.hero-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
}

.glow-bg {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 120vw;
  height: 80vh;
  background: radial-gradient(circle at center, var(--color-accent) 0%, transparent 70%);
  opacity: 0.08;
  filter: blur(100px);
  pointer-events: none;
}

.fade-bottom-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 250px;
  background: linear-gradient(to bottom, transparent, var(--color-bg));
  z-index: 5;
  pointer-events: none;
}

.text-side {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.greeting-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.main-title {
  font-size: clamp(2.8rem, 10vw, 6rem);
  font-weight: 950;
  line-height: 1;
  color: var(--color-text-main);
  letter-spacing: -0.05em;
  margin-bottom: 1.5rem;
  background: linear-gradient(
      to right,
      var(--color-text-main) 60%,
      rgba(var(--color-text-main-rgb, 0, 0, 0), 0.4)
  );
  -webkit-background-clip: text;
  background-clip: text;
}

.bio-text {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  max-width: 550px;
  margin-bottom: 1.5rem;
}

.fluent-sentence {
  color: var(--color-text-muted);
  font-size: 1rem;
  margin-bottom: 2rem;
}

.lang-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  padding: 5px 12px;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-weight: 600;
  margin: 3px;
  color: var(--color-text-main);
}
.lang-pill img { width: 18px; border-radius: 2px; }

.cta-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 340px;
  position: relative;
  z-index: 20;
}

.btn {
  padding: 16px 28px;
  border-radius: 14px;
  font-weight: 800;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.btn-primary { background: var(--color-accent); color: white; box-shadow: 0 10px 25px rgba(var(--color-accent-rgb), 0.2); }
.btn-primary:hover { transform: translateY(-5px); box-shadow: 0 15px 40px rgba(var(--color-accent-rgb), 0.4); }
.btn-outline { border: 2px solid var(--color-border); color: var(--color-text-main); }
.btn-outline:hover { border-color: var(--color-text-main); background: rgba(255,255,255,0.05); transform: translateY(-5px); }

.visual-side {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-logo {
  margin-top: 1rem;
  width: 90%;
  max-width: 320px;
  height: auto;
  z-index: 2;
  filter: drop-shadow(0 20px 40px rgba(0,0,0,0.3));
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

.decorations-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.dots-magnetic-grid {
  display: none;
}

.glass-item {
  position: absolute;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  pointer-events: auto;
  transition: all 0.6s ease;
}

.geo-square {
  width: 50px; height: 50px;
  bottom: 5%; right: 5%;
  transform: rotate(15deg);
}
.geo-square:hover { transform: rotate(0deg) scale(1.1); background: rgba(255,255,255,0.05); }

.geo-l-shape {
  width: 70px; height: 70px;
  top: 11%; right: 5%;
  background: transparent;
  border-top: 15px solid var(--color-accent);
  border-right: 15px solid var(--color-accent);
  border-radius: 0 15px 0 0;
  backdrop-filter: none; box-shadow: none; border-bottom: none; border-left: none;
}
.geo-l-shape:hover { transform: scale(1.1); opacity: 0.8; }

@media (min-width: 1024px) {
  .hero-container {
    flex-direction: row-reverse;
    justify-content: space-between;
    gap: 6rem;
  }

  .text-side {
    flex: 1.1;
    align-items: flex-start;
    text-align: left;
  }

  .main-title {
    margin-left: -6px;
    margin-bottom: 2rem;
  }

  .bio-text { margin-bottom: 2.5rem; }

  .cta-group {
    flex-direction: row;
    gap: 1.5rem;
    max-width: none;
  }

  .hero-logo {
    max-width: 800px;
  }

  .blob-aura { width: 600px; height: 600px; }

  .visual-side {
    flex: 1.3;
    transform-style: preserve-3d;
  }

  .dots-magnetic-grid {
    display: grid;
    position: absolute;
    top: 12%;
    left: 4%;
    grid-template-columns: repeat(5, 1fr);
    gap: 11px;
    pointer-events: auto;
  }
  .dot {
    width: 4px; /* Un poil plus gros */
    height: 4px;
    background-color: var(--color-text-muted);
    border-radius: 50%;
    opacity: 0.15;
    transition:
        transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
        background-color 0.3s ease,
        box-shadow 0.3s ease,
        opacity 0.3s ease;
    will-change: transform, box-shadow;
  }

  .dot:hover {
    opacity: 1;
    background-color: var(--color-accent);
    transform: scale(3.5);
    box-shadow:
        0 0 10px var(--color-accent),
        0 0 20px rgba(var(--color-accent-rgb), 0.5);
    animation: dotPulse 1.5s infinite;
  }

  @keyframes dotPulse {
    0% { box-shadow: 0 0 10px var(--color-accent); }
    50% { box-shadow: 0 0 25px var(--color-accent), 0 0 40px rgba(var(--color-accent-rgb), 0.2); }
    100% { box-shadow: 0 0 10px var(--color-accent); }
  }

  .geo-square { width: 100px; height: 100px; bottom: 15%; right: 40%; }
}

.fade-in {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

.icon-accent { color: var(--color-accent); }

:root[data-theme="light"] .greeting-badge {
  background: rgba(0, 0, 0, 0.04);
  border-color: rgba(0, 0, 0, 0.1);
}

:root[data-theme="light"] .lang-pill {
  background: rgba(0, 0, 0, 0.03);
  border-color: rgba(0, 0, 0, 0.08);
}

:root[data-theme="light"] .glass-item {
  border-color: rgba(0, 0, 0, 0.08);
}

:root[data-theme="light"] .dot {
  opacity: 0.15;
  background-color: var(--color-text-muted);
}

:root[data-theme="light"] .blob-aura {
  opacity: 0.25;
  filter: blur(60px);
}

/* Espacement sous le bloc de boutons principaux */
.cta-group {
  margin-bottom: 2.5rem; /* Crée l'espace nécessaire avant le CV */
}

/* Le conteneur du bouton CV */
.cv-inline-wrapper {
  display: flex;
  width: 100%;
  justify-content: center; /* Centré par défaut (mobile) */
}

/* Aligné à gauche sur Desktop pour suivre le texte de Laurine */
@media (min-width: 1024px) {
  .cv-inline-wrapper {
    justify-content: flex-start;
  }
}

.cv-premium-pill {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 22px;
  background: rgba(var(--color-bg-card-rgb), 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--color-accent-rgb), 0.3);
  border-radius: 50px;
  color: var(--color-text-main);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  z-index: 10;
  overflow: hidden;
}

.cv-premium-pill:hover {
  transform: translateY(-3px);
  border-color: var(--color-accent);
  background: rgba(var(--color-accent-rgb), 0.1);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  color: var(--color-accent);
}

.glow-effect {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, var(--color-accent) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.cv-premium-pill:hover .glow-effect {
  opacity: 0.15;
}
</style>