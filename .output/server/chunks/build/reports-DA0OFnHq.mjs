import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderStyle, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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

//#region app/pages/admin/reports.vue?vue&type=script&setup=true&lang.ts
var reports_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "reports",
	__ssrInlineRender: true,
	setup(__props) {
		const reportTypes = [
			{
				label: "Laporan Data Siswa",
				icon: "i-lucide-users",
				desc: "Rekapitulasi data siswa per kelas",
				color: "var(--teal-dark)"
			},
			{
				label: "Laporan Kehadiran Ekskul",
				icon: "i-lucide-check-square",
				desc: "Rekap kehadiran siswa per ekskul",
				color: "var(--teal-mid)"
			},
			{
				label: "Laporan Penilaian",
				icon: "i-lucide-clipboard-check",
				desc: "Nilai dan evaluasi kegiatan ekskul",
				color: "var(--teal)"
			},
			{
				label: "Laporan Prestasi",
				icon: "i-lucide-award",
				desc: "Pencapaian dan sertifikat siswa",
				color: "var(--green-soft)"
			},
			{
				label: "Laporan Keuangan",
				icon: "i-lucide-dollar-sign",
				desc: "Iuran dan anggaran kegiatan ekskul",
				color: "var(--yellow-cream)"
			},
			{
				label: "Laporan Tahunan",
				icon: "i-lucide-file-text",
				desc: "Rekapitulasi tahun ajaran",
				color: "var(--orange)"
			}
		];
		const selectedReport = ref("");
		const previewVisible = ref(false);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-6544ad94><h1 class="page-title" data-v-6544ad94>Laporan</h1><div class="report-grid" data-v-6544ad94><!--[-->`);
			ssrRenderList(reportTypes, (r) => {
				_push(`<div class="report-card" data-v-6544ad94><div class="report-icon" style="${ssrRenderStyle({ background: r.color })}" data-v-6544ad94>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: r.icon,
					class: "w-6 h-6 text-white"
				}, null, _parent));
				_push(`</div><div data-v-6544ad94><h3 class="report-title" data-v-6544ad94>${ssrInterpolate(r.label)}</h3><p class="report-desc" data-v-6544ad94>${ssrInterpolate(r.desc)}</p></div>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-chevron-right",
					class: "w-5 h-5",
					style: {
						"color": "var(--text-muted)",
						"flex-shrink": "0"
					}
				}, null, _parent));
				_push(`</div>`);
			});
			_push(`<!--]--></div>`);
			if (unref(previewVisible)) {
				_push(`<div class="preview-card" data-v-6544ad94><div class="preview-header" data-v-6544ad94><h3 data-v-6544ad94>${ssrInterpolate(unref(selectedReport))}</h3><div class="preview-actions" data-v-6544ad94><button class="btn-outline" data-v-6544ad94>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-download",
					class: "w-4 h-4"
				}, null, _parent));
				_push(` Download PDF</button><button class="btn-outline" data-v-6544ad94>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-printer",
					class: "w-4 h-4"
				}, null, _parent));
				_push(` Cetak</button><button class="btn-cancel-icon" data-v-6544ad94>✕</button></div></div><div class="preview-body" data-v-6544ad94><div class="loading-shimmer" style="${ssrRenderStyle({
					"height": "200px",
					"border-radius": "8px"
				})}" data-v-6544ad94></div><p class="text-center text-[13px]" style="${ssrRenderStyle({
					"color": "var(--text-muted)",
					"margin-top": "12px"
				})}" data-v-6544ad94> Preview laporan akan muncul di sini. (Fitur cetak/laporan terintegrasi dengan database) </p></div></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/admin/reports.vue
var _sfc_setup = reports_vue_vue_type_script_setup_true_lang_default.setup;
reports_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/reports.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var reports_default = /*#__PURE__*/ _plugin_vue_export_helper_default(reports_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-6544ad94"]]);

export { reports_default as default };
//# sourceMappingURL=reports-DA0OFnHq.mjs.map
