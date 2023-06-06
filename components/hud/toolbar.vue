<template>
  <div class="flex flex-row gap-2 justify-center">
    <HudToolbarBtn title="Select" name="select" v-model:selection="selection" />
    <HudToolbarBtn title="Create" name="create" v-model:selection="selection" />
    <HudToolbarBtn title="Look"   name="look"   v-model:selection="selection" />
  </div>
</template>

<script setup lang="ts">

const selection = defineModel<string>('selection', { required: true });

</script>