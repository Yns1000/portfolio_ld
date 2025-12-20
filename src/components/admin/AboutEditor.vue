<template>
  <div class="editor-grid">
    <div class="editor-main">
      <div class="content-card">
        <div class="card-head"><Home :size="18" class="icon-accent" /> <h3>Section Accueil (Hero)</h3></div>
        <div class="card-body">
          <div class="input-row">
            <div class="input-box"><label>Badge Greeting</label><input v-model="aboutData[lang].intro_hero" placeholder="Ex: Portfolio." /></div>
            <div class="input-box"><label>Nom / Titre</label><input v-model="aboutData[lang].name_hero" /></div>
          </div>
          <div class="input-box">
            <label>Texte de Bio Hero</label>
            <textarea v-model="aboutData[lang].bio_hero" rows="3"></textarea>
            <span class="hint">Supporte l'HTML (ex: &lt;strong&gt;)</span>
          </div>
          <div class="input-row">
            <div class="input-box"><label>Label Bouton Projets</label><input v-model="aboutData[lang].btn_prj" /></div>
            <div class="input-box"><label>Label Bouton À Propos</label><input v-model="aboutData[lang].btn_abt" /></div>
          </div>
        </div>
      </div>

      <div class="content-card" style="margin-top: 24px;">
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

      <div class="content-card" style="margin-top: 24px;">
        <div class="card-head">
          <History :size="18" class="icon-accent" />
          <div class="flex-between">
            <h3>Parcours d'événements</h3>
            <button @click="$emit('add-timeline')" class="btn-add-modern">
              <Plus :size="16" /> <span>Ajouter une étape</span>
            </button>
          </div>
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

      <div class="content-card" style="margin-top: 24px;">
        <div class="card-head">
          <Trophy :size="18" class="icon-accent" />
          <div class="flex-between">
            <h3>Certifications & Badges</h3>
            <button @click="$emit('add-cert')" class="btn-add-modern">
              <Plus :size="16" /> <span>Ajouter un certificat</span>
            </button>
          </div>
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
          <h3>Couleurs du site</h3>
        </div>
        <div class="card-body">
          <p class="field-hint" style="margin-bottom: 12px;">Ambiance visuelle :</p>
          <div class="palette-selector-grid">
            <button
                v-for="n in 5" :key="n"
                @click="aboutData.selected_palette = n"
                :class="['palette-option', 'pal-' + n, { active: aboutData.selected_palette == n }]"
                :title="'Palette ' + n"
            >
              <Check v-if="aboutData.selected_palette == n" :size="16" />
              <span v-else>{{ n }}</span>
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
            <input v-model="newHobby" placeholder="Nouvelle passion..." @keyup.enter="addHobby" />
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
const emit = defineEmits(['add-timeline', 'delete-timeline', 'add-cert', 'delete-cert'])

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
.palette-selector-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
.palette-option {
  height: 40px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1);
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease; font-weight: bold;
}
.palette-option.active { border-color: white; transform: scale(1.1); box-shadow: 0 0 15px rgba(255,255,255,0.2); }

/* Couleurs des boutons de prévisualisation (Sombre / Accent) */
.pal-1 { background: #55423d; color: #ffc0ad; }
.pal-2 { background: #0f172a; color: #38bdf8; }
.pal-3 { background: #064e3b; color: #34d399; }
.pal-4 { background: #2e1065; color: #a78bfa; }
.pal-5 { background: #18181b; color: #fbbf24; }

.field-hint { font-size: 0.75rem; color: #64748b; font-style: italic; }
.mt-24 { margin-top: 24px; }
</style>