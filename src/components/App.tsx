import { Box3 } from "three";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { type XRStore } from "@react-three/xr";
import { OrbitControls } from "@react-three/drei";

import Intersectable from "./Intersectable";
import BallotBox from "./BallotBox";
import Table from "./Table";
import DeputyReturningOfficer from "./DeputyReturningOfficer";
import Screen from "./Screen";
import Ballot from "./Ballot";
import Room from "./Room";
import Locomotion from "./Locomotion";
import Instructions from "./Instructions";
import XRScene from "./XRScene";

type XRComponentsFallbackProps = {
  store: XRStore | null;
  session: XRSession | null;
};

function XRComponentsFallback({ store, session }: XRComponentsFallbackProps) {
  console.error("XR components in scene not loaded");
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

  const onEnterXr = () => {
    if (!xrStore) return;
    xrStore.enterVR().then((session) => {
      console.log("session:", session);
      if (!xrSession && session) setXrSession(session);
    });
  };

  useEffect(() => {
    // Make sure this is actually running
    console.log("XR capability check running");

    const nav: any = navigator;

    if (!nav.xr) {
      console.log("navigator.xr is NOT defined");
      return;
    }

    console.log("navigator.xr is defined:", nav.xr);

    nav.xr
      .isSessionSupported("immersive-vr")
      .then((supported: boolean) => {
        console.log("immersive-vr supported:", supported);
      })
      .catch((err: any) => {
        console.error("isSessionSupported error:", err);
      });
  }, []);

  return (
    <main>
      <header>
        <h1>VR Voting</h1>
      </header>
      <nav id="xr-button-container">
        <button
          onClick={onEnterXr}
          className="special-gothic-condensed-one-regular"
        >
          Enter VR
        </button>
      </nav>
      <Canvas
        shadows
        onCreated={({ gl }) => {
          console.log("WebGL context created:", gl);
        }}
      >
        <XRScene existingStore={xrStore} setXrStore={setXrStore}>
          <Suspense fallback={null}>
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
                  <XRComponentsFallback store={xrStore} session={xrSession} />
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

                <Locomotion session={xrSession} />

                <Instructions
                  session={xrSession}
                  isGrabbed={isGrabbed}
                  isOpened={isOpened}
                  isConfirmed={isConfirmed}
                  isPlaced={isPlaced}
                />
              </Suspense>
            )}
          </Suspense>
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
