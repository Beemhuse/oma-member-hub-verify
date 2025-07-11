import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import SWRProvider from "./lib/swr-config.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <SWRProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </SWRProvider>
);
