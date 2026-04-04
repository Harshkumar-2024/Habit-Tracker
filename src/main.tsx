import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/* ================= GOOGLE AUTH START =================
   If Google login crashes, comment this import + wrapper
===================================================== */
import { GoogleOAuthProvider } from "@react-oauth/google";
/* ================= GOOGLE AUTH END ================= */

createRoot(document.getElementById("root")!).render(
  /* ================= GOOGLE AUTH WRAPPER START =================
     If auth crashes, comment this whole wrapper block
  ============================================================= */
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
  /* ================= GOOGLE AUTH WRAPPER END ================= */
);