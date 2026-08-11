import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useOperatorDataStore } from './operator-data-x3YpqlSN.mjs';
import { u as useMasterDataStore } from './master-data-CuoK-2mz.mjs';
import { defineComponent, ref, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrInterpolate, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/operator/gallery.vue?vue&type=script&setup=true&lang.ts
var gallery_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "gallery",
	__ssrInlineRender: true,
	setup(__props) {
		const op = useOperatorDataStore();
		const admin = useMasterDataStore();
		const showModal = ref(false);
		const showUploadModal = ref(false);
		const selectedGallery = ref(null);
		const saving = ref(false);
		const form = reactive({
			title: "",
			extracurricularId: "",
			color: "#4A9E9E"
		});
		const colors = [
			"#4A9E9E",
			"#7BA87B",
			"#D4C089",
			"#D4956A",
			"#D46A5A",
			"#8B9467"
		];
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-e8450370><div class="flex items-center justify-between" data-v-e8450370><h1 class="page-title" data-v-e8450370>Galeri Foto</h1><button class="btn-primary" data-v-e8450370>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "i-lucide-upload",
				class: "w-4 h-4"
			}, null, _parent));
			_push(` Upload Foto</button></div><div class="gallery-grid" data-v-e8450370><!--[-->`);
			ssrRenderList(unref(op).gallery, (g) => {
				_push(`<div class="gallery-card" data-v-e8450370><div class="gallery-thumb" style="${ssrRenderStyle({ background: g.color })}" data-v-e8450370>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-image",
					class: "w-10 h-10 text-white/60"
				}, null, _parent));
				_push(`<span class="gallery-count" data-v-e8450370>${ssrInterpolate(g.imageCount)} foto</span></div><div class="gallery-info" data-v-e8450370><div class="flex items-start justify-between" data-v-e8450370><div data-v-e8450370><h3 class="gallery-title" data-v-e8450370>${ssrInterpolate(g.title)}</h3><p class="gallery-meta" data-v-e8450370>${ssrInterpolate(g.ekskul)} · ${ssrInterpolate(g.date)}</p></div><button class="gallery-delete-btn" title="Hapus" data-v-e8450370>🗑️</button></div></div></div>`);
			});
			_push(`<!--]--></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal) && unref(selectedGallery)) {
					_push(`<div class="modal-overlay" data-v-e8450370><div class="modal-content" style="${ssrRenderStyle({ "width": "600px" })}" data-v-e8450370><div class="flex items-center justify-between mb-4" data-v-e8450370><h3 class="text-[18px] font-bold" style="${ssrRenderStyle({ "color": "var(--text-primary)" })}" data-v-e8450370>${ssrInterpolate(unref(selectedGallery).title)}</h3><button style="${ssrRenderStyle({
						"background": "none",
						"border": "none",
						"cursor": "pointer",
						"font-size": "20px",
						"color": "var(--text-muted)"
					})}" data-v-e8450370>✕</button></div><div class="gallery-preview-grid" data-v-e8450370><!--[-->`);
					ssrRenderList(6, (i) => {
						_push(`<div class="preview-photo" style="${ssrRenderStyle({ background: unref(selectedGallery).color + "40" })}" data-v-e8450370>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-image",
							class: "w-6 h-6 text-white/40"
						}, null, _parent));
						_push(`</div>`);
					});
					_push(`<!--]--></div><p class="text-center text-[13px]" style="${ssrRenderStyle({
						"color": "var(--text-muted)",
						"margin-top": "16px"
					})}" data-v-e8450370>${ssrInterpolate(Math.min(6, unref(selectedGallery).imageCount))} dari ${ssrInterpolate(unref(selectedGallery).imageCount)} foto</p></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showUploadModal)) {
					_push(`<div class="modal-overlay" data-v-e8450370><div class="modal-content" data-v-e8450370><h3 class="modal-title" data-v-e8450370>Upload Galeri Baru</h3><form class="space-y-3" data-v-e8450370><div class="form-group" data-v-e8450370><label data-v-e8450370>Judul Album</label><input${ssrRenderAttr("value", unref(form).title)} class="form-input" required placeholder="Contoh: Latihan Basket 2026" data-v-e8450370></div><div class="form-group" data-v-e8450370><label data-v-e8450370>Ekskul</label><select class="form-input" required data-v-e8450370><option disabled value="" data-v-e8450370${ssrIncludeBooleanAttr(Array.isArray(unref(form).extracurricularId) ? ssrLooseContain(unref(form).extracurricularId, "") : ssrLooseEqual(unref(form).extracurricularId, "")) ? " selected" : ""}>Pilih Ekskul</option><!--[-->`);
					ssrRenderList(unref(admin).extracurriculars, (e) => {
						_push(`<option${ssrRenderAttr("value", e.id)} data-v-e8450370${ssrIncludeBooleanAttr(Array.isArray(unref(form).extracurricularId) ? ssrLooseContain(unref(form).extracurricularId, e.id) : ssrLooseEqual(unref(form).extracurricularId, e.id)) ? " selected" : ""}>${ssrInterpolate(e.name)}</option>`);
					});
					_push(`<!--]--></select></div><div class="form-group" data-v-e8450370><label data-v-e8450370>Warna Tema</label><div class="color-picker" data-v-e8450370><!--[-->`);
					ssrRenderList(colors, (c) => {
						_push(`<button type="button" class="${ssrRenderClass([{ selected: unref(form).color === c }, "color-swatch"])}" style="${ssrRenderStyle({ background: c })}" data-v-e8450370></button>`);
					});
					_push(`<!--]--></div></div><div class="modal-actions" data-v-e8450370><button type="button" class="btn-cancel" data-v-e8450370>Batal</button><button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-e8450370>${ssrInterpolate(unref(saving) ? "Mengupload..." : "Upload")}</button></div></form></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/operator/gallery.vue
var _sfc_setup = gallery_vue_vue_type_script_setup_true_lang_default.setup;
gallery_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/operator/gallery.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var gallery_default = /*#__PURE__*/ _plugin_vue_export_helper_default(gallery_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-e8450370"]]);

export { gallery_default as default };
//# sourceMappingURL=gallery-Dmc1svAC.mjs.map
