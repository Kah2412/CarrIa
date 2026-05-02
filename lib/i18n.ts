"use client"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import ptCommon from "@/public/locales/pt/common.json"
import enCommon from "@/public/locales/en/common.json"
import esCommon from "@/public/locales/es/common.json"

export const supportedLanguages = ["pt", "en", "es"] as const
export type SupportedLanguage = (typeof supportedLanguages)[number]

export const languageLabels: Record<SupportedLanguage, string> = {
  pt: "PT",
  en: "EN",
  es: "ES",
}

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      lng: "pt",
      fallbackLng: "pt",
      supportedLngs: supportedLanguages,
      load: "languageOnly",
      nonExplicitSupportedLngs: true,
      defaultNS: "common",
      ns: ["common"],
      resources: {
        pt: { common: ptCommon },
        en: { common: enCommon },
        es: { common: esCommon },
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    })
}

export default i18n
