import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useOperatorDataStore } from './operator-data-x3YpqlSN.mjs';
import { u as useMasterDataStore } from './master-data-CuoK-2mz.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
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

//#region app/pages/operator/assessments.vue?vue&type=script&setup=true&lang.ts
var assessments_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "assessments",
	__ssrInlineRender: true,
	setup(__props) {
		const op = useOperatorDataStore();
		const admin = useMasterDataStore();
		const selectedEkskul = ref("Semua");
		const search = ref("");
		const showModal = ref(false);
		const editMode = ref(false);
		ref("");
		const form = reactive({
			studentId: "",
			extracurricularId: "",
			score: 75,
			notes: ""
		});
		const ekskulList = computed(() => {
			return ["Semua", ...[...new Set(op.assessments.map((a) => a.ekskul))]];
		});
		const filtered = computed(() => {
			let result = op.assessments;
			if (selectedEkskul.value !== "Semua") result = result.filter((a) => a.ekskul === selectedEkskul.value);
			if (search.value) result = result.filter((a) => a.student.toLowerCase().includes(search.value.toLowerCase()));
			return result;
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-fc2aa8a4><div class="flex items-center justify-between" data-v-fc2aa8a4><h1 class="page-title" data-v-fc2aa8a4>Penilaian</h1><button class="btn-primary" data-v-fc2aa8a4>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "i-lucide-plus",
				class: "w-4 h-4"
			}, null, _parent));
			_push(` Input Nilai</button></div><div class="table-card" data-v-fc2aa8a4><div class="table-toolbar" data-v-fc2aa8a4><div class="flex gap-3 items-center" data-v-fc2aa8a4><select class="filter-select" data-v-fc2aa8a4><!--[-->`);
			ssrRenderList(unref(ekskulList), (e) => {
				_push(`<option data-v-fc2aa8a4${ssrIncludeBooleanAttr(Array.isArray(unref(selectedEkskul)) ? ssrLooseContain(unref(selectedEkskul), null) : ssrLooseEqual(unref(selectedEkskul), null)) ? " selected" : ""}>${ssrInterpolate(e)}</option>`);
			});
			_push(`<!--]--></select><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Cari siswa..." class="search-input" data-v-fc2aa8a4></div><span class="text-[11px]" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}" data-v-fc2aa8a4>${ssrInterpolate(unref(filtered).length)} data</span></div><table class="data-table" data-v-fc2aa8a4><thead data-v-fc2aa8a4><tr data-v-fc2aa8a4><th data-v-fc2aa8a4>Siswa</th><th data-v-fc2aa8a4>Ekskul</th><th data-v-fc2aa8a4>Nilai</th><th data-v-fc2aa8a4>Grade</th><th data-v-fc2aa8a4>Catatan</th><th data-v-fc2aa8a4>Tanggal</th><th class="text-right" data-v-fc2aa8a4>Aksi</th></tr></thead><tbody data-v-fc2aa8a4><!--[-->`);
			ssrRenderList(unref(filtered), (a) => {
				_push(`<tr data-v-fc2aa8a4><td class="font-semibold" data-v-fc2aa8a4>${ssrInterpolate(a.student)}</td><td data-v-fc2aa8a4><span class="ekskul-tag" data-v-fc2aa8a4>${ssrInterpolate(a.ekskul)}</span></td><td class="text-center font-bold text-[16px]" style="${ssrRenderStyle({ color: a.score >= 85 ? "var(--teal)" : a.score >= 70 ? "var(--orange)" : "var(--red-orange)" })}" data-v-fc2aa8a4>${ssrInterpolate(a.score)}</td><td data-v-fc2aa8a4><span class="${ssrRenderClass([a.score >= 80 ? "grade-high" : "grade-mid", "grade-badge"])}" data-v-fc2aa8a4>${ssrInterpolate(a.grade)}</span></td><td style="${ssrRenderStyle({
					"color": "var(--text-secondary)",
					"font-size": "var(--text-sm)"
				})}" data-v-fc2aa8a4>${ssrInterpolate(a.notes)}</td><td style="${ssrRenderStyle({
					"color": "var(--text-muted)",
					"font-size": "var(--text-sm)"
				})}" data-v-fc2aa8a4>${ssrInterpolate(a.date)}</td><td class="text-right action-cell" data-v-fc2aa8a4><button class="action-btn" title="Edit" data-v-fc2aa8a4>✏️</button><button class="action-btn" title="Hapus" style="${ssrRenderStyle({ "color": "var(--text-red)" })}" data-v-fc2aa8a4>🗑️</button></td></tr>`);
			});
			_push(`<!--]--></tbody></table></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="modal-overlay" data-v-fc2aa8a4><div class="modal-content" data-v-fc2aa8a4><h3 class="modal-title" data-v-fc2aa8a4>${ssrInterpolate(unref(editMode) ? "Edit Nilai" : "Input Nilai Baru")}</h3><form class="space-y-3" data-v-fc2aa8a4>`);
					if (!unref(editMode)) {
						_push(`<div class="form-row" data-v-fc2aa8a4><div class="form-group" data-v-fc2aa8a4><label data-v-fc2aa8a4>Siswa</label><select class="form-input" required data-v-fc2aa8a4><option disabled value="" data-v-fc2aa8a4${ssrIncludeBooleanAttr(Array.isArray(unref(form).studentId) ? ssrLooseContain(unref(form).studentId, "") : ssrLooseEqual(unref(form).studentId, "")) ? " selected" : ""}>Pilih Siswa</option><!--[-->`);
						ssrRenderList(unref(admin).students, (s) => {
							_push(`<option${ssrRenderAttr("value", s.id)} data-v-fc2aa8a4${ssrIncludeBooleanAttr(Array.isArray(unref(form).studentId) ? ssrLooseContain(unref(form).studentId, s.id) : ssrLooseEqual(unref(form).studentId, s.id)) ? " selected" : ""}>${ssrInterpolate(s.name)} (${ssrInterpolate(s.nis)})</option>`);
						});
						_push(`<!--]--></select></div><div class="form-group" data-v-fc2aa8a4><label data-v-fc2aa8a4>Ekskul</label><select class="form-input" required data-v-fc2aa8a4><option disabled value="" data-v-fc2aa8a4${ssrIncludeBooleanAttr(Array.isArray(unref(form).extracurricularId) ? ssrLooseContain(unref(form).extracurricularId, "") : ssrLooseEqual(unref(form).extracurricularId, "")) ? " selected" : ""}>Pilih Ekskul</option><!--[-->`);
						ssrRenderList(unref(admin).extracurriculars, (e) => {
							_push(`<option${ssrRenderAttr("value", e.id)} data-v-fc2aa8a4${ssrIncludeBooleanAttr(Array.isArray(unref(form).extracurricularId) ? ssrLooseContain(unref(form).extracurricularId, e.id) : ssrLooseEqual(unref(form).extracurricularId, e.id)) ? " selected" : ""}>${ssrInterpolate(e.name)}</option>`);
						});
						_push(`<!--]--></select></div></div>`);
					} else _push(`<!---->`);
					_push(`<div class="form-row" data-v-fc2aa8a4><div class="form-group" data-v-fc2aa8a4><label data-v-fc2aa8a4>Nilai (0-100)</label><input${ssrRenderAttr("value", unref(form).score)} type="number" min="0" max="100" class="form-input" required data-v-fc2aa8a4></div><div class="form-group" data-v-fc2aa8a4><label data-v-fc2aa8a4>Grade Otomatis</label><input${ssrRenderAttr("value", unref(form).score >= 85 ? "A" : unref(form).score >= 80 ? "A-" : unref(form).score >= 75 ? "B+" : unref(form).score >= 70 ? "B" : "C")} disabled class="form-input" style="${ssrRenderStyle({ "background": "var(--bg-main)" })}" data-v-fc2aa8a4></div></div><div class="form-group" data-v-fc2aa8a4><label data-v-fc2aa8a4>Catatan</label><textarea class="form-input" rows="2" data-v-fc2aa8a4>${ssrInterpolate(unref(form).notes)}</textarea></div><div class="modal-actions" data-v-fc2aa8a4><button type="button" class="btn-cancel" data-v-fc2aa8a4>Batal</button><button type="submit" class="btn-primary" data-v-fc2aa8a4>${ssrInterpolate(unref(editMode) ? "Simpan" : "Simpan")}</button></div></form></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/operator/assessments.vue
var _sfc_setup = assessments_vue_vue_type_script_setup_true_lang_default.setup;
assessments_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/operator/assessments.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var assessments_default = /*#__PURE__*/ _plugin_vue_export_helper_default(assessments_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-fc2aa8a4"]]);

export { assessments_default as default };
//# sourceMappingURL=assessments-DI2ZwOIC.mjs.map
