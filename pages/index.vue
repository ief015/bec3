<template>
  <div oncontextmenu="return false" class="custom-scroll">
    <GameMain ref="game" class="fixed w-screen h-screen z-0" />
    <div v-if="game?.game" class="absolute inset-0 z-10 cursor-default pointer-events-none">
      <div class="absolute top-2 left-2">
        <LinkGithub href="https://github.com/ief015/bec3" />
      </div>
      <div class="relative top-2 flex justify-center">
        <HudToolbar v-model:selection="tool" />
      </div>
      <HudStats
        class="absolute bottom-2 left-2 select-none"
        :stats="game.gameStats"
      />
      <HudCounter
        class="absolute bottom-2 left-2 right-2 select-none"
        label="bodies"
        :count="game.bodyCount"
      />
      <HudClearBtn class="absolute bottom-2 right-2 pointer-events-auto" />
      <HudPauseBtn class="absolute top-2 right-2 pointer-events-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameMain from '~/components/game/main.vue';

const game = ref<InstanceType<typeof GameMain>>();
const tool = ref<string>('create');

</script>

<style>
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgb(0 0 0 / 20%);
  border-radius: 1em;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 1em;
}

::-webkit-scrollbar-thumb:hover {
  background: #333;
}

html {
  scrollbar-width: thin;
  scrollbar-color: #444 rgba(0, 0, 0, 0.2);
}

html {
  scrollbar-track-color: rgba(0, 0, 0, 0.2);
}
</style>