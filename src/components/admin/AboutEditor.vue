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
        <div class="card-head"><Languages :size="18" class="icon-accent" /> <h3>Introduction</h3></div>
        <div class="card-body">
          <div class="input-box">
            <label>Slogan (Intro)</label>
            <textarea v-model="aboutData[lang].intro" rows="3" placeholder="Phrase d'accroche..."></textarea>
          </div>
        </div>
      </div>

      <div class="content-card" style="margin-top: 24px;">
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
import { Home, History, Trophy, User, Languages, Heart, Plus, Trash2, X } from 'lucide-vue-next'

const props = defineProps<{ aboutData: any, lang: string }>()
const emit = defineEmits(['add-timeline', 'delete-timeline', 'add-cert', 'delete-cert'])

const newHobby = ref('')
const addHobby = () => {
  const h = newHobby.value.trim()
  if (h && !props.aboutData[props.lang].hobbies.includes(h)) {
    props.aboutData[props.lang].hobbies.push(h); newHobby.value = '';
  }
}
const removeHobby = (idx: number) => { props.aboutData[props.lang].hobbies.splice(idx, 1) }
</script>