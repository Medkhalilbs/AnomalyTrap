<template>
  <div class="lives-container">
    <div 
      v-for="i in 3" 
      :key="i" 
      class="heart"
      :class="{ lost: i > lives }"
    >
      <svg viewBox="0 0 32 32" class="heart-svg">
        <path d="M16 28.225l-2.15-1.956c-7.65-6.924-12.7-11.494-12.7-17.119 0-4.575 3.575-8.15 8.15-8.15 2.588 0 5.069 1.206 6.7 3.106 1.631-1.9 4.113-3.106 6.7-3.106 4.575 0 8.15 3.575 8.15 8.15 0 5.625-5.05 10.194-12.7 17.131l-2.15 1.944z" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  lives: number;
}>();
</script>

<style scoped>
.lives-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 10px 0;
}

.heart {
  width: 24px;
  height: 24px;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease;
}

.heart-svg {
  width: 100%;
  height: 100%;
  fill: #e74c3c;
  filter: drop-shadow(0 2px 4px rgba(231, 76, 60, 0.3));
}

.heart.lost {
  opacity: 0.2;
  transform: scale(0.8);
  filter: grayscale(1);
}

.heart.lost .heart-svg {
  fill: #bdc3c7;
}
</style>
