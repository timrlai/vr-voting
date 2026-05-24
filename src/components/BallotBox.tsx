import { useTexture } from "@react-three/drei";
import ballotBoxBlankTexture from "../assets/img/textures/ballot_box_blank.webp";
import ballotBoxLogoTexture from "../assets/img/textures/ballot_box_logo.webp";
import { MeshStandardMaterial } from "three";

export default function BallotBox() {
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
