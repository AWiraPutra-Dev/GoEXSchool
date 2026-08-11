import { defineStore } from 'pinia'

export interface GradeItem {
  id: string; ekskul: string; semester: string; score: number; grade: string; notes: string; date: string
}
export interface AttendanceRecord {
  id: string; date: string; ekskul: string; status: string; time: string; notes: string
}
export interface Achievement {
  id: string; title: string; description: string; date: string; type: 'juara' | 'sertifikat' | 'partisipasi' | 'organisasi'; ekskul: string; ekskulId: string; level: 'sekolah' | 'kecamatan' | 'kota' | 'provinsi' | 'nasional'; proof?: string
}
export interface FeedPost {
  id: string; type: 'announcement' | 'achievement' | 'gallery' | 'poll' | 'schedule'; title: string; content: string; author: string; avatar: string; date: string; likes: number; liked: boolean; comments: Array<{ id: string; user: string; avatar: string; text: string; time: string }>; commentCount: number
}
export interface StudentSchedule {
  [day: string]: Array<{ time: string; ekskul: string; coach: string; location: string }>
}
export interface SiswaPoll {
  id: string; question: string; options: Array<{ id: string; label: string; votes: number }>; ekskul: string; endDate: string; active: boolean; myVote: string | null; totalVotes: number
}
export interface SiswaGallery {
  id: string; title: string; ekskul: string; date: string; color: string; imageCount: number; previews: string[]
}

export const useSiswaDataStore = defineStore('siswaData', {
  state: () => ({
    grades: [] as GradeItem[],
    attendance: [] as AttendanceRecord[],
    achievements: [] as Achievement[],
    feed: [] as FeedPost[],
    mySchedule: {} as StudentSchedule,
    polls: [] as SiswaPoll[],
    gallery: [] as SiswaGallery[],
    articles: [] as any[],
    materials: [] as any[],
    loading: false,
  }),

  actions: {
    async fetchArticles() {
      try {
        this.articles = await $fetch<any[]>('/api/siswa/articles')
      } catch {}
    },

    async fetchMaterials() {
      try {
        this.materials = await $fetch<any[]>('/api/siswa/materials')
      } catch {}
    },

    async fetchAll() {
      this.loading = true
      try {
        const [grades, attendance, achievements, feed, schedule, polls, gallery] = await Promise.all([
          $fetch<GradeItem[]>('/api/siswa/grades').catch(() => []),
          $fetch<AttendanceRecord[]>('/api/siswa/attendance').catch(() => []),
          $fetch<Achievement[]>('/api/siswa/achievements').catch(() => []),
          $fetch<FeedPost[]>('/api/siswa/feed').catch(() => []),
          $fetch<StudentSchedule>('/api/siswa/schedule').catch(() => ({})),
          $fetch<SiswaPoll[]>('/api/siswa/polls').catch(() => []),
          $fetch<SiswaGallery[]>('/api/siswa/gallery').catch(() => []),
        ])
        this.grades = grades
        this.attendance = attendance
        this.achievements = achievements
        this.feed = feed
        this.mySchedule = schedule
        this.polls = polls
        this.gallery = gallery
      } finally {
        this.loading = false
      }
    },

    async addAchievement(data: { title: string; description?: string; date: string; type: string; extracurricularId: string; level: string; proof?: string }) {
      const a = await $fetch<Achievement>('/api/siswa/achievements', { method: 'POST', body: data })
      this.achievements.unshift(a)
    },

    async updateAchievement(id: string, data: { title?: string; description?: string; date?: string; type?: string; extracurricularId?: string; level?: string; proof?: string }) {
      await $fetch(`/api/siswa/achievements/${id}`, { method: 'PUT', body: data })
      const idx = this.achievements.findIndex(a => a.id === id)
      if (idx >= 0) Object.assign(this.achievements[idx], data)
    },

    async deleteAchievement(id: string) {
      await $fetch(`/api/siswa/achievements/${id}`, { method: 'DELETE' })
      this.achievements = this.achievements.filter(a => a.id !== id)
    },

    async toggleLike(postId: string) {
      const res = await $fetch<{ liked: boolean }>(`/api/siswa/feed/${postId}/like`, { method: 'POST' })
      const post = this.feed.find(p => p.id === postId)
      if (post) {
        post.liked = res.liked
        post.likes += res.liked ? 1 : -1
      }
    },

    async addComment(postId: string, text: string) {
      const comment = await $fetch(`/api/siswa/feed/${postId}/comment`, { method: 'POST', body: { text } })
      const post = this.feed.find(p => p.id === postId)
      if (post) post.comments.push(comment)
    },

    async votePoll(pollId: string, pollOptionId: string) {
      await $fetch(`/api/siswa/polls/${pollId}/vote`, { method: 'POST', body: { pollOptionId } })
    },
  },
})
