<template>
  <v-card
    outlined
    class="flex-shrink flex-grow-0 items-center gap-2 z-5 w-full min-w-60"
  >
    <v-img
      class="hidden lg:flex"
      height="250"
      :src="icon"
    >
      <template #placeholder>
        <v-skeleton-loader type="image" />
      </template>
    </v-img>
    <v-card-title>
      <span v-if="!loading && project">
        {{ project.name }}
      </span>
      <span v-else>
        <v-skeleton-loader type="heading" />
      </span>
    </v-card-title>
    <v-card-subtitle class="lg:block flex justify-between pb-0">
      <div>
        <v-icon small>
          event
        </v-icon>
        {{ t("curseforge.createdDate") }}
        <span v-if="!loading && project">
          {{ getLocalDateString(project.dateCreated) }}
        </span>
        <v-skeleton-loader
          v-else
          type="list-item"
        />
      </div>

      <div>
        <v-icon small>
          event
        </v-icon>
        {{ t("curseforge.lastUpdate") }}
        <span v-if="!loading && project">
          {{ getLocalDateString(project.dateModified) }}
        </span>
        <v-skeleton-loader
          v-else
          type="list-item"
        />
      </div>
      <div>
        <v-icon small>
          file_download
        </v-icon>
        {{ t("curseforge.totalDownloads") }}
        <span v-if="!loading && project">
          {{ project.downloadCount }}
        </span>
        <v-skeleton-loader
          v-else
          type="list-item"
        />
      </div>
    </v-card-subtitle>
    <v-card-actions>
      <InstanceSelectMenu
        :value="destination"
        style="flex-grow: 1"
        :from="from"
        @input="emit('destination', $event)"
      />
    </v-card-actions>
  </v-card>
</template>
<script lang="ts" setup>
import { Mod } from '@xmcl/curseforge'
import InstanceSelectMenu from '../components/InstanceSelectMenu.vue'
import { getLocalDateString } from '@/util/date'

const props = defineProps<{
  project?: Mod
  loading: boolean
  destination: string
  from: string
}>()

const icon = computed(() => !props.project ? '' : props.project.logo?.thumbnailUrl ?? '')
const emit = defineEmits(['destination'])
const { t } = useI18n()

</script>
