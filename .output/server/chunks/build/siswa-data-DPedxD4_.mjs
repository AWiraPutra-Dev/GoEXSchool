import { $ as $fetch$2 } from '../virtual/entry.mjs';
import { defineStore } from 'pinia';

//#region app/stores/siswa-data.ts
var useSiswaDataStore = defineStore("siswaData", {
	state: () => ({
		grades: [],
		attendance: [],
		achievements: [],
		feed: [],
		mySchedule: {},
		polls: [],
		gallery: [],
		loading: false
	}),
	actions: {
		async fetchAll() {
			this.loading = true;
			try {
				const [grades, attendance, achievements, feed, schedule, polls, gallery] = await Promise.all([
					$fetch$2("/api/siswa/grades").catch(() => []),
					$fetch$2("/api/siswa/attendance").catch(() => []),
					$fetch$2("/api/siswa/achievements").catch(() => []),
					$fetch$2("/api/siswa/feed").catch(() => []),
					$fetch$2("/api/siswa/schedule").catch(() => ({})),
					$fetch$2("/api/siswa/polls").catch(() => []),
					$fetch$2("/api/siswa/gallery").catch(() => [])
				]);
				this.grades = grades;
				this.attendance = attendance;
				this.achievements = achievements;
				this.feed = feed;
				this.mySchedule = schedule;
				this.polls = polls;
				this.gallery = gallery;
			} finally {
				this.loading = false;
			}
		},
		async addAchievement(data) {
			const a = await $fetch$2("/api/siswa/achievements", {
				method: "POST",
				body: data
			});
			this.achievements.unshift(a);
		},
		async updateAchievement(id, data) {
			await $fetch$2(`/api/siswa/achievements/${id}`, {
				method: "PUT",
				body: data
			});
			const idx = this.achievements.findIndex((a) => a.id === id);
			if (idx >= 0) Object.assign(this.achievements[idx], data);
		},
		async deleteAchievement(id) {
			await $fetch$2(`/api/siswa/achievements/${id}`, { method: "DELETE" });
			this.achievements = this.achievements.filter((a) => a.id !== id);
		},
		async toggleLike(postId) {
			const res = await $fetch$2(`/api/siswa/feed/${postId}/like`, { method: "POST" });
			const post = this.feed.find((p) => p.id === postId);
			if (post) {
				post.liked = res.liked;
				post.likes += res.liked ? 1 : -1;
			}
		},
		async addComment(postId, text) {
			const comment = await $fetch$2(`/api/siswa/feed/${postId}/comment`, {
				method: "POST",
				body: { text }
			});
			const post = this.feed.find((p) => p.id === postId);
			if (post) post.comments.push(comment);
		},
		async votePoll(pollId, pollOptionId) {
			await $fetch$2(`/api/siswa/polls/${pollId}/vote`, {
				method: "POST",
				body: { pollOptionId }
			});
		}
	}
});

export { useSiswaDataStore as u };
//# sourceMappingURL=siswa-data-DPedxD4_.mjs.map
