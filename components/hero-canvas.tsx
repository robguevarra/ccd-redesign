'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import type { Mesh } from 'three';

/**
 * Abstract organic form for the homepage hero. A slowly-rotating distorted
 * icosahedron in a warm pearlescent material — evokes tooth enamel without
 * being literally toothy. Mouse parallax adds quiet life.
 *
 * Bundle budget: keep R3F + drei imports to specific named exports only.
 */
function Form() {
  const ref = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.x += delta * 0.06;
    // Subtle mouse parallax based on pointer position
    const x = state.pointer.x * 0.18;
    const y = state.pointer.y * 0.12;
    ref.current.position.x += (x - ref.current.position.x) * 0.06;
    ref.current.position.y += (y - ref.current.position.y) * 0.06;
  });

  return (
    <Float
      speed={1.1}
      rotationIntensity={0.25}
      floatIntensity={0.6}
      floatingRange={[-0.08, 0.08]}
    >
      <mesh ref={ref} scale={1.6} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 24]} />
        <MeshDistortMaterial
          color="#f4ecdf"
          distort={0.45}
          speed={0.85}
          roughness={0.2}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.25}
          flatShading={false}
        />
      </mesh>
    </Float>
  );
}

export function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 32 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      shadows
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 4, 4]}
        intensity={1.6}
        castShadow
        color="#fff7e6"
      />
      <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#a4ccff" />
      <Suspense fallback={null}>
        <Form />
      </Suspense>
      {/* No OrbitControls in production — leave the form purely autonomous. */}
      {process.env.NODE_ENV === 'development' && false && <OrbitControls />}
    </Canvas>
  );
}
