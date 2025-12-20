<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Car, Trophy, GraduationCap, Heart } from 'lucide-vue-next'

const { t, tm } = useI18n()

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

// Récupération dynamique de la Timeline
const timelineData = computed(() => {
  const list = tm('timeline_list')
  return Array.isArray(list) ? list : []
})

// Récupération dynamique des Certifications
const certifications = computed(() => {
  const list = tm('cert_list')
  return Array.isArray(list) ? list : []
})

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
          <div class="profile-card glass-card" v-reveal>
            <h2 class="section-title">
              {{ t('section_about_title') }}<span class="highlight">.</span>
            </h2>
            <p class="intro">{{ t('about_intro') }}</p>
            <p class="text">{{ t('about_text') }}</p>

            <div class="info-badges">
              <span class="badge">{{ age }} {{ t('about_age_label') }}</span>
              <span class="badge icon-badge">
                <Car :size="18" class="badge-icon" />
                {{ t('about_driver_license') }}
              </span>
            </div>
          </div>

          <div class="info-block glass-card" v-reveal v-if="certifications.length > 0">
            <div class="block-header">
              <Trophy :size="22" class="block-icon" />
              <h3 class="block-title">{{ t('cert_title') }}</h3>
            </div>

            <div class="cert-list">
              <a v-for="(cert, index) in certifications"
                 :key="index"
                 :href="cert.link"
                 target="_blank"
                 class="cert-card">
                <div class="cert-icon-box">
                  <GraduationCap :size="26" />
                </div>
                <div class="cert-info">
                  <span class="cert-name">{{ cert.name }}</span>
                  <span class="cert-school">{{ cert.school }}</span>
                </div>
                <div class="cert-arrow">↗</div>
              </a>
            </div>
          </div>

          <div class="info-block glass-card">
            <div class="block-header">
              <Heart :size="22" class="block-icon" />
              <h3 class="block-title">{{ t('interests_title') }}</h3>
            </div>

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
          <div v-for="(item, index) in timelineData" :key="index" class="timeline-item" v-reveal>
            <div class="timeline-marker" :style="{ borderColor: getTypeColor(item.type) }"></div>
            <div class="timeline-content">
              <div class="meta-header">
                <span class="date">{{ item.period }}</span>
                <span class="type-pill" :style="{ backgroundColor: getTypeColor(item.type) }">
                  {{ t(getTypeLabel(item.type)) }}
                </span>
              </div>
              <h3 class="degree">{{ item.title }}</h3>
              <p class="school">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Conserve ton CSS actuel, j'ajoute juste un petit espacement pour la liste des certifs */
.cert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ... (Reste de ton CSS) ... */
.about-section { padding: 6rem 0; background-color: var(--color-bg); color: var(--color-text-main); position: relative; overflow: visible; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; display: grid; grid-template-columns: 1fr 1.2fr; gap: 6rem; align-items: start; position: relative; }
.left-column { position: relative; }
.content-wrapper { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 2rem; }
.glass-card { background: rgba(var(--color-bg-card-rgb, 40, 30, 30), 0.5); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 2.5rem; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1); position: relative; transform-style: preserve-3d; }
:root[data-theme="light"] .glass-card { background: rgba(255, 255, 255, 0.6); border: 1px solid rgba(0, 0, 0, 0.05); }
.decorations-container { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
.deco-item { position: absolute; opacity: 1; filter: drop-shadow(0 15px 25px rgba(0,0,0,0.3)); transition: all 0.3s ease; }
.stitch { top: -60px; left: -50px; width: 140px; transform: rotate(-10deg); z-index: 1; }
.volley { top: -40px; right: -50px; width: 110px; border-radius: 50%; transform: rotate(15deg); z-index: 3; }
.book { top: 45%; right: -60px; width: 100px; transform: rotate(15deg); border-radius: 5px; z-index: 3; }
.basket { bottom: -40px; left: -40px; width: 130px; border-radius: 50%; transform: rotate(-15deg); z-index: 2; }
@keyframes float { 0%, 100% { transform: translateY(0) rotate(var(--r)); } 50% { transform: translateY(-15px) rotate(var(--r)); } }
.float-slow { --r: -10deg; animation: float 7s ease-in-out infinite; }
.float-medium { --r: 15deg; animation: float 5s ease-in-out infinite; }
.float-fast { --r: -15deg; animation: float 6s ease-in-out infinite; }
.section-title { font-size: 3rem; font-weight: 800; margin-bottom: 1.5rem; line-height: 1.1; }
.highlight { color: var(--color-accent); }
.intro { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--color-accent); }
.text { color: var(--color-text-muted); line-height: 1.7; margin-bottom: 2rem; font-size: 1.05rem; }
.info-badges { display: flex; gap: 10px; margin-bottom: 0; flex-wrap: wrap; }
.badge { background: var(--color-bg-card); border: 1px solid var(--color-border); padding: 8px 16px; border-radius: 50px; font-weight: 600; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; color: var(--color-text-main); }
.badge-icon { color: var(--color-accent); }
.block-header { display: flex; align-items: center; gap: 12px; margin-bottom: 1rem; }
.block-icon { color: var(--color-accent); }
.block-title { font-size: 1.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; opacity: 0.9; margin: 0; }
.cert-card { display: flex; align-items: center; gap: 15px; background: var(--color-bg-card); padding: 15px; border-radius: 12px; border: 1px solid var(--color-border); text-decoration: none; color: inherit; transition: all 0.3s ease; }
.cert-card:hover { border-color: var(--color-accent); transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.cert-icon-box { display: flex; align-items: center; justify-content: center; color: var(--color-text-main); }
.cert-info { display: flex; flex-direction: column; flex: 1; }
.cert-name { font-weight: 700; font-size: 1rem; }
.cert-school { font-size: 0.85rem; color: var(--color-text-muted); }
.cert-arrow { font-weight: bold; color: var(--color-accent); }
.tags-cloud { display: flex; flex-wrap: wrap; gap: 10px; }
.hobby-tag { padding: 6px 14px; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--color-border); font-size: 0.9rem; transition: 0.3s; }
.hobby-tag:hover { background: var(--color-accent); color: var(--color-accent-text); border-color: var(--color-accent); }
.timeline { position: relative; padding-left: 30px; border-left: 2px solid var(--color-border); }
.timeline-item { position: relative; margin-bottom: 3.5rem; }
.timeline-item:last-child { margin-bottom: 0; }
.timeline-marker { position: absolute; left: -39px; top: 5px; width: 16px; height: 16px; border-radius: 50%; background: var(--color-bg); border: 3px solid; transition: all 0.3s ease; }
.timeline-item:hover .timeline-marker { transform: scale(1.3); background: var(--color-text-main); }
.meta-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 10px; }
.date { font-size: 0.95rem; font-weight: 700; color: var(--color-text-muted); font-family: monospace; }
.type-pill { font-size: 0.75rem; padding: 3px 10px; border-radius: 20px; color: var(--color-accent-text); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.degree { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--color-text-main); }
.school { font-size: 1.05rem; color: var(--color-text-muted); line-height: 1.5; }
</style>