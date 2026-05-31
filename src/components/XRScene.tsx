import { Suspense, type JSX } from "react";
import { createXRStore, XR, type XRStore } from "@react-three/xr";

type XRSceneProps = {
  children: JSX.Element;
  existingStore: XRStore | null;
  setXrStore: (store: XRStore) => void;
};

type XRFallbackProps = { store: XRStore };

function XRFallback({ store }: XRFallbackProps) {
  console.error("XR scene not loaded");
  console.error("XR Store:", store);
  return null;
}

export default function XRScene({
  children,
  existingStore,
  setXrStore,
}: XRSceneProps) {
  const store = createXRStore({
    controller: { rayPointer: { rayModel: { color: "red" } } },
  });

  if (!existingStore && store) setXrStore(store);

  return existingStore ? (
    <Suspense fallback={<XRFallback store={existingStore} />}>
      <XR store={store}>{children}</XR>
    </Suspense>
  ) : (
    children
  );
}
