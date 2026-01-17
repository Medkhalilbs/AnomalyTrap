<template>
  <div class="contradiction-mode">
    <div class="header-card">
      <h2>Logic Check</h2>
      <p>{{ currentChallenge.description }}</p>
    </div>

    <div class="statements-list">
      <div 
        v-for="stmt in currentChallenge.statements" 
        :key="stmt.id"
        class="statement-card"
        :class="{ 
            selected: selectedStmt === stmt.id,
            correct: selectedStmt === stmt.id && showResult && stmt.isContradiction,
            wrong: selectedStmt === stmt.id && showResult && !stmt.isContradiction
        }"
        @click="selectStatement(stmt.id)"
      >
        <div class="statement-icon">⚠️</div>
        <p class="statement-text">{{ stmt.text }}</p>
      </div>
    </div>

    <div class="feedback-overlay" v-if="showResult">
      <div class="feedback-content">
        <div class="feedback-icon">{{ isCorrect ? '✅' : '❌' }}</div>
        <h2>{{ isCorrect ? 'CONTRADICTION FOUND' : 'LOGIC ERROR' }}</h2>
        <button class="next-btn" @click="nextLevel">
          {{ isCorrect ? 'NEXT PUZZLE' : 'TRY AGAIN' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameStore } from '../../store/gameStore';
import { ContradictionGenerator, type ContradictionChallenge } from './contradictionData';

const store = useGameStore();
const generator = new ContradictionGenerator();

const currentChallenge = ref<ContradictionChallenge>(generator.generateChallenge(1));
const selectedStmt = ref<string | null>(null);
const showResult = ref(false);
const isCorrect = ref(false);

function selectStatement(id: string) {
  if (showResult.value) return;
  
  selectedStmt.value = id;
  const stmt = currentChallenge.value.statements.find(s => s.id === id);
  
  if (stmt) {
    showResult.value = true;
    isCorrect.value = stmt.isContradiction;
    
    if (isCorrect.value) {
      store.engine?.addScore(50);
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
  selectedStmt.value = null;
  currentChallenge.value = generator.generateChallenge(1);
}

onMounted(() => {
    //
});
</script>

<style scoped>
.contradiction-mode {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-card {
  text-align: center;
  margin-bottom: 20px;
}

.header-card h2 {
    font-size: 2rem;
    color: var(--primary-color);
    margin: 0 0 10px 0;
    text-transform: uppercase;
    letter-spacing: 2px;
}

.header-card p {
    font-size: 1.1rem;
    opacity: 0.8;
}

.statements-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.statement-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 6px solid transparent;
}

.statement-card:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.statement-card.selected {
    background: #f0f0f0;
}

.statement-card.correct {
  border-left-color: #2ecc71;
  background: #e8f8f5;
}

.statement-card.wrong {
  border-left-color: #e74c3c;
  background: #fdedec;
}

.statement-icon {
    font-size: 1.5rem;
    opacity: 0.5;
}

.statement-text {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
    font-weight: 500;
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
}

.feedback-content {
  background: white;
  padding: 40px;
  border-radius: 24px;
  text-align: center;
}

.feedback-icon {
    font-size: 3rem;
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
</style>
