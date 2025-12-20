<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="app-brand">
          <div class="brand-square"><LayoutDashboard :size="20" /></div>
          <div class="brand-text">
            <span>Console Admin</span>
            <small>v2.1.0</small>
          </div>
        </div>
      </div>

      <div class="sidebar-nav-tabs">
        <button @click="viewMode = 'projects'" :class="['nav-tab-btn', { active: viewMode === 'projects' }]">
          <Briefcase :size="18" />
          <span>Projets</span>
        </button>
        <button @click="viewMode = 'about'" :class="['nav-tab-btn', { active: viewMode === 'about' }]">
          <User :size="18" />
          <span>À propos</span>
        </button>
      </div>

      <div class="sidebar-divider"></div>

      <nav v-if="viewMode === 'projects'" class="project-list custom-scrollbar">
        <div class="list-header">
          <span>{{ projects.length }} Réalisations</span>
          <button @click="$emit('add')" class="btn-add-circle" title="Nouveau projet">
            <Plus :size="16" />
          </button>
        </div>

        <div v-for="(proj, index) in projects" :key="proj.id"
             class="project-item" :class="{ active: currentIdx === index }"
             @click="currentIdx = index">
          <div class="project-indicator"></div>
          <div class="project-details">
            <span class="project-title">{{ proj.fr.title || 'Sans titre' }}</span>
            <div class="project-meta">
              <span class="tag">{{ proj.category }}</span>
              <div class="lang-dots">
                <span v-for="l in ['fr', 'en', 'es', 'nl']" :key="l"
                      :class="['dot', { filled: proj[l]?.title }]"></span>
              </div>
            </div>
          </div>
          <button @click.stop="confirmDelete(index)" class="btn-delete-item">
            <Trash2 :size="14" />
          </button>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button @click="$emit('save')" :disabled="isSaving" class="btn-save-main" :class="{ 'btn-loading': isSaving }">
          <CloudUpload v-if="!isSaving" :size="20" />
          <Loader2 v-else class="spin" :size="20" />
          <span>{{ isSaving ? 'Synchronisation...' : 'Enregistrer les modifications' }}</span>
        </button>
        <button @click="$emit('logout')" class="logout-link"><LogOut :size="14" /> Quitter la session</button>
      </div>
    </aside>

    <main class="main-stage">
      <header class="stage-header">
        <div class="header-breadcrumb">
          <span class="breadcrumb-root">{{ viewMode === 'projects' ? 'Projets' : 'Profil' }}</span>
          <ChevronRight :size="14" class="sep" />
          <span class="breadcrumb-current">{{ currentItemName }}</span>
        </div>

        <div class="header-actions">
          <div class="lang-selector">
            <button v-for="l in (['fr', 'en', 'es', 'nl'] as const)" :key="l"
                    :class="['lang-tab', { active: editLang === l }]"
                    @click="editLang = l">
              {{ l.toUpperCase() }}
            </button>
          </div>
          <div class="v-divider"></div>
          <button @click="$emit('close')" class="btn-close-app"><X :size="20" /></button>
        </div>
      </header>

      <div class="stage-content custom-scrollbar">
        <div v-if="viewMode === 'projects' && currentIdx !== null" class="editor-grid">
          <div class="editor-main">
            <div class="content-card">
              <div class="card-head">
                <Languages :size="18" class="icon-accent" />
                <h3>Contenu Localisé ({{ editLang.toUpperCase() }})</h3>
              </div>
              <div class="card-body">
                <div class="input-box">
                  <label>Titre du projet <span class="req">*</span></label>
                  <input v-model.trim="projects[currentIdx][editLang].title" placeholder="Ex: Plateforme E-commerce" />
                </div>
                <div class="input-box">
                  <label>Description détaillée</label>
                  <textarea v-model="projects[currentIdx][editLang].desc" rows="12" placeholder="Décrivez les défis, les solutions et les technologies..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <aside class="editor-side">
            <div class="content-card">
              <div class="card-head"><Settings :size="18" class="icon-accent" /> <h3>Configuration</h3></div>
              <div class="card-body">
                <div class="input-box">
                  <label>Catégorie</label>
                  <select v-model="projects[currentIdx].category">
                    <option value="manage">Gestion de projet</option>
                    <option value="trans">Interculturel</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                <div class="input-box">
                  <label>Lien du projet</label>
                  <div class="input-with-icon">
                    <Link :size="14" />
                    <input v-model="projects[currentIdx].link" placeholder="https://..." />
                  </div>
                </div>
                <div class="input-box">
                  <label>Image de couverture</label>
                  <input v-model="projects[currentIdx].image" placeholder="URL de l'image" />
                  <div class="image-preview" v-if="projects[currentIdx].image">
                    <img :src="projects[currentIdx].image" alt="Preview" />
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else-if="viewMode === 'about'" class="editor-grid">
          <div class="editor-main">
            <div class="content-card">
              <div class="card-head"><Home :size="18" class="icon-accent" /> <h3>Hero Section (Accueil)</h3></div>
              <div class="card-body">
                <div class="input-row">
                  <div class="input-box"><label>Badge Greeting</label><input v-model="aboutData[editLang].intro_hero" /></div>
                  <div class="input-box"><label>Nom / Titre</label><input v-model="aboutData[editLang].name_hero" /></div>
                </div>
                <div class="input-box">
                  <label>Texte Bio Courte</label>
                  <textarea v-model="aboutData[editLang].bio_hero" rows="3"></textarea>
                  <span class="hint">Supporte le HTML pour les mises en évidence.</span>
                </div>
              </div>
            </div>

            <div class="content-card mt-24">
              <div class="card-head flex-between">
                <div class="flex-align-gap">
                  <History :size="18" class="icon-accent" />
                  <h3>Parcours & Expériences</h3>
                </div>
                <button @click="$emit('add-timeline')" class="btn-secondary">
                  <Plus :size="16" /> Ajouter une étape
                </button>
              </div>
              <div class="card-body list-container">
                <div v-for="(item, idx) in aboutData.timeline" :key="idx" class="list-item-card">
                  <div class="item-header-row">
                    <div class="input-box flex-2"><label>Période</label><input v-model="item.period" /></div>
                    <div class="input-box flex-1"><label>Type</label>
                      <select v-model="item.type">
                        <option value="edu">Formation</option>
                        <option value="job">Expérience</option>
                        <option value="vol">Bénévolat</option>
                      </select>
                    </div>
                    <button @click="$emit('delete-timeline', idx)" class="btn-icon-delete"><Trash2 :size="16" /></button>
                  </div>
                  <div class="input-box"><label>Intitulé ({{ editLang.toUpperCase() }})</label><input v-model="item[editLang].title" /></div>
                </div>
              </div>
            </div>
          </div>

          <aside class="editor-side">
            <div class="content-card">
              <div class="card-head"><Heart :size="18" class="icon-accent" /> <h3>Passions</h3></div>
              <div class="card-body">
                <div class="tags-container">
                  <span v-for="(hobby, idx) in aboutData[editLang].hobbies" :key="idx" class="hobby-tag-pill">
                    {{ hobby }}
                    <button @click="removeHobby(idx)" class="btn-remove-tag"><X :size="12" /></button>
                  </span>
                </div>
                <div class="add-tag-box">
                  <input v-model="newHobby" placeholder="Ajouter..." @keyup.enter="addHobby" />
                  <button @click="addHobby" class="btn-add-tag"><Plus :size="16" /></button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="empty-state">
          <div class="empty-glow"></div>
          <div class="empty-icon"><MousePointerClick :size="40" /></div>
          <h2>Console Prête</h2>
          <p>Sélectionnez un projet pour modifier son contenu ou gérez votre profil.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  LayoutDashboard, Plus, Trash2, CloudUpload, Loader2, LogOut, X, Home,
  Languages, Settings, MousePointerClick, History, Trophy, Link,
  User, Briefcase, Heart, ChevronRight
} from 'lucide-vue-next'

const props = defineProps<{ projects: any[], aboutData: any, isSaving: boolean }>();
const emit = defineEmits(['add', 'delete', 'save', 'logout', 'close', 'add-timeline', 'delete-timeline', 'add-cert', 'delete-cert'])

const viewMode = ref<'projects' | 'about'>('projects')
const currentIdx = ref<number | null>(null)
const editLang = ref<'fr' | 'en' | 'es' | 'nl'>('fr')
const newHobby = ref('')

const currentItemName = computed(() => {
  if (viewMode.value === 'about') return 'Biographie'
  if (currentIdx.value !== null && props.projects[currentIdx.value]) {
    return props.projects[currentIdx.value].fr.title || 'Nouveau Projet'
  }
  return 'Sélection...'
})

const confirmDelete = (index: number) => {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.")) {
    emit('delete', index)
    if (currentIdx.value === index) currentIdx.value = null
  }
}

const addHobby = () => {
  const h = newHobby.value.trim()
  if (h && !props.aboutData[editLang.value].hobbies.includes(h)) {
    props.aboutData[editLang.value].hobbies.push(h)
    newHobby.value = ''
  }
}
const removeHobby = (idx: number) => { props.aboutData[editLang.value].hobbies.splice(idx, 1) }
</script>

<style scoped>
/* CONSEIL : Utiliser des variables CSS pour la maintenance
*/
:host {
  --accent: #6366f1;
  --accent-hover: #818cf8;
  --bg-dark: #080809;
  --bg-card: #0e0e11;
  --border: rgba(255, 255, 255, 0.08);
  --text-dim: #94a3b8;
}

.dashboard-layout {
  width: 98vw; height: 96vh; max-width: 1700px;
  background: var(--bg-dark); border: 1px solid var(--border);
  border-radius: 24px; display: flex; overflow: hidden;
  box-shadow: 0 50px 100px -20px rgba(0,0,0,0.8); color: #f8fafc;
  font-family: 'Inter', system-ui, sans-serif;
}

/* SIDEBAR REVISITÉE */
.sidebar { width: 320px; background: #0c0c0e; border-right: 1px solid var(--border); display: flex; flex-direction: column; }
.sidebar-header { padding: 32px 24px; }
.app-brand { display: flex; align-items: center; gap: 14px; }
.brand-square { width: 40px; height: 40px; background: var(--accent); border-radius: 12px; display: grid; place-items: center; color: white; box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
.brand-text { display: flex; flex-direction: column; }
.brand-text span { font-weight: 800; font-size: 1rem; letter-spacing: -0.5px; }
.brand-text small { font-size: 0.7rem; color: var(--text-dim); }

.nav-tab-btn {
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  background: transparent; border: none; color: var(--text-dim); border-radius: 14px;
  cursor: pointer; font-weight: 600; transition: 0.2s; margin: 0 16px 4px;
}
.nav-tab-btn:hover { background: rgba(255,255,255,0.03); color: white; }
.nav-tab-btn.active { background: rgba(99, 102, 241, 0.1); color: var(--accent-hover); }

/* PROJECT ITEMS */
.list-header { padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-dim); font-weight: 700; text-transform: uppercase; }
.btn-add-circle { width: 28px; height: 28px; border-radius: 50%; border: none; background: var(--accent); color: white; cursor: pointer; display: grid; place-items: center; transition: 0.3s; }
.btn-add-circle:hover { transform: rotate(90deg); background: var(--accent-hover); }

.project-item {
  padding: 14px 24px; margin: 2px 12px; border-radius: 14px;
  cursor: pointer; position: relative; display: flex; align-items: center;
  transition: all 0.2s; border: 1px solid transparent;
}
.project-item:hover { background: rgba(255,255,255,0.03); }
.project-item.active { background: #16161a; border-color: rgba(99, 102, 241, 0.2); }
.project-indicator { width: 4px; height: 0; background: var(--accent); position: absolute; left: 0; border-radius: 0 4px 4px 0; transition: 0.3s; }
.project-item.active .project-indicator { height: 20px; }

.project-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.tag { font-size: 0.65rem; color: var(--text-dim); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
.lang-dots { display: flex; gap: 4px; }
.dot { width: 5px; height: 5px; border-radius: 50%; background: #334155; }
.dot.filled { background: var(--accent); }

/* MAIN STAGE */
.stage-header { height: 80px; padding: 0 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); background: rgba(8, 8, 9, 0.8); backdrop-filter: blur(10px); z-index: 10; }
.header-breadcrumb { display: flex; align-items: center; gap: 10px; }
.breadcrumb-root { color: var(--text-dim); font-size: 0.9rem; }
.breadcrumb-current { font-weight: 700; color: white; }
.sep { color: #334155; }

.lang-selector { display: flex; background: #111114; padding: 4px; border-radius: 12px; border: 1px solid var(--border); }
.lang-tab { padding: 8px 16px; border: none; background: transparent; color: var(--text-dim); border-radius: 8px; font-weight: 700; font-size: 0.75rem; cursor: pointer; transition: 0.2s; }
.lang-tab.active { background: white; color: black; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

/* CARDS & INPUTS */
.content-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; }
.card-head { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
.card-head h3 { font-size: 0.9rem; font-weight: 700; }

.card-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.input-box label { font-size: 0.75rem; font-weight: 700; color: var(--text-dim); margin-bottom: 8px; display: block; }
.req { color: #f87171; margin-left: 4px; }

input, select, textarea {
  background: #050506; border: 1px solid var(--border);
  border-radius: 10px; padding: 12px; color: white; font-size: 0.9rem; width: 100%;
}
input:focus, textarea:focus { border-color: var(--accent); outline: none; background: black; }

.image-preview { margin-top: 12px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); height: 120px; }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }

.btn-save-main {
  background: var(--accent); color: white; border: none; padding: 16px; border-radius: 16px;
  font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 12px;
  cursor: pointer; transition: 0.3s;
}
.btn-save-main:hover:not(:disabled) { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2); }
.btn-save-main:disabled { opacity: 0.6; cursor: not-allowed; }

/* UTILS */
.mt-24 { margin-top: 24px; }
.flex-between { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.flex-align-gap { display: flex; align-items: center; gap: 12px; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>