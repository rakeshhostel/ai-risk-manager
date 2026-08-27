import React from 'react';
import { Outlet } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Background3D } from '../three/Background3D';
import FloatingAI from '../ai/FloatingAI';
import { useAppStore } from '../../store/appStore';

export const AppLayout: React.FC = () => {
  const { darkMode } = useAppStore();

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-background text-gray-100 relative ${!darkMode ? 'light-mode' : ''}`}>
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <color attach="background" args={[darkMode ? '#0a0e1a' : '#dbeafe']} />
          <Background3D />
        </Canvas>
      </div>
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10">
        <TopBar />
        <main className="flex-1 overflow-auto p-6 relative">
          <Outlet />
        </main>
      </div>
      <FloatingAI />
    </div>
  );
};

