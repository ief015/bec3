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
    <div>
      <HudControlCreate v-if="selection === 'create'" />
      <HudControlSelect v-if="selection === 'select'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import CreateToolController from '~/game/controllers/CreateToolController';
import LookToolController from '~/game/controllers/LookToolController';
import SelectToolController from '~/game/controllers/SelectToolController';

const selection = defineModel<string>('selection', { required: true });

watch(selection, val => {
  const game = GameMain.getInstance();
  switch (val) {
    case 'select':
      game.setController(SelectToolController);
      break;
    case 'create':
      game.setController(CreateToolController);
      break;
    case 'look':
      game.setController(LookToolController);
      break;
  }
}, { immediate: true });

</script>