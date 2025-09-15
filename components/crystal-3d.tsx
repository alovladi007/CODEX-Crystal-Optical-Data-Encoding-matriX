'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Torus } from '@react-three/drei';
import { Mesh } from 'three';
import * as THREE from 'three';

function CrystalMesh() {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.01;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main crystal structure */}
      <Box
        ref={meshRef}
        args={[2, 3, 1]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.9}
          emissive="#1e40af"
          emissiveIntensity={0.2}
        />
      </Box>

      {/* Inner core */}
      <Sphere
        args={[0.5, 32, 32]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#0ea5e9"
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.8}
          emissive="#0284c7"
          emissiveIntensity={0.3}
        />
      </Sphere>

      {/* Data points */}
      {Array.from({ length: 20 }, (_, i) => (
        <Sphere
          key={i}
          args={[0.05, 8, 8]}
          position={[
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 2,
          ]}
        >
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#7c3aed"
            emissiveIntensity={0.5}
          />
        </Sphere>
      ))}

      {/* Energy rings */}
      <Torus
        args={[1.5, 0.02, 8, 100]}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.6}
          emissive="#0891b2"
          emissiveIntensity={0.4}
        />
      </Torus>

      <Torus
        args={[2, 0.02, 8, 100]}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.4}
          emissive="#059669"
          emissiveIntensity={0.3}
        />
      </Torus>
    </group>
  );
}

export function Crystal3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.5}
          color="#0ea5e9"
        />
        <CrystalMesh />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
