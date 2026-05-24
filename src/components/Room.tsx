import {
  DoubleSide,
  MeshStandardMaterial,
  RepeatWrapping,
  Vector2,
} from "three";
import { useTexture, Environment } from "@react-three/drei";

import ceilingTextureImg from "../assets/img/textures/ceiling.webp";
import wallTextureImg from "../assets/img/textures/wall.webp";
import floorTextureImg from "../assets/img/textures/floor.webp";

export default function Room() {
  const ceilingTexture = useTexture(ceilingTextureImg, (texture) => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat = new Vector2(8, 6);
  });
  const wallTexture = useTexture(wallTextureImg);
  const floorTexture = useTexture(floorTextureImg, (texture) => {
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat = new Vector2(16, 12);
  });

  const materials = [
    new MeshStandardMaterial({
      map: wallTexture,
      side: DoubleSide,
    }),
    new MeshStandardMaterial({
      map: wallTexture,
      side: DoubleSide,
    }),
    new MeshStandardMaterial({
      map: ceilingTexture,
      side: DoubleSide,
    }),
    new MeshStandardMaterial({
      map: floorTexture,
      side: DoubleSide,
    }),
    new MeshStandardMaterial({
      map: wallTexture,
      side: DoubleSide,
    }),
    new MeshStandardMaterial({
      map: wallTexture,
      side: DoubleSide,
    }),
  ];

  return (
    <group position={[0, 6.2, -5]}>
      <mesh material={materials} castShadow receiveShadow>
        <boxGeometry args={[80, 20, 60]} />
      </mesh>

      <ambientLight
        position={[0, 20, 0]}
        color="lightblue"
        intensity={0.3}
        castShadow
      />
      <directionalLight
        position={[-20, 8, 20]}
        color="lightyellow"
        intensity={1}
        castShadow
      />
      <directionalLight
        position={[20, 8, 20]}
        color="lightyellow"
        intensity={1}
        castShadow
      />

      <Environment
        background={false}
        environmentIntensity={0.3}
        files={[
          wallTextureImg,
          wallTextureImg,
          ceilingTextureImg,
          floorTextureImg,
          wallTextureImg,
          wallTextureImg,
        ]}
        ground={{
          height: 15,
          radius: 60,
          scale: 1000,
        }}
      />
    </group>
  );
}
