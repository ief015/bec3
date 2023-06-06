<template>
  <canvas ref="canvas">
    Your browser does not support the HTML5 canvas tag.
  </canvas>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import GameStats from '~/game/simulation/GameStats';

const canvas = ref<HTMLCanvasElement>();
const game = ref<GameMain>();
const gameStats = ref<GameStats>({
  fps: 0,
  ups: 0,
  frameTimeMs: 0,
  updateTimeMs: 0,
  renderTimeMs: 0,
});
const bodyCount = ref<number>(0);

const onFrame = () => {
  if (!game.value)
    return;
  gameStats.value = game.value.getStats();
  bodyCount.value = game.value.getBodies().length;
}

watch(canvas, () => {
  if (canvas.value) {
    game.value?.destroy();
    game.value = new GameMain(canvas.value);
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