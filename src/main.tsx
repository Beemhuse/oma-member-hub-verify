import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import SWRProvider from "./lib/swr-config.tsx";

createRoot(document.getElementById("root")!).render(
  <SWRProvider>
    <App />
  </SWRProvider>
);
