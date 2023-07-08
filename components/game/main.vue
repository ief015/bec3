<template>
  <canvas ref="canvas"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @touchstart="onTouchDown"
    @touchend="onTouchUp"
    @wheel="onWheel"
  >
    Your browser does not support the HTML5 canvas tag.
  </canvas>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import GameStats from '~/game/GameStats';

const canvas = ref<HTMLCanvasElement>();
const game = ref<GameMain>();
const gameStats = ref<GameStats>({
  fps: 0,
  frameTimeMs: 0,
  updateTimeMs: 0,
  renderTimeMs: 0,
});
const bodyCount = ref<number>(0);

const onStart = (game: GameMain) => {
  const sim = game.getSimulation();
  const scale = Math.min(window.innerWidth, window.innerHeight) / 5;
  sim.pushBodies(
    ...generateFigure8(0, 0, scale),
  );
}

const onFrame = (game: GameMain) => {
  const sim = game.getSimulation();
  Object.assign(gameStats.value, game.getStats());
  bodyCount.value = sim.getBodies().length;
}

const onMouseDown = (e: MouseEvent) => {
  game.value?.handleMouseDown(e);
}

const onMouseUp = (e: MouseEvent) => {
  game.value?.handleMouseUp(e);
}

const onTouchDown = (e: TouchEvent) => {
  game.value?.handleTouchDown(e);
}

const onTouchUp = (e: TouchEvent) => {
  game.value?.handleTouchUp(e);
}

const onWheel = (e: WheelEvent) => {
  game.value?.handleWheel(e);
}

watch(canvas, canvas => {
  if (canvas) {
    game.value = GameMain.newInstance(canvas, onFrame);
    onStart(game.value);
  }
}, { immediate: true });

onUnmounted(() => {
  game.value = undefined;
  GameMain.destroyInstance();
});

defineExpose({
  canvas,
  game,
  gameStats,
  bodyCount,
});

</script>