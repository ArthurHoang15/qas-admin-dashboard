"use client";

import { useState, useEffect } from "react";
import { User, KeyRound, Eye, EyeOff, Mail, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { setPassword, sendPasswordResetEmail } from "./actions";

interface UserProfile {
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  hasPassword: boolean;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const messageType = searchParams.get("type");

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user has password identity
        const hasPassword = user.identities?.some(
          (identity) => identity.provider === "email"
        ) ?? false;

        setUser({
          email: user.email || "",
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatarUrl: user.user_metadata?.avatar_url || null,
          hasPassword,
        });
      }
      setUserLoading(false);
    }
    loadUser();
  }, []);

  const handleSetPassword = async (formData: FormData) => {
    setLoading(true);
    await setPassword(formData);
    setLoading(false);
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    setResetLoading(true);
    await sendPasswordResetEmail(user.email);
    setResetLoading(false);
  };

  if (userLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900" />
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t("profile.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {t("profile.description")}
          </p>
        </div>

        <div className="p-8 space-y-6">
          {/* User Info */}
          <div className="space-y-4 p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">{t("email")}</p>
                <p className="text-sm font-medium text-slate-900">{user?.email}</p>
              </div>
            </div>
            {user?.fullName && (
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">{t("fullName")}</p>
                  <p className="text-sm font-medium text-slate-900">{user.fullName}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <KeyRound className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-500">{t("profile.passwordStatus")}</p>
                <p className={`text-sm font-medium ${user?.hasPassword ? "text-green-600" : "text-amber-600"}`}>
                  {user?.hasPassword ? t("profile.passwordSet") : t("profile.noPassword")}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-1 ${
              messageType === "success"
                ? "bg-green-50 border border-green-100 text-green-600"
                : "bg-red-50 border border-red-100 text-red-600"
            }`}>
              <span>{messageType === "success" ? "✓" : "⚠"}</span>
              <p>{message}</p>
            </div>
          )}

          {/* Set Password Form - only show if user doesn't have password */}
          {!user?.hasPassword && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                {t("setPassword.title")}
              </h2>

              <form action={handleSetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="password">
                    {t("setPassword.newPassword")}
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
                    {t("setPassword.confirmPassword")}
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
                  {loading ? t("setPassword.setting") : t("setPassword.submit")}
                </button>
              </form>
            </div>
          )}

          {/* Reset Password via Email - only show if user has password */}
          {user?.hasPassword && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                {t("profile.changePassword")}
              </h2>
              <p className="text-sm text-slate-500">
                {t("profile.resetViaEmailDescription")}
              </p>
              <button
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-slate-900/20"
              >
                <Mail className={`w-4 h-4 ${resetLoading ? "animate-pulse" : ""}`} />
                {resetLoading ? t("forgotPassword.sending") : t("profile.resetViaEmail")}
              </button>
            </div>
          )}

          {/* Back to Dashboard */}
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("setPassword.backToDashboard")}
          </Link>
        </div>
      </div>
    </main>
  );
}
