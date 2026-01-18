<template>
  <div class="detective-mode" :dir="store.language === 'ar' ? 'rtl' : 'ltr'">
    <div class="mode-header">
      <button class="back-btn" @click="goBack" aria-label="Home">🏠</button>
      <div class="score-display">
        <span class="label">{{ t('score') }}</span>
        <span class="value">{{ store.score }}</span>
      </div>
    </div>

    <div class="main-container">
      <div class="case-card">
        <div class="case-badge">{{ t('caseFile') || 'CASE' }}</div>
        
        <div class="case-content">
          <div class="status-indicator" :class="{ solved: isCorrect, failed: showResult && !isCorrect }">
            {{ isCorrect ? '✓ SOLVED' : (showResult && !isCorrect ? '✗ FAILED' : '● OPEN') }}
          </div>

          <h2 class="case-title">{{ currentScenario.title }}</h2>
          <p class="case-story">{{ currentScenario.story }}</p>
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
            
            <div class="suspect-info">
              <div class="info-row">
                <span class="info-label">{{ t('alibi') || 'ALIBI' }}</span>
                <p class="info-text">{{ suspect.alibi }}</p>
              </div>
              <div class="info-row">
                <span class="info-label">{{ t('statement') || 'STATEMENT' }}</span>
                <p class="info-text">{{ suspect.statement }}</p>
              </div>
            </div>

            <div class="card-status" v-if="showResult">
              <span v-if="suspect.isCulprit">TARGET</span>
              <span v-else-if="selectedSuspect === suspect.id">WRONG</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div class="result-overlay" v-if="showResult">
        <div class="result-box" :class="{ 'success': isCorrect, 'error': !isCorrect }">
          <div class="result-icon">{{ isCorrect ? '🏆' : '👮' }}</div>
          <h2>{{ isCorrect ? t('caseClosed') : t('wrongSuspect') }}</h2>
          <p v-if="!isCorrect" class="result-subtext">{{ t('realCulpritEscaped') }}</p>
          <button class="action-btn" @click="nextLevel">
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
  background: var(--bg-color);
  color: var(--secondary-color);
  overflow-y: auto;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.mode-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 900px;
  margin: 0 auto 30px;
}

.back-btn {
  background: white;
  border: 4px solid var(--secondary-color);
  border-radius: 12px;
  padding: 10px 15px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 0 rgba(0,0,0,0.1);
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.score-display .label {
  font-size: 0.9rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--primary-color);
  letter-spacing: 1px;
}

.score-display .value {
  font-size: 2.5rem;
  font-weight: 950;
  line-height: 1;
}

.main-container {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.case-card {
  background: white;
  border: 4px solid var(--primary-color);
  border-radius: 20px;
  padding: 30px;
  position: relative;
  box-shadow: 0 8px 30px rgba(0,0,0,0.05);
}

.case-badge {
  position: absolute;
  top: -15px;
  left: 30px;
  background: var(--primary-color);
  color: white;
  padding: 5px 20px;
  border-radius: 8px;
  font-weight: 900;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.status-indicator {
  font-weight: 900;
  font-size: 0.9rem;
  margin-bottom: 15px;
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  background: #f0f0f0;
}

.status-indicator.solved { color: #2ecc71; background: #e8f8f5; }
.status-indicator.failed { color: #e74c3c; background: #fdedec; }

.case-title {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 15px;
}

.case-story {
  font-size: 1.2rem;
  line-height: 1.6;
  opacity: 0.9;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 900;
  margin-bottom: 20px;
  color: var(--secondary-color);
}

.suspects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  padding-bottom: 50px;
}

.suspect-card {
  background: white;
  border: 4px solid #eee;
  padding: 24px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.suspect-card:hover:not(.showResult) {
  transform: translateY(-8px);
  border-color: var(--primary-color);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
}

.suspect-card.selected {
  border-color: var(--primary-color);
  background: rgba(var(--primary-rgb), 0.05);
}

.suspect-card.correct {
  background: #e8f8f5;
  border-color: #2ecc71;
}

.suspect-card.wrong {
  background: #fdedec;
  border-color: #e74c3c;
}

.suspect-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.suspect-avatar {
  font-size: 2rem;
  background: var(--bg-color);
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #eee;
}

.suspect-name {
  font-size: 1.3rem;
  font-weight: 900;
  margin: 0;
}

.suspect-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-text {
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
  font-weight: 500;
}

.card-status {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 0.7rem;
  font-weight: 900;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(0,0,0,0.05);
}

.result-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.result-box {
  background: white;
  padding: 40px;
  border-radius: 30px;
  text-align: center;
  max-width: 450px;
  width: 100%;
  border: 4px solid var(--secondary-color);
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.result-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.result-box h2 {
  font-size: 2rem;
  font-weight: 950;
  margin-bottom: 10px;
}

.result-subtext {
  font-size: 1.1rem;
  opacity: 0.7;
  margin-bottom: 30px;
}

.action-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  border-bottom: 6px solid rgba(0,0,0,0.2);
  padding: 18px 36px;
  font-size: 1.3rem;
  font-weight: 900;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.action-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.action-btn:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .case-card {
    padding: 20px;
  }
  .case-title {
    font-size: 1.5rem;
  }
  .case-story {
    font-size: 1rem;
  }
  .suspects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
