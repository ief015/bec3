<template>
  <dialog ref="dialog" class="modal" @click="!persistent && hide()">
    <form v-if="opened" method="dialog" class="modal-box opacity-90 flex flex-col" @click.stop>
      <div class="">
        <button
          v-if="!hideClose" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          @click="hide"
        >
          ✕
        </button>
        <h3 v-if="title != null" class="font-bold text-lg mb-6">{{ title }}</h3>
      </div>
      <div class="overflow-auto">
        <slot></slot>
      </div>
      <div v-if="$slots['actions']" class="modal-action">
        <slot name="actions"></slot>
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">

const props = defineProps<{
  title?: string;
  hideClose?: boolean;
  autoOpen?: boolean;
  persistent?: boolean;
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