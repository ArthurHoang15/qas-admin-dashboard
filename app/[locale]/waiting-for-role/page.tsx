"use client";

import { Clock, LogOut, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function WaitingForRolePage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  // Auto-refresh every 30 seconds to check if role has been assigned
  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckRole = () => {
    setChecking(true);
    window.location.reload();
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-3">
            {t("waitingForRole.title")}
          </h1>

          <p className="text-slate-600 mb-8">
            {t("waitingForRole.description")}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleCheckRole}
              disabled={checking}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
              {t("waitingForRole.checkNow")}
            </button>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-sm text-slate-500">
                {t("waitingForRole.autoRefresh")}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              {t("logout")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
