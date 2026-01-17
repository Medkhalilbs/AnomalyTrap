<template>
  <div class="main-menu">
    <div class="title-container">
      <h1 class="game-title">ANOMALY<span>TRAP</span></h1>
      <p class="tagline">Test your peak logic capacity</p>
    </div>

    <div class="stats-card">
      <div class="stat-item">
        <span class="stat-label">HIGHSCORE</span>
        <span class="stat-value">{{ store.highscore }}</span>
      </div>
    </div>

    <div class="goals-section">
      <h3>YOUR GOALS</h3>
      <div class="goals-list">
        <div 
          v-for="goal in store.activeGoals.slice(0, 3)" 
          :key="goal.id"
          class="goal-card"
          :class="{ completed: goal.completed }"
        >
            <div class="goal-icon">{{ goal.icon }}</div>
            <div class="goal-info">
                <span class="goal-desc">{{ goal.description }}</span>
                <div class="rating-bar">
                    <div class="rating-fill" :style="{ width: Math.min((goal.current / goal.target) * 100, 100) + '%' }"></div>
                </div>
            </div>
            <div class="goal-progress" v-if="!goal.completed">{{ goal.current }}/{{ goal.target }}</div>
            <div class="goal-reward" v-else>{{ goal.reward }}</div>
        </div>
      </div>
    </div>

    <!-- Achievements Removed -->

    <div class="menu-actions">
      <button class="play-button" @click="showModeSelector = true">
        SELECT MODE
      </button>
      <button class="tutorial-button" @click="showTutorial = true">
        HOW TO PLAY
      </button>
    </div>

    <ModeSelector v-if="showModeSelector" @close="showModeSelector = false" />
    <TutorialOverlay v-if="showTutorial" @close="showTutorial = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGameStore } from '../store/gameStore';
import TutorialOverlay from './TutorialOverlay.vue';
import ModeSelector from './ModeSelector.vue';

const store = useGameStore();
const showTutorial = ref(false);
const showModeSelector = ref(false);
</script>

<style scoped>
.main-menu {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: radial-gradient(circle at center, #2c3e50 0%, #000000 100%);
  color: white;
  text-align: center;
  overflow: hidden;
}

.main-menu::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(52, 152, 219, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 80% 70%, rgba(46, 204, 113, 0.1) 0%, transparent 20%);
  z-index: 0;
  animation: bgPulse 10s infinite alternate;
}

@keyframes bgPulse {
  0% { opacity: 0.5; transform: scale(1); }
  100% { opacity: 1; transform: scale(1.1); }
}

.title-container {
  margin-bottom: 50px;
  z-index: 1;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.game-title {
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: -3px;
  margin: 0;
  line-height: 1;
  background: linear-gradient(135deg, #fff 0%, #bdc3c7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.game-title span {
  background: linear-gradient(135deg, var(--primary-color) 0%, #2980b9 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tagline {
  font-size: 1rem;
  opacity: 0.8;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-top: 10px;
  font-weight: 300;
}

.stats-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 300px;
  border-radius: 24px;
  padding: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  border: 1px solid rgba(255,255,255,0.1);
  z-index: 1;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 0.8rem;
  font-weight: 800;
  opacity: 0.6;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 0 0 20px rgba(52, 152, 219, 0.5);
}

.achievements-section {
  width: 100%;
  max-width: 320px;
  margin-bottom: 40px;
  z-index: 1;
}

.achievements-section h3 {
  font-size: 0.8rem;
  letter-spacing: 2px;
  opacity: 0.4;
  margin-bottom: 20px;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.badge-icon {
  width: 55px;
  height: 55px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.badge.locked .badge-icon {
  background: rgba(0, 0, 0, 0.2);
  opacity: 0.3;
  font-size: 1.2rem;
}

.badge:not(.locked):hover .badge-icon {
  transform: translateY(-5px) scale(1.1);
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.badge-name {
  font-size: 0.6rem;
  font-weight: 700;
  opacity: 0.6;
}

.menu-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 280px;
  z-index: 1;
}

.play-button {
  background: linear-gradient(135deg, var(--primary-color) 0%, #2980b9 100%);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 22px;
  font-size: 1.4rem;
  font-weight: 900;
  letter-spacing: 3px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(52, 152, 219, 0.4);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.play-button::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(rgba(255,255,255,0.2), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

.play-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(52, 152, 219, 0.5);
}

.play-button:active {
  transform: translateY(2px);
  box-shadow: 0 5px 15px rgba(52, 152, 219, 0.3);
}

.tutorial-button {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 15px;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.2s;
}

.tutorial-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
}

.goals-section {
    width: 100%;
    max-width: 340px;
    margin-bottom: 30px;
    z-index: 1;
}

.goals-section h3 {
    font-size: 0.8rem;
    letter-spacing: 2px;
    opacity: 0.6;
    margin-bottom: 15px;
    text-align: left;
    padding-left: 10px;
}

.goals-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.goal-card {
    background: rgba(255, 255, 255, 0.08);
    border-radius: 16px;
    padding: 12px 15px;
    display: flex;
    align-items: center;
    gap: 15px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: transform 0.2s;
}

.goal-card.completed {
    background: rgba(46, 204, 113, 0.2);
    border-color: rgba(46, 204, 113, 0.3);
}

.goal-icon {
    font-size: 1.5rem;
}

.goal-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    text-align: left;
}

.goal-desc {
    font-size: 0.85rem;
    font-weight: 600;
}

.rating-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.rating-fill {
    height: 100%;
    background: var(--primary-color);
}

.completed .rating-fill {
    background: #2ecc71;
}

.goal-progress {
    font-size: 0.8rem;
    opacity: 0.7;
    font-weight: 700;
}

.goal-reward {
    font-size: 1.2rem;
    animation: bounce 0.5s;
}

@keyframes bounce {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
}

</style>
