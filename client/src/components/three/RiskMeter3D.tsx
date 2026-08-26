import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface RiskMeter3DProps {
  score: number;
}

const RiskMeter3D: React.FC<RiskMeter3DProps> = ({ score }) => {
  const needleRef = useRef<THREE.Group>(null);
  
  // 0 is -Math.PI / 2, 100 is Math.PI / 2
  const targetRotation = useMemo(() => {
    return -Math.PI / 2 + (score / 100) * Math.PI;
  }, [score]);

  useFrame((state, delta) => {
    if (needleRef.current) {
      needleRef.current.rotation.z += (targetRotation - needleRef.current.rotation.z) * 5 * delta;
    }
  });

  const segments = [
    { color: '#22c55e', arc: Math.PI * 0.25, start: Math.PI },
    { color: '#eab308', arc: Math.PI * 0.25, start: Math.PI * 0.75 },
    { color: '#f97316', arc: Math.PI * 0.25, start: Math.PI * 0.5 },
    { color: '#ef4444', arc: Math.PI * 0.25, start: Math.PI * 0.25 },
  ];

  return (
    <group position={[0, -0.5, 0]}>
      {segments.map((seg, i) => (
        <mesh key={i} rotation={[0, 0, seg.start]}>
          <torusGeometry args={[2, 0.2, 16, 32, seg.arc]} />
          <meshStandardMaterial color={seg.color} transparent opacity={0.8} />
        </mesh>
      ))}
      
      <group ref={needleRef} position={[0, 0, 0.1]}>
        <mesh position={[0, 1, 0]}>
          <coneGeometry args={[0.1, 2, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#06b6d4" />
        </mesh>
      </group>

      <Text
        position={[0, -0.8, 0]}
        fontSize={0.8}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {Math.round(score)}
      </Text>
    </group>
  );
};

export default RiskMeter3D;
