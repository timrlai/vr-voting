import { Suspense, type JSX } from "react";
import { createXRStore, XR, type XRStore } from "@react-three/xr";

type XRSceneProps = {
  children: JSX.Element;
  setXrStore: (store: XRStore) => void;
};

function XRFallback({ store }: { store: XRStore }) {
  console.error("XR scene not loaded");
  console.error("XR Store:", store);
  return null;
}

export default function XRScene({ children, setXrStore }: XRSceneProps) {
  const store = createXRStore({
    controller: { rayPointer: { rayModel: { color: "red" } } },
  });

  if (store) {
    console.info("XR Store:", store);
    setXrStore(store);
  } else {
    console.error("XR Store:", store);
  }

  return store ? (
    <Suspense fallback={<XRFallback store={store} />}>
      <XR store={store}>{children}</XR>
    </Suspense>
  ) : (
    children
  );
}
