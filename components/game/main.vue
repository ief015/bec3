<template>
  <canvas ref="canvas" @click="onClick">
    Your browser does not support the HTML5 canvas tag.
  </canvas>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import GameStats from '~/game/simulation/GameStats';
import generateFigure8 from '~/game/simulation/util/generateFigure8';

const canvas = ref<HTMLCanvasElement>();
const game = ref<GameMain>();
const gameStats = ref<GameStats>({
  fps: 0,
  frameTimeMs: 0,
  updateTimeMs: 0,
  renderTimeMs: 0,
});
const bodyCount = ref<number>(0);

const onPreStart = (game: GameMain) => {
  const sim = game.getSimulation();
  sim.getBodies().push(
    ...generateFigure8(window.innerWidth / 2, window.innerHeight / 2, 100),
  );
}

const onFrame = (game: GameMain) => {
  const sim = game.getSimulation();
  gameStats.value = game.getStats();
  bodyCount.value = sim.getBodies().length;
}

const onClick = (e: MouseEvent) => {
  if (game.value) {
    game.value.handleClick(e);
  }
}

watch(canvas, () => {
  if (canvas.value) {
    game.value?.destroy();
    game.value = new GameMain(canvas.value);
    onPreStart(game.value);
    game.value.start(onFrame);
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