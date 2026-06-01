import { Hud, PerspectiveCamera } from "@react-three/drei";
import { Container, Text } from "@react-three/uikit";

type InstructionsProps = {
  fontFamilies: any;
  session: XRSession | null;
  isGrabbed: boolean;
  isOpened: boolean;
  isConfirmed: boolean;
  isPlaced: boolean;
};

export default function Instructions({
  fontFamilies,
  session,
  isGrabbed,
  isOpened,
  isConfirmed,
  isPlaced,
}: InstructionsProps) {
  console.info("Font Family:", fontFamilies);
  return (
    session && (
      <Hud>
        <PerspectiveCamera makeDefault position={[0, 0, 10]}>
          <group position={[0.5, 0.5, -2]}>
            <Container
              fontFamilies={fontFamilies ?? "bold"}
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
