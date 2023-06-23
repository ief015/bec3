<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row gap-2 justify-center">
      <HudToolbarBtn label="Select" name="select" v-model:selection="selection" disabled />
      <HudToolbarBtn label="Create" name="create" v-model:selection="selection" />
      <HudToolbarBtn label="Look"   name="look"   v-model:selection="selection" />
    </div>
    <div v-if="game">
      <HudControlsCreate
        v-if="selection === 'create'"
        :game="game"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import CreateToolController from '~/game/tools/CreateToolController';
import LookToolController from '~/game/tools/LookToolController';

const props = defineProps<{
  game?: GameMain;
}>();

const selection = defineModel<string>('selection', { required: true });

watch([ () => props.game, selection ], () => {
  switch (selection.value) {
    case 'select':
      console.warn("select not yet implemented");
      props.game?.setController();
      break;
    case 'create':
      props.game?.setController(CreateToolController);
      break;
    case 'look':
      props.game?.setController(LookToolController);
      break;
  }
}, { immediate: true });

</script>