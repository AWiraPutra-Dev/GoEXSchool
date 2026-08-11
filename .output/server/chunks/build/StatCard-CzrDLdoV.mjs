import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';

//#region app/components/StatCard.vue?vue&type=script&setup=true&lang.ts
var StatCard_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "StatCard",
	__ssrInlineRender: true,
	props: {
		label: {},
		value: {},
		icon: {},
		color: {}
	},
	setup(__props) {
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({
				class: "stat-card",
				style: { background: __props.color }
			}, _attrs))} data-v-2590e66f><div data-v-2590e66f><p class="stat-value" data-v-2590e66f>${ssrInterpolate(__props.value)}</p><p class="stat-label" data-v-2590e66f>${ssrInterpolate(__props.label)}</p></div>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: __props.icon,
				class: "stat-icon"
			}, null, _parent));
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/components/StatCard.vue
var _sfc_setup = StatCard_vue_vue_type_script_setup_true_lang_default.setup;
StatCard_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/StatCard.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var StatCard_default = /*#__PURE__*/ Object.assign(_plugin_vue_export_helper_default(StatCard_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-2590e66f"]]), { __name: "StatCard" });

export { StatCard_default as S };
//# sourceMappingURL=StatCard-CzrDLdoV.mjs.map
