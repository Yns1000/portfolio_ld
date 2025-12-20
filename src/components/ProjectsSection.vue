<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ExternalLink, LayoutGrid, Briefcase, Globe } from 'lucide-vue-next'

// On récupère t (traduction simple), tm (récupérer un tableau/objet) et rt (compiler le texte)
const { t, tm, rt } = useI18n()
const activeCategory = ref('all')

// On récupère dynamiquement la liste des projets depuis le fichier de langue actuel
const projects = computed(() => tm('projects_list') || [])

const filteredProjects = computed(() => {
  if (activeCategory.value === 'all') return projects.value
  // On filtre sur p.category qui est maintenant dans le JSON
  return projects.value.filter(p => p.category === activeCategory.value)
})

const setCategory = (cat) => activeCategory.value = cat
</script>

<template>
  <section id="projects" class="projects-section">
    <div class="glow-bg animate-pulse"></div>

    <div class="container">
      <h2 class="big-title">
        {{ t('section_projects_title') }}<span class="highlight">.</span>
      </h2>

      <div class="filter-container">
        <div class="filter-glass">
          <button @click="setCategory('all')" :class="{ active: activeCategory === 'all' }">
            <LayoutGrid :size="16" /> {{ t('filter_all') }}
          </button>
          <button @click="setCategory('manage')" :class="{ active: activeCategory === 'manage' }">
            <Briefcase :size="16" /> {{ t('filter_manage') }}
          </button>
          <button @click="setCategory('trans')" :class="{ active: activeCategory === 'trans' }">
            <Globe :size="16" /> {{ t('filter_trans') }}
          </button>
        </div>
      </div>

      <TransitionGroup name="list" tag="div" class="projects-grid">
        <div v-for="(project, index) in filteredProjects"
             :key="project.id || index"
             class="project-wrapper"
             v-reveal
             :style="{ transitionDelay: (index * 0.15) + 's' }">

          <div class="browser-card glass-effect">
            <div class="browser-header">
              <div class="theme-lights">
                <span class="light red"></span>
                <span class="light yellow"></span>
                <span class="light green"></span>
              </div>
              <span class="browser-title">{{ rt(project.title) }}</span>
            </div>

            <div class="browser-body">
              <img :src="project.image" :alt="rt(project.title)" loading="lazy" />
              <div class="overlay">
                <a :href="project.link" target="_blank" class="btn-overlay">
                  {{ t('link_details') }} <ExternalLink :size="16" />
                </a>
              </div>
            </div>
          </div>

          <div class="project-details">
            <h3 class="proj-name">{{ rt(project.title) }}</h3>
            <p class="proj-desc">{{ rt(project.desc) }}</p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>

<style scoped>
/* Garde tes styles actuels, ils sont parfaits */
.projects-section {
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
  background-color: var(--color-bg);
}

.glow-bg {
  position: absolute;
  top: 20%;
  right: 0;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--color-accent) 0%, transparent 70%);
  opacity: 0.1;
  filter: blur(80px);
  z-index: 0;
  pointer-events: none;
}

.animate-pulse { animation: pulse-glow 8s ease-in-out infinite alternate; }
@keyframes pulse-glow {
  0% { transform: scale(1); opacity: 0.08; }
  100% { transform: scale(1.2); opacity: 0.15; }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.big-title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  color: var(--color-text-main);
  line-height: 1;
  margin-bottom: 3rem;
  text-align: center;
}
.big-title .highlight { color: var(--color-accent); }

.filter-container {
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
  width: 100%;
}

.filter-glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px;
  border-radius: 50px;
  display: inline-flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-glass button {
  background: transparent;
  border: 1px solid transparent;
  padding: 10px 24px;
  border-radius: 40px;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-glass button:hover {
  color: var(--color-text-main);
  background: rgba(255, 255, 255, 0.05);
}

.filter-glass button.active {
  background: var(--color-accent);
  color: var(--color-accent-text);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .filter-container { padding: 0 10px; }
  .filter-glass { border-radius: 20px; padding: 10px; width: 100%; display: flex; flex-wrap: wrap; gap: 8px; }
  .filter-glass button { flex: 1 1 auto; justify-content: center; text-align: center; min-width: 110px; padding: 12px 10px; }
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 3rem;
  position: relative;
}

@media (max-width: 768px) {
  .projects-grid { grid-template-columns: 1fr; }
}

.project-wrapper { display: flex; flex-direction: column; gap: 1rem; }
.browser-card {
  border-radius: 16px;
  overflow: hidden;
  background: rgba(40, 30, 30, 0.4);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  will-change: transform;
}
.browser-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border-color: rgba(255, 255, 255, 0.25);
}
.browser-header {
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
}
.theme-lights { display: flex; gap: 8px; }
.light { width: 10px; height: 10px; border-radius: 50%; opacity: 0.8; }
.light.red { background: #ff5f56; }
.light.yellow { background: #ffbd2e; }
.light.green { background: #27c93f; }
.browser-title { flex: 1; text-align: center; font-family: monospace; font-size: 0.8rem; color: var(--color-text-muted); opacity: 0.7; }
.browser-body { height: 240px; position: relative; overflow: hidden; }
.browser-body img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s ease; }
.browser-card:hover .browser-body img { transform: scale(1.08); }
.overlay {
  position: absolute; inset: 0; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.3s ease;
}
.browser-card:hover .overlay { opacity: 1; }
.btn-overlay {
  background: var(--color-accent); color: var(--color-accent-text); padding: 10px 24px; border-radius: 50px; font-weight: 700; text-decoration: none;
  display: flex; align-items: center; gap: 8px;
  transform: translateY(20px); opacity: 0; transition: all 0.3s ease 0.1s;
}
.btn-overlay:hover { background-color: var(--color-accent-hover); transform: translateY(0) scale(1.05); }
.browser-card:hover .btn-overlay { transform: translateY(0); opacity: 1; }
.project-details { padding: 0 0.5rem; }
.proj-name { font-size: 1.4rem; font-weight: 700; color: var(--color-text-main); margin-bottom: 0.5rem; }
.proj-desc { font-size: 1rem; color: var(--color-text-muted); line-height: 1.5; }
</style>