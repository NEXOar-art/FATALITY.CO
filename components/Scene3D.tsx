import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float, Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const TShirtMesh = ({ color, stampUrl }: { color: string; stampUrl: string }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Material físico avanzado para simular tela (Cotton/Premium feel)
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: color,
    roughness: 0.85,
    metalness: 0.05,
    sheen: 1,
    sheenRoughness: 0.5,
    sheenColor: new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.2),
    side: THREE.DoubleSide,
  }), [color]);

  const texture = useTexture(stampUrl);

  useFrame((state) => {
    if (meshRef.current) {
        // Suave balanceo para dar vida a la prenda
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.03;
        meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
  });

  return (
    <group ref={meshRef} dispose={null} scale={[2.8, 2.8, 2.8]}>
      {/* Cuerpo Principal (Torso con forma anatómica) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow material={material}>
        <cylinderGeometry args={[0.38, 0.42, 1.2, 32]} />
        <mesh scale={[1.1, 1, 0.5]}>
            <cylinderGeometry args={[0.38, 0.42, 1.2, 32]} />
        </mesh>
        
        {/* Estampa con Decal (Ajustada a la forma) */}
        <Decal
          position={[0, 0.15, 0.21]} 
          rotation={[0, 0, 0]}
          scale={[0.45, 0.45, 1]}
        >
          <meshBasicMaterial 
            map={texture} 
            transparent 
            polygonOffset 
            polygonOffsetFactor={-1} 
          />
        </Decal>
      </mesh>
      
      {/* Manga Izquierda (Angulada y Realista) */}
      <group position={[-0.45, 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
        <mesh material={material}>
          <cylinderGeometry args={[0.18, 0.15, 0.5, 32]} />
          <mesh scale={[1, 1, 0.5]}>
             <cylinderGeometry args={[0.18, 0.15, 0.5, 32]} />
          </mesh>
        </mesh>
      </group>

      {/* Manga Derecha */}
      <group position={[0.45, 0.4, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <mesh material={material}>
          <cylinderGeometry args={[0.18, 0.15, 0.5, 32]} />
          <mesh scale={[1, 1, 0.5]}>
             <cylinderGeometry args={[0.18, 0.15, 0.5, 32]} />
          </mesh>
        </mesh>
      </group>

      {/* Cuello (Circular Suave) */}
      <mesh position={[0, 0.58, 0]} rotation={[Math.PI / 2, 0, 0]} material={material}>
        <torusGeometry args={[0.18, 0.04, 16, 100]} />
      </mesh>

      {/* Sombra de oclusión interna */}
      <mesh position={[0, 0.57, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.6} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

interface SceneProps {
  color: string;
  className?: string;
  stampUrl: string;
}

export const Scene3D: React.FC<SceneProps> = ({ color, className, stampUrl }) => {
  return (
    <div className={`w-full h-full min-h-[400px] ${className}`}>
      <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <spotLight position={[-5, 5, 5]} angle={0.2} penumbra={1} intensity={1} />
        
        <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
            <TShirtMesh color={color} stampUrl={stampUrl} />
        </Float>
        
        <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={12} blur={2} far={4} color="#000000" />
        <Environment preset="city" />
        
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 1.5} 
          minDistance={3}
          maxDistance={7}
          autoRotate={false}
          enableDamping={true}
        />
      </Canvas>
    </div>
  );
};