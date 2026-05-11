'use client';
import { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, DepthOfField, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { EffectComposer } from '@react-three/postprocessing';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import { GpuParticles, EnergyOrb, PortalEffect, VolumetricRings, FloatingGrid } from './SceneElements';

interface IntroSceneProps {
  phase: 'dark' | 'light-appear' | 'orb' | 'logo' | 'activated' | 'portal' | 'transition';
  portalProgress: number;
  onOrbInteract: () => void;
}


// Camera controller
function CameraController({ phase }: { phase: string }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 5));
  const targetRot = useRef(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    switch (phase) {
      case 'dark':
        targetPos.current.set(0, 0, 8);
        break;
      case 'light-appear':
        targetPos.current.set(0, 0, 6);
        break;
      case 'orb':
        targetPos.current.set(0, 0, 5);
        break;
      case 'logo':
        targetPos.current.set(0, 0.5, 5);
        targetRot.current.set(-0.1, 0, 0);
        break;
      case 'activated':
        targetPos.current.set(0, 0, 4);
        break;
      case 'portal':
        targetPos.current.set(0, 0, 2);
        break;
      case 'transition':
        targetPos.current.set(0, 0, -5);
        break;
    }
  }, [phase]);

  useFrame((state) => {
    const mouse = state.mouse;
    camera.position.lerp(targetPos.current, 0.03);
    camera.position.x += mouse.x * 0.3 - camera.position.x * 0.05;
    camera.position.y += mouse.y * 0.2 - camera.position.y * 0.02;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Ambient Light Orb in 3D
function SceneLight({ phase }: { phase: string }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const light2Ref = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (lightRef.current) {
      lightRef.current.intensity = 
        phase === 'dark' ? 0 :
        phase === 'light-appear' ? 0.5 + Math.sin(t * 2) * 0.2 :
        phase === 'activated' || phase === 'portal' ? 8 : 2;
      lightRef.current.position.x = Math.sin(t * 0.5) * 0.3;
      lightRef.current.position.y = Math.cos(t * 0.3) * 0.2;
    }
    if (light2Ref.current) {
      light2Ref.current.intensity = phase === 'activated' || phase === 'portal' ? 6 : 1;
      light2Ref.current.position.x = Math.cos(t * 0.4) * 2;
      light2Ref.current.position.y = Math.sin(t * 0.6) * 1;
    }
  });

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0, 1]} color="#00d4ff" intensity={2} distance={10} />
      <pointLight ref={light2Ref} position={[2, 1, 1]} color="#7c3aed" intensity={1} distance={8} />
      <ambientLight intensity={0.05} color="#000820" />
    </>
  );
}

export default function IntroScene({ phase, portalProgress, onOrbInteract }: IntroSceneProps) {
  const showOrb = ['light-appear', 'orb', 'logo', 'activated', 'portal'].includes(phase);
  const showParticles = ['orb', 'logo', 'activated', 'portal', 'transition'].includes(phase);
  const showPortal = ['activated', 'portal', 'transition'].includes(phase);
  const activated = ['activated', 'portal', 'transition'].includes(phase);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8], fov: 75, near: 0.1, far: 100 }}
      style={{ background: '#050505' }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault(), false);
      }}
    >
      <fog attach="fog" args={['#020208', 8, 20]} />
      
      <CameraController phase={phase} />
      <SceneLight phase={phase} />
      
      <Suspense fallback={null}>
        <Stars radius={100} depth={50} count={2000} factor={2} saturation={0.5} fade speed={0.5} />
        
        {showOrb && (
          <EnergyOrb activated={activated} onInteract={onOrbInteract} />
        )}
        
        {showParticles && (
          <GpuParticles count={2500} activated={activated} />
        )}
        
        {showPortal && (
          <PortalEffect progress={portalProgress} />
        )}
        
        <VolumetricRings />
        <FloatingGrid />
      </Suspense>

      <EffectComposer>
        <Bloom
          intensity={activated ? 3.0 : 1.2}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          blendFunction={BlendFunction.ADD}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[activated ? 0.003 : 0.001, activated ? 0.003 : 0.001]}
          radialModulation={false}
          modulationOffset={0}
        />
        <Noise
          opacity={0.04}
          blendFunction={BlendFunction.ADD}
        />
        <Vignette
          offset={0.3}
          darkness={activated ? 0.5 : 0.8}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </Canvas>
  );
}
