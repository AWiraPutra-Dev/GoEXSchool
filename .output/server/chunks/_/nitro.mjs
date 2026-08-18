import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { PrismaClient } from '@prisma/client';
import http from 'node:http';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promises, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import jwt from 'jsonwebtoken';
import { getIcons } from '@iconify/utils';
import { createHash } from 'node:crypto';
import { consola } from 'consola';
import { resolve as resolve$1, dirname as dirname$1, join } from 'node:path';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
const ENC_SLASH_RE = /%2f/gi;
const ENC_ENC_SLASH_RE = /%252f/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return encode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F").replace(ENC_ENC_SLASH_RE, "%2F").replace(AMPERSAND_RE, "%26").replace(PLUS_RE, "%2B");
}
function decode$1(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodePath(text) {
  return decode$1(text.replace(ENC_SLASH_RE, "%252F"));
}
function decodeQueryKey(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode$1(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function hasLeadingSlash(input = "") {
  return input.startsWith("/");
}
function withLeadingSlash(input = "") {
  return hasLeadingSlash(input) ? input : "/" + input;
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    const nextChar = input[_base.length];
    if (!nextChar || nextChar === "/" || nextChar === "?") {
      return input;
    }
  }
  return joinURL(_base, input);
}
function withoutBase(input, base) {
  if (isEmptyURL(base)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (!input.startsWith(_base)) {
    return input;
  }
  const nextChar = input[_base.length];
  if (nextChar && nextChar !== "/" && nextChar !== "?") {
    return input;
  }
  const trimmed = input.slice(_base.length).replace(/^\/+/, "");
  return "/" + trimmed;
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function getQuery$1(input) {
  return parseQuery(parseURL(input).search);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}
function joinRelativeURL(..._input) {
  const JOIN_SEGMENT_SPLIT_RE = /\/(?!\/)/;
  const input = _input.filter(Boolean);
  const segments = [];
  let segmentsDepth = 0;
  for (const i of input) {
    if (!i || i === "/") {
      continue;
    }
    for (const [sindex, s] of i.split(JOIN_SEGMENT_SPLIT_RE).entries()) {
      if (!s || s === ".") {
        continue;
      }
      if (s === "..") {
        if (segments.length === 1 && hasProtocol(segments[0])) {
          continue;
        }
        segments.pop();
        segmentsDepth--;
        continue;
      }
      if (sindex === 1 && segments[segments.length - 1]?.endsWith(":/")) {
        segments[segments.length - 1] += "/" + s;
        continue;
      }
      segments.push(s);
      segmentsDepth++;
    }
  }
  let url = segments.join("/");
  if (segmentsDepth >= 0) {
    if (input[0]?.startsWith("/") && !url.startsWith("/")) {
      url = "/" + url;
    } else if (input[0]?.startsWith("./") && !url.startsWith("./")) {
      url = "./" + url;
    }
  } else {
    url = "../".repeat(-1 * segmentsDepth) + url;
  }
  if (input[input.length - 1]?.endsWith("/") && !url.endsWith("/")) {
    url += "/";
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

const NullObject = /* @__PURE__ */ (() => {
  const C = function() {
  };
  C.prototype = /* @__PURE__ */ Object.create(null);
  return C;
})();
function parse$1(str, options) {
  if (typeof str !== "string") {
    throw new TypeError("argument str must be a string");
  }
  const obj = new NullObject();
  const opt = {};
  const dec = opt.decode || decode;
  let index = 0;
  while (index < str.length) {
    const eqIdx = str.indexOf("=", index);
    if (eqIdx === -1) {
      break;
    }
    let endIdx = str.indexOf(";", index);
    if (endIdx === -1) {
      endIdx = str.length;
    } else if (endIdx < eqIdx) {
      index = str.lastIndexOf(";", eqIdx - 1) + 1;
      continue;
    }
    const key = str.slice(index, eqIdx).trim();
    if (opt?.filter && !opt?.filter(key)) {
      index = endIdx + 1;
      continue;
    }
    if (void 0 === obj[key]) {
      let val = str.slice(eqIdx + 1, endIdx).trim();
      if (val.codePointAt(0) === 34) {
        val = val.slice(1, -1);
      }
      obj[key] = tryDecode(val, dec);
    }
    index = endIdx + 1;
  }
  return obj;
}
function decode(str) {
  return str.includes("%") ? decodeURIComponent(str) : str;
}
function tryDecode(str, decode2) {
  try {
    return decode2(str);
  } catch {
    return str;
  }
}

const NODE_TYPES = {
  NORMAL: 0,
  WILDCARD: 1,
  PLACEHOLDER: 2
};

function createRouter$1(options = {}) {
  const ctx = {
    options,
    rootNode: createRadixNode(),
    staticRoutesMap: {}
  };
  const normalizeTrailingSlash = (p) => options.strictTrailingSlash ? p : p.replace(/\/$/, "") || "/";
  if (options.routes) {
    for (const path in options.routes) {
      insert(ctx, normalizeTrailingSlash(path), options.routes[path]);
    }
  }
  return {
    ctx,
    lookup: (path) => lookup(ctx, normalizeTrailingSlash(path)),
    insert: (path, data) => insert(ctx, normalizeTrailingSlash(path), data),
    remove: (path) => remove(ctx, normalizeTrailingSlash(path))
  };
}
function lookup(ctx, path) {
  const staticPathNode = ctx.staticRoutesMap[path];
  if (staticPathNode) {
    return staticPathNode.data;
  }
  const sections = path.split("/");
  const params = {};
  let paramsFound = false;
  let wildcardNode = null;
  let node = ctx.rootNode;
  let wildCardParam = null;
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    if (node.wildcardChildNode !== null) {
      wildcardNode = node.wildcardChildNode;
      wildCardParam = sections.slice(i).join("/");
    }
    const nextNode = node.children.get(section);
    if (nextNode === void 0) {
      if (node && node.placeholderChildren.length > 1) {
        const remaining = sections.length - i;
        node = node.placeholderChildren.find((c) => c.maxDepth === remaining) || null;
      } else {
        node = node.placeholderChildren[0] || null;
      }
      if (!node) {
        break;
      }
      if (node.paramName) {
        params[node.paramName] = section;
      }
      paramsFound = true;
    } else {
      node = nextNode;
    }
  }
  if ((node === null || node.data === null) && wildcardNode !== null) {
    node = wildcardNode;
    params[node.paramName || "_"] = wildCardParam;
    paramsFound = true;
  }
  if (!node) {
    return null;
  }
  if (paramsFound) {
    return {
      ...node.data,
      params: paramsFound ? params : void 0
    };
  }
  return node.data;
}
function insert(ctx, path, data) {
  let isStaticRoute = true;
  const sections = path.split("/");
  let node = ctx.rootNode;
  let _unnamedPlaceholderCtr = 0;
  const matchedNodes = [node];
  for (const section of sections) {
    let childNode;
    if (childNode = node.children.get(section)) {
      node = childNode;
    } else {
      const type = getNodeType(section);
      childNode = createRadixNode({ type, parent: node });
      node.children.set(section, childNode);
      if (type === NODE_TYPES.PLACEHOLDER) {
        childNode.paramName = section === "*" ? `_${_unnamedPlaceholderCtr++}` : section.slice(1);
        node.placeholderChildren.push(childNode);
        isStaticRoute = false;
      } else if (type === NODE_TYPES.WILDCARD) {
        node.wildcardChildNode = childNode;
        childNode.paramName = section.slice(
          3
          /* "**:" */
        ) || "_";
        isStaticRoute = false;
      }
      matchedNodes.push(childNode);
      node = childNode;
    }
  }
  for (const [depth, node2] of matchedNodes.entries()) {
    node2.maxDepth = Math.max(matchedNodes.length - depth, node2.maxDepth || 0);
  }
  node.data = data;
  if (isStaticRoute === true) {
    ctx.staticRoutesMap[path] = node;
  }
  return node;
}
function remove(ctx, path) {
  let success = false;
  const sections = path.split("/");
  let node = ctx.rootNode;
  for (const section of sections) {
    node = node.children.get(section);
    if (!node) {
      return success;
    }
  }
  if (node.data) {
    const lastSection = sections.at(-1) || "";
    node.data = null;
    if (Object.keys(node.children).length === 0 && node.parent) {
      node.parent.children.delete(lastSection);
      node.parent.wildcardChildNode = null;
      node.parent.placeholderChildren = [];
    }
    success = true;
  }
  return success;
}
function createRadixNode(options = {}) {
  return {
    type: options.type || NODE_TYPES.NORMAL,
    maxDepth: 0,
    parent: options.parent || null,
    children: /* @__PURE__ */ new Map(),
    data: options.data || null,
    paramName: options.paramName || null,
    wildcardChildNode: null,
    placeholderChildren: []
  };
}
function getNodeType(str) {
  if (str.startsWith("**")) {
    return NODE_TYPES.WILDCARD;
  }
  if (str[0] === ":" || str === "*") {
    return NODE_TYPES.PLACEHOLDER;
  }
  return NODE_TYPES.NORMAL;
}

function toRouteMatcher(router) {
  const table = _routerNodeToTable("", router.ctx.rootNode);
  return _createMatcher(table, router.ctx.options.strictTrailingSlash);
}
function _createMatcher(table, strictTrailingSlash) {
  return {
    ctx: { table },
    matchAll: (path) => _matchRoutes(path, table, strictTrailingSlash)
  };
}
function _createRouteTable() {
  return {
    static: /* @__PURE__ */ new Map(),
    wildcard: /* @__PURE__ */ new Map(),
    dynamic: /* @__PURE__ */ new Map()
  };
}
function _matchRoutes(path, table, strictTrailingSlash) {
  if (strictTrailingSlash !== true && path.endsWith("/")) {
    path = path.slice(0, -1) || "/";
  }
  const matches = [];
  for (const [key, value] of _sortRoutesMap(table.wildcard)) {
    if (path === key || path.startsWith(key + "/")) {
      matches.push(value);
    }
  }
  for (const [key, value] of _sortRoutesMap(table.dynamic)) {
    if (path.startsWith(key + "/")) {
      const subPath = "/" + path.slice(key.length).split("/").splice(2).join("/");
      matches.push(..._matchRoutes(subPath, value));
    }
  }
  const staticMatch = table.static.get(path);
  if (staticMatch) {
    matches.push(staticMatch);
  }
  return matches.filter(Boolean);
}
function _sortRoutesMap(m) {
  return [...m.entries()].sort((a, b) => a[0].length - b[0].length);
}
function _routerNodeToTable(initialPath, initialNode) {
  const table = _createRouteTable();
  function _addNode(path, node) {
    if (path) {
      if (node.type === NODE_TYPES.NORMAL && !(path.includes("*") || path.includes(":"))) {
        if (node.data) {
          table.static.set(path, node.data);
        }
      } else if (node.type === NODE_TYPES.WILDCARD) {
        table.wildcard.set(path.replace("/**", ""), node.data);
      } else if (node.type === NODE_TYPES.PLACEHOLDER) {
        const subTable = _routerNodeToTable("", node);
        if (node.data) {
          subTable.static.set("/", node.data);
        }
        table.dynamic.set(path.replace(/\/\*|\/:\w+/, ""), subTable);
        return;
      }
    }
    for (const [childPath, child] of node.children.entries()) {
      _addNode(`${path}/${childPath}`.replace("//", "/"), child);
    }
  }
  _addNode(initialPath, initialNode);
  return table;
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = { ...defaults };
  for (const key of Object.keys(baseObject)) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();
const defuFn = createDefu((object, key, currentValue) => {
  if (object[key] !== void 0 && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});

function o(n){throw new Error(`${n} is not implemented yet!`)}let i$1 = class i extends EventEmitter{__unenv__={};readableEncoding=null;readableEnded=true;readableFlowing=false;readableHighWaterMark=0;readableLength=0;readableObjectMode=false;readableAborted=false;readableDidRead=false;closed=false;errored=null;readable=false;destroyed=false;static from(e,t){return new i(t)}constructor(e){super();}_read(e){}read(e){}setEncoding(e){return this}pause(){return this}resume(){return this}isPaused(){return  true}unpipe(e){return this}unshift(e,t){}wrap(e){return this}push(e,t){return  false}_destroy(e,t){this.removeAllListeners();}destroy(e){return this.destroyed=true,this._destroy(e),this}pipe(e,t){return {}}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return this.destroy(),Promise.resolve()}async*[Symbol.asyncIterator](){throw o("Readable.asyncIterator")}iterator(e){throw o("Readable.iterator")}map(e,t){throw o("Readable.map")}filter(e,t){throw o("Readable.filter")}forEach(e,t){throw o("Readable.forEach")}reduce(e,t,r){throw o("Readable.reduce")}find(e,t){throw o("Readable.find")}findIndex(e,t){throw o("Readable.findIndex")}some(e,t){throw o("Readable.some")}toArray(e){throw o("Readable.toArray")}every(e,t){throw o("Readable.every")}flatMap(e,t){throw o("Readable.flatMap")}drop(e,t){throw o("Readable.drop")}take(e,t){throw o("Readable.take")}asIndexedPairs(e){throw o("Readable.asIndexedPairs")}};let l$1 = class l extends EventEmitter{__unenv__={};writable=true;writableEnded=false;writableFinished=false;writableHighWaterMark=0;writableLength=0;writableObjectMode=false;writableCorked=0;closed=false;errored=null;writableNeedDrain=false;writableAborted=false;destroyed=false;_data;_encoding="utf8";constructor(e){super();}pipe(e,t){return {}}_write(e,t,r){if(this.writableEnded){r&&r();return}if(this._data===void 0)this._data=e;else {const s=typeof this._data=="string"?Buffer$1.from(this._data,this._encoding||t||"utf8"):this._data,a=typeof e=="string"?Buffer$1.from(e,t||this._encoding||"utf8"):e;this._data=Buffer$1.concat([s,a]);}this._encoding=t,r&&r();}_writev(e,t){}_destroy(e,t){}_final(e){}write(e,t,r){const s=typeof t=="string"?this._encoding:"utf8",a=typeof t=="function"?t:typeof r=="function"?r:void 0;return this._write(e,s,a),true}setDefaultEncoding(e){return this}end(e,t,r){const s=typeof e=="function"?e:typeof t=="function"?t:typeof r=="function"?r:void 0;if(this.writableEnded)return s&&s(),this;const a=e===s?void 0:e;if(a){const u=t===s?void 0:t;this.write(a,u,s);}return this.writableEnded=true,this.writableFinished=true,this.emit("close"),this.emit("finish"),this}cork(){}uncork(){}destroy(e){return this.destroyed=true,delete this._data,this.removeAllListeners(),this}compose(e,t){throw new Error("Method not implemented.")}[Symbol.asyncDispose](){return Promise.resolve()}};const c$1=class c{allowHalfOpen=true;_destroy;constructor(e=new i$1,t=new l$1){Object.assign(this,e),Object.assign(this,t),this._destroy=m(e._destroy,t._destroy);}};function _(){return Object.assign(c$1.prototype,i$1.prototype),Object.assign(c$1.prototype,l$1.prototype),c$1}function m(...n){return function(...e){for(const t of n)t(...e);}}const g=_();class A extends g{__unenv__={};bufferSize=0;bytesRead=0;bytesWritten=0;connecting=false;destroyed=false;pending=false;localAddress="";localPort=0;remoteAddress="";remoteFamily="";remotePort=0;autoSelectFamilyAttemptedAddresses=[];readyState="readOnly";constructor(e){super();}write(e,t,r){return  false}connect(e,t,r){return this}end(e,t,r){return this}setEncoding(e){return this}pause(){return this}resume(){return this}setTimeout(e,t){return this}setNoDelay(e){return this}setKeepAlive(e,t){return this}address(){return {}}unref(){return this}ref(){return this}destroySoon(){this.destroy();}resetAndDestroy(){const e=new Error("ERR_SOCKET_CLOSED");return e.code="ERR_SOCKET_CLOSED",this.destroy(e),this}}class y extends i$1{aborted=false;httpVersion="1.1";httpVersionMajor=1;httpVersionMinor=1;complete=true;connection;socket;headers={};trailers={};method="GET";url="/";statusCode=200;statusMessage="";closed=false;errored=null;readable=false;constructor(e){super(),this.socket=this.connection=e||new A;}get rawHeaders(){const e=this.headers,t=[];for(const r in e)if(Array.isArray(e[r]))for(const s of e[r])t.push(r,s);else t.push(r,e[r]);return t}get rawTrailers(){return []}setTimeout(e,t){return this}get headersDistinct(){return p(this.headers)}get trailersDistinct(){return p(this.trailers)}}function p(n){const e={};for(const[t,r]of Object.entries(n))t&&(e[t]=(Array.isArray(r)?r:[r]).filter(Boolean));return e}class w extends l$1{statusCode=200;statusMessage="";upgrading=false;chunkedEncoding=false;shouldKeepAlive=false;useChunkedEncodingByDefault=false;sendDate=false;finished=false;headersSent=false;strictContentLength=false;connection=null;socket=null;req;_headers={};constructor(e){super(),this.req=e;}assignSocket(e){e._httpMessage=this,this.socket=e,this.connection=e,this.emit("socket",e),this._flush();}_flush(){this.flushHeaders();}detachSocket(e){}writeContinue(e){}writeHead(e,t,r){e&&(this.statusCode=e),typeof t=="string"&&(this.statusMessage=t,t=void 0);const s=r||t;if(s&&!Array.isArray(s))for(const a in s)this.setHeader(a,s[a]);return this.headersSent=true,this}writeProcessing(){}setTimeout(e,t){return this}appendHeader(e,t){e=e.toLowerCase();const r=this._headers[e],s=[...Array.isArray(r)?r:[r],...Array.isArray(t)?t:[t]].filter(Boolean);return this._headers[e]=s.length>1?s:s[0],this}setHeader(e,t){return this._headers[e.toLowerCase()]=t,this}setHeaders(e){for(const[t,r]of Object.entries(e))this.setHeader(t,r);return this}getHeader(e){return this._headers[e.toLowerCase()]}getHeaders(){return this._headers}getHeaderNames(){return Object.keys(this._headers)}hasHeader(e){return e.toLowerCase()in this._headers}removeHeader(e){delete this._headers[e.toLowerCase()];}addTrailers(e){}flushHeaders(){}writeEarlyHints(e,t){typeof t=="function"&&t();}}const E=(()=>{const n=function(){};return n.prototype=Object.create(null),n})();function R(n={}){const e=new E,t=Array.isArray(n)||H(n)?n:Object.entries(n);for(const[r,s]of t)if(s){if(e[r]===void 0){e[r]=s;continue}e[r]=[...Array.isArray(e[r])?e[r]:[e[r]],...Array.isArray(s)?s:[s]];}return e}function H(n){return typeof n?.entries=="function"}function v(n={}){if(n instanceof Headers)return n;const e=new Headers;for(const[t,r]of Object.entries(n))if(r!==void 0){if(Array.isArray(r)){for(const s of r)e.append(t,String(s));continue}e.set(t,String(r));}return e}const S=new Set([101,204,205,304]);async function b(n,e){const t=new y,r=new w(t);t.url=e.url?.toString()||"/";let s;if(!t.url.startsWith("/")){const d=new URL(t.url);s=d.host,t.url=d.pathname+d.search+d.hash;}t.method=e.method||"GET",t.headers=R(e.headers||{}),t.headers.host||(t.headers.host=e.host||s||"localhost"),t.connection.encrypted=t.connection.encrypted||e.protocol==="https",t.body=e.body||null,t.__unenv__=e.context,await n(t,r);let a=r._data;(S.has(r.statusCode)||t.method.toUpperCase()==="HEAD")&&(a=null,delete r._headers["content-length"]);const u={status:r.statusCode,statusText:r.statusMessage,headers:r._headers,body:a};return t.destroy(),r.destroy(),u}async function C(n,e,t={}){try{const r=await b(n,{url:e,...t});return new Response(r.body,{status:r.status,statusText:r.statusText,headers:v(r.headers)})}catch(r){return new Response(r.toString(),{status:Number.parseInt(r.statusCode||r.code)||500,statusText:r.statusText})}}

function hasProp(obj, prop) {
  try {
    return prop in obj;
  } catch {
    return false;
  }
}

class H3Error extends Error {
  static __h3_error__ = true;
  statusCode = 500;
  fatal = false;
  unhandled = false;
  statusMessage;
  data;
  cause;
  constructor(message, opts = {}) {
    super(message, opts);
    if (opts.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
  toJSON() {
    const obj = {
      message: this.message,
      statusCode: sanitizeStatusCode(this.statusCode, 500)
    };
    if (this.statusMessage) {
      obj.statusMessage = sanitizeStatusMessage(this.statusMessage);
    }
    if (this.data !== void 0) {
      obj.data = this.data;
    }
    return obj;
  }
}
function createError$1(input) {
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error(input.message ?? input.statusMessage ?? "", {
    cause: input.cause || input
  });
  if (hasProp(input, "stack")) {
    try {
      Object.defineProperty(err, "stack", {
        get() {
          return input.stack;
        }
      });
    } catch {
      try {
        err.stack = input.stack;
      } catch {
      }
    }
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.statusCode) {
    err.statusCode = sanitizeStatusCode(input.statusCode, err.statusCode);
  } else if (input.status) {
    err.statusCode = sanitizeStatusCode(input.status, err.statusCode);
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  } else if (input.statusText) {
    err.statusMessage = input.statusText;
  }
  if (err.statusMessage) {
    const originalMessage = err.statusMessage;
    const sanitizedMessage = sanitizeStatusMessage(err.statusMessage);
    if (sanitizedMessage !== originalMessage) {
      console.warn(
        "[h3] Please prefer using `message` for longer error messages instead of `statusMessage`. In the future, `statusMessage` will be sanitized by default."
      );
    }
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function sendError(event, error, debug) {
  if (event.handled) {
    return;
  }
  const h3Error = isError(error) ? error : createError$1(error);
  const responseBody = {
    statusCode: h3Error.statusCode,
    statusMessage: h3Error.statusMessage,
    stack: [],
    data: h3Error.data
  };
  if (debug) {
    responseBody.stack = (h3Error.stack || "").split("\n").map((l) => l.trim());
  }
  if (event.handled) {
    return;
  }
  const _code = Number.parseInt(h3Error.statusCode);
  setResponseStatus(event, _code, h3Error.statusMessage);
  event.node.res.setHeader("content-type", MIMES.json);
  event.node.res.end(JSON.stringify(responseBody, void 0, 2));
}
function isError(input) {
  return input?.constructor?.__h3_error__ === true;
}

function parse(multipartBodyBuffer, boundary) {
  let lastline = "";
  let state = 0 /* INIT */;
  let buffer = [];
  const allParts = [];
  let currentPartHeaders = [];
  for (let i = 0; i < multipartBodyBuffer.length; i++) {
    const prevByte = i > 0 ? multipartBodyBuffer[i - 1] : null;
    const currByte = multipartBodyBuffer[i];
    const newLineChar = currByte === 10 || currByte === 13;
    if (!newLineChar) {
      lastline += String.fromCodePoint(currByte);
    }
    const newLineDetected = currByte === 10 && prevByte === 13;
    if (0 /* INIT */ === state && newLineDetected) {
      if ("--" + boundary === lastline) {
        state = 1 /* READING_HEADERS */;
      }
      lastline = "";
    } else if (1 /* READING_HEADERS */ === state && newLineDetected) {
      if (lastline.length > 0) {
        const i2 = lastline.indexOf(":");
        if (i2 > 0) {
          const name = lastline.slice(0, i2).toLowerCase();
          const value = lastline.slice(i2 + 1).trim();
          currentPartHeaders.push([name, value]);
        }
      } else {
        state = 2 /* READING_DATA */;
        buffer = [];
      }
      lastline = "";
    } else if (2 /* READING_DATA */ === state) {
      if (lastline.length > boundary.length + 4) {
        lastline = "";
      }
      if ("--" + boundary === lastline) {
        const j = buffer.length - lastline.length;
        const part = buffer.slice(0, j - 1);
        allParts.push(process$1(part, currentPartHeaders));
        buffer = [];
        currentPartHeaders = [];
        lastline = "";
        state = 3 /* READING_PART_SEPARATOR */;
      } else {
        buffer.push(currByte);
      }
      if (newLineDetected) {
        lastline = "";
      }
    } else if (3 /* READING_PART_SEPARATOR */ === state && newLineDetected) {
      state = 1 /* READING_HEADERS */;
    }
  }
  return allParts;
}
function process$1(data, headers) {
  const dataObj = {};
  const contentDispositionHeader = headers.find((h) => h[0] === "content-disposition")?.[1] || "";
  for (const i of contentDispositionHeader.split(";")) {
    const s = i.split("=");
    if (s.length !== 2) {
      continue;
    }
    const key = (s[0] || "").trim();
    if (key === "name" || key === "filename") {
      const _value = (s[1] || "").trim().replace(/"/g, "");
      dataObj[key] = Buffer.from(_value, "latin1").toString("utf8");
    }
  }
  const contentType = headers.find((h) => h[0] === "content-type")?.[1] || "";
  if (contentType) {
    dataObj.type = contentType;
  }
  dataObj.data = Buffer.from(data);
  return dataObj;
}

function getQuery(event) {
  return getQuery$1(event.path || "");
}
function getRouterParams(event, opts = {}) {
  let params = event.context.params || {};
  if (opts.decode) {
    params = { ...params };
    for (const key in params) {
      params[key] = decode$1(params[key]);
    }
  }
  return params;
}
function getRouterParam(event, name, opts = {}) {
  const params = getRouterParams(event, opts);
  return params[name];
}
function isMethod(event, expected, allowHead) {
  if (typeof expected === "string") {
    if (event.method === expected) {
      return true;
    }
  } else if (expected.includes(event.method)) {
    return true;
  }
  return false;
}
function assertMethod(event, expected, allowHead) {
  if (!isMethod(event, expected)) {
    throw createError$1({
      statusCode: 405,
      statusMessage: "HTTP method is not allowed."
    });
  }
}
function getRequestHeaders(event) {
  const _headers = {};
  for (const key in event.node.req.headers) {
    const val = event.node.req.headers[key];
    _headers[key] = Array.isArray(val) ? val.filter(Boolean).join(", ") : val;
  }
  return _headers;
}
function getRequestHeader(event, name) {
  const headers = getRequestHeaders(event);
  const value = headers[name.toLowerCase()];
  return value;
}
const getHeader = getRequestHeader;
function getRequestHost(event, opts = {}) {
  if (opts.xForwardedHost) {
    const _header = event.node.req.headers["x-forwarded-host"];
    const xForwardedHost = (_header || "").split(",").shift()?.trim();
    if (xForwardedHost) {
      return xForwardedHost;
    }
  }
  return event.node.req.headers.host || "localhost";
}
function getRequestProtocol(event, opts = {}) {
  if (opts.xForwardedProto !== false && event.node.req.headers["x-forwarded-proto"] === "https") {
    return "https";
  }
  return event.node.req.connection?.encrypted ? "https" : "http";
}
function getRequestURL(event, opts = {}) {
  const host = getRequestHost(event, opts);
  const protocol = getRequestProtocol(event, opts);
  const path = (event.node.req.originalUrl || event.path).replace(
    /^[/\\]+/g,
    "/"
  );
  return new URL(path, `${protocol}://${host}`);
}

const RawBodySymbol = Symbol.for("h3RawBody");
const ParsedBodySymbol = Symbol.for("h3ParsedBody");
const PayloadMethods$1 = ["PATCH", "POST", "PUT", "DELETE"];
function readRawBody(event, encoding = "utf8") {
  assertMethod(event, PayloadMethods$1);
  const _rawBody = event._requestBody || event.web?.request?.body || event.node.req[RawBodySymbol] || event.node.req.rawBody || event.node.req.body;
  if (_rawBody) {
    const promise2 = Promise.resolve(_rawBody).then((_resolved) => {
      if (Buffer.isBuffer(_resolved)) {
        return _resolved;
      }
      if (typeof _resolved.pipeTo === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.pipeTo(
            new WritableStream({
              write(chunk) {
                chunks.push(chunk);
              },
              close() {
                resolve(Buffer.concat(chunks));
              },
              abort(reason) {
                reject(reason);
              }
            })
          ).catch(reject);
        });
      } else if (typeof _resolved.pipe === "function") {
        return new Promise((resolve, reject) => {
          const chunks = [];
          _resolved.on("data", (chunk) => {
            chunks.push(chunk);
          }).on("end", () => {
            resolve(Buffer.concat(chunks));
          }).on("error", reject);
        });
      }
      if (_resolved.constructor === Object) {
        return Buffer.from(JSON.stringify(_resolved));
      }
      if (_resolved instanceof URLSearchParams) {
        return Buffer.from(_resolved.toString());
      }
      if (_resolved instanceof FormData) {
        return new Response(_resolved).bytes().then((uint8arr) => Buffer.from(uint8arr));
      }
      return Buffer.from(_resolved);
    });
    return encoding ? promise2.then((buff) => buff.toString(encoding)) : promise2;
  }
  if (!Number.parseInt(event.node.req.headers["content-length"] || "") && !/\bchunked\b/i.test(
    String(event.node.req.headers["transfer-encoding"] ?? "")
  )) {
    return Promise.resolve(void 0);
  }
  const promise = event.node.req[RawBodySymbol] = new Promise(
    (resolve, reject) => {
      const bodyData = [];
      event.node.req.on("error", (err) => {
        reject(err);
      }).on("data", (chunk) => {
        bodyData.push(chunk);
      }).on("end", () => {
        resolve(Buffer.concat(bodyData));
      });
    }
  );
  const result = encoding ? promise.then((buff) => buff.toString(encoding)) : promise;
  return result;
}
async function readBody(event, options = {}) {
  const request = event.node.req;
  if (hasProp(request, ParsedBodySymbol)) {
    return request[ParsedBodySymbol];
  }
  const contentType = request.headers["content-type"] || "";
  const body = await readRawBody(event);
  let parsed;
  if (contentType === "application/json") {
    parsed = _parseJSON(body, options.strict ?? true);
  } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
    parsed = _parseURLEncodedBody(body);
  } else if (contentType.startsWith("text/")) {
    parsed = body;
  } else {
    parsed = _parseJSON(body, options.strict ?? false);
  }
  request[ParsedBodySymbol] = parsed;
  return parsed;
}
async function readMultipartFormData(event) {
  const contentType = getRequestHeader(event, "content-type");
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    return;
  }
  const boundary = contentType.match(/boundary=([^;]*)(;|$)/i)?.[1];
  if (!boundary) {
    return;
  }
  const body = await readRawBody(event, false);
  if (!body) {
    return;
  }
  return parse(body, boundary);
}
function getRequestWebStream(event) {
  if (!PayloadMethods$1.includes(event.method)) {
    return;
  }
  const bodyStream = event.web?.request?.body || event._requestBody;
  if (bodyStream) {
    return bodyStream;
  }
  const _hasRawBody = RawBodySymbol in event.node.req || "rawBody" in event.node.req || "body" in event.node.req || "__unenv__" in event.node.req;
  if (_hasRawBody) {
    return new ReadableStream({
      async start(controller) {
        const _rawBody = await readRawBody(event, false);
        if (_rawBody) {
          controller.enqueue(_rawBody);
        }
        controller.close();
      }
    });
  }
  return new ReadableStream({
    start: (controller) => {
      event.node.req.on("data", (chunk) => {
        controller.enqueue(chunk);
      });
      event.node.req.on("end", () => {
        controller.close();
      });
      event.node.req.on("error", (err) => {
        controller.error(err);
      });
    }
  });
}
function _parseJSON(body = "", strict) {
  if (!body) {
    return void 0;
  }
  try {
    return destr(body, { strict });
  } catch {
    throw createError$1({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid JSON body"
    });
  }
}
function _parseURLEncodedBody(body) {
  const form = new URLSearchParams(body);
  const parsedForm = /* @__PURE__ */ Object.create(null);
  for (const [key, value] of form.entries()) {
    if (hasProp(parsedForm, key)) {
      if (!Array.isArray(parsedForm[key])) {
        parsedForm[key] = [parsedForm[key]];
      }
      parsedForm[key].push(value);
    } else {
      parsedForm[key] = value;
    }
  }
  return parsedForm;
}

function handleCacheHeaders(event, opts) {
  const cacheControls = ["public", ...opts.cacheControls || []];
  let cacheMatched = false;
  if (opts.maxAge !== void 0) {
    cacheControls.push(`max-age=${+opts.maxAge}`, `s-maxage=${+opts.maxAge}`);
  }
  if (opts.modifiedTime) {
    const modifiedTime = new Date(opts.modifiedTime);
    const ifModifiedSince = event.node.req.headers["if-modified-since"];
    event.node.res.setHeader("last-modified", modifiedTime.toUTCString());
    if (ifModifiedSince && new Date(ifModifiedSince) >= modifiedTime) {
      cacheMatched = true;
    }
  }
  if (opts.etag) {
    event.node.res.setHeader("etag", opts.etag);
    const ifNonMatch = event.node.req.headers["if-none-match"];
    if (ifNonMatch === opts.etag) {
      cacheMatched = true;
    }
  }
  event.node.res.setHeader("cache-control", cacheControls.join(", "));
  if (cacheMatched) {
    event.node.res.statusCode = 304;
    if (!event.handled) {
      event.node.res.end();
    }
    return true;
  }
  return false;
}

const MIMES = {
  html: "text/html",
  json: "application/json"
};

const DISALLOWED_STATUS_CHARS = /[^\u0009\u0020-\u007E]/g;
function sanitizeStatusMessage(statusMessage = "") {
  return statusMessage.replace(DISALLOWED_STATUS_CHARS, "");
}
function sanitizeStatusCode(statusCode, defaultStatusCode = 200) {
  if (!statusCode) {
    return defaultStatusCode;
  }
  if (typeof statusCode === "string") {
    statusCode = Number.parseInt(statusCode, 10);
  }
  if (statusCode < 100 || statusCode > 999) {
    return defaultStatusCode;
  }
  return statusCode;
}

function parseCookies(event) {
  return parse$1(event.node.req.headers.cookie || "");
}
function getCookie(event, name) {
  return parseCookies(event)[name];
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString.flatMap((c) => splitCookiesString(c));
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  const cookiesStrings = [];
  let pos = 0;
  let start;
  let ch;
  let lastComma;
  let nextStart;
  let cookiesSeparatorFound;
  const skipWhitespace = () => {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  };
  const notSpecialChar = () => {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  };
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.slice(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.slice(start));
    }
  }
  return cookiesStrings;
}

const defer = typeof setImmediate === "undefined" ? (fn) => fn() : setImmediate;
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      if (!event.handled) {
        event.node.res.end(data);
      }
      resolve();
    });
  });
}
function sendNoContent(event, code) {
  if (event.handled) {
    return;
  }
  if (!code && event.node.res.statusCode !== 200) {
    code = event.node.res.statusCode;
  }
  const _code = sanitizeStatusCode(code, 204);
  if (_code === 204) {
    event.node.res.removeHeader("content-length");
  }
  event.node.res.writeHead(_code);
  event.node.res.end();
}
function setResponseStatus(event, code, text) {
  if (code) {
    event.node.res.statusCode = sanitizeStatusCode(
      code,
      event.node.res.statusCode
    );
  }
  if (text) {
    event.node.res.statusMessage = sanitizeStatusMessage(text);
  }
}
function getResponseStatus(event) {
  return event.node.res.statusCode;
}
function getResponseStatusText(event) {
  return event.node.res.statusMessage;
}
function defaultContentType(event, type) {
  if (type && event.node.res.statusCode !== 304 && !event.node.res.getHeader("content-type")) {
    event.node.res.setHeader("content-type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.node.res.statusCode = sanitizeStatusCode(
    code,
    event.node.res.statusCode
  );
  event.node.res.setHeader("location", location);
  const encodedLoc = location.replace(/"/g, "%22");
  const html = `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`;
  return send(event, html, MIMES.html);
}
function getResponseHeader(event, name) {
  return event.node.res.getHeader(name);
}
function setResponseHeaders(event, headers) {
  for (const [name, value] of Object.entries(headers)) {
    event.node.res.setHeader(
      name,
      value
    );
  }
}
const setHeaders = setResponseHeaders;
function setResponseHeader(event, name, value) {
  event.node.res.setHeader(name, value);
}
const setHeader = setResponseHeader;
function appendResponseHeader(event, name, value) {
  let current = event.node.res.getHeader(name);
  if (!current) {
    event.node.res.setHeader(name, value);
    return;
  }
  if (!Array.isArray(current)) {
    current = [current.toString()];
  }
  event.node.res.setHeader(name, [...current, value]);
}
function removeResponseHeader(event, name) {
  return event.node.res.removeHeader(name);
}
function isStream(data) {
  if (!data || typeof data !== "object") {
    return false;
  }
  if (typeof data.pipe === "function") {
    if (typeof data._read === "function") {
      return true;
    }
    if (typeof data.abort === "function") {
      return true;
    }
  }
  if (typeof data.pipeTo === "function") {
    return true;
  }
  return false;
}
function isWebResponse(data) {
  return typeof Response !== "undefined" && data instanceof Response;
}
function sendStream(event, stream) {
  if (!stream || typeof stream !== "object") {
    throw new Error("[h3] Invalid stream provided.");
  }
  event.node.res._data = stream;
  if (!event.node.res.socket) {
    event._handled = true;
    return Promise.resolve();
  }
  if (hasProp(stream, "pipeTo") && typeof stream.pipeTo === "function") {
    return stream.pipeTo(
      new WritableStream({
        write(chunk) {
          event.node.res.write(chunk);
        }
      })
    ).then(() => {
      event.node.res.end();
    });
  }
  if (hasProp(stream, "pipe") && typeof stream.pipe === "function") {
    return new Promise((resolve, reject) => {
      stream.pipe(event.node.res);
      if (stream.on) {
        stream.on("end", () => {
          event.node.res.end();
          resolve();
        });
        stream.on("error", (error) => {
          reject(error);
        });
      }
      event.node.res.on("close", () => {
        if (stream.abort) {
          stream.abort();
        }
      });
    });
  }
  throw new Error("[h3] Invalid or incompatible stream provided.");
}
function sendWebResponse(event, response) {
  for (const [key, value] of response.headers) {
    if (key === "set-cookie") {
      event.node.res.appendHeader(key, splitCookiesString(value));
    } else {
      event.node.res.setHeader(key, value);
    }
  }
  if (response.status) {
    event.node.res.statusCode = sanitizeStatusCode(
      response.status,
      event.node.res.statusCode
    );
  }
  if (response.statusText) {
    event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  }
  if (response.redirected) {
    event.node.res.setHeader("location", response.url);
  }
  if (!response.body) {
    event.node.res.end();
    return;
  }
  return sendStream(event, response.body);
}

const PayloadMethods = /* @__PURE__ */ new Set(["PATCH", "POST", "PUT", "DELETE"]);
const ignoredHeaders = /* @__PURE__ */ new Set([
  "transfer-encoding",
  "accept-encoding",
  "connection",
  "keep-alive",
  "upgrade",
  "expect",
  "host",
  "accept"
]);
async function proxyRequest(event, target, opts = {}) {
  let body;
  let duplex;
  if (PayloadMethods.has(event.method)) {
    if (opts.streamRequest) {
      body = getRequestWebStream(event);
      duplex = "half";
    } else {
      body = await readRawBody(event, false).catch(() => void 0);
    }
  }
  const method = opts.fetchOptions?.method || event.method;
  const fetchHeaders = mergeHeaders$1(
    getProxyRequestHeaders(event, { host: target.startsWith("/") }),
    opts.fetchOptions?.headers,
    opts.headers
  );
  return sendProxy(event, target, {
    ...opts,
    fetchOptions: {
      method,
      body,
      duplex,
      ...opts.fetchOptions,
      headers: fetchHeaders
    }
  });
}
async function sendProxy(event, target, opts = {}) {
  let response;
  try {
    response = await _getFetch(opts.fetch)(target, {
      headers: opts.headers,
      ignoreResponseError: true,
      // make $ofetch.raw transparent
      ...opts.fetchOptions
    });
  } catch (error) {
    throw createError$1({
      status: 502,
      statusMessage: "Bad Gateway",
      cause: error
    });
  }
  event.node.res.statusCode = sanitizeStatusCode(
    response.status,
    event.node.res.statusCode
  );
  event.node.res.statusMessage = sanitizeStatusMessage(response.statusText);
  const cookies = [];
  for (const [key, value] of response.headers.entries()) {
    if (key === "content-encoding") {
      continue;
    }
    if (key === "content-length") {
      continue;
    }
    if (key === "set-cookie") {
      cookies.push(...splitCookiesString(value));
      continue;
    }
    event.node.res.setHeader(key, value);
  }
  if (cookies.length > 0) {
    event.node.res.setHeader(
      "set-cookie",
      cookies.map((cookie) => {
        if (opts.cookieDomainRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookieDomainRewrite,
            "domain"
          );
        }
        if (opts.cookiePathRewrite) {
          cookie = rewriteCookieProperty(
            cookie,
            opts.cookiePathRewrite,
            "path"
          );
        }
        return cookie;
      })
    );
  }
  if (opts.onResponse) {
    await opts.onResponse(event, response);
  }
  if (response._data !== void 0) {
    return response._data;
  }
  if (event.handled) {
    return;
  }
  if (opts.sendStream === false) {
    const data = new Uint8Array(await response.arrayBuffer());
    return event.node.res.end(data);
  }
  if (response.body) {
    for await (const chunk of response.body) {
      event.node.res.write(chunk);
    }
  }
  return event.node.res.end();
}
function getProxyRequestHeaders(event, opts) {
  const headers = /* @__PURE__ */ Object.create(null);
  const reqHeaders = getRequestHeaders(event);
  for (const name in reqHeaders) {
    if (!ignoredHeaders.has(name) || name === "host" && opts?.host) {
      headers[name] = reqHeaders[name];
    }
  }
  return headers;
}
function fetchWithEvent(event, req, init, options) {
  return _getFetch(options?.fetch)(req, {
    ...init,
    context: init?.context || event.context,
    headers: {
      ...getProxyRequestHeaders(event, {
        host: typeof req === "string" && req.startsWith("/")
      }),
      ...init?.headers
    }
  });
}
function _getFetch(_fetch) {
  if (_fetch) {
    return _fetch;
  }
  if (globalThis.fetch) {
    return globalThis.fetch;
  }
  throw new Error(
    "fetch is not available. Try importing `node-fetch-native/polyfill` for Node.js."
  );
}
function rewriteCookieProperty(header, map, property) {
  const _map = typeof map === "string" ? { "*": map } : map;
  return header.replace(
    new RegExp(`(;\\s*${property}=)([^;]+)`, "gi"),
    (match, prefix, previousValue) => {
      let newValue;
      if (previousValue in _map) {
        newValue = _map[previousValue];
      } else if ("*" in _map) {
        newValue = _map["*"];
      } else {
        return match;
      }
      return newValue ? prefix + newValue : "";
    }
  );
}
function mergeHeaders$1(defaults, ...inputs) {
  const _inputs = inputs.filter(Boolean);
  if (_inputs.length === 0) {
    return defaults;
  }
  const merged = new Headers(defaults);
  for (const input of _inputs) {
    const entries = Array.isArray(input) ? input : typeof input.entries === "function" ? input.entries() : Object.entries(input);
    for (const [key, value] of entries) {
      if (value !== void 0) {
        merged.set(key, value);
      }
    }
  }
  return merged;
}

class H3Event {
  "__is_event__" = true;
  // Context
  node;
  // Node
  web;
  // Web
  context = {};
  // Shared
  // Request
  _method;
  _path;
  _headers;
  _requestBody;
  // Response
  _handled = false;
  // Hooks
  _onBeforeResponseCalled;
  _onAfterResponseCalled;
  constructor(req, res) {
    this.node = { req, res };
  }
  // --- Request ---
  get method() {
    if (!this._method) {
      this._method = (this.node.req.method || "GET").toUpperCase();
    }
    return this._method;
  }
  get path() {
    return this._path || this.node.req.url || "/";
  }
  get headers() {
    if (!this._headers) {
      this._headers = _normalizeNodeHeaders(this.node.req.headers);
    }
    return this._headers;
  }
  // --- Respoonse ---
  get handled() {
    return this._handled || this.node.res.writableEnded || this.node.res.headersSent;
  }
  respondWith(response) {
    return Promise.resolve(response).then(
      (_response) => sendWebResponse(this, _response)
    );
  }
  // --- Utils ---
  toString() {
    return `[${this.method}] ${this.path}`;
  }
  toJSON() {
    return this.toString();
  }
  // --- Deprecated ---
  /** @deprecated Please use `event.node.req` instead. */
  get req() {
    return this.node.req;
  }
  /** @deprecated Please use `event.node.res` instead. */
  get res() {
    return this.node.res;
  }
}
function isEvent(input) {
  return hasProp(input, "__is_event__");
}
function createEvent(req, res) {
  return new H3Event(req, res);
}
function _normalizeNodeHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(nodeHeaders)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

function defineEventHandler(handler) {
  if (typeof handler === "function") {
    handler.__is_handler__ = true;
    return handler;
  }
  const _hooks = {
    onRequest: _normalizeArray(handler.onRequest),
    onBeforeResponse: _normalizeArray(handler.onBeforeResponse)
  };
  const _handler = (event) => {
    return _callHandler(event, handler.handler, _hooks);
  };
  _handler.__is_handler__ = true;
  _handler.__resolve__ = handler.handler.__resolve__;
  _handler.__websocket__ = handler.websocket;
  return _handler;
}
function _normalizeArray(input) {
  return input ? Array.isArray(input) ? input : [input] : void 0;
}
async function _callHandler(event, handler, hooks) {
  if (hooks.onRequest) {
    for (const hook of hooks.onRequest) {
      await hook(event);
      if (event.handled) {
        return;
      }
    }
  }
  const body = await handler(event);
  const response = { body };
  if (hooks.onBeforeResponse) {
    for (const hook of hooks.onBeforeResponse) {
      await hook(event, response);
    }
  }
  return response.body;
}
const eventHandler = defineEventHandler;
function isEventHandler(input) {
  return hasProp(input, "__is_handler__");
}
function toEventHandler(input, _, _route) {
  return input;
}
function defineLazyEventHandler(factory) {
  let _promise;
  let _resolved;
  const resolveHandler = () => {
    if (_resolved) {
      return Promise.resolve(_resolved);
    }
    if (!_promise) {
      _promise = Promise.resolve(factory()).then((r) => {
        const handler2 = r.default || r;
        if (typeof handler2 !== "function") {
          throw new TypeError(
            "Invalid lazy handler result. It should be a function:",
            handler2
          );
        }
        _resolved = { handler: toEventHandler(r.default || r) };
        return _resolved;
      });
    }
    return _promise;
  };
  const handler = eventHandler((event) => {
    if (_resolved) {
      return _resolved.handler(event);
    }
    return resolveHandler().then((r) => r.handler(event));
  });
  handler.__resolve__ = resolveHandler;
  return handler;
}
const lazyEventHandler = defineLazyEventHandler;

function createApp(options = {}) {
  const stack = [];
  const handler = createAppEventHandler(stack, options);
  const resolve = createResolver(stack);
  handler.__resolve__ = resolve;
  const getWebsocket = cachedFn(() => websocketOptions(resolve, options));
  const app = {
    // @ts-expect-error
    use: (arg1, arg2, arg3) => use(app, arg1, arg2, arg3),
    resolve,
    handler,
    stack,
    options,
    get websocket() {
      return getWebsocket();
    }
  };
  return app;
}
function use(app, arg1, arg2, arg3) {
  if (Array.isArray(arg1)) {
    for (const i of arg1) {
      use(app, i, arg2, arg3);
    }
  } else if (Array.isArray(arg2)) {
    for (const i of arg2) {
      use(app, arg1, i, arg3);
    }
  } else if (typeof arg1 === "string") {
    app.stack.push(
      normalizeLayer({ ...arg3, route: arg1, handler: arg2 })
    );
  } else if (typeof arg1 === "function") {
    app.stack.push(normalizeLayer({ ...arg2, handler: arg1 }));
  } else {
    app.stack.push(normalizeLayer({ ...arg1 }));
  }
  return app;
}
function createAppEventHandler(stack, options) {
  const spacing = options.debug ? 2 : void 0;
  return eventHandler(async (event) => {
    event.node.req.originalUrl = event.node.req.originalUrl || event.node.req.url || "/";
    const _rawReqUrl = event.node.req.url || "/";
    const _reqPath = _decodePath(event._path || _rawReqUrl);
    event._path = _reqPath;
    const _needsRawUrl = _reqPath !== _rawReqUrl;
    let _layerPath;
    if (options.onRequest) {
      await options.onRequest(event);
    }
    for (const layer of stack) {
      if (layer.route.length > 1) {
        if (!_reqPath.startsWith(layer.route)) {
          continue;
        }
        _layerPath = _reqPath.slice(layer.route.length) || "/";
      } else {
        _layerPath = _reqPath;
      }
      if (layer.match && !layer.match(_layerPath, event)) {
        continue;
      }
      event._path = _layerPath;
      event.node.req.url = _needsRawUrl ? layer.route.length > 1 ? _rawReqUrl.slice(layer.route.length) || "/" : _rawReqUrl : _layerPath;
      const val = await layer.handler(event);
      const _body = val === void 0 ? void 0 : await val;
      if (_body !== void 0) {
        const _response = { body: _body };
        if (options.onBeforeResponse) {
          event._onBeforeResponseCalled = true;
          await options.onBeforeResponse(event, _response);
        }
        await handleHandlerResponse(event, _response.body, spacing);
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, _response);
        }
        return;
      }
      if (event.handled) {
        if (options.onAfterResponse) {
          event._onAfterResponseCalled = true;
          await options.onAfterResponse(event, void 0);
        }
        return;
      }
    }
    if (!event.handled) {
      throw createError$1({
        statusCode: 404,
        statusMessage: `Cannot find any path matching ${event.path || "/"}.`
      });
    }
    if (options.onAfterResponse) {
      event._onAfterResponseCalled = true;
      await options.onAfterResponse(event, void 0);
    }
  });
}
function createResolver(stack) {
  return async (path) => {
    let _layerPath;
    for (const layer of stack) {
      if (layer.route === "/" && !layer.handler.__resolve__) {
        continue;
      }
      if (!path.startsWith(layer.route)) {
        continue;
      }
      _layerPath = path.slice(layer.route.length) || "/";
      if (layer.match && !layer.match(_layerPath, void 0)) {
        continue;
      }
      let res = { route: layer.route, handler: layer.handler };
      if (res.handler.__resolve__) {
        const _res = await res.handler.__resolve__(_layerPath);
        if (!_res) {
          continue;
        }
        res = {
          ...res,
          ..._res,
          route: joinURL(res.route || "/", _res.route || "/")
        };
      }
      return res;
    }
  };
}
function normalizeLayer(input) {
  let handler = input.handler;
  if (handler.handler) {
    handler = handler.handler;
  }
  if (input.lazy) {
    handler = lazyEventHandler(handler);
  } else if (!isEventHandler(handler)) {
    handler = toEventHandler(handler, void 0, input.route);
  }
  return {
    route: withoutTrailingSlash(input.route),
    match: input.match,
    handler
  };
}
function handleHandlerResponse(event, val, jsonSpace) {
  if (val === null) {
    return sendNoContent(event);
  }
  if (val) {
    if (isWebResponse(val)) {
      return sendWebResponse(event, val);
    }
    if (isStream(val)) {
      return sendStream(event, val);
    }
    if (val.buffer) {
      return send(event, val);
    }
    if (val.arrayBuffer && typeof val.arrayBuffer === "function") {
      return val.arrayBuffer().then((arrayBuffer) => {
        return send(event, Buffer.from(arrayBuffer), val.type);
      });
    }
    if (val instanceof Error) {
      throw createError$1(val);
    }
    if (typeof val.end === "function") {
      return true;
    }
  }
  const valType = typeof val;
  if (valType === "string") {
    return send(event, val, MIMES.html);
  }
  if (valType === "object" || valType === "boolean" || valType === "number") {
    return send(event, JSON.stringify(val, void 0, jsonSpace), MIMES.json);
  }
  if (valType === "bigint") {
    return send(event, val.toString(), MIMES.json);
  }
  throw createError$1({
    statusCode: 500,
    statusMessage: `[h3] Cannot send ${valType} as response.`
  });
}
function cachedFn(fn) {
  let cache;
  return () => {
    if (!cache) {
      cache = fn();
    }
    return cache;
  };
}
function _decodePath(url) {
  const qIndex = url.indexOf("?");
  const path = qIndex === -1 ? url : url.slice(0, qIndex);
  const query = qIndex === -1 ? "" : url.slice(qIndex);
  const decodedPath = path.includes("%25") ? decodePath(path.replace(/%25/g, "%2525")) : decodePath(path);
  return decodedPath + query;
}
function websocketOptions(evResolver, appOptions) {
  return {
    ...appOptions.websocket,
    async resolve(info) {
      const url = info.request?.url || info.url || "/";
      const { pathname } = typeof url === "string" ? parseURL(url) : url;
      const resolved = await evResolver(pathname);
      return resolved?.handler?.__websocket__ || {};
    }
  };
}

const RouterMethods = [
  "connect",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "trace",
  "patch"
];
function createRouter(opts = {}) {
  const _router = createRouter$1({});
  const routes = {};
  let _matcher;
  const router = {};
  const addRoute = (path, handler, method) => {
    let route = routes[path];
    if (!route) {
      routes[path] = route = { path, handlers: {} };
      _router.insert(path, route);
    }
    if (Array.isArray(method)) {
      for (const m of method) {
        addRoute(path, handler, m);
      }
    } else {
      route.handlers[method] = toEventHandler(handler);
    }
    return router;
  };
  router.use = router.add = (path, handler, method) => addRoute(path, handler, method || "all");
  for (const method of RouterMethods) {
    router[method] = (path, handle) => router.add(path, handle, method);
  }
  const matchHandler = (path = "/", method = "get") => {
    const qIndex = path.indexOf("?");
    if (qIndex !== -1) {
      path = path.slice(0, Math.max(0, qIndex));
    }
    const matched = _router.lookup(path);
    if (!matched || !matched.handlers) {
      return {
        error: createError$1({
          statusCode: 404,
          name: "Not Found",
          statusMessage: `Cannot find any route matching ${path || "/"}.`
        })
      };
    }
    let handler = matched.handlers[method] || matched.handlers.all;
    if (!handler) {
      if (!_matcher) {
        _matcher = toRouteMatcher(_router);
      }
      const _matches = _matcher.matchAll(path).reverse();
      for (const _match of _matches) {
        if (_match.handlers[method]) {
          handler = _match.handlers[method];
          matched.handlers[method] = matched.handlers[method] || handler;
          break;
        }
        if (_match.handlers.all) {
          handler = _match.handlers.all;
          matched.handlers.all = matched.handlers.all || handler;
          break;
        }
      }
    }
    if (!handler) {
      return {
        error: createError$1({
          statusCode: 405,
          name: "Method Not Allowed",
          statusMessage: `Method ${method} is not allowed on this route.`
        })
      };
    }
    return { matched, handler };
  };
  const isPreemptive = opts.preemptive || opts.preemtive;
  router.handler = eventHandler((event) => {
    const match = matchHandler(
      event.path,
      event.method.toLowerCase()
    );
    if ("error" in match) {
      if (isPreemptive) {
        throw match.error;
      } else {
        return;
      }
    }
    event.context.matchedRoute = match.matched;
    const params = match.matched.params || {};
    event.context.params = params;
    return Promise.resolve(match.handler(event)).then((res) => {
      if (res === void 0 && isPreemptive) {
        return null;
      }
      return res;
    });
  });
  router.handler.__resolve__ = async (path) => {
    path = withLeadingSlash(path);
    const match = matchHandler(path);
    if ("error" in match) {
      return;
    }
    let res = {
      route: match.matched.path,
      handler: match.handler
    };
    if (match.handler.__resolve__) {
      const _res = await match.handler.__resolve__(path);
      if (!_res) {
        return;
      }
      res = { ...res, ..._res };
    }
    return res;
  };
  return router;
}
function toNodeListener(app) {
  const toNodeHandle = async function(req, res) {
    const event = createEvent(req, res);
    try {
      await app.handler(event);
    } catch (_error) {
      const error = createError$1(_error);
      if (!isError(_error)) {
        error.unhandled = true;
      }
      setResponseStatus(event, error.statusCode, error.statusMessage);
      if (app.options.onError) {
        await app.options.onError(error, event);
      }
      if (event.handled) {
        return;
      }
      if (error.unhandled || error.fatal) {
        console.error("[h3]", error.fatal ? "[fatal]" : "[unhandled]", error);
      }
      if (app.options.onBeforeResponse && !event._onBeforeResponseCalled) {
        await app.options.onBeforeResponse(event, { body: error });
      }
      await sendError(event, error, !!app.options.debug);
      if (app.options.onAfterResponse && !event._onAfterResponseCalled) {
        await app.options.onAfterResponse(event, { body: error });
      }
    }
  };
  return toNodeHandle;
}

function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
const defaultTask = { run: (function_) => function_() };
const _createTask = () => defaultTask;
const createTask = typeof console.createTask !== "undefined" ? console.createTask : _createTask;
function serialTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return hooks.reduce(
    (promise, hookFunction) => promise.then(() => task.run(() => hookFunction(...args))),
    Promise.resolve()
  );
}
function parallelTaskCaller(hooks, args) {
  const name = args.shift();
  const task = createTask(name);
  return Promise.all(hooks.map((hook) => task.run(() => hook(...args))));
}
function callEachWith(callbacks, arg0) {
  for (const callback of [...callbacks]) {
    callback(arg0);
  }
}

class Hookable {
  constructor() {
    this._hooks = {};
    this._before = void 0;
    this._after = void 0;
    this._deprecatedMessages = void 0;
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, function_, options = {}) {
    if (!name || typeof function_ !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let dep;
    while (this._deprecatedHooks[name]) {
      dep = this._deprecatedHooks[name];
      name = dep.to;
    }
    if (dep && !options.allowDeprecated) {
      let message = dep.message;
      if (!message) {
        message = `${originalName} hook has been deprecated` + (dep.to ? `, please use ${dep.to}` : "");
      }
      if (!this._deprecatedMessages) {
        this._deprecatedMessages = /* @__PURE__ */ new Set();
      }
      if (!this._deprecatedMessages.has(message)) {
        console.warn(message);
        this._deprecatedMessages.add(message);
      }
    }
    if (!function_.name) {
      try {
        Object.defineProperty(function_, "name", {
          get: () => "_" + name.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(function_);
    return () => {
      if (function_) {
        this.removeHook(name, function_);
        function_ = void 0;
      }
    };
  }
  hookOnce(name, function_) {
    let _unreg;
    let _function = (...arguments_) => {
      if (typeof _unreg === "function") {
        _unreg();
      }
      _unreg = void 0;
      _function = void 0;
      return function_(...arguments_);
    };
    _unreg = this.hook(name, _function);
    return _unreg;
  }
  removeHook(name, function_) {
    if (this._hooks[name]) {
      const index = this._hooks[name].indexOf(function_);
      if (index !== -1) {
        this._hooks[name].splice(index, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = typeof deprecated === "string" ? { to: deprecated } : deprecated;
    const _hooks = this._hooks[name] || [];
    delete this._hooks[name];
    for (const hook of _hooks) {
      this.hook(name, hook);
    }
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
    for (const name in deprecatedHooks) {
      this.deprecateHook(name, deprecatedHooks[name]);
    }
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map(
      (key) => this.hook(key, hooks[key])
    );
    return () => {
      for (const unreg of removeFns.splice(0, removeFns.length)) {
        unreg();
      }
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  removeAllHooks() {
    for (const key in this._hooks) {
      delete this._hooks[key];
    }
  }
  callHook(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(serialTaskCaller, name, ...arguments_);
  }
  callHookParallel(name, ...arguments_) {
    arguments_.unshift(name);
    return this.callHookWith(parallelTaskCaller, name, ...arguments_);
  }
  callHookWith(caller, name, ...arguments_) {
    const event = this._before || this._after ? { name, args: arguments_, context: {} } : void 0;
    if (this._before) {
      callEachWith(this._before, event);
    }
    const result = caller(
      name in this._hooks ? [...this._hooks[name]] : [],
      arguments_
    );
    if (result instanceof Promise) {
      return result.finally(() => {
        if (this._after && event) {
          callEachWith(this._after, event);
        }
      });
    }
    if (this._after && event) {
      callEachWith(this._after, event);
    }
    return result;
  }
  beforeEach(function_) {
    this._before = this._before || [];
    this._before.push(function_);
    return () => {
      if (this._before !== void 0) {
        const index = this._before.indexOf(function_);
        if (index !== -1) {
          this._before.splice(index, 1);
        }
      }
    };
  }
  afterEach(function_) {
    this._after = this._after || [];
    this._after.push(function_);
    return () => {
      if (this._after !== void 0) {
        const index = this._after.indexOf(function_);
        if (index !== -1) {
          this._after.splice(index, 1);
        }
      }
    };
  }
}
function createHooks() {
  return new Hookable();
}

const s$1=globalThis.Headers,i=globalThis.AbortController,l=globalThis.fetch||(()=>{throw new Error("[node-fetch-native] Failed to fetch: `globalThis.fetch` is not available!")});

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  if (value instanceof FormData || value instanceof URLSearchParams) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (contentType === "text/event-stream") {
    return "stream";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
      if (!(context.options.headers instanceof Headers)) {
        context.options.headers = new Headers(
          context.options.headers || {}
          /* compat */
        );
      }
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        const contentType = context.options.headers.get("content-type");
        if (typeof context.options.body !== "string") {
          context.options.body = contentType === "application/x-www-form-urlencoded" ? new URLSearchParams(
            context.options.body
          ).toString() : JSON.stringify(context.options.body);
        }
        if (!contentType) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return l;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new http.Agent(agentOptions);
  const httpsAgent = new https.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return l(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch$1 = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers$1 = globalThis.Headers || s$1;
const AbortController = globalThis.AbortController || i;
createFetch({ fetch: fetch$1, Headers: Headers$1, AbortController });

function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
const BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c) => c.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}

const storageKeyProperties = [
  "has",
  "hasItem",
  "get",
  "getItem",
  "getItemRaw",
  "set",
  "setItem",
  "setItemRaw",
  "del",
  "remove",
  "removeItem",
  "getMeta",
  "setMeta",
  "removeMeta",
  "getKeys",
  "clear",
  "mount",
  "unmount"
];
function prefixStorage(storage, base) {
  base = normalizeBaseKey(base);
  if (!base) {
    return storage;
  }
  const nsStorage = { ...storage };
  for (const property of storageKeyProperties) {
    nsStorage[property] = (key = "", ...args) => (
      // @ts-ignore
      storage[property](base + key, ...args)
    );
  }
  nsStorage.getKeys = (key = "", ...arguments_) => storage.getKeys(base + key, ...arguments_).then((keys) => keys.map((key2) => key2.slice(base.length)));
  nsStorage.keys = nsStorage.getKeys;
  nsStorage.getItems = async (items, commonOptions) => {
    const prefixedItems = items.map(
      (item) => typeof item === "string" ? base + item : { ...item, key: base + item.key }
    );
    const results = await storage.getItems(prefixedItems, commonOptions);
    return results.map((entry) => ({
      key: entry.key.slice(base.length),
      value: entry.value
    }));
  };
  nsStorage.setItems = async (items, commonOptions) => {
    const prefixedItems = items.map((item) => ({
      key: base + item.key,
      value: item.value,
      options: item.options
    }));
    return storage.setItems(prefixedItems, commonOptions);
  };
  return nsStorage;
}
function normalizeKey$1(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey$1(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey$1(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}

function defineDriver$1(factory) {
  return factory;
}

const DRIVER_NAME$1 = "memory";
const memory = defineDriver$1(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME$1,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});

function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey$1(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey$1(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r) => r.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r) => r.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey$1(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey$1(key);
          if (!maskedMounts.some((p) => fullKey.startsWith(p))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p) => !p.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m) => {
          if (m.driver.clear) {
            return asyncCall(m.driver.clear, m.relativeBase, opts);
          }
          if (m.driver.removeItem) {
            const keys = await m.driver.getKeys(m.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a, b) => b.length - a.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey$1(key) + ":";
      const m = getMount(key);
      return {
        driver: m.driver,
        base: m.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey$1(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m) => ({
        driver: m.driver,
        base: m.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

const _assets = {

};

const normalizeKey = function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
};

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

function ignoreNotfound(err) {
  return err.code === "ENOENT" || err.code === "EISDIR" ? null : err;
}
function ignoreExists(err) {
  return err.code === "EEXIST" ? null : err;
}
async function writeFile(path, data, encoding) {
  await ensuredir(dirname$1(path));
  return promises.writeFile(path, data, encoding);
}
function readFile(path, encoding) {
  return promises.readFile(path, encoding).catch(ignoreNotfound);
}
function unlink(path) {
  return promises.unlink(path).catch(ignoreNotfound);
}
function readdir(dir) {
  return promises.readdir(dir, { withFileTypes: true }).catch(ignoreNotfound).then((r) => r || []);
}
async function ensuredir(dir) {
  if (existsSync(dir)) {
    return;
  }
  await ensuredir(dirname$1(dir)).catch(ignoreExists);
  await promises.mkdir(dir).catch(ignoreExists);
}
async function readdirRecursive(dir, ignore, maxDepth) {
  if (ignore && ignore(dir)) {
    return [];
  }
  const entries = await readdir(dir);
  const files = [];
  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        if (maxDepth === void 0 || maxDepth > 0) {
          const dirFiles = await readdirRecursive(
            entryPath,
            ignore,
            maxDepth === void 0 ? void 0 : maxDepth - 1
          );
          files.push(...dirFiles.map((f) => entry.name + "/" + f));
        }
      } else {
        if (!(ignore && ignore(entry.name))) {
          files.push(entry.name);
        }
      }
    })
  );
  return files;
}
async function rmRecursive(dir) {
  const entries = await readdir(dir);
  await Promise.all(
    entries.map((entry) => {
      const entryPath = resolve$1(dir, entry.name);
      if (entry.isDirectory()) {
        return rmRecursive(entryPath).then(() => promises.rmdir(entryPath));
      } else {
        return promises.unlink(entryPath);
      }
    })
  );
}

const PATH_TRAVERSE_RE = /\.\.:|\.\.$/;
const DRIVER_NAME = "fs-lite";
const unstorage_47drivers_47fs_45lite = defineDriver((opts = {}) => {
  if (!opts.base) {
    throw createRequiredError(DRIVER_NAME, "base");
  }
  opts.base = resolve$1(opts.base);
  const r = (key) => {
    if (PATH_TRAVERSE_RE.test(key)) {
      throw createError(
        DRIVER_NAME,
        `Invalid key: ${JSON.stringify(key)}. It should not contain .. segments`
      );
    }
    const resolved = join(opts.base, key.replace(/:/g, "/"));
    return resolved;
  };
  return {
    name: DRIVER_NAME,
    options: opts,
    flags: {
      maxDepth: true
    },
    hasItem(key) {
      return existsSync(r(key));
    },
    getItem(key) {
      return readFile(r(key), "utf8");
    },
    getItemRaw(key) {
      return readFile(r(key));
    },
    async getMeta(key) {
      const { atime, mtime, size, birthtime, ctime } = await promises.stat(r(key)).catch(() => ({}));
      return { atime, mtime, size, birthtime, ctime };
    },
    setItem(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value, "utf8");
    },
    setItemRaw(key, value) {
      if (opts.readOnly) {
        return;
      }
      return writeFile(r(key), value);
    },
    removeItem(key) {
      if (opts.readOnly) {
        return;
      }
      return unlink(r(key));
    },
    getKeys(_base, topts) {
      return readdirRecursive(r("."), opts.ignore, topts?.maxDepth);
    },
    async clear() {
      if (opts.readOnly || opts.noClear) {
        return;
      }
      await rmRecursive(r("."));
    }
  };
});

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('data', unstorage_47drivers_47fs_45lite({"driver":"fsLite","base":"./.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

function serialize$1(o){return typeof o=="string"?`'${o}'`:new c().serialize(o)}const c=/*@__PURE__*/function(){class o{#t=new Map;compare(t,r){const e=typeof t,n=typeof r;return e==="string"&&n==="string"?t.localeCompare(r):e==="number"&&n==="number"?t-r:String.prototype.localeCompare.call(this.serialize(t,true),this.serialize(r,true))}serialize(t,r){if(t===null)return "null";switch(typeof t){case "string":return r?t:`'${t}'`;case "bigint":return `${t}n`;case "object":return this.$object(t);case "function":return this.$function(t)}return String(t)}serializeObject(t){const r=Object.prototype.toString.call(t);if(r!=="[object Object]")return this.serializeBuiltInType(r.length<10?`unknown:${r}`:r.slice(8,-1),t);const e=t.constructor,n=e===Object||e===void 0?"":e.name;if(n!==""&&globalThis[n]===e)return this.serializeBuiltInType(n,t);if(typeof t.toJSON=="function"){const i=t.toJSON();return n+(i!==null&&typeof i=="object"?this.$object(i):`(${this.serialize(i)})`)}return this.serializeObjectEntries(n,Object.entries(t))}serializeBuiltInType(t,r){const e=this["$"+t];if(e)return e.call(this,r);if(typeof r?.entries=="function")return this.serializeObjectEntries(t,r.entries());throw new Error(`Cannot serialize ${t}`)}serializeObjectEntries(t,r){const e=Array.from(r).sort((i,a)=>this.compare(i[0],a[0]));let n=`${t}{`;for(let i=0;i<e.length;i++){const[a,l]=e[i];n+=`${this.serialize(a,true)}:${this.serialize(l)}`,i<e.length-1&&(n+=",");}return n+"}"}$object(t){let r=this.#t.get(t);return r===void 0&&(this.#t.set(t,`#${this.#t.size}`),r=this.serializeObject(t),this.#t.set(t,r)),r}$function(t){const r=Function.prototype.toString.call(t);return r.slice(-15)==="[native code] }"?`${t.name||""}()[native]`:`${t.name}(${t.length})${r.replace(/\s*\n\s*/g,"")}`}$Array(t){let r="[";for(let e=0;e<t.length;e++)r+=this.serialize(t[e]),e<t.length-1&&(r+=",");return r+"]"}$Date(t){try{return `Date(${t.toISOString()})`}catch{return "Date(null)"}}$ArrayBuffer(t){return `ArrayBuffer[${new Uint8Array(t).join(",")}]`}$Set(t){return `Set${this.$Array(Array.from(t).sort((r,e)=>this.compare(r,e)))}`}$Map(t){return this.serializeObjectEntries("Map",t.entries())}}for(const s of ["Error","RegExp","URL"])o.prototype["$"+s]=function(t){return `${s}(${t})`};for(const s of ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float32Array","Float64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join(",")}]`};for(const s of ["BigInt64Array","BigUint64Array"])o.prototype["$"+s]=function(t){return `${s}[${t.join("n,")}${t.length>0?"n":""}]`};return o}();

const e=globalThis.process?.getBuiltinModule?.("crypto")?.hash,r="sha256",s="base64url";function digest(t){if(e)return e(r,t,s);const o=createHash(r).update(t);return globalThis.process?.versions?.webcontainer?o.digest().toString(s):o.digest(s)}

function hash$1(input) {
  return digest(serialize$1(input));
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

function klona(x) {
	if (typeof x !== 'object') return x;

	var k, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		if (x.constructor !== Object && typeof x.constructor === 'function') {
			tmp = new x.constructor();
			for (k in x) {
				if (x.hasOwnProperty(k) && tmp[k] !== x[k]) {
					tmp[k] = klona(x[k]);
				}
			}
		} else {
			tmp = {}; // null
			for (k in x) {
				if (k === '__proto__') {
					Object.defineProperty(tmp, k, {
						value: klona(x[k]),
						configurable: true,
						enumerable: true,
						writable: true,
					});
				} else {
					tmp[k] = klona(x[k]);
				}
			}
		}
		return tmp;
	}

	if (str === '[object Array]') {
		k = x.length;
		for (tmp=Array(k); k--;) {
			tmp[k] = klona(x[k]);
		}
		return tmp;
	}

	if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
		return tmp;
	}

	if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
		return tmp;
	}

	if (str === '[object Date]') {
		return new Date(+x);
	}

	if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
		tmp.lastIndex = x.lastIndex;
		return tmp;
	}

	if (str === '[object DataView]') {
		return new x.constructor( klona(x.buffer) );
	}

	if (str === '[object ArrayBuffer]') {
		return x.slice(0);
	}

	// ArrayBuffer.isView(x)
	// ~> `new` bcuz `Buffer.slice` => ref
	if (str.slice(-6) === 'Array]') {
		return new x.constructor(x);
	}

	return x;
}

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

const NUMBER_CHAR_RE = /\d/;
const STR_SPLITTERS = ["-", "_", "/", "."];
function isUppercase(char = "") {
  if (NUMBER_CHAR_RE.test(char)) {
    return void 0;
  }
  return char !== char.toLowerCase();
}
function splitByCase(str, separators) {
  const splitters = STR_SPLITTERS;
  const parts = [];
  if (!str || typeof str !== "string") {
    return parts;
  }
  let buff = "";
  let previousUpper;
  let previousSplitter;
  for (const char of str) {
    const isSplitter = splitters.includes(char);
    if (isSplitter === true) {
      parts.push(buff);
      buff = "";
      previousUpper = void 0;
      continue;
    }
    const isUpper = isUppercase(char);
    if (previousSplitter === false) {
      if (previousUpper === false && isUpper === true) {
        parts.push(buff);
        buff = char;
        previousUpper = isUpper;
        continue;
      }
      if (previousUpper === true && isUpper === false && buff.length > 1) {
        const lastChar = buff.at(-1);
        parts.push(buff.slice(0, Math.max(0, buff.length - 1)));
        buff = lastChar + char;
        previousUpper = isUpper;
        continue;
      }
    }
    buff += char;
    previousUpper = isUpper;
    previousSplitter = isSplitter;
  }
  parts.push(buff);
  return parts;
}
function kebabCase(str, joiner) {
  return str ? (Array.isArray(str) ? str : splitByCase(str)).map((p) => p.toLowerCase()).join(joiner) : "";
}
function snakeCase(str) {
  return kebabCase(str || "", "_");
}

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
    "buildId": "6cd5ae68-061d-4da0-9c69-e568179ed051",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
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
      },
      "/_fonts/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
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
  createRouter$1({ routes: config.nitro.routeRules })
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
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
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
            throw createError$1({ statusCode: 400 });
          }
          targetPath = withoutBase(targetPath, strpBase);
        } else if (targetPath.startsWith("//")) {
          targetPath = targetPath.replace(/^\/+/, "/");
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery$1(event.path);
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
		const { template } = await import('./error-500.mjs');
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
	return send(event, html);
};

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  function defaultNitroErrorHandler(error, event) {
    const res = defaultHandler(error, event);
    setResponseHeaders(event, res.headers);
    setResponseStatus(event, res.status, res.statusText);
    return send(event, JSON.stringify(res.body, null, 2));
  }
);
function defaultHandler(error, event, opts) {
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
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    console.error(`[request error] ${tags} [${event.method}] ${url}
`, error);
  }
  const headers = {
    "content-type": "application/json",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'none'; frame-ancestors 'none';"
  };
  setResponseStatus(event, statusCode, statusMessage);
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = {
    error: true,
    url: url.href,
    statusCode,
    statusMessage,
    message: isSensitive ? "Server Error" : error.message,
    data: isSensitive ? void 0 : error.data
  };
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
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

const script = "\"use strict\";(()=>{const t=window,e=document.documentElement,c=[\"dark\",\"light\"],n=getStorageValue(\"localStorage\",\"nuxt-color-mode\")||\"system\";let i=n===\"system\"?u():n;const r=e.getAttribute(\"data-color-mode-forced\");r&&(i=r),l(i),t[\"__NUXT_COLOR_MODE__\"]={preference:n,value:i,getColorScheme:u,addColorScheme:l,removeColorScheme:d};function l(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.add(s):e.className+=\" \"+s,a&&e.setAttribute(\"data-\"+a,o)}function d(o){const s=\"\"+o+\"\",a=\"\";e.classList?e.classList.remove(s):e.className=e.className.replace(new RegExp(s,\"g\"),\"\"),a&&e.removeAttribute(\"data-\"+a)}function f(o){return t.matchMedia(\"(prefers-color-scheme\"+o+\")\")}function u(){if(t.matchMedia&&f(\"\").media!==\"not all\"){for(const o of c)if(f(\":\"+o).matches)return o}return\"light\"}})();function getStorageValue(t,e){switch(t){case\"localStorage\":return window.localStorage.getItem(e);case\"sessionStorage\":return window.sessionStorage.getItem(e);case\"cookie\":return getCookie(e);default:return null}}function getCookie(t){const c=(\"; \"+window.document.cookie).split(\"; \"+t+\"=\");if(c.length===2)return c.pop()?.split(\";\").shift()}";

const _N84HAdnMyN652jWmRXSupzfRrVzOnNizHsEcvgi84Y = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const plugins = [
  _N84HAdnMyN652jWmRXSupzfRrVzOnNizHsEcvgi84Y
];

const assets = {
  "/logos/kir.svg": {
    "type": "image/svg+xml",
    "etag": "\"11f-fkh94CsOEKWJwB7GxCq1u7oIYPU\"",
    "mtime": "2026-08-13T10:08:07.208Z",
    "size": 287,
    "path": "../public/logos/kir.svg"
  },
  "/logos/basket.svg": {
    "type": "image/svg+xml",
    "etag": "\"11d-d3Rnwbv/NaJgq126qKxqEZlTNHs\"",
    "mtime": "2026-08-13T10:08:07.148Z",
    "size": 285,
    "path": "../public/logos/basket.svg"
  },
  "/logos/english-club.svg": {
    "type": "image/svg+xml",
    "etag": "\"11e-kgTrS8XGPs+pUqNyhoRKE90XnrI\"",
    "mtime": "2026-08-13T10:08:07.267Z",
    "size": 286,
    "path": "../public/logos/english-club.svg"
  },
  "/logos/futsal.svg": {
    "type": "image/svg+xml",
    "etag": "\"11d-f1PgAsX5PeM/EZwZZFQlCqZ5joo\"",
    "mtime": "2026-08-13T10:08:07.248Z",
    "size": 285,
    "path": "../public/logos/futsal.svg"
  },
  "/logos/osis.svg": {
    "type": "image/svg+xml",
    "etag": "\"118-frWzfyWkzTLKTPnfxko6FBHvwo4\"",
    "mtime": "2026-08-13T10:49:55.480Z",
    "size": 280,
    "path": "../public/logos/osis.svg"
  },
  "/logos/pmr.svg": {
    "type": "image/svg+xml",
    "etag": "\"11a-y9n5cknmnR/taWvHH21xfa0pfRU\"",
    "mtime": "2026-08-13T10:49:55.488Z",
    "size": 282,
    "path": "../public/logos/pmr.svg"
  },
  "/logos/paduan-suara.svg": {
    "type": "image/svg+xml",
    "etag": "\"11e-LGsOCuX/Py2IHiHfd0RqnEWxUCg\"",
    "mtime": "2026-08-13T10:08:07.166Z",
    "size": 286,
    "path": "../public/logos/paduan-suara.svg"
  },
  "/logos/paskibra.svg": {
    "type": "image/svg+xml",
    "etag": "\"119-oJ1pAnSbKXXF1Qh70ZR94grDxsc\"",
    "mtime": "2026-08-13T10:49:55.491Z",
    "size": 281,
    "path": "../public/logos/paskibra.svg"
  },
  "/logos/pramuka.svg": {
    "type": "image/svg+xml",
    "etag": "\"11d-cF2fF1VWHEj5/1cqpTNpvZ+38Ag\"",
    "mtime": "2026-08-13T10:08:07.194Z",
    "size": 285,
    "path": "../public/logos/pramuka.svg"
  },
  "/logos/robotik.svg": {
    "type": "image/svg+xml",
    "etag": "\"11d-7Pg/r4yGJypZ398yaW8PsmnOQBY\"",
    "mtime": "2026-08-13T10:08:07.176Z",
    "size": 285,
    "path": "../public/logos/robotik.svg"
  },
  "/logos/school.svg": {
    "type": "image/svg+xml",
    "etag": "\"11f-uhHZSfz6EeEpba4DPOrL0IbHiqQ\"",
    "mtime": "2026-08-13T10:08:29.001Z",
    "size": 287,
    "path": "../public/logos/school.svg"
  },
  "/logos/satgas.svg": {
    "type": "image/svg+xml",
    "etag": "\"119-6uRT1E8vIbOd8p5eC8k1FehkzF8\"",
    "mtime": "2026-08-13T10:49:55.494Z",
    "size": 281,
    "path": "../public/logos/satgas.svg"
  },
  "/logos/seni-tari.svg": {
    "type": "image/svg+xml",
    "etag": "\"11e-UK08QD6TV8g+C3IthT+Lz6ZCgDI\"",
    "mtime": "2026-08-13T10:08:07.232Z",
    "size": 286,
    "path": "../public/logos/seni-tari.svg"
  },
  "/uploads/b16054e3-f3fc-4dac-aae1-1ba30ad8943e.png": {
    "type": "image/png",
    "etag": "\"1d852-2HMvrcmGzIk5nyn3VZIDVK8dDJI\"",
    "mtime": "2026-08-14T07:33:10.461Z",
    "size": 120914,
    "path": "../public/uploads/b16054e3-f3fc-4dac-aae1-1ba30ad8943e.png"
  },
  "/uploads/ee4735b9-5b45-4486-984c-493aa901d38e.png": {
    "type": "image/png",
    "etag": "\"1cc22-tERqRMk+2KWLYA/rUq/1ftIXdLk\"",
    "mtime": "2026-08-14T07:04:23.197Z",
    "size": 117794,
    "path": "../public/uploads/ee4735b9-5b45-4486-984c-493aa901d38e.png"
  },
  "/uploads/c822a798-2c01-4b69-8d9d-5f56479cdbe6.png": {
    "type": "image/png",
    "etag": "\"9802-/yQLpqs65JQieZODS0Nz/zdf0bM\"",
    "mtime": "2026-08-14T06:55:14.238Z",
    "size": 38914,
    "path": "../public/uploads/c822a798-2c01-4b69-8d9d-5f56479cdbe6.png"
  },
  "/uploads/a8d35fcf-c18a-4b16-bbe1-3418c3f555bf.png": {
    "type": "image/png",
    "etag": "\"1d1e9-Q0svVgoHGcvYrEsggf4lGZzZyMs\"",
    "mtime": "2026-08-14T07:04:27.724Z",
    "size": 119273,
    "path": "../public/uploads/a8d35fcf-c18a-4b16-bbe1-3418c3f555bf.png"
  },
  "/_nuxt/6EDte9wT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1659-kRVEmnZ7eiwzWL4SMjcyBmoftVc\"",
    "mtime": "2026-08-14T07:47:32.350Z",
    "size": 5721,
    "path": "../public/_nuxt/6EDte9wT.js"
  },
  "/_nuxt/-74DCfKS2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ff-EU0+x3TQL9WHrltJ2FoPmrO2OfM\"",
    "mtime": "2026-08-14T07:47:32.350Z",
    "size": 255,
    "path": "../public/_nuxt/-74DCfKS2.js"
  },
  "/_nuxt/773qa3Dm.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14a3-975eX/8PbHfeKHOlKMhYQ5sAwQs\"",
    "mtime": "2026-08-14T07:47:32.351Z",
    "size": 5283,
    "path": "../public/_nuxt/773qa3Dm.js"
  },
  "/_nuxt/4Jkv870G.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12ef-7yKgfARRqMi1duix+Oj3RLQMqzs\"",
    "mtime": "2026-08-14T07:47:32.350Z",
    "size": 4847,
    "path": "../public/_nuxt/4Jkv870G.js"
  },
  "/_nuxt/achievements.BRUI0xa8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"12b9-5L1EYc7eepHsbVT9vQnmhafVwyc\"",
    "mtime": "2026-08-14T07:47:32.375Z",
    "size": 4793,
    "path": "../public/_nuxt/achievements.BRUI0xa8.css"
  },
  "/_nuxt/7dcCO3B_2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"207f-iUtl/weVdKmdXSWCXFzn5ADRcwQ\"",
    "mtime": "2026-08-14T07:47:32.351Z",
    "size": 8319,
    "path": "../public/_nuxt/7dcCO3B_2.js"
  },
  "/_nuxt/9quxm45h2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"249f-sb5PoIEqXg8GL93BxQS5ORhmXA8\"",
    "mtime": "2026-08-14T07:47:32.355Z",
    "size": 9375,
    "path": "../public/_nuxt/9quxm45h2.js"
  },
  "/_nuxt/admin.4XGuMJZA.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e37-9ASfsPCvNvW/f9gaeB6cafonijw\"",
    "mtime": "2026-08-14T07:47:32.375Z",
    "size": 3639,
    "path": "../public/_nuxt/admin.4XGuMJZA.css"
  },
  "/_nuxt/achievements.U7JiQ4N9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"17b6-0Yz5Tvpm564AANJ0rTB6+0YlW0U\"",
    "mtime": "2026-08-14T07:47:32.375Z",
    "size": 6070,
    "path": "../public/_nuxt/achievements.U7JiQ4N9.css"
  },
  "/_nuxt/ArticleViewer.BzpQCwxW.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"d4b-Jy8GSdqxwvvs+xZ1cYrPi8x4ozQ\"",
    "mtime": "2026-08-14T07:47:32.373Z",
    "size": 3403,
    "path": "../public/_nuxt/ArticleViewer.BzpQCwxW.css"
  },
  "/_nuxt/attendance.DxCckjrF.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"114b-z4GFuDoq0I3J8cu1WtK/6B4hO/o\"",
    "mtime": "2026-08-14T07:47:32.377Z",
    "size": 4427,
    "path": "../public/_nuxt/attendance.DxCckjrF.css"
  },
  "/_nuxt/attendance.Cph96Yw2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"11ee-i0B8OsWBghxDVbhH7xYUwIm8dIo\"",
    "mtime": "2026-08-14T07:47:32.375Z",
    "size": 4590,
    "path": "../public/_nuxt/attendance.Cph96Yw2.css"
  },
  "/_nuxt/AV0IG8mC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14f0-W9VAZMSXpZHTf1FVZF+STMUzIcw\"",
    "mtime": "2026-08-14T07:47:32.355Z",
    "size": 5360,
    "path": "../public/_nuxt/AV0IG8mC.js"
  },
  "/_nuxt/8DAADVlY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"777b-qguh52asGtT3w/SJqaIkAsIZE3A\"",
    "mtime": "2026-08-14T07:47:32.355Z",
    "size": 30587,
    "path": "../public/_nuxt/8DAADVlY.js"
  },
  "/_nuxt/attendance.CvJdC4f-.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1653-0D6PHdseiyJPMkfyNyB0MuZ5M1A\"",
    "mtime": "2026-08-14T07:47:32.375Z",
    "size": 5715,
    "path": "../public/_nuxt/attendance.CvJdC4f-.css"
  },
  "/_nuxt/B6vIv1BQ2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8b5-F5XIoQcoTCTLpwTPrpln7mBpVMk\"",
    "mtime": "2026-08-14T07:47:32.356Z",
    "size": 2229,
    "path": "../public/_nuxt/B6vIv1BQ2.js"
  },
  "/_nuxt/AjsDVSOK2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18d7-Ie/1zSV2aQSpd2aAVQj3WdR8cR8\"",
    "mtime": "2026-08-14T07:47:32.356Z",
    "size": 6359,
    "path": "../public/_nuxt/AjsDVSOK2.js"
  },
  "/_nuxt/B3ngatZ_2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1838-d6aEkZStGHr3+/04XtvuUzjWwI0\"",
    "mtime": "2026-08-14T07:47:32.356Z",
    "size": 6200,
    "path": "../public/_nuxt/B3ngatZ_2.js"
  },
  "/_nuxt/BBytOu6B.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"203-jIUcwDkyF7NVugXH6eVMD4c8j+k\"",
    "mtime": "2026-08-14T07:47:32.357Z",
    "size": 515,
    "path": "../public/_nuxt/BBytOu6B.js"
  },
  "/_nuxt/BCI2NwO1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b1-+hJCrJgkM7Sng5n3eHeH3j7XbrA\"",
    "mtime": "2026-08-14T07:47:32.357Z",
    "size": 177,
    "path": "../public/_nuxt/BCI2NwO1.js"
  },
  "/_nuxt/BDNMzG2s.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"54-MasMfSk/A98C3Gn9uIOxtFxkWNw\"",
    "mtime": "2026-08-14T07:47:32.357Z",
    "size": 84,
    "path": "../public/_nuxt/BDNMzG2s.js"
  },
  "/_nuxt/BIW32LaH2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8d4-InPnmbD0Lr538sbfnJXkYPuh3nw\"",
    "mtime": "2026-08-14T07:47:32.359Z",
    "size": 2260,
    "path": "../public/_nuxt/BIW32LaH2.js"
  },
  "/_nuxt/BJ4-5XN22.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1a4b-Db1PKCTmjyL9iA87p9iHxsQvZxE\"",
    "mtime": "2026-08-14T07:47:32.359Z",
    "size": 6731,
    "path": "../public/_nuxt/BJ4-5XN22.js"
  },
  "/_nuxt/BJNKIqMT2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b39-SAO5bD83DYxdoB2MHsTrVMxY/1g\"",
    "mtime": "2026-08-14T07:47:32.359Z",
    "size": 6969,
    "path": "../public/_nuxt/BJNKIqMT2.js"
  },
  "/_nuxt/blog.CM7hVgsf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"98b-KRQoRnwojWI2XL154e8ocVBU0Qw\"",
    "mtime": "2026-08-14T07:47:32.377Z",
    "size": 2443,
    "path": "../public/_nuxt/blog.CM7hVgsf.css"
  },
  "/_nuxt/BBELoKA7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1d71-9EBa/aMwPz5Q4fYZTiSRVonzV4M\"",
    "mtime": "2026-08-14T07:47:32.356Z",
    "size": 7537,
    "path": "../public/_nuxt/BBELoKA7.js"
  },
  "/_nuxt/B-eEVlq8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"39-zrGbxl+Urap/QCI1AdE2drtJUa8\"",
    "mtime": "2026-08-14T07:47:32.356Z",
    "size": 57,
    "path": "../public/_nuxt/B-eEVlq8.js"
  },
  "/_nuxt/blog.COFyGQYp.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"255f-+41mKmMnfjcT81XWtkBYbyzcBz8\"",
    "mtime": "2026-08-14T07:47:32.377Z",
    "size": 9567,
    "path": "../public/_nuxt/blog.COFyGQYp.css"
  },
  "/_nuxt/blog.DRTQBLhV.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2668-fUskFPX7l7rg7qMwbjVfeSOxIe8\"",
    "mtime": "2026-08-14T07:47:32.377Z",
    "size": 9832,
    "path": "../public/_nuxt/blog.DRTQBLhV.css"
  },
  "/_nuxt/BqHniWHy.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16ef-r/BAhZck6UyYARvQ7p825VPEXAc\"",
    "mtime": "2026-08-14T07:47:32.360Z",
    "size": 5871,
    "path": "../public/_nuxt/BqHniWHy.js"
  },
  "/_nuxt/BCvmwiR9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"219a-xf+YlDHEMDgyXYJCDFfy2RgrPZo\"",
    "mtime": "2026-08-14T07:47:32.357Z",
    "size": 8602,
    "path": "../public/_nuxt/BCvmwiR9.js"
  },
  "/_nuxt/BqRz65kD2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"10af-Dk+N9cHHpaHMrg2+B9pJqlWQgcs\"",
    "mtime": "2026-08-14T07:47:32.360Z",
    "size": 4271,
    "path": "../public/_nuxt/BqRz65kD2.js"
  },
  "/_nuxt/BI20CeoU.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ad4-qNCSEo6r4u0rFGwI2eaHWFIJQ0c\"",
    "mtime": "2026-08-14T07:47:32.359Z",
    "size": 2772,
    "path": "../public/_nuxt/BI20CeoU.js"
  },
  "/_nuxt/C1DjPLP4.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"516-4h/5NqYBQZiHcCHTqVxT6apnydQ\"",
    "mtime": "2026-08-14T07:47:32.360Z",
    "size": 1302,
    "path": "../public/_nuxt/C1DjPLP4.js"
  },
  "/_nuxt/BTQjoxTX2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bff-UmWI7yyE4WRNiJ+x6WHMLuzgBOY\"",
    "mtime": "2026-08-14T07:47:32.359Z",
    "size": 3071,
    "path": "../public/_nuxt/BTQjoxTX2.js"
  },
  "/_nuxt/calendar.Blfd0e3J.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"153f-V+6jSgSQJOrcEnoAIO2MlIO3po8\"",
    "mtime": "2026-08-14T07:47:32.377Z",
    "size": 5439,
    "path": "../public/_nuxt/calendar.Blfd0e3J.css"
  },
  "/_nuxt/CBvbM5Ep2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1f56-6kLySpekSpgTce1D8Nu7fcIiWxs\"",
    "mtime": "2026-08-14T07:47:32.361Z",
    "size": 8022,
    "path": "../public/_nuxt/CBvbM5Ep2.js"
  },
  "/_nuxt/CEIxk2lv.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"12f3-Oieu74gL5Hpn41f0Pn1tm87UsS8\"",
    "mtime": "2026-08-14T07:47:32.361Z",
    "size": 4851,
    "path": "../public/_nuxt/CEIxk2lv.js"
  },
  "/_nuxt/CfJHjZOh.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"b2a-98lCxWrAfr2CLHju0xsIz3DZsjE\"",
    "mtime": "2026-08-14T07:47:32.365Z",
    "size": 2858,
    "path": "../public/_nuxt/CfJHjZOh.js"
  },
  "/_nuxt/C8li5oOW2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f64-dg8Eb7MdKDkFdPvZiMqFDpKmqzo\"",
    "mtime": "2026-08-14T07:47:32.360Z",
    "size": 12132,
    "path": "../public/_nuxt/C8li5oOW2.js"
  },
  "/_nuxt/C1HOMYnn2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"47c4-fUyijSEQzobR+TZmh5mnzYZXpzI\"",
    "mtime": "2026-08-14T07:47:32.360Z",
    "size": 18372,
    "path": "../public/_nuxt/C1HOMYnn2.js"
  },
  "/_nuxt/CHFxs17y.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"145d-Pp1Mfq7/AVPnkbATlbdMvU8cJAM\"",
    "mtime": "2026-08-14T07:47:32.361Z",
    "size": 5213,
    "path": "../public/_nuxt/CHFxs17y.js"
  },
  "/_nuxt/Chky1qL7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b89-zeJsoSwnIs76vh1zK/ZhOedZhBM\"",
    "mtime": "2026-08-14T07:47:32.365Z",
    "size": 7049,
    "path": "../public/_nuxt/Chky1qL7.js"
  },
  "/_nuxt/CINZec6Q.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1c7d-UlFsdooQp5xCqfbC35D99U95JVs\"",
    "mtime": "2026-08-14T07:47:32.362Z",
    "size": 7293,
    "path": "../public/_nuxt/CINZec6Q.js"
  },
  "/_nuxt/Cj3vicvg.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14d2-N7CI9UVOtaQIlz2u7YIB89fPRoM\"",
    "mtime": "2026-08-14T07:47:32.366Z",
    "size": 5330,
    "path": "../public/_nuxt/Cj3vicvg.js"
  },
  "/_nuxt/CKAathod.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1be7-aMACrzNhDGT8bbFvKnRYd1NAIMg\"",
    "mtime": "2026-08-14T07:47:32.362Z",
    "size": 7143,
    "path": "../public/_nuxt/CKAathod.js"
  },
  "/_nuxt/CL1jDgRK.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d70-W73U11JVpYYB7QqUbUsvc/n3ozo\"",
    "mtime": "2026-08-14T07:47:32.362Z",
    "size": 3440,
    "path": "../public/_nuxt/CL1jDgRK.js"
  },
  "/_nuxt/CgDXVGKp.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1f7d-/kqEmPjUfPhc873VEimpjuKBxXc\"",
    "mtime": "2026-08-14T07:47:32.365Z",
    "size": 8061,
    "path": "../public/_nuxt/CgDXVGKp.js"
  },
  "/_nuxt/BSW8S0Un.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"11641-Hlzu7S1tILd7v3UY1oi5A6piEmA\"",
    "mtime": "2026-08-14T07:47:32.350Z",
    "size": 71233,
    "path": "../public/_nuxt/BSW8S0Un.js"
  },
  "/_nuxt/CNs_Ozdc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b-1MHUJYdBtOvbvPMaiQxDXp3lHyw\"",
    "mtime": "2026-08-14T07:47:32.363Z",
    "size": 27,
    "path": "../public/_nuxt/CNs_Ozdc.js"
  },
  "/_nuxt/CLyNwxTc.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"18bc-ECPTyVOLfe3KzuF9Ia6svF7OiIE\"",
    "mtime": "2026-08-14T07:47:32.362Z",
    "size": 6332,
    "path": "../public/_nuxt/CLyNwxTc.js"
  },
  "/_nuxt/CQmVouZ9.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1921-LDp4aWz1ZL9wLGW5a4nz7ZLhMCs\"",
    "mtime": "2026-08-14T07:47:32.364Z",
    "size": 6433,
    "path": "../public/_nuxt/CQmVouZ9.js"
  },
  "/_nuxt/CHjKGwHQ.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ae64-vxSX8BcBIjnjAGOvdTcRQXbuxYE\"",
    "mtime": "2026-08-14T07:47:32.361Z",
    "size": 44644,
    "path": "../public/_nuxt/CHjKGwHQ.js"
  },
  "/_nuxt/CTIS4QjG.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7d5-dD7vYNTWF41ELf2tYrAfU6J+FDA\"",
    "mtime": "2026-08-14T07:47:32.365Z",
    "size": 2005,
    "path": "../public/_nuxt/CTIS4QjG.js"
  },
  "/_nuxt/Ct2-Lms1.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"a30-KmplYH9IauH0Vxru620dp5+Oeyk\"",
    "mtime": "2026-08-14T07:47:32.366Z",
    "size": 2608,
    "path": "../public/_nuxt/Ct2-Lms1.js"
  },
  "/_nuxt/CtWP_Y_s2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1b3c-1nXTJE/JsLKD7hs+GBmNNOFFU/A\"",
    "mtime": "2026-08-14T07:47:32.366Z",
    "size": 6972,
    "path": "../public/_nuxt/CtWP_Y_s2.js"
  },
  "/_nuxt/D-72p_IJ2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"131c-eTDxkMTZFMDEr5eNOGloTL49lG8\"",
    "mtime": "2026-08-14T07:47:32.367Z",
    "size": 4892,
    "path": "../public/_nuxt/D-72p_IJ2.js"
  },
  "/_nuxt/CPUIAzhF.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"5190-7yN0lUgwD2kCj1tKKHwb1hOSeRY\"",
    "mtime": "2026-08-14T07:47:32.364Z",
    "size": 20880,
    "path": "../public/_nuxt/CPUIAzhF.js"
  },
  "/_nuxt/D074PhSY.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"7f6-IOhmkUu968UQvi+aguxG+d9/TPw\"",
    "mtime": "2026-08-14T07:47:32.367Z",
    "size": 2038,
    "path": "../public/_nuxt/D074PhSY.js"
  },
  "/_nuxt/CvzL8jpv2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"30af-y8LkZF2ip4tFhqdj6xhfd6fHRis\"",
    "mtime": "2026-08-14T07:47:32.366Z",
    "size": 12463,
    "path": "../public/_nuxt/CvzL8jpv2.js"
  },
  "/_nuxt/CTl1N1-e.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"23be-GgqRXqrJcEyPgSPOMQdI6jG/DTY\"",
    "mtime": "2026-08-14T07:47:32.365Z",
    "size": 9150,
    "path": "../public/_nuxt/CTl1N1-e.js"
  },
  "/_nuxt/DhbNTGz02.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"16e7-NCQugt9qWXlqR3FyGi38thgrxto\"",
    "mtime": "2026-08-14T07:47:32.369Z",
    "size": 5863,
    "path": "../public/_nuxt/DhbNTGz02.js"
  },
  "/_nuxt/dashboard.DrTApiQo.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"2968-a0dBSI6+bmiM05gkbaPlKt0+k5k\"",
    "mtime": "2026-08-14T07:47:32.377Z",
    "size": 10600,
    "path": "../public/_nuxt/dashboard.DrTApiQo.css"
  },
  "/_nuxt/DdPsrRJ-.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bcd-2Sf7SH74NoxnW9qKDfPzV8elgtw\"",
    "mtime": "2026-08-14T07:47:32.369Z",
    "size": 3021,
    "path": "../public/_nuxt/DdPsrRJ-.js"
  },
  "/_nuxt/D1GIwz1V.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2305-Uo1SC82K90/BBAsULlHoUUwT2V4\"",
    "mtime": "2026-08-14T07:47:32.367Z",
    "size": 8965,
    "path": "../public/_nuxt/D1GIwz1V.js"
  },
  "/_nuxt/DITNNsfH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1492-bXk6lJoE7FUlKHvkWlMsjkRlyy4\"",
    "mtime": "2026-08-14T07:47:32.367Z",
    "size": 5266,
    "path": "../public/_nuxt/DITNNsfH.js"
  },
  "/_nuxt/DJHa6CA7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d13-FhK6g5MUPJ8bH0eVg+aEfh/vN/Y\"",
    "mtime": "2026-08-14T07:47:32.368Z",
    "size": 3347,
    "path": "../public/_nuxt/DJHa6CA7.js"
  },
  "/_nuxt/DO5cMXt52.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"118b-8RfnFHJQs7kv3HG2TaHiwej0KKo\"",
    "mtime": "2026-08-14T07:47:32.368Z",
    "size": 4491,
    "path": "../public/_nuxt/DO5cMXt52.js"
  },
  "/_nuxt/DOK3ofI8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"f6b-ZyOTpEidXMLtwFj7REWKKQn0Opc\"",
    "mtime": "2026-08-14T07:47:32.368Z",
    "size": 3947,
    "path": "../public/_nuxt/DOK3ofI8.js"
  },
  "/_nuxt/Dp7noPXH2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"353-npiCins6A6yCipbgmyqfiRulLQg\"",
    "mtime": "2026-08-14T07:47:32.370Z",
    "size": 851,
    "path": "../public/_nuxt/Dp7noPXH2.js"
  },
  "/_nuxt/DRakNBKX.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1964-gPIsmFO985VopurYe7O4LJMBpW4\"",
    "mtime": "2026-08-14T07:47:32.369Z",
    "size": 6500,
    "path": "../public/_nuxt/DRakNBKX.js"
  },
  "/_nuxt/DsjSlM9j2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ff-/3N5BEY9Lr96XiVWmDtciMJgh/E\"",
    "mtime": "2026-08-14T07:47:32.370Z",
    "size": 255,
    "path": "../public/_nuxt/DsjSlM9j2.js"
  },
  "/_nuxt/DT_Kx_79.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ff-EU0+x3TQL9WHrltJ2FoPmrO2OfM\"",
    "mtime": "2026-08-14T07:47:32.369Z",
    "size": 255,
    "path": "../public/_nuxt/DT_Kx_79.js"
  },
  "/_nuxt/DT_Kx_792.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ff-EU0+x3TQL9WHrltJ2FoPmrO2OfM\"",
    "mtime": "2026-08-14T07:47:32.369Z",
    "size": 255,
    "path": "../public/_nuxt/DT_Kx_792.js"
  },
  "/_nuxt/CrrG72yH.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"247c7-pC8Nf/GJ0LSnV1kG5fhBMZB09UU\"",
    "mtime": "2026-08-14T07:47:32.366Z",
    "size": 149447,
    "path": "../public/_nuxt/CrrG72yH.js"
  },
  "/_nuxt/DIjtV0KT.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"ecd-Xl9DoixKnCVCq0mDGcWqakpJIYE\"",
    "mtime": "2026-08-14T07:47:32.367Z",
    "size": 3789,
    "path": "../public/_nuxt/DIjtV0KT.js"
  },
  "/_nuxt/entry.DISyLKCV.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1dd8d-PMp96A5qfLe4WYp7VisZ6xfHtOc\"",
    "mtime": "2026-08-14T07:47:32.377Z",
    "size": 122253,
    "path": "../public/_nuxt/entry.DISyLKCV.css"
  },
  "/_nuxt/error-404.CCfUEEZs.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"97d-EWcLKhIe2XRMDNXyrObAfjKqoRU\"",
    "mtime": "2026-08-14T07:47:32.377Z",
    "size": 2429,
    "path": "../public/_nuxt/error-404.CCfUEEZs.css"
  },
  "/_nuxt/error-500.B-eksdDQ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"772-ScxLjvXb7j0fJF/E1eTjKfDVpM0\"",
    "mtime": "2026-08-14T07:47:32.377Z",
    "size": 1906,
    "path": "../public/_nuxt/error-500.B-eksdDQ.css"
  },
  "/_nuxt/extracurriculars.d-H8Myb-.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f3a-cWGPxmuapRB+YXHbl7kRJdc27fw\"",
    "mtime": "2026-08-14T07:47:32.377Z",
    "size": 3898,
    "path": "../public/_nuxt/extracurriculars.d-H8Myb-.css"
  },
  "/_nuxt/feed.Bl493JsU.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"14d6-YfDyxsE9FzuhB0ox/jlgtaCHA1M\"",
    "mtime": "2026-08-14T07:47:32.379Z",
    "size": 5334,
    "path": "../public/_nuxt/feed.Bl493JsU.css"
  },
  "/_nuxt/feed.CsgVt8mL.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"126b-2+2SztVb6176iiAu5qRsQbCbIfI\"",
    "mtime": "2026-08-14T07:47:32.379Z",
    "size": 4715,
    "path": "../public/_nuxt/feed.CsgVt8mL.css"
  },
  "/_nuxt/FeedShareSheet.QhNiunz2.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7eb-3GAytGuSaEMnE8rS4QEMk5jhWkA\"",
    "mtime": "2026-08-14T07:47:32.373Z",
    "size": 2027,
    "path": "../public/_nuxt/FeedShareSheet.QhNiunz2.css"
  },
  "/_nuxt/fz23-Sg6.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ad-SN2gAI5F2Nt9Wk6r2OZVwX6JMIE\"",
    "mtime": "2026-08-14T07:47:32.371Z",
    "size": 429,
    "path": "../public/_nuxt/fz23-Sg6.js"
  },
  "/_nuxt/gallery.BE7xwhKA.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1995-RTedLPviDcfQDb3IkLJ8fqZlcLg\"",
    "mtime": "2026-08-14T07:47:32.379Z",
    "size": 6549,
    "path": "../public/_nuxt/gallery.BE7xwhKA.css"
  },
  "/_nuxt/DQVNFcaG2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"8e2-Eua6AtiacW3/nFUMiHghqnPBS3c\"",
    "mtime": "2026-08-14T07:47:32.368Z",
    "size": 2274,
    "path": "../public/_nuxt/DQVNFcaG2.js"
  },
  "/_nuxt/gallery.BLAK2a9h.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8e9-vWA0+4Adp1dHksB+WtkjuWFEvmc\"",
    "mtime": "2026-08-14T07:47:32.379Z",
    "size": 2281,
    "path": "../public/_nuxt/gallery.BLAK2a9h.css"
  },
  "/_nuxt/gallery.C3mFAtsQ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8e9-G5Kqb8VUQs6RtKuVvDpxMpCl+Dc\"",
    "mtime": "2026-08-14T07:47:32.379Z",
    "size": 2281,
    "path": "../public/_nuxt/gallery.C3mFAtsQ.css"
  },
  "/_nuxt/hr9vHZri.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"961-TFjXcHW940Z9IQtrtKiBnnw1VW0\"",
    "mtime": "2026-08-14T07:47:32.371Z",
    "size": 2401,
    "path": "../public/_nuxt/hr9vHZri.js"
  },
  "/_nuxt/imAPX0Z7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1ddc-/kEfr4aFBZV7C9WO39JMOfXcMGQ\"",
    "mtime": "2026-08-14T07:47:32.373Z",
    "size": 7644,
    "path": "../public/_nuxt/imAPX0Z7.js"
  },
  "/_nuxt/IzinManager.CdKkEMhp.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1a58-ikfnBCPx8378cSwJfG8pLz44nVw\"",
    "mtime": "2026-08-14T07:47:32.373Z",
    "size": 6744,
    "path": "../public/_nuxt/IzinManager.CdKkEMhp.css"
  },
  "/_nuxt/k3ZIAfLP.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1883-+YC02+vEx2LWPn0girEk3htwJIU\"",
    "mtime": "2026-08-14T07:47:32.373Z",
    "size": 6275,
    "path": "../public/_nuxt/k3ZIAfLP.js"
  },
  "/_nuxt/leaflet.DCrRFQdY.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"39d5-+FDP1Vrzvykm6nG3Mez+ITE3PuQ\"",
    "mtime": "2026-08-14T07:47:32.379Z",
    "size": 14805,
    "path": "../public/_nuxt/leaflet.DCrRFQdY.css"
  },
  "/_nuxt/login.B137b_rK.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d71-JUXVQ9B+CVA8ShCwT3uiioLwplQ\"",
    "mtime": "2026-08-14T07:47:32.379Z",
    "size": 7537,
    "path": "../public/_nuxt/login.B137b_rK.css"
  },
  "/_nuxt/logo.CekC7HSf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"525-2N//eX+WSvYNtqmz8OD2JBi0Y7w\"",
    "mtime": "2026-08-14T07:47:32.379Z",
    "size": 1317,
    "path": "../public/_nuxt/logo.CekC7HSf.css"
  },
  "/_nuxt/LogoUploader.DVz42Jx9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e5c-bRUCIj19SL51X/TAzM5tKWiQCZ0\"",
    "mtime": "2026-08-14T07:47:32.375Z",
    "size": 3676,
    "path": "../public/_nuxt/LogoUploader.DVz42Jx9.css"
  },
  "/_nuxt/Lvf47f_A.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1bb7-7lVNNbQ0T7AflpOpaLKDes/8Glo\"",
    "mtime": "2026-08-14T07:47:32.370Z",
    "size": 7095,
    "path": "../public/_nuxt/Lvf47f_A.js"
  },
  "/_nuxt/M9MJZrk8.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1729-UeI1o0pjoUaGKQGnLlpPKI3gt3Q\"",
    "mtime": "2026-08-14T07:47:32.370Z",
    "size": 5929,
    "path": "../public/_nuxt/M9MJZrk8.js"
  },
  "/_nuxt/materials.o_H9vuA1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"179a-1DNFaljlmc9IQE1urj+BPJQXfvU\"",
    "mtime": "2026-08-14T07:47:32.379Z",
    "size": 6042,
    "path": "../public/_nuxt/materials.o_H9vuA1.css"
  },
  "/_nuxt/materials.BkUfvzw1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b5b-qBbVejH+UUQ1BpVppGfRvPdMx7Q\"",
    "mtime": "2026-08-14T07:47:32.379Z",
    "size": 2907,
    "path": "../public/_nuxt/materials.BkUfvzw1.css"
  },
  "/_nuxt/members.BJzwj4N-.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9da-xn+UuIJni13YostwlzHHUHDQDQg\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 2522,
    "path": "../public/_nuxt/members.BJzwj4N-.css"
  },
  "/_nuxt/members.COy5gZIB.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e64-rVWJRjQnWdbAg8gJwP2R7WIQ5iY\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 3684,
    "path": "../public/_nuxt/members.COy5gZIB.css"
  },
  "/_nuxt/news.BSjQwrc0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"8e9-1GA+hpkKdd6KmrQU1vJNPOjceg0\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 2281,
    "path": "../public/_nuxt/news.BSjQwrc0.css"
  },
  "/_nuxt/news.L0FKlLFB.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"dee-LPmldC20qLtgRRIqg8MB/yLRI9s\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 3566,
    "path": "../public/_nuxt/news.L0FKlLFB.css"
  },
  "/_nuxt/DWqYhaBB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"23ad-udfwEi5QRRhWN491BfmQ+uJovNE\"",
    "mtime": "2026-08-14T07:47:32.369Z",
    "size": 9133,
    "path": "../public/_nuxt/DWqYhaBB.js"
  },
  "/_nuxt/operator.kEZnt0y8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"eda-OJ5grMRoENQ4rMSIov6MbfFaswk\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 3802,
    "path": "../public/_nuxt/operator.kEZnt0y8.css"
  },
  "/_nuxt/pages.BsBmwbFv.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"403-cL/fZUhYipy46l2INyIsFSCQ/A4\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 1027,
    "path": "../public/_nuxt/pages.BsBmwbFv.css"
  },
  "/_nuxt/polls.BhP1CABM.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1276-Bkg34jxJDfK9bwF0Drhc26IEABA\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 4726,
    "path": "../public/_nuxt/polls.BhP1CABM.css"
  },
  "/_nuxt/ONxlPUm52.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1be5-auxCpa1SoNT81Zsp2o5bOcCow3o\"",
    "mtime": "2026-08-14T07:47:32.370Z",
    "size": 7141,
    "path": "../public/_nuxt/ONxlPUm52.js"
  },
  "/_nuxt/polls.Dd9ptUR_.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1849-sixJZbimotEQbJQCKJWfp9NOeuw\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 6217,
    "path": "../public/_nuxt/polls.Dd9ptUR_.css"
  },
  "/_nuxt/profile.Bs_zSQfT.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"c57-8QQuyiiNnOC9qd6A/A8x4KMtn+A\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 3159,
    "path": "../public/_nuxt/profile.Bs_zSQfT.css"
  },
  "/_nuxt/register.Rqiqxs97.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"3033-vV9RueRVaEigAKtzjw2NvgTq848\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 12339,
    "path": "../public/_nuxt/register.Rqiqxs97.css"
  },
  "/_nuxt/polls.BOgyusWQ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9e9-ivPTAN13r+3YvR3CMmkuz+6wJJc\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 2537,
    "path": "../public/_nuxt/polls.BOgyusWQ.css"
  },
  "/_nuxt/schedule.BBDyE1oK.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9b9-vkO4+KVpbzBtKM2/bDwrvMe4fHo\"",
    "mtime": "2026-08-14T07:47:32.383Z",
    "size": 2489,
    "path": "../public/_nuxt/schedule.BBDyE1oK.css"
  },
  "/_nuxt/reports.C3UgAQ2N.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1d29-gFap5rt+IHU5jS/cqkMXkwC3quo\"",
    "mtime": "2026-08-14T07:47:32.381Z",
    "size": 7465,
    "path": "../public/_nuxt/reports.C3UgAQ2N.css"
  },
  "/_nuxt/Rwt3v1ep.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"42-MUK6+bHeQdtoWGjzqLQRk0cRBw4\"",
    "mtime": "2026-08-14T07:47:32.371Z",
    "size": 66,
    "path": "../public/_nuxt/Rwt3v1ep.js"
  },
  "/_nuxt/schedule.BE4J1xH8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"fec-4ALFD5lXRRh947Av1cCKbqfYmE4\"",
    "mtime": "2026-08-14T07:47:32.383Z",
    "size": 4076,
    "path": "../public/_nuxt/schedule.BE4J1xH8.css"
  },
  "/_nuxt/schedule.BhBgAE_x.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"9d4-2zH+1jYxj/HjC6sPpN+RyF+QROA\"",
    "mtime": "2026-08-14T07:47:32.383Z",
    "size": 2516,
    "path": "../public/_nuxt/schedule.BhBgAE_x.css"
  },
  "/_nuxt/SchoolLocationPicker.qDAbY63z.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"d41-z3kCHPRKhSiLL1KgL8OWLKKurx0\"",
    "mtime": "2026-08-14T07:47:32.375Z",
    "size": 3393,
    "path": "../public/_nuxt/SchoolLocationPicker.qDAbY63z.css"
  },
  "/_nuxt/settings.wi7jb0dZ.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"b64-97RXjgB6QY+NzPEEsbGRu4Q28yY\"",
    "mtime": "2026-08-14T07:47:32.383Z",
    "size": 2916,
    "path": "../public/_nuxt/settings.wi7jb0dZ.css"
  },
  "/_nuxt/siswa.C6E1uGHV.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10ea-Xcqns+hqAkxjC8Gm55K32J1gLms\"",
    "mtime": "2026-08-14T07:47:32.383Z",
    "size": 4330,
    "path": "../public/_nuxt/siswa.C6E1uGHV.css"
  },
  "/_nuxt/students.xbPUDDHk.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f09-QbfkfSWFnOWHbUbZq3PbSpqyyss\"",
    "mtime": "2026-08-14T07:47:32.383Z",
    "size": 3849,
    "path": "../public/_nuxt/students.xbPUDDHk.css"
  },
  "/_nuxt/teachers.DCzCCBdA.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"cd7-KVZUN4IJpnTfgGNVcpDqopUsdhc\"",
    "mtime": "2026-08-14T07:47:32.383Z",
    "size": 3287,
    "path": "../public/_nuxt/teachers.DCzCCBdA.css"
  },
  "/_nuxt/theme-colors.B5mqOFK7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"6fa-oMrrf/GQIxaG9gxOPNpNzGhyNew\"",
    "mtime": "2026-08-14T07:47:32.383Z",
    "size": 1786,
    "path": "../public/_nuxt/theme-colors.B5mqOFK7.css"
  },
  "/_nuxt/UgqNtXhz.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1191-QhCn1puqBpaaPDvqhVWpo7/UzC0\"",
    "mtime": "2026-08-14T07:47:32.371Z",
    "size": 4497,
    "path": "../public/_nuxt/UgqNtXhz.js"
  },
  "/_nuxt/usePagination.DERsZvQs.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"566-ILa2PIkE9UjWA+iMgDhfaMSY/3s\"",
    "mtime": "2026-08-14T07:47:32.383Z",
    "size": 1382,
    "path": "../public/_nuxt/usePagination.DERsZvQs.css"
  },
  "/_nuxt/UU3s8_H7.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"d67-zKlF9rOm5zFTCrczxU45qA5oKvE\"",
    "mtime": "2026-08-14T07:47:32.371Z",
    "size": 3431,
    "path": "../public/_nuxt/UU3s8_H7.js"
  },
  "/_nuxt/users.CF1uCHUj.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"1c72-nc1CF9ks83esMpEaGyOPGwink04\"",
    "mtime": "2026-08-14T07:47:32.383Z",
    "size": 7282,
    "path": "../public/_nuxt/users.CF1uCHUj.css"
  },
  "/_nuxt/WCMPttm62.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"bdc-EhXZvEqtkU2hT6/xYYcmOUXs+Sc\"",
    "mtime": "2026-08-14T07:47:32.371Z",
    "size": 3036,
    "path": "../public/_nuxt/WCMPttm62.js"
  },
  "/_nuxt/Y6tU-cYB.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"105c-q7L7+7in+vsHWKWbfOOXLsvT1+M\"",
    "mtime": "2026-08-14T07:47:32.371Z",
    "size": 4188,
    "path": "../public/_nuxt/Y6tU-cYB.js"
  },
  "/_nuxt/DzFpSuAb.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"14ef3-eF9EBZG1BjpzYd/zrTCEa4b4+Cw\"",
    "mtime": "2026-08-14T07:47:32.370Z",
    "size": 85747,
    "path": "../public/_nuxt/DzFpSuAb.js"
  },
  "/_nuxt/_slug_.qliFzk5v.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"a71-ET0gvLWSgq4KbAIpqn4TCriLgU8\"",
    "mtime": "2026-08-14T07:47:32.375Z",
    "size": 2673,
    "path": "../public/_nuxt/_slug_.qliFzk5v.css"
  },
  "/images/achievements/juara.svg": {
    "type": "image/svg+xml",
    "etag": "\"300-4Z7nWmT1MxIx9BpGusyZPg1Wklc\"",
    "mtime": "2026-08-13T11:50:26.239Z",
    "size": 768,
    "path": "../public/images/achievements/juara.svg"
  },
  "/images/achievements/organisasi.svg": {
    "type": "image/svg+xml",
    "etag": "\"337-YCLYUNQ3fFbFM9wUVDs2BNiNI9I\"",
    "mtime": "2026-08-13T11:50:26.309Z",
    "size": 823,
    "path": "../public/images/achievements/organisasi.svg"
  },
  "/images/achievements/partisipasi.svg": {
    "type": "image/svg+xml",
    "etag": "\"312-aV24MSSjaehW6mKZ6YAgxe3JR5o\"",
    "mtime": "2026-08-13T11:50:26.302Z",
    "size": 786,
    "path": "../public/images/achievements/partisipasi.svg"
  },
  "/_nuxt/tW4CqYVd.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"1976-6Z28bdTeqj2dCPl7IhHsQSSsZy8\"",
    "mtime": "2026-08-14T07:47:32.373Z",
    "size": 6518,
    "path": "../public/_nuxt/tW4CqYVd.js"
  },
  "/images/achievements/sertifikat.svg": {
    "type": "image/svg+xml",
    "etag": "\"34f-lW/z5UZHefV6Om6MHZK/01NhluQ\"",
    "mtime": "2026-08-13T11:50:26.278Z",
    "size": 847,
    "path": "../public/images/achievements/sertifikat.svg"
  },
  "/_nuxt/builds/latest.json": {
    "type": "application/json",
    "etag": "\"47-LSVKrB9+3L3qsL1pk7159GW5Ztw\"",
    "mtime": "2026-08-14T07:47:32.525Z",
    "size": 71,
    "path": "../public/_nuxt/builds/latest.json"
  },
  "/_nuxt/builds/meta/6cd5ae68-061d-4da0-9c69-e568179ed051.json": {
    "type": "application/json",
    "etag": "\"58-hlO5YoEwi2Au0BNvQG2sU+MZdTA\"",
    "mtime": "2026-08-14T07:47:32.525Z",
    "size": 88,
    "path": "../public/_nuxt/builds/meta/6cd5ae68-061d-4da0-9c69-e568179ed051.json"
  },
  "/_nuxt/v42lvssw.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2e54-oxt/67cIv73wPKYZqt7t9qLctgI\"",
    "mtime": "2026-08-14T07:47:32.373Z",
    "size": 11860,
    "path": "../public/_nuxt/v42lvssw.js"
  },
  "/_nuxt/ZYqZupMC.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"3d8b-aXV65Qbv/CstXQC+LddZ8lRmDgo\"",
    "mtime": "2026-08-14T07:47:32.371Z",
    "size": 15755,
    "path": "../public/_nuxt/ZYqZupMC.js"
  },
  "/_nuxt/imom1zFP2.js": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"2f78a-yHs3Ta/rWQ/82DTfNEf+hSkpJKk\"",
    "mtime": "2026-08-14T07:47:32.373Z",
    "size": 194442,
    "path": "../public/_nuxt/imom1zFP2.js"
  }
};

const _DRIVE_LETTER_START_RE = /^[A-Za-z]:\//;
function normalizeWindowsPath(input = "") {
  if (!input) {
    return input;
  }
  return input.replace(/\\/g, "/").replace(_DRIVE_LETTER_START_RE, (r) => r.toUpperCase());
}
const _IS_ABSOLUTE_RE = /^[/\\](?![/\\])|^[/\\]{2}(?!\.)|^[A-Za-z]:[/\\]/;
const _DRIVE_LETTER_RE = /^[A-Za-z]:$/;
function cwd() {
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return process.cwd().replace(/\\/g, "/");
  }
  return "/";
}
const resolve = function(...arguments_) {
  arguments_ = arguments_.map((argument) => normalizeWindowsPath(argument));
  let resolvedPath = "";
  let resolvedAbsolute = false;
  for (let index = arguments_.length - 1; index >= -1 && !resolvedAbsolute; index--) {
    const path = index >= 0 ? arguments_[index] : cwd();
    if (!path || path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = isAbsolute(path);
  }
  resolvedPath = normalizeString(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute && !isAbsolute(resolvedPath)) {
    return `/${resolvedPath}`;
  }
  return resolvedPath.length > 0 ? resolvedPath : ".";
};
function normalizeString(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let char = null;
  for (let index = 0; index <= path.length; ++index) {
    if (index < path.length) {
      char = path[index];
    } else if (char === "/") {
      break;
    } else {
      char = "/";
    }
    if (char === "/") {
      if (lastSlash === index - 1 || dots === 1) ; else if (dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res[res.length - 1] !== "." || res[res.length - 2] !== ".") {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex === -1) {
              res = "";
              lastSegmentLength = 0;
            } else {
              res = res.slice(0, lastSlashIndex);
              lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
            }
            lastSlash = index;
            dots = 0;
            continue;
          } else if (res.length > 0) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = index;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          res += res.length > 0 ? "/.." : "..";
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += `/${path.slice(lastSlash + 1, index)}`;
        } else {
          res = path.slice(lastSlash + 1, index);
        }
        lastSegmentLength = index - lastSlash - 1;
      }
      lastSlash = index;
      dots = 0;
    } else if (char === "." && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
const isAbsolute = function(p) {
  return _IS_ABSOLUTE_RE.test(p);
};
const dirname = function(p) {
  const segments = normalizeWindowsPath(p).replace(/\/$/, "").split("/").slice(0, -1);
  if (segments.length === 1 && _DRIVE_LETTER_RE.test(segments[0])) {
    segments[0] += "/";
  }
  return segments.join("/") || (isAbsolute(p) ? "/" : ".");
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1},"/_fonts/":{"maxAge":31536000},"/_nuxt/":{"maxAge":31536000}};

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
      throw createError$1({ statusCode: 404 });
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

const publicRoutes = ["/api/auth/login", "/api/auth/register", "/api/auth/check-nis"];
const _mbJV0r = defineEventHandler(async (event) => {
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
    throw createError$1({ statusCode: 401, message: "Unauthorized" });
  }
  try {
    const payload = verifyToken(token);
    event.context.auth = payload;
    const role = payload.role;
    if (path.startsWith("/api/admin/") && role !== "admin" && role !== "super_admin") {
      throw createError$1({ statusCode: 403, message: "Anda tidak memiliki akses ke menu ini." });
    }
    if (path.startsWith("/api/operator/") && role !== "admin" && role !== "super_admin" && role !== "operator") {
      throw createError$1({ statusCode: 403, message: "Anda tidak memiliki akses ke menu ini." });
    }
  } catch (err) {
    if (err == null ? void 0 : err.statusCode) throw err;
    throw createError$1({ statusCode: 401, message: "Token tidak valid atau kadaluarsa" });
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

var _a;
const globalForPrisma = globalThis;
const prisma = (_a = globalForPrisma.prisma) != null ? _a : new PrismaClient();

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
    throw createError$1({ statusCode: 400, message: "Ekskul wajib diisi." });
  }
  if (scope.extracurricularId !== extracurricularId) {
    throw createError$1({
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

const collections = {
};

const DEFAULT_ENDPOINT = "https://api.iconify.design";
const _4hV7Jn = defineCachedEventHandler(async (event) => {
  const options = useAppConfig().icon;
  const collectionName = event.context.params?.collection?.replace(/\.json$/, "");
  const collection = collectionName && Object.hasOwn(collections, collectionName) ? await collections[collectionName]?.() : null;
  const apiEndPoint = options.iconifyApiEndpoint || DEFAULT_ENDPOINT;
  const icons = String(parseQuery(parsePath(event.path).search).icons || "").split(",");
  if (!collectionName) return createError$1({ status: 400, message: "No collection specified" });
  if (!icons.length) return createError$1({ status: 400, message: "No icons specified" });
  if (collection) {
    const data = getIcons(
      collection,
      icons
    );
    consola.debug(`[Icon] serving ${icons.map((i) => "`" + collectionName + ":" + i + "`").join(",")} from bundled collection`);
    return data;
  }
  if (options.fallbackToApi === true || options.fallbackToApi === "server-only") {
    const apiUrl = new URL(`./${collectionName}.json?icons=${icons.join(",")}`, apiEndPoint);
    consola.debug(`[Icon] fetching ${icons.map((i) => "`" + collectionName + ":" + i + "`").join(",")} from iconify api`);
    if (apiUrl.host !== new URL(apiEndPoint).host) {
      return createError$1({ status: 400, message: "Invalid icon request" });
    }
    try {
      const data = await $fetch(apiUrl.href);
      return data;
    } catch (e) {
      consola.error(e);
      if (e.status === 404)
        return createError$1({ status: 404 });
      else
        return createError$1({ status: 500, message: "Failed to fetch fallback icon" });
    }
  }
  return createError$1({ status: 404 });
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

const _SxA8c9 = defineEventHandler(() => {});

const _lazy_GkcuMu = () => import('../routes/api/admin/dashboard.get.mjs');
const _lazy_y0GAB_ = () => import('../routes/api/admin/extracurriculars.get.mjs');
const _lazy_OsM_rR = () => import('../routes/api/admin/extracurriculars.post.mjs');
const _lazy_kvSCWt = () => import('../routes/api/admin/extracurriculars/_id_.delete.mjs');
const _lazy_aAyNCK = () => import('../routes/api/admin/extracurriculars/_id_.put.mjs');
const _lazy_JJfYyk = () => import('../routes/api/admin/feed/_id_.delete.mjs');
const _lazy_5aFyY0 = () => import('../routes/api/admin/reports.get.mjs');
const _lazy_7A91OO = () => import('../routes/api/admin/reports/attendance-detail.get.mjs');
const _lazy_iH1kzF = () => import('../routes/api/admin/reports/export.get.mjs');
const _lazy_ovu8QA = () => import('../routes/api/admin/settings.get.mjs');
const _lazy_n1WhOZ = () => import('../routes/api/admin/settings.put.mjs');
const _lazy_jzVAYG = () => import('../routes/api/admin/students.get.mjs');
const _lazy_s1xaBd = () => import('../routes/api/admin/students.post.mjs');
const _lazy_OwHfBa = () => import('../routes/api/admin/students/_id_.delete.mjs');
const _lazy_2EPxiq = () => import('../routes/api/admin/students/_id_.put.mjs');
const _lazy__Rs5YT = () => import('../routes/api/admin/students/import.post.mjs');
const _lazy_4siC7g = () => import('../routes/api/admin/students/template.get.mjs');
const _lazy_LpAwns = () => import('../routes/api/admin/teachers.get.mjs');
const _lazy_7U2ULz = () => import('../routes/api/admin/teachers.post.mjs');
const _lazy_AftDDy = () => import('../routes/api/admin/teachers/_id_.delete.mjs');
const _lazy_5zrHJ3 = () => import('../routes/api/admin/teachers/_id_.put.mjs');
const _lazy_XCgy6l = () => import('../routes/api/admin/users.get.mjs');
const _lazy_XY2Ejg = () => import('../routes/api/admin/users.post.mjs');
const _lazy_B4CnjL = () => import('../routes/api/admin/users/_id_.delete.mjs');
const _lazy_I8VJbY = () => import('../routes/api/admin/users/_id_.put.mjs');
const _lazy_4zn2Uz = () => import('../routes/api/auth/check-nis.post.mjs');
const _lazy_j8kwxh = () => import('../routes/api/auth/login.post.mjs');
const _lazy_kEFERv = () => import('../routes/api/auth/me.get.mjs');
const _lazy_rxL8vS = () => import('../routes/api/auth/register.post.mjs');
const _lazy_FqtM53 = () => import('../routes/api/operator/articles.get.mjs');
const _lazy_p6w8kI = () => import('../routes/api/operator/articles.post.mjs');
const _lazy_PN7vBv = () => import('../routes/api/operator/articles/_id_.delete.mjs');
const _lazy_vnlgtU = () => import('../routes/api/operator/articles/_id_.put.mjs');
const _lazy_DQvr59 = () => import('../routes/api/operator/articles/_id/views.get.mjs');
const _lazy_DcZw45 = () => import('../routes/api/operator/attendance/generate-qr.post.mjs');
const _lazy_UqqbhW = () => import('../routes/api/operator/attendance/history.get.mjs');
const _lazy_XcwDHw = () => import('../routes/api/operator/attendance/session.post.mjs');
const _lazy_C5QEQW = () => import('../routes/api/operator/attendance/session/_id_.get.mjs');
const _lazy_5lM1M_ = () => import('../routes/api/operator/dashboard.get.mjs');
const _lazy_iQGBJx = () => import('../routes/api/operator/extracurricular/logo.put.mjs');
const _lazy_ygOWnu = () => import('../routes/api/operator/gallery.get.mjs');
const _lazy_DdELzG = () => import('../routes/api/operator/gallery.post.mjs');
const _lazy_OtkJPg = () => import('../routes/api/operator/gallery/_id_.delete.mjs');
const _lazy__fnPlA = () => import('../routes/api/operator/materials.get.mjs');
const _lazy_9hOIiM = () => import('../routes/api/operator/materials.post.mjs');
const _lazy_D0biVg = () => import('../routes/api/operator/materials/_id_.delete.mjs');
const _lazy_I8h5Na = () => import('../routes/api/operator/members.get.mjs');
const _lazy_rQo6pd = () => import('../routes/api/operator/members.post.mjs');
const _lazy_ua6SgX = () => import('../routes/api/operator/members/_id_.delete.mjs');
const _lazy_RU1jrV = () => import('../routes/api/operator/members/_id_.put.mjs');
const _lazy_E_LUAl = () => import('../routes/api/operator/news.get.mjs');
const _lazy_wT7MBW = () => import('../routes/api/operator/news.post.mjs');
const _lazy_1txv1l = () => import('../routes/api/operator/news/_id_.delete.mjs');
const _lazy_uhsyDR = () => import('../routes/api/operator/news/_id_.put.mjs');
const _lazy_UfEwEx = () => import('../routes/api/operator/polls.get.mjs');
const _lazy_0qJg_i = () => import('../routes/api/operator/polls.post.mjs');
const _lazy_NQ5aHN = () => import('../routes/api/operator/polls/_id_.delete.mjs');
const _lazy_vwfFVE = () => import('../routes/api/operator/polls/_id_.put.mjs');
const _lazy_7yvzT0 = () => import('../routes/api/operator/schedule.get.mjs');
const _lazy__DvnxQ = () => import('../routes/api/operator/schedule.post.mjs');
const _lazy_vkFzqu = () => import('../routes/api/operator/schedule/_id_.delete.mjs');
const _lazy_xGbPXj = () => import('../routes/api/operator/schedule/_id_.put.mjs');
const _lazy_AWY0Gn = () => import('../routes/api/operator/upload.post.mjs');
const _lazy_IO9ghD = () => import('../routes/api/settings.get.mjs');
const _lazy_VjL6VO = () => import('../routes/api/shared/reference.get.mjs');
const _lazy_CKZHDH = () => import('../routes/api/siswa/achievements.get.mjs');
const _lazy_GnrXyH = () => import('../routes/api/siswa/achievements.post.mjs');
const _lazy_I9jPW0 = () => import('../routes/api/siswa/achievements/_id_.delete.mjs');
const _lazy_ENZzGy = () => import('../routes/api/siswa/achievements/_id_.put.mjs');
const _lazy_IuCMal = () => import('../routes/api/siswa/articles.get.mjs');
const _lazy_Rn0lpZ = () => import('../routes/api/siswa/articles/_slug_.get.mjs');
const _lazy_sePDyQ = () => import('../routes/api/siswa/attendance.get.mjs');
const _lazy_jiE_aB = () => import('../routes/api/siswa/attendance/scan.post.mjs');
const _lazy_ttAlil = () => import('../routes/api/siswa/calendar.get.mjs');
const _lazy_fbtTvN = () => import('../routes/api/siswa/calendar.post.mjs');
const _lazy_vSpnGe = () => import('../routes/api/siswa/calendar/_id_.delete.mjs');
const _lazy_oeP0Xi = () => import('../routes/api/siswa/calendar/_id_.put.mjs');
const _lazy_S_mcUf = () => import('../routes/api/siswa/change-password.post.mjs');
const _lazy_v1txOS = () => import('../routes/api/siswa/dashboard.get.mjs');
const _lazy_xuCk19 = () => import('../routes/api/siswa/feed.get.mjs');
const _lazy_3SzLVy = () => import('../routes/api/siswa/feed/_id/comment.post.mjs');
const _lazy_TGPr3m = () => import('../routes/api/siswa/feed/_id/like.post.mjs');
const _lazy_8qEV2e = () => import('../routes/api/siswa/gallery.get.mjs');
const _lazy_Dd2rvL = () => import('../routes/api/siswa/izin.get.mjs');
const _lazy_b7pQcX = () => import('../routes/api/siswa/izin.post.mjs');
const _lazy_RQTy20 = () => import('../routes/api/siswa/izin/_id/surat.get.mjs');
const _lazy_Bzjwqv = () => import('../routes/api/siswa/materials.get.mjs');
const _lazy_L6mQ1u = () => import('../routes/api/siswa/notifications.get.mjs');
const _lazy_BFOj2G = () => import('../routes/api/siswa/notifications/read.post.mjs');
const _lazy_Nk47xD = () => import('../routes/api/siswa/polls.get.mjs');
const _lazy_X0qmU8 = () => import('../routes/api/siswa/polls/_id/vote.post.mjs');
const _lazy_ug1Qhx = () => import('../routes/api/siswa/profile.put.mjs');
const _lazy_gph_wx = () => import('../routes/api/siswa/schedule.get.mjs');
const _lazy_esJ8lC = () => import('../routes/api/upload.post.mjs').then(function (n) { return n.t; });
const _lazy_r8uiwg = () => import('../routes/api/translate.post.mjs');
const _lazy_7PybwW = () => import('../routes/api/upload.post.mjs').then(function (n) { return n.u; });
const _lazy_0hFHMS = () => import('../routes/renderer.mjs');

const handlers = [
  { route: '', handler: _QOndmb, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _mbJV0r, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/dashboard', handler: _lazy_GkcuMu, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/extracurriculars', handler: _lazy_y0GAB_, lazy: true, middleware: false, method: "get" },
  { route: '/api/admin/extracurriculars', handler: _lazy_OsM_rR, lazy: true, middleware: false, method: "post" },
  { route: '/api/admin/extracurriculars/:id', handler: _lazy_kvSCWt, lazy: true, middleware: false, method: "delete" },
  { route: '/api/admin/extracurriculars/:id', handler: _lazy_aAyNCK, lazy: true, middleware: false, method: "put" },
  { route: '/api/admin/feed/:id', handler: _lazy_JJfYyk, lazy: true, middleware: false, method: "delete" },
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
  { route: '/api/operator/attendance/session', handler: _lazy_XcwDHw, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/attendance/session/:id', handler: _lazy_C5QEQW, lazy: true, middleware: false, method: "get" },
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
  { route: '/api/operator/schedule', handler: _lazy_7yvzT0, lazy: true, middleware: false, method: "get" },
  { route: '/api/operator/schedule', handler: _lazy__DvnxQ, lazy: true, middleware: false, method: "post" },
  { route: '/api/operator/schedule/:id', handler: _lazy_vkFzqu, lazy: true, middleware: false, method: "delete" },
  { route: '/api/operator/schedule/:id', handler: _lazy_xGbPXj, lazy: true, middleware: false, method: "put" },
  { route: '/api/operator/upload', handler: _lazy_AWY0Gn, lazy: true, middleware: false, method: "post" },
  { route: '/api/settings', handler: _lazy_IO9ghD, lazy: true, middleware: false, method: "get" },
  { route: '/api/shared/reference', handler: _lazy_VjL6VO, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/achievements', handler: _lazy_CKZHDH, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/achievements', handler: _lazy_GnrXyH, lazy: true, middleware: false, method: "post" },
  { route: '/api/siswa/achievements/:id', handler: _lazy_I9jPW0, lazy: true, middleware: false, method: "delete" },
  { route: '/api/siswa/achievements/:id', handler: _lazy_ENZzGy, lazy: true, middleware: false, method: "put" },
  { route: '/api/siswa/articles', handler: _lazy_IuCMal, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/articles/:slug', handler: _lazy_Rn0lpZ, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/attendance', handler: _lazy_sePDyQ, lazy: true, middleware: false, method: "get" },
  { route: '/api/siswa/attendance/scan', handler: _lazy_jiE_aB, lazy: true, middleware: false, method: "post" },
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
  { route: '/api/siswa/materials', handler: _lazy_Bzjwqv, lazy: true, middleware: false, method: "get" },
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
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
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
    debug: destr(false),
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
      await nitroApp.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => b(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return C(
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
const nitroApp = createNitroApp();
function useNitroApp() {
  return nitroApp;
}
runNitroPlugins(nitroApp);

const debug = (...args) => {
};
function GracefulShutdown(server, opts) {
  opts = opts || {};
  const options = Object.assign(
    {
      signals: "SIGINT SIGTERM",
      timeout: 3e4,
      development: false,
      forceExit: true,
      onShutdown: (signal) => Promise.resolve(signal),
      preShutdown: (signal) => Promise.resolve(signal)
    },
    opts
  );
  let isShuttingDown = false;
  const connections = {};
  let connectionCounter = 0;
  const secureConnections = {};
  let secureConnectionCounter = 0;
  let failed = false;
  let finalRun = false;
  function onceFactory() {
    let called = false;
    return (emitter, events, callback) => {
      function call() {
        if (!called) {
          called = true;
          return Reflect.apply(callback, this, arguments);
        }
      }
      for (const e of events) {
        emitter.on(e, call);
      }
    };
  }
  const signals = options.signals.split(" ").map((s) => s.trim()).filter((s) => s.length > 0);
  const once = onceFactory();
  once(process, signals, (signal) => {
    debug("received shut down signal", signal);
    shutdown(signal).then(() => {
      if (options.forceExit) {
        process.exit(failed ? 1 : 0);
      }
    }).catch((error) => {
      debug("server shut down error occurred", error);
      process.exit(1);
    });
  });
  function isFunction(functionToCheck) {
    const getType = Object.prototype.toString.call(functionToCheck);
    return /^\[object\s([A-Za-z]+)?Function]$/.test(getType);
  }
  function destroy(socket, force = false) {
    if (socket._isIdle && isShuttingDown || force) {
      socket.destroy();
      if (socket.server instanceof http.Server) {
        delete connections[socket._connectionId];
      } else {
        delete secureConnections[socket._connectionId];
      }
    }
  }
  function destroyAllConnections(force = false) {
    debug("Destroy Connections : " + (force ? "forced close" : "close"));
    let counter = 0;
    let secureCounter = 0;
    for (const key of Object.keys(connections)) {
      const socket = connections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        counter++;
        destroy(socket);
      }
    }
    debug("Connections destroyed : " + counter);
    debug("Connection Counter    : " + connectionCounter);
    for (const key of Object.keys(secureConnections)) {
      const socket = secureConnections[key];
      const serverResponse = socket._httpMessage;
      if (serverResponse && !force) {
        if (!serverResponse.headersSent) {
          serverResponse.setHeader("connection", "close");
        }
      } else {
        secureCounter++;
        destroy(socket);
      }
    }
    debug("Secure Connections destroyed : " + secureCounter);
    debug("Secure Connection Counter    : " + secureConnectionCounter);
  }
  server.on("request", (req, res) => {
    req.socket._isIdle = false;
    if (isShuttingDown && !res.headersSent) {
      res.setHeader("connection", "close");
    }
    res.on("finish", () => {
      req.socket._isIdle = true;
      destroy(req.socket);
    });
  });
  server.on("connection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = connectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      connections[id] = socket;
      socket.once("close", () => {
        delete connections[socket._connectionId];
      });
    }
  });
  server.on("secureConnection", (socket) => {
    if (isShuttingDown) {
      socket.destroy();
    } else {
      const id = secureConnectionCounter++;
      socket._isIdle = true;
      socket._connectionId = id;
      secureConnections[id] = socket;
      socket.once("close", () => {
        delete secureConnections[socket._connectionId];
      });
    }
  });
  process.on("close", () => {
    debug("closed");
  });
  function shutdown(sig) {
    function cleanupHttp() {
      destroyAllConnections();
      debug("Close http server");
      return new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          return resolve(true);
        });
      });
    }
    debug("shutdown signal - " + sig);
    if (options.development) {
      debug("DEV-Mode - immediate forceful shutdown");
      return process.exit(0);
    }
    function finalHandler() {
      if (!finalRun) {
        finalRun = true;
        if (options.finally && isFunction(options.finally)) {
          debug("executing finally()");
          options.finally();
        }
      }
      return Promise.resolve();
    }
    function waitForReadyToShutDown(totalNumInterval) {
      debug(`waitForReadyToShutDown... ${totalNumInterval}`);
      if (totalNumInterval === 0) {
        debug(
          `Could not close connections in time (${options.timeout}ms), will forcefully shut down`
        );
        return Promise.resolve(true);
      }
      const allConnectionsClosed = Object.keys(connections).length === 0 && Object.keys(secureConnections).length === 0;
      if (allConnectionsClosed) {
        debug("All connections closed. Continue to shutting down");
        return Promise.resolve(false);
      }
      debug("Schedule the next waitForReadyToShutdown");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(waitForReadyToShutDown(totalNumInterval - 1));
        }, 250);
      });
    }
    if (isShuttingDown) {
      return Promise.resolve();
    }
    debug("shutting down");
    return options.preShutdown(sig).then(() => {
      isShuttingDown = true;
      cleanupHttp();
    }).then(() => {
      const pollIterations = options.timeout ? Math.round(options.timeout / 250) : 0;
      return waitForReadyToShutDown(pollIterations);
    }).then((force) => {
      debug("Do onShutdown now");
      if (force) {
        destroyAllConnections(force);
      }
      return options.onShutdown(sig);
    }).then(finalHandler).catch((error) => {
      const errString = typeof error === "string" ? error : JSON.stringify(error);
      debug(errString);
      failed = true;
      throw errString;
    });
  }
  function shutdownManual() {
    return shutdown("manual");
  }
  return shutdownManual;
}

function getGracefulShutdownConfig() {
  return {
    disabled: !!process.env.NITRO_SHUTDOWN_DISABLED,
    signals: (process.env.NITRO_SHUTDOWN_SIGNALS || "SIGTERM SIGINT").split(" ").map((s) => s.trim()),
    timeout: Number.parseInt(process.env.NITRO_SHUTDOWN_TIMEOUT || "", 10) || 3e4,
    forceExit: !process.env.NITRO_SHUTDOWN_NO_FORCE_EXIT
  };
}
function setupGracefulShutdown(listener, nitroApp) {
  const shutdownConfig = getGracefulShutdownConfig();
  if (shutdownConfig.disabled) {
    return;
  }
  GracefulShutdown(listener, {
    signals: shutdownConfig.signals.join(" "),
    timeout: shutdownConfig.timeout,
    forceExit: shutdownConfig.forceExit,
    onShutdown: async () => {
      await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.warn("Graceful shutdown timeout, force exiting...");
          resolve();
        }, shutdownConfig.timeout);
        nitroApp.hooks.callHook("close").catch((error) => {
          console.error(error);
        }).finally(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
    }
  });
}

export { buildAssetsURL as A, publicAssetsURL as B, defineRenderHandler as C, getRouteRules as D, joinURL as E, getResponseStatusText as F, getResponseStatus as G, trapUnhandledNodeErrors as a, useNitroApp as b, defineEventHandler as c, destr as d, createError$1 as e, getQuery as f, getRouterParam as g, reportBuilders as h, isReportType as i, attendanceRows as j, setHeader as k, generateToken as l, toInstitutionSummary as m, getOperatorScope as n, scopeFilter as o, prisma as p, assertScope as q, readBody as r, setupGracefulShutdown as s, toNodeListener as t, useRuntimeConfig as u, scopeRelationFilter as v, readMultipartFormData as w, formatSchoolTimeServer as x, syncNotifications as y, encodePath as z };
//# sourceMappingURL=nitro.mjs.map
