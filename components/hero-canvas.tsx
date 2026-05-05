'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { CatmullRomCurve3, Mesh, Vector3 } from 'three';
import type { MotionValue } from 'framer-motion';

interface ArchProps {
  scrollProgress: MotionValue<number>;
}

/**
 * Master spec §5 wow zone — abstract dental arch.
 *
 * The horseshoe-shaped curve that traces the upper row of teeth, rendered as
 * a smooth tube along a parametric Catmull–Rom curve. Warm pearlescent
 * material; matcap-style lighting. Scroll-choreographed across three poses:
 *
 *   0%  → 3/4 perspective, slow Y rotation, gentle bob
 *  40%  → nearly top-down (looking into the mouth's curve from above)
 *  80%  → side profile, receding into the dark for the next section
 *
 * No mouse parallax — motion is entirely scroll-driven, per master spec.
 */
function Arch({ scrollProgress }: ArchProps) {
  const ref = useRef<Mesh>(null);

  // Build the arch curve once. The shape: a forward-bowing horseshoe in the
  // XZ plane. Slightly elongated (depth 1.4) so the U reads clearly from
  // 3/4 perspective. Width 3.0 fits comfortably in the camera frustum.
  const curve = useMemo(() => {
    const points: Vector3[] = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      // t goes 0 → π so cos sweeps -1 → 1 (left → right back-of-mouth)
      // and sin sweeps 0 → 1 → 0 (back → front → back, the bow)
      const t = (i / steps) * Math.PI;
      const x = -1.5 * Math.cos(t);
      const z = 1.4 * Math.sin(t);
      const y = 0;
      points.push(new Vector3(x, y, z));
    }
    return new CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const p = scrollProgress.get();
    const tClock = state.clock.elapsedTime;

    // Slow ambient yaw — independent of scroll, gives life when stationary.
    const ambientYaw = tClock * 0.18;

    // X-rotation (pitch) keyframes — three poses across scroll progress:
    //   0   → -0.78  (true 3/4 perspective, U-shape clearly readable)
    //   0.4 → -1.45  (nearly top-down, looking down into the curve)
    //   0.8 → -0.55  (tilts back, side-ish profile, recedes)
    let pitch: number;
    if (p < 0.4) {
      pitch = lerp(-0.78, -1.45, p / 0.4);
    } else if (p < 0.8) {
      pitch = lerp(-1.45, -0.55, (p - 0.4) / 0.4);
    } else {
      pitch = -0.55;
    }
    // Smooth toward target each frame (no instant snaps)
    ref.current.rotation.x = lerpStep(ref.current.rotation.x, pitch, delta * 4);

    // Y rotation: ambient slow yaw plus a scroll-driven sweep.
    const yawTarget = ambientYaw + p * Math.PI * 0.6;
    ref.current.rotation.y = yawTarget;

    // Position Z: recede slightly on scroll for parallax depth.
    const zTarget = lerp(0, -2.4, p);
    ref.current.position.z = lerpStep(ref.current.position.z, zTarget, delta * 4);

    // Scale: gently grows toward the top-down pose, then settles back.
    let scaleTarget: number;
    if (p < 0.4) {
      scaleTarget = lerp(1.0, 1.35, p / 0.4);
    } else if (p < 0.8) {
      scaleTarget = lerp(1.35, 1.1, (p - 0.4) / 0.4);
    } else {
      scaleTarget = 0.9;
    }
    const s = lerpStep(ref.current.scale.x, scaleTarget, delta * 3);
    ref.current.scale.setScalar(s);

    // Subtle vertical bob — adds life without being distracting.
    ref.current.position.y = Math.sin(tClock * 0.6) * 0.05;
  });

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <tubeGeometry args={[curve, 96, 0.2, 24, false]} />
      <meshStandardMaterial
        color="#f4ecdf"
        roughness={0.18}
        metalness={0.08}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

interface HeroCanvasProps {
  scrollProgress: MotionValue<number>;
}

export function HeroCanvas({ scrollProgress }: HeroCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.6, 6.5], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.42} />
      {/* Single warm directional light per master spec §5 */}
      <directionalLight
        position={[3.5, 4.5, 3]}
        intensity={2.6}
        color="#fff5d8"
      />
      {/* Cool fill from below to add edge separation in the silhouette */}
      <directionalLight
        position={[-3, -2, -2]}
        intensity={0.35}
        color="#a4ccff"
      />
      <Arch scrollProgress={scrollProgress} />
    </Canvas>
  );
}

function lerp(a: number, b: number, t: number) {
  const c = Math.max(0, Math.min(1, t));
  return a + (b - a) * c;
}

/** Frame-rate-independent damping: moves `current` toward `target` by `t`. */
function lerpStep(current: number, target: number, t: number) {
  return current + (target - current) * Math.min(1, t);
}
