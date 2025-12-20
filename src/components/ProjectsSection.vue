<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ExternalLink, LayoutGrid, Briefcase, Globe } from 'lucide-vue-next'

const { t } = useI18n()
const activeCategory = ref('all')

const projects = [
  {
    id: 1,
    titleKey: 'proj_erasmus_title',
    category: 'trans',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    descKey: 'proj_erasmus_desc',
    link: 'https://openbadgefactory.com/obv3/credentials/db277f0419ae76ed0993d88db0114f441ecefc59.html'
  },
  {
    id: 2,
    titleKey: 'proj_seminar_title',
    category: 'manage',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    descKey: 'proj_seminar_desc',
    link: '#'
  },
  {
    id: 3,
    titleKey: 'proj_nego_title',
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
            <Globe :size="16" /> Intercultural
          </button>
        </div>
      </div>

      <TransitionGroup name="list" tag="div" class="projects-grid">
        <div v-for="project in filteredProjects" :key="project.id" class="project-wrapper">

          <div class="browser-card glass-effect">
            <div class="browser-header">
              <div class="theme-lights">
                <span class="light red"></span>
                <span class="light yellow"></span>
                <span class="light green"></span>
              </div>
              <span class="browser-title">{{ t(project.titleKey) }}</span>
            </div>

            <div class="browser-body">
              <img :src="project.image" :alt="t(project.titleKey)" loading="lazy" />
              <div class="overlay">
                <a :href="project.link" target="_blank" class="btn-overlay">
                  {{ t('link_details') }} <ExternalLink :size="16" />
                </a>
              </div>
            </div>
          </div>

          <div class="project-details">
            <h3 class="proj-name">{{ t(project.titleKey) }}</h3>
            <p class="proj-desc">{{ t(project.descKey) }}</p>
          </div>

        </div>
      </TransitionGroup>

    </div>
  </section>
</template>

<style scoped>
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

/* --- STYLE DES FILTRES --- */
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

  /* Forme "Pill" par défaut sur Desktop */
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

/* --- UX MOBILE OPTIMISÉE ("Smart Wrap") --- */
@media (max-width: 768px) {
  .filter-container {
    padding: 0 10px; /* Petite marge de sécurité */
  }

  .filter-glass {
    /* On change la forme pour que ça fasse plus "bloc de contrôle" propre */
    border-radius: 20px;
    padding: 10px;
    width: 100%; /* Prend toute la largeur */
    display: flex;
    flex-wrap: wrap;
    gap: 8px; /* Espacement propre */
  }

  .filter-glass button {
    /* MAGIE UX : flex-grow: 1 permet aux boutons de remplir les trous */
    flex: 1 1 auto;
    justify-content: center; /* Texte centré */
    text-align: center;
    min-width: 110px; /* Évite qu'ils soient trop petits */
    padding: 12px 10px; /* Zone de clic confortable */
  }
}

/* --- Grille et Transitions --- */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 3rem;
  position: relative;
}

@media (max-width: 768px) {
  .projects-grid { grid-template-columns: 1fr; }
}

/* --- Animations de Liste --- */
.list-move,
.list-enter-active,
.list-leave-active { transition: all 0.6s cubic-bezier(0.55, 0, 0.1, 1); }
.list-enter-from,
.list-leave-to { opacity: 0; transform: translateY(30px) scale(0.9); }
.list-leave-active { position: absolute; width: 100%; max-width: 340px; z-index: -1; }

/* --- Carte Glass Browser --- */
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