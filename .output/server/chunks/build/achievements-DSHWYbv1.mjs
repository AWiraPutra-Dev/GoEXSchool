import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useSiswaDataStore } from './siswa-data-DPedxD4_.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/admin/achievements.vue?vue&type=script&setup=true&lang.ts
var achievements_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "achievements",
	__ssrInlineRender: true,
	setup(__props) {
		const siswa = useSiswaDataStore();
		const typeLabels = {
			juara: "🥇 Juara",
			sertifikat: "📜 Sertifikat",
			partisipasi: "🤝 Partisipasi",
			organisasi: "👥 Organisasi"
		};
		const levelLabels = {
			sekolah: "Sekolah",
			kecamatan: "Kecamatan",
			kota: "Kota",
			provinsi: "Provinsi",
			nasional: "Nasional"
		};
		const typeColors = {
			juara: "var(--yellow-cream)",
			sertifikat: "var(--teal)",
			partisipasi: "var(--green-soft)",
			organisasi: "var(--olive-primary)"
		};
		const levelColors = {
			sekolah: "var(--teal)",
			kecamatan: "var(--teal-mid)",
			kota: "var(--yellow-cream)",
			provinsi: "var(--orange)",
			nasional: "var(--red-orange)"
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-9eda7944><h1 class="page-title" data-v-9eda7944>Portofolio Prestasi</h1><p class="text-[13px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-9eda7944>${ssrInterpolate(unref(siswa).achievements.length)} total prestasi siswa</p><div class="achievements-grid" data-v-9eda7944><!--[-->`);
			ssrRenderList(unref(siswa).achievements, (a) => {
				_push(`<div class="achievement-card" data-v-9eda7944><div class="ach-top" data-v-9eda7944><div class="ach-icon-wrapper" style="${ssrRenderStyle({
					background: typeColors[a.type] + "20",
					color: typeColors[a.type]
				})}" data-v-9eda7944>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: a.type === "juara" ? "i-lucide-trophy" : a.type === "sertifikat" ? "i-lucide-award" : a.type === "partisipasi" ? "i-lucide-handshake" : "i-lucide-users",
					class: "w-6 h-6"
				}, null, _parent));
				_push(`</div><div class="ach-badges" data-v-9eda7944><span class="ach-type-badge" style="${ssrRenderStyle({
					background: typeColors[a.type] + "20",
					color: typeColors[a.type]
				})}" data-v-9eda7944>${ssrInterpolate(typeLabels[a.type])}</span><span class="ach-level-badge" style="${ssrRenderStyle({
					background: levelColors[a.level] + "20",
					color: levelColors[a.level]
				})}" data-v-9eda7944>${ssrInterpolate(levelLabels[a.level])}</span></div></div><h3 class="ach-title" data-v-9eda7944>${ssrInterpolate(a.title)}</h3><p class="ach-desc" data-v-9eda7944>${ssrInterpolate(a.description)}</p><div class="ach-footer" data-v-9eda7944><span class="ach-ekskul" data-v-9eda7944>${ssrInterpolate(a.ekskul)}</span><span class="ach-date" data-v-9eda7944>${ssrInterpolate(a.date)}</span></div></div>`);
			});
			_push(`<!--]-->`);
			if (!unref(siswa).achievements.length) _push(`<div class="empty-state" data-v-9eda7944><p style="${ssrRenderStyle({ "color": "var(--text-muted)" })}" data-v-9eda7944>Belum ada prestasi tercatat.</p></div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/admin/achievements.vue
var _sfc_setup = achievements_vue_vue_type_script_setup_true_lang_default.setup;
achievements_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/achievements.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var achievements_default = /*#__PURE__*/ _plugin_vue_export_helper_default(achievements_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-9eda7944"]]);

export { achievements_default as default };
//# sourceMappingURL=achievements-DSHWYbv1.mjs.map
