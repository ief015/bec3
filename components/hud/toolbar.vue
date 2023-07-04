<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row gap-2 justify-center pointer-events-auto">
      <div class="tooltip tooltip-bottom" data-tip="Select and manipulate existing bodies">
        <HudToolbarBtn label="Select" name="select" v-model:selection="selection" />
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
      <HudControlsSelect
        v-if="selection === 'select'"
        :game="game"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import CreateToolController from '~/game/controllers/CreateToolController';
import LookToolController from '~/game/controllers/LookToolController';
import SelectToolController from '~/game/controllers/SelectToolController';

const props = defineProps<{
  game?: GameMain;
}>();

const selection = defineModel<string>('selection', { required: true });

watch([ () => props.game, selection ], () => {
  switch (selection.value) {
    case 'select':
      props.game?.setController(SelectToolController);
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