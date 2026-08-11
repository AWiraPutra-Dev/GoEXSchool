import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useOperatorDataStore } from './operator-data-x3YpqlSN.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import 'nostics';
import 'nostics/formatters/ansi';
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
import 'unhead/utils';

//#region app/pages/admin/members.vue?vue&type=script&setup=true&lang.ts
var members_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "members",
	__ssrInlineRender: true,
	setup(__props) {
		const op = useOperatorDataStore();
		const selectedEkskul = ref("Semua");
		const search = ref("");
		const filtered = computed(() => {
			let result = op.members;
			if (selectedEkskul.value !== "Semua") result = result.filter((m) => m.ekskul === selectedEkskul.value);
			if (search.value) result = result.filter((m) => m.name.toLowerCase().includes(search.value.toLowerCase()) || m.class.toLowerCase().includes(search.value.toLowerCase()));
			return result;
		});
		const ekskulOptions = ["Semua", ...new Set(op.members.map((m) => m.ekskul))];
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-b1047d39><h1 class="page-title" data-v-b1047d39>Anggota Ekskul</h1><p class="text-[13px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-b1047d39>${ssrInterpolate(unref(op).members.length)} total anggota</p><div class="table-card" data-v-b1047d39><div class="table-toolbar" data-v-b1047d39><div class="flex gap-3 items-center" data-v-b1047d39><select class="filter-select" data-v-b1047d39><!--[-->`);
			ssrRenderList(ekskulOptions, (e) => {
				_push(`<option data-v-b1047d39${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEkskul)) ? ssrLooseContain(unref(selectedEkskul), null) : ssrLooseEqual(unref(selectedEkskul), null)) ? " selected" : ""}>${ssrInterpolate(e)}</option>`);
			});
			_push(`<!--]--></select><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Cari nama atau kelas..." class="search-input" data-v-b1047d39></div><span class="text-[11px]" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}" data-v-b1047d39>${ssrInterpolate(unref(filtered).length)} anggota</span></div><table class="data-table" data-v-b1047d39><thead data-v-b1047d39><tr data-v-b1047d39><th data-v-b1047d39>Nama</th><th data-v-b1047d39>Kelas</th><th data-v-b1047d39>Ekskul</th><th data-v-b1047d39>Bergabung</th><th data-v-b1047d39>Status</th></tr></thead><tbody data-v-b1047d39><!--[-->`);
			ssrRenderList(unref(filtered), (m) => {
				_push(`<tr data-v-b1047d39><td class="font-semibold" data-v-b1047d39>${ssrInterpolate(m.name)}</td><td data-v-b1047d39>${ssrInterpolate(m.class)}</td><td data-v-b1047d39><span class="ekskul-tag" data-v-b1047d39>${ssrInterpolate(m.ekskul)}</span></td><td style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-b1047d39>${ssrInterpolate(m.joinDate)}</td><td data-v-b1047d39><span class="${ssrRenderClass([m.status === "active" ? "status-active" : "status-inactive", "status-badge"])}" data-v-b1047d39>${ssrInterpolate(m.status === "active" ? "Aktif" : "Nonaktif")}</span></td></tr>`);
			});
			_push(`<!--]-->`);
			if (!unref(filtered).length) _push(`<tr data-v-b1047d39><td colspan="5" class="text-center py-8" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}" data-v-b1047d39>Tidak ada data</td></tr>`);
			else _push(`<!---->`);
			_push(`</tbody></table></div></div>`);
		};
	}
});
//#endregion
//#region app/pages/admin/members.vue
var _sfc_setup = members_vue_vue_type_script_setup_true_lang_default.setup;
members_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/members.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var members_default = /*#__PURE__*/ _plugin_vue_export_helper_default(members_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b1047d39"]]);

export { members_default as default };
//# sourceMappingURL=members-C1bGmtF2.mjs.map
