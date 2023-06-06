<template>
  <div class="text-center">
    <div class="text-2xl">
      {{ count }}
    </div>
    <div class="text-lg">
      {{ label }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  count?: number;
  label?: string;
}>();
</script>