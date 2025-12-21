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
          <User :size="18" class="icon-accent" />
          <h3>Biographie détaillée ({{ lang.toUpperCase() }})</h3>
        </div>
        <div class="card-body">
          <div class="input-box">
            <label>Texte À propos</label>
            <textarea v-model="aboutData[lang].text" rows="10" placeholder="Racontez votre parcours..."></textarea>
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
          <p class="field-hint" style="margin-bottom: 12px;">Choisissez un thème :</p>
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
            <div class="input-box" style="flex: 1;">
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
  Heart, Plus, Trash2, X, Palette, Check
} from 'lucide-vue-next'

const props = defineProps<{ aboutData: any, lang: string }>()
defineEmits(['add-timeline', 'delete-timeline', 'add-cert', 'delete-cert']);
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
/* SÉLECTEUR DE THÈMES NOMMÉS */
.theme-selector-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.theme-row-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.theme-row-btn:hover { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); }
.theme-row-btn:active { background: rgba(99, 102, 241, 0.1); border-color: #6366f1; }

.theme-swatch {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  transition: color 0.2s;
}
.theme-row-btn.active .theme-label { color: white; }
/* APERÇU DES COULEURS (Sombre / Accent) */
.pal-1 { background: #55423d; color: #ffc0ad; } /* Terre */
.pal-2 { background: #0f172a; color: #38bdf8; } /* Océan */
.pal-3 { background: #064e3b; color: #34d399; } /* Forêt */
.pal-4 { background: #2e1065; color: #a78bfa; } /* Lavande */
.pal-5 { background: #18181b; color: #fbbf24; } /* Ardoise/Or */
.pal-6 { background: #AF4D98; color: #9DF7E5; } /* Candy */
.pal-7 { background: #310D20; color: #F2D06B; } /* Aube Dorée */
.pal-8 { background: #1a2a6c; color: #00d2ff; } /* Stitch */
.pal-9 { background: #0f172a; color: #facc15; } /* Petit Prince */

.field-hint { font-size: 0.75rem; color: #64748b; font-style: italic; }
.hint { font-size: 0.7rem; color: #818cf8; margin-top: 4px; display: block; }
.mt-24 { margin-top: 24px; }
.ml-auto {
  margin-left: auto;
}
.add-tag-box {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.btn-add-tag-inline {
  width: 45px;
  height: 45px;
  background: #6366f1;
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>