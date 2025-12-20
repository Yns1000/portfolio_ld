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
              <h1>Console Admin</h1>
              <p>Identifiez-vous pour gérer vos projets.</p>
            </div>

            <div class="auth-form">
              <div class="field-group" :class="{ 'has-error': !!loginError }">
                <div class="input-wrapper">
                  <Lock class="field-icon" :size="18" />
                  <input
                      v-model="password"
                      type="password"
                      placeholder="Clé d'accès"
                      @keyup.enter="handleLogin"
                      :disabled="isLoggingIn"
                  />
                </div>
                <p v-if="loginError" class="error-text">{{ loginError }}</p>
              </div>

              <button @click="handleLogin" class="btn-primary login-btn" :disabled="isLoggingIn">
                <Loader2 v-if="isLoggingIn" class="spin" :size="20" />
                <template v-else>
                  <span>Entrer dans la console</span>
                  <ChevronRight :size="18" />
                </template>
              </button>

              <button @click="$emit('close')" class="btn-ghost-text">Quitter</button>
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
            <button @click="addNewProject" class="btn-add-project" title="Nouveau projet">
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
                <span class="project-title">{{ proj.fr.title || 'Nouveau projet' }}</span>
                <span class="project-cat">{{ proj.category || 'Non classé' }}</span>
              </div>
              <button @click.stop="deleteProject(index)" class="btn-delete-item">
                <Trash2 :size="14" />
              </button>
            </div>
          </nav>

          <div class="sidebar-footer">
            <button @click="saveAll" :disabled="isSaving" class="btn-save-main">
              <CloudUpload v-if="!isSaving" :size="18" />
              <Loader2 v-else class="spin" :size="18" />
              <span>{{ isSaving ? 'Publication...' : 'Enregistrer' }}</span>
            </button>
            <button @click="isAuthenticated = false" class="logout-link">
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

          <div v-if="currentIdx !== null && localProjects[currentIdx]" class="stage-content custom-scrollbar">
            <div class="editor-grid">
              <div class="editor-main">
                <div class="content-card">
                  <div class="card-head">
                    <Languages :size="18" class="icon-accent" />
                    <h3>Édition des textes</h3>
                  </div>
                  <div class="card-body">
                    <div class="input-box">
                      <label>Titre du projet</label>
                      <input v-model="localProjects[currentIdx][editLang].title" placeholder="Ex: Nego Chine" />
                    </div>
                    <div class="input-box">
                      <label>Description détaillée</label>
                      <textarea v-model="localProjects[currentIdx][editLang].desc" rows="12" placeholder="Décrivez votre réalisation..."></textarea>
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
                      <select v-model="localProjects[currentIdx].category">
                        <option value="manage">Gestion de projet</option>
                        <option value="trans">Interculturel</option>
                        <option value="marketing">Marketing</option>
                      </select>
                    </div>
                    <div class="input-box">
                      <label>Lien externe</label>
                      <input v-model="localProjects[currentIdx].link" placeholder="https://votre-lien.com" />
                    </div>
                    <div class="input-box">
                      <label>Image de couverture (URL)</label>
                      <div class="input-with-icon">
                        <ImageIcon :size="14" />
                        <input v-model="localProjects[currentIdx].image" placeholder="Lien Unsplash ou CDN" />
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
            <p>Sélectionnez un projet dans la liste de gauche pour commencer à le modifier.</p>
          </div>
        </main>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
/* ... (Garder la logique script précédente, elle est parfaite) ... */
import { ref, reactive } from 'vue'
import i18n from '../i18n'
import {
  Lock, Loader2, Plus, Trash2, LogOut, X, CloudUpload,
  Languages, Settings, Image as ImageIcon, LayoutDashboard,
  CheckCircle2, AlertCircle, Fingerprint, ChevronRight,
  MousePointerClick
} from 'lucide-vue-next'

interface ProjectLangContent { title: string; desc: string; }
interface Project { id: number; category: string; image: string; link: string; fr: ProjectLangContent; en: ProjectLangContent; es: ProjectLangContent; nl: ProjectLangContent; }
type LangCode = 'fr' | 'en' | 'es' | 'nl';

const emit = defineEmits(['close'])
const isAuthenticated = ref(false)
const password = ref('')
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const editLang = ref<LangCode>('fr')
const currentIdx = ref<number | null>(null)

const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true
  setTimeout(() => { toast.show = false }, 4000)
}

const loadProjects = (): Project[] => {
  const getLangList = (lang: string) => (i18n.global.getLocaleMessage(lang) as any).projects_list || []
  const fr = getLangList('fr'); const en = getLangList('en'); const es = getLangList('es'); const nl = getLangList('nl')
  return fr.map((p: any, i: number) => ({
    id: p.id || Date.now() + i, category: p.category || 'manage', image: p.image || '', link: p.link || '',
    fr: { title: p.title || '', desc: p.desc || '' },
    en: { title: en[i]?.title || '', desc: en[i]?.desc || '' },
    es: { title: es[i]?.title || '', desc: es[i]?.desc || '' },
    nl: { title: nl[i]?.title || '', desc: nl[i]?.desc || '' }
  }))
}
const localProjects = ref<Project[]>(loadProjects())

const handleLogin = async () => {
  if (!password.value) return; isLoggingIn.value = true; loginError.value = ''
  try {
    const res = await fetch('/api/manage-content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value, action: 'login' })
    })
    if (res.ok) { isAuthenticated.value = true; triggerToast('Accès autorisé') }
    else { loginError.value = "Code de sécurité invalide"; password.value = "" }
  } catch (e) { loginError.value = "Erreur de connexion" } finally { isLoggingIn.value = false }
}

const addNewProject = () => {
  const newProj: Project = { id: Date.now(), category: 'manage', image: '', link: '', fr: { title: '', desc: '' }, en: { title: '', desc: '' }, es: { title: '', desc: '' }, nl: { title: '', desc: '' } }
  localProjects.value.push(newProj); currentIdx.value = localProjects.value.length - 1; triggerToast('Projet ajouté')
}

const deleteProject = (idx: number) => {
  if (confirm('Supprimer définitivement ce projet ?')) {
    localProjects.value.splice(idx, 1)
    if (currentIdx.value === idx) currentIdx.value = null
    triggerToast('Projet supprimé', 'error')
  }
}

const saveAll = async () => {
  if (isSaving.value) return; isSaving.value = true
  try {
    const payloads: Record<string, any> = {}; const langs: LangCode[] = ['fr', 'en', 'es', 'nl']
    langs.forEach(l => {
      const fullContent = JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(l)))
      fullContent.projects_list = localProjects.value.map(p => ({ id: p.id, category: p.category, image: p.image, link: p.link, title: p[l].title, desc: p[l].desc }))
      payloads[l] = fullContent
    })
    const res = await fetch('/api/manage-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: password.value, content: payloads }) })
    if (res.ok) { triggerToast('Modifications publiées !'); setTimeout(() => window.location.reload(), 1000) }
    else triggerToast('Erreur publication', 'error')
  } catch (e) { triggerToast('Erreur réseau', 'error') } finally { isSaving.value = false }
}
</script>

<style scoped>
/* ===============================
   DESIGN SYSTEM (CLEAN 2025)
================================ */
.admin-portal {
  --bg-dark: #070708;
  --panel-bg: rgba(18,18,22,0.9);
  --sidebar-bg: rgba(12,12,14,0.95);
  --border-soft: rgba(255,255,255,0.06);
  --accent: #6366f1;
  --accent-soft: rgba(99,102,241,0.15);
  --text-main: #f4f5f7;
  --text-muted: #9ca3af;

  position: fixed;
  inset: 0;
  z-index: 99999;
  background: radial-gradient(circle at 30% 20%, rgba(99,102,241,0.08), transparent 40%),
  rgba(4,4,5,0.92);
  backdrop-filter: blur(24px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--text-main);
}

/* ===============================
   AUTH
================================ */
.auth-card {
  background: var(--panel-bg);
  border-radius: 28px;
  padding: 48px 44px;
  box-shadow: 0 40px 120px rgba(0,0,0,0.6);
  position: relative;
  overflow: hidden;
}

.auth-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle at 40% 30%, var(--accent-soft), transparent 45%);
  pointer-events: none;
}

.brand-logo {
  width: 68px;
  height: 68px;
  margin: 0 auto 28px;
  border-radius: 20px;
  background: linear-gradient(135deg, #1c1c22, #0e0e12);
  display: grid;
  place-items: center;
  color: var(--accent);
}

.auth-header h1 {
  font-size: 1.9rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.auth-header p {
  color: var(--text-muted);
  margin-top: 6px;
}

/* Inputs */
.input-wrapper {
  background: rgba(255,255,255,0.03);
  border-radius: 14px;
  border: 1px solid transparent;
  transition: all 0.25s;
}

.input-wrapper:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft);
}

.input-wrapper input {
  padding: 16px 16px 16px 48px;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, var(--accent), #818cf8);
  border-radius: 14px;
  font-weight: 700;
  transition: transform .25s, box-shadow .25s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px var(--accent-soft);
}

.btn-ghost {
  background: transparent;
  border: none;
  color: var(--text-muted);
  margin-top: 14px;
}

/* ===============================
   DASHBOARD
================================ */
.dashboard-layout {
  width: 96vw;
  height: 92vh;
  max-width: 1600px;
  background: var(--bg-dark);
  border-radius: 36px;
  overflow: hidden;
  display: flex;
  box-shadow: 0 60px 140px rgba(0,0,0,0.7);
}

/* Sidebar */
.sidebar {
  width: 300px;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 28px 24px;
}

.app-brand {
  font-size: 1.15rem;
  font-weight: 800;
}

.brand-square {
  background: var(--accent);
  border-radius: 10px;
}

.project-item {
  border-radius: 18px;
  padding: 14px 16px;
  margin-bottom: 8px;
  background: transparent;
}

.project-item:hover {
  background: rgba(255,255,255,0.04);
}

.project-item.active {
  background: var(--accent-soft);
}

.project-indicator {
  width: 3px;
  border-radius: 3px;
}

.sidebar-footer {
  padding: 20px;
}

/* ===============================
   MAIN STAGE
================================ */
.stage-header {
  padding: 26px 42px;
}

.lang-selector {
  background: rgba(255,255,255,0.04);
  border-radius: 14px;
  padding: 4px;
}

.lang-tab {
  padding: 8px 22px;
  font-size: 0.75rem;
  border-radius: 10px;
}

.lang-tab.active {
  background: var(--accent);
  color: white;
}

/* Editor */
.editor-container {
  grid-template-columns: 1fr 360px;
}

.content-card {
  background: var(--panel-bg);
  border-radius: 22px;
  box-shadow: inset 0 0 0 1px var(--border-soft);
}

.card-head {
  font-weight: 700;
}

.input-box input,
.input-box textarea,
.input-box select {
  background: rgba(255,255,255,0.03);
  border-radius: 14px;
}

/* Preview */
.preview-area {
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

/* ===============================
   EMPTY STATE
================================ */
.empty-state {
  opacity: 0.9;
}

.empty-icon {
  background: radial-gradient(circle at 30% 30%, var(--accent-soft), transparent 60%);
}

/* ===============================
   TOASTS
================================ */
.modern-toast {
  border-radius: 18px;
  background: rgba(20,20,25,0.95);
  backdrop-filter: blur(10px);
}

.toast-indicator {
  border-radius: 4px;
}

/* ===============================
   SCROLLBAR
================================ */
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.15);
}

</style>