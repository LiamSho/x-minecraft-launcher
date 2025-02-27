<template>
  <v-list
    class="base-settings"
    two-line
    subheader
  >
    <v-subheader style="">
      {{ t("BaseSettingGeneral.title") }}
    </v-subheader>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>{{ t("instance.name") }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ t("instance.nameHint") }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-text-field
          v-model="data.name"
          small
          hide-details
          solo
          :placeholder="`Minecraft ${data.runtime.minecraft}`"
        />
      </v-list-item-action>
    </v-list-item>

    <v-list-item>
      <v-list-item-action class="self-center">
        <img
          :src="'image://builtin/minecraft'"
          width="40"
        >
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          {{
            t('minecraftVersion.name')
          }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{
            t('instance.versionHint')
          }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <version-menu
          :is-clearable="false"
          :items="minecraftItems"
          :has-snapshot="true"
          :snapshot.sync="showAlpha"
          :snapshot-tooltip="t('fabricVersion.showSnapshot')"
          :refreshing="refreshingMinecraft"
          @select="onSelectMinecraft"
        >
          <template #default="{ on }">
            <v-text-field
              v-model="data.runtime.minecraft"
              solo
              append-icon="arrow_drop_down"
              persistent-hint
              hide-details
              :readonly="true"
              @click:append="on.click($event);"
              @click="refreshMinecraft()"
              v-on="on"
            />
          </template>
        </version-menu>
      </v-list-item-action>
    </v-list-item>

    <v-list-item>
      <v-list-item-action class="self-center">
        <img
          :src="'image://builtin/forge'"
          width="40"
        >
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          {{
            t('forgeVersion.name')
          }}
        </v-list-item-title>
        <v-list-item-subtitle>
          <a href="https://github.com/MinecraftForge/MinecraftForge">https://github.com/MinecraftForge/MinecraftForge</a>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <version-menu
          :is-clearable="true"
          :items="forgeItems"
          :clear-text="t('forgeVersion.disable')"
          :has-snapshot="true"
          :snapshot.sync="canShowBuggy"
          :snapshot-tooltip="t('fabricVersion.showSnapshot')"
          :refreshing="refreshingForge"
          @select="onSelectForge"
        >
          <template #default="{ on }">
            <v-text-field
              :value="data.runtime.forge"
              solo
              append-icon="arrow_drop_down"
              :placeholder="t('forgeVersion.disable')"
              :empty-text="t('forgeVersion.empty', { version: data.runtime.minecraft })"
              hide-details
              persistent-hint
              :readonly="true"
              @click:append="on.click($event);"
              @click="refreshForge()"
              v-on="on"
            />
          </template>
        </version-menu>
      </v-list-item-action>
    </v-list-item>
    <v-list-item>
      <v-list-item-action class="self-center">
        <img
          :src="'image://builtin/fabric'"
          width="40"
        >
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Fabric</v-list-item-title>
        <v-list-item-subtitle>
          <a href="https://fabricmc.net/">https://fabricmc.net/</a>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <version-menu
          :is-clearable="true"
          :items="fabricItems"
          :clear-text="t('fabricVersion.disable')"
          :has-snapshot="true"
          :empty-text="t('fabricVersion.empty', { version: data.runtime.minecraft })"
          :snapshot.sync="showStableOnly"
          :snapshot-tooltip="t('fabricVersion.showSnapshot')"
          :refreshing="refreshingFabric"
          @select="onSelectFabric"
        >
          <template #default="{ on }">
            <v-text-field
              :value="data.runtime.fabricLoader"
              solo
              :placeholder="t('fabricVersion.disable')"
              hide-details
              append-icon="arrow_drop_down"
              persistent-hint
              :readonly="true"
              @click:append="on.click($event);"
              @click="refreshFabric()"
              v-on="on"
            />
          </template>
        </version-menu>
      </v-list-item-action>
    </v-list-item>
    <v-list-item>
      <v-list-item-action class="self-center">
        <img
          :src="'image://builtin/quilt'"
          style="width: 40px"
        >
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Quilt</v-list-item-title>
        <v-list-item-subtitle>
          <a href="https://quiltmc.org/">https://quiltmc.org/</a>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <version-menu
          :is-clearable="true"
          :items="quiltItems"
          :empty-text="t('quiltVersion.empty', { version: data.runtime.minecraft })"
          :clear-text="t('quiltVersion.disable')"
          :refreshing="refreshingQuilt"
          @select="onSelectQuilt"
        >
          <template #default="{ on }">
            <v-text-field
              :value="data.runtime.quiltLoader"
              solo
              hide-details
              :placeholder="t('quiltVersion.disable')"
              append-icon="arrow_drop_down"
              persistent-hint
              :readonly="true"
              @click:append="on.click($event);"
              @click="refreshQuilt()"
              v-on="on"
            />
          </template>
        </version-menu>
      </v-list-item-action>
    </v-list-item>

    <v-list-item>
      <v-list-item-action class="self-center">
        <img
          :src="'image://builtin/optifine'"
          width="40px"
        >
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Optifine</v-list-item-title>
        <v-list-item-subtitle>
          <a href="https://www.optifine.net/home">https://www.optifine.net/home</a>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <version-menu
          :is-clearable="true"
          :items="optifineItems"
          :clear-text="t('optifineVersion.disable')"
          :empty-text="t('optifineVersion.empty', { version: data.runtime.minecraft })"
          :refreshing="refreshingOptifine"
          @select="onSelectOptifine"
        >
          <template #default="{ on }">
            <v-text-field
              :value="data.runtime.optifine"
              solo
              hide-details
              :placeholder="t('optifineVersion.disable')"
              append-icon="arrow_drop_down"
              persistent-hint
              :readonly="true"
              @click:append="on.click($event);"
              @click="refreshOptifine()"
              v-on="on"
            />
          </template>
        </version-menu>
      </v-list-item-action>
    </v-list-item>

    <v-list-item>
      <!-- <v-list-item-action class="self-center">
        <v-icon>
          list
        </v-icon>
      </v-list-item-action> -->
      <v-list-item-content>
        <v-list-item-title>{{ t('localVersion.title', 1) }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ t('localVersion.hint') }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <version-menu
          :items="localItems"
          :empty-text="t('localVersion.empty')"
          @select="onSelectLocalVersion"
        >
          <template #default="{ on }">
            <v-text-field
              :value="data.version"
              solo
              hide-details
              :placeholder="t('localVersion.auto')"
              append-icon="arrow_drop_down"
              persistent-hint
              :readonly="true"
              @click:append="on.click($event);"
              v-on="on"
            />
          </template>
        </version-menu>
      </v-list-item-action>
    </v-list-item>

    <v-list-item
      @click="fastLaunch = !fastLaunch"
    >
      <v-list-item-action>
        <v-checkbox
          v-model="fastLaunch"
          hide-details
          @click="fastLaunch = !fastLaunch"
        />
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          {{ t("instanceSetting.fastLaunch") }}
          <BaseSettingGlobalLabel
            :global="isGlobalFastLaunch"
            @clear="resetFastLaunch"
          />
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ t("instanceSetting.fastLaunchHint") }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-list-item
      @click="hideLauncher = !hideLauncher"
    >
      <v-list-item-action>
        <v-checkbox
          v-model="hideLauncher"
          hide-details
          @click="hideLauncher = !hideLauncher"
        />
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          {{
            t("instanceSetting.hideLauncher")
          }}
          <BaseSettingGlobalLabel
            :global="isGlobalHideLauncher"
            @clear="resetHideLauncher"
          />
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item
      @click="showLog = !showLog"
    >
      <v-list-item-action>
        <v-checkbox
          v-model="showLog"
          hide-details
          @click="showLog = !showLog"
        />
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>
          {{ t("instanceSetting.showLog") }}
          <BaseSettingGlobalLabel
            :global="isGlobalShowLog"
            @clear="resetShowLog"
          />
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ t("instanceSetting.showLogHint") }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang=ts setup>
import VersionMenu from '../components/VersionMenu.vue'
import { InstanceEditInjectionKey } from '../composables/instanceEdit'
import { useFabricVersionList, useForgeVersionList, useMinecraftVersionList, useOptifineVersionList, useQuiltVersionList, VersionMenuItem } from '../composables/versionList'

import { injection } from '@/util/inject'
import { useLocalVersions } from '@/composables/version'
import BaseSettingGlobalLabel from './BaseSettingGlobalLabel.vue'

const {
  data,
  isGlobalFastLaunch,
  fastLaunch,
  resetFastLaunch,
  isGlobalHideLauncher,
  hideLauncher,
  resetHideLauncher,
  isGlobalShowLog,
  showLog,
  resetShowLog,
} = injection(InstanceEditInjectionKey)
const minecraft = computed(() => data.runtime.minecraft)
const { items: minecraftItems, showAlpha, refresh: refreshMinecraft, refreshing: refreshingMinecraft, release } = useMinecraftVersionList(minecraft)
const { items: forgeItems, canShowBuggy, recommendedOnly, refresh: refreshForge, refreshing: refreshingForge } = useForgeVersionList(minecraft, computed(() => data.runtime.forge ?? ''))
const { items: fabricItems, showStableOnly, refresh: refreshFabric, refreshing: refreshingFabric } = useFabricVersionList(minecraft, computed(() => data.runtime.fabricLoader ?? ''))
const { items: quiltItems, refresh: refreshQuilt, refreshing: refreshingQuilt } = useQuiltVersionList(minecraft, computed(() => data.runtime.quiltLoader ?? ''))
const { items: optifineItems, refresh: refreshOptifine, refreshing: refreshingOptifine } = useOptifineVersionList(minecraft, computed(() => data.runtime.forge ?? ''), computed(() => data.runtime.optifine ?? ''))
const { localVersions } = useLocalVersions()
const localItems = computed(() => {
  return localVersions.value.map(ver => {
    const result: VersionMenuItem = {
      name: ver.id,
      tag: ver.minecraft,
    }
    return result
  })
})

function onSelectMinecraft(version: string) {
  if (data?.runtime) {
    const runtime = data.runtime
    data.version = ''
    runtime.minecraft = version
    runtime.forge = ''
    runtime.fabricLoader = ''
    runtime.optifine = ''
  }
}
function onSelectForge(version: string) {
  if (data?.runtime) {
    const runtime = data?.runtime
    runtime.forge = version
    if (version) {
      data.version = ''
      runtime.fabricLoader = ''
      runtime.quiltLoader = ''
    }
  }
}
function onSelectFabric(version: string) {
  if (data?.runtime) {
    const runtime = data?.runtime
    if (version) {
      data.version = ''
      runtime.forge = ''
      runtime.quiltLoader = ''
      runtime.optifine = ''
    }
    runtime.fabricLoader = version
  }
}
function onSelectQuilt(version: string) {
  if (data?.runtime) {
    const runtime = data?.runtime
    runtime.quiltLoader = version
    if (version) {
      data.version = ''
      runtime.forge = runtime.fabricLoader = ''
      runtime.optifine = ''
    }
  }
}
function onSelectOptifine(version: string) {
  if (data.runtime) {
    const runtime = data.runtime
    runtime.optifine = version
    if (version) {
      data.version = ''
      runtime.quiltLoader = runtime.fabricLoader = ''
    }
  }
}
function onSelectLocalVersion(version: string) {
  data.version = version
  const v = localVersions.value.find(ver => ver.id === version)!
  data.runtime.minecraft = v.minecraft
  data.runtime.forge = v.forge
  data.runtime.liteloader = v.liteloader
  data.runtime.fabricLoader = v.fabric
  data.runtime.optifine = v.optifine
  data.runtime.quiltLoader = v.quilt
  console.log(v)
}

const { t } = useI18n()

</script>

<style scoped=true>
.flex {
  padding: 6px 8px !important
}
.v-btn {
  margin: 0
}
</style>
