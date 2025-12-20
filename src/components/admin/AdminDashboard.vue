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
          <span>Mes Réalisations</span>
          <button @click="$emit('add')" class="btn-add-modern sm" title="Ajouter un projet">
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
            <span class="project-title">{{ proj.fr.title || 'Nouveau projet' }}</span>
            <span class="project-cat">{{ proj.category || 'Portfolio' }}</span>
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
        <button @click="$emit('logout')" class="logout-link"><LogOut :size="14" /> Déconnexion</button>
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
        <button @click="$emit('close')" class="btn-close-app" title="Fermer la console">
          <X :size="20" />
        </button>
      </header>

      <div class="stage-content custom-scrollbar">

        <div v-if="viewMode === 'projects' && currentIdx !== null" class="editor-grid">
          <div class="editor-main">
            <div class="content-card">
              <div class="card-head">
                <Languages :size="18" class="icon-accent" />
                <h3>Contenu du projet ({{ editLang.toUpperCase() }})</h3>
              </div>
              <div class="card-body">
                <div class="input-box">
                  <label>Titre du projet</label>
                  <input v-model="projects[currentIdx][editLang].title" placeholder="Ex: Nego Chine" />
                </div>
                <div class="input-box">
                  <label>Description détaillée</label>
                  <textarea v-model="projects[currentIdx][editLang].desc" rows="12" placeholder="Expliquez votre projet..."></textarea>
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
                <div class="input-box"><label>Lien externe</label><input v-model="projects[currentIdx].link" placeholder="https://..." /></div>
                <div class="input-box"><label>Image (URL)</label><input v-model="projects[currentIdx].image" placeholder="Lien vers l'image" /></div>
              </div>
            </div>
          </aside>
        </div>

        <div v-else-if="viewMode === 'about'" class="editor-grid">
          <div class="editor-main">

            <div class="content-card">
              <div class="card-head"><Home :size="18" class="icon-accent" /> <h3>Section Accueil (Hero)</h3></div>
              <div class="card-body hero-grid">
                <div class="input-row">
                  <div class="input-box"><label>Badge Greeting</label><input v-model="aboutData[editLang].intro_hero" placeholder="Ex: Portfolio." /></div>
                  <div class="input-box"><label>Nom / Titre</label><input v-model="aboutData[editLang].name_hero" /></div>
                </div>
                <div class="input-box">
                  <label>Texte de Bio Hero</label>
                  <textarea v-model="aboutData[editLang].bio_hero" rows="3"></textarea>
                  <span class="hint">Supporte l'HTML (ex: &lt;strong&gt;)</span>
                </div>
                <div class="input-row">
                  <div class="input-box"><label>Label Bouton Projets</label><input v-model="aboutData[editLang].btn_prj" /></div>
                  <div class="input-box"><label>Label Bouton À Propos</label><input v-model="aboutData[editLang].btn_abt" /></div>
                </div>
              </div>
            </div>

            <div class="content-card" style="margin-top: 24px;">
              <div class="card-head">
                <User :size="18" class="icon-accent" />
                <h3>Biographie détaillée ({{ editLang.toUpperCase() }})</h3>
              </div>
              <div class="card-body">
                <div class="input-box">
                  <label>Texte À propos</label>
                  <textarea v-model="aboutData[editLang].text" rows="10" placeholder="Racontez votre parcours..."></textarea>
                </div>
              </div>
            </div>

            <div class="content-card" style="margin-top: 24px;">
              <div class="card-head">
                <History :size="18" class="icon-accent" />
                <div class="flex-between">
                  <h3>Parcours d'événements</h3>
                  <button @click="$emit('add-timeline')" class="btn-add-modern">
                    <Plus :size="16" /> <span>Ajouter une étape</span>
                  </button>
                </div>
              </div>
              <div class="card-body list-container">
                <div v-for="(item, idx) in aboutData.timeline" :key="idx" class="list-item-card">
                  <div class="item-header-row">
                    <div class="input-box period"><label>Période</label><input v-model="item.period" placeholder="ex: 2022 - 2025" /></div>
                    <div class="input-box type"><label>Type</label>
                      <select v-model="item.type">
                        <option value="edu">🎓 Formation</option>
                        <option value="job">💼 Expérience</option>
                        <option value="vol">🤝 Bénévolat</option>
                      </select>
                    </div>
                    <button @click="$emit('delete-timeline', idx)" class="btn-delete-row" title="Supprimer"><Trash2 :size="16" /></button>
                  </div>
                  <div class="input-box"><label>Intitulé ({{ editLang.toUpperCase() }})</label><input v-model="item[editLang].title" /></div>
                  <div class="input-box"><label>Lieu / Description</label><input v-model="item[editLang].desc" /></div>
                </div>
              </div>
            </div>

            <div class="content-card" style="margin-top: 24px;">
              <div class="card-head">
                <Trophy :size="18" class="icon-accent" />
                <div class="flex-between">
                  <h3>Certifications & Badges</h3>
                  <button @click="$emit('add-cert')" class="btn-add-modern">
                    <Plus :size="16" /> <span>Ajouter un certificat</span>
                  </button>
                </div>
              </div>
              <div class="card-body list-container">
                <div v-for="(cert, idx) in aboutData.certifications" :key="idx" class="list-item-card">
                  <div class="item-header-row">
                    <div class="input-box" style="flex: 1;"><label>Nom du diplôme ({{ editLang.toUpperCase() }})</label><input v-model="cert[editLang].name" /></div>
                    <button @click="$emit('delete-cert', idx)" class="btn-delete-row" title="Supprimer"><Trash2 :size="16" /></button>
                  </div>
                  <div class="item-header-row">
                    <div class="input-box" style="flex: 1;"><label>Institution</label><input v-model="cert[editLang].school" /></div>
                    <div class="input-box" style="flex: 1.5;"><label>Lien de vérification</label><input v-model="cert.link" placeholder="https://..." /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside class="editor-side">
            <div class="content-card">
              <div class="card-head"><Languages :size="18" class="icon-accent" /> <h3>Introduction</h3></div>
              <div class="card-body">
                <div class="input-box">
                  <label>Slogan (Intro)</label>
                  <textarea v-model="aboutData[editLang].intro" rows="3" placeholder="Phrase d'accroche..."></textarea>
                </div>
              </div>
            </div>

            <div class="content-card" style="margin-top: 24px;">
              <div class="card-head"><Heart :size="18" class="icon-accent" /> <h3>Passions</h3></div>
              <div class="card-body">
                <div class="tags-container">
                  <span v-for="(hobby, idx) in aboutData[editLang].hobbies" :key="hobby" class="hobby-tag-pill">
                    {{ hobby }} <button @click="removeHobby(idx)" class="btn-remove-tag"><X :size="12" /></button>
                  </span>
                </div>
                <div class="add-tag-box">
                  <input v-model="newHobby" placeholder="Nouvelle passion..." @keyup.enter="addHobby" />
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
          <p>Choisissez une section à gauche pour commencer l'édition.</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard, Plus, Trash2, CloudUpload, Loader2, LogOut, X, Home,
  Languages, Settings, MousePointerClick, History, Trophy,
  User, Briefcase, Heart
} from 'lucide-vue-next'

const props = defineProps<{ projects: any[], aboutData: any, isSaving: boolean }>();
const emit = defineEmits(['add', 'delete', 'save', 'logout', 'close', 'add-timeline', 'delete-timeline', 'add-cert', 'delete-cert'])

const viewMode = ref<'projects' | 'about'>('projects')
const currentIdx = ref<number | null>(null)
const editLang = ref<'fr' | 'en' | 'es' | 'nl'>('fr')

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
  width: 98vw; height: 96vh; max-width: 1700px;
  background: #080809; border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 28px; display: flex; overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.7); color: #ececed;
  font-family: 'Inter', sans-serif;
}

/* SIDEBAR */
.sidebar { width: 300px; background: #0c0c0e; border-right: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; }
.sidebar-header { padding: 32px 24px; }
.app-brand { display: flex; align-items: center; gap: 14px; font-weight: 800; font-size: 1.1rem; }
.brand-square { width: 36px; height: 36px; background: #6366f1; border-radius: 10px; display: grid; place-items: center; color: white; }

.sidebar-nav-tabs { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.nav-tab-btn {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  background: transparent; border: none; color: #94a3b8; border-radius: 12px;
  cursor: pointer; font-weight: 600; transition: all 0.2s;
}
.nav-tab-btn:hover { background: rgba(255,255,255,0.05); color: white; }
.nav-tab-btn.active { background: rgba(99, 102, 241, 0.15); color: #818cf8; }

.sidebar-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent); margin: 0 24px 24px; }

/* BOUTON AJOUTER MODERNE */
.btn-add-modern {
  background: #6366f1; color: white; border: none;
  padding: 8px 16px; border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; gap: 8px;
  font-weight: 700; font-size: 0.8rem;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}
.btn-add-modern:hover { background: #818cf8; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4); }
.btn-add-modern.sm { padding: 4px 8px; }

/* ITEMS LISTE PROJETS */
.project-list { flex: 1; padding: 0 16px 20px; overflow-y: auto; }
.list-header { padding: 0 12px 14px; display: flex; justify-content: space-between; align-items: center; font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }

.project-item {
  padding: 12px 16px; border-radius: 14px; margin-bottom: 6px;
  cursor: pointer; position: relative; display: flex; align-items: center;
  transition: all 0.2s; border: 1px solid transparent;
}
.project-item:hover { background: rgba(255,255,255,0.03); }
.project-item.active { background: #16161a; border-color: rgba(99, 102, 241, 0.3); }
.project-indicator { width: 3px; height: 0; background: #6366f1; position: absolute; left: 0; border-radius: 0 4px 4px 0; transition: 0.3s; }
.project-item.active .project-indicator { height: 18px; }

.project-details { flex: 1; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
.project-title { font-weight: 600; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.project-cat { font-size: 0.65rem; color: #64748b; text-transform: uppercase; }

.btn-delete-item { opacity: 0; padding: 6px; border-radius: 6px; color: #f87171; background: transparent; border: none; cursor: pointer; transition: 0.2s; }
.project-item:hover .btn-delete-item { opacity: 1; }

.sidebar-footer { padding: 24px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; gap: 12px; }
.btn-save-main { background: #6366f1; color: white; border: none; padding: 14px; border-radius: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.3s; }
.logout-link { background: transparent; border: none; color: #64748b; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }

/* MAIN STAGE */
.main-stage { flex: 1; display: flex; flex-direction: column; background: #080809; }
.stage-header { padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }

.lang-selector { display: flex; background: #111114; padding: 4px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); }
.lang-tab { padding: 8px 18px; border: none; background: transparent; color: #64748b; border-radius: 9px; font-weight: 700; font-size: 0.75rem; cursor: pointer; }
.lang-tab.active { background: white; color: black; }
.btn-close-app { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.1); background: transparent; color: #64748b; display: grid; place-items: center; cursor: pointer; transition: 0.3s; }

.stage-content { padding: 40px; overflow-y: auto; flex: 1; }
.editor-grid { display: grid; grid-template-columns: 1fr 340px; gap: 32px; max-width: 1300px; margin: 0 auto; }

/* CARTES ET INPUTS */
.content-card { background: #0e0e11; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 24px; overflow: hidden; }
.card-head { padding: 20px 24px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); display: flex; align-items: center; gap: 14px; background: rgba(255,255,255,0.01); }
.card-head h3 { font-size: 0.95rem; font-weight: 700; color: #f1f5f9; }
.icon-accent { color: #818cf8; }

.card-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.input-box { display: flex; flex-direction: column; gap: 8px; }
.input-box label { font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }

.input-box input, .input-box select, .input-box textarea {
  background: #050506; border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px; padding: 12px 16px; color: white; font-size: 0.9rem; transition: 0.2s; width: 100%;
}
.input-box input:focus, .input-box textarea:focus { border-color: #6366f1; background: black; outline: none; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }
.hint { font-size: 0.75rem; color: #64748b; font-style: italic; margin-top: 4px; }

/* AMÉLIORATION LISTES (TIMELINE / CERTIFS) */
.list-item-card {
  background: #131317; padding: 24px; border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.04); display: flex;
  flex-direction: column; gap: 16px; margin-bottom: 16px;
  transition: all 0.3s ease;
}
.list-item-card:hover { border-color: rgba(99, 102, 241, 0.3); transform: translateX(4px); }

.item-header-row { display: flex; gap: 16px; align-items: flex-end; }
.period { flex: 1; }
.type { width: 180px; }

.btn-delete-row {
  height: 45px; width: 45px; border-radius: 12px;
  border: 1px solid rgba(248, 113, 113, 0.2); background: transparent;
  color: #f87171; cursor: pointer; display: grid; place-items: center;
  transition: 0.2s;
}
.btn-delete-row:hover { background: #f87171; color: white; }

/* TAGS HOBBIES */
.tags-container { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; }
.hobby-tag-pill { background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); color: #a5b4fc; padding: 6px 14px; border-radius: 50px; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.btn-remove-tag { background: transparent; border: none; color: #ef4444; cursor: pointer; padding: 0; line-height: 0; }
.add-tag-box { display: flex; gap: 8px; }
.btn-add-tag-inline { width: 42px; background: #6366f1; border: none; border-radius: 10px; color: white; cursor: pointer; display: grid; place-items: center; }

/* AUTRES */
.empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; }
.empty-glow { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%); filter: blur(40px); }
.empty-icon { width: 80px; height: 80px; background: #16161a; border-radius: 24px; display: grid; place-items: center; color: #6366f1; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.05); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>