import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { AuthContextProvider } from "./context/AuthContextProvider.tsx";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
