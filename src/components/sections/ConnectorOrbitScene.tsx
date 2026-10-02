import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePalette } from '../three/usePalette'
import { useDragSpin } from '../three/useDragSpin'

type Props = { count: number; active: number; onPick: (i: number) => void; calm: boolean }
const R = 2.3
const posOf = (i: number, n: number) => { const a = (i / n) * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * R, Math.sin(i * 1.9) * 0.75, Math.sin(a) * R) }

function Orbit({ count, active, onPick, calm }: Props) {
  const pal = usePalette()
  const gl = useThree((s) => s.gl)
  const spin = useDragSpin(gl.domElement)
  const ring = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const packet = useRef<THREE.Mesh>(null)
  const nodes = useRef<(THREE.Mesh | null)[]>([])
  const pts = useMemo(() => Array.from({ length: count }, (_, i) => posOf(i, count)), [count])
  const lines = useMemo(() => pts.map((p) => new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), p]), new THREE.LineBasicMaterial({ transparent: true, opacity: 0.25 }))), [pts])
  useEffect(() => () => lines.forEach((l) => { l.geometry.dispose(); (l.material as THREE.Material).dispose() }), [lines])

  useFrame(({ clock }, dt) => {
    const g = ring.current; if (!g) return
    const t = clock.elapsedTime, sp = spin.current
    if (!sp.down) sp.vel += ((calm ? 0 : 0.0035) - sp.vel) * Math.min(1, dt * 1.6)
    g.rotation.y += sp.vel; g.rotation.x = 0.32
    if (core.current) { core.current.rotation.y = t * 0.4; core.current.rotation.x = t * 0.25 }
    nodes.current.forEach((m, i) => {
      if (!m) return
      const on = i === active
      m.scale.setScalar(THREE.MathUtils.lerp(m.scale.x, on ? 1.7 : 1, 0.12))
      ;(m.material as THREE.MeshBasicMaterial).color.copy(on ? pal.current.warm : i % 2 ? pal.current.cool : pal.current.brand)
      const lm = lines[i].material as THREE.LineBasicMaterial
      lm.color.copy(on ? pal.current.warm : pal.current.line); lm.opacity = THREE.MathUtils.lerp(lm.opacity, on ? 0.9 : 0.22, 0.1)
    })
    const pk = packet.current
    if (pk && pts[active]) { pk.position.copy(pts[active]).multiplyScalar(1 - ((t * 0.7) % 1)); (pk.material as THREE.MeshBasicMaterial).color.copy(pal.current.warm) }
  })

  return (
    <group ref={ring}>
      <mesh ref={core}><icosahedronGeometry args={[0.85, 1]} /><meshBasicMaterial wireframe color={pal.current.cool} transparent opacity={0.85} /></mesh>
      <mesh><sphereGeometry args={[0.38, 24, 24]} /><meshBasicMaterial color={pal.current.brand} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[R - 0.01, R + 0.01, 128]} /><meshBasicMaterial color={pal.current.line} transparent opacity={0.3} side={THREE.DoubleSide} /></mesh>
      {lines.map((l, i) => <primitive key={i} object={l} />)}
      {pts.map((p, i) => (
        <mesh key={i} ref={(m) => { nodes.current[i] = m }} position={p}
          onClick={(e) => { e.stopPropagation(); if (spin.current.moved < 5) onPick(i) }}
          onPointerOver={() => { gl.domElement.style.cursor = 'pointer' }} onPointerOut={() => { gl.domElement.style.cursor = 'grab' }}>
          <sphereGeometry args={[0.2, 20, 20]} /><meshBasicMaterial color={pal.current.brand} />
        </mesh>
      ))}
      <mesh ref={packet}><sphereGeometry args={[0.07, 12, 12]} /><meshBasicMaterial color={pal.current.warm} /></mesh>
    </group>
  )
}

export default function ConnectorOrbitScene(props: Props & { paused: boolean }) {
  const { paused, ...rest } = props
  return (
    <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} frameloop={paused ? 'never' : 'always'} camera={{ fov: 40, position: [0, 0, 8.2] }} style={{ cursor: 'grab', touchAction: 'pan-y' }} aria-hidden="true">
      <Orbit {...rest} />
    </Canvas>
  )
}
