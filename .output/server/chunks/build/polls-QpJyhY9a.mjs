import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useOperatorDataStore } from './operator-data-x3YpqlSN.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/admin/polls.vue?vue&type=script&setup=true&lang.ts
var polls_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "polls",
	__ssrInlineRender: true,
	setup(__props) {
		const op = useOperatorDataStore();
		const filter = ref("all");
		const filteredPolls = computed(() => {
			if (filter.value === "all") return op.polls;
			if (filter.value === "active") return op.polls.filter((p) => p.active);
			return op.polls.filter((p) => !p.active);
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-090eea93><div class="flex items-center justify-between" data-v-090eea93><div data-v-090eea93><h1 class="page-title" data-v-090eea93>Voting</h1><p class="text-[13px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-090eea93>${ssrInterpolate(unref(op).polls.length)} total voting</p></div><div class="flex gap-2" data-v-090eea93><button class="${ssrRenderClass([{ active: unref(filter) === "all" }, "filter-btn"])}" data-v-090eea93>Semua</button><button class="${ssrRenderClass([{ active: unref(filter) === "active" }, "filter-btn"])}" data-v-090eea93>Aktif</button><button class="${ssrRenderClass([{ active: unref(filter) === "done" }, "filter-btn"])}" data-v-090eea93>Selesai</button></div></div><div class="polls-list" data-v-090eea93><!--[-->`);
			ssrRenderList(unref(filteredPolls), (poll) => {
				_push(`<div class="poll-card" data-v-090eea93><div class="poll-header" data-v-090eea93><div class="flex items-center gap-2" data-v-090eea93><span class="poll-ekskul-badge" data-v-090eea93>${ssrInterpolate(poll.ekskul)}</span><span class="${ssrRenderClass([poll.active ? "badge-active" : "badge-done", "poll-status-badge"])}" data-v-090eea93>${ssrInterpolate(poll.active ? "Berlangsung" : "Selesai")}</span></div><span class="poll-date" data-v-090eea93>${ssrInterpolate(poll.endDate)}</span></div><h3 class="poll-question" data-v-090eea93>${ssrInterpolate(poll.question)}</h3><div class="poll-results" data-v-090eea93><!--[-->`);
				ssrRenderList(poll.options, (opt) => {
					_push(`<div class="poll-result-item" data-v-090eea93><div class="result-label-row" data-v-090eea93><span class="result-label" data-v-090eea93>${ssrInterpolate(opt.label)}</span><span class="result-stats" data-v-090eea93>${ssrInterpolate(opt.votes)} suara</span></div><div class="progress-bar" data-v-090eea93><div class="progress-fill" style="${ssrRenderStyle({ width: (poll.options.reduce((s, o) => s + o.votes, 0) ? opt.votes / poll.options.reduce((s, o) => s + o.votes, 0) * 100 : 0) + "%" })}" data-v-090eea93></div></div></div>`);
				});
				_push(`<!--]--><p class="poll-total" data-v-090eea93>Total ${ssrInterpolate(poll.options.reduce((s, o) => s + o.votes, 0))} suara</p></div></div>`);
			});
			_push(`<!--]-->`);
			if (!unref(filteredPolls).length) {
				_push(`<div class="empty-state" data-v-090eea93>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-vote",
					class: "w-12 h-12 mb-3",
					style: { "color": "var(--text-muted)" }
				}, null, _parent));
				_push(`<p style="${ssrRenderStyle({
					"color": "var(--text-muted)",
					"font-size": "var(--text-sm)"
				})}" data-v-090eea93>Belum ada voting.</p></div>`);
			} else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/admin/polls.vue
var _sfc_setup = polls_vue_vue_type_script_setup_true_lang_default.setup;
polls_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/polls.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var polls_default = /*#__PURE__*/ _plugin_vue_export_helper_default(polls_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-090eea93"]]);

export { polls_default as default };
//# sourceMappingURL=polls-QpJyhY9a.mjs.map
