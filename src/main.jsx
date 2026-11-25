import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { Power, Volume2, VolumeX, Snowflake, Music2 } from 'lucide-react'
import './style.css'

const wood = '#65432f'
const darkWood = '#39271f'
const evergreen = '#183d2c'
const gold = '#d7b36d'

function Box({ position, args, color, material = {}, castShadow = true, receiveShadow = true, ...props }) {
  return <mesh position={position} castShadow={castShadow} receiveShadow={receiveShadow} {...props}>
    <boxGeometry args={args} />
    <meshStandardMaterial color={color} roughness={material.roughness ?? 0.78} metalness={material.metalness ?? 0} {...material} />
  </mesh>
}

function Cylinder({ position, args, color, material = {}, ...props }) {
  return <mesh position={position} castShadow receiveShadow {...props}>
    <cylinderGeometry args={args} />
    <meshStandardMaterial color={color} roughness={material.roughness ?? 0.72} metalness={material.metalness ?? 0} {...material} />
  </mesh>
}

function RoomShell() {
  const plankPositions = Array.from({ length: 15 }, (_, i) => -5.6 + i * 0.8)
  return <>
    <Box position={[0, -0.16, 0]} args={[12.4, 0.3, 9.2]} color="#4b3023" material={{ roughness: 0.62 }} />
    {Array.from({ length: 13 }, (_, i) => <Box key={i} position={[0, 0.005, -4.25 + i * 0.7]} args={[12.25, 0.018, 0.018]} color="#2e211b" castShadow={false} receiveShadow={false} />)}
    {plankPositions.map((x, i) => <Box key={`p${i}`} position={[x, 0.008, ((i % 2) * 0.35) - 0.18]} args={[0.018, 0.02, 8.8]} color="#2d211b" castShadow={false} receiveShadow={false} />)}
    <Box position={[0, 3.2, -4.55]} args={[12.4, 6.7, 0.3]} color="#674633" />
    <Box position={[-6.05, 3.2, 0]} args={[0.3, 6.7, 9.3]} color="#503729" />
    <Box position={[6.05, 3.2, 0]} args={[0.3, 6.7, 9.3]} color="#503729" />
    <Box position={[0, 6.55, 0]} args={[12.4, 0.22, 9.3]} color="#2e211b" />
    {/* Wall paneling */}
    {Array.from({ length: 14 }, (_, i) => <group key={`panel${i}`} position={[-5.55 + i * 0.85, 0, -4.37]}>
      <Box position={[0, 2.6, 0]} args={[0.035, 5.15, 0.035]} color="#3e2a20" />
      <Box position={[0.38, 0.72, 0.03]} args={[0.72, 0.055, 0.08]} color="#9a704a" />
      <Box position={[0.38, 2.35, 0.03]} args={[0.72, 0.045, 0.08]} color="#9a704a" />
      <Box position={[0.38, 4.1, 0.03]} args={[0.72, 0.045, 0.08]} color="#9a704a" />
    </group>)}
    {/* Crown moulding and baseboards */}
    <Box position={[0, 5.98, -4.34]} args={[12.15, 0.18, 0.18]} color="#a17a52" />
    <Box position={[0, 0.22, -4.32]} args={[12.15, 0.24, 0.18]} color="#a17a52" />
    <Box position={[-5.85, 3.1, 0]} args={[0.18, 6.1, 9]} color="#8b6242" />
    <Box position={[5.85, 3.1, 0]} args={[0.18, 6.1, 9]} color="#8b6242" />
  </>
}

function WindowScene({ active }) {
  const snowRef = useRef()
  const flakes = useMemo(() => Array.from({ length: 170 }, () => ({
    x: (Math.random() - 0.5) * 4.4,
    y: Math.random() * 4.3,
    z: (Math.random() - 0.5) * 0.08,
    speed: 0.25 + Math.random() * 0.65,
    drift: (Math.random() - 0.5) * 0.18,
    size: 0.012 + Math.random() * 0.022
  })), [])
  useFrame((_, delta) => {
    if (!snowRef.current || !active) return
    snowRef.current.children.forEach((flake, i) => {
      const f = flakes[i]
      flake.position.y -= delta * f.speed
      flake.position.x += Math.sin(Date.now() * 0.00035 + i) * delta * f.drift
      if (flake.position.y < -2.05) flake.position.y = 2.15
    })
  })
  return <group position={[-3.6, 3.05, -4.28]}>
    <Box position={[0, 0, -0.08]} args={[3.55, 4.45, 0.12]} color="#172a3b" material={{ roughness: 0.18, metalness: 0.1, emissive: '#13283b', emissiveIntensity: 0.45 }} />
    <mesh position={[0, 0, -0.005]}>
      <planeGeometry args={[3.3, 4.2]} />
      <meshBasicMaterial color="#20394b" />
    </mesh>
    <mesh position={[-0.9, 0.55, 0.005]}>
      <circleGeometry args={[0.28, 32]} />
      <meshBasicMaterial color="#e6dfc0" />
    </mesh>
    <mesh position={[0, -1.2, 0.01]}>
      <planeGeometry args={[3.3, 1.5]} />
      <meshBasicMaterial color="#cbd8dc" />
    </mesh>
    <mesh position={[0, -0.55, 0.015]}>
      <planeGeometry args={[3.3, 1.5]} />
      <meshBasicMaterial color="#213b42" />
    </mesh>
    {[-1.15, -0.55, 0.25, 0.95, 1.35].map((x, i) => <group key={i} position={[x, -0.8 + (i % 2) * 0.15, 0.025]}>
      <Box position={[0, 0.34, 0]} args={[0.12, 0.9 + (i % 3) * 0.25, 0.12]} color="#172b2b" />
      <Box position={[0, 0.85, 0.01]} args={[0.26, 0.08, 0.08]} color="#e0a85d" material={{ emissive: '#d98b3b', emissiveIntensity: active ? 1.5 : 0.15 }} />
    </group>)}
    <group ref={snowRef}>
      {flakes.map((f, i) => <mesh key={i} position={[f.x, f.y - 2.1, f.z]}>
        <sphereGeometry args={[f.size, 6, 6]} />
        <meshBasicMaterial color="#f5fbff" transparent opacity={0.85} />
      </mesh>)}
    </group>
    {/* window mullions */}
    <Box position={[-1.78, 0, 0.13]} args={[0.16, 4.55, 0.24]} color="#704a31" />
    <Box position={[1.78, 0, 0.13]} args={[0.16, 4.55, 0.24]} color="#704a31" />
    <Box position={[0, 2.25, 0.13]} args={[3.7, 0.16, 0.24]} color="#704a31" />
    <Box position={[0, -2.25, 0.13]} args={[3.7, 0.16, 0.24]} color="#704a31" />
    <Box position={[0, 0, 0.15]} args={[0.12, 4.45, 0.22]} color="#704a31" />
    <Box position={[0, 0, 0.15]} args={[3.6, 0.12, 0.22]} color="#704a31" />
    <Box position={[0, -2.34, 0.38]} args={[4.05, 0.18, 0.58]} color="#a77a50" />
  </group>
}

function Tree({ active }) {
  const group = useRef()
  const lights = useMemo(() => Array.from({ length: 50 }, (_, i) => {
    const y = 0.55 + (i / 50) * 3.65
    const radius = (1 - (y - 0.55) / 4.2) * 1.22
    const a = i * 2.399
    return { x: Math.cos(a) * radius, y, z: Math.sin(a) * radius, phase: Math.random() * 6.28 }
  }), [])
  const ornaments = useMemo(() => Array.from({ length: 26 }, (_, i) => {
    const y = 0.75 + (i / 26) * 3.5
    const radius = (1 - (y - 0.55) / 4.2) * 1.17
    const a = i * 2.4 + 0.6
    return { x: Math.cos(a) * radius, y, z: Math.sin(a) * radius, color: ['#b33b32', '#d7b66d', '#a9b6a0', '#e8dfc8'][i % 4], scale: 0.065 + (i % 3) * 0.012 }
  }), [])
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.012
  })
  return <group ref={group} position={[-1.55, 0, -2.05]}>
    <Cylinder position={[0, 0.38, 0]} args={[0.18, 0.22, 0.75, 10]} color="#684128" />
    {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[0, 0.7 + i * 0.72, 0]} castShadow receiveShadow>
      <coneGeometry args={[1.28 - i * 0.205, 1.45, 11, 2]} />
      <meshStandardMaterial color={i % 2 ? '#1c4a32' : '#23543a'} roughness={0.94} />
    </mesh>)}
    {lights.map((p, i) => <mesh key={`l${i}`} position={[p.x, p.y, p.z]}>
      <sphereGeometry args={[0.035, 8, 8]} />
      <meshStandardMaterial color="#ffe2a0" emissive="#ffc65c" emissiveIntensity={active ? 3.2 + Math.sin(p.phase) * 1.1 : 0.08} toneMapped={false} />
    </mesh>)}
    {ornaments.map((p, i) => <mesh key={`o${i}`} position={[p.x, p.y, p.z]} castShadow>
      <sphereGeometry args={[p.scale, 16, 16]} />
      <meshPhysicalMaterial color={p.color} metalness={0.72} roughness={0.16} clearcoat={1} clearcoatRoughness={0.1} />
    </mesh>)}
    <mesh position={[0, 4.75, 0]}>
      <octahedronGeometry args={[0.22, 0]} />
      <meshStandardMaterial color="#e8c66e" emissive="#d9a943" emissiveIntensity={active ? 2.2 : 0.1} metalness={0.8} roughness={0.18} />
    </mesh>
    <group position={[0, 0.08, 0]}>
      <Box position={[-0.5, 0.2, 0.1]} args={[0.7, 0.42, 0.62]} color="#9d342b" />
      <Box position={[-0.5, 0.2, 0.1]} args={[0.08, 0.44, 0.65]} color="#d8bb82" />
      <Box position={[0.48, 0.16, -0.08]} args={[0.56, 0.34, 0.52]} color="#31563e" />
      <Box position={[0.48, 0.16, -0.08]} args={[0.08, 0.36, 0.55]} color="#c9a86b" />
      <Box position={[0.05, 0.42, 0.48]} args={[0.58, 0.28, 0.5]} color="#c3a05f" />
    </group>
  </group>
}

function Garland({ active }) {
  const points = useMemo(() => {
    const pts = []
    for (let i = 0; i <= 80; i++) {
      const x = -5.7 + (i / 80) * 11.4
      const y = 5.55 - Math.sin((i / 80) * Math.PI) * 0.52
      pts.push(new THREE.Vector3(x, y, -4.12))
    }
    return new THREE.CatmullRomCurve3(pts)
  }, [])
  return <group>
    <mesh>
      <tubeGeometry args={[points, 100, 0.065, 8, false]} />
      <meshStandardMaterial color="#244b35" roughness={0.9} />
    </mesh>
    {Array.from({ length: 21 }, (_, i) => {
      const t = i / 20
      const p = points.getPoint(t)
      return <group key={i} position={[p.x, p.y - 0.1, -4.05]}>
        <mesh><sphereGeometry args={[0.075, 10, 10]} /><meshStandardMaterial color={i % 2 ? '#b43a32' : '#d6b56c'} metalness={0.35} roughness={0.3} /></mesh>
        <pointLight color={i % 2 ? '#e9b75f' : '#e5d5a4'} intensity={active ? 0.45 : 0.04} distance={0.7} />
      </group>
    })}
  </group>
}

function Fireplace({ active }) {
  const flameGroup = useRef()
  const fireLight = useRef()
  useFrame((state) => {
    if (flameGroup.current) flameGroup.current.children.forEach((m, i) => {
      m.scale.y = 0.8 + Math.sin(state.clock.elapsedTime * (5 + i) + i) * 0.2
      m.rotation.z = Math.sin(state.clock.elapsedTime * 4 + i) * 0.08
    })
    if (fireLight.current) fireLight.current.intensity = active ? 3.2 + Math.sin(state.clock.elapsedTime * 8) * 0.45 : 0.18
  })
  return <group position={[3.7, 0, -3.95]}>
    <Box position={[0, 1.42, 0]} args={[3.25, 2.8, 0.8]} color="#7c4e36" />
    <Box position={[0, 2.9, 0.05]} args={[3.75, 0.25, 1.1]} color="#a67a50" />
    <Box position={[0, 0.18, 0.45]} args={[3.65, 0.32, 1.35]} color="#a67a50" />
    <Box position={[0, 1.32, 0.47]} args={[2.55, 1.95, 0.16]} color="#1c1714" />
    <Box position={[-1.38, 1.35, 0.47]} args={[0.22, 2.15, 0.4]} color="#bd8d5c" />
    <Box position={[1.38, 1.35, 0.47]} args={[0.22, 2.15, 0.4]} color="#bd8d5c" />
    <Box position={[0, 2.42, 0.47]} args={[2.95, 0.2, 0.4]} color="#bd8d5c" />
    <Box position={[0, 0.35, 0.47]} args={[2.95, 0.2, 0.4]} color="#bd8d5c" />
    <group position={[0, 0.53, 0.62]}>
      <Cylinder position={[0, 0, 0]} args={[0.11, 0.11, 1.75, 10]} color="#4b2d1c" rotation={[0, 0, Math.PI / 2]} />
      <Cylinder position={[0, 0.12, 0.05]} args={[0.1, 0.1, 1.55, 10]} color="#684026" rotation={[0, 0, -0.15]} />
    </group>
    <group ref={flameGroup} position={[0, 0.65, 0.68]}>
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[-0.48 + i * 0.32, 0.42 + (i % 2) * 0.12, 0.02]} rotation={[0, 0, (i - 1.5) * 0.11]}>
        <coneGeometry args={[0.24 + (i % 2) * 0.05, 1.15 + (i % 2) * 0.25, 9]} />
        <meshBasicMaterial color={i % 2 ? '#ff9a35' : '#ffd16d'} transparent opacity={active ? 0.88 : 0.12} />
      </mesh>)}
    </group>
    <pointLight ref={fireLight} position={[0, 1.15, 1.1]} color="#ff8a32" intensity={active ? 3.2 : 0.18} distance={6} />
    <Box position={[-1.08, 3.28, 0.02]} args={[0.18, 0.72, 0.16]} color="#9d3430" />
    <Box position={[1.02, 3.23, 0.02]} args={[0.18, 0.64, 0.16]} color="#254a35" />
    <Box position={[-1.08, 3.62, 0.02]} args={[0.24, 0.12, 0.2]} color="#e8ddc5" />
    <Box position={[1.02, 3.55, 0.02]} args={[0.24, 0.12, 0.2]} color="#e8ddc5" />
    <group position={[0, 3.08, 0.38]}>
      <mesh><torusGeometry args={[1.12, 0.07, 8, 32, Math.PI]} /><meshStandardMaterial color="#254a35" /></mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[-1.05 + i * 0.23, -0.05 - Math.sin((i / 9) * Math.PI) * 0.23, 0]}>
        <sphereGeometry args={[0.08, 10, 10]} /><meshStandardMaterial color={i % 2 ? '#b43b31' : '#d5b46b'} metalness={0.3} roughness={0.25} />
      </mesh>)}
    </group>
  </group>
}

function Sofa() {
  return <group position={[0.1, 0, 1.15]} rotation={[0, 0.05, 0]}>
    <Box position={[0, 0.75, 0]} args={[3.65, 0.75, 1.12]} color="#743c35" material={{ roughness: 0.95 }} />
    <Box position={[0, 1.48, -0.38]} args={[3.5, 1.12, 0.45]} color="#82483d" />
    <Box position={[-1.82, 0.96, 0.1]} args={[0.42, 1.05, 1.28]} color="#63342e" />
    <Box position={[1.82, 0.96, 0.1]} args={[0.42, 1.05, 1.28]} color="#63342e" />
    {[-1.05, 0, 1.05].map((x, i) => <Box key={i} position={[x, 1.13, 0.1]} args={[1.02, 0.22, 0.88]} color={i === 1 ? '#8d5145' : '#925449'} />)}
    <Box position={[-0.95, 1.68, -0.02]} args={[0.8, 0.72, 0.25]} color="#c6a779" rotation={[0.12, 0, -0.1]} />
    <Box position={[0.92, 1.66, -0.02]} args={[0.8, 0.72, 0.25]} color="#294d3a" rotation={[-0.08, 0, 0.12]} />
    {[-1.45, 1.45].map((x, i) => <Cylinder key={i} position={[x, 0.22, 0]} args={[0.075, 0.06, 0.38, 8]} color="#39271e" />)}
    <Box position={[0.65, 1.35, 0.6]} args={[0.85, 0.13, 0.78]} color="#d1bd9c" rotation={[0.05, 0.12, -0.28]} />
  </group>
}

function Armchair() {
  return <group position={[-4.25, 0, 1.15]} rotation={[0, 0.2, 0]}>
    <Box position={[0, 0.72, 0]} args={[1.45, 0.72, 1.25]} color="#31503d" />
    <Box position={[0, 1.45, -0.42]} args={[1.42, 1.1, 0.42]} color="#3c6148" />
    <Box position={[-0.78, 1.0, 0.08]} args={[0.22, 0.85, 1.35]} color="#294735" />
    <Box position={[0.78, 1.0, 0.08]} args={[0.22, 0.85, 1.35]} color="#294735" />
    <Box position={[0, 1.14, 0.16]} args={[0.86, 0.65, 0.2]} color="#c9b38d" rotation={[0, 0, 0.08]} />
    {[-0.52, 0.52].map((x) => <Cylinder key={x} position={[x, 0.2, 0]} args={[0.06, 0.05, 0.34, 8]} color="#3b281e" />)}
  </group>
}

function CoffeeTable({ active }) {
  const steam = useRef()
  useFrame((state) => {
    if (steam.current) {
      steam.current.children.forEach((p, i) => {
        p.position.y = 1.28 + ((state.clock.elapsedTime * 0.35 + i * 0.18) % 0.7)
        p.material.opacity = active ? 0.38 * (1 - ((state.clock.elapsedTime * 0.35 + i * 0.18) % 0.7) / 0.7) : 0
      })
    }
  })
  return <group position={[0.9, 0, 2.15]}>
    <Box position={[0, 0.82, 0]} args={[2.75, 0.16, 1.55]} color="#8b5d3c" material={{ roughness: 0.4 }} />
    <Box position={[0, 0.91, 0]} args={[2.55, 0.035, 1.35]} color="#bd9161" material={{ roughness: 0.35 }} />
    {[-1.05, 1.05].map((x) => <Cylinder key={x} position={[x, 0.42, 0]} args={[0.065, 0.085, 0.78, 8]} color="#563724" />)}
    <Cylinder position={[-0.65, 1.01, -0.08]} args={[0.22, 0.19, 0.28, 24]} color="#e7d8bd" />
    <Cylinder position={[-0.65, 1.16, -0.08]} args={[0.19, 0.19, 0.018, 24]} color="#4b291d" />
    <mesh position={[-0.42, 1.03, -0.08]}><torusGeometry args={[0.14, 0.035, 10, 24]} /><meshStandardMaterial color="#e7d8bd" /></mesh>
    <group ref={steam}>
      {[0, 1, 2].map(i => <mesh key={i} position={[-0.7 + i * 0.09, 1.35, -0.08]}>
        <sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial color="#fff0d6" transparent opacity={0} />
      </mesh>)}
    </group>
    <Cylinder position={[0.5, 1.0, 0.08]} args={[0.34, 0.31, 0.12, 24]} color="#e6d6bb" />
    {Array.from({ length: 5 }, (_, i) => <mesh key={i} position={[0.32 + (i % 3) * 0.13, 1.12, -0.03 + Math.floor(i / 3) * 0.15]}>
      <cylinderGeometry args={[0.09, 0.09, 0.1, 16]} /><meshStandardMaterial color="#8c4d2d" roughness={0.9} />
    </mesh>)}
    <Box position={[0.9, 1.04, -0.32]} args={[0.5, 0.15, 0.42]} color="#3d2019" />
    <Box position={[0.9, 1.13, -0.32]} args={[0.5, 0.055, 0.42]} color="#d9c5a2" />
    <Cylinder position={[-0.12, 1.0, 0.48]} args={[0.14, 0.14, 0.08, 16]} color="#b83d31" />
  </group>
}

function DiningDetails() {
  return <group position={[4.5, 0, 1.8]}>
    <Box position={[0, 1.35, 0]} args={[2.25, 0.16, 1.25]} color="#7a4d30" />
    {[-0.85, 0.85].map(x => <Cylinder key={x} position={[x, 0.66, 0]} args={[0.07, 0.09, 1.25, 8]} color="#4a3020" />)}
    <Cylinder position={[-0.45, 1.49, 0]} args={[0.22, 0.22, 0.035, 24]} color="#e8ddc6" />
    <Cylinder position={[0.45, 1.49, 0]} args={[0.22, 0.22, 0.035, 24]} color="#e8ddc6" />
    <Cylinder position={[0, 1.53, 0]} args={[0.28, 0.25, 0.2, 24]} color="#a95a37" />
    <mesh position={[0, 1.65, 0]}><sphereGeometry args={[0.22, 18, 12]} /><meshStandardMaterial color="#b66b3c" roughness={0.8} /></mesh>
    <Cylinder position={[0, 1.75, 0]} args={[0.05, 0.05, 0.15, 10]} color="#597448" />
    <pointLight position={[0, 2.1, 0]} color="#ffc878" intensity={0.35} distance={2} />
  </group>
}

function SideDecor({ active }) {
  return <group>
    {/* Tall floor lamp */}
    <group position={[4.9, 0, -0.1]}>
      <Cylinder position={[0, 1.45, 0]} args={[0.045, 0.05, 2.8, 12]} color="#8b6848" />
      <Cylinder position={[0, 0.08, 0]} args={[0.38, 0.38, 0.12, 24]} color="#765137" />
      <mesh position={[0, 2.95, 0]}><cylinderGeometry args={[0.28, 0.48, 0.58, 24, 1, true]} /><meshStandardMaterial color="#d8bd8b" side={THREE.DoubleSide} /></mesh>
      <pointLight position={[0, 2.7, 0]} color="#ffd59a" intensity={active ? 1.2 : 0.1} distance={4} />
    </group>
    {/* Wall framed art */}
    <group position={[1.35, 4.25, -4.28]}>
      <Box position={[0, 0, 0]} args={[1.5, 1.45, 0.12]} color="#a47b4f" />
      <Box position={[0, 0, 0.08]} args={[1.28, 1.23, 0.04]} color="#244234" />
    </group>
  </group>
}

function Candle({ position, active }) {
  const flame = useRef()
  useFrame((state) => { if (flame.current) flame.current.scale.setScalar(active ? 0.9 + Math.sin(state.clock.elapsedTime * 9) * 0.12 : 0.01) })
  return <group position={position}>
    <Cylinder position={[0, 0.18, 0]} args={[0.075, 0.08, 0.36, 16]} color="#e7d8bd" />
    <mesh ref={flame} position={[0, 0.42, 0]}>
      <sphereGeometry args={[0.055, 12, 12]} />
      <meshBasicMaterial color="#ffb84f" />
    </mesh>
    <pointLight position={[0, 0.5, 0]} color="#ffbf68" intensity={active ? 0.55 : 0.02} distance={1.8} />
  </group>
}

function RoomDecor({ active }) {
  return <>
    <Garland active={active} />
    <Candle position={[-4.7, 0, -2.8]} active={active} />
    <Candle position={[2.8, 0, -2.95]} active={active} />
    <Candle position={[5.1, 0, 2.8]} active={active} />
    <SideDecor active={active} />
    <DiningDetails />
    <Sparkles count={active ? 24 : 3} scale={[11, 5, 7]} size={1.4} speed={0.12} opacity={active ? 0.42 : 0.08} color="#f8d99b" />
  </>
}

function Scene({ active }) {
  return <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0.2, 5.1, 10.8], fov: 43 }} gl={{ antialias: true, powerPreference: 'high-performance' }}>
    <color attach="background" args={['#11191a']} />
    <fog attach="fog" args={['#18201f', 14, 27]} />
    <ambientLight intensity={0.58} />
    <hemisphereLight args={['#d5dbe0', '#493326', 0.55]} />
    <directionalLight position={[-4, 8, 5]} intensity={1.45} color="#ffe1b0" castShadow shadow-mapSize={[1024, 1024]} />
    <pointLight position={[-3.5, 4, -2.5]} color="#8fb8e0" intensity={0.8} distance={8} />
    <pointLight position={[0, 4, 2]} color="#ffc77c" intensity={active ? 0.95 : 0.2} distance={8} />
    <RoomShell />
    <WindowScene active={active} />
    <Tree active={active} />
    <Fireplace active={active} />
    <Sofa />
    <Armchair />
    <CoffeeTable active={active} />
    <RoomDecor active={active} />
    <ContactShadows position={[0, 0.015, 0]} opacity={0.42} scale={13} blur={2.6} far={5} />
  </Canvas>
}

function App() {
  const [active, setActive] = useState(false)
  const [sound, setSound] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (active && sound) audio.play().catch(() => {})
    else {
      audio.pause()
      if (!active) audio.currentTime = 0
    }
  }, [active, sound])

  return <main className={`app ${active ? 'is-on' : ''}`}>
    <audio ref={audioRef} src="/music/christmas.mp4" loop preload="none" />
    <header className="topbar">
      <div className="brand"><span className="brand-star">✳</span> THE CHRISTMAS ROOM</div>
      <div className="edition">A CHRISTMAS EVE · 2012</div>
    </header>
    <section className="intro">
      <div className="kicker"><span/> A HOUSE FULL OF MEMORIES <span/></div>
      <h1>Christmas <em>at Home.</em></h1>
      <p>Outside, the snow is falling. Inside, the whole world feels warm.</p>
    </section>
    <section className="viewport">
      <div className="viewport-frame">
        <Suspense fallback={<div className="loading">Preparing the room…</div>}>
          <Scene active={active} />
        </Suspense>
        <div className="frame-vignette"/>
        <div className="scene-label"><span>THE LIVING ROOM</span><span>DECEMBER 24 · 8:47 PM</span></div>
      </div>
      <div className="caption"><span>01 — THE NIGHT BEFORE CHRISTMAS</span><span>LET THE EVENING BEGIN</span></div>
    </section>
    <section className="controls">
      <div className="control-message">
        <div className="state"><i className={active ? 'active' : ''}/>{active ? 'THE HOUSE IS AWAKE' : 'THE HOUSE IS QUIET'}</div>
        <p>{active ? 'The lights are glowing. The fire is alive. Stay a little longer.' : 'Turn on the lights, warm up the fire, and let the music play.'}</p>
      </div>
      <button className={`power ${active ? 'power-active' : ''}`} onClick={() => setActive(v => !v)}>
        <Power size={17}/>{active ? 'TURN THE MAGIC OFF' : 'TURN THE MAGIC ON'}
      </button>
      <button className="sound" onClick={() => setSound(v => !v)} aria-label="Toggle sound">
        {sound ? <Volume2 size={18}/> : <VolumeX size={18}/>}<span>{sound ? 'SOUND ON' : 'SOUND OFF'}</span>
      </button>
    </section>
    <footer><span>MADE FOR THE SLOWEST NIGHT OF DECEMBER</span><span><Snowflake size={13}/> A LITTLE CHRISTMAS MAGIC <Music2 size={13}/></span></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<App />)
