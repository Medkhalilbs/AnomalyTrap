<template>
  <div class="game-board-container">
    <div class="score-display">
      <div class="current-score">{{ store.score }}</div>
      <div class="highscore">Best: {{ store.highscore }}</div>
    </div>
    
    <div class="grid-container">
      <div class="items-grid">
        <LogicItem 
          v-for="(item, index) in store.currentItems" 
          :key="item.id" 
          :item="item"
          @tap="handleTap(index)"
        />
      </div>
    </div>

    <FeedbackOverlay v-if="store.lastCorrect" type="success" />
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../store/gameStore';
import LogicItem from './LogicItem.vue';
import FeedbackOverlay from './FeedbackOverlay.vue';

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
  padding: 20px 0;
  box-sizing: border-box;
}

.score-display {
  text-align: center;
  margin-top: 20px;
}

.current-score {
  font-size: 5rem;
  font-weight: 800;
  color: #2c3e50;
  line-height: 1;
}

.highscore {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-top: 5px;
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
  max-width: 400px;
  padding: 20px;
  justify-items: center;
}

/* Mobile-specific adjustments for the grid */
@media (max-width: 350px) {
  .items-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}
</style>
