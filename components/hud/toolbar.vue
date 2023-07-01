<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row gap-2 justify-center pointer-events-auto">
      <div class="tooltip tooltip-bottom" data-tip="Coming soon">
        <HudToolbarBtn label="Select" name="select" v-model:selection="selection" disabled />
      </div>
      <div class="tooltip tooltip-bottom" data-tip="Click+drag to create bodies">
        <HudToolbarBtn label="Create" name="create" v-model:selection="selection" />
      </div>
      <div class="tooltip tooltip-bottom" data-tip="Click+drag to move camera, wheel to zoom">
        <HudToolbarBtn label="Look"   name="look"   v-model:selection="selection" />
      </div>
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
import CreateToolController from '~/game/controllers/CreateToolController';
import LookToolController from '~/game/controllers/LookToolController';

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