"use client";

import { useState } from "react";
import { KeyRound, Mail, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { forgotPassword } from "./actions";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const messageType = searchParams.get("type");
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    await forgotPassword(formData);
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 pb-0 text-center">
          <div className="mx-auto w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t("forgotPassword.title")}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {t("forgotPassword.description")}
          </p>
        </div>

        <div className="p-8 space-y-6">
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                {t("email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
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
              {loading ? t("forgotPassword.sending") : t("forgotPassword.sendLink")}
            </button>
          </form>

          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("forgotPassword.backToLogin")}
          </Link>
        </div>
      </div>
    </main>
  );
}
