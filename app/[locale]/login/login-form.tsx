"use client";

import { useState } from "react";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { login } from "./actions";

interface LoginFormProps {
  message?: string;
}

export default function LoginForm({ message }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations();

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
      <div className="p-8 pb-0 text-center">
        <div className="mx-auto w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-slate-900/20">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Sign in to access the QAS Dashboard
        </p>
      </div>

      <form className="p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              required
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              required
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

        {message && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
            <span>Warning</span>
            <p>{message}</p>
          </div>
        )}

        <button
          formAction={login}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-slate-900/20 active:scale-[0.98]"
        >
          Sign In
        </button>
      </form>

      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">
          Internal System - Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
