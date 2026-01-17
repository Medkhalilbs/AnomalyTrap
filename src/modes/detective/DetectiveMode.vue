<template>
  <div class="detective-mode">
    <div class="mode-header">
      <button class="back-btn" @click="goBack" aria-label="Home">🏠</button>
      <div class="score-display">Score: {{ store.score }}</div>
    </div>

    <div class="story-card">
      <h2 class="story-title">{{ currentScenario.title }}</h2>
      <p class="story-text">{{ currentScenario.story }}</p>
    </div>

    <div class="suspects-grid">
      <button 
        v-for="suspect in currentScenario.suspects" 
        :key="suspect.id"
        class="suspect-card"
        :class="{ 
            selected: selectedSuspect === suspect.id,
            correct: selectedSuspect === suspect.id && showResult && suspect.isCulprit,
            wrong: selectedSuspect === suspect.id && showResult && !suspect.isCulprit
        }"
        @click="selectSuspect(suspect.id)"
        :disabled="showResult"
      >
        <div class="suspect-avatar">👤</div>
        <h3 class="suspect-name">{{ suspect.name }}</h3>
        <p class="suspect-info"><strong>Alibi:</strong> {{ suspect.alibi }}</p>
        <p class="suspect-info"><strong>Statement:</strong> {{ suspect.statement }}</p>
      </button>
    </div>

    <div class="feedback-overlay" v-if="showResult">
      <div class="feedback-content">
        <div class="feedback-icon">{{ isCorrect ? '🕵️‍♂️' : '❌' }}</div>
        <h2>{{ isCorrect ? 'CASE CLOSED' : 'WRONG SUSPECT' }}</h2>
        <p v-if="!isCorrect">The real culprit escaped!</p>
        <button class="next-btn" @click="nextLevel">
          {{ isCorrect ? 'NEXT CASE' : 'TRY AGAIN' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameStore, GameState } from '../../store/gameStore';
import { DetectiveGenerator, type DetectiveScenario } from './detectiveData';

const store = useGameStore();
const generator = new DetectiveGenerator();

function goBack() {
  store.gameState = GameState.MENU;
}

const currentScenario = ref<DetectiveScenario>(generator.generateChallenge(1));
const selectedSuspect = ref<string | null>(null);
const showResult = ref(false);
const isCorrect = ref(false);

function selectSuspect(id: string) {
  if (showResult.value) return;
  
  selectedSuspect.value = id;
  const suspect = currentScenario.value.suspects.find(s => s.id === id);
  
  if (suspect) {
    showResult.value = true;
    isCorrect.value = suspect.isCulprit;
    
    if (isCorrect.value) {
      store.engine?.addScore(100); // Higher points for solving a case
    } else {
      store.lives--;
      if (store.lives <= 0) {
        store.engine?.gameOver();
      }
    }
  }
}

function nextLevel() {
  showResult.value = false;
  selectedSuspect.value = null;
  currentScenario.value = generator.generateChallenge(1);
}

onMounted(() => {
    // Initial generation handled by ref init
});
</script>

<style scoped>
.detective-mode {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.back-btn {
  background: white;
  border: 2px solid var(--secondary-color);
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1.5rem;
}

.score-display {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-color);
}

.story-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.story-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-top: 0;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.story-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #fff;
  white-space: pre-wrap;
}

.suspects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.suspect-card {
  background: white;
  border: none;
  border-radius: 16px;
  padding: 20px;
  text-align: left;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.suspect-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.suspect-card.selected {
  border: 4px solid var(--primary-color);
}

.suspect-card.correct {
  background: #2ecc71;
  color: white;
}

.suspect-card.wrong {
  background: #e74c3c;
  color: white;
}

.suspect-avatar {
  font-size: 3rem;
  text-align: center;
}

.suspect-name {
  font-size: 1.2rem;
  margin: 0;
  color: #2c3e50;
  font-weight: 800;
}

.correct .suspect-name, .wrong .suspect-name {
  color: white;
}

.suspect-info {
  font-size: 0.9rem;
  color: #555;
  margin: 0;
  line-height: 1.4;
}

.correct .suspect-info, .wrong .suspect-info {
  color: rgba(255,255,255,0.9);
}

.feedback-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s;
}

.feedback-content {
  background: white;
  padding: 40px;
  border-radius: 24px;
  text-align: center;
  animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.feedback-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.next-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 800;
  cursor: pointer;
  margin-top: 20px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
