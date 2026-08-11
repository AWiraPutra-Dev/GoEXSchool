import { t as components_default } from './components-w1ngZ8PK.mjs';
import { _ as _plugin_vue_export_helper_default } from '../virtual/entry.mjs';
import { u as useMasterDataStore } from './master-data-CuoK-2mz.mjs';
import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
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

//#region app/pages/admin/users.vue?vue&type=script&setup=true&lang.ts
var users_vue_vue_type_script_setup_true_lang_default = /*@__PURE__*/ defineComponent({
	__name: "users",
	__ssrInlineRender: true,
	setup(__props) {
		const store = useMasterDataStore();
		const allPermissions = [
			{
				id: "dashboard",
				label: "Dashboard",
				icon: "i-lucide-layout-dashboard",
				desc: "Melihat dashboard utama"
			},
			{
				id: "students",
				label: "Data Siswa",
				icon: "i-lucide-users",
				desc: "Mengelola data siswa (CRUD)"
			},
			{
				id: "teachers",
				label: "Data Guru",
				icon: "i-lucide-user-check",
				desc: "Mengelola data guru"
			},
			{
				id: "classes",
				label: "Kelas/Rombel",
				icon: "i-lucide-school",
				desc: "Mengelola kelas"
			},
			{
				id: "extracurriculars",
				label: "Ekskul",
				icon: "i-lucide-shield",
				desc: "Mengelola data ekstrakurikuler"
			},
			{
				id: "users",
				label: "User & Privileges",
				icon: "i-lucide-user-cog",
				desc: "Mengelola user (hanya admin)"
			},
			{
				id: "reports",
				label: "Laporan",
				icon: "i-lucide-file-bar-chart",
				desc: "Membuat dan melihat laporan"
			},
			{
				id: "settings",
				label: "Pengaturan",
				icon: "i-lucide-settings",
				desc: "Mengatur profil instansi"
			},
			{
				id: "attendance",
				label: "Absensi QR",
				icon: "i-lucide-qr-code",
				desc: "Membuat sesi absensi"
			},
			{
				id: "assessments",
				label: "Penilaian",
				icon: "i-lucide-clipboard-check",
				desc: "Input dan kelola nilai"
			},
			{
				id: "schedule",
				label: "Jadwal",
				icon: "i-lucide-calendar",
				desc: "Mengelola jadwal ekskul"
			},
			{
				id: "members",
				label: "Anggota",
				icon: "i-lucide-users",
				desc: "Mengelola anggota ekskul"
			},
			{
				id: "polls",
				label: "Voting",
				icon: "i-lucide-vote",
				desc: "Membuat dan kelola voting"
			},
			{
				id: "news",
				label: "Berita",
				icon: "i-lucide-megaphone",
				desc: "Membuat pengumuman/berita"
			},
			{
				id: "gallery",
				label: "Galeri",
				icon: "i-lucide-images",
				desc: "Upload dan kelola galeri"
			},
			{
				id: "feed",
				label: "Feed",
				icon: "i-lucide-newspaper",
				desc: "Melihat feed komunitas"
			},
			{
				id: "achievements",
				label: "Prestasi",
				icon: "i-lucide-award",
				desc: "Mengelola portofolio prestasi"
			},
			{
				id: "profile",
				label: "Profil",
				icon: "i-lucide-user",
				desc: "Mengelola profil pribadi"
			}
		];
		const search = ref("");
		const showModal = ref(false);
		const editMode = ref(false);
		const saving = ref(false);
		ref(null);
		const form = reactive({
			id: "",
			name: "",
			username: "",
			password: "",
			role: "operator",
			phone: "",
			email: "",
			status: "active",
			permissions: []
		});
		ref(false);
		const filtered = computed(() => store.appUsers.filter((u) => u.name.toLowerCase().includes(search.value.toLowerCase()) || u.username.includes(search.value) || u.role.toLowerCase().includes(search.value.toLowerCase())));
		return (_ctx, _push, _parent, _attrs) => {
			const _component_Icon = components_default;
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))} data-v-59c8854b><div class="flex items-center justify-between" data-v-59c8854b><div data-v-59c8854b><h1 class="page-title" data-v-59c8854b>User &amp; Privileges</h1><p class="text-[13px]" style="${ssrRenderStyle({ "color": "var(--text-secondary)" })}" data-v-59c8854b>${ssrInterpolate(unref(store).appUsers.length)} total user · ${ssrInterpolate(unref(store).activeUsers)} aktif</p></div><button class="btn-primary" data-v-59c8854b>`);
			_push(ssrRenderComponent(_component_Icon, {
				name: "i-lucide-plus",
				class: "w-4 h-4"
			}, null, _parent));
			_push(` Tambah User</button></div><div class="table-card" data-v-59c8854b><div class="table-toolbar" data-v-59c8854b><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Cari nama, username, atau role..." class="search-input" data-v-59c8854b><span class="text-[11px]" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}" data-v-59c8854b>${ssrInterpolate(unref(filtered).length)} dari ${ssrInterpolate(unref(store).appUsers.length)} user</span></div><table class="data-table" data-v-59c8854b><thead data-v-59c8854b><tr data-v-59c8854b><th data-v-59c8854b>Nama</th><th data-v-59c8854b>Username</th><th data-v-59c8854b>Role</th><th data-v-59c8854b>Kontak</th><th data-v-59c8854b>Status</th><th data-v-59c8854b>Akses</th><th class="text-right" data-v-59c8854b>Aksi</th></tr></thead><tbody data-v-59c8854b><!--[-->`);
			ssrRenderList(unref(filtered), (u) => {
				_push(`<tr data-v-59c8854b><td data-v-59c8854b><div class="flex items-center gap-3" data-v-59c8854b><div class="user-avatar" data-v-59c8854b>${ssrInterpolate(u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2))}</div><div data-v-59c8854b><div class="font-semibold text-[13px]" data-v-59c8854b>${ssrInterpolate(u.name)}</div><div class="text-[11px]" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}" data-v-59c8854b>${ssrInterpolate(u.email)}</div></div></div></td><td data-v-59c8854b><span class="nis-code" data-v-59c8854b>${ssrInterpolate(u.username)}</span></td><td data-v-59c8854b><span class="role-tag" data-v-59c8854b>${ssrInterpolate(u.role)}</span></td><td style="${ssrRenderStyle({
					"color": "var(--text-secondary)",
					"font-size": "var(--text-sm)"
				})}" data-v-59c8854b>${ssrInterpolate(u.phone)}</td><td data-v-59c8854b><button class="${ssrRenderClass([u.status === "active" ? "toggle-on" : "toggle-off", "status-toggle"])}" data-v-59c8854b><span class="toggle-dot" data-v-59c8854b></span><span data-v-59c8854b>${ssrInterpolate(u.status === "active" ? "Aktif" : "Nonaktif")}</span></button></td><td data-v-59c8854b><span class="perm-count" data-v-59c8854b>${ssrInterpolate((u.permissions || []).length)} izin</span></td><td class="text-right action-cell" data-v-59c8854b><button class="action-btn" title="Edit Privileges" data-v-59c8854b>🔑</button><button class="action-btn" title="Toggle Status" style="${ssrRenderStyle({ "color": "var(--orange)" })}" data-v-59c8854b>🔄</button></td></tr>`);
			});
			_push(`<!--]-->`);
			if (!unref(filtered).length) _push(`<tr data-v-59c8854b><td colspan="7" class="text-center py-8" style="${ssrRenderStyle({ "color": "var(--text-muted)" })}" data-v-59c8854b>Tidak ada user ditemukan</td></tr>`);
			else _push(`<!---->`);
			_push(`</tbody></table></div>`);
			ssrRenderTeleport(_push, (_push) => {
				if (unref(showModal)) {
					_push(`<div class="modal-overlay" data-v-59c8854b><div class="modal-content modal-lg" data-v-59c8854b><div class="modal-header" data-v-59c8854b><h3 class="modal-title" data-v-59c8854b>${ssrInterpolate(unref(editMode) ? "Edit User" : "Tambah User Baru")}</h3><button class="modal-close" data-v-59c8854b>✕</button></div><form class="space-y-4" data-v-59c8854b><div class="form-row" data-v-59c8854b><div class="form-group" data-v-59c8854b><label data-v-59c8854b>Nama Lengkap</label><input${ssrRenderAttr("value", unref(form).name)} class="form-input" required data-v-59c8854b></div><div class="form-group" data-v-59c8854b><label data-v-59c8854b>Username</label><input${ssrRenderAttr("value", unref(form).username)} class="form-input" required data-v-59c8854b></div></div><div class="form-row" data-v-59c8854b><div class="form-group" data-v-59c8854b><label data-v-59c8854b>Role</label><select class="form-input" data-v-59c8854b><option value="admin" data-v-59c8854b${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "admin") : ssrLooseEqual(unref(form).role, "admin")) ? " selected" : ""}>Admin Sekolah</option><option value="operator" data-v-59c8854b${ssrIncludeBooleanAttr(Array.isArray(unref(form).role) ? ssrLooseContain(unref(form).role, "operator") : ssrLooseEqual(unref(form).role, "operator")) ? " selected" : ""}>Operator</option></select></div><div class="form-group" data-v-59c8854b><label data-v-59c8854b>Status</label><select class="form-input" data-v-59c8854b><option value="active" data-v-59c8854b${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "active") : ssrLooseEqual(unref(form).status, "active")) ? " selected" : ""}>Aktif</option><option value="inactive" data-v-59c8854b${ssrIncludeBooleanAttr(Array.isArray(unref(form).status) ? ssrLooseContain(unref(form).status, "inactive") : ssrLooseEqual(unref(form).status, "inactive")) ? " selected" : ""}>Nonaktif</option></select></div></div>`);
					if (!unref(editMode)) _push(`<div class="form-group" data-v-59c8854b><label data-v-59c8854b>Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" class="form-input" minlength="6" placeholder="Minimal 6 karakter" data-v-59c8854b></div>`);
					else _push(`<!---->`);
					_push(`<div class="form-row" data-v-59c8854b><div class="form-group" data-v-59c8854b><label data-v-59c8854b>Telepon</label><input${ssrRenderAttr("value", unref(form).phone)} class="form-input" data-v-59c8854b></div><div class="form-group" data-v-59c8854b><label data-v-59c8854b>Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" class="form-input" data-v-59c8854b></div></div><div class="privileges-section" data-v-59c8854b><div class="privileges-header" data-v-59c8854b><h4 class="font-semibold text-[14px]" data-v-59c8854b>Hak Akses / Privileges</h4><div class="privileges-actions" data-v-59c8854b><button type="button" class="btn-small" data-v-59c8854b>Pilih Semua</button><button type="button" class="btn-small btn-small-outline" data-v-59c8854b>Hapus Semua</button></div></div><p class="text-[12px]" style="${ssrRenderStyle({
						"color": "var(--text-muted)",
						"margin-bottom": "12px"
					})}" data-v-59c8854b>${ssrInterpolate(unref(form).permissions.length)} dari ${ssrInterpolate(allPermissions.length)} fitur dipilih.</p><div class="permissions-grid" data-v-59c8854b><!--[-->`);
					ssrRenderList(allPermissions, (perm) => {
						_push(`<label class="${ssrRenderClass([{ "perm-selected": unref(form).permissions.includes(perm.id) }, "perm-item"])}" data-v-59c8854b><input type="checkbox"${ssrIncludeBooleanAttr(unref(form).permissions.includes(perm.id)) ? " checked" : ""} class="perm-checkbox" data-v-59c8854b><div class="perm-icon-wrapper" data-v-59c8854b>`);
						_push(ssrRenderComponent(_component_Icon, {
							name: perm.icon,
							class: "w-4 h-4"
						}, null, _parent));
						_push(`</div><div class="perm-text" data-v-59c8854b><span class="perm-label" data-v-59c8854b>${ssrInterpolate(perm.label)}</span><span class="perm-desc" data-v-59c8854b>${ssrInterpolate(perm.desc)}</span></div></label>`);
					});
					_push(`<!--]--></div></div><div class="modal-actions" data-v-59c8854b><button type="button" class="btn-cancel" data-v-59c8854b>Batal</button><button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(saving)) ? " disabled" : ""} data-v-59c8854b>`);
					if (unref(saving)) _push(`<span class="loading-spinner-sm" data-v-59c8854b></span>`);
					else _push(`<span data-v-59c8854b>${ssrInterpolate(unref(editMode) ? "Simpan Perubahan" : "Buat User")}</span>`);
					_push(`</button></div></form></div></div>`);
				} else _push(`<!---->`);
			}, "body", false, _parent);
			_push(`</div>`);
		};
	}
});
//#endregion
//#region app/pages/admin/users.vue
var _sfc_setup = users_vue_vue_type_script_setup_true_lang_default.setup;
users_vue_vue_type_script_setup_true_lang_default.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/users.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var users_default = /*#__PURE__*/ _plugin_vue_export_helper_default(users_vue_vue_type_script_setup_true_lang_default, [["__scopeId", "data-v-59c8854b"]]);

export { users_default as default };
//# sourceMappingURL=users-DY8kTaxn.mjs.map
