import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePalette } from '../three/usePalette'
import { useDragSpin } from '../three/useDragSpin'

export type OrbitItem = { id: string; logo: string }
type Props = { center: OrbitItem; inner: OrbitItem[]; outer: OrbitItem[]; calm: boolean }

const WARM = '#e0481f'
const roundedCard = (s: number, r: number) => {
  const h = s / 2, sh = new THREE.Shape()
  sh.moveTo(-h + r, -h); sh.lineTo(h - r, -h); sh.quadraticCurveTo(h, -h, h, -h + r); sh.lineTo(h, h - r); sh.quadraticCurveTo(h, h, h - r, h)
  sh.lineTo(-h + r, h); sh.quadraticCurveTo(-h, h, -h, h - r); sh.lineTo(-h, -h + r); sh.quadraticCurveTo(-h, -h, -h + r, -h)
  return new THREE.ShapeGeometry(sh, 8)
}

/** A logo on a rounded white card that always faces the camera and dims as it swings to the back. */
function LogoCard({ tex, size, position, glow, flat }: { tex: THREE.Texture; size: number; position: [number, number, number]; glow?: boolean; flat?: boolean }) {
  const g = useRef<THREE.Group>(null), mat = useRef<THREE.MeshBasicMaterial>(null), logo = useRef<THREE.MeshBasicMaterial>(null)
  const geo = useMemo(() => roundedCard(size, size * 0.14), [size])
  const img = tex.image as { width: number; height: number }
  const fit = (size * 0.76) / Math.max(img.width, img.height)
  const tmp = useMemo(() => ({ p: new THREE.Vector3(), q: new THREE.Quaternion() }), [])
  useFrame(({ camera }) => {
    const o = g.current; if (!o?.parent) return
    o.parent.getWorldQuaternion(tmp.q); o.quaternion.copy(tmp.q.invert().multiply(camera.quaternion))
    o.getWorldPosition(tmp.p)
    const depth = flat ? 1 : THREE.MathUtils.clamp(0.94 + (tmp.p.z / 4) * 0.06, 0.88, 1)
    mat.current?.color.setScalar(depth); logo.current?.color.setScalar(depth)
  })
  return (
    <group ref={g} position={position}>
      {glow && <mesh position={[0, 0, -0.02]}><circleGeometry args={[size * 0.82, 48]} /><meshBasicMaterial color={WARM} transparent opacity={0.16} depthWrite={false} /></mesh>}
      <mesh geometry={geo}><meshBasicMaterial ref={mat} color="white" toneMapped={false} /></mesh>
      <mesh position={[0, 0, 0.005]}><planeGeometry args={[img.width * fit, img.height * fit]} /><meshBasicMaterial ref={logo} map={tex} transparent toneMapped={false} /></mesh>
    </group>
  )
}

function Ring({ radius, color, opacity }: { radius: number; color: THREE.Color; opacity: number }) {
  const line = useMemo(() => {
    const pts = Array.from({ length: 129 }, (_, i) => { const a = (i / 128) * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius) })
    return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color, transparent: true, opacity }))
  }, [radius, color, opacity])
  return <primitive object={line} />
}

function Orbit({ center, inner, outer, calm }: Props) {
  const pal = usePalette()
  const gl = useThree((s) => s.gl)
  const spin = useDragSpin(gl.domElement, 0.006)
  const root = useRef<THREE.Group>(null), ringA = useRef<THREE.Group>(null), ringB = useRef<THREE.Group>(null)
  const urls = useMemo(() => [center.logo, ...inner.map((i) => i.logo), ...outer.map((i) => i.logo)], [center, inner, outer])
  const tex = useLoader(THREE.TextureLoader, urls)
  tex.forEach((t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8 })
  const R1 = 1.8, R2 = 3.1
  // fit the camera to whatever shape the container is, so the outer ring can never leave the frame
  const { camera, size } = useThree((s) => ({ camera: s.camera as THREE.PerspectiveCamera, size: s.size }))
  useEffect(() => {
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), aspect = size.width / Math.max(size.height, 1)
    const need = (half: number, depth: number, a: number) => half / (t * a) + depth
    const d = Math.max(need(R2 + 0.45, 0, aspect), need(R2 * 0.72 + 0.45, R2 * 0.72, aspect), need(R2 * 0.55 + 0.5, 1.2, 1)) * 1.08
    camera.position.set(0, 0, d); camera.updateProjectionMatrix()
  }, [camera, size, R2])

  useFrame((_, dt) => {
    const r = root.current, a = ringA.current, b = ringB.current; if (!r || !a || !b) return
    const sp = spin.current
    if (!sp.down) sp.vel += ((calm ? 0 : 0.0016) - sp.vel) * Math.min(1, dt * 1.4)
    r.rotation.y += sp.vel
    r.rotation.x += (0.32 - r.rotation.x) * Math.min(1, dt * 1.5)
    if (!calm) { a.rotation.y += dt * 0.22; b.rotation.y -= dt * 0.12 }
  })

  const place = (list: OrbitItem[], R: number, offset: number, base: number, size: number) =>
    list.map((it, i) => { const t = offset + (i / list.length) * Math.PI * 2; return <LogoCard key={it.id} tex={tex[base + i]} size={size} position={[Math.cos(t) * R, 0, Math.sin(t) * R]} /> })

  return (
    <group ref={root}>
      <LogoCard tex={tex[0]} size={1.35} position={[0, 0, 0]} glow flat />
      <group rotation={[0.12, 0, 0.06]}>
        <Ring radius={R1} color={pal.current.line} opacity={0.5} />
        <group ref={ringA}>{place(inner, R1, 0.4, 1, 0.6)}</group>
      </group>
      <group rotation={[-0.14, 0, -0.1]}>
        <Ring radius={R2} color={pal.current.line} opacity={0.28} />
        <group ref={ringB}>{place(outer, R2, 0.3, 1 + inner.length, 0.54)}</group>
      </group>
    </group>
  )
}

export default function ClientsOrbitScene(props: Props & { paused: boolean }) {
  const { paused, ...rest } = props
  return (
    <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: 'low-power', toneMapping: THREE.NoToneMapping }} frameloop={paused ? 'never' : 'always'} camera={{ fov: 26, position: [0, 0, 15] }} style={{ cursor: 'grab', touchAction: 'pan-y' }} aria-hidden="true">
      <Orbit {...rest} />
    </Canvas>
  )
}
