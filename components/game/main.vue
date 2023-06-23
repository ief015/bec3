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
import generateFigure8 from '~/game/simulation/utils/generateFigure8';

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

const onWheel = (e: WheelEvent) => {
  if (game.value) {
    game.value.handleWheel(e);
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