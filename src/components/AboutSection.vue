<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

// --- Calcul de l'âge dynamique ---
const birthDate = new Date('2004-12-26')
const age = computed(() => {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
})

// --- Données Timeline ---
const timelineData = [
  { period: 'Sept. 2025 - ...', titleKey: 'timeline_asso_title', descKey: 'timeline_asso_desc', type: 'vol' },
  { period: 'Sept. 2025 - 2027', titleKey: 'timeline_master_title', descKey: 'timeline_master_desc', type: 'edu' },
  { period: 'Oct. 2024 - ...', titleKey: 'timeline_afev_title', descKey: 'timeline_afev_desc', type: 'vol' },
  { period: 'Juil. 2022 - ...', titleKey: 'timeline_mcdo_title', descKey: 'timeline_mcdo_desc', type: 'job' },
  { period: '2022 - 2025', titleKey: 'timeline_licence_title', descKey: 'timeline_licence_desc', type: 'edu' },
  { period: '2019 - 2022', titleKey: 'timeline_bac_title', descKey: 'timeline_bac_desc', type: 'edu' }
]

const getTypeColor = (type) => {
  if (type === 'edu') return 'var(--color-accent)'
  if (type === 'job') return '#e78fb3'
  if (type === 'vol') return '#9656a1'
  return '#ccc'
}

const getTypeLabel = (type) => {
  if (type === 'edu') return 'cat_education'
  if (type === 'job') return 'cat_job'
  if (type === 'vol') return 'cat_volunteering'
  return ''
}
</script>

<template>
  <section id="about" class="about-section">
    <div class="container">

      <div class="left-column">

        <div class="decorations-container">
          <img src="/volley.png" alt="Volleyball" class="deco-item volley float-slow" />
          <img src="/book.jpg" alt="Shakespeare Book" class="deco-item book float-medium" />
          <img src="/basket.png" alt="Basketball" class="deco-item basket float-fast" />
          <img src="/stitch.webp" alt="Stitch" class="deco-item stitch float-slow" />
        </div>

        <div class="content-wrapper">

          <div class="profile-card glass-card">
            <h2 class="section-title">
              {{ t('section_about_title') }}<span class="highlight">.</span>
            </h2>
            <p class="intro">{{ t('about_intro') }}</p>
            <p class="text">{{ t('about_text') }}</p>

            <div class="info-badges">
              <span class="badge">{{ age }} {{ t('about_age_label') }}</span>
              <span class="badge icon-badge">🚗 {{ t('about_driver_license') }}</span>
            </div>
          </div>

          <div class="info-block glass-card">
            <h3 class="block-title">🏆 {{ t('cert_title') }}</h3>
            <a href="https://openbadgefactory.com/obv3/credentials/db277f0419ae76ed0993d88db0114f441ecefc59.html" target="_blank" class="cert-card">
              <div class="cert-icon">🎓</div>
              <div class="cert-info">
                <span class="cert-name">{{ t('cert_name') }}</span>
                <span class="cert-school">{{ t('cert_school') }}</span>
              </div>
              <div class="cert-arrow">↗</div>
            </a>
          </div>

          <div class="info-block glass-card">
            <h3 class="block-title">❤️ {{ t('interests_title') }}</h3>
            <div class="tags-cloud">
              <span v-for="(hobby, index) in tm('hobbies')" :key="index" class="hobby-tag">
                {{ hobby }}
              </span>
            </div>
          </div>

        </div>
      </div>

      <div class="right-column">
        <div class="timeline">
          <div v-for="(item, index) in timelineData" :key="index" class="timeline-item">
            <div class="timeline-marker" :style="{ borderColor: getTypeColor(item.type) }"></div>
            <div class="timeline-content">
              <div class="meta-header">
                <span class="date">{{ item.period }}</span>
                <span class="type-pill" :style="{ backgroundColor: getTypeColor(item.type) }">
                  {{ t(getTypeLabel(item.type)) }}
                </span>
              </div>
              <h3 class="degree">{{ t(item.titleKey) }}</h3>
              <p class="school">{{ t(item.descKey) }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 6rem 0;
  background-color: var(--color-bg);
  color: var(--color-text-main);
  position: relative;
  overflow: visible; /* Important: On laisse les images dépasser ! */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 6rem; /* On augmente l'espace pour laisser passer les images au milieu */
  align-items: start;
  position: relative;
}

.left-column { position: relative; }

.content-wrapper {
  position: relative;
  z-index: 2; /* Le texte est au niveau 2 */
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.glass-card {
  background: rgba(var(--color-bg-card-rgb, 40, 30, 30), 0.5); /* Un peu plus opaque */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem; /* Plus d'espace intérieur */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: relative;
  /* Important : pour que les images en z-index 3 passent dessus */
  transform-style: preserve-3d;
}

:root[data-theme="light"] .glass-card {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

/* --- DÉCORATIONS CLAIREMENT VISIBLES --- */
.decorations-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* Pas de z-index global ici, on gère par item */
}

.deco-item {
  position: absolute;
  opacity: 1; /* ON VOIT TOUT ! */
  filter: drop-shadow(0 15px 25px rgba(0,0,0,0.3)); /* Grosse ombre pour le relief */
  transition: all 0.3s ease;
}

/* -- STITCH : En haut à gauche, posé sur le bord -- */
.stitch {
  top: -60px;
  left: -50px;
  width: 140px;
  transform: rotate(-10deg);
  z-index: 3; /* IL PASSE DEVANT LA CARTE ! Effet 3D */
}

/* -- VOLLEY : En haut à droite, flottant -- */
.volley {
  top: -40px;
  right: -50px;
  width: 110px;
  border-radius: 50%;
  transform: rotate(15deg);
  z-index: 1; /* Derrière */
}

/* -- LIVRE : Au milieu à droite, sortant de la certification -- */
.book {
  top: 45%;
  right: -60px;
  width: 100px;
  transform: rotate(15deg);
  border-radius: 5px;
  z-index: 3; /* DEVANT aussi */
}

/* -- BASKET : Tout en bas à gauche -- */
.basket {
  bottom: -40px;
  left: -40px;
  width: 130px;
  border-radius: 50%;
  transform: rotate(-15deg);
  z-index: 2; /* DEVANT */
}

/* Animations de flottement */
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(var(--r)); }
  50% { transform: translateY(-15px) rotate(var(--r)); }
}

.float-slow { --r: -10deg; animation: float 7s ease-in-out infinite; }
.float-medium { --r: 15deg; animation: float 5s ease-in-out infinite; }
.float-fast { --r: -15deg; animation: float 6s ease-in-out infinite; }

/* Responsive : On range un peu sur mobile */
@media (max-width: 768px) {
  .deco-item {
    width: 70px !important;
    z-index: 0 !important; /* Tout passe derrière sur mobile pour pas gêner */
    opacity: 0.8;
  }
  .stitch { top: -30px; left: -10px; }
  .volley { right: -10px; top: -30px; }
  .basket { bottom: -20px; left: -10px; }
  .book {
    display: block; /* On le réactive */
    top: auto;      /* On annule la position du haut */
    bottom: -20px;  /* On le met en bas */
    right: -10px;   /* À droite */
    z-index: 5 !important; /* DEVANT TOUT */
  }
  .glass-card { padding: 1.5rem; }
}

@media (max-width: 900px) {
  .container { grid-template-columns: 1fr; gap: 4rem; }
}

/* --- LE RESTE DU CSS (Inchangé) --- */
.section-title { font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.1; }
.highlight { color: var(--color-accent); }
.intro { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-accent); }
.text { color: var(--color-text-muted); line-height: 1.7; margin-bottom: 2rem; font-size: 1.05rem; }
.info-badges {
  display: flex;
  gap: 10px;
  margin-bottom: 0;
  /* CORRECTION : Permet aux badges de passer à la ligne si l'écran est trop petit */
  flex-wrap: wrap;
}
.badge {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 8px 16px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  /* CORRECTION : Empêche le texte de se couper mochement */
  white-space: nowrap;
}

@media (max-width: 600px) {
  .info-badges {
    gap: 8px; /* On réduit l'espace entre les badges */
  }

  .badge {
    font-size: 0.8rem; /* Police un peu plus petite */
    padding: 6px 12px; /* Badges moins larges */
    flex: 1 1 auto; /* Les badges s'adaptent intelligemment à la largeur */
    justify-content: center; /* Texte centré */
  }
}
.block-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.8; }
.cert-card { display: flex; align-items: center; gap: 15px; background: var(--color-bg-card); padding: 15px; border-radius: 12px; border: 1px solid var(--color-border); text-decoration: none; color: inherit; transition: all 0.3s ease; }
.cert-card:hover { border-color: var(--color-accent); transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.cert-icon { font-size: 1.5rem; }
.cert-info { display: flex; flex-direction: column; flex: 1; }
.cert-name { font-weight: 700; font-size: 1rem; }
.cert-school { font-size: 0.85rem; color: var(--color-text-muted); }
.cert-arrow { font-weight: bold; color: var(--color-accent); }
.tags-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
.hobby-tag { padding: 6px 14px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--color-border); font-size: 0.9rem; transition: 0.3s; }
.hobby-tag:hover { background: var(--color-accent); color: var(--color-accent-text); border-color: var(--color-accent); }

/* Timeline CSS (Inchangé) */
.timeline { position: relative; padding-left: 30px; border-left: 2px solid var(--color-border); }
.timeline-item { position: relative; margin-bottom: 3.5rem; }
.timeline-item:last-child { margin-bottom: 0; }
.timeline-marker { position: absolute; left: -37px; top: 5px; width: 16px; height: 16px; border-radius: 50%; background: var(--color-bg); border: 3px solid; transition: all 0.3s ease; }
.timeline-item:hover .timeline-marker { transform: scale(1.3); background: var(--color-text-main); }
.meta-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 10px; }
.date { font-size: 0.95rem; font-weight: 700; color: var(--color-text-muted); font-family: monospace; }
.type-pill { font-size: 0.75rem; padding: 3px 10px; border-radius: 20px; color: var(--color-accent-text); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.degree { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text-main); }
.school { font-size: 1.05rem; color: var(--color-text-muted); line-height: 1.5; }
</style>