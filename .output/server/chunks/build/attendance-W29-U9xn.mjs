import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useOperatorDataStore } from './operator-data-x3YpqlSN.mjs';
import { u as useMasterDataStore } from './master-data-CuoK-2mz.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/operator/attendance.vue?vue&type=script&setup=true&lang.ts
var attendance_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "attendance",
	__ssrInlineRender: true,
	setup(__props) {
		const op = useOperatorDataStore();
		const admin = useMasterDataStore();
		const generating = ref(false);
		const activeSession = ref(null);
		const selectedEkskulId = ref("");
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-884f4e10><h1 class="page-title" data-v-884f4e10>Absensi QR</h1><div class="qr-generator-card" data-v-884f4e10><div class="form-row" style="${ssrRenderStyle({ "max-width": "400px" })}" data-v-884f4e10><div class="form-group" data-v-884f4e10><label data-v-884f4e10>Pilih Ekskul</label><select class="form-input" required data-v-884f4e10><option disabled value="" data-v-884f4e10${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEkskulId)) ? ssrLooseContain(unref(selectedEkskulId), "") : ssrLooseEqual(unref(selectedEkskulId), "")) ? " selected" : ""}>Pilih Ekskul</option><!--[-->`);
			ssrRenderList(unref(admin).extracurriculars, (e) => {
				_push(`<option${ssrRenderAttr("value", e.id)} data-v-884f4e10${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEkskulId)) ? ssrLooseContain(unref(selectedEkskulId), e.id) : ssrLooseEqual(unref(selectedEkskulId), e.id)) ? " selected" : ""}>${ssrInterpolate(e.name)}</option>`);
			});
			_push(`<!--]--></select></div></div><button class="btn-primary"${ssrIncludeBooleanAttr(unref(generating)) ? " disabled" : ""} data-v-884f4e10>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "i-lucide-qr-code",
				class: "w-4 h-4"
			}, null, _parent));
			_push(` ${ssrInterpolate(unref(generating) ? "Membuat QR..." : "Buat QR Absensi")}</button>`);
			if (unref(activeSession)) {
				_push(`<div class="qr-result" data-v-884f4e10><div class="qr-placeholder" data-v-884f4e10><div class="qr-grid" data-v-884f4e10><!--[-->`);
				ssrRenderList(121, (i) => {
					_push(`<div class="${ssrRenderClass([{ "qr-dark": Math.random() > .6 }, "qr-cell"])}" data-v-884f4e10></div>`);
				});
				_push(`<!--]--></div></div><div class="qr-info" data-v-884f4e10><p class="qr-token" data-v-884f4e10>Token: <strong data-v-884f4e10>${ssrInterpolate(unref(activeSession).token)}</strong></p><p class="qr-expires" data-v-884f4e10>Berlaku sampai: ${ssrInterpolate(unref(activeSession).expiresAt)} WIB</p><p class="qr-hint" style="${ssrRenderStyle({
					"color": "var(--text-muted)",
					"font-size": "var(--text-sm)"
				})}" data-v-884f4e10>Tampilkan QR ini di layar, siswa scan lewat dashboard mereka.</p></div></div>`);
			} else _push(`<!---->`);
			_push(`</div><div class="table-card" data-v-884f4e10><div class="table-toolbar" data-v-884f4e10><h3 class="font-semibold text-[14px]" data-v-884f4e10>Riwayat Absensi</h3></div><table class="data-table" data-v-884f4e10><thead data-v-884f4e10><tr data-v-884f4e10><th data-v-884f4e10>Tanggal</th><th data-v-884f4e10>Ekskul</th><th data-v-884f4e10>Hadir</th><th data-v-884f4e10>Total</th><th data-v-884f4e10>Status</th></tr></thead><tbody data-v-884f4e10><!--[-->`);
			ssrRenderList(unref(op).attendanceHistory, (h) => {
				_push(`<tr data-v-884f4e10><td data-v-884f4e10>${ssrInterpolate(h.date)}</td><td class="font-semibold" data-v-884f4e10>${ssrInterpolate(h.ekskul)}</td><td data-v-884f4e10>${ssrInterpolate(h.hadir)}</td><td data-v-884f4e10>${ssrInterpolate(h.total)}</td><td data-v-884f4e10><span class="status-badge status-done" data-v-884f4e10>${ssrInterpolate(h.status)}</span></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div></div>`);
		};
	}
});
//#endregion
//#region app/pages/operator/attendance.vue
var _sfc_setup = attendance_vue_vue_type_script_setup_true_lang_default.setup;
attendance_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/operator/attendance.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var attendance_default = /*#__PURE__*/ _plugin_vue_export_helper_default(attendance_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-884f4e10"]]);

export { attendance_default as default };
//# sourceMappingURL=attendance-W29-U9xn.mjs.map
