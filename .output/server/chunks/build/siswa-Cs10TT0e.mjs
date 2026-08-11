import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default, C as ClientOnly, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-aR38ESGJ.mjs';
import { u as useSiswaDataStore } from './siswa-data-DPedxD4_.mjs';
import { S as StatCard_default } from './StatCard-CzrDLdoV.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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

//#region app/pages/siswa/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const siswa = useSiswaDataStore();
		const dashboard = ref(null);
		const summary = computed(() => ({
			ekskulCount: dashboard.value?.ekskulCount ?? [...new Set(siswa.attendance.map((a) => a.ekskul))].length,
			attendanceRate: dashboard.value?.attendanceRate ?? (Math.round(siswa.attendance.filter((a) => a.status === "Hadir").length / siswa.attendance.length * 100) || 0),
			achievementCount: dashboard.value?.achievementCount ?? siswa.achievements.length,
			totalSessions: dashboard.value?.totalSessions ?? siswa.attendance.length,
			upcomingSchedule: dashboard.value?.upcoming?.length ? dashboard.value.upcoming : [
				{
					id: 1,
					day: "Senin",
					date: "22 Jul 2026",
					time: "14.00 - 15.30",
					title: "Latihan Basket (GOR)",
					coach: "Ahmad Hidayat",
					status: "akan_datang"
				},
				{
					id: 2,
					day: "Rabu",
					date: "24 Jul 2026",
					time: "14.00 - 15.30",
					title: "Latihan Basket (GOR)",
					coach: "Ahmad Hidayat",
					status: "akan_datang"
				},
				{
					id: 3,
					day: "Kamis",
					date: "25 Jul 2026",
					time: "15.30 - 17.00",
					title: "KIR (Lab IPA)",
					coach: "Dr. Rina Amelia",
					status: "akan_datang"
				}
			],
			recentActivity: [
				{
					id: 1,
					text: "Absensi Basket — Hadir",
					time: "Kemarin, 14:05",
					type: "attendance"
				},
				{
					id: 2,
					text: `Nilai ${siswa.grades.length} ekskul diupdate`,
					time: "2 hari lalu",
					type: "grade"
				},
				{
					id: 3,
					text: `${dashboard.value?.achievementCount ?? siswa.achievements.length} prestasi tercatat`,
					time: "5 hari lalu",
					type: "achievement"
				},
				{
					id: 4,
					text: `${siswa.feed.length} feed komunitas`,
					time: "1 minggu lalu",
					type: "poll"
				}
			]
		}));
		computed(() => ({
			labels: [
				"Hadir",
				"Izin",
				"Alpha"
			],
			datasets: [{
				label: "Total",
				data: [
					siswa.attendance.filter((a) => a.status === "Hadir").length,
					siswa.attendance.filter((a) => a.status === "Izin").length,
					siswa.attendance.filter((a) => a.status === "Alpha").length
				],
				backgroundColor: [
					"#7BA87B",
					"#D4C089",
					"#D46A5A"
				]
			}]
		}));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_StatCard = StatCard_default;
			const _component_ClientOnly = ClientOnly;
			const _component_NuxtLink = NuxtLink;
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-page" }, _attrs))} data-v-95a3745d><div class="welcome-section" data-v-95a3745d><div data-v-95a3745d><h1 class="page-title" data-v-95a3745d>Halo, ${ssrInterpolate(unref(auth).user?.name)}! 👋</h1><p class="text-[13px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-95a3745d>Kelas ${ssrInterpolate(unref(auth).user?.class || "11 IPA 1")} · NIS ${ssrInterpolate(unref(auth).user?.nis || "2025001")}</p></div><div class="header-actions" data-v-95a3745d><div class="date-badge" data-v-95a3745d>${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric"
			}))}</div></div></div><div class="stats-grid" data-v-95a3745d>`);
			_push(ssrRenderComponent(_component_StatCard, {
				label: "Ekskul Diikuti",
				value: unref(summary).ekskulCount,
				icon: "i-lucide-shield",
				color: "var(--teal-dark)"
			}, null, _parent));
			_push(ssrRenderComponent(_component_StatCard, {
				label: "Kehadiran",
				value: `${unref(summary).attendanceRate}%`,
				icon: "i-lucide-check-square",
				color: "var(--teal-mid)"
			}, null, _parent));
			_push(ssrRenderComponent(_component_StatCard, {
				label: "Prestasi",
				value: unref(summary).achievementCount,
				icon: "i-lucide-award",
				color: "var(--yellow-cream)"
			}, null, _parent));
			_push(ssrRenderComponent(_component_StatCard, {
				label: "Total Sesi",
				value: unref(summary).totalSessions,
				icon: "i-lucide-calendar",
				color: "var(--green-soft)"
			}, null, _parent));
			_push(`</div><div class="charts-grid" data-v-95a3745d>`);
			_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
			_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
			_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
			_push(`</div><div class="content-grid-2col" data-v-95a3745d><section class="panel-card" data-v-95a3745d><div class="panel-header" data-v-95a3745d><span data-v-95a3745d>Jadwal Terdekat</span>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/siswa/schedule",
				class: "panel-link"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`Lihat Semua`);
					else return [createTextVNode("Lihat Semua")];
				}),
				_: 1
			}, _parent));
			_push(`</div><ul class="panel-list" data-v-95a3745d><!--[-->`);
			ssrRenderList(unref(summary).upcomingSchedule, (item) => {
				_push(`<li class="panel-list-item" data-v-95a3745d><div class="schedule-date-box" data-v-95a3745d><span class="date-day" data-v-95a3745d>${ssrInterpolate(item.day)}</span><span class="date-num" data-v-95a3745d>${ssrInterpolate((item.date || "").split(" ")[0])}</span></div><div class="flex-1" data-v-95a3745d><div class="font-semibold text-[13px]" data-v-95a3745d>${ssrInterpolate(item.title)}</div><div class="text-[11px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-95a3745d>${ssrInterpolate(item.coach)} · ${ssrInterpolate(item.time)}</div></div><span class="status-badge status-upcoming" data-v-95a3745d>${ssrInterpolate(item.status === "akan_datang" ? "Akan Datang" : "Sekarang")}</span></li>`);
			});
			_push(`<!--]-->`);
			if (!unref(summary).upcomingSchedule.length) {
				_push(`<li class="panel-empty" data-v-95a3745d>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-calendar-off",
					class: "w-6 h-6",
					style: { "color": "var(--text-muted)" }
				}, null, _parent));
				_push(`<p data-v-95a3745d>Tidak ada jadwal mendatang.</p></li>`);
			} else _push(`<!---->`);
			_push(`</ul></section><section class="panel-card" data-v-95a3745d><div class="panel-header" data-v-95a3745d><span data-v-95a3745d>Aktivitas Terbaru</span><span class="panel-count" data-v-95a3745d>Saya</span></div><ul class="panel-list" data-v-95a3745d><!--[-->`);
			ssrRenderList(unref(summary).recentActivity, (a) => {
				_push(`<li class="panel-list-item" data-v-95a3745d><div class="${ssrRenderClass([`act-${a.type}`, "activity-icon-wrapper"])}" data-v-95a3745d>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: a.type === "attendance" ? "i-lucide-check" : a.type === "grade" ? "i-lucide-clipboard-check" : "i-lucide-award",
					class: "w-4 h-4 text-white"
				}, null, _parent));
				_push(`</div><div class="flex-1" data-v-95a3745d><div class="text-[13px]" data-v-95a3745d>${ssrInterpolate(a.text)}</div><div class="text-[11px]" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}" data-v-95a3745d>${ssrInterpolate(a.time)}</div></div></li>`);
			});
			_push(`<!--]--></ul></section></div><section class="quick-actions-card" data-v-95a3745d><div class="panel-header" data-v-95a3745d>Menu Cepat</div><div class="quick-actions-grid" data-v-95a3745d>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/siswa/attendance",
				class: "quick-action-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-qr-code",
							class: "w-5 h-5"
						}, null, _parent, _scopeId));
						_push(`<span data-v-95a3745d${_scopeId}>Scan Absensi</span>`);
					} else return [createVNode(_component_Icon, {
						name: "i-lucide-qr-code",
						class: "w-5 h-5"
					}), createVNode("span", null, "Scan Absensi")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/siswa/grades",
				class: "quick-action-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-clipboard-list",
							class: "w-5 h-5"
						}, null, _parent, _scopeId));
						_push(`<span data-v-95a3745d${_scopeId}>Nilai Saya</span>`);
					} else return [createVNode(_component_Icon, {
						name: "i-lucide-clipboard-list",
						class: "w-5 h-5"
					}), createVNode("span", null, "Nilai Saya")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/siswa/feed",
				class: "quick-action-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-newspaper",
							class: "w-5 h-5"
						}, null, _parent, _scopeId));
						_push(`<span data-v-95a3745d${_scopeId}>Feed Komunitas</span>`);
					} else return [createVNode(_component_Icon, {
						name: "i-lucide-newspaper",
						class: "w-5 h-5"
					}), createVNode("span", null, "Feed Komunitas")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/siswa/achievements",
				class: "quick-action-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-award",
							class: "w-5 h-5"
						}, null, _parent, _scopeId));
						_push(`<span data-v-95a3745d${_scopeId}>Portofolio</span>`);
					} else return [createVNode(_component_Icon, {
						name: "i-lucide-award",
						class: "w-5 h-5"
					}), createVNode("span", null, "Portofolio")];
				}),
				_: 1
			}, _parent));
			_push(`</div></section></div>`);
		};
	}
});
//#endregion
//#region app/pages/siswa/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/siswa/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var siswa_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-95a3745d"]]);

export { siswa_default as default };
//# sourceMappingURL=siswa-Cs10TT0e.mjs.map
