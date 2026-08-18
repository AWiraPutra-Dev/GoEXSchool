import { c as defineEventHandler, e as createError, r as readBody } from '../../_/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';

const MAP = {
  id: "id",
  en: "en",
  zh: "zh-CN",
  hi: "hi",
  es: "es",
  ar: "ar"
};
const cache = /* @__PURE__ */ new Map();
const MAX_CACHE = 500;
function cacheSet(key, value) {
  if (cache.size >= MAX_CACHE) {
    const first = cache.keys().next().value;
    if (first !== void 0) cache.delete(first);
  }
  cache.set(key, value);
}
const translate_post = defineEventHandler(async (event) => {
  var _a;
  const auth = event.context.auth;
  if (!auth) throw createError({ statusCode: 401, message: "Unauthorized" });
  const { text, to } = await readBody(event);
  const target = (_a = MAP[to]) != null ? _a : "en";
  const source = "id";
  if (typeof text !== "string" || !text.trim()) {
    return { translated: "" };
  }
  const cacheKey = `${target}:${text}`;
  const hit = cache.get(cacheKey);
  if (hit) return { translated: hit };
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${target}&dt=t&q=${encodeURIComponent(text.slice(0, 4500))}`;
    const res = await fetch(url);
    if (!res.ok) return { translated: text };
    const data = await res.json();
    const translated = Array.isArray(data == null ? void 0 : data[0]) ? data[0].map((seg) => {
      var _a2;
      return (_a2 = seg == null ? void 0 : seg[0]) != null ? _a2 : "";
    }).join("") : "";
    if (translated) {
      cacheSet(cacheKey, translated);
      return { translated };
    }
  } catch {
  }
  return { translated: text };
});

export { translate_post as default };
//# sourceMappingURL=translate.post.mjs.map
