import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useSiswaDataStore } from './siswa-data-DPedxD4_.mjs';
import { u as useMasterDataStore } from './master-data-CuoK-2mz.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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

//#region app/pages/siswa/achievements.vue?vue&type=script&setup=true&lang.ts
var achievements_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "achievements",
	__ssrInlineRender: true,
	setup(__props) {
		const siswa = useSiswaDataStore();
		const showModal = ref(false);
		const editMode = ref(false);
		const admin = useMasterDataStore();
		const saved = ref(false);
		const form = reactive({
			id: "",
			title: "",
			description: "",
			date: "",
			type: "juara",
			extracurricularId: "",
			level: "sekolah",
			proof: ""
		});
		const filterType = ref("all");
		const filterLevel = ref("all");
		const filteredAchievements = computed(() => {
			let result = siswa.achievements;
			if (filterType.value !== "all") result = result.filter((a) => a.type === filterType.value);
			if (filterLevel.value !== "all") result = result.filter((a) => a.level === filterLevel.value);
			return result;
		});
		const stats = computed(() => ({
			total: siswa.achievements.length,
			juara: siswa.achievements.filter((a) => a.type === "juara").length,
			sertifikat: siswa.achievements.filter((a) => a.type === "sertifikat").length,
			partisipasi: siswa.achievements.filter((a) => a.type === "partisipasi").length
		}));
		const typeLabels = {
			juara: "🥇 Juara",
			sertifikat: "📜 Sertifikat",
			partisipasi: "🤝 Partisipasi",
			organisasi: "👥 Organisasi"
		};
		const levelColors = {
			sekolah: "var(--teal)",
			kecamatan: "var(--teal-mid)",
			kota: "var(--yellow-cream)",
			provinsi: "var(--orange)",
			nasional: "var(--red-orange)"
		};
		const levelLabels = {
			sekolah: "Sekolah",
			kecamatan: "Kecamatan",
			kota: "Kota",
			provinsi: "Provinsi",
			nasional: "Nasional"
		};
		const typeColors = {
			juara: "var(--yellow-cream)",
			sertifikat: "var(--teal)",
			partisipasi: "var(--green-soft)",
			organisasi: "var(--olive-primary)"
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-1260b5b2><div class="flex items-center justify-between" data-v-1260b5b2><div data-v-1260b5b2><h1 class="page-title" data-v-1260b5b2>Portofolio Prestasi</h1><p class="text-[13px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-1260b5b2>Kumpulan pencapaian dan prestasi selama mengikuti ekskul</p></div><button class="btn-primary" data-v-1260b5b2>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "i-lucide-plus",
				class: "w-4 h-4"
			}, null, _parent));
			_push(` Tambah Prestasi</button></div><div class="stats-row" data-v-1260b5b2><div class="stat-mini-card" style="${ssrRenderStyle({ "border-color": "var(--olive-primary)" })}" data-v-1260b5b2><span class="stat-value" style="${ssrRenderStyle({ "color": "var(--olive-primary)" })}" data-v-1260b5b2>${ssrInterpolate(unref(stats).total)}</span><span class="stat-label" data-v-1260b5b2>Total Prestasi</span></div><div class="stat-mini-card" style="${ssrRenderStyle({ "border-color": "var(--yellow-cream)" })}" data-v-1260b5b2><span class="stat-value" style="${ssrRenderStyle({ "color": "var(--yellow-cream)" })}" data-v-1260b5b2>${ssrInterpolate(unref(stats).juara)}</span><span class="stat-label" data-v-1260b5b2>Juara</span></div><div class="stat-mini-card" style="${ssrRenderStyle({ "border-color": "var(--teal)" })}" data-v-1260b5b2><span class="stat-value" style="${ssrRenderStyle({ "color": "var(--teal)" })}" data-v-1260b5b2>${ssrInterpolate(unref(stats).sertifikat)}</span><span class="stat-label" data-v-1260b5b2>Sertifikat</span></div><div class="stat-mini-card" style="${ssrRenderStyle({ "border-color": "var(--green-soft)" })}" data-v-1260b5b2><span class="stat-value" style="${ssrRenderStyle({ "color": "var(--green-soft)" })}" data-v-1260b5b2>${ssrInterpolate(unref(stats).partisipasi)}</span><span class="stat-label" data-v-1260b5b2>Partisipasi</span></div></div><div class="filter-bar" data-v-1260b5b2><div class="filter-group" data-v-1260b5b2><span class="filter-label" data-v-1260b5b2>Jenis:</span><!--[-->`);
			ssrRenderList([
				["all", "Semua"],
				["juara", "🏆 Juara"],
				["sertifikat", "📜 Sertifikat"],
				["partisipasi", "🤝 Partisipasi"]
			], (opt) => {
				_push(`<button class="${ssrRenderClass([{ active: unref(filterType) === opt[0] }, "filter-chip"])}" data-v-1260b5b2>${ssrInterpolate(opt[1])}</button>`);
			});
			_push(`<!--]--></div><div class="filter-group" data-v-1260b5b2><span class="filter-label" data-v-1260b5b2>Tingkat:</span><!--[-->`);
			ssrRenderList([
				["all", "Semua"],
				["sekolah", "Sekolah"],
				["kota", "Kota"],
				["provinsi", "Provinsi"],
				["nasional", "Nasional"]
			], (opt) => {
				_push(`<button class="${ssrRenderClass([{ active: unref(filterLevel) === opt[0] }, "filter-chip"])}" data-v-1260b5b2>${ssrInterpolate(opt[1])}</button>`);
			});
			_push(`<!--]--></div></div><div class="achievements-grid" data-v-1260b5b2><!--[-->`);
			ssrRenderList(unref(filteredAchievements), (a) => {
				_push(`<div class="achievement-card" data-v-1260b5b2><div class="ach-top" data-v-1260b5b2><div class="ach-icon-wrapper" style="${ssrRenderStyle({
					background: typeColors[a.type] + "20",
					color: typeColors[a.type]
				})}" data-v-1260b5b2>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: a.type === "juara" ? "i-lucide-trophy" : a.type === "sertifikat" ? "i-lucide-award" : a.type === "partisipasi" ? "i-lucide-handshake" : "i-lucide-users",
					class: "w-6 h-6"
				}, null, _parent));
				_push(`</div><div class="ach-badges" data-v-1260b5b2><span class="ach-type-badge" style="${ssrRenderStyle({
					background: typeColors[a.type] + "20",
					color: typeColors[a.type]
				})}" data-v-1260b5b2>${ssrInterpolate(typeLabels[a.type])}</span><span class="ach-level-badge" style="${ssrRenderStyle({
					background: levelColors[a.level] + "20",
					color: levelColors[a.level]
				})}" data-v-1260b5b2>${ssrInterpolate(levelLabels[a.level])}</span></div></div><h3 class="ach-title" data-v-1260b5b2>${ssrInterpolate(a.title)}</h3><p class="ach-desc" data-v-1260b5b2>${ssrInterpolate(a.description)}</p><div class="ach-footer" data-v-1260b5b2><span class="ach-ekskul" data-v-1260b5b2>${ssrInterpolate(a.ekskul)}</span><span class="ach-date" data-v-1260b5b2>${ssrInterpolate(a.date)}</span><div class="ach-actions" data-v-1260b5b2><button title="Edit" class="ach-action-btn" data-v-1260b5b2>✏️</button><button title="Hapus" class="ach-action-btn" style="${ssrRenderStyle({ "color": "var(--text-red)" })}" data-v-1260b5b2>🗑️</button></div></div></div>`);
			});
			_push(`<!--]--></div>`);
			if (!unref(filteredAchievements).length) _push(`<div class="empty-state" data-v-1260b5b2>Tidak ada prestasi ditemukan.</div>`);
			else _push(`<!---->`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="modal-overlay" data-v-1260b5b2><div class="modal-content" style="${ssrRenderStyle({ "width": "550px" })}" data-v-1260b5b2><h3 class="modal-title" data-v-1260b5b2>${ssrInterpolate(unref(editMode) ? "Edit Prestasi" : "Tambah Prestasi Baru")}</h3><form class="space-y-3" data-v-1260b5b2><div class="form-group" data-v-1260b5b2><label data-v-1260b5b2>Judul Prestasi</label><input${ssrRenderAttr("value", unref(form).title)} class="form-input" required placeholder="Contoh: Juara 2 Basket Kota Bandung" data-v-1260b5b2></div><div class="form-group" data-v-1260b5b2><label data-v-1260b5b2>Deskripsi</label><textarea class="form-input" rows="2" data-v-1260b5b2>${ssrInterpolate(unref(form).description)}</textarea></div><div class="form-row" data-v-1260b5b2><div class="form-group" data-v-1260b5b2><label data-v-1260b5b2>Tanggal</label><input${ssrRenderAttr("value", unref(form).date)} type="date" class="form-input" required data-v-1260b5b2></div><div class="form-group" data-v-1260b5b2><label data-v-1260b5b2>Ekskul</label><select class="form-input" required data-v-1260b5b2><option disabled value="" data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).extracurricularId) ? ssrLooseContain(unref(form).extracurricularId, "") : ssrLooseEqual(unref(form).extracurricularId, "")) ? " selected" : ""}>Pilih Ekskul</option><!--[-->`);
					ssrRenderList(unref(admin).extracurriculars, (e) => {
						_push(`<option${ssrRenderAttr("value", e.id)} data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).extracurricularId) ? ssrLooseContain(unref(form).extracurricularId, e.id) : ssrLooseEqual(unref(form).extracurricularId, e.id)) ? " selected" : ""}>${ssrInterpolate(e.name)}</option>`);
					});
					_push(`<!--]--></select></div></div><div class="form-row" data-v-1260b5b2><div class="form-group" data-v-1260b5b2><label data-v-1260b5b2>Jenis</label><select class="form-input" data-v-1260b5b2><option value="juara" data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "juara") : ssrLooseEqual(unref(form).type, "juara")) ? " selected" : ""}>🏆 Juara</option><option value="sertifikat" data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "sertifikat") : ssrLooseEqual(unref(form).type, "sertifikat")) ? " selected" : ""}>📜 Sertifikat</option><option value="partisipasi" data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "partisipasi") : ssrLooseEqual(unref(form).type, "partisipasi")) ? " selected" : ""}>🤝 Partisipasi</option><option value="organisasi" data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).type) ? ssrLooseContain(unref(form).type, "organisasi") : ssrLooseEqual(unref(form).type, "organisasi")) ? " selected" : ""}>👥 Organisasi</option></select></div><div class="form-group" data-v-1260b5b2><label data-v-1260b5b2>Tingkat</label><select class="form-input" data-v-1260b5b2><option value="sekolah" data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "sekolah") : ssrLooseEqual(unref(form).level, "sekolah")) ? " selected" : ""}>Sekolah</option><option value="kecamatan" data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "kecamatan") : ssrLooseEqual(unref(form).level, "kecamatan")) ? " selected" : ""}>Kecamatan</option><option value="kota" data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "kota") : ssrLooseEqual(unref(form).level, "kota")) ? " selected" : ""}>Kota</option><option value="provinsi" data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "provinsi") : ssrLooseEqual(unref(form).level, "provinsi")) ? " selected" : ""}>Provinsi</option><option value="nasional" data-v-1260b5b2${ssrIncludeBooleanAttr(Array.isArray(unref(form).level) ? ssrLooseContain(unref(form).level, "nasional") : ssrLooseEqual(unref(form).level, "nasional")) ? " selected" : ""}>Nasional</option></select></div></div><div class="modal-actions" data-v-1260b5b2><button type="button" class="btn-cancel" data-v-1260b5b2>Batal</button><button type="submit" class="btn-primary" data-v-1260b5b2>`);
					if (unref(saved)) _push(ssrRenderComponent(_component_Icon, {
						name: "i-lucide-check",
						class: "w-4 h-4"
					}, null, _parent));
					else _push(`<!---->`);
					_push(` ${ssrInterpolate(unref(saved) ? "Tersimpan!" : unref(editMode) ? "Simpan" : "Tambah")}</button></div></form></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/siswa/achievements.vue
var _sfc_setup = achievements_vue_vue_type_script_setup_true_lang_default.setup;
achievements_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/siswa/achievements.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var achievements_default = /*#__PURE__*/ _plugin_vue_export_helper_default(achievements_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-1260b5b2"]]);

export { achievements_default as default };
//# sourceMappingURL=achievements-DsgtHEI1.mjs.map
