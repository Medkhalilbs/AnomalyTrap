<template>
  <div class="memory-mode">
    <div class="mode-header">
      <button class="back-btn" @click="goBack">← Back</button>
      <div class="score-display">Score: {{ score }}</div>
    </div>

    <div class="challenge-container">
      <h2 class="challenge-title" v-if="phase === 'memorize'">
        Memorize the grid! ({{ countdown }}s)
      </h2>
      <h2 class="challenge-title" v-else-if="phase === 'question'">
        What was at position ({{ currentChallenge.questionPosition.row + 1 }}, {{ currentChallenge.questionPosition.col + 1 }})?
      </h2>
      
      <!-- Grid Display (shown during memorize phase) -->
      <div v-if="phase === 'memorize'" class="memory-grid">
        <div 
          v-for="(row, rowIndex) in currentChallenge.grid" 
          :key="rowIndex"
          class="grid-row"
        >
          <div 
            v-for="(cell, colIndex) in row" 
            :key="colIndex"
            class="grid-cell"
          >
            {{ cell }}
          </div>
        </div>
      </div>

      <!-- Question Grid (shown during question phase with highlighted position) -->
      <div v-if="phase === 'question'" class="memory-grid">
        <div 
          v-for="(_row, rowIndex) in currentChallenge.grid" 
          :key="rowIndex"
          class="grid-row"
        >
          <div 
            v-for="(_cell, colIndex) in _row" 
            :key="colIndex"
            class="grid-cell question-cell"
            :class="{ highlighted: rowIndex === currentChallenge.questionPosition.row && colIndex === currentChallenge.questionPosition.col }"
          >
            ?
          </div>
        </div>
      </div>

      <!-- Answer Options -->
      <div v-if="phase === 'question'" class="options-grid">
        <button
          v-for="(option, index) in currentChallenge.options"
          :key="index"
          class="option-btn"
          :class="{ correct: showResult && option === currentChallenge.correctAnswer, wrong: showResult && selectedAnswer === option && option !== currentChallenge.correctAnswer }"
          @click="selectAnswer(option)"
          :disabled="showResult"
        >
          {{ option }}
        </button>
      </div>

      <div v-if="showResult" class="result-message">
        <span v-if="isCorrect" class="correct-msg">✓ Correct!</span>
        <span v-else class="wrong-msg">✗ Wrong!</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameStore, GameState } from '../../store/gameStore';
import { MemoryGenerator, type MemoryChallenge } from './memoryGenerator';

const store = useGameStore();
const generator = new MemoryGenerator();

const score = ref(0);
const currentChallenge = ref<MemoryChallenge>(generator.generateChallenge(1));
const phase = ref<'memorize' | 'question'>('memorize');
const countdown = ref(3);
const selectedAnswer = ref<string | null>(null);
const showResult = ref(false);
const isCorrect = ref(false);

function startMemorizePhase() {
  phase.value = 'memorize';
  countdown.value = 3;
  
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(interval);
      phase.value = 'question';
    }
  }, 1000);
}

function selectAnswer(answer: string) {
  if (showResult.value) return;
  
  selectedAnswer.value = answer;
  isCorrect.value = answer === currentChallenge.value.correctAnswer;
  showResult.value = true;

  if (isCorrect.value) {
    score.value++;
  }

  setTimeout(() => {
    nextChallenge();
  }, 1500);
}

function nextChallenge() {
  currentChallenge.value = generator.generateChallenge(1);
  selectedAnswer.value = null;
  showResult.value = false;
  isCorrect.value = false;
  startMemorizePhase();
}

function goBack() {
  store.gameState = GameState.MENU;
}

onMounted(() => {
  startMemorizePhase();
});
</script>

<style scoped>
.memory-mode {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  padding: 20px;
}

.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.back-btn {
  background: white;
  border: 2px solid var(--secondary-color);
  border-radius: 12px;
  padding: 10px 20px;
  font-weight: 700;
  cursor: pointer;
}

.score-display {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-color);
}

.challenge-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.challenge-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--secondary-color);
  margin-bottom: 30px;
  text-align: center;
}

.memory-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.grid-row {
  display: flex;
  gap: 10px;
}

.grid-cell {
  width: 80px;
  height: 80px;
  background: white;
  border: 4px solid var(--primary-color);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}

.grid-cell.question-cell {
  background: #ecf0f1;
  font-size: 2rem;
  font-weight: 900;
  color: #95a5a6;
}

.grid-cell.highlighted {
  background: #f1c40f;
  border-color: #f39c12;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  width: 100%;
  max-width: 400px;
}

.option-btn {
  background: white;
  border: 4px solid var(--secondary-color);
  border-radius: 16px;
  padding: 20px;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}

.option-btn:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 0 rgba(0,0,0,0.15);
}

.option-btn.correct {
  background: #2ecc71;
  border-color: #27ae60;
}

.option-btn.wrong {
  background: #e74c3c;
  border-color: #c0392b;
}

.result-message {
  margin-top: 20px;
  font-size: 1.2rem;
  font-weight: 800;
}

.correct-msg {
  color: #2ecc71;
}

.wrong-msg {
  color: #e74c3c;
}

@media (max-width: 600px) {
  .grid-cell {
    width: 60px;
    height: 60px;
    font-size: 1.8rem;
  }
  
  .options-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
