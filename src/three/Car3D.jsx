import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, PresentationControls } from '@react-three/drei'
import * as THREE from 'three'
import { profiles } from '../data/profiles'

const U = (x, y) => [(x - 203) / 80, (140 - y) / 80]

function toShape(ops) {
  const s = new THREE.Shape()
  ops.forEach(([k, ...a]) => {
    if (k === 'M') s.moveTo(...U(a[0], a[1]))
    else if (k === 'L') s.lineTo(...U(a[0], a[1]))
    else if (k === 'Q') s.quadraticCurveTo(...U(a[0], a[1]), ...U(a[2], a[3]))
    else if (k === 'A') {
      const [cx, cy] = U(a[0], a[1])
      s.lineTo(cx + a[2] / 80, cy)
      s.absarc(cx, cy, a[2] / 80, 0, Math.PI, false)
    }
  })
  return s
}

function extrude(shape, depth, bevel) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.9, bevelSegments: 5, curveSegments: 28 })
  g.translate(0, 0, -depth / 2)
  return g
}

function Wheel({ x, z, spin }) {
  const ref = useRef()
  useFrame((_, dt) => {
    ref.current.rotation.z -= dt * spin
  })
  const [wx, wy] = U(x, 126)
  return (
    <group position={[wx, wy, z]} ref={ref}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.3, 40]} />
        <meshStandardMaterial color="#12151d" roughness={0.9} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, z > 0 ? 0.08 : -0.08]}>
        <cylinderGeometry args={[0.21, 0.21, 0.16, 32]} />
        <meshStandardMaterial color="#C9CED8" metalness={0.9} roughness={0.25} />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh key={i} rotation={[0, 0, (i / 5) * Math.PI * 2]} position={[0, 0, z > 0 ? 0.165 : -0.165]}>
          <boxGeometry args={[0.36, 0.05, 0.02]} />
          <meshStandardMaterial color="#8C93A3" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

export function Car({ body = 'hatch', color = '#D7263D', spin = 1.2 }) {
  const p = profiles[body]
  const geo = useMemo(
    () => ({
      body: extrude(toShape(p.body), 1.5, 0.14),
      glass: extrude(toShape(p.windows), 1.8, 0),
    }),
    [p],
  )
  const [hx, hy] = U(360, 101)
  const [tx, ty] = U(42, 104)
  return (
    <group>
      <mesh geometry={geo.body} castShadow>
        <meshPhysicalMaterial color={color} metalness={0.55} roughness={0.28} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <mesh geometry={geo.glass}>
        <meshPhysicalMaterial color="#141B2B" metalness={0.6} roughness={0.08} />
      </mesh>
      {[-0.52, 0.52].map((z) => (
        <group key={z}>
          <mesh position={[hx, hy, z]}>
            <boxGeometry args={[0.16, 0.08, 0.32]} />
            <meshStandardMaterial color="#FFF6D6" emissive="#FFE9A8" emissiveIntensity={2} />
          </mesh>
          <mesh position={[tx, ty, z]}>
            <boxGeometry args={[0.12, 0.09, 0.34]} />
            <meshStandardMaterial color="#D7263D" emissive="#D7263D" emissiveIntensity={1.6} />
          </mesh>
        </group>
      ))}
      {[100, 300].flatMap((x) => [0.76, -0.76].map((z) => <Wheel key={`${x}${z}`} x={x} z={z} spin={spin} />))}
    </group>
  )
}

function Rig() {
  const { camera, size } = useThree()
  useEffect(() => {
    const aspect = size.width / size.height
    const z = 8.6 * Math.max(1, Math.pow(1.6 / aspect, 0.85))
    camera.position.set(0, z * 0.3, z)
    camera.lookAt(0, 0.2, 0)
  }, [camera, size])
  return null
}

function Turntable({ body, color, progress }) {
  const ref = useRef()
  useFrame(({ clock }, dt) => {
    const p = progress ? progress.get() : 0
    ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, -0.6 + clock.elapsedTime * 0.25 + p * 2.5, 6, dt)
  })
  return (
    <group ref={ref}>
      <group position={[0, 0.33, 0]}>
        <Car body={body} color={color} />
      </group>
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[3, 3.05, 0.1, 96]} />
        <meshStandardMaterial color="#1E2840" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.85, 2.92, 96]} />
        <meshBasicMaterial color="#D7263D" />
      </mesh>
    </group>
  )
}

export default function Car3D({ body, color, progress }) {
  return (
    <Canvas dpr={[1, 2]} shadows={false} camera={{ position: [0, 2.6, 8.6], fov: 32 }} gl={{ antialias: true, alpha: true }}>
      <Rig />
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={2.2} />
      <PresentationControls global snap polar={[-0.1, 0.2]} azimuth={[-Infinity, Infinity]} config={{ mass: 1, tension: 170, friction: 26 }}>
        <Turntable body={body} color={color} progress={progress} />
      </PresentationControls>
      <ContactShadows position={[0, -0.1, 0]} opacity={0.6} scale={9} blur={2.4} far={2} />
      <Environment resolution={256}>
        <Lightformer intensity={3} position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 3, 1]} />
        <Lightformer intensity={2} position={[-6, 1, 2]} scale={[2, 6, 1]} color="#9DB7FF" />
        <Lightformer intensity={2} position={[6, 1, -2]} scale={[2, 6, 1]} color="#FFD4D9" />
        <Lightformer intensity={1} position={[0, 1, 6]} scale={[10, 1, 1]} />
      </Environment>
    </Canvas>
  )
}
