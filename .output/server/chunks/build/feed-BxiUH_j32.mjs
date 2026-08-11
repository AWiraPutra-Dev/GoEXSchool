import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useSiswaDataStore } from './siswa-data-DPedxD4_.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderList, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
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

//#region app/pages/siswa/feed.vue?vue&type=script&setup=true&lang.ts
var feed_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "feed",
	__ssrInlineRender: true,
	setup(__props) {
		const siswa = useSiswaDataStore();
		const newComments = ref({});
		const showComments = ref({});
		const typeIcons = {
			announcement: "i-lucide-megaphone",
			achievement: "i-lucide-award",
			gallery: "i-lucide-image",
			poll: "i-lucide-vote",
			schedule: "i-lucide-calendar"
		};
		const typeColors = {
			announcement: "var(--teal)",
			achievement: "var(--yellow-cream)",
			gallery: "var(--green-soft)",
			poll: "var(--orange)",
			schedule: "var(--olive-primary)"
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-32d62068><h1 class="page-title" data-v-32d62068>Feed Komunitas</h1><p class="text-[13px]" style="${ssrRenderStyle({
				"color": "var(--text-secondary)",
				"margin-top": "-12px"
			})}" data-v-32d62068>Ikuti berita dan aktivitas terbaru dari ekskul kamu</p><div class="feed-list" data-v-32d62068><!--[-->`);
			ssrRenderList(unref(siswa).feed, (post) => {
				_push(`<div class="feed-card" data-v-32d62068><div class="feed-header" data-v-32d62068><div class="feed-author-info" data-v-32d62068><div class="feed-avatar" style="${ssrRenderStyle({ background: typeColors[post.type] })}" data-v-32d62068>${ssrInterpolate(post.avatar)}</div><div data-v-32d62068><div class="feed-author" data-v-32d62068>${ssrInterpolate(post.author)}</div><div class="feed-meta" data-v-32d62068>${ssrInterpolate(post.ekskul)} · ${ssrInterpolate(post.date)}</div></div></div><div class="feed-type-badge" style="${ssrRenderStyle({
					background: typeColors[post.type] + "20",
					color: typeColors[post.type]
				})}" data-v-32d62068>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: typeIcons[post.type],
					class: "w-3.5 h-3.5"
				}, null, _parent));
				_push(`<span data-v-32d62068>${ssrInterpolate(post.type === "announcement" ? "Pengumuman" : post.type === "achievement" ? "Prestasi" : post.type === "gallery" ? "Galeri" : post.type === "poll" ? "Voting" : "Jadwal")}</span></div></div><h3 class="feed-title" data-v-32d62068>${ssrInterpolate(post.title)}</h3><p class="feed-content" data-v-32d62068>${ssrInterpolate(post.content)}</p>`);
				if (post.type === "gallery") {
					_push(`<div class="feed-gallery-preview" data-v-32d62068><!--[-->`);
					ssrRenderList(3, (i) => {
						_push(`<div class="gallery-thumb" style="${ssrRenderStyle({ background: typeColors[post.type] + "30" })}" data-v-32d62068>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-image",
							class: "w-6 h-6",
							style: { color: typeColors[post.type] }
						}, null, _parent));
						_push(`</div>`);
					});
					_push(`<!--]--></div>`);
				} else _push(`<!---->`);
				_push(`<div class="feed-actions" data-v-32d62068><button class="${ssrRenderClass([{ liked: post.liked }, "feed-action-btn"])}" data-v-32d62068>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-heart",
					class: "w-4 h-4",
					style: { color: post.liked ? "var(--red-orange)" : void 0 }
				}, null, _parent));
				_push(`<span data-v-32d62068>${ssrInterpolate(post.likes)} Suka</span></button><button class="feed-action-btn" data-v-32d62068>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-message-circle",
					class: "w-4 h-4"
				}, null, _parent));
				_push(`<span data-v-32d62068>${ssrInterpolate(post.comments.length)} Komentar</span></button><button class="feed-action-btn" data-v-32d62068>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-share-2",
					class: "w-4 h-4"
				}, null, _parent));
				_push(`<span data-v-32d62068>Bagikan</span></button></div>`);
				if (unref(showComments)[post.id]) {
					_push(`<div class="feed-comments" data-v-32d62068><!--[-->`);
					ssrRenderList(post.comments, (c) => {
						_push(`<div class="comment-item" data-v-32d62068><div class="comment-avatar" data-v-32d62068>${ssrInterpolate(c.avatar)}</div><div class="comment-body" data-v-32d62068><div class="comment-header" data-v-32d62068><span class="comment-user" data-v-32d62068>${ssrInterpolate(c.user)}</span><span class="comment-time" data-v-32d62068>${ssrInterpolate(c.time)}</span></div><p class="comment-text" data-v-32d62068>${ssrInterpolate(c.text)}</p></div></div>`);
					});
					_push(`<!--]--><form class="comment-form" data-v-32d62068><input${ssrRenderAttr("value", unref(newComments)[post.id])} type="text" class="comment-input" placeholder="Tulis komentar..." required data-v-32d62068><button type="submit" class="comment-send-btn"${ssrIncludeBooleanAttr(!unref(newComments)[post.id]?.trim()) ? " disabled" : ""} data-v-32d62068>`);
					_push(ssrRenderComponent(_component_Icon, {
						name: "i-lucide-send",
						class: "w-4 h-4"
					}, null, _parent));
					_push(`</button></form></div>`);
				} else _push(`<!---->`);
				_push(`</div>`);
			});
			_push(`<!--]--></div></div>`);
		};
	}
});
//#endregion
//#region app/pages/siswa/feed.vue
var _sfc_setup = feed_vue_vue_type_script_setup_true_lang_default.setup;
feed_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/siswa/feed.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var feed_default = /*#__PURE__*/ _plugin_vue_export_helper_default(feed_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-32d62068"]]);

export { feed_default as default };
//# sourceMappingURL=feed-BxiUH_j32.mjs.map
