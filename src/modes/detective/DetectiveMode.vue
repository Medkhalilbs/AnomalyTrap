<template>
  <div class="detective-mode" :dir="store.language === 'ar' ? 'rtl' : 'ltr'">
    <div class="mode-header">
      <button class="back-btn" @click="goBack" aria-label="Home">🏠</button>
      <div class="score-display">
        <span class="label">{{ t('score') }}</span>
        <span class="value">{{ store.score }}</span>
      </div>
    </div>

    <div class="case-container">
      <div class="case-file">
        <div class="file-tab">{{ t('caseFile') || 'CASE FILE' }} #{{ currentScenario.id.slice(0,4).toUpperCase() }}</div>
        
        <div class="file-content">
          <div class="stamp" :class="{ solved: isCorrect, failed: showResult && !isCorrect }">
            {{ isCorrect ? 'SOLVED' : (showResult && !isCorrect ? 'FAILED' : 'OPEN') }}
          </div>

          <h2 class="story-title">{{ currentScenario.title }}</h2>
          <div class="divider"></div>
          <p class="story-text">{{ currentScenario.story }}</p>
        </div>
      </div>

      <div class="evidence-section">
        <h3 class="section-title">🕵️ {{ t('suspects') || 'SUSPECTS' }}</h3>
        <div class="suspects-grid">
          <div 
            v-for="suspect in currentScenario.suspects" 
            :key="suspect.id"
            class="suspect-card"
            :class="{ 
                selected: selectedSuspect === suspect.id,
                correct: selectedSuspect === suspect.id && showResult && suspect.isCulprit,
                wrong: selectedSuspect === suspect.id && showResult && !suspect.isCulprit,
                'reveal-correct': showResult && suspect.isCulprit
            }"
            @click="selectSuspect(suspect.id)"
          >
            <div class="suspect-header">
              <div class="suspect-avatar">👤</div>
              <h3 class="suspect-name">{{ suspect.name }}</h3>
            </div>
            
            <div class="suspect-details">
              <div class="info-block">
                <span class="info-label">{{ t('alibi') || 'ALIBI' }}:</span>
                <p class="info-text">{{ suspect.alibi }}</p>
              </div>
              <div class="info-block">
                <span class="info-label">{{ t('statement') || 'STATEMENT' }}:</span>
                <p class="info-text">{{ suspect.statement }}</p>
              </div>
            </div>

            <div class="selection-indicator">
              <span v-if="selectedSuspect === suspect.id && !showResult">SELECTED</span>
              <span v-if="showResult && suspect.isCulprit">TARGET</span>
              <span v-if="showResult && selectedSuspect === suspect.id && !suspect.isCulprit">WRONG</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div class="feedback-overlay" v-if="showResult">
        <div class="feedback-content" :class="{ 'success': isCorrect, 'error': !isCorrect }">
          <div class="feedback-icon">{{ isCorrect ? '🏆' : '👮' }}</div>
          <h2>{{ isCorrect ? t('caseClosed') : t('wrongSuspect') }}</h2>
          <p v-if="!isCorrect">{{ t('realCulpritEscaped') }}</p>
          <button class="next-btn" @click="nextLevel">
            {{ isCorrect ? t('nextCase') : t('tryAgain') }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameStore, GameState } from '../../store/gameStore';
import { DetectiveGenerator, type DetectiveScenario } from './detectiveData';
import { translations } from '../../utils/i18n';
import { sounds } from '../../utils/sounds';

const store = useGameStore();
const generator = new DetectiveGenerator();

function t(key: keyof typeof translations['en']) {
    return (translations[store.language] as any)[key] || (translations['en'] as any)[key];
}

function goBack() {
  sounds.playMenuClick();
  store.gameState = GameState.MENU;
}

const currentScenario = ref<DetectiveScenario>(generator.generateChallenge(1, store.language as any));
const selectedSuspect = ref<string | null>(null);
const showResult = ref(false);
const isCorrect = ref(false);

function selectSuspect(id: string) {
  if (showResult.value) return;
  
  sounds.playTap();
  selectedSuspect.value = id;
  const suspect = currentScenario.value.suspects.find(s => s.id === id);
  
  if (suspect) {
    showResult.value = true;
    isCorrect.value = suspect.isCulprit;
    
    if (isCorrect.value) {
      sounds.playSuccess();
      store.addScore(100);
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
  selectedSuspect.value = null;
  currentScenario.value = generator.generateChallenge(1, store.language as any);
}

onMounted(() => {
    // Initial generation handled by ref init
});
</script>

<style scoped>
.detective-mode {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #fdf6e3;
  color: #2c3e50;
  overflow-y: auto;
  font-family: 'Courier New', Courier, monospace;
}

.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto 30px;
}

.back-btn {
  background: #fff;
  border: 2px solid #333;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 2px 2px 0 #333;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.score-display .label {
  font-size: 0.8rem;
  font-weight: bold;
  opacity: 0.6;
}

.score-display .value {
  font-size: 2rem;
  font-weight: 900;
  color: #2c3e50;
}

.case-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.case-file {
  background: #fff;
  border: 1px solid #d3c6a3;
  box-shadow: 5px 5px 15px rgba(0,0,0,0.1);
  position: relative;
  padding-top: 30px;
}

.file-tab {
  position: absolute;
  top: -30px;
  left: 0;
  background: #d3c6a3;
  padding: 5px 20px;
  font-weight: bold;
  font-size: 0.9rem;
  clip-path: polygon(0% 0%, 80% 0%, 100% 100%, 0% 100%);
}

.file-content {
  padding: 40px;
  position: relative;
}

.stamp {
  position: absolute;
  top: 20px;
  right: 20px;
  border: 4px solid #333;
  padding: 5px 15px;
  font-size: 1.5rem;
  font-weight: 900;
  transform: rotate(15deg);
  opacity: 0.2;
}

.stamp.solved {
  border-color: #2ecc71;
  color: #2ecc71;
  opacity: 0.8;
}

.stamp.failed {
  border-color: #e74c3c;
  color: #e74c3c;
  opacity: 0.8;
}

.story-title {
  font-size: 1.8rem;
  margin-top: 0;
  margin-bottom: 20px;
}

.divider {
  height: 2px;
  background: #eee;
  margin: 20px 0;
}

.story-text {
  font-size: 1.2rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.section-title {
  font-size: 1.4rem;
  margin-bottom: 20px;
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
}

.suspects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding-bottom: 40px;
}

.suspect-card {
  background: #fff;
  border: 2px solid #eee;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
}

.suspect-card:hover:not(.showResult) {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  border-color: #333;
}

.suspect-card.selected {
  border-color: #333;
  background: #f9f9f9;
}

.suspect-card.correct {
  background: #e8f8f5;
  border-color: #2ecc71;
}

.suspect-card.wrong {
  background: #fdedec;
  border-color: #e74c3c;
}

.suspect-card.reveal-correct {
  animation: pulse-correct 1s infinite alternate;
}

@keyframes pulse-correct {
  from { border-color: #2ecc71; box-shadow: 0 0 0 transparent; }
  to { border-color: #2ecc71; box-shadow: 0 0 15px rgba(46,204,113,0.5); }
}

.suspect-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.suspect-avatar {
  font-size: 2.5rem;
  background: #eee;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.suspect-name {
  font-size: 1.2rem;
  margin: 0;
}

.suspect-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-block {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.info-label {
  font-size: 0.7rem;
  font-weight: 800;
  opacity: 0.5;
}

.info-text {
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.selection-indicator {
    position: absolute;
    bottom: 10px;
    right: 15px;
    font-size: 0.6rem;
    font-weight: bold;
    opacity: 0.5;
}

.feedback-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.feedback-content {
  background: #fff;
  padding: 40px;
  border-radius: 4px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  border: 2px solid #333;
  box-shadow: 10px 10px 0 #333;
}

.feedback-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.next-btn {
  background: #333;
  color: #fff;
  border: none;
  padding: 15px 30px;
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

@media (max-width: 600px) {
  .file-content {
    padding: 20px;
  }
  .story-title {
    font-size: 1.4rem;
  }
  .story-text {
    font-size: 1rem;
  }
  .suspects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
