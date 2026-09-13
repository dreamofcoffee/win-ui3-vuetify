import { nextTick, onScopeDispose, watch } from 'vue'

type LocationData = {
  target: { value: HTMLElement | [number, number] | undefined }
  contentEl: { value: HTMLElement | undefined }
}

type LocationStyles = { value: Record<string, string> }

/**
 * WinUI ComboBox flyouts open around the selected row. The selected row stays
 * centred on the closed control whenever the viewport can contain the flyout;
 * close to an edge the whole flyout is shifted into the available viewport.
 */
export function winuiSelectLocationStrategy(
  data: LocationData,
  _props: unknown,
  contentStyles: LocationStyles,
) {
  let frame = 0
  let settleFrame = 0
  let settlePass = 0
  let resizeObserver: ResizeObserver | undefined
  let mutationObserver: MutationObserver | undefined

  function updateLocation() {
    const target = data.target.value
    const contentHost = data.contentEl.value
    if (!contentHost || !target || Array.isArray(target)) return
    const content = contentHost.matches('.v-overlay__content')
      ? contentHost
      : contentHost.querySelector<HTMLElement>('.v-overlay__content')
    if (!content) return

    const overlayHost = contentHost.matches('.v-overlay')
      ? contentHost
      : contentHost.closest<HTMLElement>('.v-overlay')
    const menuId = overlayHost?.id
    const activator = menuId
      ? document.querySelector<HTMLElement>(`.v-field[aria-controls="${CSS.escape(menuId)}"]`)
      : undefined
    const targetElement = activator ?? target.querySelector<HTMLElement>('.v-field') ?? target
    const targetRect = targetElement.getBoundingClientRect()
    const contentRect = content.getBoundingClientRect()
    const activeItem = content.querySelector<HTMLElement>(
      '.v-list-item--active, [aria-selected="true"]',
    )
    const viewportMargin = 8
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth
    const flyoutHeight = Math.min(content.scrollHeight || contentRect.height, viewportHeight - viewportMargin * 2)

    const activeRect = activeItem?.getBoundingClientRect()
    const contentInset = content.querySelector<HTMLElement>('.v-list')?.getBoundingClientRect().top
      ?? contentRect.top
    const selectedCenter = activeItem && activeRect
      ? activeItem.offsetTop + (contentInset - contentRect.top) + activeRect.height / 2
      : flyoutHeight / 2
    const targetCenter = targetRect.top + targetRect.height / 2
    const idealTop = targetCenter - selectedCenter
    let top = Math.min(
      Math.max(idealTop, viewportMargin),
      Math.max(viewportMargin, viewportHeight - viewportMargin - flyoutHeight),
    )
    // When viewport clamping leaves the flyout only partly covering the
    // ComboBox, the control's rounded stroke peeks through as a thin seam.
    // WinUI paints the flyout continuously over that edge, so snap the
    // overlapping edge one pixel past the control instead of leaving a gap.
    const flyoutBottom = top + flyoutHeight
    const overlapsTarget = top < targetRect.bottom && flyoutBottom > targetRect.top
    if (overlapsTarget) {
      if (top > targetRect.top) top = Math.max(viewportMargin, targetRect.top - 1)
      else if (flyoutBottom < targetRect.bottom) top = targetRect.bottom - flyoutHeight + 1
    }
    const left = Math.min(
      Math.max(targetRect.left, viewportMargin),
      Math.max(viewportMargin, viewportWidth - viewportMargin - targetRect.width),
    )

    Object.assign(contentStyles.value, {
      position: 'fixed',
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      right: 'auto',
      minWidth: `${Math.round(targetRect.width)}px`,
      maxWidth: `${Math.round(targetRect.width)}px`,
      maxHeight: `${Math.max(0, viewportHeight - viewportMargin * 2)}px`,
      translate: '0 0',
      transformOrigin: 'center center',
      '--v-overlay-anchor-origin': 'center center',
    })

  }

  function settleLocation() {
    const target = data.target.value
    const contentHost = data.contentEl.value
    if (!contentHost || !target || Array.isArray(target)) return
    const content = contentHost.matches('.v-overlay__content')
      ? contentHost
      : contentHost.querySelector<HTMLElement>('.v-overlay__content')
    if (!content) return
    const overlayHost = contentHost.matches('.v-overlay')
      ? contentHost
      : contentHost.closest<HTMLElement>('.v-overlay')
    const menuId = overlayHost?.id
    const activator = menuId
      ? document.querySelector<HTMLElement>(`.v-field[aria-controls="${CSS.escape(menuId)}"]`)
      : undefined
    const targetElement = activator ?? target.querySelector<HTMLElement>('.v-field') ?? target
    const activeItem = content.querySelector<HTMLElement>(
      '.v-list-item--active, [aria-selected="true"]',
    )
    if (!activeItem) return
    const contentRect = content.getBoundingClientRect()
    const activeRect = activeItem.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()
    const viewportMargin = 8
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const correction = targetRect.top + targetRect.height / 2
      - (activeRect.top + activeRect.height / 2)
    if (Math.abs(correction) < 1) {
      settlePass = 0
      return
    }
    const correctedTop = Math.min(
      Math.max(contentRect.top + correction, viewportMargin),
      Math.max(viewportMargin, viewportHeight - viewportMargin - contentRect.height),
    )
    const currentTranslate = Number.parseFloat(
      getComputedStyle(content).translate.split(' ')[1] ?? '0',
    ) || 0
    const translateY = Math.round(currentTranslate + correctedTop - contentRect.top)
    const translateValue = `0 ${translateY}px`
    contentStyles.value.translate = translateValue
    content.style.translate = translateValue
    if (++settlePass < 5) settleFrame = requestAnimationFrame(settleLocation)
  }

  function scheduleUpdate() {
    cancelAnimationFrame(frame)
    cancelAnimationFrame(settleFrame)
    settlePass = 0
    nextTick(() => {
      frame = requestAnimationFrame(() => {
        updateLocation()
        // VSelect scrolls to its selected virtual row on the first frame.
        frame = requestAnimationFrame(() => {
          updateLocation()
          frame = requestAnimationFrame(() => {
            updateLocation()
            settleFrame = requestAnimationFrame(settleLocation)
          })
        })
      })
    })
  }

  const stop = watch([data.target, data.contentEl], ([, content], [, oldContent]) => {
    if (oldContent instanceof HTMLElement) resizeObserver?.unobserve(oldContent)
    mutationObserver?.disconnect()
    if (content instanceof HTMLElement) {
      resizeObserver ??= new ResizeObserver(scheduleUpdate)
      resizeObserver.observe(content)
      mutationObserver ??= new MutationObserver(scheduleUpdate)
      mutationObserver.observe(content, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-selected'],
      })
    }
    scheduleUpdate()
  }, { immediate: true })

  window.addEventListener('resize', scheduleUpdate, { passive: true })
  window.visualViewport?.addEventListener('resize', scheduleUpdate, { passive: true })

  onScopeDispose(() => {
    stop()
    cancelAnimationFrame(frame)
    cancelAnimationFrame(settleFrame)
    resizeObserver?.disconnect()
    mutationObserver?.disconnect()
    window.removeEventListener('resize', scheduleUpdate)
    window.visualViewport?.removeEventListener('resize', scheduleUpdate)
  })

  return { updateLocation }
}
