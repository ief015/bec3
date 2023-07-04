<template>
  <HudDialog :title="title">
    <div class="m-2">
      <div v-for="(body, idx) in sortedBodies">
        <div class="divider my-1" v-if="idx > 0"></div>
        <ViewBodyListItem :body="body" />
      </div>
    </div>
  </HudDialog>
</template>

<script setup lang="ts">
import Body from '~/game/simulation/Body';

const props = defineProps<{
  bodies?: readonly Body[];
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

</script>