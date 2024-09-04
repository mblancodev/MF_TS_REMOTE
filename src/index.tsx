import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import "./assets/main.css";

import { AppLocal } from "./App";

const root = createRoot(document.getElementById("root") as HTMLElement);

const App = () => {
  return (
    <StrictMode>
      <AppLocal />
    </StrictMode>
  );
};

root.render(<App />);
