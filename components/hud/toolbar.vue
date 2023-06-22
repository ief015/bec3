<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row gap-2 justify-center">
      <HudToolbarBtn title="Select" name="select" v-model:selection="selection" />
      <HudToolbarBtn title="Create" name="create" v-model:selection="selection" />
      <HudToolbarBtn title="Look"   name="look"   v-model:selection="selection" />
    </div>
    <div v-if="game">
      <HudControlsCreate
        v-if="selection === 'create'"
        :game="game"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';

const props = defineProps<{
  game?: GameMain;
}>();

const selection = defineModel<string>('selection', { required: true });

</script>