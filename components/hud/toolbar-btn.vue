<template>
  <button
    class="btn"
    :class="{
      [isSelected ? 'btn-outline' : 'btn-ghost']: true,
    }"
    :disabled="disabled"
    @click="onClick"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">

const props = defineProps<{
  label?: string;
  name?: string;
  disabled?: boolean;
}>();

const selection = defineModel<string>('selection', { required: true });
const isSelected = computed(() => selection.value && (selection.value === props.name));

const onClick = () => {
  if (props.name) {
    selection.value = props.name;
  }
}

</script>