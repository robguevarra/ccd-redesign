'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';

/**
 * Abstract organic form for the homepage hero. A slowly-rotating distorted
 * icosahedron in a warm pearlescent material.
 *
 * Vanilla Three.js — no drei material extensions, to keep the bundle and
 * compat surface as small as possible.
 */
function Form() {
  const ref = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.x += delta * 0.06;
    const t = state.clock.elapsedTime;
    // Subtle floating drift
    ref.current.position.y = Math.sin(t * 0.4) * 0.06;
    // Mouse parallax
    const px = state.pointer.x * 0.18;
    ref.current.position.x += (px - ref.current.position.x) * 0.06;
  });

  return (
    <mesh ref={ref} scale={1.6}>
      <icosahedronGeometry args={[1, 4]} />
      <meshStandardMaterial
        color="#f4ecdf"
        roughness={0.25}
        metalness={0.05}
      />
    </mesh>
  );
}

export function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 4]} intensity={2.2} color="#fff7e6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#a4ccff" />
      <Form />
    </Canvas>
  );
}
