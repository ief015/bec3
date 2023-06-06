<template>
  <div class="text-sm text-gray-500">
    <div v-if="stats" class="flex flex-row gap-4">
      <div class="text-left">
        <div>FPS</div>
        <div>UPS</div>
        <div>Frame (ms)</div>
        <div>Update (ms)</div>
        <div>Render (ms)</div>
      </div>
      <div class="text-right">
        <div>{{ stats.fps.toFixed(0) }}</div>
        <div>{{ stats.ups.toFixed(0) }}</div>
        <div>{{ stats.frameTimeMs.toFixed(2) }}</div>
        <div>{{ stats.updateTimeMs.toFixed(2) }}</div>
        <div>{{ stats.renderTimeMs.toFixed(2) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GameStats from '~/game/simulation/GameStats';

const props = defineProps<{
  stats?: GameStats;
}>();

</script>