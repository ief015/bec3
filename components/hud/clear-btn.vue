<template>
  <button
    class="btn btn-ghost"
    @click="onClick"
  >
    Clear
  </button>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';

const onClick = () => {
  const game = GameMain.getInstance();
  if (!game)
    return;
  const sim = game.getSimulation();
  sim.clearBodies();
}

</script>