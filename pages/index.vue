<template>
  <div>
    <GameMain ref="game" class="fixed w-screen h-screen -z-10" />
    <div v-if="game" class="absolute inset-0 cursor-default">
      <HudToolbar
        class="absolute left-2 right-2 top-2"
        v-model:selection="tool"
      />
      <HudCounter
        class="absolute bottom-2 left-2 right-2"
        :count="game.bodyCount"
        label="bodies"
      />
      <HudStats
        class="absolute left-2 bottom-2"
        :stats="game.gameStats"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameMain from '~/components/game/main.vue';

const game = ref<InstanceType<typeof GameMain>>();
const tool = ref<string>('create');

</script>