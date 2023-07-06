<template>
  <HudDialog :title="title">
    <div v-for="(body, idx) in sortedBodies">
      <div class="divider" v-if="idx > 0" />
      <ViewBodyListItem
        :body="body"
        :fields="bodyFields"
      >
        <template #after-title>
          <div class="flex-grow"></div>
          <button type="button" class="btn btn-circle btn-ghost btn-sm"
            @click="onClickGoto(body, 'out-only')"
          >
            <EyeIcon class="h-4" />
          </button>
        </template>
      </ViewBodyListItem>
    </div>
  </HudDialog>
</template>

<script setup lang="ts">
import GameMain from '~/game/GameMain';
import Body from '~/game/simulation/Body';
import { FieldDefinition } from '~/components/view/BodyListItem.vue';
import { EyeIcon } from '@heroicons/vue/24/outline'

type AutoZoomOptions = 'none' | 'out-only' | 'auto';

const props = defineProps<{
  bodies?: Body[];
}>();

const bodyFields: FieldDefinition[] = [
  {
    label: 'Mass',
    format: b => b.mass.toFixed(2),
  },
  {
    label: 'X',
    format: b => b.x.toFixed(2),
  },
  {
    label: 'Velocity',
    format: b => b.getSpeed().toFixed(2),
  },
  {
    label: 'Radius',
    format: b => b.radius.toFixed(2),
  },
  {
    label: 'Y',
    format: b => b.y.toFixed(2),
  },
  {
    label: 'Bearing',
    format: b => b.getDirectionDegrees().toFixed(2),
  },
];

const game = GameMain.getInstance()

const title = computed(() => {
  if (!props.bodies)
    return '';
  if (props.bodies.length === 1)
    return props.bodies[0].name;
  return `${props.bodies.length} bodies`;
});

const sortedBodies = computed(() => {
  if (!props.bodies)
    return [];
  return [...props.bodies].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
});

const onClickGoto = (body: Body, autoZoom: AutoZoomOptions = 'none') => {
  const cam = game.getCamera();
  const { innerWidth, innerHeight } = window;
  if (autoZoom != 'none') {
    const zoom = 1 / body.radius * Math.min(innerWidth, innerHeight) / 100;
    autoZoom == 'out-only' && zoom < cam.getZoom() && cam.setZoom(zoom);
    autoZoom == 'auto' && cam.setZoom(zoom);
  }
  cam.setPosition(-body.x, -body.y);
  cam.move(innerWidth / 2, innerHeight / 2);
}

</script>