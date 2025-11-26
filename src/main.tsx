import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GameProvider } from "./contexts/GameContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((error) => {
        console.log("SW registration failed: ", error);
      });
  });
}
