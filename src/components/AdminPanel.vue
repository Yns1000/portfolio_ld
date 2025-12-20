<template>
  <Transition name="fade-blur">
    <div class="admin-screen">

      <Transition name="toast">
        <div v-if="toast.show" :class="['toast-notification', toast.type]">
          <CheckCircle v-if="toast.type === 'success'" :size="18" />
          <AlertCircle v-else :size="18" />
          <span>{{ toast.message }}</span>
        </div>
      </Transition>

      <div v-if="!isAuthenticated" class="auth-container">
        <div class="glass-card login-box">
          <div class="auth-header">
            <div class="lock-circle">
              <Lock :size="32" class="accent-icon" />
            </div>
            <h2>Administration</h2>
            <p>Accès sécurisé au portfolio</p>
          </div>

          <div class="auth-form">
            <div class="input-group">
              <label>Code d'accès</label>
              <div class="input-with-icon">
                <ShieldKeyhole :size="18" class="field-icon" />
                <input
                    v-model="password"
                    type="password"
                    placeholder="••••••••"
                    class="custom-input"
                    @keyup.enter="handleLogin"
                    :disabled="isLoggingIn"
                />
              </div>
              <Transition name="slide-up">
                <span v-if="loginError" class="error-msg">{{ loginError }}</span>
              </Transition>
            </div>

            <div class="auth-actions">
              <button @click="$emit('close')" class="btn-secondary">
                Annuler
              </button>
              <button @click="handleLogin" class="btn-accent" :disabled="isLoggingIn">
                <Loader2 v-if="isLoggingIn" class="spin" :size="18" />
                <span v-else>Connexion</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="dashboard-container glass-card">

        <aside class="sidebar">
          <div class="sidebar-header">
            <div class="header-title">
              <FolderKanban :size="20" class="accent-icon" />
              <h3>Projets</h3>
            </div>
            <button @click="addNewProject" class="btn-circle-add" title="Ajouter un projet">
              <Plus :size="20" />
            </button>
          </div>

          <div class="project-nav custom-scrollbar">
            <div
                v-for="(proj, index) in localProjects"
                :key="index"
                class="nav-item"
                :class="{ active: currentIdx === index }"
                @click="currentIdx = index"
            >
              <div class="nav-content">
                <span class="nav-title">{{ proj.fr.title || 'Nouveau projet' }}</span>
                <span class="nav-category">{{ proj.category }}</span>
              </div>
              <button @click.stop="deleteProject(index)" class="btn-icon-trash">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>

          <div class="sidebar-footer">
            <button @click="saveAll" :disabled="isSaving" class="btn-accent btn-full">
              <Save v-if="!isSaving" :size="18" />
              <Loader2 v-else class="spin" :size="18" />
              <span>{{ isSaving ? 'Publication...' : 'Enregistrer' }}</span>
            </button>
            <button @click="isAuthenticated = false" class="btn-logout">
              <LogOut :size="16" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        <main class="editor-main">
          <header class="editor-header">
            <div v-if="currentIdx !== null" class="lang-selector">
              <button
                  v-for="l in ['fr', 'en', 'es', 'nl']"
                  :key="l"
                  class="lang-btn"
                  :class="{ active: editLang === l }"
                  @click="editLang = l"
              >
                {{ l.toUpperCase() }}
              </button>
            </div>
            <button @click="$emit('close')" class="close-dashboard-btn" title="Fermer l'admin">
              <X :size="22" />
            </button>
          </header>

          <div v-if="currentIdx !== null" class="editor-body custom-scrollbar">
            <section class="form-section">
              <div class="section-header">
                <Globe :size="18" />
                <h4 class="section-title">Contenu localisé ({{ editLang.toUpperCase() }})</h4>
              </div>

              <div class="field">
                <label>Titre du projet</label>
                <input v-model="localProjects[currentIdx][editLang].title" placeholder="Ex: Virtual Exchange" class="custom-input" />
              </div>
              <div class="field">
                <label>Description</label>
                <textarea v-model="localProjects[currentIdx][editLang].desc" rows="5" class="custom-input" placeholder="Décrivez le projet..."></textarea>
              </div>
            </section>

            <div class="divider"></div>

            <section class="form-section">
              <div class="section-header">
                <Settings2 :size="18" />
                <h4 class="section-title">Paramètres Techniques</h4>
              </div>

              <div class="grid-fields">
                <div class="field">
                  <label>Catégorie</label>
                  <select v-model="localProjects[currentIdx].category" class="custom-input">
                    <option value="manage">Gestion</option>
                    <option value="trans">Intercultural</option>
                    <option value="marketing">Marketing</option>
                  </select>
                </div>
                <div class="field">
                  <label>Lien externe</label>
                  <input v-model="localProjects[currentIdx].link" placeholder="https://..." class="custom-input" />
                </div>
              </div>
              <div class="field mt-4">
                <label>Image de couverture (URL)</label>
                <div class="input-with-icon">
                  <Image :size="18" class="field-icon" />
                  <input v-model="localProjects[currentIdx].image" class="custom-input" placeholder="Lien vers l'image Unsplash" />
                </div>
              </div>
            </section>
          </div>

          <div v-else class="empty-state">
            <div class="empty-illustration">
              <Layout :size="64" />
            </div>
            <p>Sélectionnez un projet pour commencer l'édition</p>
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
  Lock, ShieldKeyhole, Loader2, Plus, Trash2, Save,
  LogOut, X, Globe, Settings2, Image, Layout,
  FolderKanban, CheckCircle, AlertCircle
} from 'lucide-vue-next'

const emit = defineEmits(['close'])

const isAuthenticated = ref(false)
const password = ref('')
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const editLang = ref('fr')
const currentIdx = ref(null)

// Système de toast
const toast = reactive({ show: false, message: '', type: 'success' })
const showToast = (msg, type = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => toast.show = false, 3000)
}

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
      showToast('Connexion réussie', 'success')
    } else {
      loginError.value = "Code d'accès invalide"
      password.value = ""
    }
  } catch (e) {
    loginError.value = "Erreur de connexion serveur"
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
  showToast('Nouveau projet créé')
}

const deleteProject = (idx) => {
  if (confirm('Supprimer ce projet définitivement ?')) {
    localProjects.value.splice(idx, 1)
    if (currentIdx.value === idx) currentIdx.value = null
    showToast('Projet supprimé', 'error')
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
      showToast('Modifications publiées !')
      setTimeout(() => window.location.reload(), 1000)
    } else {
      showToast('Erreur lors de la sauvegarde', 'error')
    }
  } catch (e) {
    showToast('Erreur réseau', 'error')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
/* NOTIFICATIONS (TOASTS) */
.toast-notification {
  position: fixed; top: 30px; left: 50%; transform: translateX(-50%);
  z-index: 100000; display: flex; align-items: center; gap: 10px;
  padding: 12px 24px; border-radius: 50px; background: rgba(0,0,0,0.9);
  border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(10px);
  color: white; font-weight: 600; font-size: 14px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
.toast-notification.success { border-left: 4px solid #10b981; }
.toast-notification.error { border-left: 4px solid #ef4444; }

/* BASE ADMIN */
.admin-screen {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(8, 8, 8, 0.85); backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Inter', sans-serif; color: white; padding: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
}

/* AUTH UI */
.lock-circle {
  width: 70px; height: 70px; background: rgba(255, 255, 255, 0.05);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 20px; border: 1px solid rgba(255, 255, 255, 0.1);
}
.input-group label { display: block; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 8px; font-weight: 700; }
.input-with-icon { position: relative; width: 100%; }
.field-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #444; }
.input-with-icon input { padding-left: 45px !important; }

/* DASHBOARD LAYOUT */
.dashboard-container { width: 100%; max-width: 1200px; height: 85vh; display: flex; overflow: hidden; }

/* SIDEBAR */
.sidebar { width: 320px; border-right: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; background: rgba(0,0,0,0.2); }
.header-title { display: flex; align-items: center; gap: 10px; }
.sidebar-header { padding: 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.nav-item {
  margin: 0 15px 5px; padding: 12px 15px; border-radius: 14px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid transparent;
}
.nav-content { display: flex; flex-direction: column; gap: 2px; }
.nav-title { font-size: 14px; font-weight: 600; color: #eee; }
.nav-category { font-size: 10px; text-transform: uppercase; color: #666; letter-spacing: 1px; }

.nav-item:hover { background: rgba(255, 255, 255, 0.03); border-color: rgba(255,255,255,0.05); }
.nav-item.active { background: white; }
.nav-item.active .nav-title { color: black; }
.nav-item.active .nav-category { color: #888; }
.btn-icon-trash { padding: 8px; border-radius: 10px; border: none; background: transparent; color: #444; cursor: pointer; transition: all 0.2s; }
.btn-icon-trash:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

/* EDITOR AREA */
.editor-main { flex: 1; display: flex; flex-direction: column; background: rgba(0,0,0,0.1); }
.editor-header { padding: 20px 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center; }
.close-dashboard-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: #666; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
.close-dashboard-btn:hover { background: white; color: black; border-color: white; transform: rotate(90deg); }

.section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 25px; color: var(--color-accent); }
.section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin: 0; }

/* UTILS */
.custom-input { width: 100%; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 14px 18px; color: white; outline: none; transition: all 0.3s; font-size: 14px; }
.custom-input:focus { border-color: var(--color-accent); background: rgba(255, 255, 255, 0.06); box-shadow: 0 0 0 4px rgba(var(--color-accent-rgb), 0.1); }

.btn-accent { background: white; color: black; border: none; padding: 14px 28px; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; }
.btn-accent:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
.btn-accent:disabled { opacity: 0.5; filter: grayscale(1); }

.btn-circle-add { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: white; color: black; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
.btn-circle-add:hover { transform: scale(1.1) rotate(90deg); }

.accent-icon { color: var(--color-accent); }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* SCROLLBAR */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

/* TRANSITIONS */
.fade-blur-enter-active, .fade-blur-leave-active { transition: all 0.4s ease; }
.fade-blur-enter-from, .fade-blur-leave-to { opacity: 0; backdrop-filter: blur(0px); }

.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translate(-50%, -20px); }
.toast-leave-to { opacity: 0; transform: translate(-50%, -20px); }
</style>