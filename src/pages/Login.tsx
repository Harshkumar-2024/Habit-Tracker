import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Login() {
  const API_URL = import.meta.env.PROD
  ? "https://habit-tracker-1-58t6.onrender.com"
  : "http://localhost:5000";
  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (!credentialResponse.credential) return;

      const res = await axios.post(
        `${API_URL}/api/auth/google`,
        {
          token: credentialResponse.credential,
        }
      );

      console.log("FULL RESPONSE:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/";
    } catch (error) {
      console.log("LOGIN ERROR:", error);
    }
  };

  return (
  <div className="min-h-screen grid lg:grid-cols-2">
    {/* Left Branding Section */}
    <div className="hidden lg:flex flex-col justify-center px-16 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white">
      <div className="max-w-md space-y-6">
        <h1 className="text-5xl font-bold leading-tight">
          Build Better Habits, Every Single Day.
        </h1>

        <p className="text-lg text-white/90">
          Track streaks, stay consistent, and transform your daily routine into success.
        </p>

        <div className="rounded-3xl bg-white/10 backdrop-blur-md p-6 border border-white/20 space-y-4">
  <div>
    <p className="text-sm opacity-80">📈 Track Progress</p>
    <p className="text-lg font-semibold">Visualize daily consistency</p>
  </div>

  <div>
    <p className="text-sm opacity-80">🔥 Build Streaks</p>
    <p className="text-lg font-semibold">Stay motivated every day</p>
  </div>

  <div>
    <p className="text-sm opacity-80">🎯 Reach Goals</p>
    <p className="text-lg font-semibold">Turn discipline into results</p>
  </div>
</div>
      </div>
    </div>

    {/* Right Login Section */}
    <div className="flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-md rounded-3xl border bg-card shadow-2xl p-8 space-y-6 text-center">
        <div className="space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-primary" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Habit Tracker
          </h1>

          <p className="text-sm text-muted-foreground">
            Sign in to continue your streak journey 🚀
          </p>
        </div>

        <div className="h-px bg-border" />

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
          />
        </div>

        <p className="text-xs text-muted-foreground">
          Your habits, streaks, and progress stay synced securely.
        </p>
      </div>
    </div>
  </div>
);
}
