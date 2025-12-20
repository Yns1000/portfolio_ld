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
                <Heart :size="18" class="icon-accent" />
                <h3>Centres d'intérêt</h3>
              </div>
              <div class="card-body">
                <p class="field-hint">Séparez les passions par une virgule</p>
                <textarea
                    :value="aboutData[editLang].hobbies.join(', ')"
                    @input="e => aboutData[editLang].hobbies = (e.target as HTMLTextAreaElement).value.split(',').map(s => s.trim()).filter(s => s !== '')"
                    rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <aside class="editor-side">
            <div class="content-card">
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
          <h2>Salam aleykoum LD</h2>
          <p>Choisis "Projets" ou "À propos" à gauche pour commencer l'édition.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard, Plus, Trash2, CloudUpload, Loader2, LogOut, X,
  Languages, Settings, MousePointerClick,
  User, Briefcase, GraduationCap, Heart
} from 'lucide-vue-next'
defineProps<{
  projects: any[]
  aboutData: any
  isSaving: boolean
}>();
defineEmits(['add', 'delete', 'save', 'logout', 'close'])

const viewMode = ref<'projects' | 'about'>('projects')
const currentIdx = ref<number | null>(null)
const editLang = ref<'fr' | 'en' | 'es' | 'nl'>('fr')
</script>

<style scoped>
/* RE-USE EXISTING STYLES + NEW ONES */

.sidebar-nav-tabs {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 1rem;
}

.nav-tab-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: transparent;
  border: none;
  color: #8a94a6;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.nav-tab-btn:hover { background: rgba(255,255,255,0.05); color: white; }
.nav-tab-btn.active { background: #6366f1; color: white; }

.sidebar-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 0 16px 1.5rem; }

.list-header {
  padding: 0 16px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #8a94a6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-plus-sm {
  background: #6366f1;
  border: none;
  border-radius: 6px;
  color: white;
  padding: 2px 6px;
  cursor: pointer;
}

.field-hint {
  font-size: 0.8rem;
  color: #8a94a6;
  margin-bottom: 8px;
}

/* --- RESTE DU CSS PRÉCÉDENT --- */
.dashboard-layout { width: 96vw; height: 94vh; max-width: 1600px; background: #070708; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 32px; display: flex; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.6); }
.sidebar { width: 300px; background: #0c0c0e; border-right: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; }
.sidebar-header { padding: 32px 24px; display: flex; justify-content: space-between; align-items: center; }
.app-brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.1rem; }
.brand-square { width: 32px; height: 32px; background: #6366f1; border-radius: 8px; display: grid; place-items: center; color: white; }
.project-list { flex: 1; padding: 0 16px; overflow-y: auto; }
.project-item { padding: 14px 16px; border-radius: 16px; margin-bottom: 6px; cursor: pointer; position: relative; display: flex; align-items: center; transition: all 0.2s; border: 1px solid transparent; }
.project-item:hover { background: rgba(255,255,255,0.03); }
.project-item.active { background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); }
.project-indicator { width: 3px; height: 0; background: #6366f1; position: absolute; left: 0; border-radius: 0 4px 4px 0; transition: 0.3s; }
.project-item.active .project-indicator { height: 20px; }
.project-details { flex: 1; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
.project-title { font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-cat { font-size: 0.7rem; color: #8a94a6; text-transform: uppercase; letter-spacing: 0.05em; }
.btn-delete-item { opacity: 0; padding: 6px; border-radius: 6px; color: #ff4757; background: transparent; border: none; cursor: pointer; transition: 0.2s; }
.project-item:hover .btn-delete-item { opacity: 1; }
.sidebar-footer { padding: 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 12px; }
.btn-save-main { background: #6366f1; color: white; border: none; padding: 14px; border-radius: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; }
.logout-link { background: transparent; border: none; color: #8a94a6; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
.main-stage { flex: 1; display: flex; flex-direction: column; background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent); }
.stage-header { padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.lang-selector { display: flex; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); }
.lang-tab { padding: 8px 18px; border: none; background: transparent; color: #8a94a6; border-radius: 8px; font-weight: 600; font-size: 0.75rem; cursor: pointer; transition: 0.2s; }
.lang-tab.active { background: white; color: #000; }
.btn-close-app { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255,255,255,0.03); color: #8a94a6; display: grid; place-items: center; cursor: pointer; transition: all 0.2s; }
.stage-content { padding: 40px; overflow-y: auto; }
.editor-grid { display: grid; grid-template-columns: 1fr 320px; gap: 32px; max-width: 1200px; margin: 0 auto; }
.content-card { background: #111114; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; }
.card-head { padding: 20px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.01); }
.card-head h3 { font-size: 0.95rem; font-weight: 700; color: #edeeef; }
.icon-accent { color: #6366f1; }
.card-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
.input-box { display: flex; flex-direction: column; gap: 8px; }
.input-box label { font-size: 0.75rem; font-weight: 600; color: #8a94a6; text-transform: uppercase; letter-spacing: 0.05em; }
.input-box input, .input-box select, .input-box textarea { background: rgba(0,0,0,0.3); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px 16px; color: white; font-size: 0.95rem; transition: 0.2s; }
.empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
.empty-glow { position: absolute; width: 300px; height: 300px; background: #6366f1; filter: blur(150px); opacity: 0.1; }
.empty-icon { width: 80px; height: 80px; background: rgba(99, 102, 241, 0.1); border-radius: 24px; display: grid; place-items: center; color: #6366f1; margin-bottom: 24px; }
.empty-state h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; color: #edeeef; }
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>