import { $ as $fetch$2 } from '../virtual/entry.mjs';
import { defineStore } from 'pinia';

//#region app/stores/auth.ts
function getDefaultAuthState() {
	return {
		user: null,
		institution: null,
		token: null,
		isLoggedIn: false
	};
}
var useAuthStore = defineStore("auth", {
	state: () => {
		return getDefaultAuthState();
	},
	getters: {
		userInitials: (state) => {
			if (!state.user?.name) return "?";
			return state.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
		},
		roleLabel: (state) => {
			return {
				super_admin: "Super Admin",
				admin: "Admin Sekolah",
				operator: "Operator Ekskul",
				student: "Siswa"
			}[state.user?.role ?? ""] ?? "";
		}
	},
	actions: {
		async login(identifier, password, role) {
			const res = await $fetch$2("/api/auth/login", {
				method: "POST",
				body: {
					identifier,
					password,
					role
				}
			});
			this.token = res.token;
			this.user = res.user;
			this.institution = res.institution;
			this.isLoggedIn = true;
		},
		async restoreSession() {},
		logout() {
			this.user = null;
			this.institution = null;
			this.token = null;
			this.isLoggedIn = false;
			(void 0).location.href = "/login";
		}
	}
});

export { useAuthStore as u };
//# sourceMappingURL=auth-aR38ESGJ.mjs.map
