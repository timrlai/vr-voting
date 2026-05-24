import { useXR } from "@react-three/xr";
import { Hud, PerspectiveCamera } from "@react-three/drei";
import { useTTF, Container, Text } from "@react-three/uikit";

import specialGothicCondensed from "../assets/fonts/SpecialGothicCondensedOne-Regular.ttf";

type InstructionsProps = {
  isGrabbed: boolean;
  isOpened: boolean;
  isConfirmed: boolean;
  isPlaced: boolean;
};

export default function Instructions({
  isGrabbed,
  isOpened,
  isConfirmed,
  isPlaced,
}: InstructionsProps) {
  const { session } = useXR();
  const fontFamilies = useTTF(specialGothicCondensed);
  return (
    session && (
      <Hud>
        <PerspectiveCamera makeDefault position={[0, 0, 10]}>
          <group position={[0.5, 0.5, -2]}>
            <Container
              fontFamilies={fontFamilies}
              backgroundColor="white"
              borderRadius={5}
              paddingX={10}
              paddingY={5}
            >
              {!isGrabbed && (
                <Text color="darkred" fontSize={12}>
                  1. Grab ballot
                </Text>
              )}
              {isGrabbed && !isOpened && (
                <Text color="darkred" fontSize={12}>
                  2. Go behind screen and open ballot
                </Text>
              )}
              {isGrabbed && isOpened && !isConfirmed && (
                <Text color="darkred" fontSize={12}>
                  3. Mark ballot and confirm
                </Text>
              )}
              {isGrabbed && isOpened && isConfirmed && !isPlaced && (
                <Text color="darkred" fontSize={12}>
                  4. Put ballot in box
                </Text>
              )}
              {isConfirmed && isPlaced && (
                <Text color="darkgreen" fontSize={24}>
                  You voted!
                </Text>
              )}
            </Container>
          </group>
        </PerspectiveCamera>
      </Hud>
    )
  );
}
