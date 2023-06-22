<template>
  <canvas ref="canvas"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @touchstart="onTouchDown"
    @touchend="onTouchUp"
  >
    Your browser does not support the HTML5 canvas tag.
  </canvas>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import GameStats from '~/game/GameStats';
import generateFigure8 from '~/game/simulation/utils/generateFigure8';
import CreateToolController from '~/game/tools/CreateToolController';

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
  sim.pushBodies(
    ...generateFigure8(window.innerWidth / 2, window.innerHeight / 2, 200),
  );
}

const onFrame = (game: GameMain) => {
  const sim = game.getSimulation();
  Object.assign(gameStats.value, game.getStats());
  bodyCount.value = sim.getBodies().length;
}

const onMouseDown = (e: MouseEvent) => {
  if (game.value) {
    game.value.handleMouseDown(e);
  }
}

const onMouseUp = (e: MouseEvent) => {
  if (game.value) {
    game.value.handleMouseUp(e);
  }
}

const onTouchDown = (e: TouchEvent) => {
  if (game.value) {
    game.value.handleTouchDown(e);
  }
}

const onTouchUp = (e: TouchEvent) => {
  if (game.value) {
    game.value.handleTouchUp(e);
  }
}

watch(canvas, () => {
  if (canvas.value) {
    game.value?.destroy();
    game.value = new GameMain(canvas.value);
    game.value.start(onFrame);
    onStart(game.value);
  }
}, { immediate: true });

onUnmounted(() => {
  game.value?.destroy();
});

defineExpose({
  canvas,
  game,
  gameStats,
  bodyCount,
});

</script>