<template>
  <div class="game-over-overlay">
    <div class="game-over-card shadow-xl">
      <h1 class="game-over-title">GAME OVER</h1>
      <div class="stats">
        <div class="stat-item">
          <span class="label">Score</span>
          <span class="value">{{ score }}</span>
        </div>
        <div class="stat-item">
          <span class="label">Best</span>
          <span class="value">{{ highscore }}</span>
        </div>
      </div>
      
      <button class="restart-button" @click="$emit('restart')">
        TRY AGAIN
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  score: number;
  highscore: number;
}>();

defineEmits(['restart']);
</script>

<style scoped>
.game-over-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(44, 62, 80, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  padding: 20px;
}

.game-over-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  text-align: center;
  width: 100%;
  max-width: 320px;
  transform: translateY(0);
  animation: slide-up 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes slide-up {
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.game-over-title {
  font-size: 2rem;
  font-weight: 900;
  color: #e74c3c;
  margin-bottom: 30px;
  letter-spacing: 2px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.9rem;
  color: #7f8c8d;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
}

.restart-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: 100px;
  cursor: pointer;
  width: 100%;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 10px 20px rgba(52, 152, 219, 0.3);
}

.restart-button:active {
  transform: scale(0.95);
  background-color: #2980b9;
}
</style>
