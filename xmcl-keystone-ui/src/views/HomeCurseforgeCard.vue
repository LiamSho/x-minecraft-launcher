<template>
  <v-card>
    <v-card-title>
      <v-icon left>
        $vuetify.icons.curseforge
      </v-icon>
      Curseforge Modpack
    </v-card-title>
    <v-card-text>
      This instance is created by Curseforge Modpack {{ resource?.metadata['curseforge-modpack']?.name }} ({{ upstream.modId }})
    </v-card-text>
    <v-card-actions>
      <v-btn
        color="teal accent-4"
        text
        @click="push(`/curseforge/modpack/${upstream.modId}`)"
      >
        Go Project
      </v-btn>
      <v-btn
        color="teal accent-4"
        :disabled="!hasUpdate"
        text
        @click="onUpgrade"
      >
        Upgrade
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts" setup>
import { useService } from '@/composables'
import { kModpacks } from '@/composables/modpack'
import { injection } from '@/util/inject'
import { File } from '@xmcl/curseforge'
import { CurseForgeServiceKey, InstanceData } from '@xmcl/runtime-api'

const props = defineProps<{
  upstream: InstanceData['upstream'] & { type: 'curseforge-modpack'}
}>()

const { t } = useI18n()
const { fetchProjectFiles } = useService(CurseForgeServiceKey)
const files = ref([] as File[])
const { push } = useRouter()

const hasUpdate = computed(() => files.value[0].id !== props.upstream.fileId)

const { resources } = injection(kModpacks)
const resource = computed(() => resources.value.find(v => v.metadata.curseforge &&
  v.metadata.curseforge.projectId === props.upstream.modId &&
  v.metadata.curseforge.fileId === props.upstream.fileId))

async function checkUpdate() {
  const result = await fetchProjectFiles({ modId: props.upstream.modId, gameVersion: '' })
  files.value = result.data
}

onMounted(() => checkUpdate())

const id = computed(() => props.upstream?.type === 'curseforge-modpack' ? props.upstream.modId : '')

function onUpgrade() {

}
</script>
