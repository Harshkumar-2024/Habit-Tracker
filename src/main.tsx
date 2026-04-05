import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/* ================= GOOGLE AUTH START =================
   If Google login crashes, comment this import + wrapper
===================================================== */
import { GoogleOAuthProvider } from "@react-oauth/google";
/* ================= GOOGLE AUTH END ================= */

// ✅ GitHub Pages route restore fix
const redirect = sessionStorage.redirect;
delete sessionStorage.redirect;

if (redirect && redirect !== location.href) {
  history.replaceState(null, "", redirect);
}

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);