import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useSiswaDataStore } from './siswa-data-DPedxD4_.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual, ssrRenderStyle, ssrRenderComponent } from 'vue/server-renderer';
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

//#region app/pages/siswa/polls.vue?vue&type=script&setup=true&lang.ts
var polls_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "polls",
	__ssrInlineRender: true,
	setup(__props) {
		const siswa = useSiswaDataStore();
		const selectedVote = ref({});
		const showResult = ref({});
		const filter = ref("all");
		function totalVotes(poll) {
			return poll.options.reduce((sum, o) => sum + o.votes, 0);
		}
		function getPercentage(poll, votes) {
			const t = totalVotes(poll);
			return t ? votes / t * 100 : 0;
		}
		const filteredPolls = computed(() => {
			if (filter.value === "all") return siswa.polls;
			if (filter.value === "active") return siswa.polls.filter((p) => p.active);
			return siswa.polls.filter((p) => !p.active);
		});
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-c7910c56><div class="flex items-center justify-between" data-v-c7910c56><h1 class="page-title" data-v-c7910c56>Voting</h1><div class="flex gap-2" data-v-c7910c56><button class="${ssrRenderClass([{ active: unref(filter) === "all" }, "filter-btn"])}" data-v-c7910c56>Semua</button><button class="${ssrRenderClass([{ active: unref(filter) === "active" }, "filter-btn"])}" data-v-c7910c56>Aktif</button><button class="${ssrRenderClass([{ active: unref(filter) === "done" }, "filter-btn"])}" data-v-c7910c56>Selesai</button></div></div><div class="polls-list" data-v-c7910c56><!--[-->`);
			ssrRenderList(unref(filteredPolls), (poll) => {
				_push(`<div class="${ssrRenderClass([{ "poll-voted": poll.myVote }, "poll-card"])}" data-v-c7910c56><div class="poll-header" data-v-c7910c56><div class="flex items-center gap-2" data-v-c7910c56><span class="poll-ekskul-badge" data-v-c7910c56>${ssrInterpolate(poll.ekskul)}</span><span class="${ssrRenderClass([poll.active ? "badge-active" : "badge-done", "poll-status-badge"])}" data-v-c7910c56>${ssrInterpolate(poll.active ? "Berlangsung" : "Selesai")}</span></div><span class="poll-date" data-v-c7910c56>Berakhir ${ssrInterpolate(poll.endDate)}</span></div><h3 class="poll-question" data-v-c7910c56>${ssrInterpolate(poll.question)}</h3>`);
				if (poll.active && !poll.myVote) {
					_push(`<div class="poll-options" data-v-c7910c56><!--[-->`);
					ssrRenderList(poll.options, (opt) => {
						_push(`<label class="${ssrRenderClass([{ selected: unref(selectedVote)[poll.id] === opt.id }, "poll-option"])}" data-v-c7910c56><input type="radio"${ssrRenderAttr("name", "poll-" + poll.id)}${ssrRenderAttr("value", opt.id)}${ssrIncludeBooleanAttr(ssrLooseEqual(unref(selectedVote)[poll.id], opt.id)) ? " checked" : ""} class="poll-radio" data-v-c7910c56><span class="poll-option-label" data-v-c7910c56>${ssrInterpolate(opt.label)}</span></label>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				if ((!poll.active || poll.myVote) && unref(showResult)[poll.id] !== false) {
					_push(`<div class="poll-results" data-v-c7910c56><!--[-->`);
					ssrRenderList(poll.options, (opt) => {
						_push(`<div class="poll-result-item" data-v-c7910c56><div class="result-label-row" data-v-c7910c56><span class="result-label" data-v-c7910c56>${ssrInterpolate(opt.label)}</span><span class="result-stats" data-v-c7910c56>${ssrInterpolate(opt.votes)} suara (${ssrInterpolate(Math.round(getPercentage(poll, opt.votes)))}%)</span></div><div class="progress-bar" data-v-c7910c56><div class="progress-fill" style="${ssrRenderStyle({
							width: getPercentage(poll, opt.votes) + "%",
							background: poll.myVote === opt.id ? "var(--olive-primary)" : "var(--teal)"
						})}" data-v-c7910c56></div></div></div>`);
					});
					_push(`<!--]--><p class="poll-total" data-v-c7910c56>Total ${ssrInterpolate(totalVotes(poll))} suara</p></div>`);
				} else _push(`<!---->`);
				_push(`<div class="poll-actions" data-v-c7910c56>`);
				if (poll.active && !poll.myVote) {
					_push(`<button class="btn-primary"${ssrIncludeBooleanAttr(!unref(selectedVote)[poll.id]) ? " disabled" : ""} data-v-c7910c56>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "i-lucide-check",
						class: "w-4 h-4"
					}, null, _parent));
					_push(` Kirim Suara</button>`);
				} else if (poll.myVote) {
					_push(`<!--[--><div class="voted-badge" data-v-c7910c56>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "i-lucide-check-circle",
						class: "w-4 h-4"
					}, null, _parent));
					_push(` Kamu memilih: <strong data-v-c7910c56>${ssrInterpolate(poll.options.find((o) => o.id === poll.myVote)?.label)}</strong></div><button class="btn-outline" data-v-c7910c56>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: unref(showResult)[poll.id] ? "i-lucide-eye-off" : "i-lucide-eye",
						class: "w-4 h-4"
					}, null, _parent));
					_push(` ${ssrInterpolate(unref(showResult)[poll.id] ? "Sembunyikan" : "Lihat")} Hasil</button><!--]-->`);
				} else {
					_push(`<!--[--><span class="closed-badge" data-v-c7910c56>Voting ditutup</span>`);
					if (!unref(showResult)[poll.id]) {
						_push(`<button class="btn-outline" data-v-c7910c56>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-bar-chart",
							class: "w-4 h-4"
						}, null, _parent));
						_push(` Lihat Hasil</button>`);
					} else _push(`<!---->`);
					_push(`<!--]-->`);
				}
				_push(`</div></div>`);
			});
			_push(`<!--]--></div>`);
			if (!unref(filteredPolls).length) {
				_push(`<div class="empty-state" data-v-c7910c56>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-vote",
					class: "w-12 h-12 mb-3",
					style: { "color": "var(--text-muted)" }
				}, null, _parent));
				_push(`<p style="${ssrRenderStyle({
					"color": "var(--text-muted)",
					"font-size": "var(--text-sm)"
				})}" data-v-c7910c56>Belum ada voting.</p></div>`);
			} else _push(`<!---->`);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/siswa/polls.vue
var _sfc_setup = polls_vue_vue_type_script_setup_true_lang_default.setup;
polls_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/siswa/polls.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var polls_default = /*#__PURE__*/ _plugin_vue_export_helper_default(polls_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-c7910c56"]]);

export { polls_default as default };
//# sourceMappingURL=polls-BtTO-nNA.mjs.map
