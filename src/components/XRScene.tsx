import { Suspense, type JSX } from "react";
import { createXRStore, XR, type XRStore } from "@react-three/xr";

type XRSceneProps = {
  children: JSX.Element;
  setXrStore: (store: XRStore) => void;
};

type XRFallbackProps = { store: XRStore };

function XRFallback({ store }: XRFallbackProps) {
  console.error("XR scene not loaded");
  console.error("XR Store:", store);
  return null;
}

const store = createXRStore({
  controller: { rayPointer: { rayModel: { color: "red" } } },
});

export default function XRScene({ children, setXrStore }: XRSceneProps) {
  if (store) setXrStore(store);

  return store ? (
    <Suspense fallback={<XRFallback store={store} />}>
      <XR store={store}>{children}</XR>
    </Suspense>
  ) : (
    children
  );
}
