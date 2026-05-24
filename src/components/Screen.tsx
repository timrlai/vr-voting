import { useEffect } from "react";
import type { Mesh } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";

type TableProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
};

export default function Screen({
  position = [7.5, -0.4, -10],
  rotation = [0, 1.6, 0],
  scale = 2,
}: TableProps) {
  const gltf = useLoader(GLTFLoader, "/models/screen.gltf");
  const clone = gltf.scene.clone(true);

  useEffect(() => {
    if (!clone) return;

    clone.traverse((object) => {
      if ((object as Mesh).isMesh) {
        const mesh = object as Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [clone]);

  return (
    <primitive
      object={clone}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
}
