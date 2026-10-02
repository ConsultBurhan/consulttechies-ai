import { useEffect, useRef } from 'react'

/** horizontal drag with inertia on an element; returns a ref to read { x (radians), moved } each frame */
export function useDragSpin(el: HTMLElement | null, sens = 0.008) {
  const s = useRef({ vel: 0, down: false, lastX: 0, moved: 0, idle: 0 })
  useEffect(() => {
    if (!el) return
    const st = s.current
    const down = (e: PointerEvent) => { st.down = true; st.lastX = e.clientX; st.moved = 0; el.setPointerCapture?.(e.pointerId) }
    const move = (e: PointerEvent) => { if (!st.down) return; const dx = e.clientX - st.lastX; st.lastX = e.clientX; st.moved += Math.abs(dx); st.vel = dx * sens; st.idle = 0 }
    const up = () => { st.down = false }
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up)
    return () => { el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up) }
  }, [el, sens])
  return s
}
