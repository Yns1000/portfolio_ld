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
          @logout="isAuthenticated = false"
          @close="closePortal"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import i18n from '../../i18n'
import AdminAuth from './AdminAuth.vue'
import AdminDashboard from './AdminDashboard.vue'
import AdminToast from './AdminToast.vue'

// --- TYPES ---
interface Project { id: number; category: string; image: string; link: string; fr: any; en: any; es: any; nl: any; }
interface TimelineItem { id: string; period: string; type: string; fr: any; en: any; es: any; nl: any; }
interface CertItem { id: string; link: string; fr: any; en: any; es: any; nl: any; }

interface AboutContent { intro: string; text: string; hobbies: string[]; }
interface AboutData {
  fr: AboutContent;
  en: AboutContent;
  es: AboutContent;
  nl: AboutContent;
  timeline: TimelineItem[];
  certifications: CertItem[];
}

const emit = defineEmits(['close']);
const isMounted = ref(false);

// --- ÉTATS GLOBAUX ---
const isAuthenticated = ref(false)
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const passwordValue = ref('')
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })

const localAbout = reactive<AboutData>({
  fr: { intro: '', text: '', hobbies: [] },
  en: { intro: '', text: '', hobbies: [] },
  es: { intro: '', text: '', hobbies: [] },
  nl: { intro: '', text: '', hobbies: [] },
  timeline: [],
  certifications: []
});
const localProjects = ref<Project[]>([]);

// --- LOGIQUE DE CHARGEMENT ---
const initData = () => {
  try {
    const langs = ['fr', 'en', 'es', 'nl'] as const;

    // 1. Textes fixes (Intro, Bio, Hobbies)
    langs.forEach(l => {
      const msg = i18n.global.getLocaleMessage(l) as any;
      if (msg) {
        localAbout[l].intro = msg.about_intro || '';
        localAbout[l].text = msg.about_text || '';
        localAbout[l].hobbies = Array.isArray(msg.hobbies) ? [...msg.hobbies] : [];
      }
    });

    // 2. Timeline dynamique
    const frMsg = i18n.global.getLocaleMessage('fr') as any;
    const frTimeline = frMsg.timeline_list || [];
    localAbout.timeline = frTimeline.map((item: any, i: number) => {
      const obj: any = { id: Date.now().toString() + i, period: item.period || '', type: item.type || 'edu' };
      langs.forEach(l => {
        const langMsg = i18n.global.getLocaleMessage(l) as any;
        const langItem = langMsg.timeline_list?.[i] || {};
        obj[l] = { title: langItem.title || '', desc: langItem.desc || '' };
      });
      return obj;
    });

    // 3. Certifications dynamiques (Nouveau)
    const frCerts = frMsg.cert_list || [];
    localAbout.certifications = frCerts.map((cert: any, i: number) => {
      const obj: any = { id: 'cert-' + i, link: cert.link || '' };
      langs.forEach(l => {
        const langMsg = i18n.global.getLocaleMessage(l) as any;
        const langCert = langMsg.cert_list?.[i] || {};
        obj[l] = { name: langCert.name || '', school: langCert.school || '' };
      });
      return obj;
    });

    // 4. Projets
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

  } catch (err) { console.error("Init Error:", err); }
};

onMounted(() => { initData(); isMounted.value = true; });

// --- ACTIONS ---
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

const closePortal = () => emit('close');

// --- GESTION DES ITEMS ---
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
const deleteTimelineItem = (idx: number) => { if (confirm("Supprimer cet événement ?")) localAbout.timeline.splice(idx, 1); }

const addCertItem = () => {
  localAbout.certifications.unshift({
    id: Date.now().toString(), link: '',
    fr: { name: '', school: '' }, en: { name: '', school: '' },
    es: { name: '', school: '' }, nl: { name: '', school: '' }
  });
}
const deleteCertItem = (idx: number) => { if (confirm("Supprimer cette certification ?")) localAbout.certifications.splice(idx, 1); }

// --- SAUVEGARDE FINALE ---
const saveAll = async () => {
  isSaving.value = true
  try {
    const payloads: any = {}
    const langs = ['fr', 'en', 'es', 'nl'] as const;

    langs.forEach(l => {
      const full = JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(l)));

      // Sync Projets
      full.projects_list = localProjects.value.map(p => ({
        id: p.id, category: p.category, image: p.image, link: p.link, title: p[l].title, desc: p[l].desc
      }));

      // Sync About Fixes
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
    if (res.ok) { triggerToast('Publication réussie !'); setTimeout(() => window.location.reload(), 1000); }
  } catch (e) { triggerToast('Erreur réseau', 'error'); }
  finally { isSaving.value = false; }
}
</script>

<style scoped>
.admin-portal-wrapper {
  position: fixed; inset: 0; z-index: 99999;
  background: rgba(4, 4, 5, 0.95);
  backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center;
}
.portal-fade-enter-active, .portal-fade-leave-active { transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1); }
.portal-fade-enter-from, .portal-fade-leave-to { opacity: 0; transform: scale(1.05); }
</style>