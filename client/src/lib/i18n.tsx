import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import enJson from "@/locales/en.json";

export type Language = "en" | "es" | "fr" | "he";

type Messages = Record<string, string>;

const en = enJson as Messages;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | null>(null);

/** Dynamic chunks: only the active language + English (fallback) ship in the initial graph for most users. */
const localeLoaders: Record<Language, () => Promise<Messages>> = {
  en: async () => en,
  es: async () => {
    const m = await import("@/locales/es.json");
    return { ...en, ...m.default };
  },
  fr: async () => {
    const m = await import("@/locales/fr.json");
    return { ...en, ...m.default };
  },
  he: async () => {
    const m = await import("@/locales/he.json");
    return { ...en, ...m.default };
  },
};

export async function loadMessagesForLang(lang: Language): Promise<Messages> {
  return localeLoaders[lang]();
}

export function I18nProvider({
  children,
  initialLang,
  initialMessages,
}: {
  children: ReactNode;
  initialLang: Language;
  initialMessages: Messages;
}) {
  const [lang, setLangState] = useState<Language>(initialLang);
  const [messages, setMessages] = useState<Messages>(initialMessages);

  const dir = lang === "he" ? "rtl" : "ltr";

  const setLang = useCallback((newLang: Language) => {
    if (newLang === lang) return;
    localStorage.setItem("lang", newLang);
    void localeLoaders[newLang]().then((next) => {
      setLangState(newLang);
      setMessages(next);
    });
  }, [lang]);

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  const t = useCallback(
    (key: string): string => {
      return messages[key] ?? en[key] ?? key;
    },
    [messages],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

function getDefaultI18nContext(): I18nContextType {
  return {
    lang: "en",
    setLang: () => {},
    t: (key: string) => en[key] ?? key,
    dir: "ltr",
  };
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  return ctx ?? getDefaultI18nContext();
}

export const languageNames: Record<Language, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
  he: "\u05e2\u05d1\u05e8\u05d9\u05ea",
};
