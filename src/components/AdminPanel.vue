<template>
  <div class="admin-screen">
    <div v-if="!isAuthenticated" class="auth-container">
      <div class="glass-card login-box">
        <div class="auth-header">
          <div class="lock-icon">🔒</div>
          <h2>Administration</h2>
          <p>Identifiez-vous pour modifier le portfolio</p>
        </div>

        <div class="auth-form">
          <div class="input-wrapper">
            <input
                v-model="password"
                type="password"
                placeholder="Mot de passe"
                class="custom-input"
                @keyup.enter="handleLogin"
                :disabled="isLoggingIn"
            />
            <div v-if="loginError" class="error-msg">{{ loginError }}</div>
          </div>

          <div class="auth-actions">
            <button @click="$emit('close')" class="btn-secondary">Annuler</button>
            <button @click="handleLogin" class="btn-accent" :disabled="isLoggingIn">
              {{ isLoggingIn ? 'Vérification...' : 'Connexion' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="dashboard-container glass-card">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>Projets</h3>
          <button @click="addNewProject" class="btn-add" title="Ajouter un projet">+</button>
        </div>

        <div class="project-nav">
          <div
              v-for="(proj, index) in localProjects"
              :key="index"
              class="nav-item"
              :class="{ active: currentIdx === index }"
              @click="currentIdx = index"
          >
            <span class="nav-title">{{ proj.fr.title || 'Nouveau projet' }}</span>
            <button @click.stop="deleteProject(index)" class="btn-trash">✕</button>
          </div>
        </div>

        <div class="sidebar-footer">
          <button @click="saveAll" :disabled="isSaving" class="btn-accent btn-full">
            {{ isSaving ? 'Publication...' : '🚀 Publier le site' }}
          </button>
          <button @click="isAuthenticated = false" class="btn-logout">Déconnexion</button>
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
          <button @click="$emit('close')" class="close-dashboard">✕</button>
        </header>

        <div v-if="currentIdx !== null" class="editor-body">
          <section class="form-section">
            <h4 class="section-title">Contenu ({{ editLang.toUpperCase() }})</h4>
            <div class="field">
              <label>Titre</label>
              <input v-model="localProjects[currentIdx][editLang].title" placeholder="Titre du projet" class="custom-input" />
            </div>
            <div class="field">
              <label>Description</label>
              <textarea v-model="localProjects[currentIdx][editLang].desc" rows="5" class="custom-input"></textarea>
            </div>
          </section>

          <div class="divider"></div>

          <section class="form-section">
            <h4 class="section-title">Paramètres Généraux</h4>
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
                <label>Lien URL</label>
                <input v-model="localProjects[currentIdx].link" placeholder="https://..." class="custom-input" />
              </div>
            </div>
            <div class="field mt-4">
              <label>Image URL (Unsplash)</label>
              <input v-model="localProjects[currentIdx].image" class="custom-input" />
            </div>
          </section>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">📂</div>
          <p>Sélectionnez un projet à gauche pour l'éditer</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import i18n from '../i18n'

const emit = defineEmits(['close'])

const isAuthenticated = ref(false)
const password = ref('')
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const editLang = ref('fr')
const currentIdx = ref(null)

// 1. Fusion des données i18n
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

// 2. Connexion sécurisée
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
    } else {
      loginError.value = "Mot de passe incorrect"
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
}

const deleteProject = (idx) => {
  if (confirm('Supprimer ce projet ?')) {
    localProjects.value.splice(idx, 1)
    if (currentIdx.value === idx) currentIdx.value = null
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
      alert("✅ Site mis à jour !")
      window.location.reload()
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
/* BASE STYLES */
.admin-screen {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(15px);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Inter', sans-serif;
  color: white;
  padding: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

/* AUTH */
.login-box { width: 100%; max-width: 400px; padding: 40px; text-align: center; }
.lock-icon { font-size: 40px; margin-bottom: 20px; }
.auth-header h2 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
.auth-header p { color: #888; font-size: 14px; }
.auth-form { margin-top: 30px; display: flex; flex-direction: column; gap: 20px; }
.error-msg { color: #ff4d4d; font-size: 12px; margin-top: 5px; }

/* DASHBOARD */
.dashboard-container { width: 100%; max-width: 1200px; height: 85vh; display: flex; overflow: hidden; }

.sidebar { width: 300px; border-right: 1px solid rgba(255, 255, 255, 0.08); display: flex; flex-direction: column; }
.sidebar-header { padding: 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
.project-nav { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 8px; }
.nav-item {
  padding: 12px 15px; border-radius: 12px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;
  transition: all 0.2s; border: 1px solid transparent; font-size: 14px;
}
.nav-item:hover { background: rgba(255, 255, 255, 0.05); }
.nav-item.active { background: var(--color-accent); color: black; font-weight: 700; }
.btn-trash { background: none; border: none; color: inherit; cursor: pointer; opacity: 0.6; }

.sidebar-footer { padding: 25px; border-top: 1px solid rgba(255, 255, 255, 0.05); display: flex; flex-direction: column; gap: 10px; }

.editor-main { flex: 1; display: flex; flex-direction: column; background: rgba(0, 0, 0, 0.2); }
.editor-header { padding: 15px 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); display: flex; justify-content: space-between; align-items: center; }
.lang-selector { display: flex; gap: 5px; background: rgba(255, 255, 255, 0.05); padding: 5px; border-radius: 10px; }
.lang-btn {
  padding: 6px 15px; border: none; border-radius: 8px; background: none; color: #888; font-weight: 700; font-size: 12px; cursor: pointer;
}
.lang-btn.active { background: rgba(255, 255, 255, 0.1); color: white; }

.editor-body { flex: 1; overflow-y: auto; padding: 40px; display: flex; flex-direction: column; gap: 30px; }
.section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: var(--color-accent); margin-bottom: 20px; font-weight: 800; }
.field { display: flex; flex-direction: column; gap: 8px; }
.field label { font-size: 13px; font-weight: 600; color: #aaa; }
.grid-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.divider { height: 1px; background: rgba(255, 255, 255, 0.08); margin: 10px 0; }

/* INPUTS & BUTTONS */
.custom-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px; padding: 12px 15px; color: white; outline: none; transition: all 0.3s;
}
.custom-input:focus { border-color: var(--color-accent); background: rgba(255, 255, 255, 0.08); }

.btn-accent { background: var(--color-accent); color: black; border: none; padding: 12px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; }
.btn-accent:hover { transform: scale(1.02); }
.btn-accent:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary { background: rgba(255, 255, 255, 0.05); color: white; border: none; padding: 12px 25px; border-radius: 12px; cursor: pointer; }
.btn-add { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.2); background: none; color: white; cursor: pointer; }
.btn-logout { background: none; border: none; color: #666; font-size: 12px; cursor: pointer; }
.btn-logout:hover { color: #ff4d4d; }

.empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #444; }
.empty-icon { font-size: 50px; margin-bottom: 20px; opacity: 0.2; }
</style>