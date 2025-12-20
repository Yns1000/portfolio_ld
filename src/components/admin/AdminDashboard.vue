<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="app-brand">
          <div class="brand-square"><LayoutDashboard :size="16" /></div>
          <span>Console</span>
        </div>
      </div>

      <div class="sidebar-nav-tabs">
        <button @click="viewMode = 'projects'" :class="['nav-tab-btn', { active: viewMode === 'projects' }]">
          <Briefcase :size="18" /> <span>Projets</span>
        </button>
        <button @click="viewMode = 'about'" :class="['nav-tab-btn', { active: viewMode === 'about' }]">
          <User :size="18" /> <span>À propos</span>
        </button>
      </div>

      <div class="sidebar-divider"></div>

      <nav v-if="viewMode === 'projects'" class="project-list custom-scrollbar">
        <div class="list-header">
          <span>Projets</span>
          <button @click="$emit('add')" class="btn-plus-sm"><Plus :size="14" /></button>
        </div>
        <div v-for="(proj, index) in projects" :key="proj.id" class="project-item" :class="{ active: currentIdx === index }" @click="currentIdx = index">
          <div class="project-indicator"></div>
          <div class="project-details">
            <span class="project-title">{{ proj.fr.title || 'Sans titre' }}</span>
            <span class="project-cat">{{ proj.category || 'Non classé' }}</span>
          </div>
          <button @click.stop="$emit('delete', index)" class="btn-delete-item"><Trash2 :size="14" /></button>
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
        <div class="header-left">
          <div class="lang-selector">
            <button v-for="l in (['fr', 'en', 'es', 'nl'] as const)" :key="l" :class="['lang-tab', { active: editLang === l }]" @click="editLang = l">
              {{ l.toUpperCase() }}
            </button>
          </div>
        </div>
        <button @click="$emit('close')" class="btn-close-app"><X :size="20" /></button>
      </header>

      <div class="stage-content custom-scrollbar">
        <div v-if="viewMode === 'projects' && currentIdx !== null" class="editor-grid">
          <div class="editor-main">
            <div class="content-card">
              <div class="card-head"><Languages :size="18" class="icon-accent" /> <h3>Textes ({{ editLang.toUpperCase() }})</h3></div>
              <div class="card-body">
                <div class="input-box"><label>Titre</label><input v-model="projects[currentIdx][editLang].title" /></div>
                <div class="input-box"><label>Description</label><textarea v-model="projects[currentIdx][editLang].desc" rows="10"></textarea></div>
              </div>
            </div>
          </div>
          <aside class="editor-side">
            <div class="content-card">
              <div class="card-head"><Settings :size="18" class="icon-accent" /> <h3>Config</h3></div>
              <div class="card-body">
                <div class="input-box"><label>Catégorie</label><select v-model="projects[currentIdx].category"><option value="manage">Gestion</option><option value="trans">Traduction</option><option value="marketing">Marketing</option></select></div>
                <div class="input-box"><label>Lien</label><input v-model="projects[currentIdx].link" /></div>
                <div class="input-box"><label>Image URL</label><input v-model="projects[currentIdx].image" /></div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else-if="viewMode === 'about'" class="editor-grid">
          <div class="editor-main">
            <div class="content-card">
              <div class="card-head"><User :size="18" class="icon-accent" /> <h3>Bio & Profil</h3></div>
              <div class="card-body">
                <div class="input-box"><label>Introduction courte</label><input v-model="aboutData[editLang].intro" /></div>
                <div class="input-box"><label>Bio</label><textarea v-model="aboutData[editLang].text" rows="6"></textarea></div>
              </div>
            </div>

            <div class="content-card" style="margin-top: 24px;">
              <div class="card-head"><Heart :size="18" class="icon-accent" /> <h3>Centres d'intérêt</h3></div>
              <div class="card-body">
                <div class="tags-editor">
                  <div class="tags-list">
                    <TransitionGroup name="tag">
                      <span v-for="(hobby, idx) in aboutData[editLang].hobbies" :key="hobby" class="tag-pill">
                        {{ hobby }} <button @click="removeHobby(idx)" class="btn-tag-remove"><X :size="12" /></button>
                      </span>
                    </TransitionGroup>
                  </div>
                  <div class="tag-input-group">
                    <input v-model="newHobby" placeholder="Nouvelle passion..." @keyup.enter="addHobby" />
                    <button @click="addHobby" class="btn-add-tag"><Plus :size="18" /></button>
                  </div>
                </div>
              </div>
            </div>

            <div class="content-card" style="margin-top: 24px;">
              <div class="card-head">
                <History :size="18" class="icon-accent" />
                <div class="flex-between">
                  <h3>Parcours d'événements</h3>
                  <button @click="$emit('add-timeline')" class="btn-plus-sm"><Plus :size="14" /></button>
                </div>
              </div>
              <div class="card-body timeline-manager">
                <div v-for="(item, idx) in aboutData.timeline" :key="idx" class="timeline-edit-item">
                  <div class="timeline-row">
                    <input v-model="item.period" placeholder="Période (ex: 2022-2025)" class="input-small" />
                    <select v-model="item.type" class="select-small">
                      <option value="edu">Formation</option>
                      <option value="job">Expérience</option>
                      <option value="vol">Bénévolat</option>
                    </select>
                    <button @click="$emit('delete-timeline', idx)" class="btn-icon-danger"><Trash2 :size="14" /></button>
                  </div>
                  <div class="timeline-row">
                    <input v-model="item[editLang].title" placeholder="Titre" />
                  </div>
                  <textarea v-model="item[editLang].desc" placeholder="Description" rows="2"></textarea>
                </div>
              </div>
            </div>
          </div>

          <aside class="editor-side">
            <div class="content-card">
              <div class="card-head"><GraduationCap :size="18" class="icon-accent" /> <h3>Certification</h3></div>
              <div class="card-body">
                <div class="input-box"><label>Diplôme</label><input v-model="aboutData[editLang].cert_name" /></div>
                <div class="input-box"><label>École</label><input v-model="aboutData[editLang].cert_school" /></div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon"><MousePointerClick :size="40" /></div>
          <h2>Salam aleykoum LD</h2>
          <p>Choisis une section à gauche pour modifier ton portfolio.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard, Plus, Trash2, CloudUpload, Loader2, LogOut, X,
  Languages, Settings, MousePointerClick, History,
  User, Briefcase, GraduationCap, Heart
} from 'lucide-vue-next'

const props = defineProps<{ projects: any[], aboutData: any, isSaving: boolean }>();
const emit = defineEmits(['add', 'delete', 'save', 'logout', 'close', 'add-timeline', 'delete-timeline']);

const viewMode = ref<'projects' | 'about'>('projects')
const currentIdx = ref<number | null>(null)
const editLang = ref<'fr' | 'en' | 'es' | 'nl'>('fr')

// Logique Passions
const newHobby = ref('')
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
/* CSS POUR LES TAGS ET LA TIMELINE */
.tags-editor { display: flex; flex-direction: column; gap: 12px; }
.tags-list { display: flex; flex-wrap: wrap; gap: 8px; min-height: 30px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 12px; }
.tag-pill { background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.3); color: white; padding: 6px 12px; border-radius: 50px; font-size: 0.85rem; display: flex; align-items: center; gap: 8px; }
.btn-tag-remove { background: transparent; border: none; color: #8a94a6; cursor: pointer; display: flex; }
.btn-tag-remove:hover { color: #ff4757; }
.tag-input-group { display: flex; gap: 8px; }
.btn-add-tag { background: #6366f1; border: none; border-radius: 10px; color: white; width: 44px; height: 44px; display: grid; place-items: center; cursor: pointer; }

.timeline-manager { display: flex; flex-direction: column; gap: 16px; }
.timeline-edit-item { background: rgba(0,0,0,0.2); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 8px; }
.timeline-row { display: flex; gap: 8px; }
.flex-between { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.input-small { width: 150px; }
.btn-icon-danger { background: transparent; border: none; color: #ff4757; cursor: pointer; padding: 4px; border-radius: 6px; }
.btn-icon-danger:hover { background: rgba(255, 71, 87, 0.1); }

/* (Conserver le reste de ton CSS précédent) */
.dashboard-layout { width: 96vw; height: 94vh; max-width: 1600px; background: #070708; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 32px; display: flex; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.6); }
.sidebar { width: 300px; background: #0c0c0e; border-right: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; }
.sidebar-header { padding: 32px 24px; display: flex; justify-content: space-between; align-items: center; }
.app-brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.1rem; }
.brand-square { width: 32px; height: 32px; background: #6366f1; border-radius: 8px; display: grid; place-items: center; color: white; }
.sidebar-nav-tabs { padding: 0 16px; display: flex; flex-direction: column; gap: 4px; margin-bottom: 1rem; }
.nav-tab-btn { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: transparent; border: none; color: #8a94a6; border-radius: 12px; cursor: pointer; font-weight: 600; transition: 0.2s; text-align: left; }
.nav-tab-btn:hover { background: rgba(255,255,255,0.05); color: white; }
.nav-tab-btn.active { background: #6366f1; color: white; }
.sidebar-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 0 16px 1.5rem; }
.list-header { padding: 0 16px 8px; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #8a94a6; text-transform: uppercase; }
.project-list { flex: 1; padding: 0 16px; overflow-y: auto; }
.project-item { padding: 14px 16px; border-radius: 16px; margin-bottom: 6px; cursor: pointer; position: relative; display: flex; align-items: center; border: 1px solid transparent; }
.project-item.active { background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); }
.project-indicator { width: 3px; height: 0; background: #6366f1; position: absolute; left: 0; border-radius: 0 4px 4px 0; transition: 0.3s; }
.project-item.active .project-indicator { height: 20px; }
.sidebar-footer { padding: 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 12px; }
.btn-save-main { background: #6366f1; color: white; border: none; padding: 14px; border-radius: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
.main-stage { flex: 1; display: flex; flex-direction: column; background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent); }
.stage-header { padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.lang-selector { display: flex; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); }
.lang-tab { padding: 8px 18px; border: none; background: transparent; color: #8a94a6; border-radius: 8px; font-weight: 600; font-size: 0.75rem; cursor: pointer; }
.lang-tab.active { background: white; color: #000; }
.btn-close-app { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255,255,255,0.03); color: #8a94a6; display: grid; place-items: center; cursor: pointer; }
.stage-content { padding: 40px; overflow-y: auto; }
.editor-grid { display: grid; grid-template-columns: 1fr 320px; gap: 32px; max-width: 1200px; margin: 0 auto; }
.content-card { background: #111114; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; }
.card-head { padding: 20px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 12px; }
.input-box input, .input-box select, .input-box textarea { background: rgba(0,0,0,0.3); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px 16px; color: white; width: 100%; }
</style>