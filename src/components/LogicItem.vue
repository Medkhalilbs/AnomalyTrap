<template>
  <div 
    class="logic-item" 
    :class="[
      `anim-${item.animationType}`,
      { 'is-outlier': isOutlier, 'is-decoy': isDecoy }
    ]"
    :style="containerStyle"
    @click="$emit('tap')"
  >
    <svg 
      viewBox="0 0 100 100" 
      class="item-svg"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Background / Outer Shape -->
      <component 
        :is="getShapeComponent(item.shape)"
        v-bind="getShapeProps(item.shape, 40)"
        :fill="item.isHollow ? 'none' : item.color"
        :stroke="item.color"
        :stroke-width="item.isHollow ? item.strokeWidth : 0"
        :fill-opacity="item.opacity"
        :transform="item.shape !== 'circle' ? `rotate(${item.rotation} 50 50)` : ''"
      />

      <!-- Secondary Color Overlay (Bicolor Logic) -->
      <component 
        v-if="item.secondaryColor"
        :is="getShapeComponent(item.shape)"
        v-bind="getShapeProps(item.shape, 20)"
        :fill="item.secondaryColor"
        :transform="item.shape !== 'circle' ? `rotate(${item.rotation + 45} 50 50)` : ''"
        style="opacity: 0.8"
      />

      <!-- Nested Inner Shape (Recursive Logic) -->
      <component 
        v-if="item.innerShape && item.innerShape !== 'none'"
        :is="getShapeComponent(item.innerShape)"
        v-bind="getShapeProps(item.innerShape, 15)"
        :fill="item.innerColor || 'white'"
        :transform="item.innerShape !== 'circle' ? `rotate(${item.rotation * -1} 50 50)` : ''"
      />

      <!-- Inner Dot (Detail Logic) -->
      <circle 
        v-if="item.hasInnerDot"
        cx="50" cy="50" r="5"
        fill="white"
        :fill-opacity="item.opacity"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { LogicItemData, ShapeType } from '../game/rules/Rule';

const props = defineProps<{
  item: LogicItemData;
  isOutlier?: boolean;
  isDecoy?: boolean;
}>();

defineEmits(['tap']);

const containerStyle = computed(() => ({
  transform: `scale(${props.item.scale})`,
  '--anim-speed': `${props.item.animationSpeed}s`,
  transition: 'transform 0.2s ease-out'
}));

function getShapeComponent(shape: string) {
  if (shape === 'circle') return 'circle';
  if (shape === 'square') return 'rect';
  return 'polygon';
}

function getShapeProps(shape: string, radius: number) {
  if (shape === 'circle') return { cx: 50, cy: 50, r: radius };
  if (shape === 'square') {
    const size = radius * 1.5;
    return { x: 50 - size / 2, y: 50 - size / 2, width: size, height: size };
  }
  return { points: getPolygonPoints(shape as ShapeType, radius) };
}

function getPolygonPoints(shape: ShapeType, radius: number): string {
  const sides = getSides(shape);
  const centerX = 50;
  const centerY = 50;
  const points = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(' ');
}

function getSides(shape: ShapeType): number {
  switch (shape) {
    case 'triangle': return 3;
    case 'pentagon': return 5;
    case 'hexagon': return 6;
    case 'star': return 10;
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
  position: relative;
}

.item-svg {
  width: 100%;
  height: 100%;
}

.logic-item:active {
  transform: scale(0.9) !important;
}

/* Animations from Phase 11 */
.anim-pulse { animation: pulse var(--anim-speed) infinite ease-in-out; }
.anim-float { animation: float var(--anim-speed) infinite ease-in-out; }
.anim-shake { animation: shake var(--anim-speed) infinite ease-in-out; }
.anim-glitch { animation: glitch var(--anim-speed) infinite steps(2); }
.anim-rotate { animation: rotate var(--anim-speed) infinite linear; }

@keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px) rotate(-5deg); } 75% { transform: translateX(5px) rotate(5deg); } }
@keyframes glitch { 0%, 100% { opacity: 1; transform: skew(0); } 50% { opacity: 0.8; transform: skew(10deg) scaleX(1.1); filter: hue-rotate(90deg); } }
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
</style>
