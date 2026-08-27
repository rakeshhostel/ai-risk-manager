import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface NodeData {
  id: string;
  type: 'Customer' | 'Transaction' | 'Device' | 'Location' | 'Merchant' | 'PaymentMethod';
  name: string;
  position: THREE.Vector3;
  risk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  color: string;
  radius: number;
}

interface EdgeData {
  id: string;
  source: NodeData;
  target: NodeData;
  points: THREE.Vector3[];
}

interface TransactionNetworkProps {
  onNodeSelect?: (node: any) => void;
}

const riskColors = {
  LOW: '#22c55e',     // green-500
  MEDIUM: '#eab308',  // yellow-500
  HIGH: '#f97316',    // orange-500
  CRITICAL: '#ef4444' // red-500
};

// --- Sub-components ---

function EdgeLine({ edge }: { edge: EdgeData }) {
  const lineRef = useRef<THREE.Line>(null);
  
  const geometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(edge.points);
  }, [edge.points]);

  const material = useMemo(() => {
    return new THREE.LineDashedMaterial({
      color: '#4b5563', // gray-600
      linewidth: 1,
      scale: 1,
      dashSize: 0.2,
      gapSize: 0.2,
      transparent: true,
      opacity: 0.5,
    });
  }, []);

  useFrame((state, delta) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineDashedMaterial;
      mat.dashOffset -= delta * 2;
    }
  });

  return (
    <line ref={lineRef} geometry={geometry} material={material} computeLineDistances />
  );
}

function ParticleFlow({ edge }: { edge: EdgeData }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [progress, setProgress] = useState(Math.random());

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#60a5fa', // blue-400
      size: 0.2,
      transparent: true,
      opacity: 0.8,
    });
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    let p = progress + delta * 0.5;
    if (p > 1) p = 0;
    setProgress(p);

    const point = new THREE.Vector3().lerpVectors(edge.source.position, edge.target.position, p);
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    positions[0] = point.x;
    positions[1] = point.y;
    positions[2] = point.z;
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

function NodeItem({ node, texture, onSelect }: { node: NodeData; texture?: THREE.Texture; onSelect?: (node: NodeData) => void }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.5;
      ringRef.current.rotation.y += delta * 0.8;
    }
    if (globeRef.current) {
      // Rotation on axis
      globeRef.current.rotation.y += delta * 0.4;
    }
  });

  const renderGeometry = () => {
    if (node.type === 'Customer' || node.type === 'Transaction') {
      return <sphereGeometry args={[node.radius, 32, 32]} />;
    }
    
    switch (node.type) {
      case 'Device':
        return <icosahedronGeometry args={[node.radius]} />;
      case 'Location':
        return <octahedronGeometry args={[node.radius]} />;
      case 'Merchant':
        return <boxGeometry args={[node.radius, node.radius, node.radius]} />;
      case 'PaymentMethod':
        return <torusGeometry args={[node.radius, node.radius * 0.3, 16, 32]} />;
      default:
        return <sphereGeometry args={[node.radius, 32, 32]} />;
    }
  };

  const isHighRisk = node.risk === 'HIGH' || node.risk === 'CRITICAL';

  return (
    <group 
      ref={groupRef} 
      position={node.position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => { e.stopPropagation(); onSelect && onSelect(node); }}
    >
      <mesh ref={globeRef}>
        {renderGeometry()}
        <meshStandardMaterial 
          map={texture || null}
          color={hovered ? '#ffffff' : (texture ? '#ffffff' : node.color)} 
          emissive={isHighRisk ? node.color : '#000000'}
          emissiveIntensity={isHighRisk ? 0.7 : 0}
          roughness={texture ? 0.6 : 0.2}
          metalness={texture ? 0.15 : 0.8}
        />
      </mesh>

      {/* Saturn Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[node.radius * 1.3, node.radius * 1.6, 32]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>

      {/* Glow for high risk */}
      {isHighRisk && (
        <pointLight color={node.color} intensity={2.5} distance={6} decay={2} />
      )}

      {/* HTML Tooltip */}
      {hovered && (
        <Html distanceFactor={15} zIndexRange={[100, 0]}>
          <div className="bg-gray-900/90 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow-xl text-sm min-w-[150px] transform -translate-x-1/2 -translate-y-[calc(100%+15px)] pointer-events-none transition-all font-sans">
            <div className="font-bold text-white mb-1 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: node.color }}></span>
              {node.name}
            </div>
            <div className="text-gray-300 text-xs uppercase tracking-wider">{node.type}</div>
            {node.risk && (
              <div className="mt-2 text-xs font-semibold" style={{ color: node.color }}>
                RISK: {node.risk}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function TransactionNetwork({ onNodeSelect }: TransactionNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [textures, setTextures] = useState<Record<string, THREE.Texture>>({});

  React.useEffect(() => {
    const loader = new THREE.TextureLoader();
    const planetUrls = {
      earth: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      mars: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/mars.jpg',
      jupiter: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/jupiter.jpg',
      moon: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/moon_1024.jpg'
    };

    Object.entries(planetUrls).forEach(([name, url]) => {
      loader.load(url, (tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        setTextures(prev => ({ ...prev, [name]: tex }));
      }, undefined, (err) => {
        console.warn(`Failed to load texture for ${name}:`, err);
      });
    });
  }, []);

  // Use useMemo to generate data once
  const { nodes, edges } = useMemo(() => {
    const generatedNodes: NodeData[] = [];
    const generatedEdges: EdgeData[] = [];

    const customers = ['Rahul', 'Priya', 'Amit', 'Neha', 'Vikram'];
    const devices = ['iPhone 13', 'MacBook Pro', 'Android Phone', 'Windows PC', 'iPad'];
    const locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune'];
    const merchants = ['Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'MakeMyTrip', 'Uber'];
    const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'];
    const risks: ('LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')[] = ['LOW', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

    // 1. Generate Customers (Ring radius 8)
    const customerNodes: NodeData[] = [];
    customers.forEach((name, i) => {
      const angle = (i / customers.length) * Math.PI * 2;
      const x = Math.cos(angle) * 8;
      const z = Math.sin(angle) * 8;
      const y = (Math.random() - 0.5) * 4;

      const node: NodeData = {
        id: `c_${i}`,
        type: 'Customer',
        name,
        position: new THREE.Vector3(x, y, z),
        color: '#3b82f6', // blue-500
        radius: 1.0,
      };
      generatedNodes.push(node);
      customerNodes.push(node);
    });

    // 2. Generate Outer Ring Nodes (Devices, Locations, Merchants, PaymentMethods)
    const outerNodesList: { name: string, type: NodeData['type'], color: string, radius: number }[] = [
      ...devices.map(n => ({ name: n, type: 'Device' as const, color: '#a855f7', radius: 0.4 })), // purple-500
      ...locations.map(n => ({ name: n, type: 'Location' as const, color: '#10b981', radius: 0.5 })), // emerald-500
      ...merchants.map(n => ({ name: n, type: 'Merchant' as const, color: '#f59e0b', radius: 0.6 })), // amber-500
      ...paymentMethods.map(n => ({ name: n, type: 'PaymentMethod' as const, color: '#ec4899', radius: 0.5 })) // pink-500
    ];

    const outerNodes: NodeData[] = [];
    outerNodesList.forEach((item, i) => {
      const angle = (i / outerNodesList.length) * Math.PI * 2;
      const x = Math.cos(angle) * 16;
      const z = Math.sin(angle) * 16;
      const y = (Math.random() - 0.5) * 8;

      const node: NodeData = {
        id: `o_${i}`,
        type: item.type,
        name: item.name,
        position: new THREE.Vector3(x, y, z),
        color: item.color,
        radius: item.radius,
      };
      generatedNodes.push(node);
      outerNodes.push(node);
    });

    // Helper to get random outer node by type
    const getOuterNode = (type: string) => {
      const filtered = outerNodes.filter(n => n.type === type);
      return filtered[Math.floor(Math.random() * filtered.length)];
    };

    // 3. Generate Transactions around Customers
    let tIdx = 0;
    customerNodes.forEach(customer => {
      // 5 transactions per customer
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const dist = 3 + Math.random() * 2;
        const x = customer.position.x + Math.cos(angle) * dist;
        const z = customer.position.z + Math.sin(angle) * dist;
        const y = customer.position.y + (Math.random() - 0.5) * 3;

        // Bias towards low risk
        const risk = Math.random() > 0.8 ? risks[Math.floor(Math.random() * 3) + 1] : 'LOW';

        const txNode: NodeData = {
          id: `t_${tIdx++}`,
          type: 'Transaction',
          name: `TXN-${Math.floor(Math.random() * 10000)}`,
          position: new THREE.Vector3(x, y, z),
          color: riskColors[risk],
          risk,
          radius: risk === 'CRITICAL' ? 0.7 : 0.5,
        };
        generatedNodes.push(txNode);

        // Edges
        // Tx to Customer
        generatedEdges.push({
          id: `e_${txNode.id}_${customer.id}`,
          source: customer,
          target: txNode,
          points: [customer.position, txNode.position],
        });

        // Tx to 1 Device, 1 Location, 1 Merchant, 1 Payment
        ['Device', 'Location', 'Merchant', 'PaymentMethod'].forEach(type => {
          const targetNode = getOuterNode(type);
          if (targetNode) {
            generatedEdges.push({
              id: `e_${txNode.id}_${targetNode.id}`,
              source: txNode,
              target: targetNode,
              points: [txNode.position, targetNode.position],
            });
          }
        });
      }
    });

    return { nodes: generatedNodes, edges: generatedEdges };
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05; // slow rotation
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <directionalLight position={[-10, -10, -10]} intensity={0.5} />

      {/* Render Edges */}
      {edges.map(edge => (
        <EdgeLine key={`line_${edge.id}`} edge={edge} />
      ))}
      
      {/* Render Particles */}
      {edges.map(edge => (
        <ParticleFlow key={`particle_${edge.id}`} edge={edge} />
      ))}

      {/* Render Nodes */}
      {nodes.map(node => {
        let texture: THREE.Texture | undefined = undefined;
        if (node.type === 'Customer') {
          texture = textures.earth;
        } else if (node.type === 'Transaction') {
          texture = node.risk === 'HIGH' || node.risk === 'CRITICAL' ? textures.mars : textures.moon;
        } else if (node.type === 'Device') {
          texture = textures.jupiter;
        }

        return (
          <NodeItem 
            key={node.id} 
            node={node} 
            texture={texture} 
            onSelect={onNodeSelect} 
          />
        );
      })}
    </group>
  );
}
