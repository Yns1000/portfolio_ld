<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="app-brand">
          <div class="brand-square"><LayoutDashboard :size="18" /></div>
          <span>Console Admin</span>
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
          <span>Mes Réalisations</span>
          <button @click="$emit('add')" class="btn-add-modern sm"><Plus :size="14" /></button>
        </div>
        <div v-for="(proj, index) in projects" :key="proj.id"
             class="project-item" :class="{ active: currentIdx === index }" @click="currentIdx = index">
          <div class="project-indicator"></div>
          <div class="project-details">
            <span class="project-title">{{ proj.fr.title || 'Nouveau projet' }}</span>
            <span class="project-cat">{{ proj.category || 'Portfolio' }}</span>
          </div>
          <button @click.stop="confirmDelete(index)" class="btn-delete-item"><Trash2 :size="14" /></button>
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
        <div class="lang-selector">
          <button v-for="l in (['fr', 'en', 'es', 'nl'] as const)" :key="l"
                  :class="['lang-tab', { active: editLang === l }]" @click="editLang = l">
            {{ l.toUpperCase() }}
          </button>
        </div>
        <button @click="$emit('close')" class="btn-close-app"><X :size="20" /></button>
      </header>

      <div class="stage-content custom-scrollbar">
        <ProjectEditor
            v-if="viewMode === 'projects' && currentIdx !== null"
            :project="projects[currentIdx]"
            :lang="editLang"
        />

        <AboutEditor
            v-else-if="viewMode === 'about'"
            :data="aboutData"
            :lang="editLang"
            @add-timeline="$emit('add-timeline')"
            @delete-timeline="(i) => $emit('delete-timeline', i)"
            @add-cert="$emit('add-cert')"
            @delete-cert="(i) => $emit('delete-cert', i)"
        />

        <div v-else class="empty-state">
          <div class="empty-glow"></div>
          <div class="empty-icon"><MousePointerClick :size="40" /></div>
          <h2>Console Laurine</h2>
          <p>Choisissez une section à gauche pour commencer.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LayoutDashboard, Plus, Trash2, CloudUpload, Loader2, LogOut, X, Briefcase, User, MousePointerClick } from 'lucide-vue-next'
import ProjectEditor from './ProjectEditor.vue'
import AboutEditor from './AboutEditor.vue'

const props = defineProps<{ projects: any[], aboutData: any, isSaving: boolean }>();
const emit = defineEmits(['add', 'delete', 'save', 'logout', 'close', 'add-timeline', 'delete-timeline', 'add-cert', 'delete-cert'])

const viewMode = ref<'projects' | 'about'>('projects')
const currentIdx = ref<number | null>(null)
const editLang = ref<'fr' | 'en' | 'es' | 'nl'>('fr')

const confirmDelete = (idx: number) => { if(confirm("Supprimer définitivement ?")) emit('delete', idx); }
</script>

<style>
/* IMPORTANT : Ici on garde les styles globaux du dashboard
   Enlève le "scoped" pour que ProjectEditor et AboutEditor en profitent aussi
*/
.dashboard-layout {
  width: 98vw; height: 96vh; max-width: 1700px;
  background: #080809; border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px; display: flex; overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.8); color: #ececed;
}

/* SIDEBAR */
.sidebar { width: 320px; background: #0c0c0e; border-right: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; }
.sidebar-header { padding: 32px 24px; }
.app-brand { display: flex; align-items: center; gap: 14px; font-weight: 800; font-size: 1.1rem; }
.brand-square { width: 42px; height: 42px; background: #6366f1; border-radius: 12px; display: grid; place-items: center; color: white; box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }

.nav-tab-btn {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin: 0 16px 4px;
  background: transparent; border: none; color: #94a3b8; border-radius: 12px; cursor: pointer; font-weight: 600; transition: 0.2s;
}
.nav-tab-btn.active { background: rgba(99, 102, 241, 0.15); color: #818cf8; }

.sidebar-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); margin: 20px 24px; }

/* BOUTONS MODERNES */
.btn-add-modern {
  background: #6366f1; color: white; border: none;
  padding: 8px 16px; border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.8rem; transition: 0.3s;
}
.btn-add-modern:hover { background: #818cf8; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
.btn-add-modern.sm { padding: 6px; border-radius: 8px; }

/* ÉDITEUR & CARTES */
.stage-content { padding: 40px; overflow-y: auto; flex: 1; }
.editor-grid { display: grid; grid-template-columns: 1fr 360px; gap: 32px; max-width: 1400px; margin: 0 auto; }
.content-card { background: #0e0e11; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 24px; overflow: hidden; }
.card-head { padding: 20px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.01); }

/* LISTES DYNAMIQUES */
.list-item-card {
  background: rgba(255,255,255,0.02); padding: 20px; border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.04); display: flex; flex-direction: column; gap: 16px; margin-bottom: 12px; transition: 0.3s;
}
.list-item-card:hover { border-color: rgba(99, 102, 241, 0.3); transform: translateX(5px); }
.item-header-row { display: flex; gap: 16px; align-items: flex-end; }

/* INPUTS */
.input-box { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.input-box label { font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
.input-box input, .input-box select, .input-box textarea {
  background: #050506; border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px; padding: 12px 16px; color: white; font-size: 0.9rem; width: 100%;
}
.input-box input:focus { border-color: #6366f1; outline: none; }

.flex-between { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.mt-24 { margin-top: 24px; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
</style>