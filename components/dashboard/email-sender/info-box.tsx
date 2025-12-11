"use client";

import { useTranslations } from "next-intl";
import { Info } from "lucide-react";

export function InfoBox() {
  const t = useTranslations("emailSender");

  return (
    <div className="flex justify-center">
      <div className="w-fit rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <h4 className="font-medium text-blue-900 dark:text-blue-100">
              {t("infoTitle")}
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• {t("infoSingleEmail")}</li>
              <li>• {t("infoBatchEmail")}</li>
              <li>• {t("infoNames")}</li>
              <li>• {t("infoCc")}</li>
              <li>• {t("infoPlaceholders")}</li>
              <li>• {t("infoPreview")}</li>
              <li>• {t("infoPlainText")}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
