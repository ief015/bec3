<template>
  <div>
    <div v-if="body">
      <div class="flex flex-row items-center gap-1">
        <span v-if="colorClass"
          class="rounded-[50%] inline-block h-4 w-4"
          :style="{ 'background-color': colorClass }"
        ></span>
        {{ body.name }}
      </div>
      <div>Mass: {{ body.mass }}</div>
      <div>Radius: {{ body.radius }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Body from '~/game/simulation/Body';

const props = defineProps<{
  body?: Body;
}>();

const colorClass = computed(() => {
  return props.body?.strokeColor;
});

</script>