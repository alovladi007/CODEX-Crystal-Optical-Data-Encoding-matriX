'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere, Box, Torus, Text, Environment, Stars } from '@react-three/drei';
import { Mesh, BufferGeometry, Material } from 'three';
import * as THREE from 'three';

function CrystalMesh() {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.z = Math.cos(time * 0.2) * 0.05;
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.x = Math.sin(time * 0.4) * 0.2;
      innerRef.current.rotation.y += 0.012;
    }
    
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.01;
      ringRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main crystal structure - Modern faceted design */}
      <Box
        ref={meshRef}
        args={[2.5, 4, 1.5]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#667eea"
          transparent
          opacity={0.85}
          roughness={0.05}
          metalness={0.95}
          emissive="#4facfe"
          emissiveIntensity={0.3}
          envMapIntensity={1}
        />
      </Box>

      {/* Inner core with pulsing effect */}
      <Sphere
        ref={innerRef}
        args={[0.8, 32, 32]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#00f2fe"
          transparent
          opacity={0.7}
          roughness={0.02}
          metalness={0.98}
          emissive="#4facfe"
          emissiveIntensity={0.4}
        />
      </Sphere>

      {/* Floating data particles */}
      {Array.from({ length: 30 }, (_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 2.5 + Math.sin(i * 0.5) * 0.5;
        const height = Math.sin(i * 0.3) * 2;
        
        return (
          <Sphere
            key={i}
            args={[0.03 + Math.sin(i) * 0.02, 12, 12]}
            position={[
              Math.cos(angle) * radius,
              height,
              Math.sin(angle) * radius,
            ]}
          >
            <meshStandardMaterial
              color={i % 3 === 0 ? "#4facfe" : i % 3 === 1 ? "#00f2fe" : "#43e97b"}
              emissive={i % 3 === 0 ? "#4facfe" : i % 3 === 1 ? "#00f2fe" : "#43e97b"}
              emissiveIntensity={0.6}
              transparent
              opacity={0.8}
            />
          </Sphere>
        );
      })}

      {/* Modern energy rings */}
      <Torus
        ref={ringRef}
        args={[2.2, 0.03, 16, 100]}
        position={[0, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#4facfe"
          transparent
          opacity={0.8}
          emissive="#00f2fe"
          emissiveIntensity={0.5}
        />
      </Torus>

      <Torus
        args={[2.8, 0.02, 16, 100]}
        position={[0, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      >
        <meshStandardMaterial
          color="#43e97b"
          transparent
          opacity={0.6}
          emissive="#4facfe"
          emissiveIntensity={0.4}
        />
      </Torus>

      <Torus
        args={[3.2, 0.015, 16, 100]}
        position={[0, 0, 0]}
        rotation={[Math.PI / 4, Math.PI / 4, 0]}
      >
        <meshStandardMaterial
          color="#ff6b6b"
          transparent
          opacity={0.5}
          emissive="#f093fb"
          emissiveIntensity={0.3}
        />
      </Torus>

      {/* Ambient light effects */}
      <pointLight position={[2, 2, 2]} intensity={0.5} color="#4facfe" />
      <pointLight position={[-2, -2, -2]} intensity={0.3} color="#00f2fe" />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#43e97b" />
    </group>
  );
}

export function Crystal3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        style={{ background: 'transparent' }}
        shadows
      >
        {/* Modern lighting setup */}
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          color="#4facfe"
          castShadow
        />
        <directionalLight
          position={[-5, -5, -5]}
          intensity={0.4}
          color="#00f2fe"
        />
        <pointLight
          position={[0, 10, 0]}
          intensity={0.6}
          color="#43e97b"
          distance={20}
        />
        <spotLight
          position={[0, 8, 4]}
          angle={0.4}
          penumbra={0.5}
          intensity={0.5}
          color="#ff6b6b"
          castShadow
        />
        
        {/* Environment and atmosphere */}
        <Environment preset="city" />
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
        
        <CrystalMesh />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.8}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.2}
          maxDistance={12}
          minDistance={4}
        />
      </Canvas>
    </div>
  );
}
