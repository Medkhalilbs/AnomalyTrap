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
import { onMounted } from 'vue';
import { useGameStore } from './store/gameStore';
import GameBoard from './components/GameBoard.vue';
import GameOver from './components/GameOver.vue';

const store = useGameStore();

onMounted(() => {
  store.initGame();
});
</script>

<style>
.app-main {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
