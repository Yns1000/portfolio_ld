<template>
  <div class="editor-grid">
    <div class="editor-main">
      <div class="content-card">
        <div class="card-head"><Home :size="18" class="icon-accent" /> <h3>Section Accueil cheffe</h3></div>
        <div class="card-body">
          <div class="input-row">
            <div class="input-box"><label>Badge Greeting</label><input v-model="aboutData[lang].intro_hero" placeholder="Ex: Portfolio." /></div>
            <div class="input-box"><label>Nom / Titre</label><input v-model="aboutData[lang].name_hero" /></div>
          </div>
          <div class="input-box">
            <label>Texte de Bio</label>
            <textarea v-model="aboutData[lang].bio_hero" rows="3"></textarea>
            <span class="hint">Supporte l'HTML (ex: &lt;strong&gt;)</span>
          </div>
          <div class="input-row">
            <div class="input-box"><label>Label Bouton Projets</label><input v-model="aboutData[lang].btn_prj" /></div>
            <div class="input-box"><label>Label Bouton À Propos</label><input v-model="aboutData[lang].btn_abt" /></div>
          </div>
        </div>
      </div>

      <div class="content-card mt-24">
        <div class="card-head">
          <FileText :size="18" class="icon-accent" />
          <h3>Gestion du CV ({{ lang.toUpperCase() }})</h3>
        </div>
        <div class="card-body">
          <div class="input-row">
            <div class="input-box">
              <label>Texte du bouton</label>
              <input v-model="aboutData[lang].btn_cv" placeholder="Ex: Download CV" />
            </div>
            <div class="input-box">
              <label>Uploader le fichier PDF</label>
              <div class="upload-container">
                <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileSelect"
                    accept=".pdf"
                    style="display: none"
                />
                <button @click="$refs.fileInput.click()" class="btn-upload-trigger">
                  <Upload :size="16" />
                  <span>{{ selectedFile ? 'Changer le fichier' : 'Choisir le PDF' }}</span>
                </button>
                <span v-if="selectedFile" class="file-name-hint">{{ selectedFile.name }}</span>
              </div>
            </div>
          </div>

          <button
              v-if="selectedFile"
              @click="uploadCV"
              class="btn-save-main mt-12"
              :disabled="isUploading"
              style="width: fit-content; padding: 10px 20px;"
          >
            <Loader2 v-if="isUploading" class="spin" :size="16" />
            <CloudUpload v-else :size="16" />
            <span>{{ isUploading ? 'Envoi...' : 'Mettre en ligne ce CV' }}</span>
          </button>
          <p class="hint mt-8">Actuellement : {{ aboutData[lang].cv_link || 'Aucun fichier' }}</p>
        </div>
      </div>

      <div class="content-card mt-24">
        <div class="card-head">
          <User :size="18" class="icon-accent" />
          <h3>Biographie détaillée ({{ lang.toUpperCase() }})</h3>
        </div>
        <div class="card-body">
          <div class="input-box">
            <label>Texte À propos</label>
            <textarea v-model="aboutData[lang].text" rows="10" placeholder="Raconte ton parcours..."></textarea>
          </div>
        </div>
      </div>

      <div class="content-card mt-24">
        <div class="card-head">
          <History :size="18" class="icon-accent" />
          <h3>Parcours d'événements</h3>
          <button @click="$emit('add-timeline')" class="btn-add-modern ml-auto">
            <Plus :size="16" /> <span>Ajouter une étape</span>
          </button>
        </div>
        <div class="card-body">
          <div v-for="(item, idx) in aboutData.timeline" :key="idx" class="list-item-card">
            <div class="item-header-row">
              <div class="input-box period"><label>Période</label><input v-model="item.period" placeholder="ex: 2022 - 2025" /></div>
              <div class="input-box type"><label>Type</label>
                <select v-model="item.type">
                  <option value="edu">🎓 Formation</option>
                  <option value="job">💼 Expérience</option>
                  <option value="vol">🤝 Bénévolat</option>
                </select>
              </div>
              <button @click="$emit('delete-timeline', idx)" class="btn-delete-row"><Trash2 :size="16" /></button>
            </div>
            <div class="input-box"><label>Intitulé ({{ lang.toUpperCase() }})</label><input v-model="item[lang].title" /></div>
            <div class="input-box"><label>Lieu / Description</label><input v-model="item[lang].desc" /></div>
          </div>
        </div>
      </div>

      <div class="content-card mt-24">
        <div class="card-head">
          <Trophy :size="18" class="icon-accent" />
          <h3>Certifications & Badges</h3>
          <button @click="$emit('add-cert')" class="btn-add-modern ml-auto">
            <Plus :size="16" /> <span>Ajouter un certificat</span>
          </button>
        </div>
        <div class="card-body">
          <div v-for="(cert, idx) in aboutData.certifications" :key="idx" class="list-item-card">
            <div class="item-header-row">
              <div class="input-box" style="flex: 1;"><label>Nom du diplôme ({{ lang.toUpperCase() }})</label><input v-model="cert[lang].name" /></div>
              <button @click="$emit('delete-cert', idx)" class="btn-delete-row" title="Supprimer"><Trash2 :size="16" /></button>
            </div>
            <div class="item-header-row">
              <div class="input-box" style="flex: 1;"><label>Institution</label><input v-model="cert[lang].school" /></div>
              <div class="input-box" style="flex: 1.5;"><label>Lien de vérification</label><input v-model="cert.link" placeholder="https://..." /></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <aside class="editor-side">
      <div class="content-card">
        <div class="card-head">
          <Palette :size="18" class="icon-accent" />
          <h3>Ambiance du site</h3>
        </div>
        <div class="card-body">
          <p class="field-hint" style="margin-bottom: 12px;">Choisis un thème :</p>
          <div class="theme-selector-list custom-scrollbar">
            <button
                v-for="theme in themes" :key="theme.id"
                @click="aboutData.selected_palette = theme.id"
                :class="['theme-row-btn', { active: aboutData.selected_palette == theme.id }]"
            >
              <div :class="['theme-swatch', 'pal-' + theme.id]">
                <Check v-if="aboutData.selected_palette == theme.id" :size="12" />
              </div>
              <span class="theme-label">{{ theme.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="content-card mt-24">
        <div class="card-head"><Languages :size="18" class="icon-accent" /> <h3>Introduction</h3></div>
        <div class="card-body">
          <div class="input-box">
            <label>Slogan (Intro)</label>
            <textarea v-model="aboutData[lang].intro" rows="3" placeholder="Phrase d'accroche..."></textarea>
          </div>

          <div class="input-box">
            <label>Phrase des langues</label>
            <input v-model="aboutData[lang].fluent_sentence" placeholder="Je parle couramment {en}, {es} et {fr}." />
            <span class="hint">Garde {en}, {es}, {fr} pour afficher les drapeaux.</span>
          </div>
        </div>
      </div>

      <div class="content-card mt-24">
        <div class="card-head"><Heart :size="18" class="icon-accent" /> <h3>Passions</h3></div>
        <div class="card-body">
          <div class="tags-container">
            <span v-for="(hobby, idx) in aboutData[lang].hobbies" :key="hobby" class="hobby-tag-pill">
              {{ hobby }}
              <button @click="removeHobby(idx)" class="btn-remove-tag"><X :size="12" /></button>
            </span>
          </div>
          <div class="add-tag-box">
            <div class="input-box">
              <input v-model="newHobby" placeholder="Ajouter une passion..." @keyup.enter="addHobby" />
            </div>
            <button @click="addHobby" class="btn-add-tag-inline"><Plus :size="16" /></button>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Home, History, Trophy, User, Languages,
  Heart, Plus, Trash2, X, Palette, Check, FileText, Upload, CloudUpload, Loader2
} from 'lucide-vue-next'

const props = defineProps<{ aboutData: any, lang: string }>()
const emit = defineEmits(['add-timeline', 'delete-timeline', 'add-cert', 'delete-cert', 'cv-uploaded']);

const themes = [
  { id: 1, name: 'Terre (Original)' },
  { id: 2, name: 'Océan Profond' },
  { id: 3, name: 'Forêt Émeraude' },
  { id: 4, name: 'Lavande Royale' },
  { id: 5, name: 'Ardoise & Or' },
  { id: 6, name: 'Candy Pastel' },
  { id: 7, name: 'Aube Dorée' },
  { id: 8, name: 'Ohana (Stitch)' },
  { id: 9, name: 'B612 (Petit Prince)' }
]

const selectedFile = ref<File | null>(null)
const isUploading = ref(false)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0];
  }
}

const uploadCV = async () => {
  if (!selectedFile.value) return;
  isUploading.value = true;

  emit('cv-uploaded', { file: selectedFile.value, lang: props.lang });

  setTimeout(() => {
    selectedFile.value = null;
    isUploading.value = false;
  }, 1500);
}

const newHobby = ref('')
const addHobby = () => {
  const h = newHobby.value.trim()
  if (h && !props.aboutData[props.lang].hobbies.includes(h)) {
    props.aboutData[props.lang].hobbies.push(h);
    newHobby.value = '';
  }
}
const removeHobby = (idx: number) => { props.aboutData[props.lang].hobbies.splice(idx, 1) }
</script>

<style scoped>
.upload-container { display: flex; align-items: center; gap: 12px; }
.btn-upload-trigger {
  background: #1e1e24; border: 1px dashed rgba(255,255,255,0.2); color: #94a3b8;
  padding: 8px 16px; border-radius: 10px; cursor: pointer; display: flex; align-items: center; gap: 8px;
  font-weight: 600; font-size: 0.85rem; transition: 0.2s;
}
.btn-upload-trigger:hover { border-color: #6366f1; color: white; background: rgba(99, 102, 241, 0.05); }
.file-name-hint { font-size: 0.8rem; color: #818cf8; font-weight: 700; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.theme-selector-list { display: flex; flex-direction: column; gap: 6px; max-height: 320px; overflow-y: auto; padding-right: 4px; }
.theme-row-btn { display: flex; align-items: center; gap: 12px; padding: 10px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 12px; cursor: pointer; transition: all 0.2s ease; text-align: left; }
.theme-row-btn:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); }
.theme-row-btn.active { background: rgba(99, 102, 241, 0.1); border-color: #6366f1; }
.theme-swatch { width: 24px; height: 24px; border-radius: 6px; flex-shrink: 0; display: grid; place-items: center; color: white; border: 1px solid rgba(255, 255, 255, 0.1); }
.theme-label { font-size: 0.85rem; font-weight: 600; color: #94a3b8; transition: color 0.2s; }
.theme-row-btn.active .theme-label { color: white; }
.pal-1 { background: #55423d; } .pal-2 { background: #0f172a; } .pal-3 { background: #064e3b; }
.pal-4 { background: #2e1065; } .pal-5 { background: #18181b; } .pal-6 { background: #AF4D98; }
.pal-7 { background: #310D20; } .pal-8 { background: #1a2a6c; } .pal-9 { background: #0f172a; }
.field-hint { font-size: 0.75rem; color: #64748b; font-style: italic; }
.hint { font-size: 0.7rem; color: #818cf8; margin-top: 4px; display: block; }
.mt-8 { margin-top: 8px; } .mt-12 { margin-top: 12px; } .mt-24 { margin-top: 24px; }
.ml-auto { margin-left: auto; }
.add-tag-box { display: flex; gap: 8px; align-items: flex-end; }
.add-tag-box .input-box { flex: 1; }
.btn-add-tag-inline { width: 45px; height: 45px; background: #6366f1; border: none; border-radius: 10px; color: white; cursor: pointer; display: grid; place-items: center; flex-shrink: 0; transition: all 0.3s; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); }
.btn-add-tag-inline:hover { background: #818cf8; transform: translateY(-2px); }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>