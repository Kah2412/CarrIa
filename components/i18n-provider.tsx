"use client"

import { useEffect, useState } from "react"
import { I18nextProvider } from "react-i18next"
import i18n, { supportedLanguages, type SupportedLanguage } from "@/lib/i18n"

const LANGUAGE_STORAGE_KEY = "i18nextLng"

function normalizeLanguage(language?: string | null): SupportedLanguage | null {
  const languageCode = language?.replace("_", "-").split("-")[0]?.toLowerCase()
  return supportedLanguages.includes(languageCode as SupportedLanguage)
    ? (languageCode as SupportedLanguage)
    : null
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const storedLanguage = normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY))
    const browserLanguage = normalizeLanguage(window.navigator.language)
    const initialLanguage = storedLanguage || browserLanguage

    if (initialLanguage && i18n.language !== initialLanguage) {
      i18n.changeLanguage(initialLanguage)
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return

    const handleLanguageChange = (language: string) => {
      const normalizedLanguage = normalizeLanguage(language)

      if (normalizedLanguage) {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage)
      }
    }

    i18n.on("languageChanged", handleLanguageChange)
    return () => {
      i18n.off("languageChanged", handleLanguageChange)
    }
  }, [mounted])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
