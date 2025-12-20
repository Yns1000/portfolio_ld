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
        <button
            @click="viewMode = 'projects'"
            :class="['nav-tab-btn', { active: viewMode === 'projects' }]"
        >
          <Briefcase :size="18" />
          <span>Projets</span>
        </button>
        <button
            @click="viewMode = 'about'"
            :class="['nav-tab-btn', { active: viewMode === 'about' }]"
        >
          <User :size="18" />
          <span>À propos</span>
        </button>
      </div>

      <div class="sidebar-divider"></div>

      <nav v-if="viewMode === 'projects'" class="project-list custom-scrollbar">
        <div class="list-header">
          <span>Projets</span>
          <button @click="$emit('add')" class="btn-plus-sm" title="Ajouter">
            <Plus :size="14" />
          </button>
        </div>
        <div
            v-for="(proj, index) in projects"
            :key="proj.id"
            class="project-item"
            :class="{ active: currentIdx === index }"
            @click="currentIdx = index"
        >
          <div class="project-indicator"></div>
          <div class="project-details">
            <span class="project-title">{{ proj.fr.title || 'Sans titre' }}</span>
            <span class="project-cat">{{ proj.category || 'Non classé' }}</span>
          </div>
          <button @click.stop="$emit('delete', index)" class="btn-delete-item">
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
        <button @click="$emit('logout')" class="logout-link">
          <LogOut :size="14" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>

    <main class="main-stage">
      <header class="stage-header">
        <div class="header-left">
          <div class="lang-selector">
            <button
                v-for="l in (['fr', 'en', 'es', 'nl'] as const)" :key="l"
                :class="['lang-tab', { active: editLang === l }]"
                @click="editLang = l"
            >
              {{ l.toUpperCase() }}
            </button>
          </div>
        </div>
        <button @click="$emit('close')" class="btn-close-app">
          <X :size="20" />
        </button>
      </header>

      <div class="stage-content custom-scrollbar">

        <div v-if="viewMode === 'projects' && currentIdx !== null" class="editor-grid">
          <div class="editor-main">
            <div class="content-card">
              <div class="card-head">
                <Languages :size="18" class="icon-accent" />
                <h3>Textes ({{ editLang.toUpperCase() }})</h3>
              </div>
              <div class="card-body">
                <div class="input-box">
                  <label>Titre du projet</label>
                  <input v-model="projects[currentIdx][editLang].title" />
                </div>
                <div class="input-box">
                  <label>Description</label>
                  <textarea v-model="projects[currentIdx][editLang].desc" rows="12"></textarea>
                </div>
              </div>
            </div>
          </div>

          <aside class="editor-side">
            <div class="content-card">
              <div class="card-head">
                <Settings :size="18" class="icon-accent" />
                <h3>Configuration</h3>
              </div>
              <div class="card-body">
                <div class="input-box">
                  <label>Catégorie</label>
                  <select v-model="projects[currentIdx].category">
                    <option value="manage">Gestion</option>
                    <option value="trans">Traduction</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                <div class="input-box">
                  <label>Lien externe</label>
                  <input v-model="projects[currentIdx].link" />
                </div>
                <div class="input-box">
                  <label>Image URL</label>
                  <input v-model="projects[currentIdx].image" />
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else-if="viewMode === 'about'" class="editor-grid">
          <div class="editor-main">
            <div class="content-card">
              <div class="card-head">
                <User :size="18" class="icon-accent" />
                <h3>Bio & Profil ({{ editLang.toUpperCase() }})</h3>
              </div>
              <div class="card-body">
                <div class="input-box">
                  <label>Introduction courte</label>
                  <input v-model="aboutData[editLang].intro" placeholder="Passionnée par..." />
                </div>
                <div class="input-box">
                  <label>Texte de présentation (Bio)</label>
                  <textarea v-model="aboutData[editLang].text" rows="8"></textarea>
                </div>
              </div>
            </div>

            <div class="content-card" style="margin-top: 24px;">
              <div class="card-head">
                <History :size="18" class="icon-accent" />
                <div class="flex-between">
                  <h3>Parcours d'événements</h3>
                  <button @click="$emit('add-timeline')" class="btn-plus-sm"><Plus :size="14" /> Ajouter</button>
                </div>
              </div>
              <div class="card-body timeline-manager">
                <div v-for="(item, idx) in aboutData.timeline" :key="idx" class="timeline-edit-item">
                  <div class="timeline-meta-row">
                    <div class="input-box period">
                      <label>Période</label>
                      <input v-model="item.period" placeholder="ex: 2022 - 2025" />
                    </div>
                    <div class="input-box type">
                      <label>Type</label>
                      <select v-model="item.type">
                        <option value="edu">🎓 Formation</option>
                        <option value="job">💼 Expérience</option>
                        <option value="vol">🤝 Bénévolat</option>
                      </select>
                    </div>
                    <button @click="$emit('delete-timeline', idx)" class="btn-delete-timeline" title="Supprimer">
                      <Trash2 :size="16" />
                    </button>
                  </div>
                  <div class="input-box">
                    <label>Titre ({{ editLang.toUpperCase() }})</label>
                    <input v-model="item[editLang].title" placeholder="Titre de l'événement" />
                  </div>
                  <div class="input-box">
                    <label>Description ({{ editLang.toUpperCase() }})</label>
                    <textarea v-model="item[editLang].desc" placeholder="Détails..." rows="2"></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside class="editor-side">
            <div class="content-card">
              <div class="card-head">
                <Heart :size="18" class="icon-accent" />
                <h3>Centres d'intérêt</h3>
              </div>
              <div class="card-body">
                <div class="tags-container">
                  <span v-for="(hobby, idx) in aboutData[editLang].hobbies" :key="hobby" class="hobby-pill">
                    {{ hobby }}
                    <button @click="removeHobby(idx)" class="btn-remove-tag"><X :size="12" /></button>
                  </span>
                </div>
                <div class="add-tag-box">
                  <input v-model="newHobby" placeholder="Ajouter..." @keyup.enter="addHobby" />
                  <button @click="addHobby"><Plus :size="16" /></button>
                </div>
              </div>
            </div>

            <div class="content-card" style="margin-top: 24px;">
              <div class="card-head">
                <GraduationCap :size="18" class="icon-accent" />
                <h3>Certification</h3>
              </div>
              <div class="card-body">
                <div class="input-box">
                  <label>Nom du diplôme</label>
                  <input v-model="aboutData[editLang].cert_name" />
                </div>
                <div class="input-box">
                  <label>École / Université</label>
                  <input v-model="aboutData[editLang].cert_school" />
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="empty-state">
          <div class="empty-glow"></div>
          <div class="empty-icon">
            <MousePointerClick :size="40" />
          </div>
          <h2>Console Admin</h2>
          <p>Choisis une section à gauche pour commencer l'édition.</p>
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

const props = defineProps<{
  projects: any[]
  aboutData: any
  isSaving: boolean
}>();

const emit = defineEmits(['add', 'delete', 'save', 'logout', 'close', 'add-timeline', 'delete-timeline'])

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
/* STRUCTURE GÉNÉRALE */
.dashboard-layout {
  width: 96vw; height: 94vh; max-width: 1600px;
  background: #070708; border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px; display: flex; overflow: hidden;
  box-shadow: 0 50px 100px rgba(0,0,0,0.6);
  color: #edeeef;
}

/* SIDEBAR */
.sidebar { width: 280px; background: #0c0c0e; border-right: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; }
.sidebar-header { padding: 32px 24px; display: flex; justify-content: space-between; align-items: center; }
.app-brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.1rem; }
.brand-square { width: 32px; height: 32px; background: #6366f1; border-radius: 8px; display: grid; place-items: center; color: white; }

.sidebar-nav-tabs { padding: 0 16px; display: flex; flex-direction: column; gap: 6px; margin-bottom: 20px; }
.nav-tab-btn {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  background: transparent; border: none; color: #8a94a6; border-radius: 12px;
  cursor: pointer; font-weight: 600; transition: 0.2s;
}
.nav-tab-btn:hover { background: rgba(255,255,255,0.05); color: white; }
.nav-tab-btn.active { background: #6366f1; color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); }

.sidebar-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 0 16px 20px; }

/* PROJECT LIST */
.project-list { flex: 1; padding: 0 16px; overflow-y: auto; }
.list-header { padding: 0 12px 12px; display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #8a94a6; text-transform: uppercase; letter-spacing: 0.05em; }
.btn-plus-sm { background: #6366f1; border: none; border-radius: 6px; color: white; padding: 4px 10px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: 600; }

.project-item {
  padding: 12px; border-radius: 12px; margin-bottom: 4px;
  cursor: pointer; position: relative; display: flex; align-items: center;
  transition: all 0.2s; border: 1px solid transparent;
}
.project-item:hover { background: rgba(255,255,255,0.03); }
.project-item.active { background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); }
.project-indicator { width: 3px; height: 0; background: #6366f1; position: absolute; left: 0; border-radius: 0 4px 4px 0; transition: 0.3s; }
.project-item.active .project-indicator { height: 16px; }

.project-details { flex: 1; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
.project-title { font-weight: 600; font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-cat { font-size: 0.7rem; color: #8a94a6; text-transform: uppercase; }

.btn-delete-item { opacity: 0; padding: 6px; border-radius: 6px; color: #ff4757; background: transparent; border: none; cursor: pointer; }
.project-item:hover .btn-delete-item { opacity: 1; }
.btn-delete-item:hover { background: rgba(255, 71, 87, 0.1); }

.sidebar-footer { padding: 20px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 10px; }
.btn-save-main { background: #6366f1; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; }
.logout-link { background: transparent; border: none; color: #8a94a6; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 10px; }

/* MAIN STAGE */
.main-stage { flex: 1; display: flex; flex-direction: column; background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.03), transparent); }
.stage-header { padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }

.lang-selector { display: flex; background: #16161a; padding: 4px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.08); }
.lang-tab { padding: 6px 16px; border: none; background: transparent; color: #8a94a6; border-radius: 7px; font-weight: 600; font-size: 0.75rem; cursor: pointer; }
.lang-tab.active { background: white; color: black; }
.btn-close-app { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.1); background: transparent; color: #8a94a6; display: grid; place-items: center; cursor: pointer; transition: 0.2s; }
.btn-close-app:hover { background: rgba(255, 71, 87, 0.1); color: #ff4757; transform: rotate(90deg); }

.stage-content { padding: 40px; overflow-y: auto; }
.editor-grid { display: grid; grid-template-columns: 1fr 300px; gap: 32px; max-width: 1200px; margin: 0 auto; }

/* CONTENT CARDS */
.content-card { background: #111114; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
.card-head { padding: 16px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.01); }
.card-head h3 { font-size: 0.9rem; font-weight: 700; }
.icon-accent { color: #6366f1; }
.card-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }
.flex-between { display: flex; justify-content: space-between; align-items: center; width: 100%; }

/* FORM ELEMENTS */
.input-box { display: flex; flex-direction: column; gap: 6px; }
.input-box label { font-size: 0.7rem; font-weight: 600; color: #8a94a6; text-transform: uppercase; letter-spacing: 0.05em; }
.input-box input, .input-box select, .input-box textarea {
  background: rgba(0,0,0,0.3); border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px; padding: 10px 14px; color: white; font-size: 0.9rem; transition: 0.2s; width: 100%;
}
.input-box input:focus, .input-box textarea:focus { border-color: #6366f1; outline: none; background: rgba(0,0,0,0.5); }

/* TIMELINE MANAGER */
.timeline-manager { gap: 12px; }
.timeline-edit-item { background: rgba(255,255,255,0.02); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 16px; }
.timeline-meta-row { display: flex; gap: 12px; align-items: flex-end; }
.timeline-meta-row .period { flex: 1; }
.timeline-meta-row .type { width: 140px; }
.btn-delete-timeline { height: 40px; width: 40px; border-radius: 10px; border: 1px solid rgba(255, 71, 87, 0.2); background: transparent; color: #ff4757; cursor: pointer; display: grid; place-items: center; }
.btn-delete-timeline:hover { background: #ff4757; color: white; }

/* HOBBIES TAGS */
.tags-container { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.hobby-pill { background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3); color: white; padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; display: flex; align-items: center; gap: 6px; }
.btn-remove-tag { background: transparent; border: none; color: white; cursor: pointer; padding: 0; display: flex; opacity: 0.7; }
.btn-remove-tag:hover { opacity: 1; }
.add-tag-box { display: flex; gap: 6px; }
.add-tag-box input { flex: 1; padding: 6px 10px !important; font-size: 0.8rem !important; }
.add-tag-box button { width: 32px; background: #6366f1; border: none; border-radius: 8px; color: white; cursor: pointer; }

/* EMPTY STATE */
.empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
.empty-glow { position: absolute; width: 300px; height: 300px; background: #6366f1; filter: blur(150px); opacity: 0.1; }
.empty-icon { width: 80px; height: 80px; background: rgba(99, 102, 241, 0.1); border-radius: 24px; display: grid; place-items: center; color: #6366f1; margin-bottom: 24px; }
.empty-state h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>