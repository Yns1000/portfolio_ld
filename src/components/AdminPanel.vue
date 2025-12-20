<template>
  <div class="admin-wrapper">
    <div v-if="!isAuthenticated" class="auth-container">
      <div class="shad-card login-card">
        <div class="card-header">
          <h2>Administration</h2>
          <p>Entrez votre mot de passe pour gérer les projets.</p>
        </div>
        <div class="card-content">
          <input
              v-model="password"
              type="password"
              placeholder="Mot de passe"
              class="shad-input"
              @keyup.enter="handleLogin"
          />
          <div class="card-footer">
            <button @click="$emit('close')" class="shad-btn btn-ghost">Annuler</button>
            <button @click="handleLogin" class="shad-btn btn-primary">Connexion</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="dashboard-container shad-card">
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>Projets</h3>
          <button @click="addNewProject" class="shad-btn btn-outline btn-sm">+ Nouveau</button>
        </div>
        <div class="project-list">
          <div
              v-for="(proj, index) in localProjects"
              :key="index"
              class="project-item"
              :class="{ active: currentIdx === index }"
              @click="currentIdx = index"
          >
            <span class="proj-title-nav">{{ proj.fr.title || 'Projet sans titre' }}</span>
            <button @click.stop="deleteProject(index)" class="delete-icon">✕</button>
          </div>
        </div>
        <div class="sidebar-actions">
          <button @click="saveAll" :disabled="isSaving" class="shad-btn btn-primary w-full">
            {{ isSaving ? 'Enregistrement...' : '🚀 Publier les changements' }}
          </button>
          <button @click="isAuthenticated = false" class="shad-btn btn-ghost btn-sm w-full">Déconnexion</button>
        </div>
      </aside>

      <main class="editor-main">
        <header class="editor-header">
          <div v-if="currentIdx !== null" class="lang-tabs">
            <button
                v-for="l in ['fr', 'en', 'es', 'nl']"
                :key="l"
                class="tab-btn"
                :class="{ active: editLang === l }"
                @click="editLang = l"
            >
              {{ l.toUpperCase() }}
            </button>
          </div>
          <button @click="$emit('close')" class="close-x">✕</button>
        </header>

        <div v-if="currentIdx !== null" class="editor-body">
          <section class="form-section">
            <h4 class="section-label">Contenu traduit ({{ editLang.toUpperCase() }})</h4>
            <div class="field-group">
              <label>Titre du projet</label>
              <input v-model="localProjects[currentIdx][editLang].title" placeholder="Ex: Nego Chine" class="shad-input" />
            </div>
            <div class="field-group">
              <label>Description</label>
              <textarea v-model="localProjects[currentIdx][editLang].desc" rows="5" class="shad-input" placeholder="Décrivez le projet..."></textarea>
            </div>
          </section>

          <hr class="shad-divider" />

          <section class="form-section">
            <h4 class="section-label">Paramètres généraux (Communs)</h4>
            <div class="grid-2">
              <div class="field-group">
                <label>Catégorie</label>
                <select v-model="localProjects[currentIdx].category" class="shad-input">
                  <option value="manage">Gestion</option>
                  <option value="trans">Intercultural</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
              <div class="field-group">
                <label>Lien du projet (URL)</label>
                <input v-model="localProjects[currentIdx].link" placeholder="https://..." class="shad-input" />
              </div>
            </div>
            <div class="field-group mt-4">
              <label>URL de l'image (Unsplash)</label>
              <input v-model="localProjects[currentIdx].image" placeholder="https://images.unsplash.com/..." class="shad-input" />
            </div>
          </section>
        </div>

        <div v-else class="empty-editor">
          <p>Sélectionnez un projet dans la liste pour commencer l'édition ou créez-en un nouveau.</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import i18n from '../i18n'

const emit = defineEmits(['close'])

const isAuthenticated = ref(false)
const password = ref('')
const isSaving = ref(false)
const editLang = ref('fr')
const currentIdx = ref(null)

// 1. Charger et fusionner les données des 4 langues pour faciliter l'édition
const loadProjectsFromI18n = () => {
  const fr = i18n.global.getLocaleMessage('fr').projects_list || []
  const en = i18n.global.getLocaleMessage('en').projects_list || []
  const es = i18n.global.getLocaleMessage('es').projects_list || []
  const nl = i18n.global.getLocaleMessage('nl').projects_list || []

  // On crée un tableau d'objets où chaque objet contient les infos communes + les 4 langues
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

const localProjects = ref(loadProjectsFromI18n())

const handleLogin = () => {
  if (password.value) isAuthenticated.value = true
}

const addNewProject = () => {
  localProjects.value.push({
    id: Date.now(),
    category: 'manage',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    link: '#',
    fr: { title: '', desc: '' },
    en: { title: '', desc: '' },
    es: { title: '', desc: '' },
    nl: { title: '', desc: '' }
  })
  currentIdx.value = localProjects.value.length - 1
}

const deleteProject = (index) => {
  if (confirm('Supprimer ce projet définitivement ?')) {
    localProjects.value.splice(index, 1)
    if (currentIdx.value === index) currentIdx.value = null
  }
}

const saveAll = async () => {
  isSaving.value = true
  try {
    const langs = ['fr', 'en', 'es', 'nl']
    const finalPayload = {}

    // Reconstruire les fichiers JSON complets pour chaque langue
    langs.forEach(lang => {
      // On récupère TOUT le fichier actuel pour ne pas perdre les autres clés (bio, intro, etc.)
      const currentFullFile = JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(lang)))

      // On remplace juste la liste des projets
      currentFullFile.projects_list = localProjects.value.map(p => ({
        id: p.id,
        category: p.category,
        image: p.image,
        link: p.link,
        title: p[lang].title,
        desc: p[lang].desc
      }))

      finalPayload[lang] = currentFullFile
    })

    const res = await fetch('/api/manage-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: password.value, content: finalPayload })
    })

    if (res.ok) {
      alert("✅ Le site a été mis à jour avec succès !")
      window.location.reload()
    } else {
      alert("❌ Erreur lors de la sauvegarde (Vérifiez le mot de passe).")
    }
  } catch (error) {
    alert("❌ Erreur réseau.")
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
/* SHADCN THEME & UTILS */
.admin-wrapper {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Inter', system-ui, sans-serif;
  color: #09090b;
}

.shad-card {
  background: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
}

.shad-input {
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e4e4e7;
  background: transparent;
  font-size: 14px;
  transition: border-color 0.2s;
}
.shad-input:focus { outline: none; border-color: #09090b; ring: 1px solid #09090b; }

.shad-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s, background 0.2s;
  border: 1px solid transparent;
}
.btn-primary { background: #18181b; color: #ffffff; }
.btn-primary:hover { opacity: 0.9; }
.btn-outline { background: transparent; border: 1px solid #e4e4e7; color: #09090b; }
.btn-outline:hover { background: #f4f4f5; }
.btn-ghost { background: transparent; color: #71717a; border: none; }
.btn-ghost:hover { background: #f4f4f5; color: #09090b; }
.btn-sm { padding: 4px 8px; font-size: 12px; }
.w-full { width: 100%; }

/* LAYOUTS */
.auth-container { width: 400px; }
.card-header { padding: 24px; text-align: center; }
.card-header h2 { font-size: 24px; font-weight: 600; }
.card-header p { font-size: 14px; color: #71717a; margin-top: 4px; }
.card-content { padding: 0 24px 24px 24px; display: flex; flex-direction: column; gap: 16px; }
.card-footer { display: flex; justify-content: flex-end; gap: 8px; }

.dashboard-container {
  width: 95vw; max-width: 1100px; height: 85vh;
  display: flex; overflow: hidden;
}

/* SIDEBAR */
.sidebar {
  width: 280px; border-right: 1px solid #e4e4e7;
  display: flex; flex-direction: column; background: #fafafa;
}
.sidebar-header { padding: 16px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e4e4e7; }
.project-list { flex: 1; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
.project-item {
  padding: 10px 12px; border-radius: 6px; cursor: pointer;
  font-size: 14px; display: flex; justify-content: space-between; align-items: center;
}
.project-item:hover { background: #f4f4f5; }
.project-item.active { background: #18181b; color: #ffffff; }
.delete-icon { background: none; border: none; color: #ef4444; cursor: pointer; opacity: 0.5; font-size: 16px; }
.delete-icon:hover { opacity: 1; }
.sidebar-actions { padding: 16px; border-top: 1px solid #e4e4e7; display: flex; flex-direction: column; gap: 8px; }

/* EDITOR */
.editor-main { flex: 1; display: flex; flex-direction: column; background: #fff; }
.editor-header { padding: 12px 24px; border-bottom: 1px solid #e4e4e7; display: flex; justify-content: space-between; align-items: center; }
.lang-tabs { display: flex; gap: 4px; }
.tab-btn {
  padding: 6px 12px; border-radius: 4px; border: none; background: transparent;
  font-size: 12px; font-weight: 600; color: #71717a; cursor: pointer;
}
.tab-btn.active { background: #18181b; color: #fff; }
.close-x { font-size: 20px; color: #71717a; background: none; border: none; cursor: pointer; }

.editor-body { flex: 1; overflow-y: auto; padding: 32px; display: flex; flex-direction: column; gap: 32px; }
.section-label { font-size: 12px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-group label { font-size: 13px; font-weight: 500; }
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.mt-4 { margin-top: 16px; }
.shad-divider { border: none; border-top: 1px solid #e4e4e7; }
.empty-editor { flex: 1; display: flex; align-items: center; justify-content: center; color: #71717a; text-align: center; padding: 40px; }
</style>