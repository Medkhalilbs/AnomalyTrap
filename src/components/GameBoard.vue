<template>
  <div 
    class="game-board-container" 
    :class="{ 'shake-screen': store.isShaking }"
  >
    <div class="game-header">
      <button class="exit-button" @click="store.goToMenu()">
        <span>🏠</span>
      </button>

      <div class="mode-info-display">
        <span class="mode-name-label">{{ t('score') }}</span>
        <span class="score-value-large">{{ store.score }}</span>
      </div>
      
      <div class="header-controls">
        <LivesDisplay :lives="store.lives" />
        
        <button 
          class="hint-button" 
          @click="store.useHint" 
          :disabled="store.hints <= 0 || store.isHintActive"
        >
          <span class="hint-icon">💡</span>
          <span class="hint-count">{{ store.hints }}</span>
        </button>
      </div>
    </div>

    <div class="score-display">
      <div class="level-indicator">
        {{ store.levelText }}
      </div>
      <div class="score-row">
        <div class="current-score">{{ store.score }}</div>
        <Transition name="pop">
          <div v-if="store.combo > 1" class="combo-badge" :key="store.combo">
            x{{ store.combo }}
          </div>
        </Transition>
      </div>
    </div>
    
    <div class="grid-container">
      <TransitionGroup name="grid" tag="div" class="items-grid" :class="{ 'hint-active': store.isHintActive }">
        <LogicItem 
          v-for="(item, index) in store.currentItems" 
          :key="item.id || index" 
          :item="item"
          :is-outlier="index === store.outlierIndex"
          :is-decoy="index !== store.outlierIndex && store.isHintActive"
          @tap="handleTap(index)"
        />
      </TransitionGroup>
    </div>

    <FeedbackOverlay v-if="store.lastCorrect" type="success" />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../store/gameStore';
import LogicItem from './LogicItem.vue';
import FeedbackOverlay from './FeedbackOverlay.vue';
import LivesDisplay from './LivesDisplay.vue';
import { translations } from '../utils/i18n';

const store = useGameStore();

function t(key: keyof typeof translations['en']) {
    return translations[store.language][key];
}

function handleTap(index: number) {
  store.tapItem(index);
}
</script>

<style scoped>
.game-board-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  box-sizing: border-box;
  transition: background-color 0.3s;
}

.shake-screen {
  animation: screen-shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes screen-shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.game-header {
  width: 100%;
  max-width: 400px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.exit-button {
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 0 var(--secondary-color);
  transition: transform 0.1s;
}

.exit-button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--secondary-color);
}

.iq-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

.iq-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--secondary-color);
  opacity: 0.5;
  letter-spacing: 2px;
}

.iq-value {
  font-size: 1.6rem;
  font-weight: 900;
  color: var(--primary-color);
  line-height: 1;
}

.progress-track {
  width: 100px;
  height: 4px;
  background: rgba(0,0,0,0.05);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.header-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.hint-button {
  background: white;
  border: 2px solid #f1c40f;
  border-radius: 12px;
  padding: 5px 12px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 4px 0 #d4ac0d;
}

.hint-button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #d4ac0d;
}

.hint-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(1);
}

.hint-icon {
  font-size: 1.2rem;
}

.hint-count {
  font-weight: 900;
  color: #2c3e50;
  font-size: 1rem;
}

.score-display {
  text-align: center;
  margin: 5px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  position: relative;
}

.score-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  min-height: 80px;
}

.level-indicator {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--secondary-color);
  opacity: 0.8;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.boss-text {
  color: #e74c3c;
  animation: pulse 1s infinite alternate;
  font-weight: 900;
  letter-spacing: 3px;
}

@keyframes pulse {
  from { transform: scale(1); opacity: 0.8; }
  to { transform: scale(1.1); opacity: 1; }
}

.current-score {
  font-size: 4rem;
  font-weight: 800;
  color: var(--secondary-color);
  line-height: 1;
}

.combo-badge {
  background: var(--accent-color);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 900;
  font-size: 1.2rem;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}

.grid-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 450px;
  padding: 20px;
  justify-items: center;
  transition: opacity 0.3s ease;
}

/* Transitions */
.grid-enter-active,
.grid-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.grid-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.grid-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.grid-move {
  transition: transform 0.5s ease;
}

.pop-enter-active {
  animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.pop-leave-active {
  animation: pop-in 0.2s reverse ease-in;
}

@keyframes pop-in {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

.is-decoy {
  opacity: 0.2 !important;
  filter: blur(2px);
  pointer-events: none;
  transition: opacity 0.5s ease, filter 0.5s ease;
}

.is-outlier {
  transition: transform 0.3s ease;
}

.hint-active .is-outlier {
  transform: scale(1.15) !important;
  filter: drop-shadow(0 0 15px var(--accent-color));
}

@media (max-width: 400px) {
  .items-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 12px;
    padding: 10px;
  }
}

@media (prefers-color-scheme: dark) {
  .hint-button {
    background: #34495e;
    color: white;
    box-shadow: 0 4px 0 #2c3e50;
  }
  .hint-button:active {
    box-shadow: 0 2px 0 #2c3e50;
  }
  .hint-count {
    color: white;
  }
}
</style>
