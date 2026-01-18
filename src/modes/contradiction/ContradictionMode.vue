<template>
  <div class="contradiction-mode" :dir="store.language === 'ar' ? 'rtl' : 'ltr'">
    <div class="mode-header">
      <button class="back-btn" @click="goBack" aria-label="Home">🏠</button>
      <div class="score-display">
        <span class="label">{{ t('score') }}</span>
        <span class="value">{{ store.score }}</span>
      </div>
    </div>

    <div class="puzzle-container">
      <div class="header-card">
        <div class="logic-badge">LOGIC TEST</div>
        <h2>{{ t('logicCheck') || 'CONTRADICTION FOUND' }}</h2>
        <p class="description">{{ currentChallenge.description }}</p>
      </div>

      <div class="statements-list">
        <div 
          v-for="stmt in currentChallenge.statements" 
          :key="stmt.id"
          class="statement-card"
          :class="{ 
              selected: selectedStmt === stmt.id,
              correct: selectedStmt === stmt.id && showResult && stmt.isContradiction,
              wrong: selectedStmt === stmt.id && showResult && !stmt.isContradiction,
              'reveal-correct': showResult && stmt.isContradiction
          }"
          @click="selectStatement(stmt.id)"
        >
          <div class="statement-marker">
            <span v-if="selectedStmt === stmt.id && !showResult">●</span>
            <span v-else-if="showResult && stmt.isContradiction">✓</span>
            <span v-else-if="showResult && selectedStmt === stmt.id">✗</span>
            <span v-else>?</span>
          </div>
          <p class="statement-text">{{ stmt.text }}</p>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div class="feedback-overlay" v-if="showResult">
        <div class="feedback-content" :class="{ 'success': isCorrect, 'error': !isCorrect }">
          <div class="feedback-icon">{{ isCorrect ? '🔍' : '⚠️' }}</div>
          <h2>{{ isCorrect ? t('contradictionFound') : t('logicError') }}</h2>
          <button class="next-btn" @click="nextLevel">
            {{ isCorrect ? t('nextPuzzle') : t('tryAgain') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameStore, GameState } from '../../store/gameStore';
import { ContradictionGenerator, type ContradictionChallenge } from './contradictionData';
import { translations } from '../../utils/i18n';
import { sounds } from '../../utils/sounds';

const store = useGameStore();
const generator = new ContradictionGenerator();

function t(key: keyof typeof translations['en']) {
    return (translations[store.language] as any)[key] || (translations['en'] as any)[key];
}

function goBack() {
  sounds.playMenuClick();
  store.gameState = GameState.MENU;
}

const currentChallenge = ref<ContradictionChallenge>(generator.generateChallenge(1, store.language as any));
const selectedStmt = ref<string | null>(null);
const showResult = ref(false);
const isCorrect = ref(false);

function selectStatement(id: string) {
  if (showResult.value) return;
  
  sounds.playTap();
  selectedStmt.value = id;
  const stmt = currentChallenge.value.statements.find(s => s.id === id);
  
  if (stmt) {
    showResult.value = true;
    isCorrect.value = stmt.isContradiction;
    
    if (isCorrect.value) {
      sounds.playSuccess();
      store.addScore(50);
    } else {
      sounds.playError();
      store.lives--;
      if (store.lives <= 0) {
        store.endGame();
      }
    }
  }
}

function nextLevel() {
  sounds.playMenuClick();
  showResult.value = false;
  selectedStmt.value = null;
  currentChallenge.value = generator.generateChallenge(1, store.language as any);
}

onMounted(() => {
    // Initial generation handled by ref init
});
</script>

<style scoped>
.contradiction-mode {
  width: 100%;
  height: 100%;
  background: #1a1a2e;
  color: #fff;
  padding: 20px;
  overflow-y: auto;
}

.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 600px;
  margin: 0 auto 30px;
}

.back-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  font-size: 1.5rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.score-display {
  text-align: right;
}

.score-display .label {
  font-size: 0.8rem;
  opacity: 0.5;
  display: block;
}

.score-display .value {
  font-size: 2rem;
  font-weight: 900;
  color: var(--primary-color);
}

.puzzle-container {
  max-width: 600px;
  margin: 0 auto;
}

.header-card {
  background: rgba(255,255,255,0.05);
  padding: 30px;
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 30px;
  text-align: center;
}

.logic-badge {
    background: var(--primary-color);
    color: #fff;
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: bold;
    margin-bottom: 15px;
}

.header-card h2 {
  font-size: 1.8rem;
  margin: 0 0 15px 0;
  letter-spacing: 2px;
}

.description {
  font-size: 1.1rem;
  line-height: 1.5;
  opacity: 0.8;
}

.statements-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.statement-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.statement-card:hover:not(.showResult) {
    background: rgba(255,255,255,0.08);
    transform: translateX(5px);
}

.statement-card.selected {
    border-color: var(--primary-color);
    background: rgba(255,255,255,0.1);
}

.statement-card.correct {
    background: rgba(46, 204, 113, 0.1);
    border-color: #2ecc71;
}

.statement-card.wrong {
    background: rgba(231, 76, 60, 0.1);
    border-color: #e74c3c;
}

.statement-card.reveal-correct {
  animation: glow-correct 1s infinite alternate;
}

@keyframes glow-correct {
  from { border-color: #2ecc71; box-shadow: 0 0 0 transparent; }
  to { border-color: #2ecc71; box-shadow: 0 0 10px rgba(46,204,113,0.3); }
}

.statement-marker {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
}

.correct .statement-marker { background: #2ecc71; }
.wrong .statement-marker { background: #e74c3c; }

.statement-text {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.4;
}

.feedback-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.feedback-content {
  background: #2c3e50;
  padding: 40px;
  border-radius: 24px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  border: 1px solid rgba(255,255,255,0.1);
}

.feedback-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.next-btn {
  background: var(--primary-color);
  color: #fff;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 20px;
  width: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
