import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { NET_NODES, type NetNode } from './network'

export type ScenePhase = 'idle' | 'working' | 'done'
type Palette = { warm: THREE.Color; cool: THREE.Color; ink: THREE.Color; line: THREE.Color }

const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
const readPalette = (): Palette => ({
  warm: new THREE.Color(css('--warm')), cool: new THREE.Color(css('--cool')),
  ink: new THREE.Color(css('--ink')), line: new THREE.Color(css('--ink-3')),
})

function usePalette() {
  const ref = useRef<Palette>(readPalette())
  useEffect(() => {
    const mo = new MutationObserver(() => { ref.current = readPalette() })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return ref
}

const PER_EDGE = 5

type Props = {
  phase: ScenePhase
  active: string[]
  labelRefs: React.MutableRefObject<Record<string, HTMLElement | null>>
  calm: boolean
}

function Network({ phase, active, labelRefs, calm }: Props) {
  const pal = usePalette()
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Group>(null)
  const pts = useRef<THREE.Points>(null)
  const lineMat = useRef<THREE.LineBasicMaterial>(null)
  const coreWire = useRef<THREE.MeshBasicMaterial>(null)
  const coreSolid = useRef<THREE.MeshBasicMaterial>(null)
  const nodeMats = useRef<(THREE.MeshBasicMaterial | null)[]>([])
  const { camera, size, invalidate, pointer } = useThree()
  const energy = useRef(0)
  const tmp = useMemo(() => new THREE.Vector3(), [])

  const nodes = useMemo(() => NET_NODES.map((n) => ({ ...n, v: new THREE.Vector3(...n.pos) })), [])
  const linePos = useMemo(() => {
    const a: number[] = []
    nodes.forEach((n) => a.push(0, 0, 0, n.v.x, n.v.y, n.v.z))
    return new Float32Array(a)
  }, [nodes])
  const particleCount = nodes.length * PER_EDGE
  const seeds = useMemo(() => Float32Array.from({ length: particleCount }, () => Math.random()), [particleCount])
  const ppos = useMemo(() => new Float32Array(particleCount * 3), [particleCount])
  const pcol = useMemo(() => new Float32Array(particleCount * 3), [particleCount])
  const c = useMemo(() => new THREE.Color(), [])

  useEffect(() => {
    // narrow viewports get a wider shot so no node is cropped
    const aspect = size.width / Math.max(size.height, 1)
    camera.position.set(0, 0.2, aspect < 1.2 ? 12.2 + (1.2 - aspect) * 9 : 12.2)
    camera.lookAt(0, 0, 0)
  }, [camera, size.width, size.height])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const target = phase === 'working' ? 1 : phase === 'done' ? 0.35 : 0
    energy.current += (target - energy.current) * Math.min(1, dt * 3)
    const e = energy.current
    const p = pal.current

    if (group.current && !calm) {
      group.current.rotation.y = Math.sin(t * 0.12) * 0.35 + pointer.x * 0.18
      group.current.rotation.x = Math.sin(t * 0.09) * 0.08 - pointer.y * 0.1
    }
    if (core.current) { core.current.rotation.y = calm ? 0.5 : t * 0.25; core.current.rotation.x = calm ? 0.4 : t * 0.15; core.current.scale.setScalar(1 + e * 0.08 * Math.sin(t * 6)) }
    coreWire.current?.color.copy(p.ink); coreSolid.current?.color.copy(p.warm)
    if (lineMat.current) { lineMat.current.color.copy(p.line); lineMat.current.opacity = 0.28 + e * 0.35 }

    // particles travel source→core when working (data going in) and core→source otherwise (slow idle drift)
    for (let i = 0; i < particleCount; i++) {
      const ni = Math.floor(i / PER_EDGE)
      const n = nodes[ni]
      const isActive = active.includes(n.id)
      const speed = (0.08 + (isActive ? e * 0.55 : 0)) * (calm ? 0 : 1)
      const u = calm ? seeds[i] : (seeds[i] + t * speed) % 1
      const f = phase === 'working' ? 1 - u : u
      ppos[i * 3] = n.v.x * f; ppos[i * 3 + 1] = n.v.y * f; ppos[i * 3 + 2] = n.v.z * f
      c.copy(n.kind === 'people' ? p.warm : p.cool).lerp(p.warm, isActive ? (1 - f) * e : 0)
      const b = 0.35 + (isActive ? 0.65 * e : 0.0)
      pcol[i * 3] = c.r * b; pcol[i * 3 + 1] = c.g * b; pcol[i * 3 + 2] = c.b * b
    }
    if (pts.current) {
      const g = pts.current.geometry
      g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true
    }
    nodeMats.current.forEach((m, i) => {
      if (!m) return
      const n = nodes[i]
      const on = active.includes(n.id) && phase !== 'idle'
      m.color.copy(on ? p.warm : n.kind === 'people' ? p.warm : p.cool)
      m.opacity = on ? 1 : 0.85
    })

    // project DOM labels onto their nodes
    group.current?.updateWorldMatrix(true, false)
    nodes.forEach((n, i) => {
      const el = labelRefs.current[n.id]
      if (!el) return
      tmp.copy(n.v).applyMatrix4(group.current!.matrixWorld).project(camera)
      const x = (tmp.x * 0.5 + 0.5) * size.width, y = (-tmp.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      el.dataset.on = active.includes(n.id) && phase !== 'idle' ? '1' : '0'
      el.style.opacity = String(0.55 + 0.45 * ((tmp.z + 1) < 2 ? 1 : 0.7))
      void i
    })
    if (calm) invalidate()
  })

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[linePos, 3]} /></bufferGeometry>
        <lineBasicMaterial ref={lineMat} transparent opacity={0.3} />
      </lineSegments>
      <points ref={pts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ppos, 3]} />
          <bufferAttribute attach="attributes-color" args={[pcol, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.1} vertexColors transparent sizeAttenuation depthWrite={false} />
      </points>
      {nodes.map((n: NetNode & { v: THREE.Vector3 }, i) => (
        <mesh key={n.id} position={n.v} rotation={[0.5, 0.6, 0]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshBasicMaterial ref={(m) => { nodeMats.current[i] = m }} transparent />
        </mesh>
      ))}
      <group ref={core}>
        <mesh><boxGeometry args={[0.95, 0.95, 0.95]} /><meshBasicMaterial ref={coreWire} wireframe transparent opacity={0.9} /></mesh>
        <mesh><boxGeometry args={[0.42, 0.42, 0.42]} /><meshBasicMaterial ref={coreSolid} /></mesh>
      </group>
    </group>
  )
}

export default function HeroScene(props: Omit<Props, 'calm'> & { calm: boolean; paused: boolean }) {
  const { paused, ...rest } = props
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      frameloop={paused ? 'never' : rest.calm ? 'demand' : 'always'}
      camera={{ fov: 38, near: 0.1, far: 50 }}
      aria-hidden="true"
    >
      <Network {...rest} />
    </Canvas>
  )
}
