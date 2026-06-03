import { Box3 } from "three";
import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { type XRStore } from "@react-three/xr";
import { OrbitControls } from "@react-three/drei";
import { type FontFamilies } from "@react-three/uikit";

import XRButton from "./XRButton";
import XRScene from "./XRScene";
import PreloadFont from "./PreloadFont";
import Intersectable from "./Intersectable";
import BallotBox from "./BallotBox";
import Table from "./Table";
import DeputyReturningOfficer from "./DeputyReturningOfficer";
import Screen from "./Screen";
import Ballot from "./Ballot";
import Room from "./Room";
import Locomotion from "./Locomotion";
import Instructions from "./Instructions";

type ComponentFallbackProps = {
  componentName: string;
};

type XRComponentFallbackProps = ComponentFallbackProps & {
  store: XRStore | null;
  session: XRSession | null;
};

function ComponentFallback({ componentName }: ComponentFallbackProps) {
  console.error(`${componentName} not loaded`);
  return null;
}

function XRComponentFallback({
  componentName,
  store,
  session,
}: XRComponentFallbackProps) {
  console.error(`${componentName} not loaded`);
  console.error("XR store:", store);
  console.error("XR session:", session);
  return null;
}

export default function App() {
  const [xrStore, setXrStore] = useState<XRStore | null>(null);
  const [xrSession, setXrSession] = useState<XRSession | null>(null);
  const [box, setBox] = useState<Box3 | null>(null);
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);
  const [fontFamilies, setFontFamilies] = useState<FontFamilies | undefined>(
    undefined,
  );

  return (
    <main>
      <header>
        <h1>VR Voting</h1>
      </header>
      <XRButton
        store={xrStore}
        existingSession={xrSession}
        setSession={setXrSession}
      />
      <PreloadFont setFontFamilies={setFontFamilies} />
      <Canvas shadows>
        <XRScene existingStore={xrStore} setXrStore={setXrStore}>
          <>
            <Intersectable
              position={[0, 0.55, 0]}
              box={box}
              onIntersect={() => {
                if (isConfirmed) setIsPlaced(true);
              }}
            >
              <BallotBox />
            </Intersectable>

            <Table position={[-6, -2, 1]} />
            <DeputyReturningOfficer position={[-5, 0, -3]} />

            <Screen position={[7.5, -0.4, -10]} />
            <Table position={[6, -2, -10]} />

            <Room />

            <OrbitControls />

            {xrStore && (
              <Suspense
                fallback={
                  <XRComponentFallback
                    componentName="Ballot"
                    store={xrStore}
                    session={xrSession}
                  />
                }
              >
                <Ballot
                  session={xrSession}
                  position={[-4, -0.5, 0]}
                  onDragged={(box) => {
                    if (!isGrabbed) setIsGrabbed(true);
                    setBox(box);
                  }}
                  onOpened={() => setIsOpened(true)}
                  onConfirmed={() => setIsConfirmed(true)}
                />
              </Suspense>
            )}

            {xrStore && xrSession && (
              <Suspense
                fallback={
                  <XRComponentFallback
                    componentName="Locomotion"
                    store={xrStore}
                    session={xrSession}
                  />
                }
              >
                <Locomotion session={xrSession} />
              </Suspense>
            )}

            <Suspense
              fallback={<ComponentFallback componentName="Instructions" />}
            >
              <Instructions
                fontFamilies={fontFamilies}
                isGrabbed={isGrabbed}
                isOpened={isOpened}
                isConfirmed={isConfirmed}
                isPlaced={isPlaced}
              />
            </Suspense>
          </>
        </XRScene>
      </Canvas>
      <footer>
        <p>
          <small>
            This project is for educational purposes and is in no way affiliated
            with Elections Canada.
          </small>
        </p>
      </footer>
    </main>
  );
}
