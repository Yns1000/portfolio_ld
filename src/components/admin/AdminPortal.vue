<template>
  <Transition name="portal-fade">
    <div v-if="isMounted" class="admin-portal-wrapper">
      <AdminToast :config="toast" @close="toast.show = false" />

      <Transition name="modal-bounce">
        <div v-if="confirmModal.show" class="confirm-modal-overlay">
          <div class="confirm-modal-card">
            <div class="modal-header">
              <div class="header-icon" :class="confirmModal.mode">
                <AlertCircle v-if="confirmModal.mode === 'close'" :size="24" />
                <CloudUpload v-else :size="24" />
              </div>
              <h3>{{ confirmModal.title }}</h3>
            </div>

            <div class="modal-body">
              <p>{{ confirmModal.message }}</p>
              <div class="changes-list custom-scrollbar">
                <div v-for="(change, idx) in confirmModal.changes" :key="idx" class="change-item">
                  <span class="bullet">•</span> {{ change }}
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button @click="confirmModal.show = false" class="btn-cancel">Annuler</button>
              <button @click="executeModalAction" :class="['btn-confirm', confirmModal.mode]">
                {{ confirmModal.confirmLabel }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <div v-if="isMobile" class="mobile-blocker">
        <div class="blocker-content">
          <Monitor :size="48" class="icon-accent mb-20" />
          <h2>Console réservée aux ordinateurs</h2>
          <p>L'administration est optimisée pour les écrans larges.</p>
          <button @click="closePortal" class="btn-close-mobile mt-24">Retour au site</button>
        </div>
      </div>

      <AdminAuth
          v-else-if="!isAuthenticated"
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
          @save="openSaveConfirm"
          @logout="handleLogout"
          @close="closePortal"
          @change-password="handleChangePassword"
          @cv-uploaded="handleCVUpload"  />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import i18n from '../../i18n'
import AdminAuth from './AdminAuth.vue'
import AdminDashboard from './AdminDashboard.vue'
import AdminToast from './AdminToast.vue'
import { Monitor, AlertCircle, CloudUpload } from 'lucide-vue-next'

// --- INTERFACES ---
interface Project { id: number; category: string; image: string; link: string; fr: any; en: any; es: any; nl: any; }
interface TimelineItem { id: string; period: string; type: string; fr: any; en: any; es: any; nl: any; }
interface CertItem { id: string; link: string; fr: any; en: any; es: any; nl: any; }
interface AboutContent { intro_hero: string; name_hero: string; bio_hero: string; btn_prj: string; btn_abt: string; btn_cv: string; cv_link: string; intro: string; text: string; fluent_sentence: string; hobbies: string[]; }
interface AboutData { fr: AboutContent; en: AboutContent; es: AboutContent; nl: AboutContent; timeline: TimelineItem[]; certifications: CertItem[]; selected_palette: number; }

// --- ÉTATS ---
const emit = defineEmits(['close']);
const isMounted = ref(false);
const isMobile = ref(false);
const isAuthenticated = ref(false)
const isLoggingIn = ref(false)
const isSaving = ref(false)
const loginError = ref('')
const passwordValue = ref('')
const toast = reactive({ show: false, message: '', type: 'success' as 'success' | 'error' })

const initialSnapshot = ref('');

// --- MODAL CONFIG ---
const confirmModal = reactive({
  show: false, mode: 'save' as 'save' | 'close', title: '', message: '', confirmLabel: '', changes: [] as string[]
});

const createEmptyAboutContent = (): AboutContent => ({
  intro_hero: '', name_hero: '', bio_hero: '', btn_prj: '', btn_abt: '',
  btn_cv: '', cv_link: '', intro: '', text: '', fluent_sentence: '', hobbies: []
})

const localAbout = reactive<AboutData>({
  fr: createEmptyAboutContent(), en: createEmptyAboutContent(), es: createEmptyAboutContent(), nl: createEmptyAboutContent(),
  timeline: [], certifications: [], selected_palette: 1
});
const localProjects = ref<Project[]>([]);

// --- LOGIQUE DE DÉTECTION GRANULAIRE ---
const getDetailedChanges = () => {
  if (!initialSnapshot.value) return [];
  const old = JSON.parse(initialSnapshot.value);
  const changes: string[] = [];

  // 1. Projets
  if (old.projects.length !== localProjects.value.length) changes.push(`Nombre de projets (${old.projects.length} → ${localProjects.value.length})`);
  else if (JSON.stringify(old.projects) !== JSON.stringify(localProjects.value)) changes.push("Détails des projets (images, liens ou titres)");

  // 2. Thème
  if (old.about.selected_palette !== localAbout.selected_palette) changes.push("Thème visuel du portfolio");

  // 3. Langues
  ['fr', 'en', 'es', 'nl'].forEach(l => {
    const o = old.about[l];
    const n = (localAbout as any)[l];
    if (o.bio_hero !== n.bio_hero) changes.push(`Bio d'accueil (${l.toUpperCase()})`);
    if (o.text !== n.text) changes.push(`Biographie complète (${l.toUpperCase()})`);
    if (o.cv_link !== n.cv_link) changes.push(`Fichier du CV (${l.toUpperCase()})`);
    if (o.btn_cv !== n.btn_cv) changes.push(`Libellé bouton CV (${l.toUpperCase()})`);
    if (JSON.stringify(o.hobbies) !== JSON.stringify(n.hobbies)) changes.push(`Liste des passions (${l.toUpperCase()})`);
  });

  // 4. Timeline & Certs
  if (JSON.stringify(old.about.timeline) !== JSON.stringify(localAbout.timeline)) changes.push("Parcours professionnel / Études");
  if (JSON.stringify(old.about.certifications) !== JSON.stringify(localAbout.certifications)) changes.push("Certifications & Badges");

  return changes;
};

// --- ACTIONS MODAL ---
const openSaveConfirm = () => {
  const changes = getDetailedChanges();
  if (changes.length === 0) return triggerToast("Aucune modification détectée", "error");

  confirmModal.mode = 'save';
  confirmModal.title = "Publier les modifications";
  confirmModal.message = "Les changements suivants vont être appliqués sur ton site en direct :";
  confirmModal.confirmLabel = "Mettre à jour le site";
  confirmModal.changes = changes;
  confirmModal.show = true;
};

const closePortal = () => {
  const changes = getDetailedChanges();
  if (changes.length > 0) {
    confirmModal.mode = 'close';
    confirmModal.title = "Modifications non enregistrées";
    confirmModal.message = "Attention Laurine, tu vas perdre les changements suivants si tu fermes maintenant :";
    confirmModal.confirmLabel = "Quitter et tout perdre";
    confirmModal.changes = changes;
    confirmModal.show = true;
  } else {
    emit('close');
  }
};

const executeModalAction = () => {
  confirmModal.show = false;
  if (confirmModal.mode === 'save') saveAll();
  else emit('close');
};

const updateSnapshot = () => {
  initialSnapshot.value = JSON.stringify({ about: localAbout, projects: localProjects.value });
};

// --- INITIALISATION & API ---
const initData = () => {
  try {
    const langs = ['fr', 'en', 'es', 'nl'] as const;
    const frMsg = i18n.global.getLocaleMessage('fr') as any;
    localAbout.selected_palette = frMsg.theme_palette || 1;

    langs.forEach(l => {
      const msg = i18n.global.getLocaleMessage(l) as any;
      if (msg) {
        localAbout[l].intro_hero = msg.greeting || '';
        localAbout[l].name_hero = msg.intro || '';
        localAbout[l].bio_hero = msg.bio || '';
        localAbout[l].btn_prj = msg.btn_projects || '';
        localAbout[l].btn_abt = msg.btn_about || '';
        localAbout[l].btn_cv = msg.btn_cv || '';
        localAbout[l].cv_link = msg.cv_link || '';
        localAbout[l].intro = msg.about_intro || '';
        localAbout[l].text = msg.about_text || '';
        localAbout[l].fluent_sentence = msg.fluent_sentence || '';
        localAbout[l].hobbies = Array.isArray(msg.hobbies) ? [...msg.hobbies] : [];
      }
    });

    localAbout.timeline = (frMsg.timeline_list || []).map((item: any, i: number) => {
      const obj: any = { id: 'time-' + i, period: item.period || '', type: item.type || 'edu' };
      langs.forEach(l => {
        const langItem = (i18n.global.getLocaleMessage(l) as any).timeline_list?.[i] || {};
        obj[l] = { title: langItem.title || '', desc: langItem.desc || '' };
      });
      return obj;
    });

    localAbout.certifications = (frMsg.cert_list || []).map((cert: any, i: number) => {
      const obj: any = { id: 'cert-' + i, link: cert.link || '' };
      langs.forEach(l => {
        const langCert = (i18n.global.getLocaleMessage(l) as any).cert_list?.[i] || {};
        obj[l] = { name: langCert.name || '', school: langCert.school || '' };
      });
      return obj;
    });

    const getProj = (lang: string) => (i18n.global.getLocaleMessage(lang) as any)?.projects_list || [];
    localProjects.value = getProj('fr').map((p: any, i: number) => ({
      id: p.id || Date.now() + i, category: p.category || 'manage', image: p.image || '', link: p.link || '',
      fr: { title: p.title || '', desc: p.desc || '' },
      en: { title: getProj('en')[i]?.title || '', desc: getProj('en')[i]?.desc || '' },
      es: { title: getProj('es')[i]?.title || '', desc: getProj('es')[i]?.desc || '' },
      nl: { title: getProj('nl')[i]?.title || '', desc: getProj('nl')[i]?.desc || '' }
    }));

    setTimeout(updateSnapshot, 500);
  } catch (err) { console.error("Erreur init :", err); }
};

const saveAll = async () => {
  isSaving.value = true
  try {
    const payloads: any = {}
    const langs = ['fr', 'en', 'es', 'nl'] as const;
    langs.forEach(l => {
      const full = JSON.parse(JSON.stringify(i18n.global.getLocaleMessage(l)));
      full.theme_palette = localAbout.selected_palette;
      full.projects_list = localProjects.value.map(p => ({ id: p.id, category: p.category, image: p.image, link: p.link, title: p[l].title, desc: p[l].desc }));
      full.greeting = localAbout[l].intro_hero;
      full.intro = localAbout[l].name_hero;
      full.bio = localAbout[l].bio_hero;
      full.btn_projects = localAbout[l].btn_prj;
      full.btn_about = localAbout[l].btn_abt;
      full.btn_cv = localAbout[l].btn_cv;
      full.cv_link = localAbout[l].cv_link;
      full.about_intro = localAbout[l].intro;
      full.about_text = localAbout[l].text;
      full.fluent_sentence = localAbout[l].fluent_sentence;
      full.hobbies = localAbout[l].hobbies;
      full.timeline_list = localAbout.timeline.map(item => ({ period: item.period, type: item.type, title: item[l].title, desc: item[l].desc }));
      full.cert_list = localAbout.certifications.map(cert => ({ name: cert[l].name, school: cert[l].school, link: cert.link }));
      payloads[l] = full;
    });

    const res = await fetch('/api/manage-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: passwordValue.value, content: payloads }) });
    if (res.ok) { triggerToast('Site mis à jour !'); updateSnapshot(); setTimeout(() => window.location.reload(), 1000); }
    else triggerToast('Erreur sauvegarde', 'error');
  } catch (e) { triggerToast('Erreur réseau', 'error'); }
  finally { isSaving.value = false; }
};

// --- RESTE DU SCRIPT ---
onMounted(async () => { checkDevice(); window.addEventListener('resize', checkDevice); initData(); await checkSession(); isMounted.value = true; });
const handleCVUpload = async ({ file, lang }: { file: File, lang: string }) => { isSaving.value = true; const reader = new FileReader(); reader.readAsDataURL(file); reader.onload = async () => { try { const res = await fetch('/api/manage-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: passwordValue.value, action: 'upload-cv', lang, fileData: reader.result }) }); if (res.ok) { const data = await res.json(); (localAbout as any)[lang].cv_link = data.filePath; triggerToast(`CV ${lang.toUpperCase()} enregistré.`); } } catch (e) { triggerToast("Erreur upload", "error"); } finally { isSaving.value = false; } }; };
const handleLogin = async (pwd: string) => { isLoggingIn.value = true; loginError.value = ''; try { const res = await fetch('/api/manage-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pwd, action: 'login' }) }); if (res.ok) { passwordValue.value = pwd; isAuthenticated.value = true; localStorage.setItem('laurine_portfolio_token', pwd); triggerToast('Bienvenue Laurine !'); } else loginError.value = "Clé incorrecte"; } catch (e) { loginError.value = "Erreur connexion"; } finally { isLoggingIn.value = false; } };
const checkSession = async () => { const savedKey = localStorage.getItem('laurine_portfolio_token'); if (savedKey) { try { const res = await fetch('/api/manage-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: savedKey, action: 'login' }) }); if (res.ok) { passwordValue.value = savedKey; isAuthenticated.value = true; } else localStorage.removeItem('laurine_portfolio_token'); } catch (e) {} } };
const handleLogout = () => { isAuthenticated.value = false; passwordValue.value = ''; localStorage.removeItem('laurine_portfolio_token'); triggerToast('Session terminée'); };
const handleChangePassword = async (newPwd: string) => { isSaving.value = true; try { const res = await fetch('/api/manage-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: passwordValue.value, action: 'change-password', newPassword: newPwd }) }); if (res.ok) { passwordValue.value = newPwd; localStorage.setItem('laurine_portfolio_token', newPwd); triggerToast('Clé modifiée'); } else triggerToast('Échec', 'error'); } catch (e) { triggerToast('Erreur', 'error'); } finally { isSaving.value = false; } };
const addNewProject = () => { localProjects.value.push({ id: Date.now(), category: 'manage', image: '', link: '', fr: {title:'', desc:''}, en: {title:'', desc:''}, es: {title:'', desc:''}, nl: {title:'', desc:''} }); }
const deleteProject = (idx: number) => { if (confirm("Supprimer ce projet ?")) localProjects.value.splice(idx, 1); }
const addTimelineItem = () => { localAbout.timeline.unshift({ id: Date.now().toString(), period: '', type: 'edu', fr: { title: '', desc: '' }, en: { title: '', desc: '' }, es: { title: '', desc: '' }, nl: { title: '', desc: '' } }); }
const deleteTimelineItem = (idx: number) => { if (confirm("Supprimer cette étape ?")) localAbout.timeline.splice(idx, 1); }
const addCertItem = () => { localAbout.certifications.unshift({ id: Date.now().toString(), link: '', fr: { name: '', school: '' }, en: { name: '', school: '' }, es: { name: '', school: '' }, nl: { name: '', school: '' } }); }
const deleteCertItem = (idx: number) => { if (confirm("Supprimer ce certificat ?")) localAbout.certifications.splice(idx, 1); }
const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => { toast.message = msg; toast.type = type; toast.show = true; setTimeout(() => { toast.show = false }, 4000); }
const checkDevice = () => { isMobile.value = window.innerWidth < 1024; };
watch(() => localAbout.selected_palette, (newVal) => { document.documentElement.setAttribute('data-palette', newVal.toString()); });
</script>

<style scoped>
.admin-portal-wrapper { position: fixed; inset: 0; z-index: 99999; background: rgba(4, 4, 5, 0.98); backdrop-filter: blur(25px); display: flex; align-items: center; justify-content: center; overflow: hidden; }

/* MODAL DE CONFIRMATION */
.confirm-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 100002; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
.confirm-modal-card { width: 90%; max-width: 500px; background: #111114; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 32px; box-shadow: 0 50px 100px rgba(0,0,0,0.8); }

.modal-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.header-icon { width: 50px; height: 50px; border-radius: 12px; display: grid; place-items: center; }
.header-icon.save { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
.header-icon.close { background: rgba(248, 113, 113, 0.1); color: #f87171; }
.modal-header h3 { font-size: 1.25rem; font-weight: 800; color: #fff; margin: 0; }

.modal-body p { color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin-bottom: 20px; }
.changes-list { max-height: 200px; overflow-y: auto; background: #080809; border-radius: 12px; padding: 16px; border: 1px solid rgba(255,255,255,0.05); }
.change-item { color: #ececed; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; display: flex; gap: 10px; }
.bullet { color: #6366f1; }

.modal-footer { display: flex; gap: 12px; margin-top: 32px; }
.modal-footer button { flex: 1; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; border: none; }
.btn-cancel { background: #1e1e24; color: #94a3b8; }
.btn-cancel:hover { background: #25252d; color: #fff; }
.btn-confirm.save { background: #6366f1; color: #fff; }
.btn-confirm.close { background: #f87171; color: #fff; }
.btn-confirm:hover { transform: translateY(-2px); filter: brightness(1.1); }

/* Animation Modal */
.modal-bounce-enter-active { animation: modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-bounce-leave-active { animation: modal-in 0.2s reverse ease-in; }
@keyframes modal-in { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

.mobile-blocker { width: 90%; max-width: 450px; text-align: center; padding: 40px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; }
.mobile-blocker h2 { font-size: 1.5rem; margin-bottom: 16px; color: #fff; }
.mobile-blocker p { color: #94a3b8; line-height: 1.6; }
.btn-close-mobile { background: #6366f1; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
.icon-accent { color: #6366f1; }
.mb-20 { margin-bottom: 20px; }
.mt-24 { margin-top: 24px; }
</style>