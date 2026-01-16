<template>
  <div class="sequence-mode">
    <div class="mode-header">
      <button class="back-btn" @click="goBack">← Back</button>
      <div class="score-display">Score: {{ score }}</div>
    </div>

    <div class="challenge-container">
      <h2 class="challenge-title">What comes next?</h2>
      
      <div class="sequence-display">
        <div 
          v-for="(item, index) in currentChallenge.sequence" 
          :key="index"
          class="sequence-item"
        >
          {{ item }}
        </div>
        <div class="sequence-item question">?</div>
      </div>

      <div class="options-grid">
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
        <span v-else class="wrong-msg">✗ Wrong! The answer was {{ currentChallenge.correctAnswer }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameStore, GameState } from '../../store/gameStore';
import { SequenceGenerator, type SequenceChallenge } from './sequenceGenerator';

const store = useGameStore();
const generator = new SequenceGenerator();

const score = ref(0);
const currentChallenge = ref<SequenceChallenge>(generator.generateChallenge(1));
const selectedAnswer = ref<string | number | null>(null);
const showResult = ref(false);
const isCorrect = ref(false);

function selectAnswer(answer: string | number) {
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
  currentChallenge.value = generator.generateChallenge(Math.floor(score.value / 5) + 1);
  selectedAnswer.value = null;
  showResult.value = false;
  isCorrect.value = false;
}

function goBack() {
  store.gameState = GameState.MENU;
}

onMounted(() => {
  currentChallenge.value = generator.generateChallenge(1);
});
</script>

<style scoped>
.sequence-mode {
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
}

.sequence-display {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
}

.sequence-item {
  width: 80px;
  height: 80px;
  background: white;
  border: 4px solid var(--primary-color);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 900;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}

.sequence-item.question {
  background: #f1c40f;
  color: white;
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
  font-size: 1.5rem;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}

.option-btn:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 8px 0 rgba(0,0,0,0.15);
}

.option-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 0 rgba(0,0,0,0.1);
}

.option-btn.correct {
  background: #2ecc71;
  border-color: #27ae60;
  color: white;
}

.option-btn.wrong {
  background: #e74c3c;
  border-color: #c0392b;
  color: white;
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
  .sequence-item {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
