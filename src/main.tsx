import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import App from "./components/App.tsx";
import { useTTF } from "@react-three/uikit";

const specialGothicCondensed = "/fonts/SpecialGothicCondensedOne_Regular.ttf";

useTTF.preload(specialGothicCondensed);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
