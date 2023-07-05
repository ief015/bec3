<template>
  <div v-if="body">
    <div class="flex flex-row items-center gap-2 my-2">
      <slot name="before-title"></slot>
      <slot name="title">
        <span v-if="colorClass"
          class="rounded-[50%] inline-block h-4 w-4"
          :style="{ 'background-color': colorClass }"
        />
        <span class="font-medium">{{ body.name }}</span>
      </slot>
      <slot name="after-title"></slot>
    </div>
    <div :class="`grid ${gridColsClass} gap-2`">
      <div v-for="{ label, field, format } in fields" class="text-left">
        <div v-if="label" class="label-text">{{ label }}</div>
        <div class="overflow-hidden text-xs">{{ format ? format(body) : field ? body[field] : '' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Body from '~/game/simulation/Body';

export type FieldDefinition = {
  field?: keyof Body;
  label?: string;
  format?: (body: Body) => any;
};

const props = defineProps<{
  body?: Body;
  fields?: FieldDefinition[];
  numCols?: string|number;
}>();

const gridColsClass = computed(() => {
  return `grid-cols-${props.numCols ?? 4}`;
});

const colorClass = computed(() => {
  return props.body?.strokeColor;
});

</script>