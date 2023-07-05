<template>
  <HudDialog :title="title">
    <div v-for="(body, idx) in sortedBodies">
      <div class="divider" v-if="idx > 0" />
      <ViewBodyListItem
        :body="body"
        :fields="bodyFields"
        num-cols="3"
      >
        <template #after-title>
          <div class="flex-grow"></div>
          <button type="button" class="btn btn-circle btn-ghost btn-sm">
            <EyeIcon class="h-4" />
          </button>
        </template>
      </ViewBodyListItem>
    </div>
  </HudDialog>
</template>

<script setup lang="ts">
import { FieldDefinition } from '~/components/view/BodyListItem.vue';
import Body from '~/game/simulation/Body';
import { EyeIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  bodies?: Body[];
}>();

const title = computed(() => {
  if (!props.bodies)
    return '';
  if (props.bodies.length === 1)
    return props.bodies[0].name;
  return `${props.bodies.length} bodies`;
});

const sortedBodies = computed(() => {
  if (!props.bodies)
    return [];
  return [...props.bodies].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
});

const bodyFields: FieldDefinition[] = [
  {
    label: 'Mass',
    format: b => b.mass.toFixed(2),
  },
  {
    label: 'X',
    format: b => b.x.toFixed(2),
  },
  {
    label: 'Velocity',
    format: b => b.getSpeed().toFixed(2),
  },
  {
    label: 'Radius',
    format: b => b.radius.toFixed(2),
  },
  {
    label: 'Y',
    format: b => b.y.toFixed(2),
  },
  {
    label: 'Bearing',
    format: b => b.getDirectionDegrees().toFixed(2),
  },
];

</script>