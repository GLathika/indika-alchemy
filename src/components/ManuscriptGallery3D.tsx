import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, useTexture } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

interface Manuscript {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

function ManuscriptFrame({ manuscript, position }: { manuscript: Manuscript; position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Convert the path to actual import path
  const imagePath = manuscript.image_url?.replace('/src/', '') || '';
  const texture = useTexture(imagePath);

  return (
    <group position={position}>
      {/* Frame */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[3.2, 2.2, 0.1]} />
        <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.7} />
      </mesh>
      
      {/* Image plane */}
      <mesh ref={meshRef}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial map={texture} />
      </mesh>

      {/* Glass effect */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial 
          transparent 
          opacity={0.1} 
          color="#ffffff"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

function Gallery({ manuscripts }: { manuscripts: Manuscript[] }) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 8]} />
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={15}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 0, 10]} intensity={0.5} />

      {/* Background */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a0f0a" />
      </mesh>

      {/* Gallery walls */}
      <Suspense fallback={null}>
        {manuscripts.map((manuscript, index) => {
          const angle = (index / manuscripts.length) * Math.PI * 2;
          const radius = 6;
          const x = Math.sin(angle) * radius;
          const z = Math.cos(angle) * radius;
          
          return (
            <group key={manuscript.id} rotation={[0, -angle, 0]}>
              <ManuscriptFrame 
                manuscript={manuscript}
                position={[x, 0, z]}
              />
            </group>
          );
        })}
      </Suspense>
    </>
  );
}

export function ManuscriptGallery3D({ manuscripts }: { manuscripts: Manuscript[] }) {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow-elegant">
      <Canvas>
        <Gallery manuscripts={manuscripts} />
      </Canvas>
    </div>
  );
}
