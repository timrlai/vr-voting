import { Suspense, type JSX } from "react";
import { createXRStore, XR, type XRStore } from "@react-three/xr";

type XRSceneProps = {
  children: JSX.Element;
  setXrStore: (store: XRStore) => void;
};

function XRFallback() {
  console.error("XR scene not loaded");
  return null;
}

export default function XRScene({ children, setXrStore }: XRSceneProps) {
  const store = createXRStore({
    controller: { rayPointer: { rayModel: { color: "red" } } },
  });

  if (store) setXrStore(store);

  return store ? (
    <Suspense fallback={<XRFallback />}>
      <XR store={store}>{children}</XR>
    </Suspense>
  ) : (
    children
  );
}
