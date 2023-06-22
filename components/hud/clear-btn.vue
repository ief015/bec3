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

const props = defineProps<{
  game?: GameMain;
}>();

const onClick = () => {
  const sim = props.game?.getSimulation();
  sim?.clearBodies();
}

</script>