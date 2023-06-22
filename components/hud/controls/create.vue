<template>
  <div class="text-right flex flex-col gap-1">
    <div class="flex flex-row items-center">
      <label class="flex-1 label-text-alt mr-2 select-none">
        Radius
      </label>
      <input
        class="input input-bordered input-ghost input-xs"
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
        class="input input-bordered input-ghost input-xs"
        type="number"
        v-model="mass"
        :min="0.000001"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';

const props = defineProps<{
  game: GameMain;
}>();

const radius = ref<number>(5);
const mass = ref<number>(100000);

watch(radius, val => {
  const controller = props.game.getController();
  controller.setRadius(val);
}, { immediate: true });

watch(mass, val => {
  const controller = props.game.getController();
  controller.setMass(val);
}, { immediate: true });

</script>