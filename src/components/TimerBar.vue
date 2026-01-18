<template>
  <div class="timer-bar-container">
    <div 
      class="timer-bar-fill" 
      :style="fillStyle"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  value: number;
  max: number;
}>();

const fillStyle = computed(() => {
  const percentage = (props.value / props.max) * 100;
  
  // Color interpolation: Green -> Yellow -> Red
  let color = '#2ecc71'; // Green
  if (percentage < 30) {
    color = '#e74c3c'; // Red
  } else if (percentage < 60) {
    color = '#f1c40f'; // Yellow
  }

  return {
    width: `${percentage}%`,
    backgroundColor: color,
    transition: 'width 0.1s linear, background-color 0.3s ease'
  };
});
</script>

<style scoped>
.timer-bar-container {
  width: 100%;
  height: 8px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  overflow: hidden;
  margin: 10px 0;
}

.timer-bar-fill {
  height: 100%;
  border-radius: 4px;
}

@media (prefers-color-scheme: dark) {
  .timer-bar-container {
    background-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
