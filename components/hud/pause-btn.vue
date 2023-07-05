<template>
  <HudToggleBtn
    :active="toggle"
    class="w-[6em]"
    @click="onClick"
  >
    {{ label }}
  </HudToggleBtn>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';

const toggle = ref(false);
const label = computed(() => toggle.value ? 'Resume' : 'Pause');

const onClick = () => {
  toggle.value = !toggle.value;
}

watch(toggle, () => {
  const game = GameMain.getInstance();
  if (game) {
    if (toggle.value) {
      game.pause();
    } else {
      game.resume();
    }
  }
});

</script>