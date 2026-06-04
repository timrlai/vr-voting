import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/index.css";
import App from "./components/App.tsx";
import { useTTF } from "@react-three/uikit";

const specialGothicCondensed = "/fonts/Roboto_VariableFont_wdth,wght.ttf";

useTTF.preload(specialGothicCondensed);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
