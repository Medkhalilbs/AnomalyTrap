<template>
  <main class="app-main">
    <GameBoard />
    <GameOver 
      v-if="store.isGameOver" 
      :score="store.score" 
      :highscore="store.highscore"
      @restart="store.restart()"
    />
  </main>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import GameBoard from './components/GameBoard.vue';
import GameOver from './components/GameOver.vue';
import { useGameStore } from './store/gameStore';

const store = useGameStore();

onMounted(() => {
  store.initGame();
  updateTheme();
});

watch(() => store.currentTheme, () => {
  updateTheme();
});

function updateTheme() {
  const theme = store.currentTheme;
  document.documentElement.style.setProperty('--primary-color', theme.primary);
  document.documentElement.style.setProperty('--bg-color', theme.background);
  document.documentElement.style.setProperty('--accent-color', theme.accent);
  document.documentElement.style.setProperty('--secondary-color', theme.secondary);
}
</script>

<style>
.app-main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
