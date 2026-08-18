import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import crypto$1, { randomUUID } from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, createError, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, getHeader, getCookie, getResponseStatus, getQuery as getQuery$1, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getRouterParam, setHeader, readMultipartFormData, getResponseStatusText } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/h3/dist/index.mjs';
import { escapeHtml } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@vue/shared/dist/shared.cjs.js';
import viteNodeEntry_mjs from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@nuxt/vite-builder/dist/vite-node-entry.mjs';
import { viteNodeFetch } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@nuxt/vite-builder/dist/vite-node.mjs';
import XLSX from 'xlsx';
import { hash as hash$2, compare } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/bcrypt-ts/dist/node.mjs';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { Document, Paragraph, Table, TextRun, AlignmentType, TableRow, WidthType, TableCell, Packer, ImageRun } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/docx/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/unstorage/drivers/fs.mjs';
import file_58_47_47_47D_58_47Project_47Nuxt_47eskulhub_45prototype_47eskulhub_45prototype_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46mjs from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL, parseQuery, parsePath, encodePath } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/ufo/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@nuxt/nitro-server/node_modules/unhead/dist/server.mjs';
import { isVNode, isRef, toValue } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/vue/index.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/unhead/dist/plugins.mjs';
import { klona } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/defu/dist/defu.mjs';
import destr, { destr as destr$1 } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/destr/dist/index.mjs';
import { snakeCase } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/scule/dist/index.mjs';
import { defineDiagnostics, createConsoleReporter } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/nostics/dist/index.mjs';
import { ansiFormatter } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/nostics/dist/formatters/ansi.mjs';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { renderToString } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/vue/server-renderer/index.mjs';
import { stringify, uneval } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/devalue/index.js';
import { createHooks } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/nitropack/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/node-mock-http/dist/index.mjs';
import { digest, hash as hash$1 } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/radix3/dist/index.mjs';
import consola, { consola as consola$1 } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/youch-core/build/index.js';
import { Youch } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@nuxt/nitro-server/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/errx/dist/index.js';
import _wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@nuxt/vite-builder/dist/fix-stacktrace.mjs';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/pathe/dist/index.mjs';
import jwt from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/jsonwebtoken/index.js';
import { PrismaClient } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@prisma/client/default.js';
import { getIcons } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@nuxt/icon/node_modules/@iconify/utils/lib/index.js';
import { collections } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/.nuxt/nuxt-icon-server-bundle.mjs';
import { walkResolver } from 'file://D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@nuxt/nitro-server/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/server","watchOptions":{"ignored":[null]}}));
storage.mount('cache:nuxt:payload', file_58_47_47_47D_58_47Project_47Nuxt_47eskulhub_45prototype_47eskulhub_45prototype_47node_modules_47_64nuxt_47nitro_45server_47dist_47runtime_47utils_47cache_45driver_46mjs({"driver":"file:///D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/node_modules/@nuxt/nitro-server/dist/runtime/utils/cache-driver.mjs","base":"D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/.nuxt/cache/nuxt/payload"}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {},
  "ui": {
    "colors": {
      "primary": "green",
      "secondary": "blue",
      "success": "green",
      "info": "blue",
      "warning": "yellow",
      "error": "red",
      "neutral": "slate"
    },
    "icons": {
      "arrowLeft": "i-lucide-arrow-left",
      "arrowRight": "i-lucide-arrow-right",
      "check": "i-lucide-check",
      "chevronDoubleLeft": "i-lucide-chevrons-left",
      "chevronDoubleRight": "i-lucide-chevrons-right",
      "chevronDown": "i-lucide-chevron-down",
      "chevronLeft": "i-lucide-chevron-left",
      "chevronRight": "i-lucide-chevron-right",
      "chevronUp": "i-lucide-chevron-up",
      "close": "i-lucide-x",
      "ellipsis": "i-lucide-ellipsis",
      "external": "i-lucide-arrow-up-right",
      "folder": "i-lucide-folder",
      "folderOpen": "i-lucide-folder-open",
      "loading": "i-lucide-refresh-cw",
      "minus": "i-lucide-minus",
      "plus": "i-lucide-plus",
      "search": "i-lucide-search"
    }
  },
  "icon": {
    "provider": "iconify",
    "class": "",
    "aliases": {},
    "iconifyApiEndpoint": "https://api.iconify.design",
    "localApiEndpoint": "/api/_nuxt_icon",
    "fallbackToApi": true,
    "cssSelectorPrefix": "i-",
    "cssWherePseudo": true,
    "cssLayer": "components",
    "mode": "css",
    "attrs": {
      "aria-hidden": true
    },
    "collections": [
      "academicons",
      "akar-icons",
      "ant-design",
      "arcticons",
      "basil",
      "bi",
      "bitcoin-icons",
      "bpmn",
      "brandico",
      "bx",
      "bxl",
      "bxs",
      "bytesize",
      "carbon",
      "catppuccin",
      "cbi",
      "charm",
      "ci",
      "cib",
      "cif",
      "cil",
      "circle-flags",
      "circum",
      "clarity",
      "codex",
      "codicon",
      "covid",
      "cryptocurrency",
      "cryptocurrency-color",
      "cuida",
      "dashicons",
      "devicon",
      "devicon-plain",
      "dinkie-icons",
      "duo-icons",
      "ei",
      "el",
      "emojione",
      "emojione-monotone",
      "emojione-v1",
      "entypo",
      "entypo-social",
      "eos-icons",
      "ep",
      "et",
      "eva",
      "f7",
      "fa",
      "fa-brands",
      "fa-regular",
      "fa-solid",
      "fa6-brands",
      "fa6-regular",
      "fa6-solid",
      "fa7-brands",
      "fa7-regular",
      "fa7-solid",
      "fad",
      "famicons",
      "fe",
      "feather",
      "file-icons",
      "flag",
      "flagpack",
      "flat-color-icons",
      "flat-ui",
      "flowbite",
      "fluent",
      "fluent-color",
      "fluent-emoji",
      "fluent-emoji-flat",
      "fluent-emoji-high-contrast",
      "fluent-mdl2",
      "fontelico",
      "fontisto",
      "formkit",
      "foundation",
      "fxemoji",
      "gala",
      "game-icons",
      "garden",
      "geo",
      "gg",
      "gis",
      "gravity-ui",
      "gridicons",
      "grommet-icons",
      "guidance",
      "healthicons",
      "heroicons",
      "heroicons-outline",
      "heroicons-solid",
      "hugeicons",
      "humbleicons",
      "ic",
      "icomoon-free",
      "icon-park",
      "icon-park-outline",
      "icon-park-solid",
      "icon-park-twotone",
      "iconamoon",
      "iconoir",
      "icons8",
      "il",
      "ion",
      "iwwa",
      "ix",
      "jam",
      "la",
      "lets-icons",
      "line-md",
      "lineicons",
      "logos",
      "ls",
      "lsicon",
      "lucide",
      "lucide-lab",
      "mage",
      "majesticons",
      "maki",
      "map",
      "marketeq",
      "material-icon-theme",
      "material-symbols",
      "material-symbols-light",
      "mdi",
      "mdi-light",
      "medical-icon",
      "memory",
      "meteocons",
      "meteor-icons",
      "mi",
      "mingcute",
      "mono-icons",
      "mynaui",
      "nimbus",
      "nonicons",
      "noto",
      "noto-v1",
      "nrk",
      "octicon",
      "oi",
      "ooui",
      "openmoji",
      "oui",
      "pajamas",
      "pepicons",
      "pepicons-pencil",
      "pepicons-pop",
      "pepicons-print",
      "ph",
      "picon",
      "pixel",
      "pixelarticons",
      "prime",
      "proicons",
      "ps",
      "qlementine-icons",
      "quill",
      "radix-icons",
      "raphael",
      "ri",
      "rivet-icons",
      "roentgen",
      "si",
      "si-glyph",
      "sidekickicons",
      "simple-icons",
      "simple-line-icons",
      "skill-icons",
      "solar",
      "stash",
      "streamline",
      "streamline-block",
      "streamline-color",
      "streamline-cyber",
      "streamline-cyber-color",
      "streamline-emojis",
      "streamline-flex",
      "streamline-flex-color",
      "streamline-freehand",
      "streamline-freehand-color",
      "streamline-kameleon-color",
      "streamline-logos",
      "streamline-pixel",
      "streamline-plump",
      "streamline-plump-color",
      "streamline-sharp",
      "streamline-sharp-color",
      "streamline-stickies-color",
      "streamline-ultimate",
      "streamline-ultimate-color",
      "subway",
      "svg-spinners",
      "system-uicons",
      "tabler",
      "tdesign",
      "teenyicons",
      "temaki",
      "token",
      "token-branded",
      "topcoat",
      "twemoji",
      "typcn",
      "uil",
      "uim",
      "uis",
      "uit",
      "uiw",
      "unjs",
      "vaadin",
      "vs",
      "vscode-icons",
      "websymbol",
      "weui",
      "whh",
      "wi",
      "wpf",
      "zmdi",
      "zondicons"
    ],
    "fetchTimeout": 1500
  }
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        },
        "cache": {
          "maxAge": 31536000
        }
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "appName": "StudentBase"
  },
  "icon": {
    "serverKnownCssClasses": []
  }
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
const _sharedAppConfig = _deepFreeze(klona(appConfig));
function useAppConfig(event) {
  {
    return _sharedAppConfig;
  }
}
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

function isPathInScope(pathname, base) {
  let canonical;
  try {
    const pre = pathname.replace(/%2f/gi, "/").replace(/%5c/gi, "\\");
    canonical = new URL(pre, "http://_").pathname;
  } catch {
    return false;
  }
  return !base || canonical === base || canonical.startsWith(base + "/");
}

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          if (!isPathInScope(event.path.split("?")[0], strpBase)) {
            throw createError({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

//#region src/runtime/utils/error.ts
/**
* Nitro internal functions extracted from https://github.com/nitrojs/nitro/blob/v2/src/runtime/internal/utils.ts
*/
function isJsonRequest(event) {
	if (hasReqHeader(event, "accept", "text/html")) return false;
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

//#region src/runtime/utils/dev.ts
const iframeStorageBridge = (nonce) => `
(function () {
  const NONCE = ${JSON.stringify(nonce)};
  const memoryStore = Object.create(null);

  const post = (type, payload) => {
    window.parent.postMessage({ type, nonce: NONCE, ...payload }, '*');
  };

  const isValid = (data) => data && data.nonce === NONCE;

  const mockStorage = {
    getItem(key) {
      return Object.hasOwn(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      const v = String(value);
      memoryStore[key] = v;
      post('storage-set', { key, value: v });
    },
    removeItem(key) {
      delete memoryStore[key];
      post('storage-remove', { key });
    },
    clear() {
      for (const key of Object.keys(memoryStore))
        delete memoryStore[key];
      post('storage-clear', {});
    },
    key(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] ?? null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };

  const defineLocalStorage = () => {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: false,
        configurable: true
      });
    } catch {
      window.localStorage = mockStorage;
    }
  };

  defineLocalStorage();

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!isValid(data) || data.type !== 'storage-sync-data') return;

    const incoming = data.data || {};
    for (const key of Object.keys(incoming))
      memoryStore[key] = incoming[key];

    if (typeof window.initTheme === 'function')
      window.initTheme();
    window.dispatchEvent(new Event('storage-ready'));
  });

  // Clipboard API is unavailable in data: URL iframe, so we use postMessage
  document.addEventListener('DOMContentLoaded', function() {
    window.copyErrorMessage = function(button) {
      post('clipboard-copy', { text: button.dataset.errorText });
      button.classList.add('copied');
      setTimeout(function() { button.classList.remove('copied'); }, 2000);
    };
  });

  post('storage-sync-request', {});
})();
`;
const parentStorageBridge = (nonce) => `
(function () {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;

  const NONCE = ${JSON.stringify(nonce)};
  const isValid = (data) => data && data.nonce === NONCE;

  // Handle clipboard copy from iframe
  window.addEventListener('message', function(e) {
    if (isValid(e.data) && e.data.type === 'clipboard-copy') {
      navigator.clipboard.writeText(e.data.text).catch(function() {});
    }
  });

  const collectLocalStorage = () => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k != null) all[k] = localStorage.getItem(k);
    }
    return all;
  };

  const attachWhenReady = () => {
    const root = host.shadowRoot;
    if (!root)
      return false;
    const iframe = root.getElementById('frame');
    if (!iframe || !iframe.contentWindow)
      return false;

    const handlers = {
      'storage-set': (d) => localStorage.setItem(d.key, d.value),
      'storage-remove': (d) => localStorage.removeItem(d.key),
      'storage-clear': () => localStorage.clear(),
      'storage-sync-request': () => {
        iframe.contentWindow.postMessage({
          type: 'storage-sync-data',
          data: collectLocalStorage(),
          nonce: NONCE
        }, '*');
      }
    };

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!isValid(data)) return;
      const fn = handlers[data.type];
      if (fn) fn(data);
    });

    return true;
  };

  if (attachWhenReady())
    return;

  const obs = new MutationObserver(() => {
    if (attachWhenReady())
      obs.disconnect();
  });

  obs.observe(host, { childList: true, subtree: true });
})();
`;
const errorCSS = `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  --error-pip-left: auto;
  --error-pip-top: auto;
  --error-pip-right: 5px;
  --error-pip-bottom: 5px;
  --error-pip-origin: bottom right;
  --app-preview-left: auto;
  --app-preview-top: auto;
  --app-preview-right: 5px;
  --app-preview-bottom: 5px;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: var(--error-pip-right);
  bottom: var(--error-pip-bottom);
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: var(--error-pip-origin);
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: var(--app-preview-right);
  bottom: var(--app-preview-bottom);
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 6px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#preview iframe {
  transform-origin: var(--error-pip-origin);
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: calc(var(--app-preview-right) - 3px);
  bottom: calc(var(--app-preview-bottom) - 3px);
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 0;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
#frame[inert] ~ #toggle {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: calc(var(--error-pip-right) - 3px);
  bottom: calc(var(--error-pip-bottom) - 3px);
  cursor: grab;
}
:host(.dragging) #frame[inert] ~ #toggle {
  cursor: grabbing;
}
#frame:not([inert]) ~ #toggle,
#frame:not([inert]) + #preview {
  cursor: grab;
}
:host(.dragging-preview) #frame:not([inert]) ~ #toggle,
:host(.dragging-preview) #frame:not([inert]) + #preview {
  cursor: grabbing;
}

#pip-close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
#pip-close:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}

#pip-restore {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid #00DC82;
  background: #111;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: calc(var(--z-base) + 2);
  cursor: grab;
}
#pip-restore:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}
:host(.dragging-restore) #pip-restore {
  cursor: grabbing;
}

#frame[hidden],
#toggle[hidden],
#preview[hidden],
#pip-restore[hidden],
#pip-close[hidden] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`;
function webComponentScript(base64HTML, startMinimized) {
	return `
(function () {
  try {
    // =========================
    // Host + Shadow
    // =========================
    const host = document.querySelector('nuxt-error-overlay');
    if (!host)
      return;
    const shadow = host.attachShadow({ mode: 'open' });

    // =========================
    // DOM helpers
    // =========================
    const el = (tag) => document.createElement(tag);
    const on = (node, type, fn, opts) => node.addEventListener(type, fn, opts);
    const hide = (node, v) => node.toggleAttribute('hidden', !!v);
    const setVar = (name, value) => host.style.setProperty(name, value);
    const unsetVar = (name) => host.style.removeProperty(name);

    // =========================
    // Create DOM
    // =========================
    const style = el('style');
    style.textContent = ${JSON.stringify(errorCSS)};

    const iframe = el('iframe');
    iframe.id = 'frame';
    iframe.src = 'data:text/html;base64,${base64HTML}';
    iframe.title = 'Detailed error stack trace';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');

    const preview = el('div');
    preview.id = 'preview';

    const toggle = el('div');
    toggle.id = 'toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';

    const liveRegion = el('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';

    const pipCloseButton = el('button');
    pipCloseButton.id = 'pip-close';
    pipCloseButton.setAttribute('type', 'button');
    pipCloseButton.setAttribute('aria-label', 'Hide error preview overlay');
    pipCloseButton.innerHTML = '&times;';
    pipCloseButton.hidden = true;
    toggle.appendChild(pipCloseButton);

    const pipRestoreButton = el('button');
    pipRestoreButton.id = 'pip-restore';
    pipRestoreButton.setAttribute('type', 'button');
    pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
    pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
    pipRestoreButton.hidden = true;

    // Order matters: #frame + #preview adjacency
    shadow.appendChild(style);
    shadow.appendChild(liveRegion);
    shadow.appendChild(iframe);
    shadow.appendChild(preview);
    shadow.appendChild(toggle);
    shadow.appendChild(pipRestoreButton);

    // =========================
    // Constants / keys
    // =========================
    const POS_KEYS = {
      position: 'nuxt-error-overlay:position',
      hiddenPretty: 'nuxt-error-overlay:error-pip:hidden',
      hiddenPreview: 'nuxt-error-overlay:app-preview:hidden'
    };

    const CSS_VARS = {
      pip: {
        left: '--error-pip-left',
        top: '--error-pip-top',
        right: '--error-pip-right',
        bottom: '--error-pip-bottom'
      },
      preview: {
        left: '--app-preview-left',
        top: '--app-preview-top',
        right: '--app-preview-right',
        bottom: '--app-preview-bottom'
      }
    };

    const MIN_GAP = 5;
    const DRAG_THRESHOLD = 2;

    // =========================
    // Local storage safe access + state
    // =========================
    let storageReady = true;
    let isPrettyHidden = false;
    let isPreviewHidden = false;

    const safeGet = (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const safeSet = (k, v) => {
      if (!storageReady) 
        return;
      try {
        localStorage.setItem(k, v);
      } catch {}
    };

    // =========================
    // Sizing helpers
    // =========================
    const vvSize = () => {
      const v = window.visualViewport;
      return v ? { w: v.width, h: v.height } : { w: window.innerWidth, h: window.innerHeight };
    };

    const previewSize = () => {
      const styles = getComputedStyle(host);
      const w = parseFloat(styles.getPropertyValue('--preview-width')) || 240;
      const h = parseFloat(styles.getPropertyValue('--preview-height')) || 180;
      return { w, h };
    };

    const sizeForTarget = (target) => {
      if (!target)
        return previewSize();
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height)
        return { w: rect.width, h: rect.height };
      return previewSize();
    };

    // =========================
    // Dock model + offset/alignment calculations
    // =========================
    const dock = { edge: null, offset: null, align: null, gap: null };

    const maxOffsetFor = (edge, size) => {
      const vv = vvSize();
      if (edge === 'left' || edge === 'right')
        return Math.max(MIN_GAP, vv.h - size.h - MIN_GAP);
      return Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
    };

    const clampOffset = (edge, value, size) => {
      const max = maxOffsetFor(edge, size);
      return Math.min(Math.max(value, MIN_GAP), max);
    };

    const updateDockAlignment = (size) => {
      if (!dock.edge || dock.offset == null)
        return;
      const max = maxOffsetFor(dock.edge, size);
      if (dock.offset <= max / 2) {
        dock.align = 'start';
        dock.gap = dock.offset;
      } else {
        dock.align = 'end';
        dock.gap = Math.max(0, max - dock.offset);
      }
    };

    const appliedOffsetFor = (size) => {
      if (!dock.edge || dock.offset == null)
        return null;
      const max = maxOffsetFor(dock.edge, size);

      if (dock.align === 'end' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, max - dock.gap, size);
      }
      if (dock.align === 'start' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, dock.gap, size);
      }
      return clampOffset(dock.edge, dock.offset, size);
    };

    const nearestEdgeAt = (x, y) => {
      const { w, h } = vvSize();
      const d = { left: x, right: w - x, top: y, bottom: h - y };
      return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
    };

    const cornerDefaultDock = () => {
      const vv = vvSize();
      const size = previewSize();
      const offset = Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
      return { edge: 'bottom', offset };
    };

    const currentTransformOrigin = () => {
      if (!dock.edge) return null;
      if (dock.edge === 'left' || dock.edge === 'top')
        return 'top left';
      if (dock.edge === 'right')
        return 'top right';
      return 'bottom left';
    };

    // =========================
    // Persist / load dock
    // =========================
    const loadDock = () => {
      const raw = safeGet(POS_KEYS.position);
      if (!raw)
        return;
      try {
        const parsed = JSON.parse(raw);
        const { edge, offset, align, gap } = parsed || {};
        if (!['left', 'right', 'top', 'bottom'].includes(edge))
          return;
        if (typeof offset !== 'number')
          return;

        dock.edge = edge;
        dock.offset = clampOffset(edge, offset, previewSize());
        dock.align = align === 'start' || align === 'end' ? align : null;
        dock.gap = typeof gap === 'number' ? gap : null;

        if (!dock.align || dock.gap == null)
          updateDockAlignment(previewSize());
      } catch {}
    };

    const persistDock = () => {
      if (!dock.edge || dock.offset == null)
        return; 
      safeSet(POS_KEYS.position, JSON.stringify({
        edge: dock.edge,
        offset: dock.offset,
        align: dock.align,
        gap: dock.gap
      }));
    };

    // =========================
    // Apply dock
    // =========================
    const dockToVars = (vars) => ({
      set: (side, v) => host.style.setProperty(vars[side], v),
      clear: (side) => host.style.removeProperty(vars[side])
    });

    const dockToEl = (node) => ({
      set: (side, v) => { node.style[side] = v; },
      clear: (side) => { node.style[side] = ''; }
    });

    const applyDock = (target, size, opts) => {
      if (!dock.edge || dock.offset == null) {
        target.clear('left');
        target.clear('top');
        target.clear('right');
        target.clear('bottom');
        return;
      }

      target.set('left', 'auto');
      target.set('top', 'auto');
      target.set('right', 'auto');
      target.set('bottom', 'auto');

      const applied = appliedOffsetFor(size);

      if (dock.edge === 'left') {
        target.set('left', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'right') {
        target.set('right', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'top') {
        target.set('top', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      } else {
        target.set('bottom', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      }

      if (!opts || opts.persist !== false)
        persistDock();
    };

    const applyDockAll = (opts) => {
      applyDock(dockToVars(CSS_VARS.pip), previewSize(), opts);
      applyDock(dockToVars(CSS_VARS.preview), previewSize(), opts);
      applyDock(dockToEl(pipRestoreButton), sizeForTarget(pipRestoreButton), opts);
    };

    const repaintToDock = () => {
      if (!dock.edge || dock.offset == null)
        return;
      const origin = currentTransformOrigin();
      if (origin)
        setVar('--error-pip-origin', origin);
      else 
        unsetVar('--error-pip-origin');
      applyDockAll({ persist: false });
    };

    // =========================
    // Hidden state + UI
    // =========================
    const loadHidden = () => {
      const rawPretty = safeGet(POS_KEYS.hiddenPretty);
      if (rawPretty != null)
        isPrettyHidden = rawPretty === '1' || rawPretty === 'true';
      const rawPreview = safeGet(POS_KEYS.hiddenPreview);
      if (rawPreview != null)
        isPreviewHidden = rawPreview === '1' || rawPreview === 'true';
    };

    const setPrettyHidden = (v) => {
      isPrettyHidden = !!v;
      safeSet(POS_KEYS.hiddenPretty, isPrettyHidden ? '1' : '0');
      updateUI();
    };

    const setPreviewHidden = (v) => {
      isPreviewHidden = !!v;
      safeSet(POS_KEYS.hiddenPreview, isPreviewHidden ? '1' : '0');
      updateUI();
    };

    const isMinimized = () => iframe.hasAttribute('inert');

    const setMinimized = (v) => {
      if (v) {
        iframe.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        iframe.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    const setRestoreLabel = (kind) => {
      if (kind === 'pretty') {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
      } else {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error page</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error page');
      }
    };

    const updateUI = () => {
      const minimized = isMinimized();
      const showPiP = minimized && !isPrettyHidden;
      const showPreview = !minimized && !isPreviewHidden;
      const pipHiddenByUser = minimized && isPrettyHidden;
      const previewHiddenByUser = !minimized && isPreviewHidden;
      const showToggle = minimized ? showPiP : showPreview;
      const showRestore = pipHiddenByUser || previewHiddenByUser;

      hide(iframe, pipHiddenByUser);
      hide(preview, !showPreview);
      hide(toggle, !showToggle);
      hide(pipCloseButton, !showToggle);
      hide(pipRestoreButton, !showRestore);

      pipCloseButton.setAttribute('aria-label', minimized ? 'Hide error overlay' : 'Hide error page preview');

      if (pipHiddenByUser)
        setRestoreLabel('pretty');
      else if (previewHiddenByUser)
        setRestoreLabel('preview');

      host.classList.toggle('pip-hidden', isPrettyHidden);
      host.classList.toggle('preview-hidden', isPreviewHidden);
    };

    // =========================
    // Preview snapshot
    // =========================
    const updatePreview = () => {
      try {
        let previewIframe = preview.querySelector('iframe');
        if (!previewIframe) {
          previewIframe = el('iframe');
          previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
          previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          preview.appendChild(previewIframe);
        }

        const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
        const cleanedHTML = document.documentElement.outerHTML
          .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
          .replace(/<script[^>]*>.*?<\\/script>/gs, '');

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(doctype + cleanedHTML);
        iframeDoc.close();
      } catch (err) {
        console.error('Failed to update preview:', err);
      }
    };

    // =========================
    // View toggling
    // =========================
    const toggleView = () => {
      if (isMinimized()) {
        updatePreview();
        setMinimized(false);
        liveRegion.textContent = 'Showing detailed error view';
        setTimeout(() => { 
          try { 
            iframe.contentWindow.focus();
          } catch {}
        }, 100);
      } else {
        setMinimized(true);
        liveRegion.textContent = 'Showing error page';
        repaintToDock();
        void iframe.offsetWidth;
      }
      updateUI();
    };

    // =========================
    // Dragging (unified, rAF throttled)
    // =========================
    let drag = null;
    let rafId = null;
    let suppressToggleClick = false;
    let suppressRestoreClick = false;

    const beginDrag = (e) => {
      if (drag) 
        return;

      if (!dock.edge || dock.offset == null) {
        const def = cornerDefaultDock();
        dock.edge = def.edge;
        dock.offset = def.offset;
        updateDockAlignment(previewSize());
      }

      const isRestoreTarget = e.currentTarget === pipRestoreButton;

      drag = {
        kind: isRestoreTarget ? 'restore' : (isMinimized() ? 'pip' : 'preview'),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        target: e.currentTarget
      };

      drag.target.setPointerCapture(e.pointerId);

      if (drag.kind === 'restore')
        host.classList.add('dragging-restore');
      else 
        host.classList.add(drag.kind === 'pip' ? 'dragging' : 'dragging-preview');

      e.preventDefault();
    };

    const moveDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;

      if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        drag.moved = true;
      }

      if (!drag.moved)
        return;
      if (rafId)
        return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const edge = nearestEdgeAt(drag.lastX, drag.lastY);
        const size = sizeForTarget(drag.target);

        let offset;
        if (edge === 'left' || edge === 'right') {
          const top = drag.lastY - (size.h / 2);
          offset = clampOffset(edge, Math.round(top), size);
        } else {
          const left = drag.lastX - (size.w / 2);
          offset = clampOffset(edge, Math.round(left), size);
        }

        dock.edge = edge;
        dock.offset = offset;
        updateDockAlignment(size);

        const origin = currentTransformOrigin();
        setVar('--error-pip-origin', origin || 'bottom right');

        applyDockAll({ persist: false });
      });
    };

    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      const endedKind = drag.kind;
      drag.target.releasePointerCapture(e.pointerId);

      if (endedKind === 'restore')
        host.classList.remove('dragging-restore');
      else 
        host.classList.remove(endedKind === 'pip' ? 'dragging' : 'dragging-preview');

      const didMove = drag.moved;
      drag = null;

      if (didMove) {
        persistDock();
        if (endedKind === 'restore')
          suppressRestoreClick = true;
        else 
          suppressToggleClick = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const bindDragTarget = (node) => {
      on(node, 'pointerdown', beginDrag);
      on(node, 'pointermove', moveDrag);
      on(node, 'pointerup', endDrag);
      on(node, 'pointercancel', endDrag);
    };

    bindDragTarget(toggle);
    bindDragTarget(pipRestoreButton);

    // =========================
    // Events (toggle / close / restore)
    // =========================
    on(toggle, 'click', (e) => {
      if (suppressToggleClick) {
        e.preventDefault();
        suppressToggleClick = false;
        return;
      }
      toggleView();
    });

    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleView();
      }
    });

    on(pipCloseButton, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized())
        setPrettyHidden(true);
      else
        setPreviewHidden(true);
    });

    on(pipCloseButton, 'pointerdown', (e) => {
      e.stopPropagation();
    });

    on(pipRestoreButton, 'click', (e) => {
      if (suppressRestoreClick) {
        e.preventDefault();
        suppressRestoreClick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized()) 
        setPrettyHidden(false);
      else 
        setPreviewHidden(false);
    });

    // =========================
    // Lifecycle: load / sync / repaint
    // =========================
    const loadState = () => {
      loadDock();
      loadHidden();

      if (isPrettyHidden && !isMinimized())
        setMinimized(true);

      updateUI();
      repaintToDock();
    };

    loadState();

    on(window, 'storage-ready', () => {
      storageReady = true;
      loadState();
    });

    const onViewportChange = () => repaintToDock();

    on(window, 'resize', onViewportChange);

    if (window.visualViewport) {
      on(window.visualViewport, 'resize', onViewportChange);
      on(window.visualViewport, 'scroll', onViewportChange);
    }

    // initial preview
    setTimeout(updatePreview, 100);

    // initial minimized option
    if (${startMinimized}) {
      setMinimized(true);
      repaintToDock();
      void iframe.offsetWidth;
      updateUI();
    }
  } catch (err) {
    console.error('Failed to initialize Nuxt error overlay:', err);
  }
})();
`;
}
function generateErrorOverlayHTML(html, options) {
	const nonce = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
	const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
	return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
}

//#region src/runtime/handlers/error.ts
var error_default = async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) return;
	const defaultRes = await defaultHandler(error, event, { json: true });
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) defaultRes.body.stack = defaultRes.body.stack.join("\n");
	const errorObject = defaultRes.body;
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	const reqHeaders = getRequestHeaders(event);
	const res = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"] ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) return;
	if (!res) {
		const { template } = await Promise.resolve().then(function () { return error500; });
		errorObject.description = errorObject.message;
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	if (!globalThis._importMeta_.test && typeof html === "string") {
		const prettyResponse = await defaultHandler(error, event, { json: false });
		if (typeof prettyResponse.body === "string") return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= status && status < 500 })}</body>`));
	}
	return send(event, html);
};

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [error_default, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script$1 = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _u8AzuU2p0q1XhJCaNCuaoZPZ7d4X9oy1i9ylWeC641Q = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script$1}<\/script>`);
  });
});

//#region src/runtime/diagnostics.ts
const ansi = (open, close) => (s) => `\x1B[${open}m${s}\x1B[${close}m`;
const colors = {
	red: ansi(31, 39),
	yellow: ansi(33, 39),
	cyan: ansi(36, 39),
	gray: ansi(90, 39),
	bold: ansi(1, 22),
	dim: ansi(2, 22)
};
/**
* E8xxx
* Nitro server runtime (SSR rendering / dev server) diagnostics.
*/
const docsBase = (code) => `https://nuxt.com/docs/4.x/errors/${code.replace("NUXT_", "").toLowerCase()}`;
const serverDiagnostics = /* #__PURE__ */ defineDiagnostics({
	docsBase,
	reporters: [/* @__PURE__ */ createConsoleReporter({ formatter: ansiFormatter(colors) } )],
	codes: {
		NUXT_E8001: {
			why: (p) => `\`render:html\` mutated \`body\`/\`bodyAppend\` while streaming (\`${p.path}\`). These fields are silently dropped because the body is about to stream.`,
			fix: "Use the `render:html:close` hook instead.",
			docs: false
		},
		NUXT_E8002: {
			why: (p) => `SSR streaming committed the response before render completed (\`${p.path}\`). The following mutations did not reach the client and were dropped:\n  - ${p.mutations}`,
			fix: (p) => `Move the mutation into a plugin (which runs before the shell is flushed), or opt this route out of streaming with \`routeRules: { '${p.path}': { streaming: false } }\` or the \`render:route\` hook.`,
			docs: false
		},
		NUXT_E8003: {
			why: (p) => `Failed to stringify dev server logs.${p.error ? ` Received \`${p.error}\`.` : ""}`,
			fix: "You can define your own reducer/reviver for rich types following the instructions in `https://nuxt.com/docs/4.x/api/composables/use-nuxt-app#payload`.",
			docs: false
		},
		NUXT_E8004: {
			why: "The server bundle is not available.",
			fix: "Ensure the Nuxt build completed successfully and the server entry was emitted by your builder.",
			docs: false
		}
	}
});

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[],"style":[],"script":[],"noscript":[]};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt","class":"isolate"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

const rootDir = "D:/Project/Nuxt/eskulhub-prototype/eskulhub-prototype";

//#region src/runtime/plugins/dev-server-logs.ts
const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : void 0,
	URL: (data) => data instanceof URL ? data.toString() : void 0,
	Symbol: (data) => typeof data === "symbol" ? data.description ?? "" : void 0
};
const asyncContext = getContext("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
var dev_server_logs_default = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) return;
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) return;
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) continue;
			if (EXCLUDE_TRACE_RE.test(entry.source)) continue;
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			filename,
			stack: trace
		};
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) return;
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) return;
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			serverDiagnostics.NUXT_E8003({
				error: e instanceof Error ? e.toString() : void 0,
				cause: e
			});
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
}

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"system\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _N84HAdnMyN652jWmRXSupzfRrVzOnNizHsEcvgi84Y = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _u8AzuU2p0q1XhJCaNCuaoZPZ7d4X9oy1i9ylWeC641Q,
dev_server_logs_default,
_N84HAdnMyN652jWmRXSupzfRrVzOnNizHsEcvgi84Y,
_wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw
];

const assets = {};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_fonts/":{"maxAge":31536000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _QOndmb = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

const SECRET = process.env.JWT_SECRET || "studentbase-jwt-secret-key-2026";
function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}
function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

var _a;
const globalForPrisma = globalThis;
const prisma = (_a = globalForPrisma.prisma) != null ? _a : new PrismaClient();
{
  globalForPrisma.prisma = prisma;
}

const publicRoutes = ["/api/auth/login", "/api/auth/register", "/api/auth/check-nis"];
const _mbJV0r = defineEventHandler(async (event) => {
  var _a;
  const path = event.path || event.node.req.url || "";
  if (publicRoutes.some((r) => path.startsWith(r))) {
    return;
  }
  if (!path.startsWith("/api/")) {
    return;
  }
  const authHeader = getHeader(event, "authorization");
  let token = null;
  if (authHeader == null ? void 0 : authHeader.startsWith("Bearer ")) token = authHeader.slice(7);
  if (!token) token = getCookie(event, "eh_token") || null;
  if (!token) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  try {
    const payload = verifyToken(token);
    event.context.auth = payload;
    const role = payload.role;
    if (path.startsWith("/api/admin/") && role !== "admin" && role !== "super_admin") {
      throw createError({ statusCode: 403, message: "Anda tidak memiliki akses ke menu ini." });
    }
    if (path.startsWith("/api/operator/") && role !== "admin" && role !== "super_admin" && role !== "operator") {
      if (path.startsWith("/api/operator/board") || path.startsWith("/api/operator/upload")) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { permissions: { select: { permissionId: true } } }
        });
        const perms = (_a = user == null ? void 0 : user.permissions.map((p) => p.permissionId)) != null ? _a : [];
        if (perms.includes("structure")) return;
      }
      throw createError({ statusCode: 403, message: "Anda tidak memiliki akses ke menu ini." });
    }
  } catch (err) {
    if (err == null ? void 0 : err.statusCode) throw err;
    throw createError({ statusCode: 401, message: "Token tidak valid atau kadaluarsa" });
  }
});

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

function buildAssetsDir() {
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

function toInstitutionSummary(inst) {
  return {
    id: inst.id,
    name: inst.name,
    npsn: inst.npsn,
    address: inst.address,
    phone: inst.phone,
    email: inst.email,
    website: inst.website,
    headmaster: inst.headmaster,
    activeYear: inst.activeYear,
    activeSemester: inst.activeSemester,
    logo: inst.logo,
    themeColor: inst.themeColor
  };
}

async function syncNotifications(ctx) {
  const { userId, institutionId, role, studentId } = ctx;
  let memberEkskulIds = [];
  if (role === "student" && studentId) {
    const members = await prisma.member.findMany({
      where: { studentId, status: "active" },
      select: { extracurricularId: true }
    });
    memberEkskulIds = members.map((m) => m.extracurricularId);
  }
  const ekskulFilter = role === "student" && memberEkskulIds.length ? { extracurricularId: { in: memberEkskulIds } } : { institutionId };
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3);
  const today = /* @__PURE__ */ new Date();
  const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
  const todayName = dayNames[(today.getDay() + 6) % 7];
  const feedLink = role === "student" ? "/siswa/feed" : role === "operator" ? "/operator/news" : "/admin/feed";
  const achLink = studentId ? "/siswa/achievements" : role === "operator" ? "/operator" : "/admin/achievements";
  const schedLink = studentId ? "/siswa/schedule" : role === "operator" ? "/operator/schedule" : "/admin/schedule";
  const pollLink = studentId ? "/siswa/polls" : role === "operator" ? "/operator/polls" : "/admin/polls";
  const newsLink = studentId ? "/siswa/blog" : role === "operator" ? "/operator/news" : "/admin/news";
  const [posts, achievements, schedules, polls, newsList] = await Promise.all([
    prisma.feedPost.findMany({
      where: { institutionId, createdAt: { gte: sevenDaysAgo } },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    // Prestasi: siswa → miliknya; operator/admin → semua di instansi (7 hari terakhir)
    prisma.achievement.findMany({
      where: studentId ? { studentId, createdAt: { gte: sevenDaysAgo } } : { student: { institutionId }, createdAt: { gte: sevenDaysAgo } },
      include: { student: { select: { name: true } }, extracurricular: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    prisma.schedule.findMany({
      where: { ...ekskulFilter, day: todayName },
      include: { extracurricular: { select: { name: true } } }
    }),
    prisma.poll.findMany({
      where: { institutionId, active: true, endDate: { gte: /* @__PURE__ */ new Date() } },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.news.findMany({
      where: { ...ekskulFilter, isPublic: true, createdAt: { gte: sevenDaysAgo } },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 5
    })
  ]);
  const entries = [];
  for (const p of posts) {
    const typeLabel = p.type === "announcement" ? "mengumumkan" : p.type === "achievement" ? "mengabarkan prestasi" : p.type === "poll" ? "membuat voting" : p.type === "gallery" ? "mengunggah galeri" : "menjadwalkan";
    entries.push({
      key: `feed:${p.id}:${userId}`,
      type: "feed",
      title: `${p.extracurricular.name} ${typeLabel}`,
      body: p.title,
      link: feedLink
    });
  }
  for (const a of achievements) {
    entries.push({
      key: `achievement:${a.id}:${userId}`,
      type: "achievement",
      title: "Prestasi baru tercatat",
      body: `${a.student.name}: ${a.title} (${a.extracurricular.name})`,
      link: achLink
    });
  }
  for (const s of schedules) {
    const dateStr = today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    entries.push({
      key: `schedule:${s.id}:${todayName}:${userId}`,
      type: "schedule",
      title: `Jadwal ekskul hari ini: ${dateStr}`,
      body: `${s.extracurricular.name} \xB7 ${s.timeStart}${s.timeEnd ? ` - ${s.timeEnd}` : ""} \xB7 ${s.location}${s.mandatory ? " (wajib hadir)" : " (tidak wajib)"}`,
      link: schedLink
    });
  }
  for (const p of polls) {
    entries.push({
      key: `poll:${p.id}:${userId}`,
      type: "poll",
      title: `Voting aktif: ${p.extracurricular.name}`,
      body: p.question,
      link: pollLink
    });
  }
  for (const n of newsList) {
    entries.push({
      key: `news:${n.id}:${userId}`,
      type: "news",
      title: `Pengumuman ${n.extracurricular.name}`,
      body: n.title,
      link: newsLink
    });
  }
  for (const e of entries) {
    await prisma.notification.upsert({
      where: { key: e.key },
      update: { title: e.title, body: e.body, link: e.link },
      create: {
        key: e.key,
        userId,
        institutionId,
        type: e.type,
        title: e.title,
        body: e.body,
        link: e.link
      }
    });
  }
  return entries.length;
}

const TYPE_LABELS = {
  juara: "Juara",
  sertifikat: "Sertifikat",
  partisipasi: "Partisipasi",
  organisasi: "Organisasi"
};
const LEVEL_LABELS = {
  sekolah: "Sekolah",
  kecamatan: "Kecamatan",
  kota: "Kota",
  provinsi: "Provinsi",
  nasional: "Nasional"
};
async function studentsReport(instId) {
  const students = await prisma.student.findMany({
    where: { institutionId: instId },
    orderBy: [{ class: "asc" }, { nis: "asc" }]
  });
  const map = /* @__PURE__ */ new Map();
  for (const s of students) {
    const key = s.class;
    if (!map.has(key)) map.set(key, { className: key, total: 0, male: 0, female: 0, registered: 0 });
    const c = map.get(key);
    c.total++;
    if (s.gender === "L") c.male++;
    if (s.gender === "P") c.female++;
    if (s.accountStatus === "registered") c.registered++;
  }
  return {
    total: students.length,
    male: students.filter((s) => s.gender === "L").length,
    female: students.filter((s) => s.gender === "P").length,
    registered: students.filter((s) => s.accountStatus === "registered").length,
    perClass: [...map.values()].sort((a, b) => a.className.localeCompare(b.className, void 0, { numeric: true })),
    students: students.map((s) => ({
      nis: s.nis,
      name: s.name,
      class: s.class,
      gender: s.gender === "L" ? "Laki-laki" : "Perempuan",
      phone: s.phone,
      accountStatus: s.accountStatus === "registered" ? "Sudah daftar" : "Belum daftar"
    }))
  };
}
async function attendanceReport(instId) {
  const records = await prisma.attendanceRecord.findMany({
    where: { extracurricular: { institutionId: instId } },
    select: { status: true, extracurricular: { select: { name: true } } }
  });
  const map = /* @__PURE__ */ new Map();
  for (const r of records) {
    const key = r.extracurricular.name;
    if (!map.has(key)) map.set(key, { ekskul: key, hadir: 0, izin: 0, alpha: 0, total: 0 });
    const e = map.get(key);
    e.total++;
    if (r.status === "hadir") e.hadir++;
    else if (r.status === "izin") e.izin++;
    else if (r.status === "alpha") e.alpha++;
  }
  const total = records.length;
  const hadir = records.filter((r) => r.status === "hadir").length;
  return {
    totalRecords: total,
    hadir,
    izin: records.filter((r) => r.status === "izin").length,
    alpha: records.filter((r) => r.status === "alpha").length,
    rate: total ? Math.round(hadir / total * 100) : 0,
    perEkskul: [...map.values()].map((e) => ({ ...e, rate: e.total ? Math.round(e.hadir / e.total * 100) : 0 })).sort((a, b) => a.ekskul.localeCompare(b.ekskul))
  };
}
function attendanceWhere(instId, filters = {}) {
  const date = filters.start || filters.end ? {
    ...filters.start ? { gte: /* @__PURE__ */ new Date(filters.start + "T00:00:00") } : {},
    ...filters.end ? { lte: /* @__PURE__ */ new Date(filters.end + "T23:59:59.999") } : {}
  } : void 0;
  return {
    extracurricular: {
      institutionId: instId,
      ...filters.ekskul ? { name: filters.ekskul } : {}
    },
    ...date ? { date } : {}
  };
}
async function attendanceRows(instId, filters = {}, opts = {}) {
  const where = attendanceWhere(instId, filters);
  const [total, rows] = await Promise.all([
    prisma.attendanceRecord.count({ where }),
    prisma.attendanceRecord.findMany({
      where,
      include: {
        student: { select: { name: true, class: true } },
        extracurricular: { select: { name: true } }
      },
      orderBy: [{ extracurricular: { name: "asc" } }, { date: "desc" }],
      skip: opts.skip,
      take: opts.take
    })
  ]);
  return {
    total,
    records: rows.map((r) => ({
      date: r.date,
      ekskul: r.extracurricular.name,
      student: r.student.name,
      class: r.student.class,
      status: r.status,
      time: r.time,
      notes: r.notes
    }))
  };
}
async function achievementsReport(instId) {
  const achievements = await prisma.achievement.findMany({
    where: { extracurricular: { institutionId: instId } },
    include: {
      student: { select: { name: true, class: true } },
      extracurricular: { select: { name: true } }
    },
    orderBy: { date: "desc" }
  });
  const byType = { juara: 0, sertifikat: 0, partisipasi: 0, organisasi: 0 };
  const byLevel = { sekolah: 0, kecamatan: 0, kota: 0, provinsi: 0, nasional: 0 };
  for (const a of achievements) {
    if (a.type in byType) byType[a.type]++;
    if (a.level in byLevel) byLevel[a.level]++;
  }
  return {
    total: achievements.length,
    byType,
    byLevel,
    achievements: achievements.map((a) => {
      var _a, _b;
      return {
        date: a.date,
        title: a.title,
        student: a.student.name,
        class: a.student.class,
        ekskul: a.extracurricular.name,
        type: (_a = TYPE_LABELS[a.type]) != null ? _a : a.type,
        level: (_b = LEVEL_LABELS[a.level]) != null ? _b : a.level
      };
    })
  };
}
async function financeReport(instId) {
  const [members, ekskuls, students] = await Promise.all([
    prisma.member.count({ where: { status: "active", student: { institutionId: instId } } }),
    prisma.extracurricular.count({ where: { institutionId: instId } }),
    prisma.student.count({ where: { institutionId: instId } })
  ]);
  return {
    available: false,
    message: "Modul keuangan (iuran & anggaran) belum tersedia di sistem ini.",
    context: { members, ekskuls, students }
  };
}
async function annualReport(instId) {
  var _a, _b, _c;
  const [
    inst,
    students,
    teachers,
    ekskuls,
    members,
    schedules,
    sessions,
    polls,
    news,
    galleries,
    achievements,
    attendanceRecords,
    hadir
  ] = await Promise.all([
    prisma.institution.findUnique({ where: { id: instId } }),
    prisma.student.count({ where: { institutionId: instId } }),
    prisma.teacher.count({ where: { institutionId: instId } }),
    prisma.extracurricular.count({ where: { institutionId: instId } }),
    prisma.member.count({ where: { status: "active", student: { institutionId: instId } } }),
    prisma.schedule.count({ where: { institutionId: instId } }),
    prisma.attendanceSession.count({ where: { extracurricular: { institutionId: instId } } }),
    prisma.poll.count({ where: { institutionId: instId } }),
    prisma.news.count({ where: { institutionId: instId } }),
    prisma.gallery.count({ where: { institutionId: instId } }),
    prisma.achievement.count({ where: { extracurricular: { institutionId: instId } } }),
    prisma.attendanceRecord.count({ where: { extracurricular: { institutionId: instId } } }),
    prisma.attendanceRecord.count({ where: { extracurricular: { institutionId: instId }, status: "hadir" } })
  ]);
  return {
    institutionName: (_a = inst == null ? void 0 : inst.name) != null ? _a : "",
    year: (_b = inst == null ? void 0 : inst.activeYear) != null ? _b : "",
    semester: (_c = inst == null ? void 0 : inst.activeSemester) != null ? _c : "",
    students,
    teachers,
    ekskuls,
    members,
    schedules,
    sessions,
    attendanceRecords,
    attendanceRate: attendanceRecords ? Math.round(hadir / attendanceRecords * 100) : 0,
    achievements,
    polls,
    news,
    galleries
  };
}
const reportBuilders = {
  students: studentsReport,
  attendance: attendanceReport,
  achievements: achievementsReport,
  finance: financeReport,
  annual: annualReport
};
function isReportType(t) {
  return t in reportBuilders;
}

const SCHOOL_TZ = {
  WIB: { iana: "Asia/Jakarta", offset: 7 },
  WITA: { iana: "Asia/Makassar", offset: 8 },
  WIT: { iana: "Asia/Jayapura", offset: 9 }
};
function schoolZoneFromLongitude(longitude) {
  if (typeof longitude === "number" && Number.isFinite(longitude)) {
    if (longitude < 115) return "WIB";
    if (longitude < 125) return "WITA";
    return "WIT";
  }
  return "WIB";
}
function formatSchoolTimeServer(date, longitude, options = {}) {
  const zone = schoolZoneFromLongitude(longitude);
  try {
    return new Intl.DateTimeFormat("id-ID", { ...options, timeZone: SCHOOL_TZ[zone].iana }).format(date);
  } catch {
    return date.toLocaleString("id-ID", options);
  }
}

async function getOperatorScope(event) {
  var _a;
  const auth = event.context.auth;
  if (!auth) return { isScoped: false, extracurricularId: null };
  if (auth.role === "admin" || auth.role === "super_admin") {
    return { isScoped: false, extracurricularId: null };
  }
  if (auth.role === "operator" && auth.userId) {
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { extracurricularId: true }
    });
    return { isScoped: true, extracurricularId: (_a = user == null ? void 0 : user.extracurricularId) != null ? _a : null };
  }
  return { isScoped: false, extracurricularId: null };
}
function assertScope(scope, extracurricularId, message) {
  if (!scope.isScoped) return;
  if (!extracurricularId) {
    throw createError({ statusCode: 400, message: "Ekskul wajib diisi." });
  }
  if (scope.extracurricularId !== extracurricularId) {
    throw createError({
      statusCode: 403,
      message: "Anda hanya dapat mengelola data ekskul Anda sendiri."
    });
  }
}
function scopeFilter(scope, queryEkskulId) {
  var _a;
  if (scope.isScoped) {
    return { extracurricularId: (_a = scope.extracurricularId) != null ? _a : "" };
  }
  return queryEkskulId ? { extracurricularId: String(queryEkskulId) } : {};
}
function scopeRelationFilter(scope) {
  var _a;
  if (scope.isScoped) {
    return { id: (_a = scope.extracurricularId) != null ? _a : "" };
  }
  return {};
}

const warnOnceSet = /* @__PURE__ */ new Set();
const DEFAULT_ENDPOINT = "https://api.iconify.design";
function getInstallCommand(pkg) {
  const ua = process.env.npm_config_user_agent || "";
  if (ua.startsWith("pnpm")) return `pnpm add -D ${pkg}`;
  if (ua.startsWith("yarn")) return `yarn add -D ${pkg}`;
  if (ua.startsWith("bun")) return `bun add -D ${pkg}`;
  return `npm i -D ${pkg}`;
}
const _4hV7Jn = defineCachedEventHandler(async (event) => {
  const options = useAppConfig().icon;
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName && Object.hasOwn(collections, collectionName) ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT;
  const icons = String(parseQuery(parsePath(event.path).search).icons || "").split(",");
  if (!collectionName) return createError({ status: 400, message: "No collection specified" });
  if (!icons.length) return createError({ status: 400, message: "No icons specified" });
  if (!collection && true && !warnOnceSet.has(collectionName) && apiEndPoint === DEFAULT_ENDPOINT) {
    consola$1.warn([
      `[Icon] Collection \`${collectionName}\` is not found locally`,
      `We suggest to install it via \`${getInstallCommand(`@iconify-json/${collectionName}`)}\` to provide the best end-user experience.`
    ].join("\n"));
    warnOnceSet.add(collectionName);
  }
  if (collection) {
    const data = getIcons(
      collection,
      icons
    );
    consola$1.debug(`[Icon] serving ${icons.map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
    return data;
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL(`./${collectionName}.json?icons=${icons.join(",")}`, apiEndPoint);
    consola$1.debug(`[Icon] fetching ${icons.map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola$1.error(e);
      if (e.status === 404)
        return createError({ status: 404 });
      else
        return createError({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError({ status: 404 });
}, {
  group: "nuxt",
  name: "icon",
  getKey(event) {
    const collection = event.context.params?.collection?.replace(/\.json$/, "") || "unknown";
    const icons = String(parseQuery(parsePath(event.path).search).icons || "").split(",");
    return `${collection}_${icons[0]}_${icons.length}_${hash$1(icons.join(","))}`;
  },
  swr: true,
  maxAge: 60 * 60 * 24 * 7
  // 1 week
});

//#region ../nuxt/src/app/island-hash.ts
/**
* Compute the `hashId` segment embedded in an island URL (`/__nuxt_island/<Name>_<hashId>.json`).
*
* The hash binds the response to the requested `(name, props, context, source)` tuple, so the
* server can reject requests whose URL hash does not match the supplied query/body. Use this
* from island clients if you need to ensure a hash stays in step with Nuxt's implementation.
*
* `props` may be passed either as the raw props object or as the JSON string that will be sent
* over the wire; the two produce the same hash when the round-trip is identity.
*
* @since 4.5.0
*/
function getIslandHash(input) {
	const props = typeof input.props === "string" ? parseSerializedProps(input.props) : input.props ?? {};
	return hash$1([
		input.name,
		props,
		input.context ?? {},
		input.source
	]).replace(/[-_]/g, "");
}
function parseSerializedProps(serializedProps) {
	try {
		return JSON.parse(serializedProps);
	} catch {
		return serializedProps;
	}
}

const NUXT_SSR_STREAMING = false;

const payloadCache = useStorage("cache:nuxt:payload") ;

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

const VueResolver = /* @__PURE__ */ Object.assign(
  (_, value) => isRef(value) ? toValue(value) : value,
  // identity for plain non-reactive values, so the SSR default init entry
  // keeps its precomputed fast path (see unhead/server createHead)
  { _static: true }
);

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const legacyPlugins = [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin];

const unheadOptions = {
  disableDefaults: true,
  plugins: legacyPlugins,
};

function encodeEventPath(path) {
	const queryIndex = path.indexOf("?");
	if (queryIndex === -1) return encodePath(path);
	return encodePath(path.slice(0, queryIndex)) + path.slice(queryIndex);
}
function createSSRContext(event) {
	const url = encodeEventPath(event.path);
	const ssrContext = {
		url,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: true,
		head: createHead(unheadOptions),
		error: false,
		nuxt: void 0,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: /* @__PURE__ */ new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

//#region src/runtime/utils/renderer/cache.ts
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) res = fn().catch((err) => {
			res = null;
			throw err;
		});
		return res;
	};
}

//#region src/runtime/utils/renderer/build-files.ts
globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => Promise.resolve().then(function () { return entry; }).then((r) => r.default || r);
const getClientManifest = () => Promise.resolve().then(function () { return manifest$1; }).then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) throw serverDiagnostics.NUXT_E8004();
	const renderer = createRenderer(createSSRApp, {
		precomputed: void 0 ,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		if (process.env.NUXT_VITE_NODE_OPTIONS) renderer.rendererContext.updateManifest(await getClientManifest());
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = void 0 ;
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
			const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
			return APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG + (r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "");
		}
	});
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= /* @__PURE__ */ new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function getRenderer(ssrContext) {
	return getSPARenderer() ;
}
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

//#region src/runtime/utils/renderer/inline-styles.ts
async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = /* @__PURE__ */ new Set();
	const promises = [];
	for (const mod of usedModules) if (mod in styleMap && styleMap[mod]) promises.push(styleMap[mod]());
	for (const styles of await Promise.all(promises)) for (const style of styles) inlinedStyles.add(style);
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

//#region src/runtime/utils/renderer/islands.ts
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
/**
* remove the root node from the html body
*/
function getServerComponentHTML(body) {
	return body.match(ROOT_NODE_REGEX)?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) return;
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) response[name] = {
		...slot,
		fallback: ssrContext.teleports?.[`island-fallback=${name}`]
	};
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) return;
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) continue;
			slots[slot] = value;
		}
	}
	return slots;
}
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) return html;
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) continue;
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) continue;
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
		}
	}
	return html;
}

//#region src/runtime/handlers/island.ts
const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const handler$1 = defineEventHandler(async (event) => {
	const nitroApp = useNitroApp();
	setResponseHeaders(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	const renderer = await getSSRRenderer();
	const renderResult = await (renderer.renderToString(ssrContext)).catch(async (err) => {
		if (ssrContext["~renderResponse"] && err?.message === "skipping render") return {};
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (ssrContext["~renderResponse"]) {
		const response = ssrContext["~renderResponse"];
		if (response.statusCode && response.statusCode >= 400) throw createError({
			statusCode: response.statusCode,
			statusMessage: response.statusMessage
		});
		return returnIslandResponse(event, response);
	}
	if (ssrContext.payload?.error) throw ssrContext.payload.error;
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	if (inlinedStyles.length) ssrContext.head.push({ style: inlinedStyles });
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			if ("inline" in getQuery(resource.file)) continue;
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) link.push({
				rel: "stylesheet",
				href: renderer.rendererContext.buildAssetsURL(resource.file),
				crossorigin: ""
			});
		}
		if (link.length) ssrContext.head.push({ link });
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) for (const [key, value] of Object.entries(walkResolver(entry.input, VueResolver))) {
		const currentValue = islandHead[key];
		if (Array.isArray(currentValue)) currentValue.push(...value);
		else islandHead[key] = value;
	}
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
});
function returnIslandResponse(event, response) {
	for (const header in response.headers || {}) setResponseHeader(event, header, response.headers[header]);
	if (response.statusCode) setResponseStatus(event, response.statusCode, response.statusMessage);
	return response.body;
}
const ISLAND_PATH_PREFIX = "/__nuxt_island/";
const VALID_COMPONENT_NAME_RE = /^[a-z][\w.-]*$/i;
async function getIslandContext(event) {
	let url = event.path || "";
	url.replace(/\?.*$/, "");
	if (!url.startsWith(ISLAND_PATH_PREFIX)) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island request path"
	});
	const componentParts = url.substring(15).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
	const componentName = componentParts.join("_");
	if (!componentName || !VALID_COMPONENT_NAME_RE.test(componentName)) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island component name"
	});
	const rawContext = event.method === "GET" ? getQuery$1(event) : await readBody(event);
	const serializedProps = typeof rawContext?.props === "string" ? rawContext.props : "{}";
	const clientContext = {};
	if (rawContext && typeof rawContext === "object") {
		for (const key in rawContext) if (key !== "props") clientContext[key] = rawContext[key];
	}
	const expectedHash = getIslandHash({
		name: componentName,
		props: serializedProps,
		context: clientContext
	});
	if (!hashId || hashId !== expectedHash) throw createError({
		statusCode: 400,
		statusMessage: "Invalid island request hash"
	});
	const parsedProps = destr$1(serializedProps) || {};
	return {
		url: typeof rawContext?.url === "string" ? rawContext.url : "/",
		id: hashId,
		name: componentName,
		props: parsedProps,
		slots: {},
		components: {}
	};
}

const _lazy_M6j_CE = () => Promise.resolve().then(function () { return _id__delete$v; });
const _lazy_ZmzAGQ = () => Promise.resolve().then(function () { return _id__put$t; });
const _lazy_GkcuMu = () => Promise.resolve().then(function () { return dashboard_get$5; });
const _lazy_y0GAB_ = () => Promise.resolve().then(function () { return extracurriculars_get$1; });
const _lazy_OsM_rR = () => Promise.resolve().then(function () { return extracurriculars_post$1; });
const _lazy_kvSCWt = () => Promise.resolve().then(function () { return _id__delete$t; });
const _lazy_aAyNCK = () => Promise.resolve().then(function () { return _id__put$r; });
const _lazy_JJfYyk = () => Promise.resolve().then(function () { return _id__delete$r; });
const _lazy_3H3q8p = () => Promise.resolve().then(function () { return news_get$5; });
const _lazy_UoNxsq = () => Promise.resolve().then(function () { return _id__put$p; });
const _lazy_5aFyY0 = () => Promise.resolve().then(function () { return reports_get$1; });
const _lazy_7A91OO = () => Promise.resolve().then(function () { return attendanceDetail_get$1; });
const _lazy_iH1kzF = () => Promise.resolve().then(function () { return export_get$3; });
const _lazy_ovu8QA = () => Promise.resolve().then(function () { return settings_get$3; });
const _lazy_n1WhOZ = () => Promise.resolve().then(function () { return settings_put$1; });
const _lazy_jzVAYG = () => Promise.resolve().then(function () { return students_get$1; });
const _lazy_s1xaBd = () => Promise.resolve().then(function () { return students_post$1; });
const _lazy_OwHfBa = () => Promise.resolve().then(function () { return _id__delete$p; });
const _lazy_2EPxiq = () => Promise.resolve().then(function () { return _id__put$n; });
const _lazy__Rs5YT = () => Promise.resolve().then(function () { return import_post$3; });
const _lazy_4siC7g = () => Promise.resolve().then(function () { return template_get$6; });
const _lazy_LpAwns = () => Promise.resolve().then(function () { return teachers_get$1; });
const _lazy_7U2ULz = () => Promise.resolve().then(function () { return teachers_post$1; });
const _lazy_AftDDy = () => Promise.resolve().then(function () { return _id__delete$n; });
const _lazy_5zrHJ3 = () => Promise.resolve().then(function () { return _id__put$l; });
const _lazy_XCgy6l = () => Promise.resolve().then(function () { return users_get$1; });
const _lazy_XY2Ejg = () => Promise.resolve().then(function () { return users_post$1; });
const _lazy_B4CnjL = () => Promise.resolve().then(function () { return _id__delete$l; });
const _lazy_I8VJbY = () => Promise.resolve().then(function () { return _id__put$j; });
const _lazy_GdYsR6 = () => Promise.resolve().then(function () { return export_get$1; });
const _lazy_hcAu2N = () => Promise.resolve().then(function () { return import_post$1; });
const _lazy_du_pRk = () => Promise.resolve().then(function () { return template_get$4; });
const _lazy_4zn2Uz = () => Promise.resolve().then(function () { return checkNis_post$1; });
const _lazy_j8kwxh = () => Promise.resolve().then(function () { return login_post$1; });
const _lazy_kEFERv = () => Promise.resolve().then(function () { return me_get$1; });
const _lazy_rxL8vS = () => Promise.resolve().then(function () { return register_post$1; });
const _lazy_FqtM53 = () => Promise.resolve().then(function () { return articles_get$3; });
const _lazy_p6w8kI = () => Promise.resolve().then(function () { return articles_post$1; });
const _lazy_PN7vBv = () => Promise.resolve().then(function () { return _id__delete$j; });
const _lazy_vnlgtU = () => Promise.resolve().then(function () { return _id__put$h; });
const _lazy_DQvr59 = () => Promise.resolve().then(function () { return views_get$1; });
const _lazy_DcZw45 = () => Promise.resolve().then(function () { return generateQr_post$1; });
const _lazy_UqqbhW = () => Promise.resolve().then(function () { return history_get$1; });
const _lazy_UjiqFa = () => Promise.resolve().then(function () { return mark_post$1; });
const _lazy_XcwDHw = () => Promise.resolve().then(function () { return session_post$1; });
const _lazy_C5QEQW = () => Promise.resolve().then(function () { return _id__get$3; });
const _lazy_pCenjZ = () => Promise.resolve().then(function () { return board_get$3; });
const _lazy_tjIBag = () => Promise.resolve().then(function () { return board_post$1; });
const _lazy_jo5Dd8 = () => Promise.resolve().then(function () { return _id__delete$h; });
const _lazy_MkLK0t = () => Promise.resolve().then(function () { return _id__put$f; });
const _lazy_7L8BJI = () => Promise.resolve().then(function () { return structure_get$1; });
const _lazy_5aFxsm = () => Promise.resolve().then(function () { return _id__put$d; });
const _lazy_5lM1M_ = () => Promise.resolve().then(function () { return dashboard_get$3; });
const _lazy_iQGBJx = () => Promise.resolve().then(function () { return logo_put$1; });
const _lazy_ygOWnu = () => Promise.resolve().then(function () { return gallery_get$3; });
const _lazy_DdELzG = () => Promise.resolve().then(function () { return gallery_post$1; });
const _lazy_OtkJPg = () => Promise.resolve().then(function () { return _id__delete$f; });
const _lazy__fnPlA = () => Promise.resolve().then(function () { return materials_get$3; });
const _lazy_9hOIiM = () => Promise.resolve().then(function () { return materials_post$1; });
const _lazy_D0biVg = () => Promise.resolve().then(function () { return _id__delete$d; });
const _lazy_I8h5Na = () => Promise.resolve().then(function () { return members_get$1; });
const _lazy_rQo6pd = () => Promise.resolve().then(function () { return members_post$1; });
const _lazy_ua6SgX = () => Promise.resolve().then(function () { return _id__delete$b; });
const _lazy_RU1jrV = () => Promise.resolve().then(function () { return _id__put$b; });
const _lazy_E_LUAl = () => Promise.resolve().then(function () { return news_get$3; });
const _lazy_wT7MBW = () => Promise.resolve().then(function () { return news_post$1; });
const _lazy_1txv1l = () => Promise.resolve().then(function () { return _id__delete$9; });
const _lazy_uhsyDR = () => Promise.resolve().then(function () { return _id__put$9; });
const _lazy_UfEwEx = () => Promise.resolve().then(function () { return polls_get$3; });
const _lazy_0qJg_i = () => Promise.resolve().then(function () { return polls_post$1; });
const _lazy_NQ5aHN = () => Promise.resolve().then(function () { return _id__delete$7; });
const _lazy_vwfFVE = () => Promise.resolve().then(function () { return _id__put$7; });
const _lazy_q8Ov47 = () => Promise.resolve().then(function () { return profile_get$1; });
const _lazy_RPvZcP = () => Promise.resolve().then(function () { return profile_put$3; });
const _lazy_7yvzT0 = () => Promise.resolve().then(function () { return schedule_get$3; });
const _lazy__DvnxQ = () => Promise.resolve().then(function () { return schedule_post$1; });
const _lazy_vkFzqu = () => Promise.resolve().then(function () { return _id__delete$5; });
const _lazy_xGbPXj = () => Promise.resolve().then(function () { return _id__put$5; });
const _lazy_AWY0Gn = () => Promise.resolve().then(function () { return upload_post$4; });
const _lazy_IO9ghD = () => Promise.resolve().then(function () { return settings_get$1; });
const _lazy_VjL6VO = () => Promise.resolve().then(function () { return reference_get$1; });
const _lazy_srePkx = () => Promise.resolve().then(function () { return upload_post$2; });
const _lazy_CKZHDH = () => Promise.resolve().then(function () { return achievements_get$1; });
const _lazy_GnrXyH = () => Promise.resolve().then(function () { return achievements_post$1; });
const _lazy_I9jPW0 = () => Promise.resolve().then(function () { return _id__delete$3; });
const _lazy_ENZzGy = () => Promise.resolve().then(function () { return _id__put$3; });
const _lazy_IuCMal = () => Promise.resolve().then(function () { return articles_get$1; });
const _lazy_Rn0lpZ = () => Promise.resolve().then(function () { return _slug__get$1; });
const _lazy_sePDyQ = () => Promise.resolve().then(function () { return attendance_get$1; });
const _lazy_0m4HRT = () => Promise.resolve().then(function () { return meetings_get$1; });
const _lazy_jiE_aB = () => Promise.resolve().then(function () { return scan_post$1; });
const _lazy_dpA6Wm = () => Promise.resolve().then(function () { return board_get$1; });
const _lazy_ttAlil = () => Promise.resolve().then(function () { return calendar_get$1; });
const _lazy_fbtTvN = () => Promise.resolve().then(function () { return calendar_post$1; });
const _lazy_vSpnGe = () => Promise.resolve().then(function () { return _id__delete$1; });
const _lazy_oeP0Xi = () => Promise.resolve().then(function () { return _id__put$1; });
const _lazy_S_mcUf = () => Promise.resolve().then(function () { return changePassword_post$1; });
const _lazy_v1txOS = () => Promise.resolve().then(function () { return dashboard_get$1; });
const _lazy_xuCk19 = () => Promise.resolve().then(function () { return feed_get$1; });
const _lazy_3SzLVy = () => Promise.resolve().then(function () { return comment_post$1; });
const _lazy_TGPr3m = () => Promise.resolve().then(function () { return like_post$1; });
const _lazy_8qEV2e = () => Promise.resolve().then(function () { return gallery_get$1; });
const _lazy_Dd2rvL = () => Promise.resolve().then(function () { return izin_get$1; });
const _lazy_b7pQcX = () => Promise.resolve().then(function () { return izin_post$1; });
const _lazy_RQTy20 = () => Promise.resolve().then(function () { return surat_get$1; });
const _lazy_xd2QqH = () => Promise.resolve().then(function () { return template_get$2; });
const _lazy_Bzjwqv = () => Promise.resolve().then(function () { return materials_get$1; });
const _lazy_1Ky6lv = () => Promise.resolve().then(function () { return news_get$1; });
const _lazy_Ts4ioA = () => Promise.resolve().then(function () { return _id__get$1; });
const _lazy_L6mQ1u = () => Promise.resolve().then(function () { return notifications_get$1; });
const _lazy_BFOj2G = () => Promise.resolve().then(function () { return read_post$1; });
const _lazy_Nk47xD = () => Promise.resolve().then(function () { return polls_get$1; });
const _lazy_X0qmU8 = () => Promise.resolve().then(function () { return vote_post$1; });
const _lazy_ug1Qhx = () => Promise.resolve().then(function () { return profile_put$1; });
const _lazy_gph_wx = () => Promise.resolve().then(function () { return schedule_get$1; });
const _lazy_esJ8lC = () => Promise.resolve().then(function () { return template_get; });
const _lazy_r8uiwg = () => Promise.resolve().then(function () { return translate_post$1; });
const _lazy_7PybwW = () => Promise.resolve().then(function () { return upload_post; });
const _lazy_0hFHMS = () => Promise.resolve().then(function () { return renderer; });

const handlers = [
  { route: '', handler: _QOndmb, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _mbJV0r, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/achievements/:id', handler: _lazy_M6j_CE, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/achievements/:id', handler: _lazy_ZmzAGQ, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/dashboard', handler: _lazy_GkcuMu, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/extracurriculars', handler: _lazy_y0GAB_, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/extracurriculars', handler: _lazy_OsM_rR, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/extracurriculars/:id', handler: _lazy_kvSCWt, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/extracurriculars/:id', handler: _lazy_aAyNCK, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/feed/:id', handler: _lazy_JJfYyk, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/news', handler: _lazy_3H3q8p, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/news/:id', handler: _lazy_UoNxsq, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/reports', handler: _lazy_5aFyY0, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/reports/attendance-detail', handler: _lazy_7A91OO, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/reports/export', handler: _lazy_iH1kzF, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings', handler: _lazy_ovu8QA, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/settings', handler: _lazy_n1WhOZ, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/students', handler: _lazy_jzVAYG, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/students', handler: _lazy_s1xaBd, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/students/:id', handler: _lazy_OwHfBa, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/students/:id', handler: _lazy_2EPxiq, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/students/import', handler: _lazy__Rs5YT, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/students/template', handler: _lazy_4siC7g, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/teachers', handler: _lazy_LpAwns, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/teachers', handler: _lazy_7U2ULz, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/teachers/:id', handler: _lazy_AftDDy, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/teachers/:id', handler: _lazy_5zrHJ3, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/users', handler: _lazy_XCgy6l, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/users', handler: _lazy_XY2Ejg, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/users/:id', handler: _lazy_B4CnjL, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/users/:id', handler: _lazy_I8VJbY, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/users/export', handler: _lazy_GdYsR6, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/users/import', handler: _lazy_hcAu2N, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/users/template', handler: _lazy_du_pRk, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/check-nis', handler: _lazy_4zn2Uz, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/login', handler: _lazy_j8kwxh, lazy: true, middleware: false, method: "post" },
  { route: '/api/auth/me', handler: _lazy_kEFERv, lazy: true, middleware: false, method: "get" },
  { route: '/api/auth/register', handler: _lazy_rxL8vS, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/articles', handler: _lazy_FqtM53, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/articles', handler: _lazy_p6w8kI, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/articles/:id', handler: _lazy_PN7vBv, lazy: true, middleware: false, method: "delete" },
  { route: '/api/operator/articles/:id', handler: _lazy_vnlgtU, lazy: true, middleware: false, method: "put" },
  { route: '/api/operator/articles/:id/views', handler: _lazy_DQvr59, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/attendance/generate-qr', handler: _lazy_DcZw45, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/attendance/history', handler: _lazy_UqqbhW, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/attendance/mark', handler: _lazy_UjiqFa, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/attendance/session', handler: _lazy_XcwDHw, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/attendance/session/:id', handler: _lazy_C5QEQW, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/board', handler: _lazy_pCenjZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/board', handler: _lazy_tjIBag, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/board/:id', handler: _lazy_jo5Dd8, lazy: true, middleware: false, method: "delete" },
  { route: '/api/operator/board/:id', handler: _lazy_MkLK0t, lazy: true, middleware: false, method: "put" },
  { route: '/api/operator/board/structure', handler: _lazy_7L8BJI, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/board/structure/:id', handler: _lazy_5aFxsm, lazy: true, middleware: false, method: "put" },
  { route: '/api/operator/dashboard', handler: _lazy_5lM1M_, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/extracurricular/logo', handler: _lazy_iQGBJx, lazy: true, middleware: false, method: "put" },
  { route: '/api/operator/gallery', handler: _lazy_ygOWnu, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/gallery', handler: _lazy_DdELzG, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/gallery/:id', handler: _lazy_OtkJPg, lazy: true, middleware: false, method: "delete" },
  { route: '/api/operator/materials', handler: _lazy__fnPlA, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/materials', handler: _lazy_9hOIiM, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/materials/:id', handler: _lazy_D0biVg, lazy: true, middleware: false, method: "delete" },
  { route: '/api/operator/members', handler: _lazy_I8h5Na, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/members', handler: _lazy_rQo6pd, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/members/:id', handler: _lazy_ua6SgX, lazy: true, middleware: false, method: "delete" },
  { route: '/api/operator/members/:id', handler: _lazy_RU1jrV, lazy: true, middleware: false, method: "put" },
  { route: '/api/operator/news', handler: _lazy_E_LUAl, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/news', handler: _lazy_wT7MBW, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/news/:id', handler: _lazy_1txv1l, lazy: true, middleware: false, method: "delete" },
  { route: '/api/operator/news/:id', handler: _lazy_uhsyDR, lazy: true, middleware: false, method: "put" },
  { route: '/api/operator/polls', handler: _lazy_UfEwEx, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/polls', handler: _lazy_0qJg_i, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/polls/:id', handler: _lazy_NQ5aHN, lazy: true, middleware: false, method: "delete" },
  { route: '/api/operator/polls/:id', handler: _lazy_vwfFVE, lazy: true, middleware: false, method: "put" },
  { route: '/api/operator/profile', handler: _lazy_q8Ov47, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/profile', handler: _lazy_RPvZcP, lazy: true, middleware: false, method: "put" },
  { route: '/api/operator/schedule', handler: _lazy_7yvzT0, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/schedule', handler: _lazy__DvnxQ, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/schedule/:id', handler: _lazy_vkFzqu, lazy: true, middleware: false, method: "delete" },
  { route: '/api/operator/schedule/:id', handler: _lazy_xGbPXj, lazy: true, middleware: false, method: "put" },
  { route: '/api/operator/upload', handler: _lazy_AWY0Gn, lazy: true, middleware: false, method: "post" },
  { route: '/api/settings', handler: _lazy_IO9ghD, lazy: true, middleware: false, method: "get" },
  { route: '/api/shared/reference', handler: _lazy_VjL6VO, lazy: true, middleware: false, method: "get" },
  { route: '/api/shared/upload', handler: _lazy_srePkx, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/achievements', handler: _lazy_CKZHDH, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/achievements', handler: _lazy_GnrXyH, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/achievements/:id', handler: _lazy_I9jPW0, lazy: true, middleware: false, method: "delete" },
  { route: '/api/siswa/achievements/:id', handler: _lazy_ENZzGy, lazy: true, middleware: false, method: "put" },
  { route: '/api/siswa/articles', handler: _lazy_IuCMal, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/articles/:slug', handler: _lazy_Rn0lpZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/attendance', handler: _lazy_sePDyQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/attendance/meetings', handler: _lazy_0m4HRT, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/attendance/scan', handler: _lazy_jiE_aB, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/board', handler: _lazy_dpA6Wm, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/calendar', handler: _lazy_ttAlil, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/calendar', handler: _lazy_fbtTvN, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/calendar/:id', handler: _lazy_vSpnGe, lazy: true, middleware: false, method: "delete" },
  { route: '/api/siswa/calendar/:id', handler: _lazy_oeP0Xi, lazy: true, middleware: false, method: "put" },
  { route: '/api/siswa/change-password', handler: _lazy_S_mcUf, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/dashboard', handler: _lazy_v1txOS, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/feed', handler: _lazy_xuCk19, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/feed/:id/comment', handler: _lazy_3SzLVy, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/feed/:id/like', handler: _lazy_TGPr3m, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/gallery', handler: _lazy_8qEV2e, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/izin', handler: _lazy_Dd2rvL, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/izin', handler: _lazy_b7pQcX, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/izin/:id/surat', handler: _lazy_RQTy20, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/izin/template', handler: _lazy_xd2QqH, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/materials', handler: _lazy_Bzjwqv, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/news', handler: _lazy_1Ky6lv, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/news/:id', handler: _lazy_Ts4ioA, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/notifications', handler: _lazy_L6mQ1u, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/notifications/read', handler: _lazy_BFOj2G, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/polls', handler: _lazy_Nk47xD, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/polls/:id/vote', handler: _lazy_X0qmU8, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/profile', handler: _lazy_ug1Qhx, lazy: true, middleware: false, method: "put" },
  { route: '/api/siswa/schedule', handler: _lazy_gph_wx, lazy: true, middleware: false, method: "get" },
  { route: '/api/students/template', handler: _lazy_esJ8lC, lazy: true, middleware: false, method: "get" },
  { route: '/api/translate', handler: _lazy_r8uiwg, lazy: true, middleware: false, method: "post" },
  { route: '/api/upload', handler: _lazy_7PybwW, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_0hFHMS, lazy: true, middleware: false, method: undefined },
  { route: '/api/_nuxt_icon/:collection', handler: _4hV7Jn, lazy: false, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: handler$1, lazy: false, middleware: false, method: undefined },
  { route: '/_fonts/**', handler: _lazy_0hFHMS, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_0hFHMS, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

if (!globalThis.crypto) {
  globalThis.crypto = crypto$1.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

//#region src/runtime/templates/error-500.ts
const _messages = {
	"appName": "Nuxt",
	"status": 500,
	"statusText": "Internal server error",
	"description": "This page is temporarily unavailable.",
	"refresh": "Refresh this page"
};
const template$1 = (messages) => {
	messages = {
		..._messages,
		...messages
	};
	return "<!DOCTYPE html><html lang=\"en\"><head><title>" + escapeHtml(messages.status) + " - " + escapeHtml(messages.statusText) + " | " + escapeHtml(messages.appName) + "</title><meta charset=\"utf-8\"><meta content=\"width=device-width,initial-scale=1,minimum-scale=1\" name=\"viewport\"><script>!function(){let e=document.createElement(\"link\").relList;if(!(e&&e.supports&&e.supports(\"modulepreload\"))){for(let e of document.querySelectorAll('link[rel=\"modulepreload\"]'))r(e);new MutationObserver(e=>{for(let t of e)if(\"childList\"===t.type)for(let e of t.addedNodes)\"LINK\"===e.tagName&&\"modulepreload\"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;let r=function(e){let r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),\"use-credentials\"===e.crossOrigin?r.credentials=\"include\":\"anonymous\"===e.crossOrigin?r.credentials=\"omit\":r.credentials=\"same-origin\",r}(e);fetch(e.href,r)}}();<\/script><style>*,:after,:before{box-sizing:border-box;border-style:solid;border-width:0;border-color:var(--un-default-border-color,#e5e7eb)}:after,:before{--un-content:\"\"}html{-webkit-text-size-adjust:100%;tab-size:4;font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}body{line-height:inherit;margin:0}h1,h2{font-size:inherit;font-weight:inherit}h1,h2,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 #0000;--un-ring-shadow:0 0 #0000;--un-shadow-inset: ;--un-shadow:0 0 #0000;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:#93c5fd80;--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.grid{display:grid}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-2{padding-left:.5rem;padding-right:.5rem}.text-center{text-align:center}.text-\\[80px\\]{font-size:80px}.text-2xl{font-size:1.5rem;line-height:2rem}.text-\\[\\#020420\\]{--un-text-opacity:1;color:rgb(2 4 32/var(--un-text-opacity))}.text-\\[\\#64748B\\]{--un-text-opacity:1;color:rgb(100 116 139/var(--un-text-opacity))}.font-semibold{font-weight:600}.leading-none{line-height:1}.tracking-wide{letter-spacing:.025em}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.tabular-nums{--un-numeric-spacing:tabular-nums;font-variant-numeric:var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-\\[\\#020420\\]{--un-bg-opacity:1;background-color:rgb(2 4 32/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (width>=640px){.sm\\:text-\\[110px\\]{font-size:110px}.sm\\:text-3xl{font-size:1.875rem;line-height:2.25rem}}</style></head><body class=\"antialiased bg-white dark:bg-[#020420] dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-[#020420] tracking-wide\"><div class=\"max-w-520px text-center\"><h1 class=\"font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]\">" + escapeHtml(messages.status) + "</h1><h2 class=\"font-semibold mb-2 sm:text-3xl text-2xl\">" + escapeHtml(messages.statusText) + "</h2><p class=\"mb-4 px-2 text-[#64748B] text-md\">" + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const entry = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: viteNodeEntry_mjs
}, Symbol.toStringTag, { value: 'Module' }));

const manifest = () => viteNodeFetch.getManifest();

const manifest$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: manifest
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$u = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const existing = await prisma.achievement.findFirst({
    where: { id, student: { institutionId: auth.institutionId } }
  });
  if (!existing) throw createError({ statusCode: 404, message: "Prestasi tidak ditemukan." });
  await prisma.achievement.delete({ where: { id } });
  return { success: true };
});

const _id__delete$v = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$u
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$s = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const existing = await prisma.achievement.findFirst({
    where: { id, student: { institutionId: auth.institutionId } }
  });
  if (!existing) throw createError({ statusCode: 404, message: "Prestasi tidak ditemukan." });
  const { title, description, date, type, extracurricularId, level, proof } = await readBody(event);
  if (!title || !type || !extracurricularId || !level) {
    throw createError({ statusCode: 400, message: "Judul, jenis, ekskul, dan tingkat wajib diisi." });
  }
  const ekskul = await prisma.extracurricular.findFirst({
    where: { id: extracurricularId, institutionId: auth.institutionId }
  });
  if (!ekskul) throw createError({ statusCode: 400, message: "Ekskul tidak valid." });
  const updated = await prisma.achievement.update({
    where: { id },
    data: {
      title,
      description,
      date: date ? new Date(date) : void 0,
      type,
      level,
      proofUrl: proof || null,
      extracurricularId
    },
    include: {
      extracurricular: { select: { name: true } },
      student: { select: { name: true, class: true } }
    }
  });
  return {
    id: updated.id,
    title: updated.title,
    description: updated.description,
    date: updated.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    dateIso: toDateInput$1(updated.date),
    type: updated.type,
    ekskul: updated.extracurricular.name,
    ekskulId: updated.extracurricularId,
    level: updated.level,
    proof: updated.proofUrl,
    studentName: updated.student.name,
    studentClass: updated.student.class
  };
});
function toDateInput$1(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const _id__put$t = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$s
}, Symbol.toStringTag, { value: 'Module' }));

const dayNames$1 = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const dashboard_get$4 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const instId = auth.institutionId;
  const [students, teachers, ekskuls, operators, logs, todaySchedules, genderRows, weekRecords, ekskulRows] = await Promise.all([
    prisma.student.count({ where: { institutionId: instId } }),
    prisma.teacher.count({ where: { institutionId: instId } }),
    prisma.extracurricular.count({ where: { institutionId: instId } }),
    prisma.user.count({ where: { institutionId: instId, role: "operator", status: "active" } }),
    prisma.activityLog.findMany({
      where: { institutionId: instId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { user: { select: { name: true } } }
    }),
    prisma.schedule.findMany({
      where: { institutionId: instId, day: dayNames$1[(/* @__PURE__ */ new Date()).getDay()] },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { timeStart: "asc" }
    }),
    // Distribusi gender
    prisma.student.groupBy({
      by: ["gender"],
      where: { institutionId: instId },
      _count: { _all: true }
    }),
    // Kehadiran 4 minggu terakhir
    prisma.attendanceRecord.findMany({
      where: {
        extracurricular: { institutionId: instId },
        date: { gte: new Date(Date.now() - 28 * 24 * 60 * 60 * 1e3) }
      },
      select: { date: true, status: true }
    }),
    // Anggota per ekskul
    prisma.extracurricular.findMany({
      where: { institutionId: instId },
      select: { name: true, _count: { select: { members: true } } },
      orderBy: { name: "asc" }
    })
  ]);
  const genderMap = {};
  for (const g of genderRows) {
    const key = g.gender === "L" ? "Laki-laki" : g.gender === "P" ? "Perempuan" : g.gender;
    genderMap[key] = (genderMap[key] || 0) + g._count._all;
  }
  const weeks = [];
  for (let w = 3; w >= 0; w--) {
    const start = /* @__PURE__ */ new Date();
    start.setDate(start.getDate() - start.getDay() - w * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    const records = weekRecords.filter((r) => {
      const d = new Date(r.date);
      return d >= start && d <= end;
    });
    weeks.push({
      label: `Mgg ${4 - w}`,
      hadir: records.filter((r) => r.status === "hadir").length,
      total: records.length
    });
  }
  return {
    students,
    teachers,
    extracurriculars: ekskuls,
    activeOperators: operators,
    remainingQuota: 1288,
    todaySchedule: todaySchedules.map((s) => ({
      id: s.id,
      time: `${s.timeStart} - ${s.timeEnd || "selesai"}`,
      title: `Ekskul ${s.extracurricular.name} - ${s.coach}`,
      coach: s.coach,
      location: s.location,
      ekskul: s.extracurricular.name,
      status: "akan_datang"
    })),
    activityLogs: logs.map((l) => ({
      id: l.id,
      actor: l.user.name,
      avatar: l.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      action: l.action,
      timestamp: l.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    })),
    charts: {
      gender: {
        labels: ["Laki-laki", "Perempuan"],
        data: [genderMap["Laki-laki"] || 0, genderMap["Perempuan"] || 0]
      },
      attendanceTrend: {
        labels: weeks.map((w) => w.label),
        data: weeks.map((w) => w.total ? Math.round(w.hadir / w.total * 100) : 0)
      },
      ekskulMembers: {
        labels: ekskulRows.map((e) => e.name),
        data: ekskulRows.map((e) => e._count.members)
      }
    }
  };
});

const dashboard_get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dashboard_get$4
}, Symbol.toStringTag, { value: 'Module' }));

const extracurriculars_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const ekskuls = await prisma.extracurricular.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      teacher: true,
      _count: {
        select: {
          members: true,
          schedules: true,
          assessments: true,
          attendanceSessions: true,
          attendanceRecords: true,
          polls: true,
          newsList: true,
          galleries: true,
          achievements: true,
          feedPosts: true,
          articles: true,
          materials: true,
          boardPositions: true,
          operators: true
        }
      }
    },
    orderBy: { name: "asc" }
  });
  return ekskuls.map((e) => ({
    ...e,
    // Ringkas untuk peringatan hapus di UI
    relatedCounts: {
      members: e._count.members,
      schedules: e._count.schedules,
      assessments: e._count.assessments,
      sessions: e._count.attendanceSessions,
      records: e._count.attendanceRecords,
      polls: e._count.polls,
      news: e._count.newsList,
      galleries: e._count.galleries,
      achievements: e._count.achievements,
      feed: e._count.feedPosts,
      articles: e._count.articles,
      materials: e._count.materials,
      board: e._count.boardPositions,
      operators: e._count.operators
    }
  }));
});

const extracurriculars_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: extracurriculars_get
}, Symbol.toStringTag, { value: 'Module' }));

const extracurriculars_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, quota, scheduleInfo, description, teacherId, logoUrl } = await readBody(event);
  if (!name) {
    throw createError({ statusCode: 400, message: "Nama ekskul wajib diisi." });
  }
  return prisma.extracurricular.create({
    data: { name, quota: quota || 30, scheduleInfo, description, teacherId, logoUrl: typeof logoUrl === "string" ? logoUrl : null, institutionId: auth.institutionId },
    include: { teacher: true, _count: { select: { members: true } } }
  });
});

const extracurriculars_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: extracurriculars_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$s = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const ekskul = await prisma.extracurricular.findFirst({
    where: { id, institutionId: auth.institutionId },
    include: { teacher: true }
  });
  if (!ekskul) throw createError({ statusCode: 404, message: "Ekskul tidak ditemukan." });
  const [memberCount, scheduleCount, assessmentCount, sessionCount, recordCount, pollCount, newsCount, galleryCount, achievementCount, feedCount, articleCount, materialCount, boardCount, operatorCount] = await Promise.all([
    prisma.member.count({ where: { extracurricularId: id } }),
    prisma.schedule.count({ where: { extracurricularId: id } }),
    prisma.assessment.count({ where: { extracurricularId: id } }),
    prisma.attendanceSession.count({ where: { extracurricularId: id } }),
    prisma.attendanceRecord.count({ where: { extracurricularId: id } }),
    prisma.poll.count({ where: { extracurricularId: id } }),
    prisma.news.count({ where: { extracurricularId: id } }),
    prisma.gallery.count({ where: { extracurricularId: id } }),
    prisma.achievement.count({ where: { extracurricularId: id } }),
    prisma.feedPost.count({ where: { extracurricularId: id } }),
    prisma.article.count({ where: { extracurricularId: id } }),
    prisma.extracurricularMaterial.count({ where: { extracurricularId: id } }),
    prisma.boardPosition.count({ where: { extracurricularId: id } }),
    prisma.user.count({ where: { extracurricularId: id } })
  ]);
  const related = [
    { label: "Anggota ekskul", count: memberCount },
    { label: "Jadwal", count: scheduleCount },
    { label: "Penilaian", count: assessmentCount },
    { label: "Sesi absensi", count: sessionCount },
    { label: "Rekaman absensi", count: recordCount },
    { label: "Voting", count: pollCount },
    { label: "Pengumuman & berita", count: newsCount },
    { label: "Galeri foto", count: galleryCount },
    { label: "Prestasi", count: achievementCount },
    { label: "Postingan feed", count: feedCount },
    { label: "Artikel blog", count: articleCount },
    { label: "Materi ekskul", count: materialCount },
    { label: "Jabatan kepengurusan", count: boardCount },
    { label: "Akun operator ekskul", count: operatorCount }
  ].filter((r) => r.count > 0);
  await prisma.$transaction(async (tx) => {
    const feedPosts = await tx.feedPost.findMany({ where: { extracurricularId: id }, select: { id: true } });
    const feedIds = feedPosts.map((f) => f.id);
    if (feedIds.length) {
      await tx.feedComment.deleteMany({ where: { feedPostId: { in: feedIds } } });
      await tx.feedLike.deleteMany({ where: { feedPostId: { in: feedIds } } });
    }
    const galleries = await tx.gallery.findMany({ where: { extracurricularId: id }, select: { id: true } });
    const galleryIds = galleries.map((g) => g.id);
    if (galleryIds.length) {
      await tx.galleryImage.deleteMany({ where: { galleryId: { in: galleryIds } } });
    }
    const polls = await tx.poll.findMany({ where: { extracurricularId: id }, select: { id: true } });
    const pollIds = polls.map((p) => p.id);
    if (pollIds.length) {
      await tx.pollVote.deleteMany({ where: { pollId: { in: pollIds } } });
      await tx.pollOption.deleteMany({ where: { pollId: { in: pollIds } } });
    }
    const articles = await tx.article.findMany({ where: { extracurricularId: id }, select: { id: true } });
    const articleIds = articles.map((a) => a.id);
    if (articleIds.length) {
      await tx.articleView.deleteMany({ where: { articleId: { in: articleIds } } });
    }
    await tx.member.deleteMany({ where: { extracurricularId: id } });
    await tx.schedule.deleteMany({ where: { extracurricularId: id } });
    await tx.assessment.deleteMany({ where: { extracurricularId: id } });
    await tx.attendanceSession.deleteMany({ where: { extracurricularId: id } });
    await tx.attendanceRecord.deleteMany({ where: { extracurricularId: id } });
    await tx.poll.deleteMany({ where: { extracurricularId: id } });
    await tx.news.deleteMany({ where: { extracurricularId: id } });
    await tx.gallery.deleteMany({ where: { extracurricularId: id } });
    await tx.achievement.deleteMany({ where: { extracurricularId: id } });
    await tx.feedPost.deleteMany({ where: { extracurricularId: id } });
    await tx.article.deleteMany({ where: { extracurricularId: id } });
    await tx.extracurricularMaterial.deleteMany({ where: { extracurricularId: id } });
    await tx.boardPosition.deleteMany({ where: { extracurricularId: id } });
    await tx.user.updateMany({
      where: { extracurricularId: id },
      data: { extracurricularId: null }
    });
    await tx.extracurricular.delete({ where: { id } });
  });
  return { success: true, deleted: related.reduce((s, r) => s + r.count, 0), related };
});

const _id__delete$t = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$s
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$q = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const { name, quota, scheduleInfo, description, teacherId, logoUrl } = await readBody(event);
  const ekskul = await prisma.extracurricular.findFirst({
    where: { id, institutionId: auth.institutionId }
  });
  if (!ekskul) throw createError({ statusCode: 404, message: "Ekskul tidak ditemukan." });
  return prisma.extracurricular.update({
    where: { id },
    data: { name, quota, scheduleInfo, description, teacherId, logoUrl: typeof logoUrl === "string" ? logoUrl : null },
    include: { teacher: true, _count: { select: { members: true } } }
  });
});

const _id__put$r = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$q
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$q = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const post = await prisma.feedPost.findFirst({
    where: { id, institutionId: auth.institutionId }
  });
  if (!post) throw createError({ statusCode: 404, message: "Postingan tidak ditemukan." });
  await prisma.feedComment.deleteMany({ where: { feedPostId: id } });
  await prisma.feedLike.deleteMany({ where: { feedPostId: id } });
  await prisma.feedPost.delete({ where: { id } });
  return { success: true };
});

const _id__delete$r = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$q
}, Symbol.toStringTag, { value: 'Module' }));

const news_get$4 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery$1(event);
  const status = query.status ? String(query.status) : null;
  const where = { institutionId: auth.institutionId };
  if (status && ["none", "pending", "approved", "rejected"].includes(status)) {
    where.displayStatus = status;
  }
  const news = await prisma.news.findMany({
    where,
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
    orderBy: { createdAt: "desc" }
  });
  return news.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    isPublic: n.isPublic,
    displayStatus: n.displayStatus,
    ekskul: n.extracurricular.name,
    ekskulLogo: n.extracurricular.logoUrl,
    ekskulId: n.extracurricularId,
    author: n.author,
    date: n.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  }));
});

const news_get$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: news_get$4
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$o = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const { displayStatus } = await readBody(event);
  if (!["none", "pending", "approved", "rejected"].includes(displayStatus)) {
    throw createError({ statusCode: 400, message: "Status tampil tidak valid." });
  }
  const existing = await prisma.news.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!existing) throw createError({ statusCode: 404, message: "Berita tidak ditemukan." });
  const updated = await prisma.news.update({
    where: { id },
    data: { displayStatus }
  });
  return { success: true, displayStatus: updated.displayStatus };
});

const _id__put$p = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$o
}, Symbol.toStringTag, { value: 'Module' }));

const reports_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const type = getQuery$1(event).type || "";
  if (!isReportType(type)) {
    throw createError({ statusCode: 400, message: "Tipe laporan tidak dikenal." });
  }
  return reportBuilders[type](auth.institutionId);
});

const reports_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: reports_get
}, Symbol.toStringTag, { value: 'Module' }));

const attendanceDetail_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const q = getQuery$1(event);
  const ekskul = q.ekskul || "";
  const start = q.start || "";
  const end = q.end || "";
  const page = Math.max(1, Number(q.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(q.pageSize) || 20));
  const { total, records } = await attendanceRows(
    auth.institutionId,
    { ekskul, start, end },
    { skip: (page - 1) * pageSize, take: pageSize }
  );
  return {
    records,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize))
  };
});

const attendanceDetail_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: attendanceDetail_get
}, Symbol.toStringTag, { value: 'Module' }));

function fmtDate(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
function buildWorkbook(type, data) {
  const wb = XLSX.utils.book_new();
  if (type === "students") {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Kelas", "Total Siswa", "Laki-laki", "Perempuan", "Sudah Daftar Akun"],
      ...data.perClass.map((c) => [c.className, c.total, c.male, c.female, c.registered])
    ]), "Rekap per Kelas");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["NIS", "Nama", "Kelas", "Jenis Kelamin", "Telepon", "Status Akun"],
      ...data.students.map((s) => [s.nis, s.name, s.class, s.gender, s.phone || "", s.accountStatus])
    ]), "Detail Siswa");
  }
  if (type === "attendance") {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Ekskul", "Hadir", "Izin", "Alpha", "Total", "Tingkat Kehadiran (%)"],
      ...data.perEkskul.map((e) => [e.ekskul, e.hadir, e.izin, e.alpha, e.total, e.rate])
    ]), "Rekap per Ekskul");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Tanggal", "Ekskul", "Siswa", "Kelas", "Status", "Waktu", "Keterangan"],
      ...data.records.map((r) => [fmtDate(r.date), r.ekskul, r.student, r.class, r.status, r.time || "", r.notes || ""])
    ]), "Detail Absensi");
  }
  if (type === "achievements") {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Tipe", "Jumlah"],
      ["Juara", data.byType.juara],
      ["Sertifikat", data.byType.sertifikat],
      ["Partisipasi", data.byType.partisipasi],
      ["Organisasi", data.byType.organisasi],
      ["Tingkat Sekolah", data.byLevel.sekolah],
      ["Tingkat Kecamatan", data.byLevel.kecamatan],
      ["Tingkat Kota", data.byLevel.kota],
      ["Tingkat Provinsi", data.byLevel.provinsi],
      ["Tingkat Nasional", data.byLevel.nasional]
    ]), "Rekap Prestasi");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Tanggal", "Prestasi", "Siswa", "Kelas", "Ekskul", "Tipe", "Tingkat"],
      ...data.achievements.map((a) => [fmtDate(a.date), a.title, a.student, a.class, a.ekskul, a.type, a.level])
    ]), "Detail Prestasi");
  }
  if (type === "finance") {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Keterangan"],
      [data.message],
      [],
      ["Jumlah Siswa", data.context.students],
      ["Jumlah Ekskul", data.context.ekskuls],
      ["Anggota Aktif", data.context.members]
    ]), "Laporan Keuangan");
  }
  if (type === "annual") {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
      ["Rekapitulasi Tahunan", ""],
      ["Instansi", data.institutionName],
      ["Tahun Ajaran", data.year],
      ["Semester", data.semester],
      [],
      ["Jumlah Siswa", data.students],
      ["Jumlah Pembimbing", data.teachers],
      ["Jumlah Ekskul", data.ekskuls],
      ["Anggota Aktif", data.members],
      ["Jadwal Latihan", data.schedules],
      ["Sesi Absensi", data.sessions],
      ["Catatan Kehadiran", data.attendanceRecords],
      ["Tingkat Kehadiran (%)", data.attendanceRate],
      ["Jumlah Prestasi", data.achievements],
      ["Jumlah Voting", data.polls],
      ["Jumlah Berita", data.news],
      ["Jumlah Galeri", data.galleries]
    ]), "Rekap Tahunan");
  }
  return wb;
}
const export_get$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const type = getQuery$1(event).type || "";
  if (!isReportType(type)) {
    throw createError({ statusCode: 400, message: "Tipe laporan tidak dikenal." });
  }
  const data = await reportBuilders[type](auth.institutionId);
  if (type === "attendance") {
    const { records } = await attendanceRows(auth.institutionId);
    data.records = records;
  }
  const wb = buildWorkbook(type, data);
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  setHeader(event, "Content-Disposition", `attachment; filename="laporan-${type}-${date}.xlsx"`);
  return buf;
});

const export_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: export_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const settings_get$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const inst = await prisma.institution.findUnique({ where: { id: auth.institutionId } });
  if (!inst) throw createError({ statusCode: 404, message: "Sekolah tidak ditemukan." });
  return inst;
});

const settings_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: settings_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const settings_put = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, npsn, address, phone, email, website, headmaster, activeYear, activeSemester, themeColor, logo, latitude, longitude, attendanceRadius } = await readBody(event);
  let lat = null;
  let lng = null;
  let radius = null;
  if (latitude != null && longitude != null) {
    lat = Number(latitude);
    lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({ statusCode: 400, message: "Koordinat lokasi sekolah tidak valid." });
    }
    radius = Math.max(50, Math.min(2e3, Number(attendanceRadius) || 200));
  }
  return prisma.institution.update({
    where: { id: auth.institutionId },
    data: {
      name,
      npsn,
      address,
      phone,
      email,
      website,
      headmaster,
      activeYear,
      activeSemester,
      logo: typeof logo === "string" ? logo : null,
      // Validasi: hanya terima hex 6 digit (#RRGGBB)
      themeColor: typeof themeColor === "string" && /^#[0-9a-fA-F]{6}$/.test(themeColor) ? themeColor : null,
      latitude: lat,
      longitude: lng,
      attendanceRadius: radius
    }
  });
});

const settings_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: settings_put
}, Symbol.toStringTag, { value: 'Module' }));

const students_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const students = await prisma.student.findMany({
    where: { institutionId: auth.institutionId },
    orderBy: { nis: "asc" }
  });
  return students;
});

const students_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: students_get
}, Symbol.toStringTag, { value: 'Module' }));

const students_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, class: className, gender, phone } = await readBody(event);
  if (!name || !className || !gender) {
    throw createError({ statusCode: 400, message: "Nama, kelas, dan jenis kelamin wajib diisi." });
  }
  const year = (/* @__PURE__ */ new Date()).getFullYear().toString();
  const lastStudent = await prisma.student.findFirst({
    where: { institutionId: auth.institutionId, nis: { startsWith: year } },
    orderBy: { nis: "desc" }
  });
  const nextSeq = lastStudent ? String(Number(lastStudent.nis.slice(4)) + 1).padStart(4, "0") : "0001";
  const nis = `${year}${nextSeq}`;
  const student = await prisma.student.create({
    data: { nis, name, class: className, gender, phone, institutionId: auth.institutionId }
  });
  return student;
});

const students_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: students_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$o = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const student = await prisma.student.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!student) throw createError({ statusCode: 404, message: "Siswa tidak ditemukan." });
  await prisma.member.deleteMany({ where: { studentId: id } });
  await prisma.attendanceRecord.deleteMany({ where: { studentId: id } });
  await prisma.achievement.deleteMany({ where: { studentId: id } });
  if (student.accountStatus === "registered") {
    const user = await prisma.user.findUnique({ where: { studentId: id } });
    if (user) {
      await prisma.feedComment.deleteMany({ where: { userId: user.id } });
      await prisma.feedLike.deleteMany({ where: { userId: user.id } });
      await prisma.pollVote.deleteMany({ where: { userId: user.id } });
      await prisma.userPermission.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    }
  }
  await prisma.student.delete({ where: { id } });
  return { success: true };
});

const _id__delete$p = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$o
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$m = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const { name, class: className, gender, phone } = await readBody(event);
  const student = await prisma.student.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!student) throw createError({ statusCode: 404, message: "Siswa tidak ditemukan." });
  const updated = await prisma.student.update({
    where: { id },
    data: { name, class: className, gender, phone }
  });
  return updated;
});

const _id__put$n = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$m
}, Symbol.toStringTag, { value: 'Module' }));

const import_post$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { students } = await readBody(event);
  if (!students || !Array.isArray(students) || students.length === 0) {
    throw createError({ statusCode: 400, message: "Data siswa wajib diisi." });
  }
  const year = (/* @__PURE__ */ new Date()).getFullYear().toString();
  const lastStudent = await prisma.student.findFirst({
    where: { institutionId: auth.institutionId, nis: { startsWith: year } },
    orderBy: { nis: "desc" }
  });
  let nextSeq = lastStudent ? Number(lastStudent.nis.slice(4)) + 1 : 1;
  const created = [];
  for (const s of students) {
    if (!s.name || !s.class || !s.gender) continue;
    const nis = `${year}${String(nextSeq).padStart(4, "0")}`;
    const student = await prisma.student.create({
      data: { nis, name: s.name, class: s.class, gender: s.gender, phone: s.phone || null, institutionId: auth.institutionId }
    });
    created.push(student);
    nextSeq++;
  }
  await prisma.activityLog.create({
    data: { action: `Mengimpor ${created.length} data siswa baru`, userId: auth.userId, institutionId: auth.institutionId }
  });
  return { success: true, count: created.length, students: created };
});

const import_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: import_post$2
}, Symbol.toStringTag, { value: 'Module' }));

const template_get$5 = defineEventHandler(async (event) => {
  const wb = XLSX.utils.book_new();
  const wsData = [
    ["Nama Lengkap", "Kelas", "Jenis Kelamin", "Telepon"],
    ["Contoh: Ahmad Rizki", "11 IPA 1", "L", "081234567890"],
    ["Contoh: Siti Nurhaliza", "11 IPA 2", "P", ""]
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!cols"] = [
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  setHeader(event, "Content-Disposition", 'attachment; filename="template-import-siswa.xlsx"');
  return buf;
});

const template_get$6 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: template_get$5
}, Symbol.toStringTag, { value: 'Module' }));

const teachers_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  return prisma.teacher.findMany({
    where: { institutionId: auth.institutionId },
    orderBy: { name: "asc" }
  });
});

const teachers_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: teachers_get
}, Symbol.toStringTag, { value: 'Module' }));

const teachers_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { nip, name, subject, phone } = await readBody(event);
  if (!nip || !name) {
    throw createError({ statusCode: 400, message: "NIP dan nama wajib diisi." });
  }
  return prisma.teacher.create({
    data: { nip, name, subject: subject || "", phone, institutionId: auth.institutionId }
  });
});

const teachers_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: teachers_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$m = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const teacher = await prisma.teacher.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!teacher) throw createError({ statusCode: 404, message: "Pembimbing tidak ditemukan." });
  await prisma.extracurricular.updateMany({ where: { teacherId: id }, data: { teacherId: null } });
  await prisma.teacher.delete({ where: { id } });
  return { success: true };
});

const _id__delete$n = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$m
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$k = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const { nip, name, subject, phone } = await readBody(event);
  const teacher = await prisma.teacher.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!teacher) throw createError({ statusCode: 404, message: "Pembimbing tidak ditemukan." });
  return prisma.teacher.update({ where: { id }, data: { nip, name, subject, phone } });
});

const _id__put$l = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$k
}, Symbol.toStringTag, { value: 'Module' }));

const users_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const users = await prisma.user.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      permissions: true,
      student: { select: { nis: true, class: true } },
      extracurricularOperator: { select: { id: true, name: true } }
    },
    orderBy: { name: "asc" }
  });
  return users.map((u) => {
    var _a, _b, _c, _d, _e, _f, _g;
    return {
      id: u.id,
      name: u.name,
      username: u.username,
      role: u.role,
      phone: u.phone,
      email: u.email,
      status: u.status,
      permissions: u.permissions,
      nis: (_b = (_a = u.student) == null ? void 0 : _a.nis) != null ? _b : null,
      class: (_d = (_c = u.student) == null ? void 0 : _c.class) != null ? _d : null,
      extracurricularId: (_e = u.extracurricularId) != null ? _e : null,
      ekskul: (_g = (_f = u.extracurricularOperator) == null ? void 0 : _f.name) != null ? _g : null
    };
  });
});

const users_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: users_get
}, Symbol.toStringTag, { value: 'Module' }));

const users_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { username: rawUsername, password, name, role, phone, email, permissions, extracurricularId, nis } = await readBody(event);
  if (!password || !name || !role) {
    throw createError({ statusCode: 400, message: "Username, password, nama, dan role wajib diisi." });
  }
  if (password.length < 6) {
    throw createError({ statusCode: 400, message: "Password minimal 6 karakter." });
  }
  let scopedExtracurricularId;
  if (role === "operator" && !extracurricularId) {
    throw createError({ statusCode: 400, message: "Operator ekskul wajib diikat ke satu ekskul (pilih ekskul yang dikelola)." });
  }
  if (role === "operator" && extracurricularId) {
    const ex = await prisma.extracurricular.findFirst({
      where: { id: extracurricularId, institutionId: auth.institutionId },
      select: { id: true }
    });
    if (!ex) {
      throw createError({ statusCode: 400, message: "Ekskul tidak ditemukan di instansi ini." });
    }
    scopedExtracurricularId = ex.id;
  }
  let studentId;
  let username = rawUsername;
  if (role === "student") {
    if (!nis) {
      throw createError({ statusCode: 400, message: "NIS wajib diisi untuk akun siswa." });
    }
    const student = await prisma.student.findFirst({
      where: { nis, institutionId: auth.institutionId },
      select: { id: true, name: true }
    });
    if (!student) {
      throw createError({ statusCode: 404, message: `Siswa dengan NIS ${nis} tidak ditemukan. Pastikan NIS sudah terdaftar di Data Siswa.` });
    }
    const linked = await prisma.user.findUnique({ where: { studentId: student.id } });
    if (linked) {
      throw createError({ statusCode: 409, message: `Siswa ${student.name} (NIS ${nis}) sudah memiliki akun.` });
    }
    studentId = student.id;
    if (!username) username = nis;
  }
  if (!username) {
    throw createError({ statusCode: 400, message: "Username wajib diisi." });
  }
  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) throw createError({ statusCode: 409, message: "Username sudah digunakan." });
  const passwordHash = await hash$2(password, 10);
  return prisma.user.create({
    data: {
      username,
      passwordHash,
      name,
      role,
      phone,
      email,
      institutionId: auth.institutionId,
      ...scopedExtracurricularId && { extracurricularId: scopedExtracurricularId },
      ...studentId && { studentId },
      permissions: (permissions == null ? void 0 : permissions.length) ? {
        create: permissions.map((p) => ({ permissionId: p }))
      } : void 0
    },
    include: {
      permissions: true,
      student: { select: { nis: true, class: true } }
    }
  });
});

const users_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: users_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$k = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const existing = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!existing) throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  if (existing.role === "admin") {
    throw createError({ statusCode: 400, message: "Akun admin tidak dapat dihapus." });
  }
  await prisma.$transaction(async (tx) => {
    await tx.pollVote.deleteMany({ where: { userId: id } });
    await tx.feedLike.deleteMany({ where: { userId: id } });
    await tx.feedComment.deleteMany({ where: { userId: id } });
    await tx.activityLog.deleteMany({ where: { userId: id } });
    await tx.extracurricularMaterial.deleteMany({ where: { uploadedById: id } });
    await tx.article.deleteMany({ where: { authorId: id } });
    await tx.news.updateMany({ where: { createdById: id }, data: { createdById: null } });
    const createdPolls = await tx.poll.findMany({ where: { createdById: id }, select: { id: true } });
    const pollIds = createdPolls.map((p) => p.id);
    if (pollIds.length) {
      await tx.pollVote.deleteMany({ where: { pollId: { in: pollIds } } });
      await tx.pollOption.deleteMany({ where: { pollId: { in: pollIds } } });
      await tx.poll.deleteMany({ where: { id: { in: pollIds } } });
    }
    const sessions = await tx.attendanceSession.findMany({ where: { createdById: id }, select: { id: true } });
    const sessionIds = sessions.map((s) => s.id);
    if (sessionIds.length) {
      await tx.attendanceRecord.deleteMany({ where: { sessionId: { in: sessionIds } } });
      await tx.attendanceSession.deleteMany({ where: { id: { in: sessionIds } } });
    }
    await tx.userPermission.deleteMany({ where: { userId: id } });
    await tx.user.delete({ where: { id } });
  });
  return { success: true };
});

const _id__delete$l = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$k
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$i = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const { name, phone, email, status, permissions, extracurricularId } = await readBody(event);
  const existing = await prisma.user.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!existing) throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  const data = {};
  if (name !== void 0) data.name = name;
  if (phone !== void 0) data.phone = phone;
  if (email !== void 0) data.email = email;
  if (status !== void 0) data.status = status;
  if (existing.role === "operator" && extracurricularId !== void 0) {
    if (extracurricularId) {
      const ex = await prisma.extracurricular.findFirst({
        where: { id: extracurricularId, institutionId: auth.institutionId },
        select: { id: true }
      });
      if (!ex) throw createError({ statusCode: 400, message: "Ekskul tidak ditemukan di instansi ini." });
      data.extracurricularId = ex.id;
    } else {
      data.extracurricularId = null;
    }
  }
  if (permissions !== void 0) {
    const permList = Array.isArray(permissions) ? permissions : [];
    data.permissions = {
      deleteMany: {},
      create: permList.map((p) => ({ permissionId: p }))
    };
  }
  const u = await prisma.user.update({
    where: { id },
    data,
    include: {
      permissions: true,
      student: { select: { nis: true, class: true } }
    }
  });
  return {
    id: u.id,
    name: u.name,
    username: u.username,
    role: u.role,
    phone: u.phone,
    email: u.email,
    status: u.status,
    permissions: u.permissions,
    nis: (_b = (_a = u.student) == null ? void 0 : _a.nis) != null ? _b : null,
    class: (_d = (_c = u.student) == null ? void 0 : _c.class) != null ? _d : null
  };
});

const _id__put$j = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$i
}, Symbol.toStringTag, { value: 'Module' }));

const ROLE_LABELS = {
  admin: "Admin",
  operator: "Operator",
  student: "Siswa"
};
const export_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const users = await prisma.user.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      student: { select: { nis: true, class: true } },
      extracurricularOperator: { select: { name: true } }
    },
    orderBy: { name: "asc" }
  });
  const wsData = [
    ["Role", "NIS", "Username", "Nama Lengkap", "Kelas", "Ekskul", "Telepon", "Email", "Status"],
    ...users.map((u) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i;
      return [
        (_a = ROLE_LABELS[u.role]) != null ? _a : u.role,
        (_c = (_b = u.student) == null ? void 0 : _b.nis) != null ? _c : "",
        u.username,
        u.name,
        (_e = (_d = u.student) == null ? void 0 : _d.class) != null ? _e : "",
        (_g = (_f = u.extracurricularOperator) == null ? void 0 : _f.name) != null ? _g : "",
        (_h = u.phone) != null ? _h : "",
        (_i = u.email) != null ? _i : "",
        u.status === "active" ? "Aktif" : "Nonaktif"
      ];
    })
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!cols"] = [
    { wch: 10 },
    { wch: 12 },
    { wch: 16 },
    { wch: 22 },
    { wch: 12 },
    { wch: 16 },
    { wch: 16 },
    { wch: 24 },
    { wch: 10 }
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "User");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10).replace(/-/g, "");
  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  setHeader(event, "Content-Disposition", `attachment; filename="data-user-${date}.xlsx"`);
  return buf;
});

const export_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: export_get
}, Symbol.toStringTag, { value: 'Module' }));

const ROLE_MAP = {
  admin: "admin",
  operator: "operator",
  siswa: "student",
  student: "student"
};
const import_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: "File Excel wajib diunggah." });
  }
  const fileField = formData.find((f) => f.name === "file");
  if (!(fileField == null ? void 0 : fileField.data)) {
    throw createError({ statusCode: 400, message: "File tidak valid." });
  }
  let wb;
  try {
    wb = XLSX.read(fileField.data, { type: "buffer" });
  } catch {
    throw createError({ statusCode: 400, message: "File bukan Excel yang valid. Gunakan template .xlsx yang disediakan." });
  }
  const sheet = wb.Sheets[wb.SheetNames[0]];
  if (!sheet) {
    throw createError({ statusCode: 400, message: "File Excel kosong." });
  }
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  if (!rows || rows.length < 2) {
    throw createError({ statusCode: 400, message: "File template kosong \u2014 tidak ada baris data untuk diimpor." });
  }
  const [students, ekskuls, existingUsers] = await Promise.all([
    prisma.student.findMany({ where: { institutionId: auth.institutionId }, select: { id: true, nis: true, name: true } }),
    prisma.extracurricular.findMany({ where: { institutionId: auth.institutionId }, select: { id: true, name: true } }),
    prisma.user.findMany({ where: { institutionId: auth.institutionId }, select: { username: true, studentId: true } })
  ]);
  const studentByNis = new Map(students.map((s) => [s.nis, s]));
  const ekskulByLower = new Map(ekskuls.map((e) => [e.name.toLowerCase(), e]));
  const takenUsernames = new Set(existingUsers.map((u) => u.username));
  const takenStudentIds = new Set(existingUsers.filter((u) => u.studentId).map((u) => u.studentId));
  const created = [];
  const errors = [];
  const cell = (r, idx) => {
    var _a;
    return String((_a = r == null ? void 0 : r[idx]) != null ? _a : "").trim();
  };
  for (let i = 1; i < rows.length; i++) {
    const rowNum = i + 1;
    const r = rows[i];
    const rawRole = cell(r, 0).toLowerCase();
    const nis = cell(r, 1);
    let username = cell(r, 2);
    let name = cell(r, 3);
    const password = cell(r, 4);
    const ekskulName = cell(r, 5);
    const phone = cell(r, 6);
    const email = cell(r, 7);
    if (!rawRole && !name && !username && !nis) continue;
    const role = ROLE_MAP[rawRole];
    if (!role) {
      errors.push({ row: rowNum, message: `Role "${cell(r, 0)}" tidak dikenal. Gunakan Admin, Operator, atau Siswa.` });
      continue;
    }
    let studentId;
    let ekskulId;
    if (role === "student") {
      if (!nis) {
        errors.push({ row: rowNum, message: "NIS wajib diisi untuk akun Siswa." });
        continue;
      }
      const student = studentByNis.get(nis);
      if (!student) {
        errors.push({ row: rowNum, message: `Siswa dengan NIS ${nis} tidak ditemukan di Data Siswa.` });
        continue;
      }
      if (takenStudentIds.has(student.id)) {
        errors.push({ row: rowNum, message: `Siswa ${student.name} (NIS ${nis}) sudah memiliki akun.` });
        continue;
      }
      studentId = student.id;
      if (!username) username = nis;
      if (!name) name = student.name;
    }
    if (role === "operator") {
      if (!ekskulName) {
        errors.push({ row: rowNum, message: "Kolom Ekskul wajib diisi untuk akun Operator." });
        continue;
      }
      const ekskul = ekskulByLower.get(ekskulName.toLowerCase());
      if (!ekskul) {
        errors.push({ row: rowNum, message: `Ekskul "${ekskulName}" tidak ditemukan di Data Ekskul.` });
        continue;
      }
      ekskulId = ekskul.id;
    }
    if (!username) {
      errors.push({ row: rowNum, message: "Username wajib diisi (untuk Siswa boleh dikosongkan agar memakai NIS)." });
      continue;
    }
    if (takenUsernames.has(username)) {
      errors.push({ row: rowNum, message: `Username "${username}" sudah digunakan.` });
      continue;
    }
    if (!name) {
      errors.push({ row: rowNum, message: "Nama Lengkap wajib diisi." });
      continue;
    }
    if (!password || password.length < 6) {
      errors.push({ row: rowNum, message: "Password wajib diisi minimal 6 karakter." });
      continue;
    }
    try {
      const passwordHash = await hash$2(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          passwordHash,
          name,
          role,
          phone: phone || null,
          email: email || null,
          institutionId: auth.institutionId,
          ...studentId && { studentId },
          ...ekskulId && { extracurricularId: ekskulId }
        }
      });
      created.push(user);
      takenUsernames.add(username);
      if (studentId) takenStudentIds.add(studentId);
    } catch {
      errors.push({ row: rowNum, message: "Gagal membuat akun (data tidak valid)." });
    }
  }
  await prisma.activityLog.create({
    data: {
      action: `Mengimpor ${created.length} akun user dari Excel`,
      userId: auth.userId,
      institutionId: auth.institutionId
    }
  });
  return { success: true, count: created.length, errors };
});

const import_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: import_post
}, Symbol.toStringTag, { value: 'Module' }));

const template_get$3 = defineEventHandler(async (event) => {
  const wb = XLSX.utils.book_new();
  const wsData = [
    ["Role", "NIS", "Username", "Nama Lengkap", "Password", "Ekskul", "Telepon", "Email"],
    ["Siswa", "20250001", "", "", "123456", "", "081234567890", ""],
    ["Operator", "", "op.basket", "Budi Santoso", "123456", "Basket", "081298765432", ""],
    ["Admin", "", "admin2", "Siti Aminah", "123456", "", "", ""]
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!cols"] = [
    { wch: 10 },
    { wch: 12 },
    { wch: 16 },
    { wch: 22 },
    { wch: 12 },
    { wch: 14 },
    { wch: 16 },
    { wch: 24 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  const petunjuk = XLSX.utils.aoa_to_sheet([
    ["PETUNJUK PENGISIAN TEMPLATE IMPORT AKUN"],
    [],
    ['1. Role (wajib): isi "Admin", "Operator", atau "Siswa".'],
    ["2. NIS (wajib untuk Siswa): NIS harus sudah terdaftar di menu Data Siswa."],
    ["3. Username (wajib unik): untuk Siswa boleh dikosongkan \u2014 otomatis memakai NIS."],
    ["4. Nama Lengkap (wajib): untuk Siswa boleh dikosongkan \u2014 otomatis memakai nama di Data Siswa."],
    ["5. Password (wajib): minimal 6 karakter."],
    ["6. Ekskul (wajib untuk Operator): isi nama ekskul persis seperti di menu Ekstrakurikuler."],
    ["7. Telepon & Email: opsional, boleh dikosongkan."],
    [],
    ['Baris contoh di sheet "Template" hanya panduan \u2014 hapus baris contoh sebelum mengunggah file Anda.']
  ]);
  petunjuk["!cols"] = [{ wch: 100 }];
  XLSX.utils.book_append_sheet(wb, petunjuk, "Petunjuk");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  setHeader(event, "Content-Disposition", 'attachment; filename="template-import-akun.xlsx"');
  return buf;
});

const template_get$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: template_get$3
}, Symbol.toStringTag, { value: 'Module' }));

const checkNis_post = defineEventHandler(async (event) => {
  const { nis } = await readBody(event);
  if (!nis) {
    throw createError({ statusCode: 400, message: "NIS wajib diisi." });
  }
  const student = await prisma.student.findUnique({ where: { nis } });
  if (!student) {
    throw createError({ statusCode: 404, message: "NIS tidak terdaftar. Hubungi admin sekolah." });
  }
  if (student.accountStatus === "registered") {
    throw createError({ statusCode: 409, message: "NIS sudah digunakan. Silakan login." });
  }
  return { name: student.name, institutionId: student.institutionId };
});

const checkNis_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: checkNis_post
}, Symbol.toStringTag, { value: 'Module' }));

const login_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const { identifier, password, role } = await readBody(event);
  if (!identifier || !password || !role) {
    throw createError({ statusCode: 400, message: "Username/NIS, password, dan role wajib diisi." });
  }
  let user;
  if (role === "student") {
    user = await prisma.user.findFirst({
      where: { username: identifier, role: "student" },
      include: {
        student: true,
        institution: true,
        permissions: true,
        extracurricularOperator: { select: { id: true, name: true } }
      }
    });
  } else {
    user = await prisma.user.findFirst({
      where: { username: identifier, role },
      include: {
        institution: true,
        permissions: true,
        extracurricularOperator: { select: { id: true, name: true } }
      }
    });
  }
  if (!user) {
    throw createError({ statusCode: 401, message: "Akun tidak ditemukan." });
  }
  if (user.status === "inactive") {
    throw createError({ statusCode: 403, message: "Akun ini telah dinonaktifkan." });
  }
  const valid = await compare(password, user.passwordHash);
  if (!valid) {
    throw createError({ statusCode: 401, message: "Password salah." });
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: /* @__PURE__ */ new Date() }
  });
  const token = generateToken({
    userId: user.id,
    username: user.username,
    role: user.role,
    institutionId: user.institutionId,
    studentId: ((_a = user.student) == null ? void 0 : _a.id) || void 0
  });
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      nis: ((_b = user.student) == null ? void 0 : _b.nis) || null,
      class: ((_c = user.student) == null ? void 0 : _c.class) || null,
      phone: user.phone,
      avatar: user.avatarUrl || null,
      extracurricular: user.extracurricularOperator ? { id: user.extracurricularOperator.id, name: user.extracurricularOperator.name } : null,
      permissions: user.permissions.map((p) => p.permissionId)
    },
    institution: toInstitutionSummary(user.institution)
  };
});

const login_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: login_post
}, Symbol.toStringTag, { value: 'Module' }));

const me_get = defineEventHandler(async (event) => {
  var _a, _b;
  const auth = event.context.auth;
  if (!auth) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: {
      student: true,
      institution: true,
      permissions: true,
      extracurricularOperator: { select: { id: true, name: true } }
    }
  });
  if (!user) {
    throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  }
  return {
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      nis: ((_a = user.student) == null ? void 0 : _a.nis) || null,
      class: ((_b = user.student) == null ? void 0 : _b.class) || null,
      phone: user.phone,
      avatar: user.avatarUrl || null,
      extracurricular: user.extracurricularOperator ? { id: user.extracurricularOperator.id, name: user.extracurricularOperator.name } : null,
      permissions: user.permissions.map((p) => p.permissionId)
    },
    institution: toInstitutionSummary(user.institution)
  };
});

const me_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: me_get
}, Symbol.toStringTag, { value: 'Module' }));

const register_post = defineEventHandler(async (event) => {
  const { nis, password } = await readBody(event);
  if (!nis || !password || password.length < 8) {
    throw createError({ statusCode: 400, message: "NIS wajib diisi dan password minimal 8 karakter." });
  }
  const student = await prisma.student.findUnique({ where: { nis } });
  if (!student) {
    throw createError({ statusCode: 404, message: "NIS tidak terdaftar. Hubungi admin sekolah." });
  }
  if (student.accountStatus === "registered") {
    throw createError({ statusCode: 409, message: "NIS sudah terdaftar. Silakan login." });
  }
  const existingUser = await prisma.user.findUnique({ where: { username: nis } });
  if (existingUser) {
    throw createError({ statusCode: 409, message: "NIS sudah memiliki akun." });
  }
  const passwordHash = await hash$2(password, 10);
  await prisma.$transaction([
    prisma.user.create({
      data: {
        username: nis,
        passwordHash,
        name: student.name,
        role: "student",
        studentId: student.id,
        institutionId: student.institutionId,
        status: "active"
      }
    }),
    prisma.student.update({
      where: { id: student.id },
      data: { accountStatus: "registered" }
    })
  ]);
  return { success: true, message: `Akun untuk ${student.name} berhasil dibuat. Silakan login.` };
});

const register_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: register_post
}, Symbol.toStringTag, { value: 'Module' }));

const articles_get$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const where = { institutionId: auth.institutionId, ...scopeFilter(scope) };
  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      _count: { select: { views: true } }
    }
  });
  return articles.map((a) => {
    var _a, _b, _c, _d;
    return {
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      category: a.category,
      status: a.status,
      author: a.author.name,
      ekskul: (_b = (_a = a.extracurricular) == null ? void 0 : _a.name) != null ? _b : null,
      ekskulLogo: (_d = (_c = a.extracurricular) == null ? void 0 : _c.logoUrl) != null ? _d : null,
      ekskulId: a.extracurricularId,
      viewCount: a._count.views,
      createdAt: a.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      updatedAt: a.updatedAt
    };
  });
});

const articles_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: articles_get$2
}, Symbol.toStringTag, { value: 'Module' }));

function slugify(text) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);
}
const articles_post = defineEventHandler(async (event) => {
  var _a, _b;
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const { title, content, excerpt, coverImage, category, tags, status, extracurricularId } = await readBody(event);
  if (!title || !content) {
    throw createError({ statusCode: 400, message: "Judul dan konten wajib diisi." });
  }
  let targetEkskul = extracurricularId;
  if (scope.isScoped) {
    targetEkskul = scope.extracurricularId;
  }
  assertScope(scope, targetEkskul || void 0);
  let slug = slugify(title) || "artikel-" + Date.now().toString(36);
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }
  const article = await prisma.article.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || title.slice(0, 150),
      coverImage,
      category: category || "general",
      tags,
      status: status || "draft",
      authorId: auth.userId,
      institutionId: auth.institutionId,
      ...targetEkskul ? { extracurricularId: targetEkskul } : {}
    },
    include: {
      author: { select: { name: true } },
      extracurricular: { select: { name: true } }
    }
  });
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    status: article.status,
    author: article.author.name,
    ekskul: (_b = (_a = article.extracurricular) == null ? void 0 : _a.name) != null ? _b : null,
    ekskulId: article.extracurricularId,
    createdAt: article.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  };
});

const articles_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: articles_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$i = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const article = await prisma.article.findFirst({
    where: { id, institutionId: auth.institutionId }
  });
  if (!article) {
    throw createError({ statusCode: 404, message: "Artikel tidak ditemukan." });
  }
  const scope = await getOperatorScope(event);
  assertScope(scope, article.extracurricularId || void 0);
  await prisma.article.delete({ where: { id } });
  return { success: true };
});

const _id__delete$j = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$i
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$g = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const { title, content, excerpt, coverImage, category, tags, status } = await readBody(event);
  const article = await prisma.article.findFirst({
    where: { id, institutionId: auth.institutionId }
  });
  if (!article) {
    throw createError({ statusCode: 404, message: "Artikel tidak ditemukan." });
  }
  const scope = await getOperatorScope(event);
  assertScope(scope, article.extracurricularId || void 0);
  const updated = await prisma.article.update({
    where: { id },
    data: {
      ...title && { title },
      ...content && { content },
      ...excerpt !== void 0 && { excerpt },
      ...coverImage !== void 0 && { coverImage },
      ...category && { category },
      ...tags !== void 0 && { tags },
      ...status && { status }
    }
  });
  return { success: true, id: updated.id, status: updated.status };
});

const _id__put$h = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$g
}, Symbol.toStringTag, { value: 'Module' }));

const views_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const article = await prisma.article.findFirst({
    where: { id, institutionId: auth.institutionId },
    include: {
      _count: { select: { views: true } }
    }
  });
  if (!article) {
    throw createError({ statusCode: 404, message: "Artikel tidak ditemukan." });
  }
  const views = await prisma.articleView.findMany({
    where: { articleId: id },
    include: { user: { select: { name: true, role: true } } },
    orderBy: { viewedAt: "desc" }
  });
  return {
    articleId: article.id,
    viewCount: article._count.views,
    viewers: views.map((v) => ({
      id: v.id,
      name: v.user.name,
      role: v.user.role,
      viewedAt: v.viewedAt.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    }))
  };
});

const views_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: views_get
}, Symbol.toStringTag, { value: 'Module' }));

const generateQr_post = defineEventHandler(async (event) => {
  const scope = await getOperatorScope(event);
  const body = await readBody(event);
  const { ekskulId, latitude, longitude, radius, locationName } = body;
  if (!ekskulId) {
    throw createError({ statusCode: 400, message: "ekskulId wajib diisi." });
  }
  assertScope(scope, ekskulId);
  let lat = null;
  let lng = null;
  let rad = null;
  if (latitude != null && longitude != null) {
    lat = Number(latitude);
    lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({ statusCode: 400, message: "Koordinat lokasi absensi tidak valid." });
    }
    rad = Math.max(50, Math.min(2e3, Number(radius) || 200));
  }
  const token = crypto$1.randomBytes(12).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1e3);
  const auth = event.context.auth;
  const session = await prisma.attendanceSession.create({
    data: {
      extracurricularId: ekskulId,
      qrToken: token,
      qrExpiresAt: expiresAt,
      createdById: auth.userId,
      date: /* @__PURE__ */ new Date(),
      latitude: lat,
      longitude: lng,
      radius: rad,
      locationName: typeof locationName === "string" && locationName.trim() ? locationName.trim() : null
    }
  });
  return {
    id: session.id,
    token,
    expiresAt: expiresAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    locationName: session.locationName
  };
});

const generateQr_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: generateQr_post
}, Symbol.toStringTag, { value: 'Module' }));

const history_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const sessions = await prisma.attendanceSession.findMany({
    where: { extracurricular: { institutionId: auth.institutionId, ...scopeRelationFilter(scope) } },
    include: {
      extracurricular: { select: { name: true } },
      records: {
        include: { student: { select: { nis: true, name: true, class: true } } },
        orderBy: { createdAt: "asc" }
      }
    },
    orderBy: { date: "desc" },
    take: 50
  });
  return sessions.map((s) => {
    const total = s.records.length;
    const hadir = s.records.filter((r) => r.status === "hadir").length;
    return {
      id: s.id,
      date: s.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      ekskul: s.extracurricular.name,
      ekskulId: s.extracurricularId,
      hadir,
      total,
      status: s.qrExpiresAt > /* @__PURE__ */ new Date() ? "Berlangsung" : "Selesai",
      locationName: s.locationName,
      // Detail per siswa: siapa hadir, izin, alpha, beserta keterangan/alasan
      records: s.records.map((r) => ({
        id: r.id,
        studentId: r.studentId,
        student: r.student.name,
        nis: r.student.nis,
        class: r.student.class,
        status: r.status,
        time: r.time || null,
        notes: r.notes || null
      }))
    };
  });
});

const history_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: history_get
}, Symbol.toStringTag, { value: 'Module' }));

const mark_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const { sessionId, studentId, status, notes } = await readBody(event);
  if (!sessionId || !studentId) {
    throw createError({ statusCode: 400, message: "Sesi dan siswa wajib diisi." });
  }
  const allowed = ["hadir", "izin", "alpha"];
  if (!allowed.includes(status)) {
    throw createError({ statusCode: 400, message: "Status tidak valid." });
  }
  const session = await prisma.attendanceSession.findUnique({
    where: { id: sessionId },
    include: { extracurricular: { select: { id: true, name: true, institutionId: true } } }
  });
  if (!session) throw createError({ statusCode: 404, message: "Sesi tidak ditemukan." });
  if (session.extracurricular.institutionId !== auth.institutionId) {
    throw createError({ statusCode: 403, message: "Sesi di luar instansi Anda." });
  }
  assertScope(scope, session.extracurricularId);
  const student = await prisma.student.findFirst({
    where: { id: studentId, institutionId: auth.institutionId }
  });
  if (!student) throw createError({ statusCode: 404, message: "Siswa tidak ditemukan." });
  const existing = await prisma.attendanceRecord.findFirst({
    where: { studentId, sessionId: session.id }
  });
  const record = existing ? await prisma.attendanceRecord.update({
    where: { id: existing.id },
    data: {
      status,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : existing.notes,
      time: status === "hadir" ? existing.time || formatSchoolTimeServer(/* @__PURE__ */ new Date(), null, { hour: "2-digit", minute: "2-digit" }) : existing.time
    },
    include: { student: { select: { nis: true, name: true, class: true } } }
  }) : await prisma.attendanceRecord.create({
    data: {
      studentId,
      extracurricularId: session.extracurricularId,
      status,
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
      date: session.date,
      time: status === "hadir" ? formatSchoolTimeServer(/* @__PURE__ */ new Date(), null, { hour: "2-digit", minute: "2-digit" }) : null,
      sessionId: session.id
    },
    include: { student: { select: { nis: true, name: true, class: true } } }
  });
  if (status === "alpha") {
    const adaIzin = await prisma.attendanceRecord.findFirst({
      where: { studentId, extracurricularId: session.extracurricularId, status: "izin", date: session.date }
    });
    const studentUser = await prisma.user.findFirst({
      where: { studentId, institutionId: auth.institutionId }
    });
    if (!adaIzin && studentUser) {
      const dateLabel = session.date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
      await prisma.notification.upsert({
        where: { key: `alpha:${record.id}:${studentUser.id}` },
        update: {
          title: `Peringatan: tercatat tidak hadir tanpa surat izin`,
          body: `${session.extracurricular.name} \xB7 ${dateLabel}. Tidak hadir wajib disertai surat izin \u2014 segera serahkan ke pembimbing.`,
          link: "/siswa/calendar"
        },
        create: {
          key: `alpha:${record.id}:${studentUser.id}`,
          userId: studentUser.id,
          institutionId: auth.institutionId,
          type: "izin",
          title: `Peringatan: tercatat tidak hadir tanpa surat izin`,
          body: `${session.extracurricular.name} \xB7 ${dateLabel}. Tidak hadir wajib disertai surat izin \u2014 segera serahkan ke pembimbing.`,
          link: "/siswa/calendar"
        }
      });
    }
  }
  return {
    id: record.id,
    student: record.student.name,
    nis: record.student.nis,
    status,
    warning: status === "alpha"
  };
});

const mark_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: mark_post
}, Symbol.toStringTag, { value: 'Module' }));

const session_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const body = await readBody(event);
  const { extracurricularId, latitude, longitude, radius, locationName } = body;
  if (!extracurricularId) {
    throw createError({ statusCode: 400, message: "Ekskul wajib diisi." });
  }
  assertScope(scope, extracurricularId);
  let lat = null;
  let lng = null;
  let rad = null;
  if (latitude != null && longitude != null) {
    lat = Number(latitude);
    lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({ statusCode: 400, message: "Koordinat lokasi absensi tidak valid." });
    }
    rad = Math.max(50, Math.min(2e3, Number(radius) || 200));
  }
  const token = crypto$1.randomBytes(12).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1e3);
  const session = await prisma.attendanceSession.create({
    data: {
      extracurricularId,
      qrToken: token,
      qrExpiresAt: expiresAt,
      createdById: auth.userId,
      date: /* @__PURE__ */ new Date(),
      latitude: lat,
      longitude: lng,
      radius: rad,
      locationName: typeof locationName === "string" && locationName.trim() ? locationName.trim() : null
    }
  });
  return {
    id: session.id,
    token: session.qrToken,
    expiresAt: expiresAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    locationName: session.locationName
  };
});

const session_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: session_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__get$2 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const session = await prisma.attendanceSession.findUnique({
    where: { id },
    include: {
      records: {
        include: { student: { select: { nis: true, name: true, class: true } } },
        orderBy: { createdAt: "desc" }
      },
      extracurricular: { select: { name: true } }
    }
  });
  if (!session) throw createError({ statusCode: 404, message: "Sesi absensi tidak ditemukan." });
  const scope = await getOperatorScope(event);
  if (scope.isScoped && scope.extracurricularId !== session.extracurricularId) {
    throw createError({ statusCode: 403, message: "Anda hanya dapat mengakses data ekskul Anda sendiri." });
  }
  return {
    id: session.id,
    token: session.qrToken,
    expiresAt: session.qrExpiresAt,
    ekskul: session.extracurricular.name,
    date: session.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    locationName: session.locationName,
    records: session.records.map((r) => ({
      id: r.id,
      nis: r.student.nis,
      name: r.student.name,
      class: r.student.class,
      status: r.status,
      time: r.time,
      notes: r.notes
    }))
  };
});

const _id__get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__get$2
}, Symbol.toStringTag, { value: 'Module' }));

const board_get$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const positions = await prisma.boardPosition.findMany({
    where: {
      institutionId: auth.institutionId,
      ...scopeFilter(scope, getQuery$1(event).ekskulId)
    },
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });
  return positions.map((p) => ({
    id: p.id,
    name: p.name,
    className: p.className,
    position: p.position,
    photoUrl: p.photoUrl,
    sortOrder: p.sortOrder,
    ekskulId: p.extracurricularId,
    ekskul: p.extracurricular.name,
    ekskulLogo: p.extracurricular.logoUrl
  }));
});

const board_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: board_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const board_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const body = await readBody(event);
  const { name, className, position, photoUrl, sortOrder, extracurricularId } = body;
  if (!name || !position) {
    throw createError({ statusCode: 400, message: "Nama dan jabatan wajib diisi." });
  }
  assertScope(scope, extracurricularId);
  const created = await prisma.boardPosition.create({
    data: {
      name,
      className: typeof className === "string" && className ? className : null,
      position,
      photoUrl: typeof photoUrl === "string" && photoUrl ? photoUrl : null,
      sortOrder: Number(sortOrder) || 0,
      extracurricularId,
      institutionId: auth.institutionId
    },
    include: { extracurricular: { select: { name: true, logoUrl: true } } }
  });
  return {
    id: created.id,
    name: created.name,
    className: created.className,
    position: created.position,
    photoUrl: created.photoUrl,
    sortOrder: created.sortOrder,
    ekskulId: created.extracurricularId,
    ekskul: created.extracurricular.name,
    ekskulLogo: created.extracurricular.logoUrl
  };
});

const board_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: board_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$g = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const existing = await prisma.boardPosition.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Jabatan tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, existing.extracurricularId);
  await prisma.boardPosition.delete({ where: { id } });
  return { success: true };
});

const _id__delete$h = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$g
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$e = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const existing = await prisma.boardPosition.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Jabatan tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, existing.extracurricularId);
  const body = await readBody(event);
  const data = {};
  if (body.name !== void 0) data.name = body.name;
  if (body.className !== void 0) data.className = typeof body.className === "string" && body.className ? body.className : null;
  if (body.position !== void 0) data.position = body.position;
  if (body.photoUrl !== void 0) data.photoUrl = typeof body.photoUrl === "string" && body.photoUrl ? body.photoUrl : null;
  if (body.sortOrder !== void 0) data.sortOrder = Number(body.sortOrder) || 0;
  const updated = await prisma.boardPosition.update({
    where: { id },
    data,
    include: { extracurricular: { select: { name: true, logoUrl: true } } }
  });
  return {
    id: updated.id,
    name: updated.name,
    className: updated.className,
    position: updated.position,
    photoUrl: updated.photoUrl,
    sortOrder: updated.sortOrder,
    ekskulId: updated.extracurricularId,
    ekskul: updated.extracurricular.name,
    ekskulLogo: updated.extracurricular.logoUrl
  };
});

const _id__put$f = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$e
}, Symbol.toStringTag, { value: 'Module' }));

const structure_get = defineEventHandler(async (event) => {
  var _a;
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const ekskuls = await prisma.extracurricular.findMany({
    where: {
      institutionId: auth.institutionId,
      ...scope.isScoped ? { id: (_a = scope.extracurricularId) != null ? _a : "" } : {}
    },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      structureMode: true,
      structureImageUrl: true,
      structureTheme: true,
      _count: { select: { boardPositions: true } }
    },
    orderBy: { name: "asc" }
  });
  return ekskuls.map((e) => ({
    ekskulId: e.id,
    ekskul: e.name,
    ekskulLogo: e.logoUrl,
    mode: e.structureMode,
    imageUrl: e.structureImageUrl,
    theme: e.structureTheme,
    positionCount: e._count.boardPositions
  }));
});

const structure_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: structure_get
}, Symbol.toStringTag, { value: 'Module' }));

const STRUCTURE_MODES = ["cards", "image"];
const STRUCTURE_THEMES = ["indigo", "sunset", "forest"];
const _id__put$c = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const ekskul = await prisma.extracurricular.findUnique({ where: { id } });
  if (!ekskul) throw createError({ statusCode: 404, message: "Ekskul tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, ekskul.id);
  const body = await readBody(event);
  const data = {};
  if (body.mode !== void 0) {
    if (!STRUCTURE_MODES.includes(body.mode)) {
      throw createError({ statusCode: 400, message: "Mode struktur tidak valid." });
    }
    data.structureMode = body.mode;
  }
  if (body.imageUrl !== void 0) {
    data.structureImageUrl = typeof body.imageUrl === "string" && body.imageUrl ? body.imageUrl : null;
  }
  if (body.theme !== void 0) {
    if (!STRUCTURE_THEMES.includes(body.theme)) {
      throw createError({ statusCode: 400, message: "Tema struktur tidak valid." });
    }
    data.structureTheme = body.theme;
  }
  const updated = await prisma.extracurricular.update({ where: { id }, data });
  return {
    ekskulId: updated.id,
    ekskul: updated.name,
    ekskulLogo: updated.logoUrl,
    mode: updated.structureMode,
    imageUrl: updated.structureImageUrl,
    theme: updated.structureTheme
  };
});

const _id__put$d = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$c
}, Symbol.toStringTag, { value: 'Module' }));

const dayNames = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
const dashboard_get$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const instId = auth.institutionId;
  const scope = await getOperatorScope(event);
  const scopeF = scopeFilter(scope);
  const scopeRel = scopeRelationFilter(scope);
  const ekskulWhere = scope.isScoped ? scope.extracurricularId ? { institutionId: instId, id: scope.extracurricularId } : { institutionId: instId, id: "" } : { institutionId: instId };
  const today = /* @__PURE__ */ new Date();
  const todayName = dayNames[today.getDay()];
  let myEkskul = "";
  if (scope.isScoped && scope.extracurricularId) {
    const ex = await prisma.extracurricular.findUnique({
      where: { id: scope.extracurricularId },
      select: { name: true }
    });
    myEkskul = (ex == null ? void 0 : ex.name) || "";
  }
  const [activeMembers, uniqueEkskul, ekskulRows, recordStatusRows, todaySchedules, weekRecords, pollsCount, newsCount, galleryCount, sessions] = await Promise.all([
    prisma.member.count({ where: { status: "active", student: { institutionId: instId }, ...scopeF } }),
    prisma.extracurricular.count({ where: ekskulWhere }),
    prisma.extracurricular.findMany({
      where: ekskulWhere,
      select: { name: true, _count: { select: { members: { where: { status: "active" } } } } },
      orderBy: { name: "asc" }
    }),
    prisma.attendanceRecord.groupBy({
      by: ["status"],
      where: { extracurricular: { institutionId: instId, ...scopeRel } },
      _count: { _all: true }
    }),
    prisma.schedule.findMany({
      where: { institutionId: instId, day: todayName, ...scopeF },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { timeStart: "asc" }
    }),
    prisma.attendanceRecord.findMany({
      where: {
        extracurricular: { institutionId: instId, ...scopeRel },
        date: { gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1e3) }
      },
      select: { date: true, status: true }
    }),
    prisma.poll.count({ where: { institutionId: instId, active: true, ...scopeF } }),
    prisma.news.count({ where: { institutionId: instId, ...scopeF } }),
    prisma.gallery.count({ where: { institutionId: instId, ...scopeF } }),
    prisma.attendanceSession.findMany({
      where: { extracurricular: { institutionId: instId, ...scopeRel } },
      include: { extracurricular: { select: { name: true } }, _count: { select: { records: true } } },
      orderBy: { date: "desc" },
      take: 5
    })
  ]);
  const statusMap = {};
  for (const r of recordStatusRows) {
    const key = r.status === "hadir" ? "Hadir" : r.status === "izin" ? "Izin" : "Alpha";
    statusMap[key] = (statusMap[key] || 0) + r._count._all;
  }
  const trendLabels = [];
  const trendData = [];
  for (let i = 6; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toLocaleDateString("id-ID", { weekday: "short" });
    trendLabels.push(dStr);
    const dayRecords = weekRecords.filter((r) => {
      const rd = new Date(r.date);
      return rd.getDate() === d.getDate() && rd.getMonth() === d.getMonth() && rd.getFullYear() === d.getFullYear();
    });
    trendData.push(dayRecords.filter((r) => r.status === "hadir").length);
  }
  const todayRecords = await prisma.attendanceRecord.count({
    where: {
      extracurricular: { institutionId: instId, ...scopeRel },
      date: { gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()), lt: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1) }
    }
  });
  return {
    totalMembers: activeMembers,
    activeEkskul: uniqueEkskul,
    attendanceToday: todayRecords,
    myEkskul,
    attendanceHistory: sessions.map((s) => ({
      date: s.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      ekskul: s.extracurricular.name,
      hadir: s._count.records,
      total: s._count.records,
      status: s.qrExpiresAt > /* @__PURE__ */ new Date() ? "Berlangsung" : "Selesai"
    })),
    activePolls: pollsCount,
    newsCount,
    galleryCount,
    todaySchedule: todaySchedules.map((s) => ({
      id: s.id,
      ekskul: s.extracurricular.name,
      time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
      location: s.location,
      coach: s.coach,
      mandatory: s.mandatory,
      status: "akan_datang"
    })),
    charts: {
      membersPerEkskul: {
        labels: ekskulRows.map((e) => e.name),
        data: ekskulRows.map((e) => e._count.members)
      },
      attendanceStatus: {
        labels: ["Hadir", "Izin", "Alpha"],
        data: [statusMap["Hadir"] || 0, statusMap["Izin"] || 0, statusMap["Alpha"] || 0]
      },
      weeklyTrend: {
        labels: trendLabels,
        data: trendData
      }
    }
  };
});

const dashboard_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dashboard_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const logo_put = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  if (!scope.isScoped || !scope.extracurricularId) {
    throw createError({ statusCode: 403, message: "Akun belum diikat ke ekskul. Hubungi admin." });
  }
  const { logoUrl } = await readBody(event);
  if (typeof logoUrl !== "string") {
    throw createError({ statusCode: 400, message: "URL logo tidak valid." });
  }
  const ekskul = await prisma.extracurricular.findFirst({
    where: { id: scope.extracurricularId, institutionId: auth.institutionId }
  });
  if (!ekskul) throw createError({ statusCode: 404, message: "Ekskul tidak ditemukan." });
  return prisma.extracurricular.update({
    where: { id: ekskul.id },
    data: { logoUrl: logoUrl || null }
  });
});

const logo_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: logo_put
}, Symbol.toStringTag, { value: 'Module' }));

const gallery_get$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const galleries = await prisma.gallery.findMany({
    where: { institutionId: auth.institutionId, ...scopeFilter(scope) },
    include: {
      extracurricular: { select: { name: true, logoUrl: true } },
      images: { select: { id: true, url: true }, orderBy: { createdAt: "asc" } }
    },
    orderBy: { date: "desc" }
  });
  return galleries.map((g) => ({
    id: g.id,
    title: g.title,
    ekskul: g.extracurricular.name,
    ekskulLogo: g.extracurricular.logoUrl,
    ekskulId: g.extracurricularId,
    date: g.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    color: g.color,
    imageCount: g.imageCount,
    images: g.images
  }));
});

const gallery_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: gallery_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const gallery_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const { title, extracurricularId, color, imageUrls } = await readBody(event);
  if (!title || !extracurricularId) {
    throw createError({ statusCode: 400, message: "Judul dan ekskul wajib diisi." });
  }
  assertScope(scope, extracurricularId);
  const gallery = await prisma.gallery.create({
    data: {
      title,
      color: color || "#4A9E9E",
      imageCount: (imageUrls == null ? void 0 : imageUrls.length) || 0,
      extracurricularId,
      institutionId: auth.institutionId,
      images: (imageUrls == null ? void 0 : imageUrls.length) ? { create: imageUrls.map((url) => ({ url })) } : void 0
    },
    include: {
      extracurricular: { select: { name: true } },
      images: { select: { id: true, url: true } }
    }
  });
  return {
    id: gallery.id,
    title: gallery.title,
    ekskul: gallery.extracurricular.name,
    ekskulId: gallery.extracurricularId,
    date: gallery.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    color: gallery.color,
    imageCount: gallery.imageCount
  };
});

const gallery_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: gallery_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$e = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const gallery = await prisma.gallery.findUnique({ where: { id } });
  if (!gallery) throw createError({ statusCode: 404, message: "Galeri tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, gallery.extracurricularId);
  await prisma.galleryImage.deleteMany({ where: { galleryId: id } });
  await prisma.gallery.delete({ where: { id } });
  return { success: true };
});

const _id__delete$f = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$e
}, Symbol.toStringTag, { value: 'Module' }));

const materials_get$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery$1(event);
  const scope = await getOperatorScope(event);
  const where = { institutionId: auth.institutionId, ...scopeFilter(scope, query.ekskulId) };
  const materials = await prisma.extracurricularMaterial.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: { select: { name: true } },
      extracurricular: { select: { name: true } }
    }
  });
  return materials.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    fileUrl: m.fileUrl,
    fileType: m.fileType,
    content: m.content,
    ekskul: m.extracurricular.name,
    ekskulId: m.extracurricularId,
    uploadedBy: m.uploadedBy.name,
    createdAt: m.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  }));
});

const materials_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: materials_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const materials_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const { title, description, fileUrl, fileType, content, extracurricularId } = await readBody(event);
  if (!title || !extracurricularId) {
    throw createError({ statusCode: 400, message: "Judul dan ekskul wajib diisi." });
  }
  assertScope(scope, extracurricularId);
  if (!fileUrl && !content) {
    throw createError({ statusCode: 400, message: "Upload file atau isi konten terlebih dahulu." });
  }
  const material = await prisma.extracurricularMaterial.create({
    data: {
      title,
      description,
      fileUrl,
      fileType: fileType || "link",
      content,
      extracurricularId,
      uploadedById: auth.userId,
      institutionId: auth.institutionId
    },
    include: {
      uploadedBy: { select: { name: true } },
      extracurricular: { select: { name: true } }
    }
  });
  return {
    id: material.id,
    title: material.title,
    description: material.description,
    fileUrl: material.fileUrl,
    fileType: material.fileType,
    content: material.content,
    ekskul: material.extracurricular.name,
    ekskulId: material.extracurricularId,
    uploadedBy: material.uploadedBy.name,
    createdAt: material.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  };
});

const materials_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: materials_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$c = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const material = await prisma.extracurricularMaterial.findFirst({
    where: { id, institutionId: auth.institutionId }
  });
  if (!material) {
    throw createError({ statusCode: 404, message: "Materi tidak ditemukan." });
  }
  const scope = await getOperatorScope(event);
  assertScope(scope, material.extracurricularId);
  await prisma.extracurricularMaterial.delete({ where: { id } });
  return { success: true };
});

const _id__delete$d = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$c
}, Symbol.toStringTag, { value: 'Module' }));

const members_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery$1(event);
  const scope = await getOperatorScope(event);
  const members = await prisma.member.findMany({
    where: {
      student: { institutionId: auth.institutionId },
      ...scopeFilter(scope, query.ekskulId)
    },
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return members.map((m) => ({
    id: m.id,
    studentId: m.studentId,
    nis: m.student.nis,
    name: m.student.name,
    class: m.student.class,
    ekskul: m.extracurricular.name,
    ekskulId: m.extracurricular.id,
    joinDate: m.joinDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    status: m.status
  }));
});

const members_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: members_get
}, Symbol.toStringTag, { value: 'Module' }));

const members_post = defineEventHandler(async (event) => {
  const scope = await getOperatorScope(event);
  const { studentId, extracurricularId } = await readBody(event);
  if (!studentId || !extracurricularId) {
    throw createError({ statusCode: 400, message: "Siswa dan ekskul wajib diisi." });
  }
  assertScope(scope, extracurricularId);
  const existing = await prisma.member.findUnique({
    where: { studentId_extracurricularId: { studentId, extracurricularId } }
  });
  if (existing) {
    throw createError({ statusCode: 409, message: "Siswa sudah terdaftar di ekskul ini." });
  }
  const member = await prisma.member.create({
    data: { studentId, extracurricularId },
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } }
    }
  });
  return {
    id: member.id,
    studentId: member.studentId,
    nis: member.student.nis,
    name: member.student.name,
    class: member.student.class,
    ekskul: member.extracurricular.name,
    ekskulId: member.extracurricular.id,
    joinDate: member.joinDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    status: member.status
  };
});

const members_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: members_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$a = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw createError({ statusCode: 404, message: "Anggota tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, member.extracurricularId);
  await prisma.member.delete({ where: { id } });
  return { success: true };
});

const _id__delete$b = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$a
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$a = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const member = await prisma.member.findUnique({ where: { id } });
  if (!member) throw createError({ statusCode: 404, message: "Anggota tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, member.extracurricularId);
  const updated = await prisma.member.update({
    where: { id },
    data: { status: member.status === "active" ? "inactive" : "active" }
  });
  return { success: true, status: updated.status };
});

const _id__put$b = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$a
}, Symbol.toStringTag, { value: 'Module' }));

const news_get$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery$1(event);
  const scope = await getOperatorScope(event);
  const where = { institutionId: auth.institutionId, ...scopeFilter(scope, query.ekskulId) };
  const news = await prisma.news.findMany({
    where,
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
    orderBy: { createdAt: "desc" }
  });
  return news.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    isPublic: n.isPublic,
    displayStatus: n.displayStatus,
    ekskul: n.extracurricular.name,
    ekskulLogo: n.extracurricular.logoUrl,
    ekskulId: n.extracurricularId,
    author: n.author,
    date: n.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  }));
});

const news_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: news_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const news_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const { title, content, isPublic, extracurricularId, author } = await readBody(event);
  if (!title || !content || !extracurricularId || !author) {
    throw createError({ statusCode: 400, message: "Judul, konten, ekskul, dan penulis wajib diisi." });
  }
  assertScope(scope, extracurricularId);
  const news = await prisma.news.create({
    data: { title, content, isPublic: !!isPublic, author, extracurricularId, institutionId: auth.institutionId, createdById: auth.userId, displayStatus: "none" },
    include: { extracurricular: { select: { name: true } } }
  });
  return {
    id: news.id,
    title: news.title,
    content: news.content,
    isPublic: news.isPublic,
    displayStatus: news.displayStatus,
    ekskul: news.extracurricular.name,
    ekskulId: news.extracurricularId,
    author: news.author,
    date: news.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  };
});

const news_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: news_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$8 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Berita tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, existing.extracurricularId);
  await prisma.news.delete({ where: { id } });
  return { success: true };
});

const _id__delete$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$8
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$8 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) throw createError({ statusCode: 404, message: "Berita tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, existing.extracurricularId);
  const { title, content, isPublic, extracurricularId, author, displayStatus } = await readBody(event);
  if (extracurricularId) assertScope(scope, extracurricularId);
  if (displayStatus !== void 0) {
    if (!["pending", "none"].includes(displayStatus)) {
      throw createError({ statusCode: 403, message: "Hanya admin yang dapat menyetujui atau menolak pengajuan tampil." });
    }
  }
  const updated = await prisma.news.update({
    where: { id },
    data: {
      title,
      content,
      isPublic: !!isPublic,
      author,
      extracurricularId,
      ...displayStatus !== void 0 ? { displayStatus } : {}
    }
  });
  return { success: true, displayStatus: updated.displayStatus };
});

const _id__put$9 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$8
}, Symbol.toStringTag, { value: 'Module' }));

const polls_get$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const polls = await prisma.poll.findMany({
    where: { institutionId: auth.institutionId, ...scopeFilter(scope) },
    include: {
      options: { select: { id: true, label: true, votesCount: true } },
      extracurricular: { select: { name: true, logoUrl: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return polls.map((p) => ({
    id: p.id,
    question: p.question,
    options: p.options.map((o) => ({ id: o.id, label: o.label, votes: o.votesCount })),
    ekskul: p.extracurricular.name,
    ekskulLogo: p.extracurricular.logoUrl,
    ekskulId: p.extracurricularId,
    endDate: p.endDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    active: p.active
  }));
});

const polls_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: polls_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const polls_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const { question, options, extracurricularId, endDate } = await readBody(event);
  if (!question || !(options == null ? void 0 : options.length) || !extracurricularId || !endDate) {
    throw createError({ statusCode: 400, message: "Pertanyaan, opsi, ekskul, dan tanggal berakhir wajib diisi." });
  }
  assertScope(scope, extracurricularId);
  const poll = await prisma.poll.create({
    data: {
      question,
      endDate: new Date(endDate),
      active: true,
      extracurricularId,
      institutionId: auth.institutionId,
      createdById: auth.userId,
      options: { create: options.map((o) => ({ label: o })) }
    },
    include: {
      options: { select: { id: true, label: true, votesCount: true } },
      extracurricular: { select: { name: true } }
    }
  });
  return {
    id: poll.id,
    question: poll.question,
    options: poll.options.map((o) => ({ id: o.id, label: o.label, votes: o.votesCount })),
    ekskul: poll.extracurricular.name,
    ekskulId: poll.extracurricularId,
    endDate: poll.endDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    active: poll.active
  };
});

const polls_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: polls_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$6 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const poll = await prisma.poll.findUnique({ where: { id } });
  if (!poll) throw createError({ statusCode: 404, message: "Voting tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, poll.extracurricularId);
  await prisma.pollVote.deleteMany({ where: { pollId: id } });
  await prisma.pollOption.deleteMany({ where: { pollId: id } });
  await prisma.poll.delete({ where: { id } });
  return { success: true };
});

const _id__delete$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$6
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$6 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const poll = await prisma.poll.findUnique({ where: { id } });
  if (!poll) throw createError({ statusCode: 404, message: "Voting tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, poll.extracurricularId);
  const updated = await prisma.poll.update({
    where: { id },
    data: { active: !poll.active }
  });
  return { success: true, active: updated.active };
});

const _id__put$7 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$6
}, Symbol.toStringTag, { value: 'Module' }));

const profile_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    include: { extracurricularOperator: { select: { id: true, name: true, logoUrl: true } } }
  });
  if (!user) throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    phone: user.phone || "",
    email: user.email || "",
    avatar: user.avatarUrl || null,
    ekskul: user.extracurricularOperator ? { id: user.extracurricularOperator.id, name: user.extracurricularOperator.name, logo: user.extracurricularOperator.logoUrl } : null
  };
});

const profile_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: profile_get
}, Symbol.toStringTag, { value: 'Module' }));

const profile_put$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, phone, email, avatarUrl } = await readBody(event);
  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: {
      ...name !== void 0 ? { name } : {},
      ...phone !== void 0 ? { phone } : {},
      ...email !== void 0 ? { email } : {},
      ...avatarUrl !== void 0 ? { avatarUrl } : {}
    }
  });
  return { success: true, avatar: user.avatarUrl || null, name: user.name };
});

const profile_put$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: profile_put$2
}, Symbol.toStringTag, { value: 'Module' }));

const schedule_get$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery$1(event);
  const scope = await getOperatorScope(event);
  const where = { institutionId: auth.institutionId, ...scopeFilter(scope, query.ekskulId) };
  const schedules = await prisma.schedule.findMany({
    where,
    include: { extracurricular: { select: { name: true } } },
    orderBy: [{ day: "asc" }, { timeStart: "asc" }]
  });
  return schedules.map((s) => ({
    id: s.id,
    day: s.day,
    date: s.date ? s.date.toISOString().slice(0, 10) : null,
    timeStart: s.timeStart,
    timeEnd: s.timeEnd,
    time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
    ekskul: s.extracurricular.name,
    ekskulId: s.extracurricularId,
    coach: s.coach,
    location: s.location,
    latitude: s.latitude,
    longitude: s.longitude,
    radius: s.radius,
    mandatory: s.mandatory
  }));
});

const schedule_get$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: schedule_get$2
}, Symbol.toStringTag, { value: 'Module' }));

const schedule_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const scope = await getOperatorScope(event);
  const { day, date, timeStart, timeEnd, coach, location, extracurricularId, mandatory, latitude, longitude, radius } = await readBody(event);
  if (!day || !timeStart || !coach || !location || !extracurricularId) {
    throw createError({ statusCode: 400, message: "Semua field wajib diisi." });
  }
  assertScope(scope, extracurricularId);
  let lat = null;
  let lng = null;
  if (latitude != null && longitude != null) {
    lat = Number(latitude);
    lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({ statusCode: 400, message: "Koordinat lokasi pertemuan tidak valid." });
    }
  }
  const schedule = await prisma.schedule.create({
    data: {
      day,
      ...date ? { date: new Date(date) } : {},
      timeStart,
      timeEnd,
      coach,
      location,
      extracurricularId,
      mandatory: mandatory !== false,
      institutionId: auth.institutionId,
      latitude: lat,
      longitude: lng,
      radius: lat != null ? Math.max(50, Math.min(2e3, Number(radius) || 200)) : null
    },
    include: { extracurricular: { select: { name: true } } }
  });
  return {
    id: schedule.id,
    day: schedule.day,
    date: schedule.date ? schedule.date.toISOString().slice(0, 10) : null,
    timeStart: schedule.timeStart,
    timeEnd: schedule.timeEnd,
    time: schedule.timeEnd ? `${schedule.timeStart} - ${schedule.timeEnd}` : schedule.timeStart,
    ekskul: schedule.extracurricular.name,
    ekskulId: schedule.extracurricularId,
    coach: schedule.coach,
    location: schedule.location,
    latitude: schedule.latitude,
    longitude: schedule.longitude,
    radius: schedule.radius,
    mandatory: schedule.mandatory
  };
});

const schedule_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: schedule_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$4 = defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const schedule = await prisma.schedule.findUnique({ where: { id } });
  if (!schedule) throw createError({ statusCode: 404, message: "Jadwal tidak ditemukan." });
  const scope = await getOperatorScope(event);
  assertScope(scope, schedule.extracurricularId);
  await prisma.schedule.delete({ where: { id } });
  return { success: true };
});

const _id__delete$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$4
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$4 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const scope = await getOperatorScope(event);
  const { day, date, timeStart, timeEnd, coach, location, extracurricularId, mandatory, latitude, longitude, radius } = await readBody(event);
  if (extracurricularId) assertScope(scope, extracurricularId);
  const existing = await prisma.schedule.findFirst({ where: { id, institutionId: auth.institutionId } });
  if (!existing) throw createError({ statusCode: 404, message: "Jadwal tidak ditemukan." });
  assertScope(scope, existing.extracurricularId);
  let lat = null;
  let lng = null;
  if (latitude != null && longitude != null) {
    lat = Number(latitude);
    lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw createError({ statusCode: 400, message: "Koordinat lokasi pertemuan tidak valid." });
    }
  }
  const schedule = await prisma.schedule.update({
    where: { id },
    data: {
      day,
      timeStart,
      timeEnd,
      coach,
      location,
      extracurricularId,
      mandatory: mandatory !== void 0 ? mandatory : void 0,
      ...date !== void 0 ? { date: date ? new Date(date) : null } : {},
      latitude: latitude !== void 0 ? lat : void 0,
      longitude: longitude !== void 0 ? lng : void 0,
      radius: latitude !== void 0 ? lat != null ? Math.max(50, Math.min(2e3, Number(radius) || 200)) : null : void 0
    },
    include: { extracurricular: { select: { name: true } } }
  });
  return {
    id: schedule.id,
    day: schedule.day,
    date: schedule.date ? schedule.date.toISOString().slice(0, 10) : null,
    timeStart: schedule.timeStart,
    timeEnd: schedule.timeEnd,
    time: schedule.timeEnd ? `${schedule.timeStart} - ${schedule.timeEnd}` : schedule.timeStart,
    ekskul: schedule.extracurricular.name,
    ekskulId: schedule.extracurricularId,
    coach: schedule.coach,
    location: schedule.location,
    latitude: schedule.latitude,
    longitude: schedule.longitude,
    radius: schedule.radius,
    mandatory: schedule.mandatory
  };
});

const _id__put$5 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$4
}, Symbol.toStringTag, { value: 'Module' }));

const ALLOWED_TYPES$1 = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "text/plain"
];
const MAX_SIZE$1 = 10 * 1024 * 1024;
const upload_post$3 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  if (!auth) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: "Tidak ada file yang diupload." });
  }
  const fileField = formData.find((f) => f.name === "file");
  if (!fileField || !fileField.filename) {
    throw createError({ statusCode: 400, message: "File tidak valid." });
  }
  if (!ALLOWED_TYPES$1.includes(fileField.type)) {
    throw createError({ statusCode: 400, message: "Tipe file tidak diizinkan. Gunakan PDF, gambar, atau dokumen." });
  }
  if (fileField.data.length > MAX_SIZE$1) {
    throw createError({ statusCode: 400, message: "Ukuran file maksimal 10MB." });
  }
  const ext = fileField.filename.split(".").pop() || "bin";
  const fileName = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads");
  const filePath = join(uploadDir, fileName);
  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, fileField.data);
  } catch (e) {
    throw createError({ statusCode: 500, message: "Gagal menyimpan file." });
  }
  const fileUrl = `/uploads/${fileName}`;
  return {
    url: fileUrl,
    filename: fileField.filename,
    size: fileField.data.length,
    type: fileField.type
  };
});

const upload_post$4 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: upload_post$3
}, Symbol.toStringTag, { value: 'Module' }));

const settings_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  if (!(auth == null ? void 0 : auth.institutionId)) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const inst = await prisma.institution.findUnique({ where: { id: auth.institutionId } });
  if (!inst) throw createError({ statusCode: 404, message: "Sekolah tidak ditemukan." });
  return inst;
});

const settings_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: settings_get
}, Symbol.toStringTag, { value: 'Module' }));

const reference_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const [students, extracurriculars] = await Promise.all([
    prisma.student.findMany({
      where: { institutionId: auth.institutionId },
      orderBy: { name: "asc" }
    }),
    prisma.extracurricular.findMany({
      where: { institutionId: auth.institutionId },
      include: {
        teacher: { select: { name: true } },
        _count: { select: { members: true } }
      },
      orderBy: { name: "asc" }
    })
  ]);
  return { students, extracurriculars };
});

const reference_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: reference_get
}, Symbol.toStringTag, { value: 'Module' }));

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const upload_post$1 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  if (!auth) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, message: "Tidak ada file yang diupload." });
  }
  const fileField = formData.find((f) => f.name === "file");
  if (!fileField || !fileField.filename) {
    throw createError({ statusCode: 400, message: "File tidak valid." });
  }
  if (!ALLOWED_TYPES.includes(fileField.type)) {
    throw createError({ statusCode: 400, message: "Tipe file tidak diizinkan. Gunakan gambar JPG, PNG, GIF, atau WEBP." });
  }
  if (fileField.data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, message: "Ukuran file maksimal 5MB." });
  }
  const ext = fileField.filename.split(".").pop() || "png";
  const fileName = `${randomUUID()}.${ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads");
  const filePath = join(uploadDir, fileName);
  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, fileField.data);
  } catch {
    throw createError({ statusCode: 500, message: "Gagal menyimpan file." });
  }
  return {
    url: `/uploads/${fileName}`,
    filename: fileField.filename,
    size: fileField.data.length,
    type: fileField.type
  };
});

const upload_post$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: upload_post$1
}, Symbol.toStringTag, { value: 'Module' }));

const achievements_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const achievements = await prisma.achievement.findMany({
    where: auth.studentId ? { studentId: auth.studentId } : { student: { institutionId: auth.institutionId } },
    include: {
      extracurricular: { select: { name: true } },
      student: { select: { name: true, class: true } }
    },
    orderBy: { date: "desc" }
  });
  return achievements.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    date: a.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    // Tanggal mentah (YYYY-MM-DD) agar form edit bisa mengisi input date.
    dateIso: toDateInput(a.date),
    type: a.type,
    ekskul: a.extracurricular.name,
    ekskulId: a.extracurricularId,
    level: a.level,
    proof: a.proofUrl,
    studentName: a.student.name,
    studentClass: a.student.class
  }));
});
function toDateInput(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const achievements_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: achievements_get
}, Symbol.toStringTag, { value: 'Module' }));

const achievements_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { title, description, date, type, extracurricularId, level, proof } = await readBody(event);
  if (!title || !type || !extracurricularId || !level) {
    throw createError({ statusCode: 400, message: "Judul, jenis, ekskul, dan tingkat wajib diisi." });
  }
  const achievement = await prisma.achievement.create({
    data: {
      title,
      description,
      date: date ? new Date(date) : /* @__PURE__ */ new Date(),
      type,
      level,
      proofUrl: proof || null,
      studentId: auth.studentId,
      extracurricularId
    },
    include: {
      extracurricular: { select: { name: true } },
      student: { select: { name: true, class: true } }
    }
  });
  return {
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    date: achievement.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    type: achievement.type,
    ekskul: achievement.extracurricular.name,
    ekskulId: achievement.extracurricularId,
    level: achievement.level,
    proof: achievement.proofUrl,
    studentName: achievement.student.name,
    studentClass: achievement.student.class
  };
});

const achievements_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: achievements_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const existing = await prisma.achievement.findFirst({ where: { id, studentId: auth.studentId } });
  if (!existing) throw createError({ statusCode: 404, message: "Prestasi tidak ditemukan." });
  await prisma.achievement.delete({ where: { id } });
  return { success: true };
});

const _id__delete$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete$2
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put$2 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const existing = await prisma.achievement.findFirst({ where: { id, studentId: auth.studentId } });
  if (!existing) throw createError({ statusCode: 404, message: "Prestasi tidak ditemukan." });
  const { title, description, date, type, extracurricularId, level, proof } = await readBody(event);
  await prisma.achievement.update({
    where: { id },
    data: { title, description, date: date ? new Date(date) : void 0, type, level, proofUrl: proof || null, extracurricularId }
  });
  return { success: true };
});

const _id__put$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put$2
}, Symbol.toStringTag, { value: 'Module' }));

const articles_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const articles = await prisma.article.findMany({
    where: { institutionId: auth.institutionId, status: "published" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      category: true,
      tags: true,
      createdAt: true,
      author: { select: { name: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      _count: { select: { views: true } }
    }
  });
  return articles.map((a) => {
    var _a, _b, _c, _d;
    return {
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      coverImage: a.coverImage,
      category: a.category,
      tags: a.tags,
      author: a.author.name,
      ekskul: (_b = (_a = a.extracurricular) == null ? void 0 : _a.name) != null ? _b : null,
      ekskulLogo: (_d = (_c = a.extracurricular) == null ? void 0 : _c.logoUrl) != null ? _d : null,
      viewCount: a._count.views,
      createdAt: a.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
    };
  });
});

const articles_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: articles_get
}, Symbol.toStringTag, { value: 'Module' }));

const _slug__get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d;
  const auth = event.context.auth;
  const slug = getRouterParam(event, "slug");
  const article = await prisma.article.findUnique({
    where: { slug, status: "published" },
    include: {
      author: { select: { name: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      _count: { select: { views: true } }
    }
  });
  if (!article) {
    throw createError({ statusCode: 404, message: "Artikel tidak ditemukan." });
  }
  await prisma.articleView.upsert({
    where: { articleId_userId: { articleId: article.id, userId: auth.userId } },
    create: { articleId: article.id, userId: auth.userId },
    update: { viewedAt: /* @__PURE__ */ new Date() }
  }).catch(() => {
  });
  const viewCount = await prisma.articleView.count({ where: { articleId: article.id } });
  return {
    id: article.id,
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    coverImage: article.coverImage,
    category: article.category,
    tags: article.tags,
    author: article.author.name,
    ekskul: (_b = (_a = article.extracurricular) == null ? void 0 : _a.name) != null ? _b : null,
    ekskulLogo: (_d = (_c = article.extracurricular) == null ? void 0 : _c.logoUrl) != null ? _d : null,
    viewCount,
    createdAt: article.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  };
});

const _slug__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _slug__get
}, Symbol.toStringTag, { value: 'Module' }));

const attendance_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const records = await prisma.attendanceRecord.findMany({
    where: { studentId: auth.studentId },
    include: { extracurricular: { select: { name: true } } },
    orderBy: { date: "desc" }
  });
  return records.map((r) => ({
    id: r.id,
    date: r.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    ekskul: r.extracurricular.name,
    status: r.status === "hadir" ? "Hadir" : r.status === "izin" ? "Izin" : "Alpha",
    time: r.time || "-",
    notes: r.notes || "-"
  }));
});

const attendance_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: attendance_get
}, Symbol.toStringTag, { value: 'Module' }));

const meetings_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const members = await prisma.member.findMany({
    where: { studentId: auth.studentId, status: "active" },
    select: { extracurricularId: true }
  });
  const ekskulIds = members.map((m) => m.extracurricularId);
  if (!ekskulIds.length) return { meetings: [], now: null };
  const now = /* @__PURE__ */ new Date();
  const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const nowDayName = DAY_NAMES[now.getDay()];
  const nowHm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const isToday = (d) => d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  const schedules = await prisma.schedule.findMany({
    where: { extracurricularId: { in: ekskulIds }, institutionId: auth.institutionId },
    include: { extracurricular: { select: { name: true, logoUrl: true } } }
  });
  const meetings = schedules.filter((s) => s.date && isToday(s.date) || !s.date && s.day === nowDayName).map((s) => {
    const start = s.timeStart || "";
    const end = s.timeEnd || start;
    return {
      id: s.id,
      ekskul: s.extracurricular.name,
      ekskulLogo: s.extracurricular.logoUrl,
      timeStart: start,
      timeEnd: end,
      time: end && end !== start ? `${start} \u2013 ${end}` : start,
      location: s.location,
      coach: s.coach,
      mandatory: s.mandatory,
      // Titik lokasi geofence pertemuan ini (diatur operator/admin saat buat jadwal)
      latitude: s.latitude,
      longitude: s.longitude,
      radius: s.radius,
      open: nowHm >= start && nowHm <= end,
      ended: nowHm > end
    };
  }).sort((a, b) => a.timeStart.localeCompare(b.timeStart));
  return { meetings, now: nowHm };
});

const meetings_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: meetings_get
}, Symbol.toStringTag, { value: 'Module' }));

function haversineMeters(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const toRad = (d) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
const scan_post = defineEventHandler(async (event) => {
  var _a, _b;
  const auth = event.context.auth;
  const { token, latitude, longitude } = await readBody(event);
  if (!token) {
    throw createError({ statusCode: 400, message: "Token QR wajib diisi." });
  }
  const session = await prisma.attendanceSession.findUnique({
    where: { qrToken: token },
    include: { extracurricular: { select: { institutionId: true } } }
  });
  if (!session) {
    throw createError({ statusCode: 404, message: "QR Code tidak valid." });
  }
  if (/* @__PURE__ */ new Date() > session.qrExpiresAt) {
    throw createError({ statusCode: 410, message: "QR Code sudah kadaluarsa." });
  }
  const existing = await prisma.attendanceRecord.findFirst({
    where: { studentId: auth.studentId, sessionId: session.id }
  });
  if (existing) {
    throw createError({ statusCode: 409, message: "Kamu sudah melakukan absensi di sesi ini." });
  }
  const now = /* @__PURE__ */ new Date();
  const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const nowDayName = DAY_NAMES[now.getDay()];
  const nowHm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const meetings = await prisma.schedule.findMany({
    where: { extracurricularId: session.extracurricularId, institutionId: auth.institutionId }
  });
  const isToday = (d) => {
    if (!d) return false;
    const t = /* @__PURE__ */ new Date();
    return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate();
  };
  const applicable = meetings.filter(
    (s) => s.date && isToday(s.date) || !s.date && s.day === nowDayName
  );
  if (!applicable.length) {
    throw createError({
      statusCode: 403,
      message: "Tidak ada jadwal pertemuan ekskul hari ini. Absensi hanya bisa dilakukan saat ada jadwal pertemuan yang dibuat operator/admin."
    });
  }
  const inWindow = applicable.some((s) => {
    const start = s.timeStart || "";
    const end = s.timeEnd || start;
    return nowHm >= start && nowHm <= end;
  });
  if (!inWindow) {
    const w = applicable[0];
    throw createError({
      statusCode: 403,
      message: `Saat ini belum/sudah melewati waktu pertemuan (${w.timeStart}${w.timeEnd ? "\u2013" + w.timeEnd : ""}). Absensi hanya bisa dilakukan di dalam rentang waktu jadwal.`
    });
  }
  let zoneLat = null;
  let zoneLng = null;
  let zoneRadius = 200;
  let zoneName = null;
  const meeting = applicable[0];
  if (meeting && typeof meeting.latitude === "number" && typeof meeting.longitude === "number") {
    zoneLat = meeting.latitude;
    zoneLng = meeting.longitude;
    zoneRadius = (_a = meeting.radius) != null ? _a : 200;
    zoneName = meeting.location || null;
  } else if (typeof session.latitude === "number" && typeof session.longitude === "number") {
    zoneLat = session.latitude;
    zoneLng = session.longitude;
    zoneRadius = (_b = session.radius) != null ? _b : 200;
    zoneName = session.locationName;
  } else {
    const inst = await prisma.institution.findUnique({
      where: { id: auth.institutionId },
      select: { latitude: true, longitude: true, attendanceRadius: true }
    });
    if (!(inst == null ? void 0 : inst.latitude) || !(inst == null ? void 0 : inst.longitude)) {
      throw createError({ statusCode: 400, message: "Lokasi absensi belum diatur. Operator perlu menandai lokasi saat membuat QR, atau admin mengatur lokasi sekolah di Pengaturan Instansi." });
    }
    zoneLat = inst.latitude;
    zoneLng = inst.longitude;
    zoneRadius = inst.attendanceRadius || 200;
  }
  const lat = Number(latitude);
  const lng = Number(longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw createError({ statusCode: 400, message: "Lokasi kamu tidak valid. Aktifkan GPS dan coba lagi." });
  }
  const radius = zoneRadius;
  const distance = haversineMeters(lat, lng, zoneLat, zoneLng);
  const allowed = radius + 30;
  if (distance > allowed) {
    const zoneLabel = zoneName || "titik absensi";
    throw createError({
      statusCode: 403,
      message: `Kamu berada di luar area absensi (jarak ${Math.round(distance)} m dari ${zoneLabel}, batas ${Math.round(allowed)} m). Pindah ke lokasi pertemuan yang ditentukan pembimbing lalu coba lagi.`
    });
  }
  const record = await prisma.attendanceRecord.create({
    data: {
      studentId: auth.studentId,
      extracurricularId: session.extracurricularId,
      status: "hadir",
      time: formatSchoolTimeServer(now, zoneLng, { hour: "2-digit", minute: "2-digit" }),
      date: now,
      sessionId: session.id
    },
    include: { extracurricular: { select: { name: true } } }
  });
  return {
    id: record.id,
    ekskul: record.extracurricular.name,
    status: "Hadir",
    time: record.time,
    date: formatSchoolTimeServer(record.date, zoneLng, { day: "2-digit", month: "short", year: "numeric" }),
    location: zoneName
  };
});

const scan_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: scan_post
}, Symbol.toStringTag, { value: 'Module' }));

const board_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const ekskuls = await prisma.extracurricular.findMany({
    where: { institutionId: auth.institutionId },
    select: {
      id: true,
      name: true,
      logoUrl: true,
      structureMode: true,
      structureImageUrl: true,
      structureTheme: true,
      boardPositions: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: { id: true, name: true, className: true, position: true, photoUrl: true, sortOrder: true }
      }
    },
    orderBy: { name: "asc" }
  });
  const groups = ekskuls.filter((e) => e.structureMode === "image" ? !!e.structureImageUrl : e.boardPositions.length > 0).map((e) => ({
    id: e.id,
    ekskul: e.name,
    ekskulLogo: e.logoUrl,
    mode: e.structureMode,
    imageUrl: e.structureImageUrl,
    theme: e.structureTheme,
    positions: e.boardPositions.map((p) => ({
      id: p.id,
      name: p.name,
      className: p.className,
      position: p.position,
      photoUrl: p.photoUrl,
      sortOrder: p.sortOrder
    }))
  }));
  return groups;
});

const board_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: board_get
}, Symbol.toStringTag, { value: 'Module' }));

const DAY_INDEX$1 = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6
};
const COLOR_MANDATORY = "#2D6A6A";
const COLOR_OPTIONAL = "#D4C089";
const COLOR_MANUAL = "#4A9E9E";
const calendar_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery$1(event);
  const month = String(query.month || "").match(/^\d{4}-\d{2}$/) ? String(query.month) : "";
  const now = /* @__PURE__ */ new Date();
  const firstOfMonth = month ? /* @__PURE__ */ new Date(`${month}-01T00:00:00`) : new Date(now.getFullYear(), now.getMonth(), 1);
  const year = firstOfMonth.getFullYear();
  const mon = firstOfMonth.getMonth();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const startOfMonth = new Date(year, mon, 1);
  const endOfMonth = new Date(year, mon, daysInMonth, 23, 59, 59, 999);
  let ekskulFilter = { institutionId: auth.institutionId };
  if (auth.role === "student" && auth.studentId) {
    const members = await prisma.member.findMany({
      where: { studentId: auth.studentId, status: "active" },
      select: { extracurricularId: true }
    });
    ekskulFilter = { extracurricularId: { in: members.map((m) => m.extracurricularId) } };
  }
  const [schedules, manual] = await Promise.all([
    prisma.schedule.findMany({
      where: ekskulFilter,
      include: { extracurricular: { select: { id: true, name: true, logoUrl: true } } }
    }),
    prisma.agenda.findMany({
      where: { userId: auth.userId, date: { gte: startOfMonth, lte: endOfMonth } },
      orderBy: [{ date: "asc" }, { timeStart: "asc" }]
    })
  ]);
  const myIzin = auth.role === "student" && auth.studentId ? await prisma.attendanceRecord.findMany({
    where: { studentId: auth.studentId, status: "izin", date: { gte: startOfMonth, lte: endOfMonth } },
    select: { id: true, date: true, scheduleId: true, extracurricularId: true, notes: true, proofUrl: true }
  }) : [];
  const izinKey = (scheduleId, dateStr, ekskulId) => `${scheduleId || "s"}:${dateStr}:${ekskulId}`;
  const localDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const izinMap = new Map(myIzin.map((z) => [izinKey(z.scheduleId, localDate(z.date), z.extracurricularId), z]));
  const auto = [];
  for (const s of schedules) {
    const pushEvent = (dateStr) => {
      const izin = izinMap.get(izinKey(s.id, dateStr, s.extracurricularId));
      auto.push({
        id: `schedule:${s.id}:${dateStr}`,
        source: "schedule",
        scheduleId: s.id,
        ekskulId: s.extracurricularId,
        ekskulLogo: s.extracurricular.logoUrl,
        title: s.extracurricular.name,
        description: `${s.coach} \xB7 ${s.location}`,
        date: dateStr,
        timeStart: s.timeStart,
        timeEnd: s.timeEnd || "",
        location: s.location,
        coach: s.coach,
        mandatory: s.mandatory,
        color: s.mandatory ? COLOR_MANDATORY : COLOR_OPTIONAL,
        // Izin siswa untuk pertemuan ini (kalender siswa)
        izin: izin ? { id: izin.id, reason: izin.notes || "", proofUrl: izin.proofUrl || null } : null
      });
    };
    if (s.date) {
      const d = s.date;
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (dateStr.startsWith(`${year}-${String(mon + 1).padStart(2, "0")}`)) {
        pushEvent(dateStr);
      }
      continue;
    }
    const dayIdx = DAY_INDEX$1[s.day];
    if (dayIdx === void 0) continue;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, mon, d);
      if (date.getDay() !== dayIdx) continue;
      const dateStr = `${year}-${String(mon + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      pushEvent(dateStr);
    }
  }
  return {
    month: `${year}-${String(mon + 1).padStart(2, "0")}`,
    colors: { mandatory: COLOR_MANDATORY, optional: COLOR_OPTIONAL, manual: COLOR_MANUAL },
    events: [
      ...auto,
      ...manual.map((a) => ({
        id: a.id,
        source: "manual",
        title: a.title,
        description: a.description,
        date: a.date.toISOString().slice(0, 10),
        timeStart: a.timeStart,
        timeEnd: a.timeEnd || "",
        location: "",
        coach: "",
        mandatory: false,
        color: a.color || COLOR_MANUAL
      }))
    ]
  };
});

const calendar_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: calendar_get
}, Symbol.toStringTag, { value: 'Module' }));

const calendar_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { title, description, date, timeStart, timeEnd, color } = await readBody(event);
  if (!title || !date || !timeStart) {
    throw createError({ statusCode: 400, message: "Judul, tanggal, dan jam mulai wajib diisi." });
  }
  const agenda = await prisma.agenda.create({
    data: {
      title,
      description: description || null,
      date: new Date(date),
      timeStart,
      timeEnd: timeEnd || null,
      color: color || "#4A9E9E",
      userId: auth.userId,
      institutionId: auth.institutionId
    }
  });
  return {
    id: agenda.id,
    source: "manual",
    title: agenda.title,
    description: agenda.description,
    date: agenda.date.toISOString().slice(0, 10),
    timeStart: agenda.timeStart,
    timeEnd: agenda.timeEnd || "",
    color: agenda.color,
    mandatory: false
  };
});

const calendar_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: calendar_post
}, Symbol.toStringTag, { value: 'Module' }));

const _id__delete = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const existing = await prisma.agenda.findFirst({ where: { id, userId: auth.userId } });
  if (!existing) throw createError({ statusCode: 404, message: "Agenda tidak ditemukan." });
  await prisma.agenda.delete({ where: { id } });
  return { success: true };
});

const _id__delete$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__delete
}, Symbol.toStringTag, { value: 'Module' }));

const _id__put = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const { title, description, date, timeStart, timeEnd, color } = await readBody(event);
  const existing = await prisma.agenda.findFirst({ where: { id, userId: auth.userId } });
  if (!existing) throw createError({ statusCode: 404, message: "Agenda tidak ditemukan." });
  const agenda = await prisma.agenda.update({
    where: { id },
    data: {
      title: title != null ? title : existing.title,
      description: description !== void 0 ? description : existing.description,
      date: date ? new Date(date) : existing.date,
      timeStart: timeStart != null ? timeStart : existing.timeStart,
      timeEnd: timeEnd !== void 0 ? timeEnd : existing.timeEnd,
      color: color != null ? color : existing.color
    }
  });
  return {
    id: agenda.id,
    source: "manual",
    title: agenda.title,
    description: agenda.description,
    date: agenda.date.toISOString().slice(0, 10),
    timeStart: agenda.timeStart,
    timeEnd: agenda.timeEnd || "",
    color: agenda.color,
    mandatory: false
  };
});

const _id__put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__put
}, Symbol.toStringTag, { value: 'Module' }));

const changePassword_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { oldPassword, newPassword } = await readBody(event);
  if (!oldPassword || !newPassword) {
    throw createError({ statusCode: 400, message: "Password lama dan baru wajib diisi." });
  }
  if (newPassword.length < 6) {
    throw createError({ statusCode: 400, message: "Password baru minimal 6 karakter." });
  }
  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) {
    throw createError({ statusCode: 404, message: "User tidak ditemukan." });
  }
  const valid = await compare(oldPassword, user.passwordHash);
  if (!valid) {
    throw createError({ statusCode: 400, message: "Password lama salah." });
  }
  const hashed = await hash$2(newPassword, 10);
  await prisma.user.update({
    where: { id: auth.userId },
    data: { passwordHash: hashed }
  });
  return { success: true, message: "Password berhasil diubah." };
});

const changePassword_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: changePassword_post
}, Symbol.toStringTag, { value: 'Module' }));

const DAY_INDEX = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6
};
const DAY_NAMES = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
function nextDateForDay(dayName, from) {
  const target = DAY_INDEX[dayName];
  if (target === void 0) return from;
  const diff = (target - from.getDay() + 7) % 7;
  const d = new Date(from);
  d.setDate(d.getDate() + diff);
  return d;
}
const dashboard_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const [memberships, attendanceRecords, achievements, feed] = await Promise.all([
    prisma.member.findMany({
      where: { studentId: auth.studentId, status: "active" },
      include: {
        extracurricular: {
          include: {
            schedules: { orderBy: [{ day: "asc" }, { timeStart: "asc" }] }
          }
        }
      }
    }),
    prisma.attendanceRecord.findMany({
      where: { studentId: auth.studentId },
      include: { extracurricular: { select: { name: true } } },
      orderBy: { date: "desc" }
    }),
    prisma.achievement.count({ where: { studentId: auth.studentId } }),
    prisma.feedPost.findMany({
      where: { institutionId: auth.institutionId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { extracurricular: { select: { name: true } } }
    })
  ]);
  const total = attendanceRecords.length;
  const hadir = attendanceRecords.filter((r) => r.status === "hadir").length;
  const izin = attendanceRecords.filter((r) => r.status === "izin").length;
  const alpha = attendanceRecords.filter((r) => r.status === "alpha").length;
  const attendanceRate = total ? Math.round(hadir / total * 100) : 0;
  const now = /* @__PURE__ */ new Date();
  const schedulesFlat = memberships.flatMap(
    (m) => m.extracurricular.schedules.map((s) => ({
      id: s.id,
      day: s.day,
      timeStart: s.timeStart,
      timeEnd: s.timeEnd,
      title: `${m.extracurricular.name} - ${s.location}`,
      coach: s.coach,
      location: s.location,
      ekskul: m.extracurricular.name,
      mandatory: s.mandatory
    }))
  );
  const upcoming = schedulesFlat.map((s) => {
    const date = nextDateForDay(s.day, now);
    return { ...s, date };
  }).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 4).map((s) => ({
    id: s.id,
    day: s.day,
    date: s.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    dateISO: s.date.toISOString(),
    time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
    title: s.title,
    ekskul: s.ekskul,
    coach: s.coach,
    location: s.location,
    mandatory: s.mandatory,
    status: "akan_datang"
  }));
  const hoursByDay = DAY_NAMES.map((d) => {
    const scheds = memberships.flatMap((m) => m.extracurricular.schedules.filter((s) => s.day === d));
    return scheds.reduce((sum, s) => {
      const start = parseTime(s.timeStart);
      const end = parseTime(s.timeEnd || s.timeStart);
      return sum + Math.max(0, (end - start) / 60);
    }, 0);
  });
  function parseTime(t) {
    const [h, m] = t.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  }
  const recentActivity = [];
  const lastAtt = attendanceRecords[0];
  if (lastAtt) {
    recentActivity.push({
      id: "att-last",
      text: `Absensi ${lastAtt.extracurricular.name}: ${lastAtt.status === "hadir" ? "Hadir" : lastAtt.status === "izin" ? "Izin" : "Alpha"}`,
      time: formatRelative(lastAtt.date),
      type: "attendance"
    });
  }
  if (achievements) {
    recentActivity.push({
      id: "ach-count",
      text: `${achievements} prestasi tercatat`,
      time: "Portofolio",
      type: "achievement"
    });
  }
  if (feed.length) {
    recentActivity.push({
      id: "feed-count",
      text: `${feed.length} postingan terbaru di feed komunitas`,
      time: formatRelative(feed[0].createdAt),
      type: "poll"
    });
  }
  function formatRelative(d) {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 6e4);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} menit lalu`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} jam lalu`;
    const days = Math.floor(hrs / 24);
    if (days === 1) return "Kemarin";
    if (days < 7) return `${days} hari lalu`;
    return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
  }
  await syncNotifications({ ...auth, role: auth.role, studentId: auth.studentId }).catch(() => {
  });
  return {
    ekskulCount: memberships.length,
    attendanceRate,
    achievementCount: achievements,
    totalSessions: total,
    upcoming,
    charts: {
      attendance: {
        labels: ["Hadir", "Izin", "Alpha"],
        data: [hadir, izin, alpha]
      },
      weeklyHours: {
        labels: DAY_NAMES.filter((_, i) => i < 6),
        data: hoursByDay.slice(0, 6)
      }
    },
    recentActivity
  };
});

const dashboard_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: dashboard_get
}, Symbol.toStringTag, { value: 'Module' }));

const feed_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const posts = await prisma.feedPost.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      extracurricular: { select: { name: true } },
      comments: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "asc" }
      },
      likes: { where: { userId: auth.userId }, select: { id: true } },
      _count: { select: { likes: true, comments: true } }
    },
    orderBy: { date: "desc" }
  });
  const initialsOf = (name) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const safeAvatar = (avatar, author) => avatar && !avatar.includes("/") && avatar.length <= 3 ? avatar : initialsOf(author);
  return posts.map((p) => ({
    id: p.id,
    type: p.type,
    title: p.title,
    content: p.content,
    author: p.author,
    ekskul: p.extracurricular.name,
    avatar: safeAvatar(p.avatar, p.author),
    date: p.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) + ", " + p.createdAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    likes: p._count.likes,
    liked: p.likes.length > 0,
    comments: p.comments.map((c) => ({
      id: c.id,
      user: c.user.name,
      avatar: c.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
      text: c.text,
      time: ""
    })),
    commentCount: p._count.comments
  }));
});

const feed_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: feed_get
}, Symbol.toStringTag, { value: 'Module' }));

const comment_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const feedPostId = getRouterParam(event, "id");
  const { text } = await readBody(event);
  if (!(text == null ? void 0 : text.trim())) {
    throw createError({ statusCode: 400, message: "Komentar tidak boleh kosong." });
  }
  const comment = await prisma.feedComment.create({
    data: { text, userId: auth.userId, feedPostId },
    include: { user: { select: { name: true } } }
  });
  return {
    id: comment.id,
    user: comment.user.name,
    avatar: comment.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2),
    text: comment.text,
    time: "Baru saja"
  };
});

const comment_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: comment_post
}, Symbol.toStringTag, { value: 'Module' }));

const like_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const feedPostId = getRouterParam(event, "id");
  const existing = await prisma.feedLike.findUnique({
    where: { userId_feedPostId: { userId: auth.userId, feedPostId } }
  });
  if (existing) {
    await prisma.feedLike.delete({ where: { id: existing.id } });
    await prisma.feedPost.update({ where: { id: feedPostId }, data: { likesCount: { decrement: 1 } } });
    return { liked: false };
  } else {
    await prisma.feedLike.create({ data: { userId: auth.userId, feedPostId } });
    await prisma.feedPost.update({ where: { id: feedPostId }, data: { likesCount: { increment: 1 } } });
    return { liked: true };
  }
});

const like_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: like_post
}, Symbol.toStringTag, { value: 'Module' }));

const gallery_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const myMemberEkskulIds = (await prisma.member.findMany({ where: { studentId: auth.studentId }, select: { extracurricularId: true } })).map((m) => m.extracurricularId);
  const galleries = await prisma.gallery.findMany({
    where: {
      institutionId: auth.institutionId,
      extracurricularId: { in: myMemberEkskulIds }
    },
    include: { extracurricular: { select: { name: true, logoUrl: true } }, images: { take: 3, select: { url: true } } },
    orderBy: { date: "desc" }
  });
  return galleries.map((g) => ({
    id: g.id,
    title: g.title,
    ekskul: g.extracurricular.name,
    ekskulLogo: g.extracurricular.logoUrl,
    date: g.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    color: g.color,
    imageCount: g.imageCount,
    previews: g.images.map((i) => i.url)
  }));
});

const gallery_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: gallery_get
}, Symbol.toStringTag, { value: 'Module' }));

const izin_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  let ekskulIds = null;
  if (auth.role === "student" && auth.studentId) {
    const members = await prisma.member.findMany({
      where: { studentId: auth.studentId, status: "active" },
      select: { extracurricularId: true }
    });
    ekskulIds = members.map((m) => m.extracurricularId);
    if (!ekskulIds.length) return [];
  } else if (auth.role === "operator") {
    const scope = await getOperatorScope(event);
    ekskulIds = scope.isScoped ? scope.extracurricularId ? [scope.extracurricularId] : [""] : null;
  }
  const where = {
    status: "izin",
    extracurricular: { institutionId: auth.institutionId }
  };
  if (ekskulIds) where.extracurricularId = { in: ekskulIds };
  const records = await prisma.attendanceRecord.findMany({
    where,
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } }
    },
    orderBy: { date: "desc" }
  });
  return records.map((r) => ({
    id: r.id,
    studentId: r.studentId,
    student: r.student.name,
    nis: r.student.nis,
    class: r.student.class,
    ekskulId: r.extracurricularId,
    ekskul: r.extracurricular.name,
    date: r.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    dateISO: r.date.toISOString(),
    reason: r.notes || "",
    proofUrl: r.proofUrl || null
  }));
});

const izin_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: izin_get
}, Symbol.toStringTag, { value: 'Module' }));

const izin_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { extracurricularId, date, reason, scheduleId, proofUrl } = await readBody(event);
  if (!extracurricularId || !date || !(reason == null ? void 0 : reason.trim())) {
    throw createError({ statusCode: 400, message: "Ekskul, tanggal, dan alasan izin wajib diisi." });
  }
  const member = await prisma.member.findFirst({
    where: { studentId: auth.studentId, extracurricularId, status: "active" }
  });
  if (!member) {
    throw createError({ statusCode: 403, message: "Kamu bukan anggota aktif ekskul ini." });
  }
  const d = /* @__PURE__ */ new Date(`${date}T00:00:00`);
  if (isNaN(d.getTime())) {
    throw createError({ statusCode: 400, message: "Tanggal tidak valid." });
  }
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
  if (scheduleId) {
    const schedule = await prisma.schedule.findFirst({
      where: { id: scheduleId, extracurricularId, institutionId: auth.institutionId }
    });
    if (!schedule) {
      throw createError({ statusCode: 400, message: "Pertemuan tidak ditemukan." });
    }
  }
  const dup = await prisma.attendanceRecord.findFirst({
    where: {
      studentId: auth.studentId,
      extracurricularId,
      status: "izin",
      date: { gte: start, lt: end },
      ...scheduleId ? { scheduleId } : {}
    }
  });
  if (dup) {
    throw createError({ statusCode: 409, message: "Izin untuk ekskul dan tanggal ini sudah diajukan." });
  }
  const record = await prisma.attendanceRecord.create({
    data: {
      studentId: auth.studentId,
      extracurricularId,
      status: "izin",
      notes: reason.trim(),
      date: start,
      time: null,
      scheduleId: scheduleId || null,
      proofUrl: typeof proofUrl === "string" && proofUrl.trim() ? proofUrl.trim() : null
    },
    include: {
      student: { select: { nis: true, name: true, class: true } },
      extracurricular: { select: { id: true, name: true } }
    }
  });
  const dateLabel = record.date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const title = `Izin tidak hadir: ${record.extracurricular.name}`;
  const body = `${record.student.name} (${record.student.class}) mengajukan izin ${dateLabel}: ${record.notes}`;
  const recipients = [];
  const pembimbings = await prisma.user.findMany({
    where: { institutionId: auth.institutionId, role: "operator", extracurricularId },
    select: { id: true }
  });
  recipients.push(...pembimbings.map((u) => ({ userId: u.id, role: "operator" })));
  const memberUsers = await prisma.user.findMany({
    where: {
      institutionId: auth.institutionId,
      role: "student",
      studentId: { in: (await prisma.member.findMany({ where: { extracurricularId, status: "active" }, select: { studentId: true } })).map((m) => m.studentId) },
      NOT: { id: auth.userId }
    },
    select: { id: true }
  });
  recipients.push(...memberUsers.map((u) => ({ userId: u.id, role: "student" })));
  const admins = await prisma.user.findMany({
    where: { institutionId: auth.institutionId, role: "admin" },
    select: { id: true }
  });
  recipients.push(...admins.map((u) => ({ userId: u.id, role: "admin" })));
  for (const r of recipients) {
    const link = r.role === "student" ? "/siswa/calendar" : r.role === "operator" ? "/operator/izin" : "/admin/izin";
    await prisma.notification.upsert({
      where: { key: `izin:${record.id}:${r.userId}` },
      update: { title, body, link },
      create: {
        key: `izin:${record.id}:${r.userId}`,
        userId: r.userId,
        institutionId: auth.institutionId,
        type: "izin",
        title,
        body,
        link
      }
    });
  }
  return {
    id: record.id,
    studentId: record.studentId,
    student: record.student.name,
    nis: record.student.nis,
    class: record.student.class,
    ekskulId: record.extracurricularId,
    ekskul: record.extracurricular.name,
    date: record.date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
    dateISO: record.date.toISOString(),
    reason: record.notes || "",
    scheduleId: record.scheduleId,
    proofUrl: record.proofUrl
  };
});

const izin_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: izin_post
}, Symbol.toStringTag, { value: 'Module' }));

async function loadLogoImage$1(pathFromRoot, heightPx) {
  if (!pathFromRoot) return null;
  const clean = pathFromRoot.replace(/^\//, "");
  const filePath = join(process.cwd(), "public", clean);
  let buf;
  try {
    buf = await readFile(filePath);
  } catch {
    return null;
  }
  const lower = clean.toLowerCase();
  const type = lower.endsWith(".png") ? "png" : lower.endsWith(".jpg") || lower.endsWith(".jpeg") ? "jpg" : lower.endsWith(".gif") ? "gif" : null;
  if (!type) return null;
  return new ImageRun({ type, data: buf, transformation: { width: heightPx, height: heightPx } });
}
const surat_get = defineEventHandler(async (event) => {
  var _a, _b;
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const record = await prisma.attendanceRecord.findFirst({
    where: { id, status: "izin", extracurricular: { institutionId: auth.institutionId } },
    include: {
      student: true,
      extracurricular: { select: { id: true, name: true } }
    }
  });
  if (!record) throw createError({ statusCode: 404, message: "Surat izin tidak ditemukan." });
  if (auth.role === "student") {
    const members = await prisma.member.findMany({
      where: { studentId: auth.studentId, status: "active" },
      select: { extracurricularId: true }
    });
    const bolehAkses = record.studentId === auth.studentId || members.some((m) => m.extracurricularId === record.extracurricularId);
    if (!bolehAkses) throw createError({ statusCode: 403, message: "Kamu tidak dapat mengakses surat ini." });
  } else if (auth.role === "operator") {
    const scope = await getOperatorScope(event);
    if (scope.isScoped && scope.extracurricularId && scope.extracurricularId !== record.extracurricularId) {
      throw createError({ statusCode: 403, message: "Surat ini di luar ekskul yang kamu kelola." });
    }
  }
  const inst = await prisma.institution.findUnique({ where: { id: auth.institutionId } });
  const ekskul = await prisma.extracurricular.findUnique({ where: { id: record.extracurricularId } });
  const logoSekolah = await loadLogoImage$1(inst == null ? void 0 : inst.logo, 90);
  const logoEkskul = await loadLogoImage$1(ekskul == null ? void 0 : ekskul.logoUrl, 90);
  const nomorIzin = await prisma.attendanceRecord.count({
    where: { status: "izin", extracurricular: { institutionId: auth.institutionId }, createdAt: { lte: record.createdAt } }
  });
  const parseDateParam = (raw) => {
    if (!raw) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
    const d = /* @__PURE__ */ new Date(`${raw}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  };
  const q = getQuery$1(event);
  const tglSurat = (_a = parseDateParam(q.tglSurat)) != null ? _a : /* @__PURE__ */ new Date();
  const tglIzin = (_b = parseDateParam(q.tglIzin)) != null ? _b : record.date;
  const fmt = (d) => d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const suratStr = fmt(tglSurat);
  const izinStr = fmt(tglIzin);
  const bulan = record.date.toLocaleDateString("id-ID", { month: "2-digit" });
  const tahun = record.date.getFullYear();
  const nomor = `${String(nomorIzin).padStart(3, "0")}/StudentBase/IZIN/${bulan}/${tahun}`;
  const line = "-".repeat(42);
  const kosong = (n = 1) => Array.from({ length: n }, () => new Paragraph({ children: [] }));
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Kop surat: logo sekolah (kiri) + logo ekskul (kanan) + teks di tengah
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            ...logoEkskul ? [logoEkskul] : [],
            new TextRun({ text: "    " }),
            ...logoSekolah ? [logoSekolah] : []
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (inst == null ? void 0 : inst.name) || "Sekolah", bold: true, size: 32 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (inst == null ? void 0 : inst.address) || "", size: 21 })] }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: `Telp: ${(inst == null ? void 0 : inst.phone) || "-"}  |  Email: ${(inst == null ? void 0 : inst.email) || "-"}`, size: 21 })]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: line, size: 21, color: "334155" })] }),
        ...kosong(1),
        // Judul
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({ text: "SURAT IZIN TIDAK MENGIKUTI KEGIATAN", bold: true, size: 26 })]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [new TextRun({ text: "EKSTRAKURIKULER", bold: true, size: 26 })]
        }),
        new Paragraph({ children: [new TextRun({ text: `Nomor: ${nomor}`, size: 22 })] }),
        ...kosong(1),
        new Paragraph({ children: [new TextRun({ text: "Kepada Yth.", size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: `Pembina Ekstrakurikuler ${record.extracurricular.name}`, size: 22, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: "di tempat", size: 22 })] }),
        ...kosong(1),
        new Paragraph({
          spacing: { after: 120 },
          children: [new TextRun({ text: "Yang bertanda tangan di bawah ini:", size: 22 })]
        }),
        new Paragraph({ children: [new TextRun({ text: "Nama		: ", size: 22 }), new TextRun({ text: record.student.name, size: 22, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: "Kelas		: ", size: 22 }), new TextRun({ text: record.student.class, size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: "NIS		: ", size: 22 }), new TextRun({ text: record.student.nis, size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: "No. HP	: ", size: 22 }), new TextRun({ text: record.student.phone || "-", size: 22 })] }),
        ...kosong(1),
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Dengan ini menyatakan bahwa siswa tersebut ", size: 22 }),
            new TextRun({ text: "TIDAK DAPAT", bold: true, size: 22 }),
            new TextRun({
              text: ` mengikuti kegiatan ekstrakurikuler ${record.extracurricular.name} pada tanggal ${izinStr}, dengan alasan:`,
              size: 22
            })
          ]
        }),
        new Paragraph({
          indent: { left: 720 },
          spacing: { after: 160 },
          children: [new TextRun({ text: record.notes || "-", size: 22, italics: true })]
        }),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: "Demikian surat izin ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.", size: 22 })]
        }),
        ...kosong(2),
        // Tanda tangan (2 kolom)
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "Mengetahui,", size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: `Pembina ${record.extracurricular.name}`, size: 22 })] }),
                    ...kosong(3),
                    new Paragraph({ children: [new TextRun({ text: "______________________", size: 22 })] })
                  ]
                }),
                new TableCell({
                  width: { size: 50, type: WidthType.PERCENTAGE },
                  children: [
                    new Paragraph({ children: [new TextRun({ text: `${suratStr}`, size: 22 })] }),
                    new Paragraph({ children: [new TextRun({ text: "Orang Tua / Wali", size: 22 })] }),
                    ...kosong(3),
                    new Paragraph({ children: [new TextRun({ text: "______________________", size: 22 })] })
                  ]
                })
              ]
            })
          ]
        })
      ]
    }]
  });
  const buf = await Packer.toBuffer(doc);
  const slug = (s, max = 30) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, max) || "izin";
  const nama = slug(record.student.name, 24);
  const ekskulSlug = slug(record.extracurricular.name, 16);
  const alasan = slug(record.notes || "", 16);
  const filename = `${nama}_${ekskulSlug}_${alasan}.docx`;
  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  setHeader(event, "Content-Disposition", `attachment; filename="${filename}"`);
  return buf;
});

const surat_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: surat_get
}, Symbol.toStringTag, { value: 'Module' }));

async function loadLogoImage(pathFromRoot, heightPx) {
  if (!pathFromRoot) return null;
  const clean = pathFromRoot.replace(/^\//, "");
  const filePath = join(process.cwd(), "public", clean);
  let buf;
  try {
    buf = await readFile(filePath);
  } catch {
    return null;
  }
  const lower = clean.toLowerCase();
  const type = lower.endsWith(".png") ? "png" : lower.endsWith(".jpg") || lower.endsWith(".jpeg") ? "jpg" : lower.endsWith(".gif") ? "gif" : null;
  if (!type) return null;
  return new ImageRun({ type, data: buf, transformation: { width: heightPx, height: heightPx } });
}
const template_get$1 = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  if (!(auth == null ? void 0 : auth.institutionId)) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  const inst = await prisma.institution.findUnique({ where: { id: auth.institutionId } });
  const logoSekolah = await loadLogoImage(inst == null ? void 0 : inst.logo, 90);
  const line = "-".repeat(42);
  const kosong = (n = 1) => Array.from({ length: n }, () => new Paragraph({ children: [] }));
  const field = (label) => new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({ text: `${label}: `, size: 22 }),
      new TextRun({ text: "................................................", size: 22 })
    ]
  });
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            ...logoSekolah ? [logoSekolah] : [],
            new TextRun({ text: "    " })
          ]
        }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (inst == null ? void 0 : inst.name) || "Sekolah", bold: true, size: 32 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: (inst == null ? void 0 : inst.address) || "", size: 21 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `Telp: ${(inst == null ? void 0 : inst.phone) || "-"}  |  Email: ${(inst == null ? void 0 : inst.email) || "-"}`, size: 21 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: line, size: 21, color: "334155" })] }),
        ...kosong(1),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [new TextRun({ text: "SURAT IZIN TIDAK MENGIKUTI KEGIATAN EKSTRAKURIKULER", bold: true, size: 26 })]
        }),
        new Paragraph({ children: [new TextRun({ text: "Kepada Yth.", size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: "Pembina Ekstrakurikuler ........................", size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: "di tempat", size: 22 })] }),
        ...kosong(1),
        new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "Yang bertanda tangan di bawah ini:", size: 22 })] }),
        field("Nama"),
        field("Kelas"),
        field("NIS"),
        field("No. HP"),
        ...kosong(1),
        new Paragraph({
          spacing: { after: 160 },
          children: [
            new TextRun({ text: "Dengan ini menyatakan bahwa siswa tersebut TIDAK DAPAT mengikuti kegiatan ekstrakurikuler pada tanggal ........................, dengan alasan:", size: 22 })
          ]
        }),
        new Paragraph({ indent: { left: 720 }, spacing: { after: 160 }, children: [new TextRun({ text: "..........................................................................................", size: 22 })] }),
        new Paragraph({
          spacing: { after: 160 },
          children: [new TextRun({ text: "Demikian surat izin ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya. Atas perhatian dan kerja samanya, kami ucapkan terima kasih.", size: 22 })]
        }),
        ...kosong(2),
        new Paragraph({ children: [new TextRun({ text: "Mengetahui,", size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: "Pembina Ekstrakurikuler", size: 22 })] }),
        ...kosong(3),
        new Paragraph({ children: [new TextRun({ text: "______________________", size: 22 })] }),
        ...kosong(2),
        new Paragraph({ children: [new TextRun({ text: "........................, ........................", size: 22 })] }),
        new Paragraph({ children: [new TextRun({ text: "Orang Tua / Wali", size: 22 })] }),
        ...kosong(3),
        new Paragraph({ children: [new TextRun({ text: "______________________", size: 22 })] })
      ]
    }]
  });
  const buf = await Packer.toBuffer(doc);
  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
  setHeader(event, "Content-Disposition", `attachment; filename="template-surat-izin.docx"`);
  return buf;
});

const template_get$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: template_get$1
}, Symbol.toStringTag, { value: 'Module' }));

const materials_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const myMemberEkskulIds = (await prisma.member.findMany({
    where: { studentId: auth.studentId, status: "active" },
    select: { extracurricularId: true }
  })).map((m) => m.extracurricularId);
  if (myMemberEkskulIds.length === 0) {
    return [];
  }
  const materials = await prisma.extracurricularMaterial.findMany({
    where: {
      institutionId: auth.institutionId,
      extracurricularId: { in: myMemberEkskulIds }
    },
    orderBy: { createdAt: "desc" },
    include: {
      uploadedBy: { select: { name: true } },
      extracurricular: { select: { name: true } }
    }
  });
  return materials.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
    fileUrl: m.fileUrl,
    fileType: m.fileType,
    content: m.content,
    ekskul: m.extracurricular.name,
    uploadedBy: m.uploadedBy.name,
    createdAt: m.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  }));
});

const materials_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: materials_get
}, Symbol.toStringTag, { value: 'Module' }));

const news_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const news = await prisma.news.findMany({
    where: { institutionId: auth.institutionId, displayStatus: "approved" },
    include: { extracurricular: { select: { name: true, logoUrl: true } } },
    orderBy: { updatedAt: "desc" }
  });
  return news.map((n) => ({
    id: n.id,
    title: n.title,
    content: n.content,
    isPublic: n.isPublic,
    ekskul: n.extracurricular.name,
    ekskulLogo: n.extracurricular.logoUrl,
    ekskulId: n.extracurricularId,
    author: n.author,
    date: n.createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
  }));
});

const news_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: news_get
}, Symbol.toStringTag, { value: 'Module' }));

const _id__get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const id = getRouterParam(event, "id");
  const n = await prisma.news.findFirst({
    where: { id, institutionId: auth.institutionId, displayStatus: "approved" },
    include: { extracurricular: { select: { name: true, logoUrl: true } } }
  });
  if (!n) throw createError({ statusCode: 404, message: "Berita tidak ditemukan." });
  return {
    id: n.id,
    title: n.title,
    content: n.content,
    isPublic: n.isPublic,
    ekskul: n.extracurricular.name,
    ekskulLogo: n.extracurricular.logoUrl,
    ekskulId: n.extracurricularId,
    author: n.author,
    date: n.createdAt.toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
  };
});

const _id__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _id__get
}, Symbol.toStringTag, { value: 'Module' }));

const notifications_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  await syncNotifications({ ...auth });
  const notifications = await prisma.notification.findMany({
    where: { userId: auth.userId },
    orderBy: [{ read: "asc" }, { createdAt: "desc" }],
    take: 50
  });
  return {
    unread: notifications.filter((n) => !n.read).length,
    list: notifications.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      body: n.body,
      link: n.link,
      read: n.read,
      createdAt: n.createdAt.toISOString()
    }))
  };
});

const notifications_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: notifications_get
}, Symbol.toStringTag, { value: 'Module' }));

const read_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const body = await readBody(event).catch(() => ({}));
  if (body == null ? void 0 : body.id) {
    await prisma.notification.updateMany({
      where: { id: body.id, userId: auth.userId },
      data: { read: true }
    });
  } else {
    await prisma.notification.updateMany({
      where: { userId: auth.userId, read: false },
      data: { read: true }
    });
  }
  return { success: true };
});

const read_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: read_post
}, Symbol.toStringTag, { value: 'Module' }));

const polls_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const myMemberEkskulIds = (await prisma.member.findMany({ where: { studentId: auth.studentId }, select: { extracurricularId: true } })).map((m) => m.extracurricularId);
  const polls = await prisma.poll.findMany({
    where: {
      institutionId: auth.institutionId,
      extracurricularId: { in: myMemberEkskulIds }
    },
    include: {
      options: { select: { id: true, label: true, votesCount: true } },
      extracurricular: { select: { name: true, logoUrl: true } },
      votes: { where: { userId: auth.userId }, select: { pollOptionId: true } }
    },
    orderBy: [{ active: "desc" }, { createdAt: "desc" }]
  });
  return polls.map((p) => {
    var _a;
    return {
      id: p.id,
      question: p.question,
      options: p.options.map((o) => ({
        id: o.id,
        label: o.label,
        votes: o.votesCount
      })),
      ekskul: p.extracurricular.name,
      ekskulLogo: p.extracurricular.logoUrl,
      endDate: p.endDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      active: p.active,
      myVote: ((_a = p.votes[0]) == null ? void 0 : _a.pollOptionId) || null,
      totalVotes: p.options.reduce((sum, o) => sum + o.votesCount, 0)
    };
  });
});

const polls_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: polls_get
}, Symbol.toStringTag, { value: 'Module' }));

const vote_post = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const pollId = getRouterParam(event, "id");
  const { pollOptionId } = await readBody(event);
  if (!pollOptionId) {
    throw createError({ statusCode: 400, message: "Opsi voting wajib dipilih." });
  }
  const poll = await prisma.poll.findUnique({ where: { id: pollId } });
  if (!poll) throw createError({ statusCode: 404, message: "Voting tidak ditemukan." });
  if (!poll.active) throw createError({ statusCode: 400, message: "Voting sudah ditutup." });
  const option = await prisma.pollOption.findUnique({ where: { id: pollOptionId } });
  if (!option || option.pollId !== pollId) {
    throw createError({ statusCode: 400, message: "Opsi tidak valid." });
  }
  const existingVote = await prisma.pollVote.findUnique({
    where: { pollId_userId: { pollId, userId: auth.userId } }
  });
  if (existingVote) {
    throw createError({ statusCode: 409, message: "Kamu sudah memberikan suara." });
  }
  await prisma.$transaction([
    prisma.pollVote.create({ data: { pollOptionId, pollId, userId: auth.userId } }),
    prisma.pollOption.update({ where: { id: pollOptionId }, data: { votesCount: { increment: 1 } } })
  ]);
  return { success: true };
});

const vote_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: vote_post
}, Symbol.toStringTag, { value: 'Module' }));

const profile_put = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const { name, phone, class: className, avatarUrl } = await readBody(event);
  const user = await prisma.user.update({
    where: { id: auth.userId },
    data: { name, phone, ...avatarUrl !== void 0 ? { avatarUrl } : {} }
  });
  if (auth.studentId) {
    await prisma.student.update({
      where: { id: auth.studentId },
      data: { class: className, phone }
    });
  }
  return {
    id: user.id,
    name: user.name,
    role: user.role,
    phone: user.phone,
    avatar: user.avatarUrl || null
  };
});

const profile_put$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: profile_put
}, Symbol.toStringTag, { value: 'Module' }));

const schedule_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const myMemberEkskulIds = (await prisma.member.findMany({ where: { studentId: auth.studentId }, select: { extracurricularId: true } })).map((m) => m.extracurricularId);
  const schedules = await prisma.schedule.findMany({
    where: { extracurricularId: { in: myMemberEkskulIds } },
    include: { extracurricular: { select: { name: true } } },
    orderBy: [{ day: "asc" }, { timeStart: "asc" }]
  });
  const grouped = {};
  const dayOrder = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  for (const d of dayOrder) grouped[d] = [];
  for (const s of schedules) {
    const day = s.day || "Lainnya";
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push({
      time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
      date: s.date ? s.date.toISOString().slice(0, 10) : null,
      ekskul: s.extracurricular.name,
      coach: s.coach,
      location: s.location
    });
  }
  return grouped;
});

const schedule_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: schedule_get
}, Symbol.toStringTag, { value: 'Module' }));

const template_get = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

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

const translate_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: translate_post
}, Symbol.toStringTag, { value: 'Module' }));

const upload_post = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

//#region src/runtime/utils/renderer/payload.ts
function renderPayloadResponse(ssrContext) {
	return {
		body: encodeForwardSlashes(stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"])) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const payload = {
		"type": "application/json",
		"innerHTML": opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "",
		"data-nuxt-data": appId,
		"data-ssr": false
	};
	payload.id = "__NUXT_DATA__";
	if (opts.src) payload["data-src"] = opts.src;
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}
/**
* Encode forward slashes as unicode escape sequences to prevent
* Google from treating them as internal links and trying to crawl them.
* @see https://github.com/nuxt/nuxt/issues/24175
*/
function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, prefetchLinks, ...initial } = ssrContext.payload;
	const payload = {
		data,
		prerenderedAt
	};
	if (prefetchLinks?.length) payload.prefetchLinks = prefetchLinks;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":true};

//#region src/runtime/handlers/renderer.ts
globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const PAYLOAD_FILENAME = "_payload.json" ;
const handler = defineRenderHandler((event) => {
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) throw createError({
		status: 404,
		statusText: "Page Not Found: /__nuxt_error",
		message: "Page Not Found: /__nuxt_error"
	});
	return renderRoute(event, ssrError);
});
async function renderRoute(event, ssrError) {
	const nitroApp = useNitroApp();
	const ssrContext = createSSRContext(event);
	ssrContext.head.push(appHead);
	if (ssrError) {
		const status = ssrError.status || ssrError.statusCode;
		if (status) ssrError.status = ssrError.statusCode = Number.parseInt(status);
		if (typeof ssrError.data === "string") try {
			ssrError.data = destr(ssrError.data);
		} catch {}
		setSSRError(ssrContext, ssrError);
	}
	const routeOptions = getRouteRules(event);
	if (routeOptions.ssr === false) ssrContext.noSSR = true;
	const _PAYLOAD_EXTRACTION = !ssrContext.noSSR && ((routeOptions.isr || routeOptions.cache));
	const isRenderingPayload = (_PAYLOAD_EXTRACTION || routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
		ssrContext.url = url;
		event._path = event.node.req.url = url;
		if (payloadCache && await payloadCache.hasItem(url + ".json")) return payloadCache.getItem(url + ".json");
	}
	_PAYLOAD_EXTRACTION ? joinURL(ssrContext.runtimeConfig.app.cdnURL || ssrContext.runtimeConfig.app.baseURL, ssrContext.url.replace(/\?.*$/, ""), PAYLOAD_FILENAME) + "?" + ssrContext.runtimeConfig.app.buildId : void 0;
	const renderer = await getRenderer();
	const canStream = NUXT_SSR_STREAMING;
	const renderRouteContext = {
		canStream,
		prefersStream: false
	};
	await nitroApp.hooks.callHook("render:route", renderRouteContext, { event });
	const _rendered = await (renderer.renderToString(ssrContext)).catch(async (error) => {
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") return {};
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	if (ssrContext.payload?.error && !ssrError) throw ssrContext.payload.error;
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		if (payloadCache) await payloadCache.setItem(ssrContext.url + ".json", response);
		return response;
	}
	if (_PAYLOAD_EXTRACTION) {
		if (payloadCache) await payloadCache.setItem((ssrContext.url === "/" ? "/" : ssrContext.url.replace(/\/$/, "")) + ".json", renderPayloadResponse(ssrContext));
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	if (inlinedStyles.length) ssrContext.head.push({ style: inlinedStyles });
	const link = [];
	for (const resource of Object.values(styles)) {
		if ("inline" in getQuery(resource.file)) continue;
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) ssrContext.head.push({ link });
	if (!NO_SCRIPTS) {
		const dependencyOptions = ssrContext["~lazyHydratedModules"]?.size ? { exclude: ssrContext["~lazyHydratedModules"] } : void 0;
		ssrContext.head.push({ link: getPreloadLinks(ssrContext, renderer.rendererContext, dependencyOptions) });
		ssrContext.head.push({ link: getPrefetchLinks(ssrContext, renderer.rendererContext, dependencyOptions) });
		ssrContext.head.push({ script: renderPayloadJsonScript({
			ssrContext,
			data: stripInlineOnlyPayloadFields(ssrContext.payload)
		})   }, {
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			tagPosition,
			crossorigin: ""
		})) });
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
}
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) result.push(chunk);
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) return "";
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}
function stripInlineOnlyPayloadFields(payload) {
	if (!payload.prefetchLinks) return payload;
	const { prefetchLinks: _, ...rest } = payload;
	return rest;
}

const renderer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
