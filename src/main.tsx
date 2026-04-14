
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { ErrorBoundary } from "./app/components/ErrorBoundary";
  import { Toaster } from "sonner";
  import { LanguageProvider } from "./app/lib/LanguageContext";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
      <LanguageProvider>
        <App />
      </LanguageProvider>
      <Toaster position="bottom-right" />
    </ErrorBoundary>
  );