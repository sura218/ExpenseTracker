import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
//import "fontsource/roboto"; // Defaults to weight 400
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css"; // Bold

import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
