// components/Hero/MyModel.tsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function Model() {
  const gltf = useGLTF("/models/model.glb"); // تأكد الاسم الجديد هنا
  return <primitive object={gltf.scene} scale={1.5} />;
}

export default function MyModel() {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [2, 2, 2], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
