<template>
  <v-card
    v-draggable-card
    v-selectable-card
    v-context-menu="contextMenuItems"
    outlined
    hover
    :draggable="!pack.enabled && pack.path"
    class="draggable-card flex duration-200 mt-2 flex-row flex-nowrap select-none"
    :class="{ enabled: pack.enabled }"
    @click="onSelect"
    @dragstart="emit('dragstart', pack)"
    @dragend="emit('dragend')"
  >
    <div class="self-center px-2 ">
      <img
        v-fallback-img="unknownPack"
        class="rounded-2"
        :src="unknownPack"
        contain
        width="60"
        height="60"
      >
    </div>
    <div class="flex-grow">
      <v-card-title class="pb-2">
        <div
          v-once
          class="font-bold"
          :contenteditable="!builtin"
          @input="updateName"
        >
          {{ pack.name }}
        </div>
      </v-card-title>
      <v-card-text>
        {{ pack.description }}
      </v-card-text>
      <v-card-text
        v-if="pack.tags.length > 0"
        class="pt-0 flex gap-2 flex-wrap"
      >
        <v-chip
          v-for="(tag, index) in pack.tags"
          :key="`${tag}${index}`"
          :color="getColor(tag)"
          label
          small
          close
          outlined
          @mousedown.stop
          @click:close="onRemoveTag(tag)"
        >
          <div
            contenteditable
            @input.stop.capture="onEditTag($event, index)"
            @blur="onEditTagEnd(pack)"
          >
            {{ tag }}
          </div>
        </v-chip>
      </v-card-text>
    </div>
    <div class="self-center flex-shrink pr-2">
      <v-switch
        readonly
        :value="pack.enabled"
        @input="emit('enable', $event)"
      />
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import unknownPack from '@/assets/unknown_pack.png'
import { useService, useTags } from '@/composables'
import { getColor } from '@/util/color'
import { BaseServiceKey } from '@xmcl/runtime-api'
import { ShaderPackItem } from '../composables/shaderpack'
import { vContextMenu } from '../directives/contextMenu'
import { vFallbackImg } from '../directives/fallbackImage'
import { vDraggableCard, vSelectableCard } from '../directives/draggableCard'

const props = defineProps<{ pack: ShaderPackItem }>()
const emit = defineEmits(['update:name', 'enable', 'tags', 'select', 'dragstart', 'dragend', 'delete'])

const { t } = useI18n()
const { showItemInDirectory } = useService(BaseServiceKey)

const builtin = computed(() => props.pack.value === 'OFF' || props.pack.value === '(internal)')
const { createTag, editTag, removeTag: onRemoveTag } = useTags(computed({ get() { return props.pack.tags }, set(v) { emit('tags', v) } }))
const contextMenuItems = computed(() => {
  if (builtin.value) {
    return []
  }
  return [
    {
      text: t('shaderPack.showFile', { file: props.pack.path }),
      children: [],
      onClick: () => {
        showItemInDirectory(props.pack.path)
      },
      icon: 'folder',
    },
    {
      text: t('tag.create'),
      children: [],
      onClick() {
        createTag()
      },
      icon: 'add',
    },
    {
      text: t('delete.name', { name: props.pack.name }),
      children: [],
      onClick() {
        emit('delete')
      },
      icon: 'delete',
      color: 'error',
    },
  ]
})

function onEditTag(event: Event, index: number) {
  if (event.target instanceof HTMLDivElement) {
    editTag(event.target.innerText, index)
  }
}
function onEditTagEnd(item: ShaderPackItem) {
  item.tags = [...item.tags]
}
function updateName(event: Event) {
  if (event.target instanceof HTMLDivElement) {
    emit('update:name', event.target.innerText)
  }
}
function onSelect() {
  emit('select', props.pack)
}
</script>

<style scoped>
.enabled {
  background-color: #388e3c;
}
</style>
