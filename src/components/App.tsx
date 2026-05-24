import { Box3 } from "three";
import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { createXRStore, XR } from "@react-three/xr";
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

const store = createXRStore({
  controller: { rayPointer: { rayModel: { color: "red" } } },
});

export default function App() {
  const [box, setBox] = useState<Box3 | null>(null);
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPlaced, setIsPlaced] = useState(false);

  return (
    <main>
      <header>
        <h1>VR Voting</h1>
      </header>
      <nav id="xr-button-container">
        <button
          onClick={() => store.enterVR()}
          className="special-gothic-condensed-one-regular"
        >
          Enter VR
        </button>
      </nav>
      <Canvas shadows>
        <XR store={store}>
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
            <Ballot
              position={[-4, -0.5, 0]}
              onDragged={(box) => {
                if (!isGrabbed) setIsGrabbed(true);
                setBox(box);
              }}
              onOpened={() => setIsOpened(true)}
              onConfirmed={() => setIsConfirmed(true)}
            />

            <Table position={[-6, -2, 1]} />
            <DeputyReturningOfficer position={[-5, 0, -3]} />

            <Screen position={[7.5, -0.4, -10]} />
            <Table position={[6, -2, -10]} />

            <Room />

            <Locomotion />

            <Instructions
              isGrabbed={isGrabbed}
              isOpened={isOpened}
              isConfirmed={isConfirmed}
              isPlaced={isPlaced}
            />

            <OrbitControls />
          </Suspense>
        </XR>
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
