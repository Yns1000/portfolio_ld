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
          @add-timeline="addTimelineItem"
          @delete-timeline="deleteTimelineItem"
          @add-cert="addCertItem"
          @delete-cert="deleteCertItem"
          @save="saveAll"
          @logout="handleLogout"
          @close="closePortal"
          @change-password="handleChangePassword"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import i18n from '../../i18n'
import AdminAuth from './AdminAuth.vue'
import AdminDashboard from './AdminDashboard.vue'
import AdminToast from './AdminToast.vue'

// --- DÉFINITION DES TYPES ---
interface Project {
  id: number; category: string; image: string; link: string;
  fr: any; en: any; es: any; nl: any;
}
interface TimelineItem {
  id: string; period: string; type: string;
  fr: any; en: any; es: any; nl: any;
}
interface CertItem {
  id: string; link: string;
  fr: any; en: any; es: any; nl: any;
}

interface AboutContent {
  intro_hero: string; // greeting
  name_hero: string;  // intro
  bio_hero: string;   // bio
  btn_prj: string;    // btn_projects
  btn_abt: string;    // btn_about
  intro: string;      // about_intro
  text: string;       // about_text
  hobbies: string[];
}

interface AboutData {
  fr: AboutContent;
  en: AboutContent;
  es: AboutContent;
  nl: AboutContent;
  timeline: TimelineItem[];
  certifications: CertItem[];
  selected_palette: number;
}

// --- ÉTATS RÉACTIFS ---
const emit = defineEmits(['close']);
const isMounted = ref(false);
const isAuthenticated = ref(false)
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const passwordValue = ref('')
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })

const createEmptyAboutContent = (): AboutContent => ({
  intro_hero: '', name_hero: '', bio_hero: '', btn_prj: '', btn_abt: '',
  intro: '', text: '', hobbies: []
})

const localAbout = reactive<AboutData>({
  fr: createEmptyAboutContent(),
  en: createEmptyAboutContent(),
  es: createEmptyAboutContent(),
  nl: createEmptyAboutContent(),
  timeline: [],
  certifications: [],
  selected_palette: 1
});
const localProjects = ref<Project[]>([]);

// --- APERÇU DES COULEURS EN TEMPS RÉEL ---
watch(() => localAbout.selected_palette, (newVal) => {
  document.documentElement.setAttribute('data-palette', newVal.toString());
});

// --- GESTION DE LA SESSION (LocalStorage) ---
const checkSession = async () => {
  const savedKey = localStorage.getItem('laurine_portfolio_token');
  if (savedKey) {
    try {
      const res = await fetch('/api/manage-content', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: savedKey, action: 'login' })
      });
      if (res.ok) {
        passwordValue.value = savedKey;
        isAuthenticated.value = true;
      } else {
        localStorage.removeItem('laurine_portfolio_token');
      }
    } catch (e) {
      console.error("Erreur de session persistante");
    }
  }
};

const handleLogout = () => {
  isAuthenticated.value = false;
  passwordValue.value = '';
  localStorage.removeItem('laurine_portfolio_token');
  triggerToast('Session terminée');
};

// --- CHARGEMENT DES DONNÉES DEPUIS LES JSON ---
const initData = () => {
  try {
    const langs = ['fr', 'en', 'es', 'nl'] as const;
    const frMsg = i18n.global.getLocaleMessage('fr') as any;

    // Charger la palette
    localAbout.selected_palette = frMsg.theme_palette || 1;

    // Textes fixes par langue
    langs.forEach(l => {
      const msg = i18n.global.getLocaleMessage(l) as any;
      if (msg) {
        localAbout[l].intro_hero = msg.greeting || '';
        localAbout[l].name_hero = msg.intro || '';
        localAbout[l].bio_hero = msg.bio || '';
        localAbout[l].btn_prj = msg.btn_projects || '';
        localAbout[l].btn_abt = msg.btn_about || '';
        localAbout[l].intro = msg.about_intro || '';
        localAbout[l].text = msg.about_text || '';
        localAbout[l].hobbies = Array.isArray(msg.hobbies) ? [...msg.hobbies] : [];
      }
    });

    // Timeline
    const frTimeline = frMsg.timeline_list || [];
    localAbout.timeline = frTimeline.map((item: any, i: number) => {
      const obj: any = { id: 'time-' + i, period: item.period || '', type: item.type || 'edu' };
      langs.forEach(l => {
        const langItem = (i18n.global.getLocaleMessage(l) as any).timeline_list?.[i] || {};
        obj[l] = { title: langItem.title || '', desc: langItem.desc || '' };
      });
      return obj;
    });

    // Certifs
    const frCerts = frMsg.cert_list || [];
    localAbout.certifications = frCerts.map((cert: any, i: number) => {
      const obj: any = { id: 'cert-' + i, link: cert.link || '' };
      langs.forEach(l => {
        const langCert = (i18n.global.getLocaleMessage(l) as any).cert_list?.[i] || {};
        obj[l] = { name: langCert.name || '', school: langCert.school || '' };
      });
      return obj;
    });

    // Projets
    const getProj = (lang: string) => (i18n.global.getLocaleMessage(lang) as any)?.projects_list || [];
    localProjects.value = getProj('fr').map((p: any, i: number) => ({
      id: p.id || Date.now() + i,
      category: p.category || 'manage',
      image: p.image || '',
      link: p.link || '',
      fr: { title: p.title || '', desc: p.desc || '' },
      en: { title: getProj('en')[i]?.title || '', desc: getProj('en')[i]?.desc || '' },
      es: { title: getProj('es')[i]?.title || '', desc: getProj('es')[i]?.desc || '' },
      nl: { title: getProj('nl')[i]?.title || '', desc: getProj('nl')[i]?.desc || '' }
    }));

  } catch (err) { console.error("Erreur d'initialisation :", err); }
};

onMounted(async () => {
  initData();
  await checkSession();
  isMounted.value = true;
});

// --- ACTIONS CLÉS ---
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
      localStorage.setItem('laurine_portfolio_token', pwd);
      triggerToast('Bienvenue Laurine !');
    } else { loginError.value = "Clé incorrecte"; }
  } catch (e) { loginError.value = "Erreur de connexion"; }
  finally { isLoggingIn.value = false; }
};

const handleChangePassword = async (newPwd: string) => {
  isSaving.value = true;
  try {
    const res = await fetch('/api/manage-content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordValue.value, action: 'change-password', newPassword: newPwd })
    });
    if (res.ok) {
      passwordValue.value = newPwd;
      localStorage.setItem('laurine_portfolio_token', newPwd);
      triggerToast('Clé d\'accès modifiée');
    } else { triggerToast('Échec du changement', 'error'); }
  } catch (e) { triggerToast('Erreur réseau', 'error'); }
  finally { isSaving.value = false; }
};

const closePortal = () => emit('close');

// --- GESTION DES LISTES DYNAMIQUES ---
const addNewProject = () => {
  localProjects.value.push({ id: Date.now(), category: 'manage', image: '', link: '', fr: {title:'', desc:''}, en: {title:'', desc:''}, es: {title:'', desc:''}, nl: {title:'', desc:''} });
}
const deleteProject = (idx: number) => { if (confirm("Supprimer ce projet ?")) localProjects.value.splice(idx, 1); }

const addTimelineItem = () => {
  localAbout.timeline.unshift({
    id: Date.now().toString(), period: '', type: 'edu',
    fr: { title: '', desc: '' }, en: { title: '', desc: '' },
    es: { title: '', desc: '' }, nl: { title: '', desc: '' }
  });
}
const deleteTimelineItem = (idx: number) => { if (confirm("Supprimer cette étape ?")) localAbout.timeline.splice(idx, 1); }

const addCertItem = () => {
  localAbout.certifications.unshift({
    id: Date.now().toString(), link: '',
    fr: { name: '', school: '' }, en: { name: '', school: '' },
    es: { name: '', school: '' }, nl: { name: '', school: '' }
  });
}
const deleteCertItem = (idx: number) => { if (confirm("Supprimer ce certificat ?")) localAbout.certifications.splice(idx, 1); }

// --- SAUVEGARDE GLOBALE ---
const saveAll = async () => {
  isSaving.value = true
  try {
    const payloads: any = {}
    const langs = ['fr', 'en', 'es', 'nl'] as const;

    langs.forEach(l => {
      const full = JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(l)));

      // Sync thèmes
      full.theme_palette = localAbout.selected_palette;

      // Sync Projets
      full.projects_list = localProjects.value.map(p => ({
        id: p.id, category: p.category, image: p.image, link: p.link, title: p[l].title, desc: p[l].desc
      }));

      // Sync Hero
      full.greeting = localAbout[l].intro_hero;
      full.intro = localAbout[l].name_hero;
      full.bio = localAbout[l].bio_hero;
      full.btn_projects = localAbout[l].btn_prj;
      full.btn_about = localAbout[l].btn_abt;

      // Sync À Propos
      full.about_intro = localAbout[l].intro;
      full.about_text = localAbout[l].text;
      full.hobbies = localAbout[l].hobbies;

      // Sync Timeline
      full.timeline_list = localAbout.timeline.map(item => ({
        period: item.period, type: item.type, title: item[l].title, desc: item[l].desc
      }));

      // Sync Certifications
      full.cert_list = localAbout.certifications.map(cert => ({
        name: cert[l].name, school: cert[l].school, link: cert.link
      }));

      payloads[l] = full;
    });

    const res = await fetch('/api/manage-content', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: passwordValue.value, content: payloads })
    });

    if (res.ok) {
      triggerToast('Site mis à jour avec succès !');
      setTimeout(() => window.location.reload(), 1000);
    } else {
      triggerToast('Erreur de sauvegarde', 'error');
    }
  } catch (e) { triggerToast('Erreur réseau', 'error'); }
  finally { isSaving.value = false; }
}
</script>

<style scoped>
.admin-portal-wrapper {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(4, 4, 5, 0.98);
  backdrop-filter: blur(25px);
  display: flex; align-items: center; justify-content: center;
}

.portal-fade-enter-active, .portal-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.portal-fade-enter-from, .portal-fade-leave-to {
  opacity: 0; transform: scale(1.05);
}
</style>