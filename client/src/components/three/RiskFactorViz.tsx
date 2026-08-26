import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import { RiskFactor } from '@/types';

interface RiskFactorVizProps {
  factors: RiskFactor[];
}

const RiskBar = ({ factor, position }: { factor: RiskFactor, position: [number, number, number] }) => {
  const [hovered, setHovered] = useState(false);
  const height = factor.score / 10;
  
  const { scale } = useSpring({
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 60 }
  });

  const color = factor.score > 80 ? '#ef4444' : factor.score > 50 ? '#f97316' : factor.score > 20 ? '#eab308' : '#22c55e';

  return (
    <animated.group position={position} scale={scale}>
      <mesh
        position={[0, height / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color={color} transparent opacity={0.8} />
      </mesh>
      {hovered && (
        <Html position={[0, height + 0.5, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-gray-900/90 text-white p-3 rounded-lg border border-white/10 backdrop-blur text-sm w-48 shadow-xl pointer-events-none">
            <div className="font-bold text-cyan-400">{factor.name}</div>
            <div className="text-gray-300 mt-1">{factor.description}</div>
            <div className="mt-2 text-right font-mono">Score: {factor.score}</div>
          </div>
        </Html>
      )}
    </animated.group>
  );
};

const RiskFactorViz: React.FC<RiskFactorVizProps> = ({ factors }) => {
  const spacing = 1.5;
  const startX = -((factors.length - 1) * spacing) / 2;

  return (
    <group position={[0, -2, 0]}>
      {factors.map((factor, i) => (
        <RiskBar key={factor.name} factor={factor} position={[startX + i * spacing, 0, 0]} />
      ))}
      <gridHelper args={[20, 20, '#1f2937', '#111827']} position={[0, 0, 0]} />
    </group>
  );
};

export default RiskFactorViz;
