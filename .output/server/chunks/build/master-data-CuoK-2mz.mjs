import { $ as $fetch$2 } from '../virtual/entry.mjs';
import { defineStore } from 'pinia';

//#region app/stores/master-data.ts
var useMasterDataStore = defineStore("masterData", {
	state: () => ({
		students: [],
		teachers: [],
		classes: [],
		extracurriculars: [],
		appUsers: [],
		loading: false
	}),
	getters: {
		totalStudents: (state) => state.students.length,
		totalTeachers: (state) => state.teachers.length,
		totalClasses: (state) => state.classes.length,
		totalEkskul: (state) => state.extracurriculars.length,
		totalUsers: (state) => state.appUsers.length,
		activeUsers: (state) => state.appUsers.filter((u) => u.status === "active").length
	},
	actions: {
		async fetchAll() {
			this.loading = true;
			try {
				const [students, teachers, classes, ekskuls, users] = await Promise.all([
					$fetch$2("/api/admin/students"),
					$fetch$2("/api/admin/teachers"),
					$fetch$2("/api/admin/classes"),
					$fetch$2("/api/admin/extracurriculars"),
					$fetch$2("/api/admin/users")
				]);
				this.students = students;
				this.teachers = teachers;
				this.classes = classes;
				this.extracurriculars = ekskuls.map((e) => ({
					...e,
					coach: e.teacher?.name || "",
					members: e._count?.members || 0,
					schedule: e.scheduleInfo
				}));
				this.appUsers = users;
			} finally {
				this.loading = false;
			}
		},
		async addStudent(data) {
			const s = await $fetch$2("/api/admin/students", {
				method: "POST",
				body: data
			});
			this.students.push(s);
		},
		async updateStudent(id, data) {
			const s = await $fetch$2(`/api/admin/students/${id}`, {
				method: "PUT",
				body: data
			});
			const idx = this.students.findIndex((st) => st.id === id);
			if (idx >= 0) this.students[idx] = s;
		},
		async deleteStudent(id) {
			await $fetch$2(`/api/admin/students/${id}`, { method: "DELETE" });
			this.students = this.students.filter((s) => s.id !== id);
		},
		async addTeacher(data) {
			const t = await $fetch$2("/api/admin/teachers", {
				method: "POST",
				body: data
			});
			this.teachers.push(t);
		},
		async updateTeacher(id, data) {
			const t = await $fetch$2(`/api/admin/teachers/${id}`, {
				method: "PUT",
				body: data
			});
			const idx = this.teachers.findIndex((tc) => tc.id === id);
			if (idx >= 0) this.teachers[idx] = t;
		},
		async deleteTeacher(id) {
			await $fetch$2(`/api/admin/teachers/${id}`, { method: "DELETE" });
			this.teachers = this.teachers.filter((t) => t.id !== id);
		},
		async addClass(data) {
			const c = await $fetch$2("/api/admin/classes", {
				method: "POST",
				body: data
			});
			this.classes.push(c);
		},
		async updateClass(id, data) {
			const c = await $fetch$2(`/api/admin/classes/${id}`, {
				method: "PUT",
				body: data
			});
			const idx = this.classes.findIndex((cl) => cl.id === id);
			if (idx >= 0) this.classes[idx] = c;
		},
		async deleteClass(id) {
			await $fetch$2(`/api/admin/classes/${id}`, { method: "DELETE" });
			this.classes = this.classes.filter((c) => c.id !== id);
		},
		async importStudents(students) {
			const res = await $fetch$2("/api/admin/students/import", {
				method: "POST",
				body: { students }
			});
			this.students.push(...res.students);
			return res.count;
		},
		async addEkskul(data) {
			const e = await $fetch$2("/api/admin/extracurriculars", {
				method: "POST",
				body: data
			});
			this.extracurriculars.push({
				...e,
				coach: e.teacher?.name || "",
				members: e._count?.members || 0,
				schedule: e.scheduleInfo
			});
		},
		async updateEkskul(id, data) {
			const e = await $fetch$2(`/api/admin/extracurriculars/${id}`, {
				method: "PUT",
				body: data
			});
			const idx = this.extracurriculars.findIndex((ex) => ex.id === id);
			if (idx >= 0) this.extracurriculars[idx] = {
				...e,
				coach: e.teacher?.name || "",
				members: e._count?.members || 0,
				schedule: e.scheduleInfo
			};
		},
		async deleteEkskul(id) {
			await $fetch$2(`/api/admin/extracurriculars/${id}`, { method: "DELETE" });
			this.extracurriculars = this.extracurriculars.filter((e) => e.id !== id);
		},
		async addUser(data) {
			const u = await $fetch$2("/api/admin/users", {
				method: "POST",
				body: data
			});
			this.appUsers.push(u);
		},
		async updateUser(id, data) {
			const u = await $fetch$2(`/api/admin/users/${id}`, {
				method: "PUT",
				body: data
			});
			const idx = this.appUsers.findIndex((au) => au.id === id);
			if (idx >= 0) this.appUsers[idx] = u;
		},
		async toggleUserStatus(id) {
			const u = this.appUsers.find((au) => au.id === id);
			if (!u) return;
			const newStatus = u.status === "active" ? "inactive" : "active";
			await this.updateUser(id, { status: newStatus });
		},
		async deleteUser(id) {
			await $fetch$2(`/api/admin/users/${id}`, { method: "DELETE" });
			this.appUsers = this.appUsers.filter((u) => u.id !== id);
		}
	}
});

export { useMasterDataStore as u };
//# sourceMappingURL=master-data-CuoK-2mz.mjs.map
