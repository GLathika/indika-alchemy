import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function ImagePlane({ url }: { url: string }) {
  const texture = useTexture(url);
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Add subtle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });
  
  // Maintain aspect ratio based on texture
  const width = 5;
  const height = texture.image ? (5 * texture.image.height) / texture.image.width : 3.5;
  
  return (
    <group>
      {/* Main image plane with depth */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Frame around the image */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[width + 0.3, height + 0.3, 0.05]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.6} />
      </mesh>
    </group>
  );
}

export default function MuseumImage3D({ imageUrl, alt }: { imageUrl: string; alt?: string }) {
  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background via-muted/30 to-background shadow-2xl">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={45} />
        
        {/* Enhanced lighting for 3D depth */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.2} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.6} />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} castShadow />
        
        {/* Background gradient plane */}
        <mesh position={[0, 0, -3]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.8} />
        </mesh>

        {/* Ground plane and contact shadows for depth */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </mesh>
        <ContactShadows position={[0, -1.95, 0]} opacity={0.4} scale={20} blur={2.5} far={10} />
        
        <Suspense fallback={null}>
          <ImagePlane url={imageUrl} />
        </Suspense>
        
        <OrbitControls 
          enablePan={false} 
          minDistance={5} 
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      {/* Simple alt text for accessibility (visually hidden) */}
      <span className="sr-only">{alt}</span>
    </div>
  );
}
