export interface Language {
  id: string;
  label: string;
  emoji: string;
  code: string;
}

export const LANGUAGES: Language[] = [
  { id: "id", label: "Indonesia", emoji: "🇮🇩", code: "ID" },
  { id: "en", label: "English", emoji: "🇬🇧", code: "EN" },
  { id: "ms", label: "Malaysia", emoji: "🇲🇾", code: "MS" },
  { id: "zh", label: "Chinese", emoji: "🇨🇳", code: "ZH" },
  { id: "ta", label: "Tamil", emoji: "🇮🇳", code: "TA" },
  { id: "ar", label: "العربية", emoji: "🇸🇦", code: "AR" },
];
