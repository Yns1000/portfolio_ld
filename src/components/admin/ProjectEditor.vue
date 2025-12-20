<template>
  <div class="editor-grid">
    <div class="editor-main">
      <div class="content-card">
        <div class="card-head">
          <Languages :size="18" class="icon-accent" />
          <h3>Contenu du projet ({{ lang.toUpperCase() }})</h3>
        </div>
        <div class="card-body">
          <div class="input-box">
            <label>Titre du projet</label>
            <input v-model="project[lang].title" placeholder="Ex: Nego Chine" />
          </div>
          <div class="input-box">
            <label>Description détaillée</label>
            <textarea v-model="project[lang].desc" rows="12" placeholder="Expliquez votre projet..."></textarea>
          </div>
        </div>
      </div>
    </div>

    <aside class="editor-side">
      <div class="content-card">
        <div class="card-head"><Settings :size="18" class="icon-accent" /> <h3>Configuration</h3></div>
        <div class="card-body">
          <div class="input-box">
            <label>Catégorie</label>
            <select v-model="project.category">
              <option value="manage">Gestion de projet</option>
              <option value="trans">Interculturel</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          <div class="input-box"><label>Lien externe</label><input v-model="project.link" placeholder="https://..." /></div>
          <div class="input-box"><label>Image (URL)</label><input v-model="project.image" placeholder="Lien vers l'image" /></div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { Languages, Settings } from 'lucide-vue-next'
defineProps<{ project: any, lang: string }>()
</script>