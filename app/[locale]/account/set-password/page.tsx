"use client";

import { useState } from "react";
import { KeyRound, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { setPassword } from "./actions";

export default function SetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const messageType = searchParams.get("type");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    await setPassword(formData);
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t("setPassword.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {t("setPassword.description")}
          </p>
        </div>

        <div className="p-8 space-y-6">
          <form action={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? t("setPassword.setting") : t("setPassword.setPassword")}
            </button>
          </form>

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
