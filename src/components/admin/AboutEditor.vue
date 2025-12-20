<template>
  <div class="editor-grid">
    <div class="editor-main">
      <div class="content-card">
        <div class="card-head"><Home :size="18" class="icon-accent" /> <h3>Section Accueil (Hero)</h3></div>
        <div class="card-body">
          <div class="input-row">
            <div class="input-box"><label>Badge Greeting</label><input v-model="data[lang].intro_hero" /></div>
            <div class="input-box"><label>Nom / Titre</label><input v-model="data[lang].name_hero" /></div>
          </div>
          <div class="input-box">
            <label>Texte de Bio Hero</label>
            <textarea v-model="data[lang].bio_hero" rows="3"></textarea>
          </div>
          <div class="input-row">
            <div class="input-box"><label>Label Bouton 1</label><input v-model="data[lang].btn_prj" /></div>
            <div class="input-box"><label>Label Bouton 2</label><input v-model="data[lang].btn_abt" /></div>
          </div>
        </div>
      </div>

      <div class="content-card mt-24">
        <div class="card-head">
          <History :size="18" class="icon-accent" />
          <div class="flex-between">
            <h3>Parcours d'événements</h3>
            <button @click="$emit('add-timeline')" class="btn-add-modern"><Plus :size="16" /> Ajouter</button>
          </div>
        </div>
        <div class="card-body">
          <div v-for="(item, idx) in data.timeline" :key="idx" class="list-item-card">
            <div class="item-header-row">
              <div class="input-box period"><label>Période</label><input v-model="item.period" /></div>
              <div class="input-box type">
                <label>Type</label>
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
          <div class="flex-between">
            <h3>Certifications</h3>
            <button @click="$emit('add-cert')" class="btn-add-modern"><Plus :size="16" /> Ajouter</button>
          </div>
        </div>
        <div class="card-body">
          <div v-for="(cert, idx) in data.certifications" :key="idx" class="list-item-card">
            <div class="item-header-row">
              <div class="input-box" style="flex: 2;"><label>Nom ({{ lang.toUpperCase() }})</label><input v-model="cert[lang].name" /></div>
              <button @click="$emit('delete-cert', idx)" class="btn-delete-row"><Trash2 :size="16" /></button>
            </div>
            <div class="item-header-row">
              <div class="input-box" style="flex: 1;"><label>Institution</label><input v-model="cert[lang].school" /></div>
              <div class="input-box" style="flex: 1.5;"><label>Lien</label><input v-model="cert.link" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <aside class="editor-side">
      <div class="content-card">
        <div class="card-head"><User :size="18" class="icon-accent" /> <h3>Biographie détaillée</h3></div>
        <div class="card-body">
          <div class="input-box"><label>Intro section</label><textarea v-model="data[lang].intro" rows="3"></textarea></div>
          <div class="input-box"><label>Texte bio</label><textarea v-model="data[lang].text" rows="8"></textarea></div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { Home, History, Trophy, Plus, Trash2, User } from 'lucide-vue-next'
defineProps<{ data: any; lang: string }>()
defineEmits(['add-timeline', 'delete-timeline', 'add-cert', 'delete-cert'])
</script>