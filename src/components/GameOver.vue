<template>
  <div class="game-over-overlay">
    <div class="game-over-card shadow-xl">
      <h1 class="game-over-title">GAME OVER</h1>
      
      <div class="stats">
        <div class="stat-item">
          <span class="label">SCORE</span>
          <span class="value">{{ score }}</span>
        </div>
        <div class="stat-item">
          <span class="label">EST</span>
          <span class="value">{{ Math.round(100 + (score * 2.5)) }}</span>
        </div>
      </div>

      <div class="actions">
        <button class="primary-button restart-button" @click="$emit('restart')">
          TRY AGAIN
        </button>
        <button class="secondary-button menu-button" @click="store.goToMenu()">
          MAIN MENU
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../store/gameStore';

const store = useGameStore();

defineProps<{
  score: number;
  highscore: number;
}>();

defineEmits(['restart']);
</script>

<style scoped>
.game-over-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  padding: 20px;
}

.game-over-card {
  background: var(--bg-color);
  color: var(--secondary-color);
  padding: 40px;
  border-radius: 30px;
  text-align: center;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 30px 60px rgba(0,0,0,0.5);
  animation: slide-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes slide-up {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.game-over-title {
  font-size: 2.2rem;
  font-weight: 950;
  color: #e74c3c;
  margin-bottom: 40px;
  letter-spacing: 2px;
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  background: rgba(0,0,0,0.05);
  padding: 20px;
  border-radius: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.75rem;
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.value {
  font-size: 2rem;
  font-weight: 900;
  color: var(--primary-color);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.primary-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 18px;
  font-size: 1.1rem;
  font-weight: 800;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 0 6px 0 var(--secondary-color);
  transition: transform 0.1s;
}

.primary-button:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 var(--secondary-color);
}

.secondary-button {
  background: transparent;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
  opacity: 0.6;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  border-radius: 15px;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .stats {
    background: rgba(255,255,255,0.05);
  }
}
</style>
