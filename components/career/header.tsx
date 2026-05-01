"use client"

import Image from "next/image"
import { useTranslation } from "react-i18next"
import { AccessibilityToolbar } from "@/components/accessibility-toolbar"
import { LanguageSwitcher } from "@/components/language-switcher"

interface HeaderProps {
  xp?: number
  level?: number
  streak?: number
}

export function Header({ }: HeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt={t("brand.logoAlt")}
              width={44}
              height={44}
              className="object-contain"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Carr<span className="text-primary">IA</span>
              </h1>
              <p className="text-xs text-muted-foreground">{t("brand.tagline")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            {/* Accessibility Toolbar */}
            <AccessibilityToolbar />
          </div>
        </div>
      </div>
    </header>
  )
}
