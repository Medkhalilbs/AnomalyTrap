<template>
  <div class="mode-selector-overlay" @click.self="$emit('close')">
    <div class="mode-selector">
      <button class="close-btn" @click="$emit('close')">✕</button>
      <h2 class="selector-title">Choose Your Challenge</h2>

      <!-- Tabs removed for cleaner UI -->

      <div class="modes-grid">
        <div
          v-for="mode in filteredModes"
          :key="mode.id"
          class="mode-card"
          :style="{ borderColor: mode.color }"
          @click="selectMode(mode.id)"
        >
          <div class="mode-icon">{{ mode.icon }}</div>
          <h3 class="mode-name">{{ mode.name }}</h3>
          <p class="mode-description">{{ mode.description }}</p>
          <div class="mode-badge">PLAY</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MODE_CONFIGS, GameMode, type GameModeValue } from '../types/modes';
import { useGameStore, GameState } from '../store/gameStore';

const store = useGameStore();
const filteredModes = computed(() => {
    return MODE_CONFIGS;
});

defineEmits(['close']);

function selectMode(modeId: string) {  
  store.currentMode = modeId as GameModeValue;
  store.gameState = GameState.PLAYING;
  
  // Only start game engine display for Anomaly Hunt immediately? 
  // Actually most modes handle their own start now via onMounted or their own init.
  // Anomaly Hunt needs explicit start from store.
  if (modeId === GameMode.ANOMALY_HUNT) {
    store.startGame();
  }
}
</script>

<style scoped>
.mode-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
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
  width: 95%;
  max-width: 1000px;
  height: 90vh; /* Fixed height for scroll internal */
  display: flex;
  flex-direction: column;
  background: transparent;
  padding: 0; /* Remove padding for edge-to-edge feel on mobile */
  position: relative;
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  font-size: 1.4rem;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.selector-title {
  font-size: 2rem;
  font-weight: 900;
  color: white;
  margin: 20px 0;
  text-align: center;
  text-shadow: 0 4px 10px rgba(0,0,0,0.3);
  flex-shrink: 0;
}

.modes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 15px;
  padding: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* Smooth scroll on iOS */
  /* Hide scrollbar */
  scrollbar-width: none;
}

.modes-grid::-webkit-scrollbar {
  display: none;
}

.mode-card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 20px 15px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  transition: transform 0.2s, background 0.2s;
}

.mode-card:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-5px);
}

.mode-card:active {
  transform: scale(0.96);
}

/* Card color strip */
.mode-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: currentColor; /* Uses border-color style */
  opacity: 0.8;
  border-radius: 20px 20px 0 0;
}

.mode-icon {
  font-size: 3.5rem;
  margin-bottom: 15px;
  filter: drop-shadow(0 0 10px rgba(0,0,0,0.2));
}

.mode-name {
  font-size: 1.1rem;
  font-weight: 800;
  color: white;
  text-align: center;
  margin: 0 0 5px 0;
  line-height: 1.2;
}

.mode-description {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mode-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #2ecc71;
    color: white;
    font-size: 0.6rem;
    padding: 3px 8px;
    border-radius: 10px;
    font-weight: 900;
}

/* Landscape / Desktop tweaks */
/* Landscape / Desktop tweaks */
@media (min-width: 768px) {
  .modes-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 25px;
    padding: 30px;
  }
  
  .mode-card {
    min-height: 220px;
  }

  .mode-icon {
    font-size: 4.5rem;
  }

  .mode-name {
    font-size: 1.4rem;
  }
}

/* Small mobile tweak */
@media (max-width: 400px) {
  .modes-grid {
    grid-template-columns: 1fr; /* Single column on very small screens */
    gap: 10px;
    padding: 10px;
  }

  .mode-card {
    flex-direction: row; /* Horizontal layout for single column */
    min-height: 100px;
    justify-content: flex-start;
    padding: 15px;
    gap: 20px;
  }

  .mode-icon {
    margin-bottom: 0;
    font-size: 2.5rem;
  }

  .mode-info-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .mode-name {
    text-align: left;
    font-size: 1.2rem;
  }

  .mode-description {
    text-align: left;
    -webkit-line-clamp: 2;
  }
}
</style>
