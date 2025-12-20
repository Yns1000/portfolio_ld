<template>
  <div class="admin-container">
    <div class="dashboard-layout">
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="app-brand">
            <div class="brand-square"><LayoutDashboard :size="20" /></div>
            <div class="brand-info">
              <span class="brand-name">Console Admin</span>
              <span class="brand-status">En ligne</span>
            </div>
          </div>
        </div>

        <div class="sidebar-nav-tabs">
          <button @click="viewMode = 'projects'" :class="['nav-tab-btn', { active: viewMode === 'projects' }]">
            <Briefcase :size="18" />
            <span>Mes Projets</span>
          </button>
          <button @click="viewMode = 'about'" :class="['nav-tab-btn', { active: viewMode === 'about' }]">
            <User :size="18" />
            <span>Profil & Bio</span>
          </button>
        </div>

        <div class="sidebar-divider"></div>

        <nav v-if="viewMode === 'projects'" class="project-list custom-scrollbar">
          <div class="list-header">
            <span>{{ projects.length }} Réalisations</span>
            <button @click="$emit('add')" class="btn-quick-add" title="Ajouter">
              <Plus :size="14" />
            </button>
          </div>

          <div v-for="(proj, index) in projects" :key="proj.id"
               class="project-item" :class="{ active: currentIdx === index }"
               @click="currentIdx = index">
            <div class="project-indicator"></div>
            <div class="project-details">
              <span class="project-title">{{ proj.fr.title || 'Nouveau projet' }}</span>
              <span class="project-cat">{{ proj.category || 'Non classé' }}</span>
            </div>
            <button @click.stop="handleDelete(index)" class="btn-delete-item">
              <Trash2 :size="14" />
            </button>
          </div>
        </nav>

        <div class="sidebar-footer">
          <button @click="$emit('save')" :disabled="isSaving" class="btn-save-main">
            <CloudUpload v-if="!isSaving" :size="18" />
            <Loader2 v-else class="spin" :size="18" />
            <span>{{ isSaving ? 'Publication...' : 'Enregistrer' }}</span>
          </button>
          <button @click="$emit('logout')" class="logout-link"><LogOut :size="14" /> Déconnexion</button>
        </div>
      </aside>

      <main class="main-stage">
        <header class="stage-header">
          <div class="header-breadcrumb">
            <span class="bc-folder">{{ viewMode === 'projects' ? 'Projets' : 'Profil' }}</span>
            <ChevronRight :size="14" class="bc-sep" />
            <span class="bc-file">{{ currentItemName }}</span>
          </div>

          <div class="header-right">
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
                  <h3>Description du projet ({{ editLang.toUpperCase() }})</h3>
                </div>
                <div class="card-body">
                  <div class="input-box">
                    <label>Titre de l'œuvre</label>
                    <input v-model.trim="projects[currentIdx][editLang].title" placeholder="Ex: Portfolio Design" />
                  </div>
                  <div class="input-box">
                    <label>Description détaillée</label>
                    <textarea v-model="projects[currentIdx][editLang].desc" rows="14" placeholder="Décrivez votre travail..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <aside class="editor-side">
              <div class="content-card">
                <div class="card-head"><Settings :size="18" class="icon-accent" /> <h3>Propriétés</h3></div>
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
                    <label>URL du projet</label>
                    <input v-model="projects[currentIdx].link" placeholder="https://..." />
                  </div>
                  <div class="input-box">
                    <label>Illustration (URL)</label>
                    <input v-model="projects[currentIdx].image" placeholder="https://image.png" />
                    <div class="mini-preview" v-if="projects[currentIdx].image">
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
                <div class="card-head"><Home :size="18" class="icon-accent" /> <h3>Section Hero</h3></div>
                <div class="card-body">
                  <div class="input-row">
                    <div class="input-box"><label>Badge</label><input v-model="aboutData[editLang].intro_hero" /></div>
                    <div class="input-box"><label>Nom Affiché</label><input v-model="aboutData[editLang].name_hero" /></div>
                  </div>
                  <div class="input-box">
                    <label>Bio d'introduction</label>
                    <textarea v-model="aboutData[editLang].bio_hero" rows="3"></textarea>
                  </div>
                </div>
              </div>

              <div class="content-card mt-24">
                <div class="card-head flex-between">
                  <div class="flex-align">
                    <History :size="18" class="icon-accent" />
                    <h3>Expériences & Formation</h3>
                  </div>
                  <button @click="$emit('add-timeline')" class="btn-add-secondary">
                    <Plus :size="14" /> Ajouter
                  </button>
                </div>
                <div class="card-body list-stack">
                  <div v-for="(item, idx) in aboutData.timeline" :key="idx" class="timeline-item-card">
                    <div class="item-top-bar">
                      <input v-model="item.period" class="input-minimal period" placeholder="Période" />
                      <select v-model="item.type" class="input-minimal type">
                        <option value="edu">Formation</option>
                        <option value="job">Expérience</option>
                      </select>
                      <button @click="$emit('delete-timeline', idx)" class="btn-action-del"><Trash2 :size="14" /></button>
                    </div>
                    <input v-model="item[editLang].title" class="input-minimal title" :placeholder="'Titre ' + editLang.toUpperCase()" />
                    <input v-model="item[editLang].desc" class="input-minimal desc" placeholder="Lieu ou courte description" />
                  </div>
                </div>
              </div>
            </div>

            <aside class="editor-side">
              <div class="content-card">
                <div class="card-head"><Heart :size="18" class="icon-accent" /> <h3>Passions</h3></div>
                <div class="card-body">
                  <div class="tags-wrapper">
                    <span v-for="(hobby, idx) in aboutData[editLang].hobbies" :key="idx" class="hobby-tag">
                      {{ hobby }}
                      <button @click="removeHobby(idx)" class="btn-tag-x"><X :size="10" /></button>
                    </span>
                  </div>
                  <div class="tag-input-group">
                    <input v-model="newHobby" placeholder="Nouvelle..." @keyup.enter="addHobby" />
                    <button @click="addHobby"><Plus :size="16" /></button>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div v-else class="empty-state">
            <div class="empty-glow"></div>
            <MousePointerClick :size="48" class="empty-icon" />
            <h2>Sélectionnez un élément</h2>
            <p>Utilisez le menu de gauche pour naviguer dans vos contenus.</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  LayoutDashboard, Plus, Trash2, CloudUpload, Loader2, LogOut, X, Home,
  Languages, Settings, MousePointerClick, History, Trophy,
  User, Briefcase, Heart, ChevronRight
} from 'lucide-vue-next'

const props = defineProps<{ projects: any[], aboutData: any, isSaving: boolean }>();
const emit = defineEmits(['add', 'delete', 'save', 'logout', 'close', 'add-timeline', 'delete-timeline'])

const viewMode = ref<'projects' | 'about'>('projects')
const currentIdx = ref<number | null>(null)
const editLang = ref<'fr' | 'en' | 'es' | 'nl'>('fr')
const newHobby = ref('')

const currentItemName = computed(() => {
  if (viewMode.value === 'about') return 'Biographie Portfolio'
  if (currentIdx.value !== null && props.projects[currentIdx.value]) {
    return props.projects[currentIdx.value].fr.title || 'Nouveau Projet'
  }
  return 'En attente...'
})

const handleDelete = (index: number) => {
  if (confirm("Supprimer définitivement ce projet ?")) {
    emit('delete', index)
    if (currentIdx.value === index) currentIdx.value = null
  }
}

const addHobby = () => {
  const h = newHobby.value.trim()
  if (h) {
    props.aboutData[editLang.value].hobbies.push(h)
    newHobby.value = ''
  }
}
const removeHobby = (idx: number) => { props.aboutData[editLang.value].hobbies.splice(idx, 1) }
</script>

<style scoped>
/* RESET & CORE */
.admin-container {
  position: fixed; inset: 0; background: rgba(0,0,0,0.8);
  display: flex; align-items: center; justify-content: center; padding: 20px;
  z-index: 9999; backdrop-filter: blur(8px);
}

.dashboard-layout {
  width: 100%; height: 100%; max-width: 1600px; max-height: 900px;
  background: #080809; border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px; display: flex; overflow: hidden;
  box-shadow: 0 50px 100px rgba(0,0,0,0.9); color: #f1f5f9;
  font-family: 'Inter', sans-serif;
}

/* SIDEBAR */
.sidebar { width: 300px; background: #0c0c0e; border-right: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; }
.sidebar-header { padding: 32px 24px; }
.app-brand { display: flex; align-items: center; gap: 12px; }
.brand-square { width: 38px; height: 38px; background: #6366f1; border-radius: 10px; display: grid; place-items: center; color: white; }
.brand-name { display: block; font-weight: 800; font-size: 1rem; }
.brand-status { display: block; font-size: 0.65rem; color: #10b981; font-weight: 600; text-transform: uppercase; }

.nav-tab-btn {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin: 0 16px 4px;
  background: transparent; border: none; color: #94a3b8; border-radius: 12px;
  cursor: pointer; font-weight: 600; transition: 0.2s;
}
.nav-tab-btn:hover { background: rgba(255,255,255,0.03); color: white; }
.nav-tab-btn.active { background: rgba(99, 102, 241, 0.12); color: #818cf8; }

.sidebar-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); margin: 20px 0; }

/* PROJECT LIST */
.project-list { flex: 1; padding: 0 16px; overflow-y: auto; }
.list-header { padding: 0 8px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: #64748b; font-weight: 700; text-transform: uppercase; }
.btn-quick-add { background: #6366f1; color: white; border: none; width: 24px; height: 24px; border-radius: 6px; cursor: pointer; display: grid; place-items: center; }

.project-item {
  padding: 12px 14px; border-radius: 12px; margin-bottom: 4px;
  cursor: pointer; position: relative; display: flex; align-items: center; gap: 12px;
  transition: 0.2s; border: 1px solid transparent;
}
.project-item:hover { background: rgba(255,255,255,0.03); }
.project-item.active { background: #16161a; border-color: rgba(99, 102, 241, 0.2); }
.project-indicator { width: 3px; height: 14px; background: #6366f1; border-radius: 10px; opacity: 0; }
.project-item.active .project-indicator { opacity: 1; }
.project-details { flex: 1; overflow: hidden; }
.project-title { display: block; font-weight: 600; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-cat { display: block; font-size: 0.65rem; color: #64748b; }
.btn-delete-item { opacity: 0; background: transparent; border: none; color: #ef4444; cursor: pointer; }
.project-item:hover .btn-delete-item { opacity: 1; }

.sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 10px; }
.btn-save-main { background: #6366f1; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.3s; }
.btn-save-main:hover { background: #4f46e5; transform: translateY(-2px); }
.logout-link { background: transparent; border: none; color: #64748b; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }

/* MAIN STAGE */
.main-stage { flex: 1; display: flex; flex-direction: column; background: #080809; }
.stage-header { height: 70px; padding: 0 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }

.header-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }
.bc-folder { color: #64748b; }
.bc-sep { color: #334155; }
.bc-file { font-weight: 700; color: #f8fafc; }

.header-right { display: flex; align-items: center; gap: 20px; }
.lang-selector { display: flex; background: #111114; padding: 3px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.05); }
.lang-tab { padding: 6px 12px; border: none; background: transparent; color: #64748b; border-radius: 7px; font-weight: 700; font-size: 0.7rem; cursor: pointer; transition: 0.2s; }
.lang-tab.active { background: #6366f1; color: white; }
.v-divider { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }
.btn-close-app { background: transparent; border: none; color: #64748b; cursor: pointer; transition: 0.2s; }
.btn-close-app:hover { color: white; transform: rotate(90deg); }

.stage-content { padding: 32px; overflow-y: auto; flex: 1; }
.editor-grid { display: grid; grid-template-columns: 1fr 320px; gap: 24px; max-width: 1200px; margin: 0 auto; }

/* CARDS */
.content-card { background: #0e0e11; border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.card-head { padding: 18px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.01); }
.card-head h3 { font-size: 0.9rem; font-weight: 700; }
.icon-accent { color: #818cf8; }

.card-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

/* INPUTS */
.input-box { display: flex; flex-direction: column; gap: 6px; }
.input-box label { font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

input, select, textarea {
  background: #050506; border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px; padding: 12px 14px; color: white; font-size: 0.9rem; transition: 0.2s; width: 100%;
}
input:focus, textarea:focus { border-color: #6366f1; background: black; outline: none; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); }

/* SPECIALS ABOUT */
.timeline-item-card { background: #131317; padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); margin-bottom: 12px; }
.item-top-bar { display: flex; gap: 10px; margin-bottom: 8px; align-items: center; }
.input-minimal { background: transparent; border: none; padding: 4px 0; border-bottom: 1px solid transparent; border-radius: 0; }
.input-minimal.period { width: 120px; color: #818cf8; font-weight: 700; }
.input-minimal.type { width: 100px; color: #64748b; font-size: 0.8rem; }
.input-minimal.title { font-weight: 700; font-size: 0.95rem; }
.input-minimal:focus { border-bottom-color: #6366f1; background: transparent; box-shadow: none; }

.hobby-tag { background: rgba(99, 102, 241, 0.1); color: #a5b4fc; padding: 6px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; margin: 0 6px 6px 0; }
.btn-tag-x { background: transparent; border: none; color: #ef4444; cursor: pointer; display: grid; place-items: center; }

.mini-preview { margin-top: 10px; border-radius: 8px; overflow: hidden; height: 100px; border: 1px solid rgba(255,255,255,0.1); }
.mini-preview img { width: 100%; height: 100%; object-fit: cover; }

/* UTILS */
.mt-24 { margin-top: 24px; }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.flex-align { display: flex; align-items: center; gap: 10px; }
.empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; opacity: 0.5; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>