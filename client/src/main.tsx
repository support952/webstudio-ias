import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import en from "./locales/en.json";
import { I18nProvider, loadMessagesForLang, type Language } from "./lib/i18n";

function getStoredLang(): Language {
  const v = localStorage.getItem("lang");
  if (v === "en" || v === "es" || v === "fr" || v === "de") return v;
  return "en";
}

function bootstrap() {
  const lang = getStoredLang();
  const root = createRoot(document.getElementById("root")!);
  if (lang === "en") {
    root.render(
      <I18nProvider initialLang="en" initialMessages={en}>
        <App />
      </I18nProvider>,
    );
    return;
  }
  void loadMessagesForLang(lang).then((messages) => {
    root.render(
      <I18nProvider initialLang={lang} initialMessages={messages}>
        <App />
      </I18nProvider>,
    );
  });
}

bootstrap();
