<template>
  <Transition name="portal-fade">
    <div v-if="isMounted" class="admin-portal-wrapper">
      <AdminToast :config="toast" @close="toast.show = false" />

      <AdminAuth
          v-if="!isAuthenticated"
          :is-logging-in="isLoggingIn"
          :error-msg="loginError"
          @login="handleLogin"
          @close="closePortal"
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
          @close="closePortal"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import i18n from '../../i18n' // <-- BIEN VÉRIFIER CE CHEMIN
import AdminAuth from './AdminAuth.vue'
import AdminDashboard from './AdminDashboard.vue'
import AdminToast from './AdminToast.vue'

// TYPES
interface Project { id: number; category: string; image: string; link: string; fr: any; en: any; es: any; nl: any; }
interface AboutContent { intro: string; text: string; cert_name: string; cert_school: string; hobbies: string[]; }
interface AboutData { fr: AboutContent; en: AboutContent; es: AboutContent; nl: AboutContent; }

const emit = defineEmits(['close']);
const isMounted = ref(false);

// ÉTATS GLOBAUX
const isAuthenticated = ref(false)
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const passwordValue = ref('')
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })

// DONNÉES RÉACTIVES
const localAbout = reactive<AboutData>({
  fr: { intro: '', text: '', cert_name: '', cert_school: '', hobbies: [] },
  en: { intro: '', text: '', cert_name: '', cert_school: '', hobbies: [] },
  es: { intro: '', text: '', cert_name: '', cert_school: '', hobbies: [] },
  nl: { intro: '', text: '', cert_name: '', cert_school: '', hobbies: [] }
});
const localProjects = ref<Project[]>([]);

// INITIALISATION SÉCURISÉE
const initData = () => {
  try {
    const langs = ['fr', 'en', 'es', 'nl'] as const;

    langs.forEach(l => {
      const msg = i18n.global.getLocaleMessage(l) as any;
      if (msg) {
        // Sync About Data
        localAbout[l].intro = msg.about_intro || '';
        localAbout[l].text = msg.about_text || '';
        localAbout[l].cert_name = msg.cert_name || '';
        localAbout[l].cert_school = msg.cert_school || '';
        localAbout[l].hobbies = Array.isArray(msg.hobbies) ? [...msg.hobbies] : [];
      }
    });

    // Sync Projects Data
    const getProj = (lang: string) => (i18n.global.getLocaleMessage(lang) as any)?.projects_list || [];
    const frP = getProj('fr');
    const enP = getProj('en');
    const esP = getProj('es');
    const nlP = getProj('nl');

    localProjects.value = frP.map((p: any, i: number) => ({
      id: p.id || Date.now() + i,
      category: p.category || 'manage',
      image: p.image || '',
      link: p.link || '',
      fr: { title: p.title || '', desc: p.desc || '' },
      en: { title: enP[i]?.title || '', desc: enP[i]?.desc || '' },
      es: { title: esP[i]?.title || '', desc: esP[i]?.desc || '' },
      nl: { title: nlP[i]?.title || '', desc: nlP[i]?.desc || '' }
    }));

    console.log("Admin Portal: Données chargées avec succès");
  } catch (err) {
    console.error("Admin Portal Crash au chargement:", err);
  }
};

onMounted(() => {
  initData();
  isMounted.value = true;
});

const closePortal = () => emit('close');

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
    if (res.ok) {
      passwordValue.value = pwd;
      isAuthenticated.value = true;
      triggerToast('Accès autorisé');
    } else {
      loginError.value = "Clé invalide";
    }
  } catch (e) { loginError.value = "Erreur serveur"; }
  finally { isLoggingIn.value = false; }
}

const addNewProject = () => {
  localProjects.value.push({ id: Date.now(), category: 'manage', image: '', link: '', fr: {title:'', desc:''}, en: {title:'', desc:''}, es: {title:'', desc:''}, nl: {title:'', desc:''} });
}

const deleteProject = (idx: number) => {
  if (confirm("Supprimer ce projet ?")) localProjects.value.splice(idx, 1);
}

const saveAll = async () => {
  isSaving.value = true
  try {
    const payloads: any = {}
    const langs = ['fr', 'en', 'es', 'nl'] as const;

    langs.forEach(l => {
      const full = JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(l)));
      full.projects_list = localProjects.value.map(p => ({
        id: p.id, category: p.category, image: p.image, link: p.link, title: (p as any)[l].title, desc: (p as any)[l].desc
      }));
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
    if (res.ok) {
      triggerToast('Publication réussie !');
      setTimeout(() => window.location.reload(), 1000);
    }
  } catch (e) { triggerToast('Erreur réseau', 'error'); }
  finally { isSaving.value = false; }
}
</script>

<style scoped>
.admin-portal-wrapper {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(4, 4, 5, 0.95);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.portal-fade-enter-active, .portal-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.portal-fade-enter-from, .portal-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>