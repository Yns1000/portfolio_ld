<template>
  <Transition name="portal-fade">
    <div class="admin-portal-wrapper">
      <AdminToast :config="toast" @close="toast.show = false" />

      <AdminAuth
          v-if="!isAuthenticated"
          :is-logging-in="isLoggingIn"
          :error-msg="loginError"
          @login="handleLogin"
          @close="$emit('close')"
      />

      <AdminDashboard
          v-else
          :projects="localProjects"
          :is-saving="isSaving"
          @add="addNewProject"
          @delete="deleteProject"
          @save="saveAll"
          @logout="isAuthenticated = false"
          @close="$emit('close')"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import i18n from '../i18n'
import AdminAuth from './AdminAuth.vue'
import AdminDashboard from './AdminDashboard.vue'
import AdminToast from './AdminToast.vue'

// TYPES
interface Project { id: number; category: string; image: string; link: string; fr: any; en: any; es: any; nl: any; }

const emit = defineEmits(['close'])

// ÉTATS GLOBAUX
const isAuthenticated = ref(false)
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const passwordValue = ref('') // Stocké pour les requêtes de sauvegarde

// TOAST LOGIC
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })
const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.message = msg
  toast.type = type
  toast.show = true
  setTimeout(() => { toast.show = false }, 4000)
}

// DATA MANAGEMENT
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

// API ACTIONS
const handleLogin = async (pwd: string) => {
  isLoggingIn.value = true
  loginError.value = ''
  try {
    const res = await fetch('/api/manage-content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd, action: 'login' })
    })
    if (res.ok) {
      passwordValue.value = pwd
      isAuthenticated.value = true
      triggerToast('Accès autorisé')
    } else {
      loginError.value = "Clé invalide"
    }
  } catch (e) { loginError.value = "Erreur serveur" }
  finally { isLoggingIn.value = false }
}

const addNewProject = () => {
  const newProj = { id: Date.now(), category: 'manage', image: '', link: '', fr: {title:'', desc:''}, en: {title:'', desc:''}, es: {title:'', desc:''}, nl: {title:'', desc:''} }
  localProjects.value.push(newProj)
  triggerToast('Projet ajouté')
}

const deleteProject = (idx: number) => {
  localProjects.value.splice(idx, 1)
  triggerToast('Projet supprimé', 'error')
}

const saveAll = async () => {
  isSaving.value = true
  try {
    const payloads: any = {}
    const langs = ['fr', 'en', 'es', 'nl']
    langs.forEach(l => {
      const full = JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(l)))
      full.projects_list = localProjects.value.map(p => ({
        id: p.id, category: p.category, image: p.image, link: p.link, title: (p as any)[l].title, desc: (p as any)[l].desc
      }))
      payloads[l] = full
    })
    const res = await fetch('/api/manage-content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordValue.value, content: payloads })
    })
    if (res.ok) {
      triggerToast('Publication réussie !')
      setTimeout(() => window.location.reload(), 1000)
    }
  } catch (e) { triggerToast('Erreur réseau', 'error') }
  finally { isSaving.value = false }
}
</script>

<style scoped>
.admin-portal-wrapper {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(4, 4, 5, 0.95);
  backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center;
  color: #edeeef; font-family: 'Inter', sans-serif;
}
.portal-fade-enter-active, .portal-fade-leave-active { transition: all 0.5s ease; }
.portal-fade-enter-from, .portal-fade-leave-to { opacity: 0; transform: scale(1.05); }
</style>