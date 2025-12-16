import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// A simplified procedural T-Shirt mesh since we can't load external GLBs easily in this demo environment without CORS
// In a real app, you would use useGLTF('path/to/shirt.glb')

const TShirtMesh = ({ color, decalImage }: { color: string; decalImage?: string | null }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Create a material that responds well to light
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.1,
  });

  useFrame((state) => {
    if (meshRef.current) {
        // Subtle breathing animation
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <group ref={meshRef} dispose={null} scale={[2.5, 2.5, 2.5]}>
       {/* Torso */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow material={material}>
        <boxGeometry args={[1, 1.4, 0.5]} />
      </mesh>
      
      {/* Shoulders/Sleeves - Simplified blocky representation for style */}
      <mesh position={[-0.65, 0.4, 0]} castShadow receiveShadow material={material}>
        <boxGeometry args={[0.5, 0.5, 0.4]} />
      </mesh>
      <mesh position={[0.65, 0.4, 0]} castShadow receiveShadow material={material}>
        <boxGeometry args={[0.5, 0.5, 0.4]} />
      </mesh>

       {/* Neck */}
       <mesh position={[0, 0.7, 0]} material={material}>
          <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
       </mesh>

       {/* Decal Area - if an image is provided (simulated here with a color block for demo if no real texture loaded) */}
       <mesh position={[0, 0.1, 0.26]}>
          <planeGeometry args={[0.6, 0.6]} />
          <meshBasicMaterial color={decalImage ? "#ffffff" : color} transparent opacity={decalImage ? 1 : 0} map={null} /> 
          {/* Note: useTexture would be used here with the decalImage prop in a real scenario */}
       </mesh>
    </group>
  );
};

interface SceneProps {
  color: string;
  className?: string;
  imageUrl?: string;
}

export const Scene3D: React.FC<SceneProps> = ({ color, className, imageUrl }) => {
  return (
    <div className={`w-full h-full min-h-[400px] ${className}`}>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <TShirtMesh color={color} decalImage={imageUrl} />
        </Float>
        
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} color="#00f2ff" />
        <Environment preset="city" />
        <OrbitControls enablePan={false} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2} />
      </Canvas>
    </div>
  );
};