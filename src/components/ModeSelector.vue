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
          :style="{ '--card-color': mode.color, borderColor: mode.color }"
          @click="selectMode(mode.id)"
        >
          <div class="mode-icon" :style="{ color: mode.color }">{{ mode.icon }}</div>
          <div class="mode-info-wrapper">
            <h3 class="mode-name">{{ getModeInfo(mode.id).name }}</h3>
            <p class="mode-description">{{ getModeInfo(mode.id).desc }}</p>
            <div class="mode-badge">{{ t('play') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { MODE_CONFIGS, type GameModeValue } from '../types/modes';
import { useGameStore } from '../store/gameStore';
import { translations } from '../utils/i18n';

const store = useGameStore();

function t(key: keyof typeof translations['en']) {
    return translations[store.language][key];
}

function getModeInfo(id: string) {
    const modes = t('modes') as any;
    return modes[id] || { name: 'Unknown', desc: '...' };
}

const filteredModes = computed(() => {
    return MODE_CONFIGS;
});

const emit = defineEmits(['close']);

function selectMode(modeId: string) {  
  store.currentMode = modeId as GameModeValue;
  store.startGame();
  emit('close');
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

/* ... existing styles ... */

.mode-selector {
  width: 95%;
  max-width: 1200px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  background: transparent;
  padding: 0;
  position: relative;
  animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* ... animations ... */

.modes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.mode-card {
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 25px 20px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 240px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.mode-card:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(40, 40, 40, 0.8);
  border-color: rgba(255, 255, 255, 0.25);
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}

.mode-card:active {
  transform: scale(0.98);
}

/* Gradient Glow Effect */
.mode-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: radial-gradient(circle at top, var(--card-color, rgba(255,255,255,0.1)), transparent 70%);
  opacity: 0.15;
  transition: opacity 0.3s;
}

.mode-card:hover::before {
  opacity: 0.3;
}

.mode-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 0 15px rgba(0,0,0,0.3));
  transition: transform 0.3s;
  z-index: 1;
}

.mode-card:hover .mode-icon {
  transform: scale(1.1) rotate(5deg);
}

.mode-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: white;
  text-align: center;
  margin: 0 0 10px 0;
  line-height: 1.2;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.mode-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  z-index: 1;
  line-height: 1.4;
}

.mode-badge {
    position: absolute;
    bottom: 15px;
    background: white;
    color: #333;
    font-size: 0.75rem;
    padding: 6px 14px;
    border-radius: 20px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    transition: all 0.2s;
    opacity: 0.9;
    z-index: 2;
}

.mode-card:hover .mode-badge {
    transform: scale(1.05);
    background: var(--card-color, white);
    color: white;
    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

/* Landscape / Desktop tweaks */
@media (min-width: 768px) {
  .modes-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 30px;
    padding: 40px;
  }
}

/* Small mobile tweak */
@media (max-width: 480px) {
  .modes-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }

  .mode-card {
    flex-direction: row;
    min-height: 110px;
    justify-content: flex-start;
    padding: 15px 20px;
    gap: 20px;
    align-items: center;
  }

  .mode-icon {
    margin-bottom: 0;
    font-size: 3rem;
  }

  .mode-info-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex: 1;
  }

  .mode-name {
    text-align: left;
    font-size: 1.2rem;
    margin-bottom: 5px;
  }

  .mode-description {
    text-align: left;
    -webkit-line-clamp: 2;
    font-size: 0.85rem;
  }
  
  .mode-badge {
      position: static;
      margin-top: 8px;
      font-size: 0.65rem;
      padding: 4px 10px;
      align-self: flex-start;
  }
}

</style>
