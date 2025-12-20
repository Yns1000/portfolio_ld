<template>
  <div class="auth-wrapper">
    <div class="auth-card" :class="{ 'shake-on-error': !!errorMsg }">
      <div class="auth-glow"></div>

      <div class="auth-content">
        <header class="auth-header">
          <div class="brand-logo">
            <div class="logo-inner">
              <Fingerprint :size="32" />
            </div>
          </div>
          <h1>Console Admin</h1>
          <p>Identifiez-vous pour gérer vos projets.</p>
        </header>

        <div class="auth-form">
          <div class="field-group" :class="{ 'has-error': !!errorMsg }">
            <div class="input-wrapper">
              <Lock class="field-icon" :size="18" />
              <input
                  v-model="password"
                  type="password"
                  placeholder="Clé d'accès"
                  @keyup.enter="handleLoginSubmit"
                  :disabled="isLoggingIn"
                  autofocus
              />
            </div>
            <Transition name="slide-up">
              <p v-if="errorMsg" class="error-text">{{ errorMsg }}</p>
            </Transition>
          </div>

          <button
              @click="handleLoginSubmit"
              class="btn-primary login-btn"
              :disabled="isLoggingIn || !password"
          >
            <Loader2 v-if="isLoggingIn" class="spin" :size="20" />
            <template v-else>
              <span>Déverrouiller la console</span>
              <ChevronRight :size="18" />
            </template>
          </button>

          <button @click="$emit('close')" class="btn-ghost-text">
            Retour au site
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Fingerprint, Lock, Loader2, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  isLoggingIn: boolean
  errorMsg: string
}>()

const emit = defineEmits(['login', 'close'])

const password = ref('')

const handleLoginSubmit = () => {
  if (password.value && !props.isLoggingIn) {
    emit('login', password.value)
  }
}
</script>

<style scoped>
.auth-wrapper {
  width: 100%;
  max-width: 440px;
  padding: 20px;
  perspective: 1000px;
}

.auth-card {
  position: relative;
  background: #111114;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 48px 40px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.5);
}

.auth-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 60%);
  pointer-events: none;
}

.auth-content {
  position: relative;
  z-index: 1;
}

/* LOGO STYLE */
.brand-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #1f1f23, #111114);
  border-radius: 18px;
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.logo-inner {
  width: 100%;
  height: 100%;
  background: #111114;
  border-radius: 16px;
  display: grid;
  place-items: center;
  color: #6366f1;
}

/* HEADER */
.auth-header {
  text-align: center;
  margin-bottom: 36px;
}

.auth-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 8px;
  color: #edeeef;
}

.auth-header p {
  color: #8a94a6;
  font-size: 0.95rem;
}

/* FORM & INPUT */
.field-group {
  margin-bottom: 24px;
}

.input-wrapper {
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.input-wrapper:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
  background: rgba(0, 0, 0, 0.4);
}

.field-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #8a94a6;
  transition: color 0.3s;
}

.input-wrapper:focus-within .field-icon {
  color: #6366f1;
}

.input-wrapper input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background: transparent;
  border: none;
  color: white;
  outline: none;
  font-size: 1rem;
}

.error-text {
  color: #ff4757;
  font-size: 0.85rem;
  margin-top: 10px;
  text-align: center;
  font-weight: 500;
}

/* BUTTONS */
.btn-primary {
  width: 100%;
  background: #6366f1;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
  filter: brightness(1.1);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-ghost-text {
  background: transparent;
  border: none;
  color: #8a94a6;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 20px;
  width: 100%;
  text-align: center;
  transition: color 0.2s;
}

.btn-ghost-text:hover {
  color: white;
}

/* ANIMATIONS */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.shake-on-error {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.slide-up-enter-active {
  transition: all 0.3s ease-out;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>