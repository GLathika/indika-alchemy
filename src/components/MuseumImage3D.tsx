import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function ImagePlane({ url }: { url: string }) {
  const texture = useLoader(THREE.TextureLoader, url, (loader) => {
    // Ensure cross-origin images from Wikimedia load correctly
    // @ts-ignore
    loader.crossOrigin = 'anonymous';
  });
  // Improve color and quality
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.generateMipmaps = true;

  const meshRef = useRef<THREE.Mesh>(null);
  
  // Add continuous rotation for obvious 3D effect
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005; // Continuous slow rotation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15;
    }
  });
  
  // Maintain aspect ratio based on texture
  const width = 5;
  const height = texture.image ? (5 * texture.image.height) / texture.image.width : 3.5;
  const depth = 0.8; // Much thicker for obvious 3D effect
  
  return (
    <group>
      {/* Main 3D box with image on front face */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          map={texture}
          roughness={0.3}
          metalness={0.1}
          color="#ffffff"
          toneMapped
        />
      </mesh>
      
      {/* Thick decorative frame */}
      <mesh position={[0, 0, -(depth/2 + 0.15)]} castShadow>
        <boxGeometry args={[width + 0.4, height + 0.4, 0.3]} />
        <meshStandardMaterial color="#8B4513" roughness={0.4} metalness={0.7} />
      </mesh>
      
      {/* Inner frame detail */}
      <mesh position={[0, 0, -(depth/2 + 0.05)]} castShadow>
        <boxGeometry args={[width + 0.25, height + 0.25, 0.1]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.9} />
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
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.6} 
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <directionalLight position={[-5, 5, -5]} intensity={0.9} />
        <spotLight position={[0, 10, 5]} intensity={1.0} angle={0.35} penumbra={1} castShadow />
        
        {/* Background gradient plane */}
        <mesh position={[0, 0, -3]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color={new THREE.Color('hsl(220, 15%, 8%)')} roughness={0.8} />
        </mesh>

        {/* Ground plane and contact shadows for depth */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color={new THREE.Color('hsl(220, 15%, 8%)')} roughness={0.9} />
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
