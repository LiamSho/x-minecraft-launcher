<template>
  <v-card
    v-draggable-card
    v-data-transfer:id="source.name"
    v-data-transfer-image="icon"
    v-context-menu="items"
    hover
    outlined
    draggable
    class="white--text draggable-card p-2"
    style="margin-top: 10px; transition-duration: 0.2s; margin-bottom: 20px"
    @dragstart="$emit('dragstart', $event)"
    @dragend="$emit('dragend', $event)"
  >
    <div class="flex gap-4 items-center">
      <img
        ref="icon"
        v-fallback-img="unknownPack"
        class="rounded-lg object-contain"
        :src="source.icon"
        width="80px"
        height="80px"
      >
      <div class="flex flex-grow flex-col gap-1">
        <h3>{{ source.name }}</h3>
        <div class="dark:text-gray-400 text-sm">
          {{ new Date(source.lastPlayed).toLocaleString() }}
        </div>
        <div class="flex gap-2">
          <HomeHeaderMinecraftLabel
            small
            :minecraft="source.gameVersion"
          />

          <v-chip
            small
            outlined
            label
            color="amber"
            style="margin-left: 1px;"
          >
            {{ levelMode }}
          </v-chip>
          <v-chip
            v-if="source.cheat"
            small
            outlined
            color="orange en-1"
            label
            style="margin-left: 1px;"
          >
            {{ t('gamesetting.cheat') }}
          </v-chip>
        </div>
      </div>
      <div style="flex-grow: 0">
        <v-btn
          text
          icon
          @click="showItemInDirectory(source.path)"
        >
          <v-icon>folder</v-icon>
        </v-btn>
        <v-btn
          text
          icon
          @click="exportSave(source.path)"
        >
          <v-icon>launch</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script lang=ts setup>
import { BaseServiceKey, InstanceSaveMetadata } from '@xmcl/runtime-api'
import unknownPack from '@/assets/unknown_pack.png'
import { useService } from '@/composables'
import { vFallbackImg } from '../directives/fallbackImage'
import { vDataTransfer, vDataTransferImage, vDraggableCard } from '../directives/draggableCard'
import HomeHeaderMinecraftLabel from './HomeHeaderMinecraftLabel.vue'
import { vContextMenu } from '../directives/contextMenu'
import { ContextMenuItem } from '../composables/contextMenu'

const props = defineProps<{
  exportSave(path:string): void
  source: InstanceSaveMetadata
}>()

const emit = defineEmits(['remove'])
const { showItemInDirectory } = useService(BaseServiceKey)

const { t } = useI18n()
const items = computed(() => {
  const result: ContextMenuItem[] = [{
    text: t('save.deleteTitle'),
    icon: 'delete',
    color: 'red',
    onClick: () => { emit('remove') },
    children: [],
  }]
  return result
})
const levelMode = computed(() => {
  switch (props.source.mode) {
    case 0: return t('gameType.survival')
    case 1: return t('gameType.creative')
    case 2: return t('gameType.adventure')
    case 3: return t('gameType.spectator')
    case -1:
    default:
      return t('gameType.non')
  }
})
const icon = ref(null)
</script>

<style>
</style>
