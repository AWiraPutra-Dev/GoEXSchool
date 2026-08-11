import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useOperatorDataStore } from './operator-data-x3YpqlSN.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/admin/news.vue?vue&type=script&setup=true&lang.ts
var news_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "news",
	__ssrInlineRender: true,
	setup(__props) {
		const op = useOperatorDataStore();
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-b2937a5a><h1 class="page-title" data-v-b2937a5a>Pengumuman &amp; Berita</h1><p class="text-[13px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-b2937a5a>${ssrInterpolate(unref(op).news.length)} total berita</p><div class="news-list" data-v-b2937a5a><!--[-->`);
			ssrRenderList(unref(op).news, (n) => {
				_push(`<div class="news-card" data-v-b2937a5a><div class="news-top" data-v-b2937a5a><div class="news-meta" data-v-b2937a5a><span class="news-ekskul" data-v-b2937a5a>${ssrInterpolate(n.ekskul)}</span><span class="${ssrRenderClass([n.isPublic ? "badge-public" : "badge-internal", "news-badge"])}" data-v-b2937a5a>${ssrInterpolate(n.isPublic ? "Publik" : "Internal")}</span></div></div><h3 class="news-title" data-v-b2937a5a>${ssrInterpolate(n.title)}</h3><p class="news-content" data-v-b2937a5a>${ssrInterpolate(n.content)}</p><div class="news-footer" data-v-b2937a5a><span data-v-b2937a5a>${ssrInterpolate(n.author)}</span><span data-v-b2937a5a>${ssrInterpolate(n.date)}</span></div></div>`);
			});
			_push(`<!--]-->`);
			if (!unref(op).news.length) _push(`<div class="empty-state" data-v-b2937a5a><p style="${ssrRenderStyle({
				"color": "var(--text-muted)",
				"font-size": "var(--text-sm)"
			})}" data-v-b2937a5a>Belum ada berita.</p></div>`);
			else _push(`<!---->`);
			_push(`</div></div>`);
		};
	}
});
//#endregion
//#region app/pages/admin/news.vue
var _sfc_setup = news_vue_vue_type_script_setup_true_lang_default.setup;
news_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/news.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var news_default = /*#__PURE__*/ _plugin_vue_export_helper_default(news_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-b2937a5a"]]);

export { news_default as default };
//# sourceMappingURL=news-CryfiA-o.mjs.map
