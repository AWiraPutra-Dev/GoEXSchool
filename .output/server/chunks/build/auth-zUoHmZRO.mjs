import { d as defineNuxtRouteMiddleware } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-aR38ESGJ.mjs';
import 'nostics';
import 'nostics/formatters/ansi';
import 'vue';
import '../_/nitro.mjs';
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
import 'vue-router';
import '@vue/shared';
import '@iconify/vue';
import 'pinia';
import 'vue/server-renderer';
import 'unhead/utils';

//#region app/middleware/auth.ts
var auth_default = defineNuxtRouteMiddleware(async (to) => {
	useAuthStore();
});

export { auth_default as default };
//# sourceMappingURL=auth-zUoHmZRO.mjs.map
