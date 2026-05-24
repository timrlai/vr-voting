import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useXRInputSourceState, XROrigin } from "@react-three/xr";
import { type Group } from "three";

export default function Locomotion() {
  const rightController = useXRInputSourceState("controller", "right");
  const leftController = useXRInputSourceState("controller", "left");
  const groupRef = useRef<Group>(null);
  const originRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (
      groupRef.current == null ||
      originRef.current == null ||
      rightController == null ||
      leftController == null
    )
      return;
    const rightStickState = rightController.gamepad["xr-standard-thumbstick"];
    const leftStickState = leftController.gamepad["xr-standard-thumbstick"];

    if (rightStickState == null || leftStickState == null) return;

    groupRef.current.position.x += (rightStickState.xAxis ?? 0) * delta * 2;
    groupRef.current.position.z += (rightStickState.yAxis ?? 0) * delta * 2;

    originRef.current.rotation.y += (leftStickState.yAxis ?? 0) * delta;
  });

  return (
    <group ref={groupRef} position={[0, 0, 5]}>
      <XROrigin ref={originRef} />
    </group>
  );
}
