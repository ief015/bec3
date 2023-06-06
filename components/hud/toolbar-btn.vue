<template>
  <button
    class="btn"
    :class="{
      'btn-outline': isSelected,
      'btn-ghost': !isSelected,
    }"
    @click="onClick"
  >
    {{ title }}
  </button>
</template>

<script setup lang="ts">

const props = defineProps<{
  title?: string;
  name?: string;
}>();

const selection = defineModel<string>('selection', { required: true });
const isSelected = computed(() => selection.value && (selection.value === props.name));

const onClick = () => {
  if (props.name) {
    selection.value = props.name;
  }
}

</script>