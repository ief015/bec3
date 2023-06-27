<template>
  <div>
    <GameMain ref="game" class="fixed w-screen h-screen z-0" />
    <div v-if="game" class="absolute inset-0 z-10 cursor-default pointer-events-none">
      <div class="absolute top-2 left-2">
        <LinkGithub href="https://github.com/ief015/bec3" />
      </div>
      <div class="relative top-2 flex justify-center">
        <HudToolbar
          v-model:selection="tool"
          :game="game.game"
        />
      </div>
      <HudStats
        class="absolute bottom-2 left-2 select-none"
        :stats="game.gameStats"
      />
      <HudCounter
        class="absolute bottom-2 left-2 right-2 select-none"
        :count="game.bodyCount"
        label="bodies"
      />
      <HudClearBtn
        class="absolute bottom-2 right-2 pointer-events-auto"
        :game="game.game"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameMain from '~/components/game/main.vue';

const game = ref<InstanceType<typeof GameMain>>();
const tool = ref<string>('create');

</script>