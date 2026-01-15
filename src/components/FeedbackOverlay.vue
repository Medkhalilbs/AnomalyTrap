<template>
  <Transition name="fade">
    <div v-if="visible" class="feedback-container" :class="type">
      <div class="feedback-content">
        <div v-if="type === 'success'" class="icon">✓</div>
        <div v-if="type === 'error'" class="icon">✗</div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  type: 'success' | 'error';
}>();

const visible = ref(true);

onMounted(() => {
  setTimeout(() => {
    visible.value = false;
  }, 400);
});
</script>

<style scoped>
.feedback-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 100;
}

.feedback-container.success {
  background-color: rgba(46, 204, 113, 0.2);
}

.feedback-container.error {
  background-color: rgba(231, 76, 60, 0.4);
}

.icon {
  font-size: 8rem;
  color: white;
  text-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
