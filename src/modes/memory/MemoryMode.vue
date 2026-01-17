<template>
  <div class="memory-mode">
    <div class="mode-header">
      <button class="back-btn" @click="goBack" aria-label="Home">🏠</button>
      <div class="score-display">Score: {{ score }}</div>
    </div>

    <!-- MAIN CONTAINER -->
    <div class="challenge-container">
      
      <!-- INSTRUCTIONS / STATUS -->
      <h2 class="challenge-title" v-if="currentChallenge.type === 'grid'">
        <span v-if="phase === 'memorize'">Memorize the grid! ({{ countdown }}s)</span>
        <span v-else-if="phase === 'question'">What was here? ({{ currentChallenge.questionPosition!.row + 1 }}, {{ currentChallenge.questionPosition!.col + 1 }})</span>
        <span v-else-if="phase === 'result'">{{ isCorrect ? 'Correct!' : 'Wrong!' }}</span>
      </h2>
      <h2 class="challenge-title" v-else>
        <span v-if="phase === 'watch'">Watch the pattern...</span>
        <span v-else-if="phase === 'repeat'">Repeat the pattern!</span>
        <span v-else-if="phase === 'result'">{{ isCorrect ? 'Sequence Complete!' : 'Wrong Step!' }}</span>
      </h2>

      <!-- GRID DISPLAY -->
      <!-- Shared grid structure but different behavior -->
      <div class="memory-grid" :class="{ 'sequence-grid': currentChallenge.type === 'sequence' }">
        <div 
          v-for="(row, rowIndex) in currentChallenge.grid" 
          :key="rowIndex"
          class="grid-row"
        >
          <div 
            v-for="(cell, colIndex) in row" 
            :key="colIndex"
            class="grid-cell"
            :class="getCellClasses(rowIndex, colIndex)"
            @click="onCellClick(rowIndex, colIndex)"
          >
            <!-- Show content only for Grid Memory during memorize phase or if it's the sequence flash -->
            <span v-if="shouldShowContent()">{{ cell }}</span>
            <span v-else-if="isQuestionCell(rowIndex, colIndex)">?</span>
          </div>
        </div>
      </div>

      <!-- GRID ANSWER OPTIONS (Only for Grid Memory) -->
      <div v-if="currentChallenge.type === 'grid' && (phase === 'question' || phase === 'result')" class="options-grid">
        <button
          v-for="(option, index) in currentChallenge.options"
          :key="index"
          class="option-btn"
          :class="{ 
            correct: showResult && option === currentChallenge.correctAnswer, 
            wrong: showResult && selectedAnswer === option && option !== currentChallenge.correctAnswer 
          }"
          @click="selectGridAnswer(option)"
          :disabled="showResult"
        >
          {{ option }}
        </button>
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

// State
const score = ref(0);
const difficulty = ref(1);
const currentChallenge = ref<MemoryChallenge>(generator.generateChallenge(1));
const phase = ref<'memorize' | 'question' | 'watch' | 'repeat' | 'result'>('memorize');
const countdown = ref(3);

// Grid Memory State
const selectedAnswer = ref<string | null>(null);

// Sequence Memory State
const activeSequenceStep = ref<number | null>(null); // For flashing lights
const userSequenceIndex = ref(0); // How far user has gotten

const showResult = ref(false);
const isCorrect = ref(false);

// Methods

function startChallenge() {
  // Reset state
  showResult.value = false;
  selectedAnswer.value = null;
  activeSequenceStep.value = null;
  userSequenceIndex.value = 0;
  
  // Generate new
  currentChallenge.value = generator.generateChallenge(difficulty.value);
  
  if (currentChallenge.value.type === 'sequence') {
    startSequencePhase();
  } else {
    startGridPhase();
  }
}

// --- GRID MEMORY LOGIC ---

function startGridPhase() {
  phase.value = 'memorize';
  countdown.value = Math.max(3 - Math.floor(difficulty.value / 5), 1); // Speed up with difficulty
  
  const interval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(interval);
      phase.value = 'question';
    }
  }, 1000);
}

function selectGridAnswer(answer: string) {
  if (showResult.value) return;
  
  selectedAnswer.value = answer;
  isCorrect.value = answer === currentChallenge.value.correctAnswer;
  finishRound(isCorrect.value);
}

function isQuestionCell(r: number, c: number) {
  return currentChallenge.value.type === 'grid' && 
         phase.value === 'question' && 
         currentChallenge.value.questionPosition?.row === r && 
         currentChallenge.value.questionPosition?.col === c;
}

function shouldShowContent() {
  if (currentChallenge.value.type === 'sequence') return false; // Sequence cells are usually empty until lit
  if (phase.value === 'memorize') return true;
  return false;
}

// --- SEQUENCE MEMORY LOGIC ---

async function startSequencePhase() {
  phase.value = 'watch';
  await new Promise(r => setTimeout(r, 1000)); // Delay start
  
  const seq = currentChallenge.value.sequence || [];
  
  for (let i = 0; i < seq.length; i++) {
    // Flash cell
    await flashCell(seq[i]!.row, seq[i]!.col);
    await new Promise(r => setTimeout(r, 300)); // Pause between
  }
  
  phase.value = 'repeat';
}

async function flashCell(r: number, c: number) {
  // Hacky way to identify cell by index/coords to highlight it
  activeSequenceStep.value = r * 100 + c; // Simple encoding
  // Play sound here if possible
  if (window.navigator.vibrate) window.navigator.vibrate(50);
  
  await new Promise(r => setTimeout(r, 500));
  activeSequenceStep.value = null;
}

function onCellClick(r: number, c: number) {
  if (currentChallenge.value.type !== 'sequence' || phase.value !== 'repeat' || showResult.value) return;
  
  // Flash feedback
  activeSequenceStep.value = r * 100 + c;
  if (window.navigator.vibrate) window.navigator.vibrate(10);
  setTimeout(() => activeSequenceStep.value = null, 200);

  const seq = currentChallenge.value.sequence;
  if (!seq) return;

  const expected = seq[userSequenceIndex.value];
  if (!expected) return; // Should not happen if index logic is correct
  
  if (expected.row === r && expected.col === c) {
    // Correct step
    userSequenceIndex.value++;
    if (userSequenceIndex.value >= seq.length) {
      finishRound(true);
    }
  } else {
    // Wrong step
    finishRound(false);
  }
}

// --- COMMON LOGIC ---

function finishRound(win: boolean) {
  showResult.value = true;
  phase.value = 'result';
  isCorrect.value = win;
  
  if (win) {
    score.value++;
    store.addScore(10);
    difficulty.value += 0.5; // Gradual difficulty increase
    if (difficulty.value % 5 === 0) store.lives++; // Bonus life
  } else {
    store.lives--;
    if (window.navigator.vibrate) window.navigator.vibrate(200);
    if (store.lives <= 0) {
      setTimeout(() => store.endGame(), 1000);
      return;
    }
  }

  setTimeout(() => {
    startChallenge();
  }, 1500);
}

function getCellClasses(r: number, c: number) {
  const classes: any = {};
  
  if (currentChallenge.value.type === 'sequence') {
    // Highlight if active
    if (activeSequenceStep.value === r * 100 + c) {
      classes['highlighted'] = true;
    }
    classes['sequence-cell'] = true;
  } else {
    // Grid memory styling
    if (isQuestionCell(r, c)) classes['question-cell'] = true;
  }
  
  return classes;
}

function goBack() {
  store.gameState = GameState.MENU;
}

onMounted(() => {
  startChallenge();
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
  transition: transform 0.1s, background-color 0.2s;
}

/* Sequence Mode specific styling */
.sequence-cell {
  background: #34495e; /* Darker off state */
  border-color: #2c3e50;
  cursor: pointer;
}

.sequence-cell:active {
  transform: scale(0.95);
}

.grid-cell.question-cell {
  background: #ecf0f1;
  font-size: 2rem;
  font-weight: 900;
  color: #95a5a6;
}

.grid-cell.highlighted {
  background: #f1c40f; /* Yellow flash */
  border-color: #f39c12;
  box-shadow: 0 0 20px #f1c40f;
  transform: scale(1.05);
  z-index: 10;
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

@media (max-width: 380px) {
  .grid-cell {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
    border-width: 3px;
  }
  
  .grid-row {
     gap: 6px;
  }
  
  .memory-grid {
    gap: 6px;
  }
}
</style>
