<template>
  <Transition name="portal-fade">
    <div class="admin-portal">

      <div class="toast-container">
        <TransitionGroup name="toast-anim">
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
      </div>

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

// TOAST LOGIC
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
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
/* CONFIGURATION GÉNÉRALE */
.admin-portal {
  --bg-dark: #070708;
  --card-bg: #111114;
  --sidebar-bg: #0c0c0e;
  --border-color: rgba(255, 255, 255, 0.08);
  --accent-color: #6366f1;
  --accent-glow: rgba(99, 102, 241, 0.25);
  --text-main: #edeeef;
  --text-muted: #8a94a6;
  --radius-lg: 24px;
  --radius-md: 12px;

  position: fixed; inset: 0; z-index: 99999;
  background: rgba(4, 4, 5, 0.95);
  backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center;
  color: var(--text-main); font-family: 'Inter', system-ui, sans-serif;
}

/* --- SYSTÈME DE TOAST (FIX) --- */
.toast-container {
  position: fixed; top: 32px; left: 50%; transform: translateX(-50%);
  z-index: 100001; pointer-events: none;
}
.modern-toast {
  pointer-events: auto;
  background: var(--card-bg); border: 1px solid var(--border-color);
  padding: 12px 20px; border-radius: 16px; display: flex; align-items: center;
  gap: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  min-width: 320px; position: relative; overflow: hidden;
}
.toast-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: var(--accent-color); }
.modern-toast.error .toast-indicator { background: #ff4757; }
.toast-close { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 6px; }
.toast-close:hover { background: rgba(255,255,255,0.05); color: white; }

/* ANIMATION TOAST */
.toast-anim-enter-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-anim-leave-active { transition: all 0.3s ease; }
.toast-anim-enter-from { opacity: 0; transform: translateY(-20px) scale(0.9); }
.toast-anim-leave-to { opacity: 0; transform: translateY(-10px) scale(0.95); }

/* --- PAGE DE LOGIN (STYLE RÉ-INTRODUIT) --- */
.auth-wrapper { width: 100%; max-width: 440px; padding: 20px; }
.auth-card {
  position: relative; background: var(--card-bg); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); padding: 48px 40px; overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
}
.auth-glow {
  position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
  background: radial-gradient(circle at center, var(--accent-glow) 0%, transparent 60%);
  pointer-events: none;
}
.auth-content { position: relative; z-index: 1; }
.brand-logo { width: 64px; height: 64px; margin: 0 auto 24px; background: linear-gradient(135deg, #1f1f23, #111114); border-radius: 18px; padding: 2px; border: 1px solid var(--border-color); }
.logo-inner { width: 100%; height: 100%; background: var(--card-bg); border-radius: 16px; display: grid; place-items: center; color: var(--accent-color); }
.auth-header { text-align: center; margin-bottom: 32px; }
.auth-header h1 { font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 8px; }
.auth-header p { color: var(--text-muted); font-size: 0.95rem; }

.input-wrapper {
  position: relative; background: rgba(0,0,0,0.2); border-radius: var(--radius-md);
  border: 1px solid var(--border-color); transition: all 0.3s;
}
.input-wrapper:focus-within { border-color: var(--accent-color); box-shadow: 0 0 0 4px var(--accent-glow); }
.field-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
.input-wrapper input { width: 100%; padding: 16px 16px 16px 48px; background: transparent; border: none; color: white; outline: none; }
.error-text { color: #ff4757; font-size: 0.85rem; margin-top: 8px; text-align: left; }

.btn-primary {
  width: 100%; background: var(--accent-color); color: white; border: none;
  padding: 16px; border-radius: var(--radius-md); font-weight: 600;
  display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: all 0.3s;
}
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px var(--accent-glow); }
.btn-ghost-text { background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.9rem; margin-top: 16px; width: 100%; text-align: center; }
.btn-ghost-text:hover { color: white; }

.shake-on-error { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
@keyframes shake { 10%, 90% { transform: translate3d(-1px, 0, 0); } 20%, 80% { transform: translate3d(2px, 0, 0); } 30%, 50%, 70% { transform: translate3d(-4px, 0, 0); } 40%, 60% { transform: translate3d(4px, 0, 0); } }

/* --- DASHBOARD LAYOUT --- */
.dashboard-layout {
  width: 96vw; height: 94vh; max-width: 1600px;
  background: var(--bg-dark); border: 1px solid var(--border-color);
  border-radius: 32px; display: flex; overflow: hidden;
  box-shadow: 0 50px 100px rgba(0,0,0,0.6);
}

.sidebar { width: 300px; background: var(--sidebar-bg); border-right: 1px solid var(--border-color); display: flex; flex-direction: column; }
.sidebar-header { padding: 32px 24px; display: flex; justify-content: space-between; align-items: center; }
.app-brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.1rem; }
.brand-square { width: 32px; height: 32px; background: var(--accent-color); border-radius: 8px; display: grid; place-items: center; color: white; }
.btn-add-project { width: 40px; height: 40px; border-radius: 12px; border: 1px solid var(--border-color); background: rgba(255,255,255,0.03); color: white; cursor: pointer; transition: all 0.2s; }
.btn-add-project:hover { background: var(--accent-color); transform: rotate(90deg); }

.project-list { flex: 1; padding: 0 16px; overflow-y: auto; }
.project-item { padding: 14px 16px; border-radius: 16px; margin-bottom: 6px; cursor: pointer; position: relative; display: flex; align-items: center; transition: all 0.2s; border: 1px solid transparent; }
.project-item:hover { background: rgba(255,255,255,0.03); }
.project-item.active { background: rgba(99, 102, 241, 0.1); border-color: rgba(99, 102, 241, 0.2); }
.project-indicator { width: 3px; height: 0; background: var(--accent-color); position: absolute; left: 0; border-radius: 0 4px 4px 0; transition: 0.3s; }
.project-item.active .project-indicator { height: 20px; }
.project-details { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.project-title { font-weight: 600; font-size: 0.9rem; }
.project-cat { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; }
.btn-delete-item { opacity: 0; padding: 6px; border-radius: 6px; color: #ff4757; background: transparent; border: none; cursor: pointer; }
.project-item:hover .btn-delete-item { opacity: 1; }

.sidebar-footer { padding: 24px; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 12px; }
.btn-save-main { background: var(--accent-color); color: white; border: none; padding: 14px; border-radius: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: 0.2s; }
.btn-save-main:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 10px 20px var(--accent-glow); }
.logout-link { background: transparent; border: none; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }

/* STAGE */
.main-stage { flex: 1; display: flex; flex-direction: column; background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent); }
.stage-header { padding: 24px 40px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); }
.lang-selector { display: flex; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 12px; border: 1px solid var(--border-color); }
.lang-tab { padding: 8px 18px; border: none; background: transparent; color: var(--text-muted); border-radius: 8px; font-weight: 600; font-size: 0.75rem; cursor: pointer; transition: 0.2s; }
.lang-tab.active { background: white; color: #000; }
.btn-close-app { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border-color); background: rgba(255,255,255,0.03); color: var(--text-muted); display: grid; place-items: center; cursor: pointer; transition: 0.2s; }
.btn-close-app:hover { background: rgba(255, 71, 87, 0.1); color: #ff4757; transform: rotate(90deg); }

.stage-content { padding: 40px; overflow-y: auto; }
.editor-grid { display: grid; grid-template-columns: 1fr 320px; gap: 32px; max-width: 1200px; margin: 0 auto; }
.content-card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 20px; overflow: hidden; }
.card-head { padding: 20px 24px; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.01); }
.card-head h3 { font-size: 0.95rem; font-weight: 700; }
.icon-accent { color: var(--accent-color); }
.card-body { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
.input-box { display: flex; flex-direction: column; gap: 8px; }
.input-box label { font-size: 0.75rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }
.input-box input, .input-box select, .input-box textarea { background: rgba(0,0,0,0.3); border: 1px solid var(--border-color); border-radius: 12px; padding: 12px 16px; color: white; font-size: 0.95rem; }
.input-box input:focus, .input-box textarea:focus { border-color: var(--accent-color); outline: none; }
.input-with-icon { position: relative; }
.input-with-icon svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
.input-with-icon input { padding-left: 40px; width: 100%; }
.preview-area { margin-top: 8px; border-radius: 12px; overflow: hidden; aspect-ratio: 16/9; border: 1px solid var(--border-color); }
.preview-area img { width: 100%; height: 100%; object-fit: cover; }

.empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px; }
.empty-icon { width: 80px; height: 80px; background: rgba(99, 102, 241, 0.1); border-radius: 24px; display: grid; place-items: center; color: var(--accent-color); margin-bottom: 24px; }

/* TRANSITIONS */
.portal-fade-enter-active, .portal-fade-leave-active { transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
.portal-fade-enter-from, .portal-fade-leave-to { opacity: 0; transform: scale(1.05); }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>