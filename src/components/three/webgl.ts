import * as THREE from 'three'

export function canUseWebGL() {
  try {
    const c = document.createElement('canvas')
    const ok = !!(c.getContext('webgl2') || c.getContext('webgl'))
    const nav = navigator as Navigator & { deviceMemory?: number }
    const weak = (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2
    return ok && !weak
  } catch { return false }
}

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
export const readPalette = () => ({
  warm: new THREE.Color(css('--warm')), cool: new THREE.Color(css('--accent')), brand: new THREE.Color(css('--brand-hover')),
  ink: new THREE.Color(css('--ink')), line: new THREE.Color(css('--ink-3')), bg: new THREE.Color(css('--bg')),
})
