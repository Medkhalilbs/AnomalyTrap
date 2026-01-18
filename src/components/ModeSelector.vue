<template>
  <div class="mode-selector-overlay" @click.self="$emit('close')">
    <div class="mode-selector">
      <div class="selector-header">
        <h2 class="selector-title">
          <span class="glitch-text" :data-text="t('chooseChallenge') || 'CHOOSE CHALLENGE'">
            {{ t('chooseChallenge') || 'CHOOSE CHALLENGE' }}
          </span>
        </h2>
        <button class="close-btn" @click="$emit('close')" aria-label="Close">✕</button>
      </div>

      <div class="modes-grid">
        <div
          v-for="(mode, index) in filteredModes"
          :key="mode.id"
          class="mode-card"
          :style="{ 
            '--card-color': mode.color, 
            '--delay': `${index * 0.1}s` 
          }"
          @click="selectMode(mode.id)"
        >
          <div class="card-glow"></div>
          <div class="mode-icon-wrapper">
            <span class="mode-icon">{{ mode.icon }}</span>
          </div>
          
          <div class="mode-details">
            <h3 class="mode-name">{{ getModeInfo(mode.id).name }}</h3>
            <p class="mode-description">{{ getModeInfo(mode.id).desc }}</p>
          </div>

          <div class="play-hint">
            <span class="play-text">{{ t('play') }}</span>
            <span class="arrow">→</span>
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
import { sounds } from '../utils/sounds';

const store = useGameStore();

function t(key: keyof typeof translations['en']) {
    return (translations[store.language] as any)[key] || (translations['en'] as any)[key];
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
  sounds.playMenuClick();
  store.currentMode = modeId as GameModeValue;
  store.startGame();
  emit('close');
}
</script>

<style scoped>
.mode-selector-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.mode-selector {
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 30px;
}

.selector-title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 950;
  color: white;
  letter-spacing: -1px;
}

.glitch-text {
  position: relative;
  display: inline-block;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
}

.glitch-text::before {
  color: var(--primary-color);
  z-index: -1;
  animation: glitch-offset 3s infinite linear alternate-reverse;
}

@keyframes glitch-offset {
  0% { transform: translate(2px, 2px); }
  100% { transform: translate(-2px, -2px); }
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 25px;
  padding: 10px 20px 40px;
  overflow-y: auto;
  scrollbar-width: none;
}

.modes-grid::-webkit-scrollbar {
  display: none;
}

.mode-card {
  --card-bg: rgba(255, 255, 255, 0.05);
  background: var(--card-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 30px 25px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  animation: cardEnter 0.6s cubic-bezier(0.23, 1, 0.32, 1) both;
  animation-delay: var(--delay);
}

@keyframes cardEnter {
  from { opacity: 0; transform: translateY(40px) scale(0.9); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.mode-card:hover {
  transform: translateY(-10px) scale(1.02);
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--card-color);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top right, var(--card-color), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s;
}

.mode-card:hover .card-glow {
  opacity: 0.15;
}

.mode-icon-wrapper {
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s;
}

.mode-card:hover .mode-icon-wrapper {
  transform: rotate(10deg);
  background: var(--card-color);
}

.mode-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.2));
}

.mode-card:hover .mode-icon {
  filter: brightness(0) invert(1);
}

.mode-details {
  flex: 1;
}

.mode-name {
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  margin: 0 0 8px 0;
  line-height: 1.1;
}

.mode-description {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin: 0;
}

.play-hint {
  margin-top: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--card-color);
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  transform: translateX(-10px);
  opacity: 0;
  transition: all 0.3s;
}

.mode-card:hover .play-hint {
  transform: translateX(0);
  opacity: 1;
}

.arrow {
  font-size: 1.2rem;
  line-height: 1;
}

@media (max-width: 768px) {
  .selector-title {
    font-size: 1.8rem;
  }
  .modes-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  .mode-card {
    flex-direction: row;
    align-items: center;
    gap: 20px;
    padding: 20px;
  }
  .mode-icon-wrapper {
    margin-bottom: 0;
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }
  .play-hint {
    display: none;
  }
}
</style>
