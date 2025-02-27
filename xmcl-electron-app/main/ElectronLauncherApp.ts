import { LauncherApp } from '@xmcl/runtime'
import { ReleaseInfo } from '@xmcl/runtime-api'
import { Shell } from '@xmcl/runtime/lib/app/Shell'
import { Task } from '@xmcl/task'
import { app, shell } from 'electron'
import { join } from 'path'
import { URL } from 'url'
import Controller from './Controller'
import defaultApp from './defaultApp'
import { preloadServices } from './preloadServices'
import { DownloadAppInstallerTask } from './utils/appinstaller'
import { isDirectory } from './utils/fs'
import { ElectronUpdater, setup } from './utils/updater'
import { getWindowsUtils } from './utils/windowsUtils'

class ElectronShell implements Shell {
  showItemInFolder = shell.showItemInFolder
  async openDirectory(path: string) {
    if (await isDirectory(path)) {
      return shell.openPath(path).then(r => r !== '')
    }
    return false
  }

  async openInBrowser(url: string) {
    await shell.openExternal(url)
    return true
  }

  createShortcut(path: string, details: {

    // Docs: https://electronjs.org/docs/api/structures/shortcut-details

    /**
     * The Application User Model ID. Default is empty.
     */
    appUserModelId?: string
    /**
     * The arguments to be applied to `target` when launching from this shortcut.
     * Default is empty.
     */
    args?: string
    /**
     * The working directory. Default is empty.
     */
    cwd?: string
    /**
     * The description of the shortcut. Default is empty.
     */
    description?: string
    /**
     * The path to the icon, can be a DLL or EXE. `icon` and `iconIndex` have to be set
     * together. Default is empty, which uses the target's icon.
     */
    icon?: string
    /**
     * The resource ID of icon when `icon` is a DLL or EXE. Default is 0.
     */
    iconIndex?: number
    /**
     * The target to launch from this shortcut.
     */
    target: string
    /**
     * The Application Toast Activator CLSID. Needed for participating in Action
     * Center.
     */
    toastActivatorClsid?: string
  }): boolean {
    // TODO: make sure this
    // if (details.target === app.getPath('exe') && this.env === 'appx') {
    //   details.target = 'C:\\Windows\\Explorer.exe'
    //   details.args = `shell:AppsFolder\\${getPackageFamilyName()}!App ${details.args}`
    // }
    return shell.writeShortcutLink(path, details)
  }
}

export default class ElectronLauncherApp extends LauncherApp {
  constructor() {
    super(app,
      new ElectronShell(),
      (app) => new Controller(app as ElectronLauncherApp),
      (app) => new ElectronUpdater(app as ElectronLauncherApp),
      defaultApp,
      preloadServices,
    )
  }

  windowsUtils = getWindowsUtils(this)

  getAppInstallerStartUpUrl(): string {
    if (this.windowsUtils) {
      try {
        const uri = this.windowsUtils.getAppInstallerUri()
        const url = new URL(uri)
        const appUrl = url.searchParams.get('app') || ''
        return appUrl
      } catch {
        return ''
      }
    }
    return ''
  }

  waitEngineReady(): Promise<void> {
    return app.whenReady()
  }

  relaunch() {
    app.relaunch()
    app.exit(0)
  }

  protected async setup() {
    // forward window-all-closed event
    app.on('window-all-closed', () => {
      this.emit('window-all-closed')
    })

    app.on('open-url', (event, url) => {
      event.preventDefault()
      this.protocol.handle({ url })
    }).on('second-instance', (e, argv) => {
      const last = argv[argv.length - 1]
      if (last.startsWith('xmcl://')) {
        this.protocol.handle({ url: last })
      }
    })

    await super.setup()

    setup(this.serviceStateManager)
  }
}
