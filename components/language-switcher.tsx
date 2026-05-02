"use client"

import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { languageLabels, supportedLanguages, type SupportedLanguage } from "@/lib/i18n"

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n, t } = useTranslation()
  const currentLanguage = (i18n.resolvedLanguage || i18n.language || "pt").split("-")[0]

  return (
    <div
      aria-label={t("language.selector")}
      className={cn("flex items-center gap-1 text-xs font-semibold text-muted-foreground", className)}
    >
      {supportedLanguages.map((language, index) => (
        <span key={language} className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => i18n.changeLanguage(language)}
            className={cn(
              "px-1.5 py-1 rounded-md transition-colors hover:text-foreground",
              currentLanguage === language && "text-primary bg-primary/10"
            )}
          >
            {languageLabels[language as SupportedLanguage]}
          </button>
          {index < supportedLanguages.length - 1 && <span aria-hidden="true">|</span>}
        </span>
      ))}
    </div>
  )
}
