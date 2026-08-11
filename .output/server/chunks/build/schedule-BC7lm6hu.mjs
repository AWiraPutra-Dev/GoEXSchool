import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useSiswaDataStore } from './siswa-data-DPedxD4_.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/siswa/schedule.vue?vue&type=script&setup=true&lang.ts
var schedule_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "schedule",
	__ssrInlineRender: true,
	setup(__props) {
		const siswa = useSiswaDataStore();
		const dayNames = [
			"Senin",
			"Selasa",
			"Rabu",
			"Kamis",
			"Jumat",
			"Sabtu"
		];
		const activeDay = ref("Senin");
		const scheduleCount = computed(() => Object.values(siswa.mySchedule).reduce((sum, arr) => sum + arr.length, 0));
		const ekskulCount = computed(() => [...new Set(Object.values(siswa.mySchedule).flat().map((s) => s.ekskul))].length);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-22084173><h1 class="page-title" data-v-22084173>Jadwal Saya</h1><div class="day-tabs" data-v-22084173><!--[-->`);
			ssrRenderList(dayNames, (d) => {
				_push(`<button class="${ssrRenderClass([{ active: unref(activeDay) === d }, "day-tab"])}" data-v-22084173>${ssrInterpolate(d)}</button>`);
			});
			_push(`<!--]--></div><div class="schedule-list" data-v-22084173><!--[-->`);
			ssrRenderList(unref(siswa).mySchedule[unref(activeDay)] ?? [], (s, i) => {
				_push(`<div class="schedule-item" data-v-22084173><div class="schedule-time" data-v-22084173>${ssrInterpolate(s.time)}</div><div class="schedule-info" data-v-22084173><h4 class="font-semibold text-[13px]" data-v-22084173>${ssrInterpolate(s.ekskul)}</h4><p class="text-[12px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-22084173>${ssrInterpolate(s.coach)} · ${ssrInterpolate(s.location)}</p></div></div>`);
			});
			_push(`<!--]-->`);
			if (!(unref(siswa).mySchedule[unref(activeDay)] ?? []).length) {
				_push(`<div class="empty-state" data-v-22084173>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-calendar-off",
					class: "w-8 h-8 mb-2",
					style: { "color": "var(--text-muted)" }
				}, null, _parent));
				_push(`<p data-v-22084173>Tidak ada jadwal ekskul di hari ${ssrInterpolate(unref(activeDay))}.</p></div>`);
			} else _push(`<!---->`);
			_push(`</div><section class="panel-card" data-v-22084173><div class="panel-header" data-v-22084173>Ringkasan Jadwal</div><div class="summary-grid" data-v-22084173><div class="summary-item" data-v-22084173><span class="summary-value" data-v-22084173>${ssrInterpolate(unref(scheduleCount))}</span><span class="summary-label" data-v-22084173>Jadwal/Minggu</span></div><div class="summary-item" data-v-22084173><span class="summary-value" data-v-22084173>${ssrInterpolate(unref(ekskulCount))}</span><span class="summary-label" data-v-22084173>Ekskul Aktif</span></div><div class="summary-item" data-v-22084173><span class="summary-value" data-v-22084173>${ssrInterpolate(unref(scheduleCount) * 1.5)}</span><span class="summary-label" data-v-22084173>Jam/Minggu</span></div></div></section></div>`);
		};
	}
});
//#endregion
//#region app/pages/siswa/schedule.vue
var _sfc_setup = schedule_vue_vue_type_script_setup_true_lang_default.setup;
schedule_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/siswa/schedule.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var schedule_default = /*#__PURE__*/ _plugin_vue_export_helper_default(schedule_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-22084173"]]);

export { schedule_default as default };
//# sourceMappingURL=schedule-BC7lm6hu.mjs.map
