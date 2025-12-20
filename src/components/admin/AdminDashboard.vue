<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="app-brand">
          <div class="brand-square"><LayoutDashboard :size="18" /></div>
          <div class="brand-text">
            <span class="main-title">Console Admin</span>
            <span class="sub-title">Portfolio v2</span>
          </div>
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
          <button @click="$emit('add')" class="btn-add-modern sm" title="Ajouter un projet">
            <Plus :size="14" />
          </button>
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
          <span>{{ isSaving ? 'Publication...' : 'Enregistrer les modifications' }}</span>
        </button>
        <button @click="$emit('logout')" class="logout-link"><LogOut :size="14" /> Déconnexion</button>
      </div>
    </aside>

    <main class="main-stage">
      <header class="stage-header">
        <div class="header-left">
          <div class="lang-selector">
            <button v-for="l in (['fr', 'en', 'es', 'nl'] as const)" :key="l"
                    :class="['lang-tab', { active: editLang === l }]" @click="editLang = l">
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
              <div class="card-head"><Languages :size="18" class="icon-accent" /> <h3>Contenu ({{ editLang.toUpperCase() }})</h3></div>
              <div class="card-body">
                <div class="input-box"><label>Titre du projet</label><input v-model="projects[currentIdx][editLang].title" /></div>
                <div class="input-box"><label>Description détaillée</label><textarea v-model="projects[currentIdx][editLang].desc" rows="12"></textarea></div>
              </div>
            </div>
          </div>
          <aside class="editor-side">
            <div class="content-card">
              <div class="card-head"><Settings :size="18" class="icon-accent" /> <h3>Config</h3></div>
              <div class="card-body">
                <div class="input-box"><label>Catégorie</label>
                  <select v-model="projects[currentIdx].category">
                    <option value="manage">Gestion de projet</option>
                    <option value="trans">Interculturel</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                <div class="input-box"><label>Lien externe</label><input v-model="projects[currentIdx].link" /></div>
                <div class="input-box"><label>Image (URL)</label><input v-model="projects[currentIdx].image" /></div>
                <div class="img-preview-mini" v-if="projects[currentIdx].image"><img :src="projects[currentIdx].image" /></div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else-if="viewMode === 'about'" class="editor-grid">
          <div class="editor-main">

            <div class="content-card">
              <div class="card-head"><Home :size="18" class="icon-accent" /> <h3>Section Accueil</h3></div>
              <div class="card-body">
                <div class="input-row">
                  <div class="input-box"><label>Badge Greeting</label><input v-model="aboutData[editLang].intro_hero" /></div>
                  <div class="input-box"><label>Nom / Titre</label><input v-model="aboutData[editLang].name_hero" /></div>
                </div>
                <div class="input-box"><label>Texte Hero</label><textarea v-model="aboutData[editLang].bio_hero" rows="3"></textarea></div>
                <div class="input-row">
                  <div class="input-box"><label>Bouton 1</label><input v-model="aboutData[editLang].btn_prj" /></div>
                  <div class="input-box"><label>Bouton 2</label><input v-model="aboutData[editLang].btn_abt" /></div>
                </div>
              </div>
            </div>

            <div class="content-card mt-24">
              <div class="card-head">
                <History :size="18" class="icon-accent" />
                <div class="flex-between">
                  <h3>Parcours d'événements</h3>
                  <button @click="$emit('add-timeline')" class="btn-add-modern"><Plus :size="16" /> <span>Ajouter</span></button>
                </div>
              </div>
              <div class="card-body">
                <div v-for="(item, idx) in aboutData.timeline" :key="idx" class="list-item-card">
                  <div class="item-grid-layout">
                    <div class="input-box period"><label>Période</label><input v-model="item.period" /></div>
                    <div class="input-box type"><label>Type</label>
                      <select v-model="item.type">
                        <option value="edu">🎓 Formation</option>
                        <option value="job">💼 Expérience</option>
                        <option value="vol">🤝 Bénévolat</option>
                      </select>
                    </div>
                    <div class="input-box title-field"><label>Intitulé</label><input v-model="item[editLang].title" /></div>
                    <button @click="$emit('delete-timeline', idx)" class="btn-delete-row"><Trash2 :size="16" /></button>
                  </div>
                  <div class="input-box"><label>Description / Lieu</label><input v-model="item[editLang].desc" /></div>
                </div>
              </div>
            </div>

            <div class="content-card mt-24">
              <div class="card-head">
                <Trophy :size="18" class="icon-accent" />
                <div class="flex-between">
                  <h3>Certifications</h3>
                  <button @click="$emit('add-cert')" class="btn-add-modern"><Plus :size="16" /> <span>Ajouter</span></button>
                </div>
              </div>
              <div class="card-body">
                <div v-for="(cert, idx) in aboutData.certifications" :key="idx" class="list-item-card">
                  <div class="item-grid-layout">
                    <div class="input-box" style="flex: 2;"><label>Nom du diplôme</label><input v-model="cert[editLang].name" /></div>
                    <div class="input-box" style="flex: 1;"><label>Institution</label><input v-model="cert[editLang].school" /></div>
                    <button @click="$emit('delete-cert', idx)" class="btn-delete-row"><Trash2 :size="16" /></button>
                  </div>
                  <div class="input-box"><label>Lien de vérification</label><input v-model="cert.link" /></div>
                </div>
              </div>
            </div>
          </div>

          <aside class="editor-side">
            <div class="content-card">
              <div class="card-head"><User :size="18" class="icon-accent" /> <h3>Bio complète</h3></div>
              <div class="card-body">
                <div class="input-box"><label>Slogan</label><textarea v-model="aboutData[editLang].intro" rows="2"></textarea></div>
                <div class="input-box"><label>Texte bio</label><textarea v-model="aboutData[editLang].text" rows="8"></textarea></div>
              </div>
            </div>

            <div class="content-card mt-24">
              <div class="card-head"><Heart :size="18" class="icon-accent" /> <h3>Passions</h3></div>
              <div class="card-body">
                <div class="tags-container">
                  <span v-for="(hobby, idx) in aboutData[editLang].hobbies" :key="hobby" class="hobby-tag-pill">
                    {{ hobby }} <button @click="removeHobby(idx)" class="btn-remove-tag"><X :size="12" /></button>
                  </span>
                </div>
                <div class="add-tag-box">
                  <input v-model="newHobby" placeholder="Ajouter..." @keyup.enter="addHobby" />
                  <button @click="addHobby" class="btn-add-tag-inline"><Plus :size="16" /></button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else class="empty-state">
          <div class="empty-glow"></div>
          <div class="empty-icon"><MousePointerClick :size="40" /></div>
          <h2>Console d'Administration</h2>
          <p>Prête à mettre à jour ton portfolio ? Sélectionne une section.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard, Plus, Trash2, CloudUpload, Loader2, LogOut, X, Home, Trophy,
  Languages, Settings, MousePointerClick, History, User, Briefcase, Heart
} from 'lucide-vue-next'

const props = defineProps<{ projects: any[], aboutData: any, isSaving: boolean }>();
const emit = defineEmits(['add', 'delete', 'save', 'logout', 'close', 'add-timeline', 'delete-timeline', 'add-cert', 'delete-cert'])

const viewMode = ref<'projects' | 'about'>('projects')
const currentIdx = ref<number | null>(null)
const editLang = ref<'fr' | 'en' | 'es' | 'nl'>('fr')

const confirmDelete = (idx: number) => { if(confirm("Supprimer définitivement ?")) emit('delete', idx); }

const newHobby = ref('')
const addHobby = () => {
  const h = newHobby.value.trim()
  if (h && !props.aboutData[editLang.value].hobbies.includes(h)) {
    props.aboutData[editLang.value].hobbies.push(h); newHobby.value = '';
  }
}
const removeHobby = (idx: number) => { props.aboutData[editLang.value].hobbies.splice(idx, 1) }
</script>

<style scoped>
/* =============================================
   DESIGN SYSTEM : Dashboard v2
   ============================================= */
.dashboard-layout {
  width: 98vw; height: 96vh; max-width: 1700px;
  background: #080809; border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px; display: flex; overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.8); color: #ececed;
}

/* SIDEBAR */
.sidebar { width: 320px; background: #0c0c0e; border-right: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; }
.sidebar-header { padding: 32px 24px; }
.app-brand { display: flex; align-items: center; gap: 14px; }
.brand-square { width: 42px; height: 42px; background: #6366f1; border-radius: 12px; display: grid; place-items: center; color: white; box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
.main-title { font-weight: 800; font-size: 1.1rem; letter-spacing: -0.5px; display: block; }
.sub-title { font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700; }

.nav-tab-btn {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px; margin: 0 16px 4px;
  background: transparent; border: none; color: #94a3b8; border-radius: 12px; cursor: pointer; font-weight: 600; transition: 0.2s;
}
.nav-tab-btn:hover { background: rgba(255,255,255,0.03); color: white; }
.nav-tab-btn.active { background: rgba(99, 102, 241, 0.15); color: #818cf8; }

.sidebar-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); margin: 20px 24px; }

/* BOUTONS MODERNES (Indigo Style) */
.btn-add-modern {
  background: #6366f1; color: white; border: none;
  padding: 8px 16px; border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 0.8rem; transition: 0.3s;
}
.btn-add-modern:hover { background: #818cf8; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); }
.btn-add-modern.sm { padding: 6px; border-radius: 8px; }

/* ÉDITEUR & CARTES */
.stage-content { padding: 40px; overflow-y: auto; flex: 1; background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.03), transparent); }
.editor-grid { display: grid; grid-template-columns: 1fr 360px; gap: 32px; max-width: 1400px; margin: 0 auto; }
.content-card { background: #0e0e11; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); overflow: hidden; }
.card-head { padding: 20px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.01); }

/* LISTES (Timeline/Certifs) */
.list-item-card {
  background: rgba(255,255,255,0.02); padding: 20px; border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.04); display: flex; flex-direction: column; gap: 16px; margin-bottom: 12px; transition: 0.3s;
}
.list-item-card:hover { border-color: rgba(99, 102, 241, 0.3); transform: translateX(5px); }
.item-grid-layout { display: flex; gap: 16px; align-items: flex-end; }

/* INPUTS */
.input-box { display: flex; flex-direction: column; gap: 6px; flex: 1; }
.input-box label { font-size: 0.7rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
.input-box input, .input-box select, .input-box textarea {
  background: #050506; border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px; padding: 12px 16px; color: white; font-size: 0.9rem; transition: 0.2s;
}
.input-box input:focus, .input-box textarea:focus { border-color: #6366f1; background: black; outline: none; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }

/* UTILITAIRES */
.flex-between { display: flex; justify-content: space-between; align-items: center; width: 100%; }
.mt-24 { margin-top: 24px; }
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

/* (Garder les styles sidebar projects de ton code précédent pour ne pas casser la liste) */
.project-list { flex: 1; padding: 0 16px 20px; overflow-y: auto; }
.project-item { padding: 14px 16px; border-radius: 16px; margin-bottom: 6px; cursor: pointer; position: relative; display: flex; align-items: center; transition: 0.2s; }
.project-item.active { background: #16161a; border-color: rgba(99, 102, 241, 0.3); }
.project-indicator { width: 3px; height: 0; background: #6366f1; position: absolute; left: 0; border-radius: 0 4px 4px 0; transition: 0.3s; }
.project-item.active .project-indicator { height: 20px; }
.btn-save-main { background: #6366f1; color: white; border: none; padding: 14px; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>