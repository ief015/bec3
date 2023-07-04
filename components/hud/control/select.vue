<template>
  <div>
    <div class="flex flex-row gap-2 justify-center">

      <div
        class="tooltip tooltip-bottom pointer-events-auto"
        data-tip="Click+drag to select bodies"
      >
        <HudToggleBtn class="btn-sm"
          :active="getMode() === 'select'"
        >
          Select
        </HudToggleBtn>
      </div>

      <div
        class="tooltip tooltip-bottom pointer-events-auto"
        data-tip="Coming soon"
      >
        <HudToggleBtn disabled class="btn-sm"
          :active="getMode() === 'move'"
        >
          Move
        </HudToggleBtn>
      </div>

      <div class="divider divider-horizontal"></div>

      <div
        class="tooltip tooltip-bottom pointer-events-auto"
        data-tip="Show info about selected bodies"
      >
        <button
          class="btn btn-ghost btn-sm"
          :disabled="!hasSelection"
          @click="onClickShowInfo"
        >
          Info
        </button>
      </div>

      <div
        class="tooltip tooltip-bottom pointer-events-auto"
        data-tip="Coming soon"
      >
        <button class="btn btn-ghost btn-sm"
          disabled
        >
          Edit
        </button>
      </div>

      <div
        class="tooltip tooltip-bottom pointer-events-auto"
        data-tip="Delete selected bodies"
      >
        <button
          class="btn btn-ghost btn-sm"
          :disabled="!hasSelection"
          @click="onClickDelete"
        >
          Delete
        </button>
      </div>

    </div>

    <div v-if="hasSelection" class="text-center mt-2 label-text">
      {{ selectedCount }} selected
    </div>

    <DialogBodyInfo
      v-model="showInfoDialog"
      :bodies="selected"
    />

  </div>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import SelectToolController from '~/game/controllers/SelectToolController';
import Body from '~/game/simulation/Body';

const props = defineProps<{
  game: GameMain;
}>();

const showInfoDialog = ref<boolean>(false);
const controller = ref<SelectToolController>();
watch(() => props.game, () => {
  controller.value = props.game.getController<SelectToolController>();
}, { immediate: true });

const hasSelection = computed<boolean>(() => controller.value?.hasSelection() ?? false);
const selectedCount = computed<number>(() => controller.value?.getSelected()?.length ?? 0);
const selected = computed<readonly Body[]>(() => {
  const bodies = controller.value?.getSelected();
  return bodies ?? [];
});

const getMode = () => {
  return 'select';
};

const onClickDelete = () => {
  controller.value?.deleteSelection();
};

const onClickShowInfo = () => {
  showInfoDialog.value = true;
}

</script>