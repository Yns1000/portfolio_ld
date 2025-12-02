<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activeCategory = ref('all')

const projects = [
  {
    id: 1,
    titleKey: 'proj_erasmus_title', // Clé de traduction
    category: 'trans',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    descKey: 'proj_erasmus_desc',
    link: 'https://openbadgefactory.com/obv3/credentials/db277f0419ae76ed0993d88db0114f441ecefc59.html'
  },
  {
    id: 2,
    titleKey: 'proj_seminar_title', // Clé de traduction
    category: 'manage',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    descKey: 'proj_seminar_desc',
    link: '#'
  },
  {
    id: 3,
    titleKey: 'proj_nego_title', // Clé de traduction
    category: 'manage',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    descKey: 'proj_negotiation_desc',
    link: '#'
  },
]

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') return projects
  return projects.filter(p => p.category === activeCategory.value)
})

const setCategory = (cat) => activeCategory.value = cat
</script>

<template>
  <section id="projects" class="projects-section">

    <div class="header-decoration">
      <div class="dots-grid">
        <span v-for="n in 20" :key="n" class="dot"></span>
      </div>
    </div>

    <div class="container">
      <h2 class="big-title">
        {{ t('section_projects_title') }}<span class="highlight">.</span>
      </h2>

      <div class="filter-container">
        <div class="filter-pill">
          <button @click="setCategory('all')" :class="{ active: activeCategory === 'all' }">{{ t('filter_all') }}</button>
          <button @click="setCategory('manage')" :class="{ active: activeCategory === 'manage' }">{{ t('filter_manage') }}</button>
          <button @click="setCategory('trans')" :class="{ active: activeCategory === 'trans' }">Intercultural</button>
        </div>
      </div>

      <div class="projects-grid">
        <div v-for="project in filteredProjects" :key="project.id" class="project-wrapper">

          <div class="browser-card">
            <div class="browser-header">
              <div class="theme-lights">
                <span class="light accent"></span>
                <span class="light muted"></span>
                <span class="light highlight-dot"></span>
              </div>
              <span class="browser-title">{{ t(project.titleKey) }}</span>
            </div>

            <div class="browser-body">
              <img :src="project.image" :alt="t(project.titleKey)" />
              <div class="overlay">
                <a :href="project.link" target="_blank" class="btn-overlay">{{ t('link_details') }}</a>
              </div>
            </div>
          </div>

          <div class="project-details">
            <h3 class="proj-name">> {{ t(project.titleKey) }}</h3>
            <p class="proj-desc">{{ t(project.descKey) }}</p>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* (Gardez le même style CSS qu'avant, rien ne change ici) */
.projects-section { position: relative; padding: 6rem 0; overflow: hidden; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; position: relative; z-index: 2; }
.big-title { font-size: clamp(3.5rem, 8vw, 6rem); font-weight: 800; color: var(--color-text-main); line-height: 1; margin-bottom: 3rem; font-family: var(--font-main); }
.big-title .highlight { color: var(--color-accent); }
.header-decoration { position: absolute; top: 50px; left: 20px; z-index: 1; opacity: 0.3; }
.dots-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.dots-grid .dot { width: 6px; height: 6px; background-color: var(--color-accent); border-radius: 50%; }
.filter-container { display: flex; justify-content: center; margin-bottom: 4rem; padding: 0 10px; }
.filter-pill { background-color: var(--color-accent); padding: 8px; border-radius: 50px; display: inline-flex; gap: 5px; box-shadow: 0 10px 20px rgba(0,0,0,0.1); flex-wrap: wrap; justify-content: center; }
.filter-pill button { background: transparent; border: 2px solid transparent; padding: 10px 24px; border-radius: 40px; font-family: var(--font-main); font-weight: 700; font-size: 1rem; color: var(--color-accent-text); cursor: pointer; transition: all 0.3s ease; white-space: nowrap; }
@media (max-width: 768px) { .filter-pill { width: 100%; border-radius: 20px; padding: 6px; } .filter-pill button { padding: 8px 16px; font-size: 0.9rem; flex: 1 1 auto; text-align: center; } }
.filter-pill button:hover { background-color: rgba(255,255,255,0.3); }
.filter-pill button.active { background-color: var(--color-bg-card); color: var(--color-text-main); border-color: var(--color-bg-card); transform: scale(1.05); box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
.projects-grid {
  display: grid;
  /* CHANGEMENT ICI : 'auto-fill' au lieu de 'auto-fit' */
  /* Cela empêche une carte seule de prendre toute la largeur */
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 4rem;
}
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr; /* Sur mobile, on garde le plein écran */
    gap: 3rem;
  }
}.project-wrapper { display: flex; flex-direction: column; }
.browser-card { background: var(--color-bg-card); border-radius: 12px; overflow: hidden; box-shadow: 12px 12px 0px rgba(0,0,0,0.2); border: 2px solid var(--color-border); transition: transform 0.3s ease, box-shadow 0.3s ease; position: relative; }
.project-wrapper:hover .browser-card { transform: translate(-4px, -4px); box-shadow: 16px 16px 0px var(--color-accent); border-color: var(--color-accent); }
.browser-header { padding: 10px 15px; background: var(--color-bg); border-bottom: 2px solid var(--color-border); display: flex; align-items: center; }
.theme-lights { display: flex; gap: 8px; }
.light { width: 12px; height: 12px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); }
.light.accent { background: var(--color-accent); }
.light.muted { background: var(--color-text-muted); }
.light.highlight-dot { background: var(--color-text-highlight); }
.browser-title { flex: 1; text-align: center; font-family: monospace; font-weight: 600; color: var(--color-text-muted); font-size: 0.9rem; }
.browser-body { height: 280px; position: relative; background: var(--color-bg-card); overflow: hidden; }
.browser-body img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; filter: grayscale(20%); }
.project-wrapper:hover .browser-body img { transform: scale(1.05); filter: grayscale(0%); }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease; }
.project-wrapper:hover .overlay { opacity: 1; }
.btn-overlay { background: var(--color-accent); color: var(--color-accent-text); padding: 10px 20px; border-radius: 30px; font-weight: 700; transform: translateY(20px); transition: transform 0.3s ease; text-decoration: none; }
.project-wrapper:hover .btn-overlay { transform: translateY(0); }
.project-details { margin-top: 1.5rem; padding-left: 10px; }
.proj-name { font-size: 1.8rem; font-weight: 800; color: var(--color-text-main); margin-bottom: 0.5rem; }
.proj-desc { font-size: 1.1rem; color: var(--color-text-muted); line-height: 1.6; max-width: 95%; }
</style>