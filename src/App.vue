<template>
  <main class="app-main">
    <Transition name="fade">
      <MainMenu v-if="store.gameState === GameState.MENU" />
    </Transition>

    <GameBoard v-if="store.gameState !== GameState.MENU" />

    <Transition name="slide-up">
      <GameOver 
        v-if="store.gameState === GameState.GAMEOVER" 
        :score="store.score" 
        :highscore="store.highscore"
        @restart="store.restart()"
      />
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import MainMenu from './components/MainMenu.vue';
import GameBoard from './components/GameBoard.vue';
import GameOver from './components/GameOver.vue';
import { useGameStore, GameState } from './store/gameStore';

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
  background-color: var(--bg-color);
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
