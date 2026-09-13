export const winuiThemes = {
  defaultTheme: 'winuiLight',
  themes: {
    winuiLight: { dark: false, colors: {
      primary: '#0067C0', 'primary-darken-1': '#005FB8', 'primary-container': '#E5F1FB',
      secondary: '#5B5FC7', accent: '#107C10', error: '#C42B1C', info: '#0067C0', success: '#0F7B0F', warning: '#9D5D00',
      background: '#F9F9F9', surface: '#FFFFFF', 'surface-variant': '#F7F7F7', nav: '#F3F3F3', outline: '#E5E5E5',
      'on-surface': '#1A1A1A', 'on-surface-variant': '#616161', sidebar: '#F3F3F3', 'on-sidebar': '#1A1A1A',
      'grey-50':'#FAFAFA','grey-100':'#F3F3F3','grey-200':'#E5E5E5','grey-300':'#D1D1D1','grey-400':'#A0A0A0','grey-500':'#616161','grey-600':'#4A4A4A','grey-700':'#323232','grey-800':'#1A1A1A','grey-900':'#0F0F0F',
    } },
    winuiDark: { dark: true, colors: {
      primary: '#60CDFF', 'primary-darken-1': '#4CC2FF', 'primary-container': '#123B52',
      secondary: '#B4A0FF', accent: '#6CCB5F', error: '#FF99A4', info: '#60CDFF', success: '#6CCB5F', warning: '#FCE100',
      background: '#272727', surface: '#2C2C2C', 'surface-variant': '#292929', nav: '#202020', outline: '#3D3D3D',
      'on-surface': '#FFFFFF', 'on-surface-variant': '#C8C8C8', sidebar: '#202020', 'on-sidebar': '#FFFFFF',
    } },
  },
} as const
