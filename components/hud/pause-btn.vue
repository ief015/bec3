<template>
  <button
    class="btn btn-ghost w-[6em]"
    :class="{
      'btn-outline': toggle
    }"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';

const props = defineProps<{
  game?: GameMain;
}>();

const toggle = ref(false);

const label = computed(() => toggle.value ? 'Resume' : 'Pause');

const onClick = () => {
  toggle.value = !toggle.value;
}

watch(toggle, () => {
  const game = props.game;
  if (game) {
    if (toggle.value) {
      game.pause();
    } else {
      game.resume();
    }
  }
});

</script>