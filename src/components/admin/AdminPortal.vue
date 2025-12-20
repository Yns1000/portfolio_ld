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
          :about-data="localAbout"
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
import i18n from '../../i18n'
import AdminAuth from './AdminAuth.vue'
import AdminDashboard from './AdminDashboard.vue'
import AdminToast from './AdminToast.vue'

// TYPES
interface Project { id: number; category: string; image: string; link: string; fr: any; en: any; es: any; nl: any; }
interface AboutContent { intro: string; text: string; cert_name: string; cert_school: string; hobbies: string[]; }
interface AboutData { fr: AboutContent; en: AboutContent; es: AboutContent; nl: AboutContent; }

defineEmits(['close']);

// ÉTATS GLOBAUX
const isAuthenticated = ref(false)
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const passwordValue = ref('')

const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })

// INITIALISATION DES DONNÉES
const loadInitialData = () => {
  const langs = ['fr', 'en', 'es', 'nl'] as const;

  // Chargement du "About"
  const about: any = {};
  langs.forEach(l => {
    const msg = i18n.global.getLocaleMessage(l) as any;
    about[l] = {
      intro: msg.about_intro || '',
      text: msg.about_text || '',
      cert_name: msg.cert_name || '',
      cert_school: msg.cert_school || '',
      hobbies: msg.hobbies || []
    };
  });

  // Chargement des Projets
  const getProj = (lang: string) => (i18n.global.getLocaleMessage(lang) as any).projects_list || [];
  const frP = getProj('fr'); const enP = getProj('en'); const esP = getProj('es'); const nlP = getProj('nl');

  const projects = frP.map((p: any, i: number) => ({
    id: p.id || Date.now() + i, category: p.category || 'manage', image: p.image || '', link: p.link || '',
    fr: { title: p.title || '', desc: p.desc || '' },
    en: { title: enP[i]?.title || '', desc: enP[i]?.desc || '' },
    es: { title: esP[i]?.title || '', desc: esP[i]?.desc || '' },
    nl: { title: nlP[i]?.title || '', desc: nlP[i]?.desc || '' }
  }));

  return { about, projects };
}

const data = loadInitialData();
const localAbout = reactive<AboutData>(data.about);
const localProjects = ref<Project[]>(data.projects);

// ACTIONS
const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
  toast.message = msg; toast.type = type; toast.show = true;
  setTimeout(() => { toast.show = false }, 4000);
}

const handleLogin = async (pwd: string) => {
  isLoggingIn.value = true; loginError.value = '';
  try {
    const res = await fetch('/api/manage-content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd, action: 'login' })
    });
    if (res.ok) { passwordValue.value = pwd; isAuthenticated.value = true; triggerToast('Accès autorisé'); }
    else { loginError.value = "Clé invalide"; }
  } catch (e) { loginError.value = "Erreur serveur"; }
  finally { isLoggingIn.value = false; }
}

const addNewProject = () => {
  localProjects.value.push({ id: Date.now(), category: 'manage', image: '', link: '', fr: {title:'', desc:''}, en: {title:'', desc:''}, es: {title:'', desc:''}, nl: {title:'', desc:''} });
  triggerToast('Projet ajouté');
}

const deleteProject = (idx: number) => {
  localProjects.value.splice(idx, 1);
  triggerToast('Projet supprimé', 'error');
}

const saveAll = async () => {
  isSaving.value = true
  try {
    const payloads: any = {}
    const langs = ['fr', 'en', 'es', 'nl'] as const;

    langs.forEach(l => {
      const full = JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(l)));

      // Sync Projets
      full.projects_list = localProjects.value.map(p => ({
        id: p.id, category: p.category, image: p.image, link: p.link, title: (p as any)[l].title, desc: (p as any)[l].desc
      }));

      // Sync About
      full.about_intro = localAbout[l].intro;
      full.about_text = localAbout[l].text;
      full.cert_name = localAbout[l].cert_name;
      full.cert_school = localAbout[l].cert_school;
      full.hobbies = localAbout[l].hobbies;

      payloads[l] = full;
    });

    const res = await fetch('/api/manage-content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordValue.value, content: payloads })
    });
    if (res.ok) { triggerToast('Publication réussie !'); setTimeout(() => window.location.reload(), 1000); }
  } catch (e) { triggerToast('Erreur réseau', 'error'); }
  finally { isSaving.value = false; }
}
</script>
<style scoped>
/* À ajouter dans AdminPortal.vue */
.portal-fade-enter-active, .portal-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.portal-fade-enter-from, .portal-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
  transform: scale(1.05);
}
</style>