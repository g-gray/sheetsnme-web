export const resize = geometry => ({
  type: 'RESIZE',
  geometry,
})

export const setMobileLayout = isMobileLayout => ({
  type: 'SET_MOBILE_LAYOUT',
  isMobileLayout,
})
