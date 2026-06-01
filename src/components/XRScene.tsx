import { useEffect, type JSX } from "react";
import { createXRStore, XR, type XRStore } from "@react-three/xr";

type XRSceneProps = {
  children: JSX.Element;
  existingStore: XRStore | null;
  setXrStore: (store: XRStore) => void;
};

const store = createXRStore({
  controller: { rayPointer: { rayModel: { color: "red" } } },
});

export default function XRScene({
  children,
  existingStore,
  setXrStore,
}: XRSceneProps) {
  useEffect(() => {
    if (!existingStore && store) setXrStore(store);
  }, [existingStore, setXrStore]);

  return <XR store={existingStore ?? store}>{children}</XR>;
}
