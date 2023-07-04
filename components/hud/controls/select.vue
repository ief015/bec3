<template>
  <div class="flex flex-row gap-1 justify-center">
    <div
      class="tooltip tooltip-bottom pointer-events-auto"
      data-tip="Click+drag to select bodies"
    >
      <button
        class="btn btn-ghost btn-sm"
        :class="{
          [getMode() === 'select' ? 'btn-outline' : 'btn-ghost']: true,
        }"
      >
        Select
      </button>
    </div>
    <div
      class="tooltip tooltip-bottom pointer-events-auto"
      data-tip="Coming soon"
    >
      <button
        class="btn btn-ghost btn-sm"
        :class="{
          [getMode() === 'move' ? 'btn-outline' : 'btn-ghost']: true,
        }"
        disabled
      >
        Move
      </button>
    </div>
    <div class="border-l border-[#555]"></div>
    <div
      class="tooltip tooltip-bottom pointer-events-auto"
      data-tip="Coming soon"
    >
      <button
        class="btn btn-ghost btn-sm"
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
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import SelectToolController from '~/game/controllers/SelectToolController';

const props = defineProps<{
  game: GameMain;
}>();

const controller = ref<SelectToolController>();
watch(() => props.game, () => {
  controller.value = props.game.getController<SelectToolController>();
}, { immediate: true });

const hasSelection = computed(() => controller.value?.hasSelection() ?? false);

const getMode = () => {
  return 'select';
};

const onClickDelete = () => {
  controller.value?.deleteSelection();
};

</script>