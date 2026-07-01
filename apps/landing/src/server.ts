import {
  createStartHandler,
  defaultStreamHandler,
  defineHandlerCallback,
} from "@tanstack/react-start/server";
import { parse } from "cookie";
import { initI18n } from "./i18n";

const handler = createStartHandler(
  defineHandlerCallback(async (event) => {
    // Ambil bahasa dari query params (?lang=...), cookie, atau header Accept-Language
    const url = new URL(event.request.url);
    const langParam = url.searchParams.get("lang");

    const cookies = parse(event.request.headers.get("cookie") || "");
    const acceptLanguage = event.request.headers.get("accept-language") || "";

    let lang = langParam || cookies.app_lang;
    if (!lang && acceptLanguage) {
      lang = acceptLanguage.split(",")[0].split("-")[0];
    }

    // Validasi ke bahasa yang didukung
    const supported = ["id", "en", "ms", "zh", "ta", "ar"];
    if (!supported.includes(lang || "")) {
      lang = "id";
    }

    // Inisialisasi i18n di server dengan bahasa yang terdeteksi
    await initI18n(lang);

    return defaultStreamHandler(event);
  }),
);

export default {
  fetch: handler,
};
