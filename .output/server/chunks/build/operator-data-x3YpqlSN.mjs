import { $ as $fetch$2 } from '../virtual/entry.mjs';
import { defineStore } from 'pinia';

//#region app/stores/operator-data.ts
var useOperatorDataStore = defineStore("operatorData", {
	state: () => ({
		members: [],
		assessments: [],
		schedule: [],
		attendanceHistory: [],
		polls: [],
		news: [],
		gallery: [],
		loading: false
	}),
	actions: {
		async fetchAll() {
			this.loading = true;
			try {
				const [members, assessments, schedule, polls, news, gallery, attendanceHistory] = await Promise.all([
					$fetch$2("/api/operator/members"),
					$fetch$2("/api/operator/assessments"),
					$fetch$2("/api/operator/schedule"),
					$fetch$2("/api/operator/polls"),
					$fetch$2("/api/operator/news"),
					$fetch$2("/api/operator/gallery"),
					$fetch$2("/api/operator/attendance/history").catch(() => [])
				]);
				this.members = members;
				this.assessments = assessments;
				this.schedule = schedule;
				this.polls = polls;
				this.news = news;
				this.gallery = gallery;
				this.attendanceHistory = attendanceHistory;
			} finally {
				this.loading = false;
			}
		},
		async addMember(data) {
			const m = await $fetch$2("/api/operator/members", {
				method: "POST",
				body: data
			});
			this.members.unshift(m);
		},
		async toggleMemberStatus(id) {
			await $fetch$2(`/api/operator/members/${id}`, { method: "PUT" });
			const m = this.members.find((m) => m.id === id);
			if (m) m.status = m.status === "active" ? "inactive" : "active";
		},
		async deleteMember(id) {
			await $fetch$2(`/api/operator/members/${id}`, { method: "DELETE" });
			this.members = this.members.filter((m) => m.id !== id);
		},
		async addAssessment(data) {
			const a = await $fetch$2("/api/operator/assessments", {
				method: "POST",
				body: data
			});
			this.assessments.unshift(a);
		},
		async addScheduleEntry(data) {
			const s = await $fetch$2("/api/operator/schedule", {
				method: "POST",
				body: data
			});
			this.schedule.push(s);
		},
		async removeScheduleEntry(id) {
			await $fetch$2(`/api/operator/schedule/${id}`, { method: "DELETE" });
			this.schedule = this.schedule.filter((s) => s.id !== id);
		},
		async addPoll(data) {
			const p = await $fetch$2("/api/operator/polls", {
				method: "POST",
				body: data
			});
			this.polls.unshift(p);
		},
		async updatePoll(id) {
			const res = await $fetch$2(`/api/operator/polls/${id}`, { method: "PUT" });
			const p = this.polls.find((p) => p.id === id);
			if (p) p.active = res.active;
		},
		async deletePoll(id) {
			await $fetch$2(`/api/operator/polls/${id}`, { method: "DELETE" });
			this.polls = this.polls.filter((p) => p.id !== id);
		},
		async addNews(data) {
			const n = await $fetch$2("/api/operator/news", {
				method: "POST",
				body: data
			});
			this.news.unshift(n);
		},
		async updateNews(id, data) {
			await $fetch$2(`/api/operator/news/${id}`, {
				method: "PUT",
				body: data
			});
			const idx = this.news.findIndex((n) => n.id === id);
			if (idx >= 0) Object.assign(this.news[idx], data);
		},
		async deleteNews(id) {
			await $fetch$2(`/api/operator/news/${id}`, { method: "DELETE" });
			this.news = this.news.filter((n) => n.id !== id);
		},
		async addGallery(data) {
			const g = await $fetch$2("/api/operator/gallery", {
				method: "POST",
				body: data
			});
			this.gallery.unshift(g);
		},
		async deleteGallery(id) {
			await $fetch$2(`/api/operator/gallery/${id}`, { method: "DELETE" });
			this.gallery = this.gallery.filter((g) => g.id !== id);
		},
		async updateAssessment(id, data) {
			const a = await $fetch$2(`/api/operator/assessments/${id}`, {
				method: "PUT",
				body: data
			});
			const idx = this.assessments.findIndex((as) => as.id === id);
			if (idx >= 0) this.assessments[idx] = a;
		},
		async deleteAssessment(id) {
			await $fetch$2(`/api/operator/assessments/${id}`, { method: "DELETE" });
			this.assessments = this.assessments.filter((a) => a.id !== id);
		}
	}
});

export { useOperatorDataStore as u };
//# sourceMappingURL=operator-data-x3YpqlSN.mjs.map
