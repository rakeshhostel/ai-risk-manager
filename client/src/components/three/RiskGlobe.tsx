import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

const generateGlobeData = () => {
  const points = [];
  for(let i=0; i<30; i++) {
    const lat = (Math.random() - 0.5) * Math.PI;
    const lng = (Math.random() - 0.5) * 2 * Math.PI;
    const r = 5.1;
    const x = r * Math.cos(lat) * Math.cos(lng);
    const y = r * Math.sin(lat);
    const z = r * Math.cos(lat) * Math.sin(lng);
    const risk = ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)];
    const color = risk === 'critical' ? '#ef4444' : risk === 'high' ? '#f97316' : risk === 'medium' ? '#eab308' : '#22c55e';
    points.push({ pos: new THREE.Vector3(x, y, z), color });
  }
  return points;
};

const GlobeMesh = () => {
  const groupRef = useRef();
  const points = generateGlobeData();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere args={[5, 64, 64]}>
        <meshBasicMaterial color="#06b6d4" wireframe transparent opacity={0.15} />
      </Sphere>
      
      {points.map((pt, i) => (
        <mesh key={i} position={pt.pos}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={pt.color} />
        </mesh>
      ))}
    </group>
  );
};

export default function RiskGlobe() {
  return (
    <div className="w-full h-full relative bg-[#0a0e1a] rounded-xl overflow-hidden border border-white/10">
      <div className="absolute top-4 left-4 z-10 bg-black/50 px-3 py-1 rounded-full text-xs font-semibold text-cyan-400 border border-cyan-400/30">
        SYNTHETIC DATA
      </div>
      <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <GlobeMesh />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
