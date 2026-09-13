import { winuiSelectLocationStrategy } from './strategies/selectLocation'

const winuiSelectMenu = {
  class: 'winui-select-menu',
  locationStrategy: winuiSelectLocationStrategy,
  transition: 'fade-transition',
}

export const winuiDefaults = {
  VCard: { elevation: 0, rounded: 'lg' },
  VBtn: { elevation: 0, rounded: 'sm', size: 'small', ripple: false },
  VTextField: { variant: 'filled', density: 'compact' },
  VSelect: { variant: 'filled', density: 'compact', menuProps: winuiSelectMenu },
  VAutocomplete: { variant: 'filled', density: 'compact', menuProps: winuiSelectMenu },
  VCombobox: { variant: 'filled', density: 'compact', menuProps: winuiSelectMenu },
  VTextarea: { variant: 'filled', density: 'compact' },
  VFileInput: { variant: 'filled', density: 'compact' },
  VSwitch: { density: 'compact', color: 'primary', hideDetails: 'auto', ripple: false },
  VCheckbox: { density: 'compact', color: 'primary', ripple: false },
  VCheckboxBtn: { density: 'compact', color: 'primary', ripple: false },
  VRadioGroup: { density: 'compact' },
  VRadio: { density: 'compact', color: 'primary', ripple: false },
  VSlider: { density: 'compact', color: 'primary', ripple: false },
  VRating: { density: 'comfortable', color: 'primary', activeColor: 'primary', ripple: false },
  VColorPicker: { elevation: 0 },
  VProgressLinear: { color: 'primary' },
  VBtnToggle: { density: 'compact' },
  VDataTable: { hover: true, density: 'compact' },
  VDataTableServer: { hover: true, density: 'compact' },
  VDialog: { width: 560 },
  VChip: { size: 'small', rounded: 'sm', variant: 'tonal', ripple: false },
  VList: { density: 'compact' },
  VListItem: { rounded: 'sm', ripple: false },
  VTab: { ripple: false },
  VToolbar: { flat: true, color: 'transparent', density: 'compact' },
  VMenu: { offset: 8, transition: 'fade-transition' },
  VTooltip: { location: 'bottom' },
} as const
