'use client';
import { useRef, useMemo, useState } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// === ENERGY ORB SHADER ===
const EnergyOrbMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color('#00d4ff'),
    color2: new THREE.Color('#7c3aed'),
    intensity: 1.0,
    activated: 0.0,
  },
  // Vertex
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float time;
    uniform float activated;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      float displacement = sin(position.x * 3.0 + time) * 0.05 
                         + cos(position.y * 4.0 + time * 1.3) * 0.05
                         + activated * sin(position.z * 5.0 + time * 2.0) * 0.1;
      vec3 newPos = position + normal * displacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `,
  // Fragment
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float intensity;
    uniform float activated;
    
    void main() {
      float rim = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
      rim = pow(rim, 2.0);
      
      float pulse = 0.5 + 0.5 * sin(time * 2.0);
      vec3 col = mix(color1, color2, pulse * 0.5 + vUv.y * 0.5);
      
      float glow = rim * intensity * (1.0 + activated * 2.0);
      col += vec3(0.2, 0.8, 1.0) * glow * 0.5;
      
      float alpha = (rim + 0.1) * intensity;
      alpha = clamp(alpha, 0.0, 1.0);
      
      gl_FragColor = vec4(col, alpha * (0.6 + activated * 0.4));
    }
  `
);

// === PORTAL SHADER ===
const PortalMaterial = shaderMaterial(
  {
    time: 0,
    progress: 0.0,
    color1: new THREE.Color('#00d4ff'),
    color2: new THREE.Color('#7c3aed'),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    varying vec2 vUv;
    uniform float time;
    uniform float progress;
    uniform vec3 color1;
    uniform vec3 color2;
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1,0)), f.x),
        mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
        f.y
      );
    }
    
    void main() {
      vec2 center = vUv - 0.5;
      float dist = length(center);
      float angle = atan(center.y, center.x);
      
      float spiral = noise(vec2(
        dist * 8.0 - time * 2.0,
        angle * 3.0 + time
      ));
      
      float ring = smoothstep(0.4 * progress, 0.45 * progress, dist) 
                 * smoothstep(0.5 * progress, 0.45 * progress, dist);
      
      float energy = spiral * progress;
      vec3 col = mix(color1, color2, spiral + sin(time) * 0.5);
      col += vec3(1.0, 1.0, 1.0) * ring * 3.0;
      
      float alpha = energy * 0.8 + ring;
      alpha *= progress;
      
      gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
    }
  `
);

extend({ EnergyOrbMaterial, PortalMaterial });

// GPU Particles
export function GpuParticles({ count = 3000, activated = false }: { count?: number; activated?: boolean }) {
  const meshRef = useRef<THREE.Points>(null);

  const { positions, velocities, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.3 + Math.random() * 2.5;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      randoms[i] = Math.random();
    }
    return { positions, velocities, randoms };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    return geo;
  }, [positions, randoms]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    const posAttr = meshRef.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    
    for (let i = 0; i < count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);
      const dist = Math.sqrt(x * x + y * y + z * z);

      if (activated) {
        posAttr.setXYZ(i,
          x + velocities[i * 3] * 3,
          y + velocities[i * 3 + 1] * 3,
          z + velocities[i * 3 + 2] * 3
        );
      } else {
        const orbit = 0.001 * (1 + randoms[i]);
        posAttr.setXYZ(i,
          x * Math.cos(orbit) - z * Math.sin(orbit),
          y + Math.sin(t * 0.5 + randoms[i] * 10) * 0.002,
          x * Math.sin(orbit) + z * Math.cos(orbit)
        );
      }
    }
    posAttr.needsUpdate = true;
    meshRef.current.rotation.y = t * 0.05;
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.015}
        color="#00d4ff"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Energy Orb
export function EnergyOrb({ activated = false, onInteract }: { activated?: boolean; onInteract?: () => void }) {
  const matRef = useRef<THREE.ShaderMaterial & { time: number; intensity: number; activated: number }>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.time = state.clock.elapsedTime;
    matRef.current.intensity = hovered ? 1.8 : 1.0;
    matRef.current.activated = activated ? 1.0 : 0.0;
    if (meshRef.current) {
      meshRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.05 + (hovered ? 0.1 : 0)
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onInteract}
    >
      <sphereGeometry args={[0.4, 64, 64]} />
      {/* @ts-ignore */}
      <energyOrbMaterial ref={matRef} transparent side={THREE.FrontSide} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// Portal Ring
export function PortalEffect({ progress }: { progress: number }) {
  const matRef = useRef<THREE.ShaderMaterial & { time: number; progress: number }>(null);

  useFrame((state) => {
    if (!matRef.current) return;
    matRef.current.time = state.clock.elapsedTime;
    matRef.current.progress = progress;
  });

  return (
    <mesh rotation={[0, 0, 0]}>
      <planeGeometry args={[6, 6]} />
      {/* @ts-ignore */}
      <portalMaterial ref={matRef} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Volumetric Fog Rings
export function VolumetricRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z = t * 0.1 * (i % 2 === 0 ? 1 : -1);
      child.rotation.x = Math.sin(t * 0.3 + i) * 0.2;
      (child as THREE.Mesh).material && 
        ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).color.setHSL(
          0.55 + Math.sin(t * 0.5) * 0.1,
          1.0,
          0.5
        );
    });
  });

  return (
    <group ref={groupRef}>
      {[0.8, 1.2, 1.6, 2.0, 2.5].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, i * 0.5]}>
          <torusGeometry args={[r, 0.005, 8, 100]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.15 - i * 0.02}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Floating Grid Lines
export function FloatingGrid() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!gridRef.current) return;
    gridRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    gridRef.current.rotation.x = state.clock.elapsedTime * 0.02;
  });

  const lines = useMemo(() => {
    const points: THREE.Vector3[][] = [];
    const size = 6;
    const step = 0.5;
    for (let x = -size; x <= size; x += step) {
      points.push([new THREE.Vector3(x, 0, -size), new THREE.Vector3(x, 0, size)]);
    }
    for (let z = -size; z <= size; z += step) {
      points.push([new THREE.Vector3(-size, 0, z), new THREE.Vector3(size, 0, z)]);
    }
    return points;
  }, []);

  return (
    <group ref={gridRef} position={[0, -2, 0]}>
      {lines.map((pts, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(pts.flatMap(p => [p.x, p.y, p.z])), 3]}
              array={new Float32Array(pts.flatMap(p => [p.x, p.y, p.z]))}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
          />
        </line>
      ))}
    </group>
  );
}
