import { MeshStandardMaterial } from "three";
import { useTexture } from "@react-three/drei";

export default function BallotBox() {
  const ballotBoxBlankTexture = "/textures/ballot_box_blank.webp";
  const ballotBoxLogoTexture = "/textures/ballot_box_logo.webp";
  const blankTexture = useTexture(ballotBoxBlankTexture);
  const logoTexture = useTexture(ballotBoxLogoTexture);

  const materials = [
    new MeshStandardMaterial({ map: blankTexture, color: "white" }),
    new MeshStandardMaterial({ map: blankTexture, color: "white" }),
    new MeshStandardMaterial({ color: "white" }),
    new MeshStandardMaterial({ color: "white" }),
    new MeshStandardMaterial({ map: logoTexture, color: "white" }),
    new MeshStandardMaterial({ map: blankTexture, color: "white" }),
  ];

  return (
    <mesh material={materials} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 1]} />
    </mesh>
  );
}
