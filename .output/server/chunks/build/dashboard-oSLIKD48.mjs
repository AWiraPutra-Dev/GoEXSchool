import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default, f as useRoute, g as useRouter, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-aR38ESGJ.mjs';
import { mergeProps, defineComponent, ref, computed, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderStyle, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/components/TopBar.vue?vue&type=script&setup=true&lang.ts
var TopBar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "TopBar",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const now = ref(/* @__PURE__ */ new Date());
		const clock = computed(() => now.value.toLocaleTimeString("id-ID", {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		}));
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<header${ssrRenderAttrs(mergeProps({ class: "top-bar" }, _attrs))} data-v-6b05069e><div class="user-info" data-v-6b05069e><div class="user-avatar" data-v-6b05069e>${ssrInterpolate(unref(auth).userInitials)}</div><div data-v-6b05069e><div class="user-name" data-v-6b05069e>${ssrInterpolate(unref(auth).user?.name ?? "User")}</div><div class="user-role" data-v-6b05069e>${ssrInterpolate(unref(auth).roleLabel)}</div></div></div><div class="school-brand" data-v-6b05069e><div class="school-logo" data-v-6b05069e><span class="text-white font-bold text-lg" data-v-6b05069e>E</span></div><div class="school-title" data-v-6b05069e>${ssrInterpolate(unref(auth).institution?.name ?? "EskulHub")}</div></div><div class="app-info" data-v-6b05069e><div class="app-label" data-v-6b05069e>Aplikasi Manajemen Ekstrakurikuler</div><div style="${ssrRenderStyle({
				"display": "flex",
				"align-items": "center",
				"gap": "8px",
				"justify-content": "flex-end"
			})}" data-v-6b05069e><span class="app-name" data-v-6b05069e>Eskul</span><span class="app-name" style="${ssrRenderStyle({ "color": "var(--olive-primary)" })}" data-v-6b05069e>Hub</span><span class="clock" data-v-6b05069e>${ssrInterpolate(unref(clock))}</span></div></div></header>`);
		};
	}
});
//#endregion
//#region app/components/TopBar.vue
var _sfc_setup$4 = TopBar_vue_vue_type_script_setup_true_lang_default.setup;
TopBar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TopBar.vue");
	return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
var TopBar_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(TopBar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6b05069e"]]), { __name: "TopBar" });
//#endregion
//#region app/components/Sidebar.vue?vue&type=script&setup=true&lang.ts
var Sidebar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "Sidebar",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const route = useRoute();
		useRouter();
		const menusByRole = {
			admin: [
				{
					label: "Dashboard",
					icon: "i-lucide-layout-dashboard",
					to: "/admin",
					section: "Utama"
				},
				{
					label: "Data Siswa",
					icon: "i-lucide-users",
					to: "/admin/students",
					section: "Data Master"
				},
				{
					label: "Data Guru",
					icon: "i-lucide-user-check",
					to: "/admin/teachers",
					section: "Data Master"
				},
				{
					label: "Kelas / Rombel",
					icon: "i-lucide-school",
					to: "/admin/classes",
					section: "Data Master"
				},
				{
					label: "Ekstrakurikuler",
					icon: "i-lucide-shield",
					to: "/admin/extracurriculars",
					section: "Data Master"
				},
				{
					label: "Anggota Ekskul",
					icon: "i-lucide-users",
					to: "/admin/members",
					section: "Data Master"
				},
				{
					label: "Jadwal Ekskul",
					icon: "i-lucide-calendar",
					to: "/admin/schedule",
					section: "Kegiatan"
				},
				{
					label: "Absensi",
					icon: "i-lucide-check-square",
					to: "/admin/attendance",
					section: "Kegiatan"
				},
				{
					label: "Penilaian",
					icon: "i-lucide-clipboard-check",
					to: "/admin/assessments",
					section: "Kegiatan"
				},
				{
					label: "Feed Komunitas",
					icon: "i-lucide-newspaper",
					to: "/admin/feed",
					section: "Konten"
				},
				{
					label: "Voting",
					icon: "i-lucide-vote",
					to: "/admin/polls",
					section: "Konten"
				},
				{
					label: "Pengumuman & Berita",
					icon: "i-lucide-megaphone",
					to: "/admin/news",
					section: "Konten"
				},
				{
					label: "Galeri Foto",
					icon: "i-lucide-images",
					to: "/admin/gallery",
					section: "Konten"
				},
				{
					label: "Portofolio Prestasi",
					icon: "i-lucide-award",
					to: "/admin/achievements",
					section: "Konten"
				},
				{
					label: "User & Privileges",
					icon: "i-lucide-user-cog",
					to: "/admin/users",
					section: "Pengaturan"
				},
				{
					label: "Laporan",
					icon: "i-lucide-file-bar-chart",
					to: "/admin/reports",
					section: "Pengaturan"
				},
				{
					label: "Pengaturan Instansi",
					icon: "i-lucide-settings",
					to: "/admin/settings",
					section: "Pengaturan"
				}
			],
			operator: [
				{
					label: "Dashboard",
					icon: "i-lucide-layout-dashboard",
					to: "/operator",
					section: "Utama"
				},
				{
					label: "Absensi QR",
					icon: "i-lucide-qr-code",
					to: "/operator/attendance",
					section: "Kegiatan"
				},
				{
					label: "Penilaian",
					icon: "i-lucide-clipboard-check",
					to: "/operator/assessments",
					section: "Kegiatan"
				},
				{
					label: "Jadwal Ekskul",
					icon: "i-lucide-calendar",
					to: "/operator/schedule",
					section: "Kegiatan"
				},
				{
					label: "Anggota Ekskul",
					icon: "i-lucide-users",
					to: "/operator/members",
					section: "Data"
				},
				{
					label: "Voting",
					icon: "i-lucide-vote",
					to: "/operator/polls",
					section: "Konten"
				},
				{
					label: "Pengumuman & Berita",
					icon: "i-lucide-megaphone",
					to: "/operator/news",
					section: "Konten"
				},
				{
					label: "Galeri Foto",
					icon: "i-lucide-images",
					to: "/operator/gallery",
					section: "Konten"
				}
			],
			student: [
				{
					label: "Dashboard",
					icon: "i-lucide-layout-dashboard",
					to: "/siswa",
					section: "Utama"
				},
				{
					label: "Jadwal Saya",
					icon: "i-lucide-calendar",
					to: "/siswa/schedule",
					section: "Aktivitas"
				},
				{
					label: "Kehadiran",
					icon: "i-lucide-check-square",
					to: "/siswa/attendance",
					section: "Aktivitas"
				},
				{
					label: "Penilaian",
					icon: "i-lucide-clipboard-list",
					to: "/siswa/grades",
					section: "Aktivitas"
				},
				{
					label: "Voting",
					icon: "i-lucide-vote",
					to: "/siswa/polls",
					section: "Partisipasi"
				},
				{
					label: "Feed Komunitas",
					icon: "i-lucide-newspaper",
					to: "/siswa/feed",
					section: "Partisipasi"
				},
				{
					label: "Galeri",
					icon: "i-lucide-images",
					to: "/siswa/gallery",
					section: "Partisipasi"
				},
				{
					label: "Portofolio Prestasi",
					icon: "i-lucide-award",
					to: "/siswa/achievements",
					section: "Partisipasi"
				},
				{
					label: "Profil Saya",
					icon: "i-lucide-user",
					to: "/siswa/profile",
					section: "Akun"
				}
			]
		};
		const menu = computed(() => menusByRole[auth.user?.role ?? "student"] ?? []);
		const menuSections = computed(() => {
			const sections = [];
			const grouped = /* @__PURE__ */ new Map();
			for (const item of menu.value) {
				if (!grouped.has(item.section)) grouped.set(item.section, []);
				grouped.get(item.section).push(item);
			}
			for (const [name, items] of grouped) sections.push({
				name,
				items
			});
			return sections;
		});
		function isActive(item) {
			return route.path === item.to;
		}
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<aside${ssrRenderAttrs(mergeProps({ class: "sidebar" }, _attrs))} data-v-8d8983de><nav data-v-8d8983de><!--[-->`);
			ssrRenderList(unref(menuSections), (section) => {
				_push(`<!--[--><div class="menu-section-title" data-v-8d8983de>${ssrInterpolate(section.name)}</div><!--[-->`);
				ssrRenderList(section.items, (item) => {
					_push(`<a${ssrRenderAttr("href", item.to)} class="${ssrRenderClass([{ active: isActive(item) }, "menu-item"])}" data-v-8d8983de>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: item.icon,
						class: "menu-icon"
					}, null, _parent));
					_push(`<span data-v-8d8983de>${ssrInterpolate(item.label)}</span></a>`);
				});
				_push(`<!--]--><!--]-->`);
			});
			_push(`<!--]--></nav><div class="logout-section" data-v-8d8983de><button class="menu-item logout-item" data-v-8d8983de>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "i-lucide-log-out",
				class: "menu-icon"
			}, null, _parent));
			_push(`<span data-v-8d8983de>Keluar Aplikasi</span></button></div></aside>`);
		};
	}
});
//#endregion
//#region app/components/Sidebar.vue
var _sfc_setup$3 = Sidebar_vue_vue_type_script_setup_true_lang_default.setup;
Sidebar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
	return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var Sidebar_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(Sidebar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-8d8983de"]]), { __name: "Sidebar" });
//#endregion
//#region app/components/BreadcrumbBar.vue?vue&type=script&setup=true&lang.ts
var BreadcrumbBar_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "BreadcrumbBar",
	__ssrInlineRender: true,
	setup(__props) {
		const route = useRoute();
		const breadcrumbs = computed(() => {
			const parts = route.path.split("/").filter(Boolean);
			const items = [];
			const labelMap = {
				admin: "Admin",
				operator: "Operator",
				siswa: "Siswa",
				students: "Data Siswa",
				teachers: "Data Guru",
				classes: "Kelas / Rombel",
				extracurriculars: "Ekstrakurikuler",
				users: "User & Privileges",
				reports: "Laporan",
				settings: "Pengaturan",
				attendance: "Absensi QR",
				assessments: "Penilaian",
				schedule: "Jadwal",
				members: "Anggota",
				news: "Pengumuman & Berita",
				polls: "Voting",
				gallery: "Galeri",
				feed: "Feed Komunitas",
				achievements: "Portofolio Prestasi",
				grades: "Penilaian",
				profile: "Profil Saya"
			};
			for (let i = 0; i < parts.length; i++) {
				const path = "/" + parts.slice(0, i + 1).join("/");
				const label = labelMap[parts[i]] ?? parts[i].charAt(0).toUpperCase() + parts[i].slice(1);
				items.push({
					label,
					to: path
				});
			}
			return items;
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			const _component_NuxtLink = NuxtLink;
			if (unref(breadcrumbs).length > 0) {
				_push(`<div${ssrRenderAttrs(mergeProps({ class: "breadcrumb-bar" }, _attrs))} data-v-42f74304>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-home",
					class: "breadcrumb-icon"
				}, null, _parent));
				_push(`<!--[-->`);
				ssrRenderList(unref(breadcrumbs), (crumb, i) => {
					_push(`<!--[-->`);
					if (i < unref(breadcrumbs).length - 1) _push(ssrRenderComponent(_component_NuxtLink, {
						to: crumb.to,
						class: "breadcrumb-link"
					}, {
						default: withCtx((_, _push, _parent, _scopeId) => {
							if (_push) _push(`${ssrInterpolate(crumb.label)}`);
							else return [createTextVNode(toDisplayString(crumb.label), 1)];
						}),
						_: 2
					}, _parent));
					else _push(`<span class="breadcrumb-text" data-v-42f74304>${ssrInterpolate(crumb.label)}</span>`);
					if (i < unref(breadcrumbs).length - 1) _push(ssrRenderComponent(_component_Icon, {
						name: "i-lucide-chevron-right",
						class: "breadcrumb-sep"
					}, null, _parent));
					else _push(`<!---->`);
					_push(`<!--]-->`);
				});
				_push(`<!--]--></div>`);
			} else _push(`<!---->`);
		};
	}
});
//#endregion
//#region app/components/BreadcrumbBar.vue
var _sfc_setup$2 = BreadcrumbBar_vue_vue_type_script_setup_true_lang_default.setup;
BreadcrumbBar_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BreadcrumbBar.vue");
	return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var BreadcrumbBar_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(BreadcrumbBar_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-42f74304"]]), { __name: "BreadcrumbBar" });
//#endregion
//#region app/components/AppFooter.vue
var _sfc_main$1 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
	_push(`<footer${ssrRenderAttrs(mergeProps({ class: "app-footer" }, _attrs))} data-v-d2826f8b><span data-v-d2826f8b>© ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} EskulHub — Aplikasi Manajemen Ekstrakurikuler Sekolah</span><span class="footer-version" data-v-d2826f8b>v1.0.0</span></footer>`);
}
var _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
	return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var AppFooter_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-d2826f8b"]]), { __name: "AppFooter" });
//#endregion
//#region app/layouts/dashboard.vue
var _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
	const _component_TopBar = TopBar_default;
	const _component_Sidebar = Sidebar_default;
	const _component_BreadcrumbBar = BreadcrumbBar_default;
	const _component_AppFooter = AppFooter_default;
	_push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-layout" }, _attrs))} data-v-a26c158a>`);
	_push(ssrRenderComponent(_component_TopBar, null, null, _parent));
	_push(ssrRenderComponent(_component_Sidebar, null, null, _parent));
	_push(`<main class="main-content" data-v-a26c158a>`);
	_push(ssrRenderComponent(_component_BreadcrumbBar, null, null, _parent));
	ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
	_push(`</main>`);
	_push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
	_push(`</div>`);
}
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var dashboard_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-a26c158a"]]);

export { dashboard_default as default };
//# sourceMappingURL=dashboard-oSLIKD48.mjs.map
