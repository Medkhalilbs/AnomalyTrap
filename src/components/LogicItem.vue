<template>
  <div 
    class="logic-item" 
    :style="containerStyle"
    @click="$emit('tap')"
  >
    <svg 
      viewBox="0 0 100 100" 
      class="item-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Circle -->
      <circle 
        v-if="item.shape === 'circle'"
        cx="50" cy="50" r="40"
        :fill="item.color"
        :fill-opacity="item.opacity"
      />
      
      <!-- Square -->
      <rect 
        v-if="item.shape === 'square'"
        x="15" y="15" width="70" height="70"
        :fill="item.color"
        :fill-opacity="item.opacity"
        :transform="`rotate(${item.rotation} 50 50)`"
      />

      <!-- polygon based shapes -->
      <polygon
        v-if="['triangle', 'pentagon', 'hexagon', 'star'].includes(item.shape)"
        :points="polygonPoints"
        :fill="item.color"
        :fill-opacity="item.opacity"
        :transform="`rotate(${item.rotation} 50 50)`"
      />

      <!-- Central Text Value -->
      <text 
        v-if="item.value !== 0"
        x="50" y="55" 
        text-anchor="middle" 
        fill="white" 
        font-size="28" 
        font-weight="bold"
        font-family="sans-serif"
      >
        {{ item.value }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LogicItemData, ShapeType } from '../game/rules/Rule';

const props = defineProps<{
  item: LogicItemData;
}>();

defineEmits(['tap']);

const containerStyle = computed(() => ({
  transform: `scale(${props.item.scale})`,
  transition: 'transform 0.2s ease-out'
}));

const polygonPoints = computed(() => {
  const sides = getSides(props.item.shape);
  const centerX = 50;
  const centerY = 50;
  const radius = 40;
  const points = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(' ');
});

function getSides(shape: ShapeType): number {
  switch (shape) {
    case 'triangle': return 3;
    case 'pentagon': return 5;
    case 'hexagon': return 6;
    case 'star': return 10; // Simple star approach
    default: return 0;
  }
}
</script>

<style scoped>
.logic-item {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.item-svg {
  width: 100%;
  height: 100%;
}

.logic-item:active {
  transform: scale(0.9) !important;
}
</style>
