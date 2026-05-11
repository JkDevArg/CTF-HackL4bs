'use client';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { GpuParticles } from './SceneElements';

function FloatingGeometry({ index }: { index: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const speed = 0.2 + Math.random() * 0.4;
  const offset = index * 1.2;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = t * speed * 0.3;
    ref.current.rotation.y = t * speed * 0.5;
    ref.current.rotation.z = t * speed * 0.2;
  });

  const shapes = [
    <octahedronGeometry key="o" args={[0.3]} />,
    <tetrahedronGeometry key="t" args={[0.4]} />,
    <icosahedronGeometry key="i" args={[0.25]} />,
    <dodecahedronGeometry key="d" args={[0.3]} />,
  ];

  const positions: [number, number, number][] = [
    [-4, 2, -3], [4, 1, -4], [-3, -1, -2], [5, -2, -3],
    [-5, 0, -4], [3, 3, -3], [-2, 2, -5], [6, 0, -2],
  ];

  const colors = ['#00d4ff', '#7c3aed', '#00ffff', '#4c1d95'];

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={ref} position={positions[index % positions.length]}>
        {shapes[index % shapes.length]}
        <meshStandardMaterial
          color={colors[index % colors.length]}
          emissive={colors[index % colors.length]}
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </Float>
  );
}

function HeroParticles() {
  const meshRef = useRef<THREE.Points>(null);
  const count = 5000;
  
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
  }

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#00d4ff"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6], fov: 70 }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <fog attach="fog" args={['#050510', 10, 30]} />
      <ambientLight intensity={0.1} color="#001030" />
      <pointLight position={[0, 0, 3]} color="#00d4ff" intensity={2} distance={15} />
      <pointLight position={[-3, 2, 1]} color="#7c3aed" intensity={1.5} distance={10} />

      <Suspense fallback={null}>
        <Stars radius={80} depth={50} count={3000} factor={2} saturation={0.5} fade speed={0.3} />
        <HeroParticles />
        {Array.from({ length: 8 }, (_, i) => <FloatingGeometry key={i} index={i} />)}
      </Suspense>

      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.1} luminanceSmoothing={0.9} blendFunction={BlendFunction.ADD} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0008, 0.0008]} radialModulation={false} modulationOffset={0} />
        <Noise opacity={0.03} blendFunction={BlendFunction.ADD} />
        <Vignette offset={0.4} darkness={0.7} blendFunction={BlendFunction.NORMAL} />
      </EffectComposer>
    </Canvas>
  );
}
