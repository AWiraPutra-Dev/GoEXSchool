import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useOperatorDataStore } from './operator-data-x3YpqlSN.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderTeleport } from 'vue/server-renderer';
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

//#region app/pages/admin/gallery.vue?vue&type=script&setup=true&lang.ts
var gallery_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "gallery",
	__ssrInlineRender: true,
	setup(__props) {
		const op = useOperatorDataStore();
		const showModal = ref(false);
		const selected = ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-472eb836><h1 class="page-title" data-v-472eb836>Galeri Foto</h1><p class="text-[13px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-472eb836>${ssrInterpolate(unref(op).gallery.length)} album foto</p><div class="gallery-grid" data-v-472eb836><!--[-->`);
			ssrRenderList(unref(op).gallery, (g) => {
				_push(`<div class="gallery-card" data-v-472eb836><div class="gallery-thumb" style="${ssrRenderStyle({ background: g.color })}" data-v-472eb836>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-image",
					class: "w-10 h-10 text-white/60"
				}, null, _parent));
				_push(`<span class="gallery-count" data-v-472eb836>${ssrInterpolate(g.imageCount)} foto</span></div><div class="gallery-info" data-v-472eb836><h3 class="gallery-title" data-v-472eb836>${ssrInterpolate(g.title)}</h3><p class="gallery-meta" data-v-472eb836>${ssrInterpolate(g.ekskul)} · ${ssrInterpolate(g.date)}</p></div></div>`);
			});
			_push(`<!--]--></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal) && unref(selected)) {
					_push(`<div class="modal-overlay" data-v-472eb836><div class="modal-content" style="${ssrRenderStyle({ "width": "600px" })}" data-v-472eb836><div class="flex items-center justify-between mb-4" data-v-472eb836><h3 class="text-[18px] font-bold" style="${ssrRenderStyle({ "color": "var(--text-primary)" })}" data-v-472eb836>${ssrInterpolate(unref(selected).title)}</h3><button style="${ssrRenderStyle({
						"background": "none",
						"border": "none",
						"cursor": "pointer",
						"font-size": "20px",
						"color": "var(--text-muted)"
					})}" data-v-472eb836>✕</button></div><div class="gallery-preview-grid" data-v-472eb836><!--[-->`);
					ssrRenderList(6, (i) => {
						_push(`<div class="preview-photo" style="${ssrRenderStyle({ background: unref(selected).color + "40" })}" data-v-472eb836>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-image",
							class: "w-6 h-6 text-white/40"
						}, null, _parent));
						_push(`</div>`);
					});
					_push(`<!--]--></div><p class="text-center text-[13px]" style="${ssrRenderStyle({
						"color": "var(--text-muted)",
						"margin-top": "16px"
					})}" data-v-472eb836>${ssrInterpolate(Math.min(6, unref(selected).imageCount))} dari ${ssrInterpolate(unref(selected).imageCount)} foto</p></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/admin/gallery.vue
var _sfc_setup = gallery_vue_vue_type_script_setup_true_lang_default.setup;
gallery_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/gallery.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var gallery_default = /*#__PURE__*/ _plugin_vue_export_helper_default(gallery_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-472eb836"]]);

export { gallery_default as default };
//# sourceMappingURL=gallery-DGi9WBxT.mjs.map
