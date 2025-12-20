<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="app-brand">
          <div class="brand-square"><LayoutDashboard :size="16" /></div>
          <span>Console</span>
        </div>
        <button @click="$emit('add')" class="btn-add-project" title="Nouveau projet">
          <Plus :size="20" />
        </button>
      </div>

      <nav class="project-list custom-scrollbar">
        <div
            v-for="(proj, index) in projects"
            :key="proj.id"
            class="project-item"
            :class="{ active: currentIdx === index }"
            @click="currentIdx = index"
        >
          <div class="project-indicator"></div>
          <div class="project-details">
            <span class="project-title">{{ proj.fr.title || 'Nouveau projet' }}</span>
            <span class="project-cat">{{ proj.category || 'Non classé' }}</span>
          </div>
          <button @click.stop="$emit('delete', index)" class="btn-delete-item" title="Supprimer">
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
          <div class="lang-selector" v-if="currentIdx !== null">
            <button
                v-for="l in (['fr', 'en', 'es', 'nl'] as const)" :key="l"
                :class="['lang-tab', { active: editLang === l }]"
                @click="editLang = l"
            >
              {{ l.toUpperCase() }}
            </button>
          </div>
        </div>

        <button @click="$emit('close')" class="btn-close-app" title="Fermer la console">
          <X :size="20" />
        </button>
      </header>

      <div v-if="currentIdx !== null && projects[currentIdx]" class="stage-content custom-scrollbar">
        <div class="editor-grid">
          <div class="editor-main">
            <div class="content-card">
              <div class="card-head">
                <Languages :size="18" class="icon-accent" />
                <h3>Édition des textes ({{ editLang.toUpperCase() }})</h3>
              </div>
              <div class="card-body">
                <div class="input-box">
                  <label>Titre du projet</label>
                  <input v-model="projects[currentIdx][editLang].title" placeholder="Ex: Nego Chine" />
                </div>
                <div class="input-box">
                  <label>Description détaillée</label>
                  <textarea v-model="projects[currentIdx][editLang].desc" rows="12" placeholder="Décrivez votre réalisation..."></textarea>
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
                    <option value="manage">Gestion de projet</option>
                    <option value="trans">Interculturel</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                <div class="input-box">
                  <label>Lien externe</label>
                  <input v-model="projects[currentIdx].link" placeholder="https://votre-lien.com" />
                </div>
                <div class="input-box">
                  <label>Image de couverture (URL)</label>
                  <div class="input-with-icon">
                    <ImageIcon :size="14" />
                    <input v-model="projects[currentIdx].image" placeholder="Lien d'image" />
                  </div>
                </div>
                <div class="preview-area" v-if="projects[currentIdx].image">
                  <img :src="projects[currentIdx].image" alt="Preview" />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-glow"></div>
        <div class="empty-icon">
          <MousePointerClick :size="40" />
        </div>
        <h2>Prêt pour l'édition ?</h2>
        <p>Sélectionnez un projet dans la liste de gauche ou créez-en un nouveau pour commencer.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard, Plus, Trash2, CloudUpload, Loader2, LogOut, X,
  Languages, Settings, Image as ImageIcon, MousePointerClick
} from 'lucide-vue-next'

const props = defineProps<{
  projects: any[]
  isSaving: boolean
}>()

defineEmits(['add', 'delete', 'save', 'logout', 'close'])

const currentIdx = ref<number | null>(null)
const editLang = ref<'fr' | 'en' | 'es' | 'nl'>('fr')
</script>

<style scoped>
.dashboard-layout {
  width: 96vw;
  height: 94vh;
  max-width: 1600px;
  background: #070708;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  display: flex;
  overflow: hidden;
  box-shadow: 0 50px 100px rgba(0,0,0,0.6);
}

/* SIDEBAR */
.sidebar {
  width: 300px;
  background: #0c0c0e;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
}

.sidebar-header { padding: 32px 24px; display: flex; justify-content: space-between; align-items: center; }
.app-brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.1rem; }
.brand-square { width: 32px; height: 32px; background: #6366f1; border-radius: 8px; display: grid; place-items: center; color: white; }

.btn-add-project {
  width: 40px; height: 40px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255,255,255,0.03); color: white; cursor: pointer; transition: all 0.2s;
}
.btn-add-project:hover { background: #6366f1; transform: rotate(90deg); }

.project-list { flex: 1; padding: 0 16px; overflow-y: auto; }
.project-item {
  padding: 14px 16px; border-radius: 16px; margin-bottom: 6px;
  cursor: pointer; position: relative; display: flex; align-items: center;
  transition: all 0.2s; border: 1px solid transparent;
}
.project-item:hover { background: rgba(255,255,255,0.03); }
.project-item.active { background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); }

.project-indicator { width: 3px; height: 0; background: #6366f1; position: absolute; left: 0; border-radius: 0 4px 4px 0; transition: 0.3s; }
.project-item.active .project-indicator { height: 20px; }

.project-details { flex: 1; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
.project-title { font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-cat { font-size: 0.7rem; color: #8a94a6; text-transform: uppercase; letter-spacing: 0.05em; }

.btn-delete-item { opacity: 0; padding: 6px; border-radius: 6px; color: #ff4757; background: transparent; border: none; cursor: pointer; transition: 0.2s; }
.project-item:hover .btn-delete-item { opacity: 1; }
.btn-delete-item:hover { background: rgba(255, 71, 87, 0.1); }

.sidebar-footer { padding: 24px; border-top: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; gap: 12px; }
.btn-save-main {
  background: #6366f1; color: white; border: none; padding: 14px;
  border-radius: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s;
}
.btn-save-main:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 10px 20px rgba(99, 102, 241, 0.25); }
.logout-link { background: transparent; border: none; color: #8a94a6; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
.logout-link:hover { color: #ff4757; }

/* MAIN CONTENT */
.main-stage { flex: 1; display: flex; flex-direction: column; background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent); }
.stage-header { padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }

.lang-selector { display: flex; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); }
.lang-tab { padding: 8px 18px; border: none; background: transparent; color: #8a94a6; border-radius: 8px; font-weight: 600; font-size: 0.75rem; cursor: pointer; transition: 0.2s; }
.lang-tab.active { background: white; color: #000; }

.btn-close-app { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255,255,255,0.03); color: #8a94a6; display: grid; place-items: center; cursor: pointer; transition: all 0.2s; }
.btn-close-app:hover { background: rgba(255, 71, 87, 0.1); color: #ff4757; transform: rotate(90deg); }

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
.input-box input:focus, .input-box textarea:focus { border-color: #6366f1; outline: none; background: rgba(0,0,0,0.5); }

.input-with-icon { position: relative; }
.input-with-icon svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #8a94a6; }
.input-with-icon input { padding-left: 40px; width: 100%; }

.preview-area { margin-top: 8px; border-radius: 12px; overflow: hidden; aspect-ratio: 16/9; border: 1px solid rgba(255, 255, 255, 0.08); background: #000; }
.preview-area img { width: 100%; height: 100%; object-fit: cover; }

/* EMPTY STATE */
.empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
.empty-glow { position: absolute; width: 300px; height: 300px; background: #6366f1; filter: blur(150px); opacity: 0.1; }
.empty-icon { width: 80px; height: 80px; background: rgba(99, 102, 241, 0.1); border-radius: 24px; display: grid; place-items: center; color: #6366f1; margin-bottom: 24px; }
.empty-state h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; color: #edeeef; }
.empty-state p { color: #8a94a6; max-width: 320px; text-align: center; line-height: 1.6; }

/* SCROLLBAR */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>