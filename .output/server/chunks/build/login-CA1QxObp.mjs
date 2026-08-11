import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default, N as NuxtLink } from '../virtual/entry.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import '@iconify/vue';
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
import '@iconify/utils/lib/css/icon';
import 'nostics';
import 'nostics/formatters/ansi';
import 'vue-router';
import '@vue/shared';
import 'pinia';
import 'unhead/utils';

//#region app/pages/login.vue?vue&type=script&setup=true&lang.ts
var login_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "login",
	__ssrInlineRender: true,
	setup(__props) {
		const role = ref("admin");
		const identifier = ref("");
		const password = ref("");
		const loading = ref(false);
		const errorMsg = ref("");
		const roleOptions = [
			{
				value: "admin",
				label: "Admin Sekolah",
				icon: "i-lucide-building-2",
				desc: "Kelola master data & pengaturan"
			},
			{
				value: "operator",
				label: "Operator Ekskul",
				icon: "i-lucide-shield",
				desc: "Kelola kegiatan & absensi"
			},
			{
				value: "student",
				label: "Siswa",
				icon: "i-lucide-graduation-cap",
				desc: "Akses jadwal & portofolio"
			}
		];
		const identifierPlaceholder = computed(() => {
			return role.value === "student" ? "Masukkan NIS" : "Masukkan username";
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "login-page" }, _attrs))} data-v-257294ca><div class="bg-decor" data-v-257294ca><div class="decor-circle decor-circle-1" data-v-257294ca></div><div class="decor-circle decor-circle-2" data-v-257294ca></div><div class="decor-circle decor-circle-3" data-v-257294ca></div></div><div class="login-container" data-v-257294ca><div class="brand-panel" data-v-257294ca><div class="brand-content" data-v-257294ca><div class="brand-logo" data-v-257294ca><div class="logo-icon" data-v-257294ca><span data-v-257294ca>E</span></div></div><h1 class="brand-title" data-v-257294ca>Eskul<span class="text-[var(--olive-light)]" data-v-257294ca>Hub</span></h1><p class="brand-subtitle" data-v-257294ca>Aplikasi Manajemen Ekstrakurikuler Sekolah</p><div class="brand-features" data-v-257294ca><div class="feature-item" data-v-257294ca><div class="feature-dot" data-v-257294ca></div><span data-v-257294ca>Manajemen pendaftaran ekskul</span></div><div class="feature-item" data-v-257294ca><div class="feature-dot" data-v-257294ca></div><span data-v-257294ca>Absensi digital dengan QR Code</span></div><div class="feature-item" data-v-257294ca><div class="feature-dot" data-v-257294ca></div><span data-v-257294ca>Portofolio prestasi siswa</span></div><div class="feature-item" data-v-257294ca><div class="feature-dot" data-v-257294ca></div><span data-v-257294ca>Multi-level akses terpadu</span></div></div><div class="brand-footer" data-v-257294ca><p class="brand-version" data-v-257294ca>v1.0.0 — Prototype</p><p class="brand-copyright" data-v-257294ca>© 2026 EskulHub</p></div></div></div><div class="form-panel" data-v-257294ca><div class="form-wrapper" data-v-257294ca><div class="form-header" data-v-257294ca><h2 class="form-title" data-v-257294ca>Selamat Datang</h2><p class="form-desc" data-v-257294ca>Pilih role untuk masuk ke dashboard</p></div><div class="role-cards" data-v-257294ca><!--[-->`);
			ssrRenderList(roleOptions, (opt) => {
				_push(`<button type="button" class="${ssrRenderClass([{ active: unref(role) === opt.value }, "role-card"])}" data-v-257294ca><div class="role-card-left" data-v-257294ca><div class="${ssrRenderClass([`role-icon-${opt.value}`, "role-icon"])}" data-v-257294ca>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: opt.icon,
					class: "w-5 h-5"
				}, null, _parent));
				_push(`</div><div class="role-text" data-v-257294ca><span class="role-label" data-v-257294ca>${ssrInterpolate(opt.label)}</span><span class="role-desc" data-v-257294ca>${ssrInterpolate(opt.desc)}</span></div></div><div class="${ssrRenderClass([{ checked: unref(role) === opt.value }, "role-check"])}" data-v-257294ca>`);
				if (unref(role) === opt.value) _push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-check",
					class: "w-3.5 h-3.5"
				}, null, _parent));
				else _push(`<!---->`);
				_push(`</div></button>`);
			});
			_push(`<!--]--></div>`);
			if (unref(errorMsg)) {
				_push(`<div class="error-badge" data-v-257294ca>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-alert-circle",
					class: "w-4 h-4 shrink-0"
				}, null, _parent));
				_push(`<span data-v-257294ca>${ssrInterpolate(unref(errorMsg))}</span></div>`);
			} else _push(`<!---->`);
			_push(`<div class="form-fields" data-v-257294ca><div class="field-group" data-v-257294ca><label class="field-label" data-v-257294ca>${ssrInterpolate(unref(identifierPlaceholder))}</label><input${ssrRenderAttr("value", unref(identifier))} type="text" class="field-input"${ssrRenderAttr("placeholder", unref(identifierPlaceholder))} data-v-257294ca></div><div class="field-group" data-v-257294ca><label class="field-label" data-v-257294ca>Password</label><input${ssrRenderAttr("value", unref(password))} type="password" class="field-input" placeholder="Masukkan password" data-v-257294ca></div></div><button class="${ssrRenderClass([{ loading: unref(loading) }, "submit-btn"])}"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} data-v-257294ca>`);
			if (!unref(loading)) {
				_push(`<span class="btn-text" data-v-257294ca> Masuk sebagai ${ssrInterpolate(roleOptions.find((o) => o.value === unref(role))?.label)} `);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-arrow-right",
					class: "w-4 h-4"
				}, null, _parent));
				_push(`</span>`);
			} else _push(`<span class="btn-loading" data-v-257294ca><span class="loading-spinner" data-v-257294ca></span> Memproses... </span>`);
			_push(`</button><p class="form-footer-text" data-v-257294ca> Belum punya akun? `);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/register",
				class: "form-link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Daftar Baru`);
					else return [createTextVNode("Daftar Baru")];
				}),
				_: 1
			}, _parent));
			_push(`</p></div></div></div></div>`);
		};
	}
});
//#endregion
//#region app/pages/login.vue
var _sfc_setup = login_vue_vue_type_script_setup_true_lang_default.setup;
login_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var login_default = /*#__PURE__*/ _plugin_vue_export_helper_default(login_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-257294ca"]]);

export { login_default as default };
//# sourceMappingURL=login-CA1QxObp.mjs.map
