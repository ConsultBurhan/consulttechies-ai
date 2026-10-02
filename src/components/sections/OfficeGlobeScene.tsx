import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePalette } from '../three/usePalette'
import { useDragSpin } from '../three/useDragSpin'

export type Pin = { lat: number; lon: number }
type Props = { pins: Pin[]; focus: number | null; calm: boolean }

const rad = (d: number) => (d * Math.PI) / 180
const toVec = (lat: number, lon: number, r = 1) => new THREE.Vector3(r * Math.cos(rad(lat)) * Math.sin(rad(lon)), r * Math.sin(rad(lat)), r * Math.cos(rad(lat)) * Math.cos(rad(lon)))
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))

function Globe({ pins, focus, calm }: Props) {
  const pal = usePalette()
  const gl = useThree((s) => s.gl)
  const spin = useDragSpin(gl.domElement, 0.006)
  const tilt = useRef<THREE.Group>(null)
  const yaw = useRef<THREE.Group>(null)
  const packet = useRef<THREE.Mesh>(null)
  const rings = useRef<(THREE.Mesh | null)[]>([])
  const mode = useRef<{ target: number | null }>({ target: null })

  const dots = useMemo(() => {
    const n = 1800, a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) { const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; a.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3) }
    return a
  }, [])
  const vecs = useMemo(() => pins.map((p) => toVec(p.lat, p.lon, 1.01)), [pins])
  const arc = useMemo(() => {
    if (vecs.length < 2) return null
    const a = vecs[0].clone().normalize(), b = vecs[1].clone().normalize(), pts: THREE.Vector3[] = []
    for (let i = 0; i <= 64; i++) { const t = i / 64; pts.push(a.clone().lerp(b, t).normalize().multiplyScalar(1.01 + 0.38 * Math.sin(Math.PI * t))) }
    return pts
  }, [vecs])
  const arcLine = useMemo(() => arc && new THREE.Line(new THREE.BufferGeometry().setFromPoints(arc), new THREE.LineBasicMaterial({ transparent: true, opacity: 0.8 })), [arc])
  useEffect(() => () => { arcLine?.geometry.dispose(); (arcLine?.material as THREE.Material | undefined)?.dispose() }, [arcLine])
  useEffect(() => { mode.current.target = focus }, [focus])

  useFrame(({ clock }, dt) => {
    const y = yaw.current, tl = tilt.current; if (!y || !tl) return
    const sp = spin.current
    if (sp.down) mode.current.target = null
    if (mode.current.target !== null && pins[mode.current.target]) {
      const p = pins[mode.current.target]
      y.rotation.y += wrap(-rad(p.lon) - y.rotation.y) * Math.min(1, dt * 3.2)
      tl.rotation.x += (rad(p.lat) * 0.75 - tl.rotation.x) * Math.min(1, dt * 3.2)
      sp.vel = 0
    } else {
      if (!sp.down) sp.vel += ((calm ? 0 : 0.0025) - sp.vel) * Math.min(1, dt * 1.4)
      y.rotation.y += sp.vel
      tl.rotation.x += (0.28 - tl.rotation.x) * Math.min(1, dt * 1.5)
    }
    const t = clock.elapsedTime
    rings.current.forEach((m, i) => { if (!m) return; const k = (t * 0.6 + i * 0.5) % 1; m.scale.setScalar(1 + k * 2.4); (m.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - k) })
    if (arc && packet.current) packet.current.position.copy(arc[Math.floor(((t * 0.35) % 1) * 64)])
    if (arcLine) (arcLine.material as THREE.LineBasicMaterial).color.copy(pal.current.warm)
  })

  return (
    <group ref={tilt}>
      <group ref={yaw}>
        <mesh><sphereGeometry args={[0.985, 48, 48]} /><meshBasicMaterial colorWrite={false} /></mesh>
        <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[dots, 3]} /></bufferGeometry><pointsMaterial size={0.02} color={pal.current.line} transparent opacity={0.9} sizeAttenuation /></points>
        {arcLine && <primitive object={arcLine} />}
        <mesh ref={packet}><sphereGeometry args={[0.025, 12, 12]} /><meshBasicMaterial color={pal.current.warm} /></mesh>
        {vecs.map((v, i) => {
          const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize())
          return (
            <group key={i} position={v} quaternion={q}>
              <mesh><sphereGeometry args={[0.035, 16, 16]} /><meshBasicMaterial color={pal.current.warm} /></mesh>
              <mesh ref={(m) => { rings.current[i] = m }}><ringGeometry args={[0.04, 0.05, 32]} /><meshBasicMaterial color={pal.current.warm} transparent opacity={0.6} side={THREE.DoubleSide} /></mesh>
            </group>
          )
        })}
      </group>
    </group>
  )
}

export default function OfficeGlobeScene(props: Props & { paused: boolean }) {
  const { paused, ...rest } = props
  return (
    <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }} frameloop={paused ? 'never' : 'always'} camera={{ fov: 34, position: [0, 0, 5.6] }} style={{ cursor: 'grab', touchAction: 'pan-y' }} aria-hidden="true">
      <Globe {...rest} />
    </Canvas>
  )
}
