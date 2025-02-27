<template>
  <div class="overflow-auto h-full">
    <v-list
      v-context-menu="items"
      nav
      dense
      class="px-2 ml-1"
    >
      <v-tooltip
        v-if="sideBarShowCurseforge"
        color="black"
        transition="scroll-x-transition"
        :close-delay="0"
        right
      >
        <template #activator="{ on: tooltip }">
          <v-list-item
            push
            link
            class="non-moveable"
            to="/curseforge/mc-mods"
            v-on="tooltip"
          >
            <v-list-item-icon>
              <v-icon>
                $vuetify.icons.curseforge
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>Curseforge</v-list-item-title>
          </v-list-item>
        </template>
        Curseforge
      </v-tooltip>

      <v-tooltip
        v-if="sideBarShowModrinth"
        color="black"
        transition="scroll-x-transition"
        :close-delay="0"
        right
      >
        <template #activator="{ on: tooltip }">
          <v-list-item
            push
            link
            class="non-moveable"
            to="/modrinth"
            v-on="tooltip"
          >
            <v-list-item-icon>
              <v-icon>
                $vuetify.icons.modrinth
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>Modrinth</v-list-item-title>
          </v-list-item>
        </template>
        Modrinth
      </v-tooltip>

      <v-tooltip
        v-if="sideBarShowFtb"
        color="black"
        transition="scroll-x-transition"
        :close-delay="0"
        right
      >
        <template #activator="{ on: tooltip }">
          <v-list-item
            push
            link
            class="non-moveable"
            to="/ftb"
            v-on="tooltip"
          >
            <v-list-item-icon>
              <v-icon>
                $vuetify.icons.ftb
              </v-icon>
            </v-list-item-icon>
            <v-list-item-title>FTB</v-list-item-title>
          </v-list-item>
        </template>
        Feed the Beast
      </v-tooltip>
    </v-list>

    <v-divider class="!block mx-4" />
    <v-list
      nav
      dense
      class="px-2 ml-1 overflow-auto justify-start flex-grow-0"
    >
      <AppSideBarInstanceItem
        v-for="(i, index) of instances"
        :key="i.path+'-'+index"
        :instance="i"
        @drop="setToPrevious($event, i.path)"
      />

      <v-list-item
        push
        class="non-moveable"
        @click="showAddInstance()"
      >
        <v-tooltip
          :close-delay="0"
          color="black"
          transition="scroll-x-transition"
          right
        >
          <template #activator="{ on: tooltip }">
            <v-list-item-avatar
              size="48"
              class="hover:rounded-xl transition-all duration-300 bg-[rgba(80,80,80,0.4)] hover:bg-green-500"
              large
              v-on="tooltip"
            >
              <v-icon class="text-3xl">
                add
              </v-icon>
            </v-list-item-avatar>
          </template>
          {{ t('instances.add') }}
        </v-tooltip>

        <v-list-item-title>Instance</v-list-item-title>
      </v-list-item>

      <v-list-item
        push
        class="non-moveable"
        @click="showAddServerDialog()"
      >
        <v-tooltip
          :close-delay="0"
          color="black"
          transition="scroll-x-transition"
          right
        >
          <template #activator="{ on: tooltip }">
            <v-list-item-avatar
              size="48"
              class="hover:rounded-xl transition-all duration-300 bg-[rgba(80,80,80,0.4)] hover:bg-green-500"
              large
              v-on="tooltip"
            >
              <v-badge
                right
                color="transparent"
                bottom
                overlap
                offset-x="13"
                offset-y="17"
                :value="true"
              >
                <template #badge>
                  <v-icon>
                    public
                  </v-icon>
                </template>
                <v-icon
                  class="text-2xl"
                  v-on="tooltip"
                >
                  add
                </v-icon>
              </v-badge>
            </v-list-item-avatar>
          </template>
          {{ t('server.add') }}
        </v-tooltip>

        <v-list-item-title>Instance</v-list-item-title>
      </v-list-item>

      <v-list-item
        push
        class="non-moveable"
        @click="onImport('folder')"
      >
        <v-tooltip
          color="black"
          transition="scroll-x-transition"
          :close-delay="0"
          right
        >
          <template #activator="{ on: tooltip }">
            <v-list-item-avatar
              size="48"
              class="hover:rounded-xl transition-all duration-300 bg-[rgba(80,80,80,0.4)] hover:bg-green-500"
              large
              v-on="tooltip"
            >
              <v-badge
                right
                color="transparent"
                bottom
                overlap
                offset-x="13"
                offset-y="17"
                :value="true"
              >
                <template #badge>
                  <v-icon>
                    folder
                  </v-icon>
                </template>
                <v-icon
                  class="text-2xl"
                  v-on="tooltip"
                >
                  add
                </v-icon>
              </v-badge>
            </v-list-item-avatar>
          </template>
          {{ t('instances.importFolder') }}
        </v-tooltip>

        <v-list-item-title>
          {{ t('instances.importFolder') }}
        </v-list-item-title>
      </v-list-item>
      <v-spacer />
    </v-list>
  </div>
</template>
<script setup lang="ts">
import { useService } from '@/composables'
import { useLocalStorageCacheBool } from '@/composables/cache'
import { ContextMenuItem } from '@/composables/contextMenu'
import { useDialog } from '@/composables/dialog'
import { AddInstanceDialogKey } from '@/composables/instanceAdd'
import { useSortedInstance } from '@/composables/instanceSort'
import { vContextMenu } from '@/directives/contextMenu'
import { InstanceServiceKey } from '@xmcl/runtime-api'
import AppSideBarInstanceItem from './AppSideBarInstanceItem.vue'

const { t } = useI18n()

const sideBarShowCurseforge = useLocalStorageCacheBool('sideBarShowCurseforge', true)
const sideBarShowModrinth = useLocalStorageCacheBool('sideBarShowModrinth', true)
const sideBarShowFtb = useLocalStorageCacheBool('sideBarShowFtb', true)
const { instances, setToPrevious } = useSortedInstance()
const { showOpenDialog } = windowController
const { addExternalInstance } = useService(InstanceServiceKey)

async function onImport(type: 'zip' | 'folder') {
  const fromFolder = type === 'folder'
  const filters = fromFolder
    ? []
    : [{ extensions: ['zip'], name: 'Zip' }]
  const { filePaths } = await showOpenDialog({
    title: t('instances.importFolder'),
    message: t('instances.importFolderDescription'),
    filters,
    properties: fromFolder ? ['openDirectory'] : ['openFile'],
  })
  if (filePaths && filePaths.length > 0) {
    const filePath = filePaths[0]
    if (type === 'folder') {
      addExternalInstance(filePath)
    }
  }
}

const { show: showAddInstance } = useDialog(AddInstanceDialogKey)
const { show: showAddServerDialog } = useDialog('add-server-dialog')

const items = computed(() => {
  const result: ContextMenuItem[] = [
    {
      text: 'Curseforge',
      icon: sideBarShowCurseforge.value ? 'check' : '',
      onClick() {
        sideBarShowCurseforge.value = !sideBarShowCurseforge.value
      },
      children: [],
    },
    {
      text: 'Modrinth',
      icon: sideBarShowModrinth.value ? 'check' : '',
      onClick() {
        sideBarShowModrinth.value = !sideBarShowModrinth.value
      },
      children: [],
    },
    {
      text: 'Feed The Beast',
      icon: sideBarShowFtb.value ? 'check' : '',
      onClick() {
        sideBarShowFtb.value = !sideBarShowFtb.value
      },
      children: [],
    },
  ]
  return result
})

</script>
