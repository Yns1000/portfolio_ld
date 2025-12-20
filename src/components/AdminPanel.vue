<template>
  <Transition name="portal-fade">
    <div class="admin-portal">

      <TransitionGroup name="toast-list" tag="div" class="toast-container">
        <div v-if="toast.show" :key="toast.message" :class="['modern-toast', toast.type]">
          <div class="toast-indicator"></div>
          <CheckCircle2 v-if="toast.type === 'success'" :size="18" />
          <AlertCircle v-else :size="18" />
          <span class="toast-msg">{{ toast.message }}</span>
          <button @click="toast.show = false" class="toast-close">
            <X :size="14" />
          </button>
        </div>
      </TransitionGroup>

      <div v-if="!isAuthenticated" class="auth-wrapper">
        <div class="auth-card" :class="{ 'shake-on-error': loginError }">
          <div class="auth-glow"></div>
          <div class="auth-content">
            <div class="auth-header">
              <div class="brand-logo">
                <div class="logo-inner">
                  <Fingerprint :size="32" />
                </div>
              </div>
              <h1>Administration</h1>
              <p>Veuillez vous identifier pour accéder à la console.</p>
            </div>

            <div class="auth-form">
              <div class="field-group" :class="{ 'has-error': !!loginError }">
                <div class="input-wrapper">
                  <Lock class="field-icon" :size="18" />
                  <input
                      v-model="password"
                      type="password"
                      placeholder="Clé de sécurité"
                      @keyup.enter="handleLogin"
                      :disabled="isLoggingIn"
                  />
                </div>
                <p v-if="loginError" class="error-text">{{ loginError }}</p>
              </div>

              <button @click="handleLogin" class="btn-primary login-btn" :disabled="isLoggingIn">
                <Loader2 v-if="isLoggingIn" class="spin" :size="20" />
                <template v-else>
                  <span>Déverrouiller l'accès</span>
                  <ChevronRight :size="18" />
                </template>
              </button>

              <button @click="$emit('close')" class="btn-ghost">Retour au site</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="dashboard-layout">
        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="app-brand">
              <div class="brand-square"><LayoutDashboard :size="16" /></div>
              <span>Console</span>
            </div>
            <button @click="addNewProject" class="btn-icon-plus" title="Ajouter un projet">
              <Plus :size="20" />
            </button>
          </div>

          <nav class="project-list custom-scrollbar">
            <div
                v-for="(proj, index) in localProjects"
                :key="proj.id"
                class="project-item"
                :class="{ active: currentIdx === index }"
                @click="currentIdx = index"
            >
              <div class="project-indicator"></div>
              <div class="project-details">
                <span class="project-title">{{ proj.fr.title || 'Sans titre' }}</span>
                <span class="project-cat">{{ proj.category || 'Portfolio' }}</span>
              </div>
              <button @click.stop="deleteProject(index)" class="btn-delete-item">
                <Trash2 :size="14" />
              </button>
            </div>
          </nav>

          <div class="sidebar-footer">
            <button @click="saveAll" :disabled="isSaving" class="btn-primary btn-save">
              <CloudUpload v-if="!isSaving" :size="18" />
              <Loader2 v-else class="spin" :size="18" />
              <span>{{ isSaving ? 'Publication...' : 'Enregistrer' }}</span>
            </button>
            <button @click="isAuthenticated = false" class="logout-btn">
              <LogOut :size="14" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        <main class="main-stage">
          <header class="stage-header">
            <div class="lang-selector" v-if="currentIdx !== null">
              <button
                  v-for="l in (['fr', 'en', 'es', 'nl'] as const)" :key="l"
                  :class="['lang-tab', { active: editLang === l }]"
                  @click="editLang = l"
              >
                {{ l.toUpperCase() }}
              </button>
            </div>
            <button @click="$emit('close')" class="btn-close-portal">
              <X :size="20" />
            </button>
          </header>

          <div v-if="currentIdx !== null && localProjects[currentIdx]" class="stage-content custom-scrollbar">
            <div class="editor-container">
              <div class="editor-main">
                <div class="content-card">
                  <div class="card-head">
                    <Languages :size="18" />
                    <h3>Contenu Localisé ({{ editLang.toUpperCase() }})</h3>
                  </div>
                  <div class="card-body">
                    <div class="input-box">
                      <label>Titre du projet</label>
                      <input v-model="localProjects[currentIdx][editLang].title" placeholder="Ex: Nego Chine" />
                    </div>
                    <div class="input-box">
                      <label>Description détaillée</label>
                      <textarea v-model="localProjects[currentIdx][editLang].desc" rows="10" placeholder="Racontez l'histoire du projet..."></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <aside class="editor-side">
                <div class="content-card">
                  <div class="card-head">
                    <Settings :size="18" />
                    <h3>Paramètres</h3>
                  </div>
                  <div class="card-body">
                    <div class="input-box">
                      <label>Catégorie</label>
                      <select v-model="localProjects[currentIdx].category">
                        <option value="manage">Gestion de projet</option>
                        <option value="trans">Interculturel</option>
                        <option value="marketing">Marketing</option>
                      </select>
                    </div>
                    <div class="input-box">
                      <label>Lien externe</label>
                      <input v-model="localProjects[currentIdx].link" placeholder="https://..." />
                    </div>
                    <div class="input-box">
                      <label>Image de couverture</label>
                      <div class="input-with-icon">
                        <ImageIcon :size="14" />
                        <input v-model="localProjects[currentIdx].image" placeholder="URL de l'image" />
                      </div>
                    </div>
                    <div class="preview-area" v-if="localProjects[currentIdx].image">
                      <img :src="localProjects[currentIdx].image" alt="Preview" />
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
            <p>Sélectionnez un projet existant ou créez-en un nouveau pour commencer.</p>
          </div>
        </main>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import i18n from '../i18n'
import {
  Lock, Loader2, Plus, Trash2, LogOut, X, CloudUpload,
  Languages, Settings, Image as ImageIcon, LayoutDashboard,
  CheckCircle2, AlertCircle, Fingerprint, ChevronRight,
  MousePointerClick
} from 'lucide-vue-next'

// TYPES DEFINITIONS
interface ProjectLangContent {
  title: string;
  desc: string;
}

interface Project {
  id: number;
  category: string;
  image: string;
  link: string;
  fr: ProjectLangContent;
  en: ProjectLangContent;
  es: ProjectLangContent;
  nl: ProjectLangContent;
}

type LangCode = 'fr' | 'en' | 'es' | 'nl';

// EMITS
const emit = defineEmits(['close'])

// STATE
const isAuthenticated = ref(false)
const password = ref('')
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const editLang = ref<LangCode>('fr')
const currentIdx = ref<number | null>(null)

const toast = reactive({
  show: false,
  message: '',
  type: 'success' as 'success' | 'error'
})

const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 4000)
}

// INITIAL LOAD
const loadProjects = (): Project[] => {
  const getLangList = (lang: string) => (i18n.global.getLocaleMessage(lang) as any).projects_list || []

  const fr = getLangList('fr')
  const en = getLangList('en')
  const es = getLangList('es')
  const nl = getLangList('nl')

  return fr.map((p: any, i: number) => ({
    id: p.id || Date.now() + i,
    category: p.category || 'manage',
    image: p.image || '',
    link: p.link || '',
    fr: { title: p.title || '', desc: p.desc || '' },
    en: { title: en[i]?.title || '', desc: en[i]?.desc || '' },
    es: { title: es[i]?.title || '', desc: es[i]?.desc || '' },
    nl: { title: nl[i]?.title || '', desc: nl[i]?.desc || '' }
  }))
}

const localProjects = ref<Project[]>(loadProjects())

// ACTIONS
const handleLogin = async () => {
  if (!password.value) return
  isLoggingIn.value = true
  loginError.value = ''

  try {
    const res = await fetch('/api/manage-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value, action: 'login' })
    })

    if (res.ok) {
      isAuthenticated.value = true
      triggerToast('Accès autorisé')
    } else {
      loginError.value = "Code de sécurité invalide"
      password.value = ""
    }
  } catch (e) {
    loginError.value = "Erreur de connexion au serveur"
  } finally {
    isLoggingIn.value = false
  }
}

const addNewProject = () => {
  const newProj: Project = {
    id: Date.now(),
    category: 'manage',
    image: '',
    link: '',
    fr: { title: '', desc: '' },
    en: { title: '', desc: '' },
    es: { title: '', desc: '' },
    nl: { title: '', desc: '' }
  }
  localProjects.value.push(newProj)
  currentIdx.value = localProjects.value.length - 1
  triggerToast('Nouveau projet créé')
}

const deleteProject = (idx: number) => {
  if (confirm('Supprimer définitivement ce projet ?')) {
    localProjects.value.splice(idx, 1)
    if (currentIdx.value === idx) currentIdx.value = null
    triggerToast('Projet supprimé', 'error')
  }
}

const saveAll = async () => {
  if (isSaving.value) return
  isSaving.value = true

  try {
    const payloads: Record<string, any> = {}
    const langs: LangCode[] = ['fr', 'en', 'es', 'nl']

    langs.forEach(l => {
      const fullContent = JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(l)))
      fullContent.projects_list = localProjects.value.map(p => ({
        id: p.id,
        category: p.category,
        image: p.image,
        link: p.link,
        title: p[l].title,
        desc: p[l].desc
      }))
      payloads[l] = fullContent
    })

    const res = await fetch('/api/manage-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value, content: payloads })
    })

    if (res.ok) {
      triggerToast('Modifications publiées avec succès !')
      setTimeout(() => window.location.reload(), 1000)
    } else {
      triggerToast('Erreur lors de la publication', 'error')
    }
  } catch (e) {
    triggerToast('Erreur réseau', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
/* VARIABLE SYSTEM
*/
.admin-portal {
  --bg-dark: #070708;
  --card-bg: #111114;
  --sidebar-bg: #0c0c0e;
  --border-color: rgba(255, 255, 255, 0.08);
  --accent-color: #6366f1;
  --accent-glow: rgba(99, 102, 241, 0.2);
  --text-main: #edeeef;
  --text-muted: #949ead;
  --radius-lg: 24px;
  --radius-md: 12px;

  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(4, 4, 5, 0.9);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-main);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* ANIMATIONS
*/
.portal-fade-enter-active, .portal-fade-leave-active { transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
.portal-fade-enter-from, .portal-fade-leave-to { opacity: 0; transform: scale(1.05); }

/* AUTHENTICATION UI
*/
.auth-wrapper { width: 100%; max-width: 440px; padding: 20px; }

.auth-card {
  position: relative;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 48px 40px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
}

.auth-glow {
  position: absolute;
  top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle at center, var(--accent-glow) 0%, transparent 50%);
  pointer-events: none;
}

.brand-logo {
  width: 64px; height: 64px; margin: 0 auto 24px;
  background: linear-gradient(135deg, #1f1f23, #111114);
  border-radius: 18px;
  padding: 2px;
  border: 1px solid var(--border-color);
}

.logo-inner {
  width: 100%; height: 100%;
  background: var(--card-bg);
  border-radius: 16px;
  display: grid; place-items: center;
  color: var(--accent-color);
}

.auth-header { text-align: center; margin-bottom: 32px; }
.auth-header h1 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
.auth-header p { color: var(--text-muted); font-size: 0.95rem; }

.input-wrapper {
  position: relative;
  background: rgba(0,0,0,0.2);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  transition: all 0.3s;
}

.input-wrapper:focus-within {
  border-color: var(--accent-color);
  box-shadow: 0 0 0 4px var(--accent-glow);
}

.field-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }

.input-wrapper input {
  width: 100%; padding: 16px 16px 16px 48px;
  background: transparent; border: none; color: white; outline: none;
}

.btn-primary {
  width: 100%;
  background: var(--accent-color);
  color: white; border: none;
  padding: 16px; border-radius: var(--radius-md);
  font-weight: 600; display: flex; align-items: center; justify-content: center;
  gap: 10px; cursor: pointer; transition: all 0.3s;
}

.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px var(--accent-glow); }

/* DASHBOARD LAYOUT
*/
.dashboard-layout {
  width: 96vw; height: 92vh; max-width: 1600px;
  background: var(--bg-dark);
  border: 1px solid var(--border-color);
  border-radius: 32px;
  display: flex; overflow: hidden;
  box-shadow: 0 50px 100px rgba(0,0,0,0.6);
}

/* SIDEBAR */
.sidebar {
  width: 320px; background: var(--sidebar-bg);
  border-right: 1px solid var(--border-color);
  display: flex; flex-direction: column;
}

.sidebar-header {
  padding: 32px 24px; display: flex; justify-content: space-between; align-items: center;
}

.app-brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.1rem; }
.brand-square {
  width: 32px; height: 32px; background: var(--accent-color);
  border-radius: 8px; display: grid; place-items: center; color: white;
}

.btn-icon-plus {
  width: 40px; height: 40px; border-radius: 12px;
  background: rgba(255,255,255,0.03); border: 1px solid var(--border-color);
  color: white; cursor: pointer; transition: all 0.2s;
}

.btn-icon-plus:hover { background: var(--accent-color); border-color: var(--accent-color); }

.project-list { flex: 1; padding: 0 16px; overflow-y: auto; }

.project-item {
  padding: 16px; border-radius: 16px; margin-bottom: 8px;
  cursor: pointer; position: relative; display: flex; align-items: center;
  transition: all 0.2s; border: 1px solid transparent;
}

.project-item:hover { background: rgba(255,255,255,0.03); }

.project-item.active {
  background: rgba(99, 102, 241, 0.08);
  border-color: rgba(99, 102, 241, 0.2);
}

.project-indicator {
  width: 4px; height: 0; background: var(--accent-color);
  position: absolute; left: 0; border-radius: 0 4px 4px 0;
  transition: height 0.3s;
}
.project-item.active .project-indicator { height: 24px; }

.project-details { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.project-title { font-weight: 600; font-size: 0.95rem; }
.project-cat { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

.btn-delete-item {
  opacity: 0; padding: 8px; border-radius: 8px; color: #ff4757;
  background: transparent; border: none; cursor: pointer; transition: 0.2s;
}
.project-item:hover .btn-delete-item { opacity: 1; }
.btn-delete-item:hover { background: rgba(255, 71, 87, 0.1); }

.sidebar-footer { padding: 24px; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 12px; }

.logout-btn {
  background: transparent; border: none; color: var(--text-muted);
  font-size: 0.85rem; display: flex; align-items: center; justify-content: center;
  gap: 8px; cursor: pointer; padding: 8px;
}
.logout-btn:hover { color: #ff4757; }

/* MAIN STAGE */
.main-stage { flex: 1; display: flex; flex-direction: column; position: relative; }

.stage-header {
  padding: 24px 40px; border-bottom: 1px solid var(--border-color);
  display: flex; justify-content: space-between; align-items: center;
}

.lang-selector {
  display: flex; background: rgba(255,255,255,0.03);
  padding: 4px; border-radius: 12px; border: 1px solid var(--border-color);
}

.lang-tab {
  padding: 8px 20px; border: none; background: transparent;
  color: var(--text-muted); border-radius: 8px; font-weight: 600;
  font-size: 0.8rem; cursor: pointer; transition: all 0.2s;
}

.lang-tab.active { background: white; color: black; }

.stage-content { flex: 1; padding: 40px; overflow-y: auto; }

.editor-container {
  display: grid; grid-template-columns: 1fr 340px; gap: 32px;
  max-width: 1100px; margin: 0 auto;
}

.content-card {
  background: var(--card-bg); border: 1px solid var(--border-color);
  border-radius: 20px; overflow: hidden;
}

.card-head {
  padding: 20px 24px; border-bottom: 1px solid var(--border-color);
  display: flex; align-items: center; gap: 12px;
}
.card-head h3 { font-size: 1rem; font-weight: 600; }

.card-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

.input-box { display: flex; flex-direction: column; gap: 8px; }
.input-box label { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }

.input-box input, .input-box select, .input-box textarea {
  background: rgba(0,0,0,0.2); border: 1px solid var(--border-color);
  border-radius: 12px; padding: 12px 16px; color: white; outline: none;
  transition: all 0.2s;
}

.input-box input:focus, .input-box textarea:focus { border-color: var(--accent-color); }

.input-with-icon { position: relative; }
.input-with-icon svg { position: absolute; left: 12px; top: 14px; color: var(--text-muted); }
.input-with-icon input { padding-left: 36px; width: 100%; }

.preview-area {
  margin-top: 10px; border-radius: 12px; overflow: hidden;
  aspect-ratio: 16/10; border: 1px solid var(--border-color);
}
.preview-area img { width: 100%; height: 100%; object-fit: cover; }

/* EMPTY STATE */
.empty-state {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center; padding: 40px;
}

.empty-icon {
  width: 80px; height: 80px; background: var(--accent-glow);
  border-radius: 24px; display: grid; place-items: center;
  color: var(--accent-color); margin-bottom: 24px;
}

.empty-state h2 { font-size: 1.5rem; margin-bottom: 12px; }
.empty-state p { max-width: 400px; color: var(--text-muted); line-height: 1.6; }

/* TOASTS */
.toast-container {
  position: fixed; top: 32px; left: 50%; transform: translateX(-50%);
  z-index: 100000; display: flex; flex-direction: column; gap: 10px;
}

.modern-toast {
  background: var(--card-bg); border: 1px solid var(--border-color);
  padding: 12px 20px; border-radius: 16px; display: flex; align-items: center;
  gap: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  min-width: 300px; position: relative; overflow: hidden;
}

.toast-indicator {
  position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--accent-color);
}

.toast.error .toast-indicator { background: #ff4757; }

/* SCROLLBAR */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
</style>