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
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(10,10,12,0.85);
  backdrop-filter: blur(24px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Inter, system-ui, sans-serif;
  color: #f4f4f5;

  --bg: #0b0b0e;
  --panel: #111114;
  --panel-soft: #151518;
  --border: #1f1f24;
  --muted: #8b8b94;
  --accent: var(--color-accent, #4f46e5);
}

/* ================= TOAST ================= */
.modern-toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--panel);
  border: 1px solid var(--border);
  padding: 14px 18px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,.45);
}

/* ================= AUTH ================= */
.auth-wrapper {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  background: linear-gradient(180deg, #121215, #0b0b0e);
  border: 1px solid var(--border);
  border-radius: 28px;
  padding: 42px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.brand-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 18px;
  background: var(--panel-soft);
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: var(--accent);
}

.auth-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
}

.auth-header p {
  color: var(--muted);
  font-size: 0.9rem;
  margin-top: 6px;
}

.input-control input {
  width: 100%;
  background: var(--panel-soft);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px 14px 48px;
  color: white;
}

.btn-submit {
  margin-top: 28px;
  width: 100%;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 14px;
  font-weight: 600;
}

.btn-cancel {
  margin-top: 14px;
  background: none;
  border: none;
  color: var(--muted);
}

/* ================= DASHBOARD ================= */
.dashboard {
  width: 94vw;
  max-width: 1500px;
  height: 88vh;
  background: var(--bg);
  border-radius: 32px;
  border: 1px solid var(--border);
  display: flex;
  overflow: hidden;
}

/* ===== SIDEBAR ===== */
.dashboard-sidebar {
  width: 280px;
  background: #0e0e12;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
}

.sidebar-top {
  padding: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-area {
  font-weight: 700;
  display: flex;
  gap: 10px;
  align-items: center;
}

.add-project-btn {
  background: var(--panel-soft);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 8px 14px;
  display: flex;
  gap: 6px;
  align-items: center;
}

.sidebar-nav {
  flex: 1;
  padding: 12px;
}

.nav-project-item {
  padding: 12px 14px;
  border-radius: 14px;
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
}

.nav-project-item.active {
  background: var(--panel-soft);
  border: 1px solid var(--border);
}

.item-meta {
  font-size: 12px;
  color: var(--muted);
}

.sidebar-bottom {
  padding: 18px;
  border-top: 1px solid var(--border);
}

/* ===== MAIN ===== */
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-header {
  padding: 22px 32px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
}

.tab-group {
  background: var(--panel-soft);
  border-radius: 14px;
  padding: 4px;
  display: flex;
}

.tab-item {
  padding: 6px 14px;
  border-radius: 10px;
  color: var(--muted);
}

.tab-item.active {
  background: var(--bg);
  color: white;
}

/* ===== CONTENT ===== */
.main-content {
  padding: 36px;
  overflow-y: auto;
}

.editor-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 36px;
}

.editor-section {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 28px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  margin-bottom: 22px;
}

.field-box label {
  font-size: 11px;
  text-transform: uppercase;
  color: var(--muted);
  margin-bottom: 6px;
}

.field-box input,
.field-box textarea,
.field-box select {
  background: #0e0e12;
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 12px;
  color: white;
}

/* ===== EMPTY ===== */
.welcome-screen {
  flex: 1;
  display: grid;
  place-items: center;
}

.welcome-box {
  text-align: center;
  max-width: 420px;
}

.welcome-box h2 {
  margin-top: 16px;
  font-size: 1.6rem;
}

.welcome-box p {
  margin-top: 8px;
  color: var(--muted);
}

</style>