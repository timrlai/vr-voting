import { Hud, PerspectiveCamera } from "@react-three/drei";
import { Container, Text, type FontFamilies } from "@react-three/uikit";

type InstructionsProps = {
  fontFamilies: FontFamilies | undefined;
  isGrabbed: boolean;
  isOpened: boolean;
  isConfirmed: boolean;
  isPlaced: boolean;
};

export default function Instructions({
  fontFamilies,
  isGrabbed,
  isOpened,
  isConfirmed,
  isPlaced,
}: InstructionsProps) {
  return (
    <Hud>
      <PerspectiveCamera makeDefault position={[0, 0, 10]}>
        <group position={[0.5, 0.5, -2]}>
          <Container
            fontFamilies={fontFamilies ?? undefined}
            backgroundColor="white"
            borderRadius={5}
            paddingX={10}
            paddingY={5}
          >
            {!isGrabbed && (
              <Text
                color="darkred"
                fontSize={12}
                fontFamily="gothic"
                fontWeight="normal"
                letterSpacing={-0.03}
              >
                1. Grab ballot
              </Text>
            )}
            {isGrabbed && !isOpened && (
              <Text
                color="darkred"
                fontSize={12}
                fontFamily="gothic"
                fontWeight="normal"
                letterSpacing={-0.03}
              >
                2. Go behind screen and open ballot
              </Text>
            )}
            {isGrabbed && isOpened && !isConfirmed && (
              <Text
                color="darkred"
                fontSize={12}
                fontFamily="gothic"
                fontWeight="normal"
                letterSpacing={-0.03}
              >
                3. Mark ballot and confirm
              </Text>
            )}
            {isGrabbed && isOpened && isConfirmed && !isPlaced && (
              <Text
                color="darkred"
                fontSize={12}
                fontFamily="gothic"
                fontWeight="normal"
                letterSpacing={-0.03}
              >
                4. Put ballot in box
              </Text>
            )}
            {isConfirmed && isPlaced && (
              <Text
                color="darkgreen"
                fontSize={24}
                fontFamily="gothic"
                fontWeight="normal"
                letterSpacing={-0.03}
              >
                You voted!
              </Text>
            )}
          </Container>
        </group>
      </PerspectiveCamera>
    </Hud>
  );
}
