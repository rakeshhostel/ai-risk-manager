import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import TransactionNetwork from '../components/three/TransactionNetwork';
import { Network, User, CreditCard, Smartphone, MapPin, ShoppingBag, Wallet } from 'lucide-react';

interface SelectedNode {
  id: string;
  type: string;
  name: string;
  risk: string;
  color: string;
}

const NODE_TYPE_INFO: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  Customer: { icon: User, label: 'Customer', color: '#3b82f6' },
  Transaction: { icon: CreditCard, label: 'Transaction', color: '#06b6d4' },
  Device: { icon: Smartphone, label: 'Device', color: '#a855f7' },
  Location: { icon: MapPin, label: 'Location', color: '#22c55e' },
  Merchant: { icon: ShoppingBag, label: 'Merchant', color: '#f97316' },
  PaymentMethod: { icon: Wallet, label: 'Payment Method', color: '#ec4899' },
};

export const NetworkPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            3D Transaction Network
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Click nodes to inspect • Drag to rotate • Scroll to zoom
          </p>
        </div>
      </div>

      <div className="flex-1 flex gap-4" style={{ minHeight: 0 }}>
        {/* 3D Canvas */}
        <div className="flex-1 bg-gray-900/80 backdrop-blur border border-white/10 rounded-xl overflow-hidden relative">
          <Canvas camera={{ position: [0, 0, 25], fov: 60 }}>
            <color attach="background" args={['#060a14']} />
            <ambientLight intensity={0.4} />
            <pointLight position={[15, 15, 15]} intensity={0.8} />
            <pointLight position={[-15, -15, -10]} intensity={0.3} color="#3b82f6" />
            <Stars radius={50} depth={30} count={1000} factor={3} fade speed={0.5} />
            <TransactionNetwork onNodeSelect={(node: any) => setSelectedNode(node)} />
            <OrbitControls enableDamping dampingFactor={0.05} autoRotate autoRotateSpeed={0.3} />
          </Canvas>

          {/* Legend overlay */}
          <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur border border-white/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wider">Node Types</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {Object.entries(NODE_TYPE_INFO).map(([key, info]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
                  <span className="text-xs text-gray-300">{info.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-white/10">
              <p className="text-xs text-gray-400 font-semibold mb-1 uppercase tracking-wider">Risk Levels</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {[
                  { label: 'Low', color: '#22c55e' },
                  { label: 'Medium', color: '#eab308' },
                  { label: 'High', color: '#f97316' },
                  { label: 'Critical', color: '#ef4444' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-xs text-gray-300">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-72 bg-gray-900/80 backdrop-blur border border-white/10 rounded-xl p-5 flex flex-col">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Node Details
          </h3>
          {selectedNode ? (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: selectedNode.color + '30' }}
                >
                  {(() => {
                    const info = NODE_TYPE_INFO[selectedNode.type];
                    const Icon = info?.icon || Network;
                    return <Icon size={20} style={{ color: selectedNode.color }} />;
                  })()}
                </div>
                <div>
                  <p className="text-white font-semibold">{selectedNode.name}</p>
                  <p className="text-gray-400 text-xs">{selectedNode.type}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">ID</span>
                  <span className="text-gray-200 font-mono text-xs">{selectedNode.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Type</span>
                  <span className="text-gray-200">{selectedNode.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Risk Level</span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium uppercase"
                    style={{
                      backgroundColor: (selectedNode.risk === 'critical' ? '#ef4444' : selectedNode.risk === 'high' ? '#f97316' : selectedNode.risk === 'medium' ? '#eab308' : '#22c55e') + '20',
                      color: selectedNode.risk === 'critical' ? '#ef4444' : selectedNode.risk === 'high' ? '#f97316' : selectedNode.risk === 'medium' ? '#eab308' : '#22c55e',
                    }}
                  >
                    {selectedNode.risk}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10">
                <p className="text-xs text-gray-500">
                  Click another node to inspect it, or drag the 3D view to explore the network.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Network className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Click a node in the 3D view to see its details</p>
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-white/10">
            <p className="text-xs text-gray-600 text-center">
              Synthetic data • Educational prototype
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
