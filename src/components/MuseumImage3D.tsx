import { Canvas } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { Suspense } from "react";

function ImagePlane({ url }: { url: string }) {
  const texture = useTexture(url);
  // Maintain a nice aspect ratio by scaling width based on texture
  const width = 4;
  const height = texture.image ? (4 * texture.image.height) / texture.image.width : 3;
  return (
    <mesh rotation={[0, 0, 0]}>
      <planeGeometry args={[width, height, 1, 1]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function MuseumImage3D({ imageUrl, alt }: { imageUrl: string; alt?: string }) {
  return (
    <div className="w-full h-[480px] rounded-xl overflow-hidden border border-border bg-muted/30">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -2, -5]} intensity={0.4} />
        <Suspense fallback={null}>
          <ImagePlane url={imageUrl} />
        </Suspense>
        <OrbitControls enablePan={false} minDistance={4} maxDistance={10} />
      </Canvas>
      {/* Simple alt text for accessibility (visually hidden) */}
      <span className="sr-only">{alt}</span>
    </div>
  );
}
