import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useSiswaDataStore } from './siswa-data-DPedxD4_.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderTeleport } from 'vue/server-renderer';
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

//#region app/pages/siswa/gallery.vue?vue&type=script&setup=true&lang.ts
var gallery_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "gallery",
	__ssrInlineRender: true,
	setup(__props) {
		const siswa = useSiswaDataStore();
		const showModal = ref(false);
		const selected = ref(null);
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-f29d6271><h1 class="page-title" data-v-f29d6271>Galeri Kegiatan</h1><div class="gallery-grid" data-v-f29d6271><!--[-->`);
			ssrRenderList(unref(siswa).gallery, (g) => {
				_push(`<div class="gallery-card" data-v-f29d6271><div class="gallery-thumb" style="${ssrRenderStyle({ background: g.color })}" data-v-f29d6271>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-image",
					class: "w-10 h-10 text-white/60"
				}, null, _parent));
				_push(`<span class="gallery-count" data-v-f29d6271>${ssrInterpolate(g.imageCount)} foto</span></div><div class="gallery-info" data-v-f29d6271><h3 class="gallery-title" data-v-f29d6271>${ssrInterpolate(g.title)}</h3><p class="gallery-meta" data-v-f29d6271>${ssrInterpolate(g.ekskul)} · ${ssrInterpolate(g.date)}</p></div></div>`);
			});
			_push(`<!--]--></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal) && unref(selected)) {
					_push(`<div class="modal-overlay" data-v-f29d6271><div class="modal-content" style="${ssrRenderStyle({ "width": "600px" })}" data-v-f29d6271><div class="flex items-center justify-between mb-4" data-v-f29d6271><h3 class="text-[18px] font-bold" style="${ssrRenderStyle({ "color": "var(--text-primary)" })}" data-v-f29d6271>${ssrInterpolate(unref(selected).title)}</h3><button style="${ssrRenderStyle({
						"background": "none",
						"border": "none",
						"cursor": "pointer",
						"font-size": "20px",
						"color": "var(--text-muted)"
					})}" data-v-f29d6271>✕</button></div><div class="gallery-preview-grid" data-v-f29d6271><!--[-->`);
					ssrRenderList(unref(selected).previews, (img, i) => {
						_push(`<div class="preview-photo" style="${ssrRenderStyle({ background: unref(selected).color + "40" })}" data-v-f29d6271>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-image",
							class: "w-6 h-6 text-white/40"
						}, null, _parent));
						_push(`</div>`);
					});
					_push(`<!--]--></div><p class="text-center text-[13px]" style="${ssrRenderStyle({
						"color": "var(--text-muted)",
						"margin-top": "16px"
					})}" data-v-f29d6271>${ssrInterpolate(Math.min(unref(selected).previews.length || unref(selected).imageCount, unref(selected).imageCount))} dari ${ssrInterpolate(unref(selected).imageCount)} foto</p></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/siswa/gallery.vue
var _sfc_setup = gallery_vue_vue_type_script_setup_true_lang_default.setup;
gallery_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/siswa/gallery.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var gallery_default = /*#__PURE__*/ _plugin_vue_export_helper_default(gallery_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-f29d6271"]]);

export { gallery_default as default };
//# sourceMappingURL=gallery-CY34-o0y2.mjs.map
