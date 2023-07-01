<template>
  <div class="text-right flex flex-col gap-1">
    <div class="flex flex-row items-center">
      <label class="flex-1 label-text-alt mr-2 select-none">
        Radius
      </label>
      <input
        class="input input-bordered input-ghost input-xs pointer-events-auto"
        type="number"
        v-model="radius"
        min="0"
      />
    </div>
    <div class="flex flex-row items-center">
      <label class="flex-1 label-text-alt mr-2 select-none">
        Mass
      </label>
      <input
        class="input input-bordered input-ghost input-xs pointer-events-auto"
        type="number"
        v-model="mass"
        :step="1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import CreateToolController from '~/game/controllers/CreateToolController';

const props = defineProps<{
  game: GameMain;
}>();

const getController = () => props.game.getController<CreateToolController>();

const radius = ref<number>(getController()?.getRadius() ?? 5);
const mass = ref<number>(getController()?.getMass() ?? 100000);

watch(radius, val => {
  const controller = getController();
  if (controller) {
    radius.value = controller.setRadius(val);
  }
});

watch(mass, val => {
  const controller = getController();
  if (controller) {
    mass.value = controller.setMass(val);
  }
});

</script>