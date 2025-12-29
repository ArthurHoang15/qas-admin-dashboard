"use client";

import { useState, useEffect } from "react";
import { KeyRound, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/utils/supabase/client";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const t = useTranslations("auth");
  const router = useRouter();

  useEffect(() => {
    const handleTokenFromHash = async () => {
      // Check for error in hash (PKCE flow error)
      const hash = window.location.hash;
      if (hash) {
        const hashParams = new URLSearchParams(hash.substring(1));
        const errorCode = hashParams.get("error");
        const errorDescription = hashParams.get("error_description");

        if (errorCode) {
          setError(errorDescription || "Password reset link is invalid or has expired.");
          setInitializing(false);
          return;
        }

        // If there's an access_token in hash, Supabase client will handle it automatically
        const accessToken = hashParams.get("access_token");
        if (accessToken) {
          // Clear the hash from URL for security
          window.history.replaceState(null, "", window.location.pathname);
        }
      }

      // Check if user has a valid session (from token exchange)
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // No session and no token - invalid access
        setError("Password reset link is invalid or has expired. Please request a new one.");
      }

      setInitializing(false);
    };

    handleTokenFromHash();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || password.length < 6) {
      setError(t("resetPassword.passwordTooShort"));
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t("resetPassword.passwordMismatch"));
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      console.error("Reset password error:", updateError.message);
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to login after success
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  if (initializing) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
          <p className="text-slate-600">{t("resetPassword.verifying") || "Verifying..."}</p>
        </div>
      </main>
    );
  }

  if (error && !success) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">{t("resetPassword.error") || "Error"}</h1>
            <p className="text-slate-600">{error}</p>
            <button
              onClick={() => router.push("/login/forgot-password")}
              className="mt-4 px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              {t("resetPassword.requestNewLink") || "Request New Link"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden p-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">{t("resetPassword.success")}</h1>
            <p className="text-slate-600">{t("resetPassword.redirecting") || "Redirecting to login..."}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <div className="mx-auto w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t("resetPassword.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {t("resetPassword.description")}
          </p>
        </div>

        <div className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="password">
                {t("resetPassword.newPassword")}
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  required
                  minLength={6}
                  className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="confirmPassword">
                {t("resetPassword.confirmPassword")}
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="********"
                  required
                  minLength={6}
                  className="w-full pl-4 pr-10 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? t("resetPassword.resetting") : t("resetPassword.submit")}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
