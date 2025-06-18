import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AuthProvider from "./auth/AuthProvider";
import { ProfileProvider } from "./contexts/ProfileContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <ProfileProvider>
        <App />
      </ProfileProvider>
    </AuthProvider>
  </React.StrictMode>
);
