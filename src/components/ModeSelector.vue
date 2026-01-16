<template>
  <div class="mode-selector-overlay" @click.self="$emit('close')">
    <div class="mode-selector">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <h2 class="selector-title">Choose Your Challenge</h2>
      <div class="modes-grid">
        <div
          v-for="mode in modes"
          :key="mode.id"
          class="mode-card"
          :style="{ borderColor: mode.color }"
          @click="selectMode(mode.id)"
        >
          <div class="mode-icon">{{ mode.icon }}</div>
          <h3 class="mode-name">{{ mode.name }}</h3>
          <p class="mode-description">{{ mode.description }}</p>
          <div class="mode-badge" v-if="mode.id === GameMode.ANOMALY_HUNT">CLASSIC</div>
          <div class="mode-badge new" v-else>COMING SOON</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MODE_CONFIGS, GameMode } from '../types/modes';
import { useGameStore, GameState } from '../store/gameStore';

const store = useGameStore();
const modes = MODE_CONFIGS;

defineEmits(['close']);

function selectMode(modeId: string) {
  // For now, only Anomaly Hunt is implemented
  if (modeId !== GameMode.ANOMALY_HUNT) {
    alert('This mode is coming soon! 🚀');
    return;
  }
  
  store.currentMode = modeId;
  store.gameState = GameState.PLAYING;
  store.startGame();
}
</script>

<style scoped>
.mode-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.mode-selector {
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--bg-color);
  border-radius: 24px;
  padding: 30px;
  position: relative;
  animation: slideUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: var(--secondary-color);
  opacity: 0.5;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
}

.selector-title {
  font-size: 2rem;
  font-weight: 900;
  color: var(--primary-color);
  margin-bottom: 30px;
  text-align: center;
}

.modes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.mode-card {
  background: white;
  border: 4px solid;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}

.mode-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 0 rgba(0,0,0,0.15);
}

.mode-card:active {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0,0,0,0.1);
}

.mode-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 10px;
}

.mode-name {
  font-size: 1.2rem;
  font-weight: 800;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 8px;
}

.mode-description {
  font-size: 0.9rem;
  color: #7f8c8d;
  text-align: center;
  line-height: 1.4;
}

.mode-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 1px;
}

.mode-badge.new {
  background: #95a5a6;
}

@media (max-width: 600px) {
  .modes-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .mode-card {
    padding: 15px;
  }
  
  .mode-icon {
    font-size: 2rem;
  }
  
  .mode-name {
    font-size: 1rem;
  }
  
  .mode-description {
    font-size: 0.8rem;
  }
}

@media (prefers-color-scheme: dark) {
  .mode-card {
    background: #2c3e50;
  }
  
  .mode-name {
    color: white;
  }
}
</style>
