import { useEffect, useState, type JSX } from "react";
import { createXRStore, XR, type XRStore } from "@react-three/xr";

type XRSceneProps = {
  children: JSX.Element;
  existingStore: XRStore | null;
  setXrStore: (store: XRStore) => void;
};

export default function XRScene({
  children,
  existingStore,
  setXrStore,
}: XRSceneProps) {
  const [store] = useState(
    createXRStore({
      controller: { rayPointer: { rayModel: { color: "red" } } },
    }),
  );

  useEffect(() => {
    if (!existingStore && store) setXrStore(store);
  }, [existingStore, store, setXrStore]);

  return <XR store={existingStore ?? store}>{children}</XR>;
}
