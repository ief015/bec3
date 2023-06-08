<template>
  <div class="text-sm text-gray-500">
    <div v-if="stats" class="flex flex-row gap-4">
      <div>
        <div>FPS</div>
        <div>Frame (ms)</div>
        <div>Update (ms)</div>
        <div>Render (ms)</div>
      </div>
      <div>
        <div>{{ stats.fps.toFixed(0) }}</div>
        <div>{{ stats.frameTimeMs.toFixed(2) }}</div>
        <div>{{ stats.updateTimeMs.toFixed(2) }}</div>
        <div>{{ stats.renderTimeMs.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameStats from '~/game/simulation/GameStats';

defineProps<{
  stats?: GameStats;
}>();

</script>