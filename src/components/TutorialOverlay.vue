<template>
  <div class="tutorial-overlay" @click="$emit('close')">
    <div class="tutorial-content" @click.stop>
      <h2>HOW TO PLAY: {{ modeName }}</h2>
      
      <div v-for="(step, index) in steps" :key="index" class="tutorial-step">
        <div class="tutorial-icon">{{ step.icon }}</div>
        <div class="tutorial-text">
          <strong>{{ step.title }}</strong>
          <p>{{ step.desc }}</p>
        </div>
      </div>

      <button class="close-button" @click="$emit('close')">GOT IT!</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../store/gameStore';
import { GameMode } from '../types/modes';

const store = useGameStore();

const modeName = computed(() => {
    const map: Record<string, string> = {
        [GameMode.ANOMALY_HUNT]: 'Anomaly Hunt',
        [GameMode.DETECTIVE]: 'Detective Mode',
        [GameMode.CONTRADICTION]: 'Logic Check',
        [GameMode.SEQUENCE]: 'Sequence Breaker',
        [GameMode.WORD_TRAP]: 'Word Trap',
        [GameMode.MEMORY]: 'Memory Matrix',
        [GameMode.RIDDLE]: 'Riddle Rush',
        [GameMode.CIPHER]: 'Cipher Crack'
    };
    return map[store.currentMode] || 'Anomaly Hunt';
});

const steps = computed(() => {
    switch(store.currentMode) {
        case GameMode.DETECTIVE:
            return [
                { icon: '🕵️‍♂️', title: 'Read the Case', desc: 'Examine the story and the suspects carefully.' },
                { icon: '🧩', title: 'Find the Clue', desc: 'One detail in the story or statements reveals the truth.' },
                { icon: '👈', title: 'Accuse', desc: 'Tap the suspect who is lying or matches the clue.' }
            ];
        case GameMode.CONTRADICTION:
            return [
                { icon: '⚠️', title: 'Analyze Statements', desc: 'Read all the facts presented.' },
                { icon: '❌', title: 'Spot the Lie', desc: 'One statement logically contradicts the others or the premise.' },
                { icon: '👇', title: 'Tap It', desc: 'Select the contradictory statement to win.' }
            ];
        case GameMode.SEQUENCE:
            return [
                 { icon: 'rules', title: 'Analyze Pattern', desc: 'Look at the numbers or symbols.' },
                 { icon: 'question', title: 'Predict Next', desc: 'Choose the option that continues the sequence.' }
            ];
        // ... Add others as needed, default to Classic checks
        default: 
            return [
                { icon: '🧐', title: 'Find Outlier', desc: 'One item follows a different logic than the others.' },
                { icon: '❤️', title: 'Lives', desc: 'You have 3 lives. Wrong guesses cost a life.' },
                { icon: '💡', title: 'Hints', desc: 'Use hints to remove options when stuck.' }
            ];
    }
});

defineEmits(['close']);
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.tutorial-content {
  background: var(--bg-color);
  width: 100%;
  max-width: 340px;
  border-radius: 30px;
  padding: 30px;
  color: var(--secondary-color);
  box-shadow: 0 20px 50px rgba(0,0,0,0.3);
}

h2 {
  font-weight: 900;
  letter-spacing: 2px;
  margin-top: 0;
  margin-bottom: 30px;
  text-align: center;
}

.tutorial-step {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  text-align: left;
  align-items: center;
}

.tutorial-icon {
  font-size: 1.8rem;
  min-width: 40px;
}

.tutorial-text strong {
  display: block;
  font-size: 1rem;
  margin-bottom: 2px;
}

.tutorial-text p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
  line-height: 1.4;
}

.close-button {
  width: 100%;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 15px;
  font-size: 1rem;
  font-weight: 900;
  margin-top: 10px;
  cursor: pointer;
}

@media (prefers-color-scheme: dark) {
  .tutorial-content {
    border: 1px solid rgba(255,255,255,0.1);
  }
}
</style>
