<template>
  <div class="editor-grid single-column">
    <div class="editor-main">
      <div class="content-card shadow-sm">
        <div class="card-head">
          <Lock :size="18" class="icon-accent" />
          <h3>Sécurité du compte</h3>
        </div>
        <div class="card-body">
          <p class="field-hint mb-20">Utilisez ce formulaire pour modifier votre clé d'accès à la console.</p>

          <div class="input-box">
            <label>Nouveau mot de passe</label>
            <input
                type="password"
                v-model="newPassword"
                placeholder="Entrez le nouveau mot de passe"
            />
          </div>

          <div class="input-box mt-24">
            <label>Confirmer le mot de passe</label>
            <input
                type="password"
                v-model="confirmPassword"
                placeholder="Confirmez le nouveau mot de passe"
            />
          </div>

          <div v-if="errorMsg" class="error-banner mt-16">{{ errorMsg }}</div>

          <button
              @click="handleSubmit"
              :disabled="!isValid || isUpdating"
              class="btn-save-main mt-24"
              style="width: fit-content; padding: 12px 32px;"
          >
            <ShieldCheck v-if="!isUpdating" :size="18" />
            <Loader2 v-else class="spin" :size="18" />
            <span>Mettre à jour la clé</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Lock, ShieldCheck, Loader2 } from 'lucide-vue-next'

const emit = defineEmits(['update-password'])
const props = defineProps<{ isUpdating: boolean }>()

const newPassword = ref('')
const confirmPassword = ref('')
const errorMsg = ref('')

const isValid = computed(() => {
  return newPassword.value.length >= 4 && newPassword.value === confirmPassword.value
})

const handleSubmit = () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = "Les mots de passe ne correspondent pas."
    return
  }
  errorMsg.value = ""
  emit('update-password', newPassword.value)
  // Reset fields after attempt
  newPassword.value = ''
  confirmPassword.value = ''
}
</script>

<style scoped>
.single-column { grid-template-columns: 1fr !important; }
.mb-20 { margin-bottom: 20px; }
.error-banner {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
</style>