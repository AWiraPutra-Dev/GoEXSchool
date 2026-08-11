import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default, C as ClientOnly, N as NuxtLink } from '../virtual/entry.mjs';
import { u as useAuthStore } from './auth-aR38ESGJ.mjs';
import { u as useOperatorDataStore } from './operator-data-x3YpqlSN.mjs';
import { S as StatCard_default } from './StatCard-CzrDLdoV.mjs';
import { defineComponent, ref, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
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

//#region app/pages/operator/index.vue?vue&type=script&setup=true&lang.ts
var index_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "index",
	__ssrInlineRender: true,
	setup(__props) {
		const auth = useAuthStore();
		const op = useOperatorDataStore();
		const dashboard = ref(null);
		const summary = computed(() => ({
			totalMembers: dashboard.value?.totalMembers ?? op.members.filter((m) => m.status === "active").length,
			activeEkskul: dashboard.value?.activeEkskul ?? [...new Set(op.members.map((m) => m.ekskul))].length,
			attendanceToday: dashboard.value?.attendanceHistory?.[0]?.hadir ?? 67,
			pendingAssessments: dashboard.value?.pendingAssessments ?? op.assessments.length,
			myEkskul: [dashboard.value?.myEkskul].filter(Boolean).join(", ") || "Basket & Paduan Suara",
			todaySchedule: op.schedule.length > 0 ? op.schedule.map((s) => ({
				id: s.id,
				ekskul: s.ekskul,
				time: s.time || `${s.timeStart} - ${s.timeEnd}`,
				location: s.location,
				status: "akan_datang"
			})) : [
				{
					id: 1,
					ekskul: "Basket",
					time: "14.00 - 15.30",
					location: "GOR",
					status: "akan_datang"
				},
				{
					id: 2,
					ekskul: "Paduan Suara",
					time: "14.00 - 15.30",
					location: "Aula",
					status: "akan_datang"
				},
				{
					id: 3,
					ekskul: "Robotik",
					time: "15.30 - 17.00",
					location: "Lab Komputer",
					status: "akan_datang"
				},
				{
					id: 4,
					ekskul: "Pramuka",
					time: "15.30 - 17.00",
					location: "Lapangan",
					status: "akan_datang"
				}
			],
			recentActivity: [
				...dashboard.value?.attendanceHistory?.length ? [{
					id: "a1",
					text: `Absensi ${dashboard.value.attendanceHistory[0].ekskul} — ${dashboard.value.attendanceHistory[0].hadir} hadir dari ${dashboard.value.attendanceHistory[0].total} anggota`,
					time: "Kemarin, 14:05",
					type: "attendance"
				}] : [],
				{
					id: "a2",
					text: `Nilai ${dashboard.value?.pendingAssessments ?? op.assessments.length} siswa diupload`,
					time: "2 hari lalu",
					type: "assessment"
				},
				{
					id: "a3",
					text: `${dashboard.value?.activePolls ?? op.polls.filter((p) => p.active).length} voting aktif`,
					time: "3 hari lalu",
					type: "poll"
				},
				{
					id: "a4",
					text: `${dashboard.value?.galleryCount ?? op.gallery.length} galeri foto tersedia`,
					time: "4 hari lalu",
					type: "gallery"
				}
			]
		}));
		const scheduleIcons = {
			Basket: "i-lucide-circle-dot",
			"Paduan Suara": "i-lucide-music",
			Robotik: "i-lucide-cpu",
			Pramuka: "i-lucide-map",
			KIR: "i-lucide-flask-conical",
			"Seni Tari": "i-lucide-arrow-left-right",
			Futsal: "i-lucide-circle",
			"English Club": "i-lucide-book-open"
		};
		return (_ctx, _push, _parent, _attrs) => {
			const _component_StatCard = StatCard_default;
			const _component_ClientOnly = ClientOnly;
			const _component_Icon = components_default;
			const _component_NuxtLink = NuxtLink;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-page" }, _attrs))} data-v-5f1d3220><div class="welcome-section" data-v-5f1d3220><div data-v-5f1d3220><h1 class="page-title" data-v-5f1d3220>Selamat datang, ${ssrInterpolate(unref(auth).user?.name)}! 👋</h1><p class="text-[13px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-5f1d3220>Anda adalah Operator Ekskul</p></div><div class="header-actions" data-v-5f1d3220><div class="date-badge" data-v-5f1d3220>${ssrInterpolate((/* @__PURE__ */ new Date()).toLocaleDateString("id-ID", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric"
			}))}</div></div></div><div class="stats-grid" data-v-5f1d3220>`);
			_push(ssrRenderComponent(_component_StatCard, {
				label: "Total Anggota",
				value: unref(summary).totalMembers,
				icon: "i-lucide-users",
				color: "var(--teal-dark)"
			}, null, _parent));
			_push(ssrRenderComponent(_component_StatCard, {
				label: "Ekskul Aktif",
				value: unref(summary).activeEkskul,
				icon: "i-lucide-shield",
				color: "var(--teal-mid)"
			}, null, _parent));
			_push(ssrRenderComponent(_component_StatCard, {
				label: "Hadir Hari Ini",
				value: unref(summary).attendanceToday,
				icon: "i-lucide-check-square",
				color: "var(--green-soft)"
			}, null, _parent));
			_push(ssrRenderComponent(_component_StatCard, {
				label: "Nilai Perlu Diisi",
				value: unref(summary).pendingAssessments,
				icon: "i-lucide-clipboard-list",
				color: "var(--red-orange)"
			}, null, _parent));
			_push(`</div><div class="charts-grid" data-v-5f1d3220>`);
			_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
			_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
			_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
			_push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
			_push(`</div><div class="content-grid-2col" data-v-5f1d3220><section class="panel-card" data-v-5f1d3220><div class="panel-header" data-v-5f1d3220><span data-v-5f1d3220>Jadwal Hari Ini</span><span class="panel-count" data-v-5f1d3220>${ssrInterpolate(unref(summary).todaySchedule.length)} sesi</span></div><ul class="panel-list" data-v-5f1d3220><!--[-->`);
			ssrRenderList(unref(summary).todaySchedule, (s) => {
				_push(`<li class="panel-list-item" data-v-5f1d3220><div class="schedule-icon-wrapper" data-v-5f1d3220>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: scheduleIcons[s.ekskul] || "i-lucide-calendar",
					class: "w-5 h-5",
					style: { "color": "var(--olive-primary)" }
				}, null, _parent));
				_push(`</div><div class="flex-1" data-v-5f1d3220><div class="font-semibold text-[13px]" data-v-5f1d3220>${ssrInterpolate(s.ekskul)}</div><div class="text-[11px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-5f1d3220>${ssrInterpolate(s.location)}</div></div><div class="text-right" data-v-5f1d3220><div class="time-badge" data-v-5f1d3220>${ssrInterpolate(s.time)}</div></div></li>`);
			});
			_push(`<!--]-->`);
			if (!unref(summary).todaySchedule.length) {
				_push(`<li class="panel-empty" data-v-5f1d3220>`);
				_push(ssrRenderComponent(_component_Icon, {
					name: "i-lucide-calendar-off",
					class: "w-6 h-6",
					style: { "color": "var(--text-muted)" }
				}, null, _parent));
				_push(`<p data-v-5f1d3220>Tidak ada jadwal hari ini.</p></li>`);
			} else _push(`<!---->`);
			_push(`</ul></section><section class="panel-card" data-v-5f1d3220><div class="panel-header" data-v-5f1d3220><span data-v-5f1d3220>Aktivitas Terbaru</span><span class="panel-count" data-v-5f1d3220>Timeline</span></div><ul class="panel-list" data-v-5f1d3220><!--[-->`);
			ssrRenderList(unref(summary).recentActivity, (a) => {
				_push(`<li class="panel-list-item" data-v-5f1d3220><div class="${ssrRenderClass([`dot-${a.type}`, "activity-dot"])}" data-v-5f1d3220></div><div class="flex-1" data-v-5f1d3220><div class="text-[13px]" data-v-5f1d3220>${ssrInterpolate(a.text)}</div><div class="text-[11px]" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}" data-v-5f1d3220>${ssrInterpolate(a.time)}</div></div></li>`);
			});
			_push(`<!--]--></ul></section></div><section class="quick-actions-card" data-v-5f1d3220><div class="panel-header" data-v-5f1d3220>Aksi Cepat</div><div class="quick-actions-grid" data-v-5f1d3220>`);
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/operator/attendance",
				class: "quick-action-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-qr-code",
							class: "w-5 h-5"
						}, null, _parent, _scopeId));
						_push(`<span data-v-5f1d3220${_scopeId}>Buat QR Absensi</span>`);
					} else return [createVNode(_component_Icon, {
						name: "i-lucide-qr-code",
						class: "w-5 h-5"
					}), createVNode("span", null, "Buat QR Absensi")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/operator/assessments",
				class: "quick-action-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-clipboard-check",
							class: "w-5 h-5"
						}, null, _parent, _scopeId));
						_push(`<span data-v-5f1d3220${_scopeId}>Input Nilai</span>`);
					} else return [createVNode(_component_Icon, {
						name: "i-lucide-clipboard-check",
						class: "w-5 h-5"
					}), createVNode("span", null, "Input Nilai")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/operator/news",
				class: "quick-action-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-megaphone",
							class: "w-5 h-5"
						}, null, _parent, _scopeId));
						_push(`<span data-v-5f1d3220${_scopeId}>Buat Pengumuman</span>`);
					} else return [createVNode(_component_Icon, {
						name: "i-lucide-megaphone",
						class: "w-5 h-5"
					}), createVNode("span", null, "Buat Pengumuman")];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(_component_NuxtLink, {
				to: "/operator/polls",
				class: "quick-action-btn"
			}, {
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(ssrRenderComponent(_component_Icon, {
							name: "i-lucide-vote",
							class: "w-5 h-5"
						}, null, _parent, _scopeId));
						_push(`<span data-v-5f1d3220${_scopeId}>Buat Voting</span>`);
					} else return [createVNode(_component_Icon, {
						name: "i-lucide-vote",
						class: "w-5 h-5"
					}), createVNode("span", null, "Buat Voting")];
				}),
				_: 1
			}, _parent));
			_push(`</div></section></div>`);
		};
	}
});
//#endregion
//#region app/pages/operator/index.vue
var _sfc_setup = index_vue_vue_type_script_setup_true_lang_default.setup;
index_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/operator/index.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var operator_default = /*#__PURE__*/ _plugin_vue_export_helper_default(index_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-5f1d3220"]]);

export { operator_default as default };
//# sourceMappingURL=operator-BfBPsTsu.mjs.map
