import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const DataStream: React.FC = () => {
  const points = useRef<THREE.Points>(null);
  const particleCount = 1000;

  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const pha = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      pha[i] = Math.random() * Math.PI * 2;
    }
    return [pos, pha];
  }, []);

  useFrame((state) => {
    if (points.current) {
      const time = state.clock.getElapsedTime();
      const positions = points.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] -= 0.05; 
        positions[i3] += Math.sin(time + phases[i]) * 0.01;
        
        if (positions[i3 + 1] < -10) {
          positions[i3 + 1] = 10;
        }
      }
      points.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#06b6d4" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

export default DataStream;
