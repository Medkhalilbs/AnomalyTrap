<template>
  <div class="main-menu">
    <div class="title-container">
      <h1 class="game-title">ANOMALY<span>TRAP</span></h1>
      <p class="tagline">Test your peak logic capacity</p>
    </div>

    <div class="stats-card">
      <div class="stat-item">
        <span class="stat-label">BEST IQ</span>
        <span class="stat-value">{{ Math.round(100 + (store.highscore * 2.5)) }}</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <span class="stat-label">HIGHSCORE</span>
        <span class="stat-value">{{ store.highscore }}</span>
      </div>
    </div>

    <div class="achievements-section">
      <h3>ACHIEVEMENTS</h3>
      <div class="badges-grid">
        <div 
          v-for="ach in store.achievements" 
          :key="ach.id" 
          class="badge"
          :class="{ locked: !ach.unlocked }"
          :title="ach.description"
        >
          <span class="badge-icon">{{ ach.unlocked ? ach.icon : '🔒' }}</span>
          <span class="badge-name">{{ ach.name }}</span>
        </div>
      </div>
    </div>

    <div class="menu-actions">
      <button class="play-button" @click="store.startGame()">
        START GAME
      </button>
      <button class="tutorial-button" @click="showTutorial = true">
        HOW TO PLAY
      </button>
    </div>

    <TutorialOverlay v-if="showTutorial" @close="showTutorial = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '../store/gameStore';
import TutorialOverlay from './TutorialOverlay.vue';

const store = useGameStore();
const showTutorial = ref(false);
</script>

<style scoped>
.main-menu {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--bg-color);
  color: var(--secondary-color);
  text-align: center;
}

.title-container {
  margin-bottom: 40px;
}

.game-title {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -2px;
  margin: 0;
  line-height: 1;
}

.game-title span {
  color: var(--primary-color);
}

.tagline {
  font-size: 0.9rem;
  opacity: 0.6;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 5px;
}

.stats-card {
  background: white;
  width: 100%;
  max-width: 320px;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-around;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 700;
  opacity: 0.5;
  letter-spacing: 1px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-color);
}

.stat-divider {
  width: 1px;
  background: rgba(0,0,0,0.05);
}

.achievements-section {
  width: 100%;
  max-width: 320px;
  margin-bottom: 40px;
}

.achievements-section h3 {
  font-size: 0.8rem;
  letter-spacing: 2px;
  opacity: 0.4;
  margin-bottom: 15px;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.badge-icon {
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  transition: transform 0.2s;
}

.badge.locked .badge-icon {
  background: #f0f0f0;
  box-shadow: none;
  opacity: 0.5;
}

.badge-name {
  font-size: 0.6rem;
  font-weight: 700;
  opacity: 0.7;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.menu-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 280px;
}

.play-button {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 18px;
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 2px;
  cursor: pointer;
  box-shadow: 0 6px 0 var(--secondary-color);
  transition: transform 0.1s;
}

.play-button:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 var(--secondary-color);
}

.tutorial-button {
  background: transparent;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
  opacity: 0.6;
  border-radius: 15px;
  padding: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .stats-card, .badge-icon {
    background: #2c3e50;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }
  .stat-divider {
    background: rgba(255,255,255,0.05);
  }
  .stat-label {
    opacity: 0.7;
  }
}
</style>
