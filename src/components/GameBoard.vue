<template>
  <div class="game-board-container">
    <div class="game-header">
      <div class="iq-display">
        <span class="iq-label">ESTIMATED IQ</span>
        <span class="iq-value">{{ Math.round(store.estimatedIQ) }}</span>
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
      <div class="level-indicator" :class="{ 'boss-text': store.levelText.includes('BOSS') }">
        {{ store.levelText }}
      </div>
      <div class="current-score">{{ store.score }}</div>
    </div>
    
    <div class="grid-container">
      <TransitionGroup name="grid" tag="div" class="items-grid" :class="{ 'hint-active': store.isHintActive }">
        <LogicItem 
          v-for="(item, index) in store.currentItems" 
          :key="item.id || index" 
          :item="item"
          :class="{ 'is-outlier': index === store.outlierIndex, 'is-decoy': index !== store.outlierIndex && store.isHintActive }"
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

const store = useGameStore();

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
}

.game-header {
  width: 100%;
  max-width: 400px;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-controls {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.iq-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.iq-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #7f8c8d;
  letter-spacing: 2px;
}

.iq-value {
  font-size: 1.8rem;
  font-weight: 900;
  color: #3498db;
  line-height: 1;
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
  transform: scale(1.1);
  filter: drop-shadow(0 0 10px #f1c40f);
}

@media (max-width: 350px) {
  .items-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
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
