import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { zhHans } from 'vuetify/locale'
import { winuiEnabled } from './config'
import { winuiDefaults } from './defaults'
import { winuiThemes } from './themes'

export default createVuetify({
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
  locale: { locale: 'zhHans', fallback: 'zhHans', messages: { zhHans } },
  ...(winuiEnabled ? {
    defaults: winuiDefaults,
    theme: winuiThemes,
  } : {}),
})
