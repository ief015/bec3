<template>
  <HudDialog>
    <div class="m-2">
      <div v-for="body in bodies">
        <div>{{ body.name }}</div>
        <div>{{ body.mass }}</div>
        <div>{{ body.radius }}</div>
      </div>
    </div>
  </HudDialog>
</template>

<script setup lang="ts">
import Body from '~/game/simulation/Body';

defineProps<{
  bodies?: readonly Body[];
}>();

</script>