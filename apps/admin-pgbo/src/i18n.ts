import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { id } from "@repo/constant/locales/id"; // Synchronously load default language

const isServer = typeof window === "undefined";

const i18nInstance = i18n.createInstance();
i18nInstance.use(initReactI18next);

if (!isServer) {
  i18nInstance.use(LanguageDetector);
}

i18nInstance.use(
  resourcesToBackend((language: string) => {
    switch (language) {
      case "en":
        return import("@repo/constant/locales/en").then((m) => m.en);
      case "ms":
        return import("@repo/constant/locales/ms").then((m) => m.ms);
      case "zh":
        return import("@repo/constant/locales/zh").then((m) => m.zh);
      case "ta":
        return import("@repo/constant/locales/ta").then((m) => m.ta);
      case "ar":
        return import("@repo/constant/locales/ar").then((m) => m.ar);
      default:
        // Default to Indonesian if language is missing, though we bundle it synchronously below
        return Promise.resolve(id);
    }
  }),
);

export const initI18n = (lng?: string) => {
  return i18nInstance.init({
    fallbackLng: "id",
    lng: lng,
    resources: {
      id: {
        translation: id,
      },
    },
    load: "languageOnly",
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["cookie", "localStorage", "navigator"],
      lookupCookie: "app_lang",
      lookupLocalStorage: "app_lang",
      caches: ["cookie", "localStorage"],
    },
    partialBundledLanguages: true,
    react: {
      useSuspense: false,
    },
  });
};

// Auto-init on client
if (!isServer) {
  initI18n();
}

export default i18nInstance;
