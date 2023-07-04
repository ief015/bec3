<template>
  <dialog ref="dialog" class="modal">
    <form method="dialog" class="modal-box">
      <button
        v-if="!hideClose" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        @click="hide"
      >
        ✕
      </button>
      <h3 v-if="title != null" class="font-bold text-lg">{{ title }}</h3>
      <slot></slot>
    </form>
  </dialog>
</template>

<script setup lang="ts">

const props = defineProps<{
  title?: string;
  hideClose?: boolean;
  autoOpen?: boolean;
}>();
const opened = defineModel<boolean>({ local: true, default: false });

const dialog = ref<HTMLDialogElement>();
const isOpened = computed(() => opened.value);

const show = () => {
  opened.value = true;
};

const hide = () => {
  opened.value = false;
};

const toggle = () => {
  if (opened.value) {
    hide();
  } else {
    show();
  }
};

if (props.autoOpen) {
  show();
}

watch(opened, open => {
  if (open) {
    dialog.value?.showModal();
  } else {
    dialog.value?.close();
  }
}, { immediate: true });

defineExpose({
  show,
  hide,
  toggle,
  isOpened,
});

</script>