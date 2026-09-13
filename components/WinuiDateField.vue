<template>
  <v-menu
    v-model="menuOpen"
    :close-on-content-click="false"
    attach="body"
    location="bottom start"
    :location-strategy="dateFieldLocationStrategy"
    :offset="0"
    transition="fade-transition"
    class="winui-date-menu"
  >
    <template #activator="{ props: activatorProps }">
      <v-text-field
        v-bind="activatorProps"
        :model-value="displayValue"
        :label="label"
        :placeholder="placeholder"
        :disabled="disabled"
        readonly
        append-inner-icon="mdi-calendar-blank-outline"
        class="winui-date-field"
        @click="openPicker"
        @click:append-inner="openPicker"
      />
    </template>

    <v-date-picker
      v-model="pickerValue"
      v-model:view-mode="viewMode"
      v-model:month="visibleMonth"
      v-model:year="visibleYear"
      class="winui-date-picker"
      color="primary"
      hide-header
      show-adjacent-months
      @update:model-value="selectDate"
    >
      <template #controls>
        <div class="winui-calendar-header">
          <v-btn variant="text" class="winui-calendar-header__title" @click="drillUp">
            {{ pickerTitle }}
          </v-btn>
          <v-spacer />
          <v-btn icon variant="text" aria-label="上一时间段" @click="shiftPeriod(-1)">
            <v-icon>mdi-menu-up</v-icon>
          </v-btn>
          <v-btn icon variant="text" aria-label="下一时间段" @click="shiftPeriod(1)">
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
        </div>
      </template>
    </v-date-picker>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, nextTick, onScopeDispose, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string | null
  label: string
  placeholder?: string
  disabled?: boolean
}>(), {
  modelValue: '',
  placeholder: '年 / 月 / 日',
  disabled: false,
})

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
type ViewMode = 'month' | 'months' | 'year'
type LocationData = {
  target: { value: HTMLElement | [number, number] | undefined }
  contentEl: { value: HTMLElement | undefined }
}
type LocationStyles = { value: Record<string, string> }

const menuOpen = ref(false)
const viewMode = ref<ViewMode>('month')
const pickerValue = ref<Date | null>(null)
const visibleMonth = ref(new Date().getMonth())
const visibleYear = ref(new Date().getFullYear())

function dateFieldLocationStrategy(data: LocationData, _props: unknown, styles: LocationStyles) {
  let frame = 0
  let observer: ResizeObserver | undefined
  function updateLocation() {
    const target = data.target.value
    const content = data.contentEl.value
    if (!content || !target || Array.isArray(target)) return
    const field = target.querySelector<HTMLElement>('.v-field') ?? target
    const targetRect = field.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const margin = 8
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const width = Math.min(328, viewportWidth - margin * 2)
    const height = contentRect.height || 366
    const left = Math.min(Math.max(targetRect.left, margin), viewportWidth - margin - width)
    const below = targetRect.bottom
    const availableBelow = Math.max(0, viewportHeight - margin - below)
    Object.assign(styles.value, {
      position: 'fixed',
      left: `${Math.round(left)}px`,
      top: `${Math.round(below)}px`,
      right: 'auto',
      minWidth: `${Math.round(width)}px`,
      maxWidth: `${Math.round(width)}px`,
      maxHeight: `${availableBelow}px`,
      transformOrigin: 'top left',
    })
  }
  function schedule() {
    cancelAnimationFrame(frame)
    nextTick(() => { frame = requestAnimationFrame(updateLocation) })
  }
  const stop = watch([data.target, data.contentEl], ([, content]) => {
    observer?.disconnect()
    if (content instanceof HTMLElement) {
      observer = new ResizeObserver(schedule)
      observer.observe(content)
    }
    schedule()
  }, { immediate: true })
  window.addEventListener('resize', schedule, { passive: true })
  onScopeDispose(() => {
    stop()
    cancelAnimationFrame(frame)
    observer?.disconnect()
    window.removeEventListener('resize', schedule)
  })
  return { updateLocation }
}

const displayValue = computed(() => props.modelValue ? props.modelValue.replace(/-/g, '/') : '')
const pickerTitle = computed(() => {
  if (viewMode.value === 'month') return `${visibleYear.value}年${visibleMonth.value + 1}月`
  if (viewMode.value === 'months') return `${visibleYear.value}年`
  const decade = Math.floor(visibleYear.value / 10) * 10
  return `${decade} - ${decade + 9}`
})

watch(() => props.modelValue, syncPickerDate, { immediate: true })

function parseDate(value?: string | null) {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(date.getTime()) ? null : date
}

function syncPickerDate(value?: string | null) {
  const date = parseDate(value)
  pickerValue.value = date
  if (date) {
    visibleMonth.value = date.getMonth()
    visibleYear.value = date.getFullYear()
  }
}

function openPicker() {
  if (props.disabled) return
  syncPickerDate(props.modelValue)
  viewMode.value = 'month'
  menuOpen.value = true
}

function selectDate(value: Date | string | null) {
  if (!value) return
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  emit('update:modelValue', `${year}-${month}-${day}`)
  menuOpen.value = false
  viewMode.value = 'month'
}

function drillUp() {
  viewMode.value = viewMode.value === 'month' ? 'months' : viewMode.value === 'months' ? 'year' : 'months'
}

function shiftPeriod(direction: -1 | 1) {
  if (viewMode.value === 'month') {
    const next = new Date(visibleYear.value, visibleMonth.value + direction, 1)
    visibleYear.value = next.getFullYear()
    visibleMonth.value = next.getMonth()
  } else {
    visibleYear.value += direction * (viewMode.value === 'year' ? 10 : 1)
  }
}
</script>
