<template>
  <div class="tutorial-overlay" @click="$emit('close')">
    <div class="tutorial-content" @click.stop>
      <h2>HOW TO PLAY</h2>
      
      <div class="tutorial-step">
        <div class="tutorial-icon">🧐</div>
        <div class="tutorial-text">
          <strong>Find the Anomaly</strong>
          <p>Every level has several items. Exactly ONE follows a different logic than the others.</p>
        </div>
      </div>

      <div class="tutorial-step">
        <div class="tutorial-icon">❤️</div>
        <div class="tutorial-text">
          <strong>3 Lives</strong>
          <p>Don't rush! You have 3 hearts. Guess wrong and you lose one. Game ends at zero.</p>
        </div>
      </div>

      <div class="tutorial-step">
        <div class="tutorial-icon">🔥</div>
        <div class="tutorial-text">
          <strong>Boss Levels</strong>
          <p>Every 5 levels is a Boss Challenge with a massive grid and complex rules.</p>
        </div>
      </div>

      <div class="tutorial-step">
        <div class="tutorial-icon">💡</div>
        <div class="tutorial-text">
          <strong>Use Hints</strong>
          <p>Stuck? Tap the bulb to dim the decoys and reveal the anomaly. Earn more every 10 levels.</p>
        </div>
      </div>

      <button class="close-button" @click="$emit('close')">GOT IT!</button>
    </div>
  </div>
</template>

<script setup lang="ts">
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
