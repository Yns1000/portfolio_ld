<template>
  <Transition name="overlay">
    <div class="admin-portal">

      <Transition name="toast">
        <div v-if="toast.show" :class="['modern-toast', toast.type]">
          <div class="toast-icon">
            <CheckCircle2 v-if="toast.type === 'success'" :size="20" />
            <AlertCircle v-else :size="20" />
          </div>
          <div class="toast-content">
            <span class="toast-msg">{{ toast.message }}</span>
          </div>
          <button @click="toast.show = false" class="toast-close">✕</button>
        </div>
      </Transition>

      <div v-if="!isAuthenticated" class="auth-wrapper">
        <div class="auth-card" :class="{ 'shake-on-error': loginError }">
          <div class="auth-glow"></div>
          <div class="auth-inner">
            <div class="auth-header">
              <div class="brand-icon">
                <Fingerprint :size="32" stroke-width="1.5" />
              </div>
              <h1>Portail Admin</h1>
              <p>Entrez votre clé d'accès pour continuer</p>
            </div>

            <div class="auth-body">
              <div class="input-field" :class="{ 'has-error': loginError }">
                <label>Code de sécurité</label>
                <div class="input-control">
                  <Lock :size="18" class="icon-left" />
                  <input
                      v-model="password"
                      type="password"
                      placeholder="••••••••"
                      @keyup.enter="handleLogin"
                      :disabled="isLoggingIn"
                  />
                </div>
                <Transition name="slide-up">
                  <span v-if="loginError" class="error-hint">{{ loginError }}</span>
                </Transition>
              </div>

              <button @click="handleLogin" class="btn-submit" :disabled="isLoggingIn">
                <Loader2 v-if="isLoggingIn" class="spin" :size="20" />
                <template v-else>
                  <span>Accéder au Dashboard</span>
                  <ChevronRight :size="18" />
                </template>
              </button>

              <button @click="$emit('close')" class="btn-cancel">Quitter</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="dashboard">
        <aside class="dashboard-sidebar">
          <div class="sidebar-top">
            <div class="logo-area">
              <LayoutDashboard :size="20" class="text-accent" />
              <span>Console</span>
            </div>
            <button @click="addNewProject" class="add-project-btn">
              <Plus :size="18" />
              <span>Nouveau</span>
            </button>
          </div>

          <div class="sidebar-nav custom-scrollbar">
            <div
                v-for="(proj, index) in localProjects"
                :key="index"
                class="nav-project-item"
                :class="{ active: currentIdx === index }"
                @click="currentIdx = index"
            >
              <div class="item-status"></div>
              <div class="item-info">
                <span class="item-name">{{ proj.fr.title || 'Projet sans titre' }}</span>
                <span class="item-meta">{{ proj.category || 'Non classé' }}</span>
              </div>
              <button @click.stop="deleteProject(index)" class="item-delete">
                <Trash2 :size="14" />
              </button>
            </div>
          </div>

          <div class="sidebar-bottom">
            <button @click="saveAll" :disabled="isSaving" class="publish-btn">
              <CloudUpload v-if="!isSaving" :size="20" />
              <Loader2 v-else class="spin" :size="20" />
              <span>{{ isSaving ? 'Publication...' : 'Mettre à jour' }}</span>
            </button>
            <button @click="isAuthenticated = false" class="logout-link">
              <LogOut :size="14" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        <main class="dashboard-main">
          <header class="main-header">
            <div v-if="currentIdx !== null" class="tab-group">
              <button
                  v-for="l in ['fr', 'en', 'es', 'nl']" :key="l"
                  class="tab-item" :class="{ active: editLang === l }"
                  @click="editLang = l"
              >
                {{ l.toUpperCase() }}
              </button>
            </div>
            <div class="header-actions">
              <button @click="$emit('close')" class="action-close" title="Fermer">
                <X :size="20" />
              </button>
            </div>
          </header>

          <div v-if="currentIdx !== null" class="main-content custom-scrollbar">
            <div class="editor-grid">
              <div class="editor-section">
                <div class="section-title">
                  <Languages :size="18" />
                  <span>Textes du projet ({{ editLang.toUpperCase() }})</span>
                </div>

                <div class="input-stack">
                  <div class="field-box">
                    <label>Nom du projet</label>
                    <input v-model="localProjects[currentIdx][editLang].title" placeholder="Ex: Nego Chine" />
                  </div>
                  <div class="field-box">
                    <label>Description détaillée</label>
                    <textarea v-model="localProjects[currentIdx][editLang].desc" rows="8"></textarea>
                  </div>
                </div>
              </div>

              <div class="editor-section">
                <div class="section-title">
                  <Settings :size="18" />
                  <span>Paramètres Généraux</span>
                </div>

                <div class="input-stack">
                  <div class="field-box">
                    <label>Catégorie</label>
                    <select v-model="localProjects[currentIdx].category">
                      <option value="manage">Gestion de projet</option>
                      <option value="trans">Interculturel</option>
                      <option value="marketing">Marketing</option>
                    </select>
                  </div>
                  <div class="field-box">
                    <label>Lien URL (Détails)</label>
                    <input v-model="localProjects[currentIdx].link" placeholder="https://..." />
                  </div>
                  <div class="field-box">
                    <label>URL de l'image (Couverture)</label>
                    <div class="input-icon-wrapper">
                      <ImageIcon :size="16" />
                      <input v-model="localProjects[currentIdx].image" placeholder="Lien Unsplash" />
                    </div>
                  </div>

                  <div class="image-preview" v-if="localProjects[currentIdx].image">
                    <img :src="localProjects[currentIdx].image" alt="Preview" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="welcome-screen">
            <div class="welcome-box">
              <div class="icon-pulse">
                <MousePointerClick :size="48" />
              </div>
              <h2>Dashboard de Laurine</h2>
              <p>Sélectionnez un projet à gauche pour commencer l'édition.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive } from 'vue'
import i18n from '../i18n'
import {
  Lock, Loader2, Plus, Trash2, LogOut, X, CloudUpload,
  Languages, Settings, Image as ImageIcon, LayoutDashboard,
  CheckCircle2, AlertCircle, Fingerprint, ChevronRight,
  MousePointerClick
} from 'lucide-vue-next'

const emit = defineEmits(['close'])

const isAuthenticated = ref(false)
const password = ref('')
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const editLang = ref('fr')
const currentIdx = ref(null)

// Système de Toast
const toast = reactive({ show: false, message: '', type: 'success' })
const triggerToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => toast.show = false, 4000)
}

// Initialisation
const loadProjects = () => {
  const fr = i18n.global.getLocaleMessage('fr').projects_list || []
  const en = i18n.global.getLocaleMessage('en').projects_list || []
  const es = i18n.global.getLocaleMessage('es').projects_list || []
  const nl = i18n.global.getLocaleMessage('nl').projects_list || []

  return fr.map((p, i) => ({
    id: p.id || Date.now() + i,
    category: p.category,
    image: p.image,
    link: p.link,
    fr: { title: p.title, desc: p.desc },
    en: { title: en[i]?.title || '', desc: en[i]?.desc || '' },
    es: { title: es[i]?.title || '', desc: es[i]?.desc || '' },
    nl: { title: nl[i]?.title || '', desc: nl[i]?.desc || '' }
  }))
}

const localProjects = ref(loadProjects())

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
      triggerToast('Accès autorisé.', 'success')
    } else {
      loginError.value = "Code invalide"
      password.value = ""
    }
  } catch (e) {
    loginError.value = "Erreur serveur"
  } finally {
    isLoggingIn.value = false
  }
}

const addNewProject = () => {
  localProjects.value.push({
    id: Date.now(), category: 'manage', image: '', link: '',
    fr: {title:'', desc:''}, en: {title:'', desc:''}, es: {title:'', desc:''}, nl: {title:'', desc:''}
  })
  currentIdx.value = localProjects.value.length - 1
  triggerToast('Projet ajouté')
}

const deleteProject = (idx) => {
  if (confirm('Supprimer ce projet ?')) {
    localProjects.value.splice(idx, 1)
    if (currentIdx.value === idx) currentIdx.value = null
    triggerToast('Projet supprimé', 'error')
  }
}

const saveAll = async () => {
  isSaving.value = true
  try {
    const payloads = {}
    const langs = ['fr', 'en', 'es', 'nl']

    langs.forEach(l => {
      const full = JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(l)))
      full.projects_list = localProjects.value.map(p => ({
        id: p.id, category: p.category, image: p.image, link: p.link,
        title: p[l].title, desc: p[l].desc
      }))
      payloads[l] = full
    })

    const res = await fetch('/api/manage-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value, content: payloads })
    })

    if (res.ok) {
      triggerToast('Publication réussie !')
      setTimeout(() => window.location.reload(), 1500)
    } else {
      triggerToast('Erreur publication', 'error')
    }
  } catch (e) {
    triggerToast('Erreur réseau', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.admin-portal {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(4, 4, 4, 0.9); backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Inter', sans-serif; color: white;
  --accent: var(--color-accent, #00d2ff);
  --zinc-900: #18181b;
  --zinc-950: #09090b;
}

/* TOASTS */
.modern-toast {
  position: fixed; top: 40px; left: 50%; transform: translateX(-50%);
  background: var(--zinc-900); border: 1px solid #27272a;
  padding: 12px 20px; border-radius: 12px; display: flex; align-items: center; gap: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4); z-index: 100000;
}
.toast-icon.success { color: #10b981; }
.toast-icon.error { color: #ef4444; }

/* AUTH */
.auth-wrapper { width: 100%; max-width: 440px; padding: 20px; }
.auth-card { position: relative; background: var(--zinc-950); border: 1px solid #27272a; border-radius: 24px; padding: 40px; }
.auth-card.shake-on-error { animation: shake 0.5s ease-in-out; }

.brand-icon { width: 64px; height: 64px; background: var(--zinc-900); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: var(--accent); }

.input-control { position: relative; margin-top: 10px; }
.icon-left { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #3f3f46; }
.input-control input { width: 100%; background: var(--zinc-900); border: 1px solid #27272a; border-radius: 12px; padding: 14px 14px 14px 48px; color: white; outline: none; }
.input-control input:focus { border-color: #52525b; }

.btn-submit { width: 100%; background: white; color: black; border: none; padding: 16px; border-radius: 12px; font-weight: 700; margin-top: 24px; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; }
.btn-cancel { width: 100%; background: none; border: none; color: #52525b; margin-top: 16px; cursor: pointer; }

/* DASHBOARD */
.dashboard { width: 95vw; max-width: 1400px; height: 90vh; background: var(--zinc-950); border: 1px solid #27272a; border-radius: 32px; display: flex; overflow: hidden; }

.dashboard-sidebar { width: 300px; border-right: 1px solid #18181b; display: flex; flex-direction: column; background: #0c0c0e; }
.sidebar-top { padding: 24px; display: flex; justify-content: space-between; align-items: center; }
.add-project-btn { background: var(--zinc-900); border: 1px solid #27272a; color: white; padding: 8px 12px; border-radius: 20px; cursor: pointer; display: flex; gap: 5px; align-items: center; }

.sidebar-nav { flex: 1; overflow-y: auto; padding: 10px; }
.nav-project-item { padding: 12px; border-radius: 12px; cursor: pointer; display: flex; align-items: center; gap: 12px; margin-bottom: 5px; transition: 0.2s; }
.nav-project-item.active { background: var(--zinc-900); border: 1px solid #27272a; }
.item-status { width: 8px; height: 8px; border-radius: 50%; background: #3f3f46; }
.active .item-status { background: var(--accent); box-shadow: 0 0 10px var(--accent); }

.dashboard-main { flex: 1; display: flex; flex-direction: column; background: var(--zinc-950); }
.main-header { padding: 20px 32px; border-bottom: 1px solid #18181b; display: flex; justify-content: space-between; align-items: center; }

.tab-group { background: var(--zinc-900); padding: 4px; border-radius: 12px; display: flex; gap: 4px; }
.tab-item { border: none; background: none; color: #71717a; padding: 6px 12px; border-radius: 8px; font-weight: 700; cursor: pointer; }
.tab-item.active { background: #27272a; color: white; }

.main-content { flex: 1; overflow-y: auto; padding: 32px; }
.editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }

.field-box { margin-bottom: 20px; }
.field-box label { display: block; font-size: 12px; color: #71717a; margin-bottom: 8px; text-transform: uppercase; }
.field-box input, .field-box textarea, .field-box select { width: 100%; background: #0c0c0e; border: 1px solid #18181b; border-radius: 12px; padding: 12px; color: white; outline: none; }

.image-preview { margin-top: 15px; border-radius: 12px; overflow: hidden; border: 1px solid #18181b; height: 150px; }
.image-preview img { width: 100%; height: 100%; object-fit: cover; }

/* ANIMATIONS */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.spin { animation: spin 1s linear infinite; }

.overlay-enter-active, .overlay-leave-active { transition: opacity 0.3s; }
.overlay-enter-from, .overlay-leave-to { opacity: 0; }

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -20px); }
</style>