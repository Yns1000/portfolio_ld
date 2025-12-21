<template>
  <div class="toast-container">
    <TransitionGroup name="toast-anim">
      <div v-if="config.show" :key="config.message" :class="['modern-toast', config.type]">
        <div class="toast-indicator"></div>
        <component :is="config.type === 'success' ? CheckCircle2 : AlertCircle" :size="18" />
        <span class="toast-msg">{{ config.message }}</span>
        <button @click="$emit('close')" class="toast-close">
          <X :size="14" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { CheckCircle2, AlertCircle, X } from 'lucide-vue-next'
defineProps<{
  config: { show: boolean, message: string, type: 'success' | 'error' }
}>()
defineEmits(['close'])
</script>

<style scoped>
.toast-container {
  position: fixed; top: 32px; left: 50%; transform: translateX(-50%);
  z-index: 100001; pointer-events: none;
}
.modern-toast {
  pointer-events: auto; background: #111114; border: 1px solid rgba(255,255,255,0.1);
  padding: 12px 20px; border-radius: 16px; display: flex; align-items: center; gap: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4); min-width: 300px; position: relative; overflow: hidden;
}
.toast-indicator { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; background: #6366f1; }
.modern-toast.error .toast-indicator { background: #ff4757; }
.toast-close { background: transparent; border: none; color: #8a94a6; cursor: pointer; margin-left: auto; }

</style>