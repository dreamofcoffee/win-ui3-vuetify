import type { App } from 'vue'
import WinuiDateField from './components/WinuiDateField.vue'
import { winuiEnabled } from './config'
import vuetify from './vuetify'

export { WinuiDateField, vuetify }
export { winuiEnabled } from './config'
export { winuiDefaults } from './defaults'
export { winuiThemes } from './themes'
export { winuiSelectLocationStrategy } from './strategies/selectLocation'

export async function installWinuiVuetify(app: App) {
  await import('./styles/base.scss')
  if (winuiEnabled) await import('./styles/index.scss')
  app.use(vuetify)
  app.component('WinuiDateField', WinuiDateField)
}

declare module 'vue' {
  export interface GlobalComponents {
    WinuiDateField: typeof WinuiDateField
  }
}
