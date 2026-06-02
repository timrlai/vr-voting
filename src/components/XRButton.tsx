import { useXRSessionModeSupported, type XRStore } from "@react-three/xr";

type XRButtonProps = {
  store: XRStore | null;
  existingSession: XRSession | null;
  setSession: (session: XRSession | null) => void;
};

export default function XRButton({
  store,
  existingSession,
  setSession,
}: XRButtonProps) {
  const vrSupported = useXRSessionModeSupported("immersive-vr");

  const onEnterXr = () => {
    if (!vrSupported || !store) return;
    store.enterVR().then((session: XRSession | undefined) => {
      console.log("session:", session);
      if (!existingSession && session) setSession(session);
    });
  };

  return (
    <nav id="xr-button-container">
      <button
        onClick={onEnterXr}
        disabled={!vrSupported}
        className="special-gothic-condensed-one-regular"
      >
        {vrSupported ? "Enter VR" : "VR Unavailable"}
      </button>
    </nav>
  );
}
