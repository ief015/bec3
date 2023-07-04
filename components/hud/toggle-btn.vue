<template>
  <button
    class="btn btn-ghost"
    :class="[ activeClass ]"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">


const props = defineProps<{
  active?: boolean;
}>();

const activeClass = computed(() => {
  if (props.active) {
    return 'btn-outline';
  }
  return '';
});

</script>