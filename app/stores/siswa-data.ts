import { defineStore } from 'pinia'

export interface AttendanceRecord {
  id: string; date: string; ekskul: string; status: string; time: string; notes: string; monthKey?: string
}
export interface Achievement {
  id: string; title: string; description: string; date: string; dateIso?: string; type: 'juara' | 'sertifikat' | 'partisipasi' | 'organisasi'; ekskul: string; ekskulId: string; level: 'sekolah' | 'kecamatan' | 'kota' | 'provinsi' | 'nasional'; proof?: string; studentName?: string; studentClass?: string
}
export interface FeedPost {
  id: string; type: 'announcement' | 'achievement' | 'gallery' | 'poll' | 'schedule'; title: string; content: string; author: string; avatar: string; date: string; likes: number; liked: boolean; comments: Array<{ id: string; user: string; avatar: string; text: string; time: string }>; commentCount: number
}
export interface StudentSchedule {
  [day: string]: Array<{ time: string; date?: string | null; ekskul: string; coach: string; location: string }>
}
export interface SiswaPoll {
  id: string; question: string; options: Array<{ id: string; label: string; votes: number }>; ekskul: string; ekskulLogo?: string | null; endDate: string; active: boolean; myVote: string | null; totalVotes: number
}
export interface SiswaGallery {
  id: string; title: string; ekskul: string; ekskulLogo?: string | null; author?: string | null; date: string; color: string; imageCount: number; previews: string[]
}
export interface BoardTile {
  id: string; type: 'person' | 'image'; name: string; className: string | null; position: string; photoUrl: string | null; imageUrl?: string | null; sortOrder: number
}
export interface BoardGroup {
  id: string; ekskul: string; ekskulLogo?: string | null
  positions: BoardTile[]
}
export interface SiswaNews {
  id: string; title: string; content: string; isPublic: boolean; ekskul: string; ekskulLogo?: string | null; ekskulId: string; author: string; coverImage?: string | null; date: string
}

export const useSiswaDataStore = defineStore('siswaData', {
  state: () => ({
    attendance: [] as AttendanceRecord[],
    achievements: [] as Achievement[],
    feed: [] as FeedPost[],
    mySchedule: {} as StudentSchedule,
    polls: [] as SiswaPoll[],
    gallery: [] as SiswaGallery[],
    articles: [] as any[],
    materials: [] as any[],
    board: [] as BoardGroup[],
    news: [] as SiswaNews[],
    loading: false,
    /** Waktu terakhir data siswa berhasil dimuat (untuk cache antar navigasi) */
    loadedAt: null as number | null,
    feedLoadedAt: null as number | null,
    achievementsLoadedAt: null as number | null,
    articlesLoadedAt: null as number | null,
    materialsLoadedAt: null as number | null,
    boardLoadedAt: null as number | null,
    newsLoadedAt: null as number | null,
  }),

  actions: {
    async fetchArticles(force = false) {
      if (!force && isFresh(this.articlesLoadedAt)) return
      try {
        this.articles = await $fetch<any[]>('/api/siswa/articles')
        this.articlesLoadedAt = Date.now()
      } catch {}
    },

    async fetchMaterials(force = false) {
      if (!force && isFresh(this.materialsLoadedAt)) return
      try {
        this.materials = await $fetch<any[]>('/api/siswa/materials')
        this.materialsLoadedAt = Date.now()
      } catch {}
    },

    async fetchBoard(force = false) {
      if (!force && isFresh(this.boardLoadedAt)) return
      try {
        this.board = await $fetch<BoardGroup[]>('/api/siswa/board')
        this.boardLoadedAt = Date.now()
      } catch {}
    },

    /** Berita yang disetujui admin untuk Event Board — dipakai dashboard siswa. */
    async fetchNews(force = false) {
      if (!force && isFresh(this.newsLoadedAt)) return
      try {
        this.news = await $fetch<SiswaNews[]>('/api/siswa/news')
        this.newsLoadedAt = Date.now()
      } catch {}
    },

    /**
     * Muat semua data siswa. Data di-cache (TTL) sehingga pindah menu tidak
     * memicu fetch ulang — render langsung dari memori. Paksa dengan force=true.
     */
    async fetchAll(force = false) {
      if (!force && isFresh(this.loadedAt)) return
      if (this.loading) return
      this.loading = true
      try {
        const [attendance, achievements, feed, schedule, polls, gallery] = await Promise.all([
          $fetch<AttendanceRecord[]>('/api/siswa/attendance').catch(() => []),
          $fetch<Achievement[]>('/api/siswa/achievements').catch(() => []),
          $fetch<FeedPost[]>('/api/siswa/feed').catch(() => []),
          $fetch<StudentSchedule>('/api/siswa/schedule').catch(() => ({})),
          $fetch<SiswaPoll[]>('/api/siswa/polls').catch(() => []),
          $fetch<SiswaGallery[]>('/api/siswa/gallery').catch(() => []),
        ])
        this.attendance = attendance
        this.achievements = achievements
        this.feed = feed
        this.mySchedule = schedule
        this.polls = polls
        this.gallery = gallery
        this.loadedAt = Date.now()
      } finally {
        this.loading = false
      }
    },

    /**
     * Muat hanya feed komunitas — dipakai halaman monitoring admin
     * (admin tidak punya studentId, jadi endpoint feed yang institution-scoped).
     */
    async fetchFeed(force = false) {
      if (!force && isFresh(this.feedLoadedAt)) return
      try {
        this.feed = await $fetch<FeedPost[]>('/api/siswa/feed')
        this.feedLoadedAt = Date.now()
      } catch {}
    },

    /**
     * Muat hanya portofolio prestasi — dipakai halaman monitoring admin
     * (admin melihat seluruh prestasi di instansi).
     */
    async fetchAchievements(force = false) {
      if (!force && isFresh(this.achievementsLoadedAt)) return
      try {
        this.achievements = await $fetch<Achievement[]>('/api/siswa/achievements')
        this.achievementsLoadedAt = Date.now()
      } catch {}
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

    /** Admin: tambah portofolio prestasi untuk siswa mana pun. */
    async addAchievementAdmin(data: { studentId: string; title: string; description?: string; date: string; type: string; extracurricularId: string; level: string; proof?: string }) {
      const a = await $fetch<Achievement>('/api/admin/achievements', { method: 'POST', body: data })
      this.achievements.unshift(a)
    },

    /** Admin: ubah prestasi siswa mana pun di instansi (endpoint khusus admin). */
    async updateAchievementAdmin(id: string, data: { title?: string; description?: string; date?: string; type?: string; extracurricularId?: string; level?: string; proof?: string }) {
      const updated = await $fetch<Achievement>(`/api/admin/achievements/${id}`, { method: 'PUT', body: data })
      const idx = this.achievements.findIndex(a => a.id === id)
      if (idx >= 0) this.achievements[idx] = updated
    },

    /** Admin: hapus prestasi siswa mana pun di instansi (endpoint khusus admin). */
    async deleteAchievementAdmin(id: string) {
      await $fetch(`/api/admin/achievements/${id}`, { method: 'DELETE' })
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

    async deleteFeedPost(postId: string) {
      await $fetch(`/api/admin/feed/${postId}`, { method: 'DELETE' })
      this.feed = this.feed.filter(p => p.id !== postId)
    },

    async votePoll(pollId: string, pollOptionId: string) {
      await $fetch(`/api/siswa/polls/${pollId}/vote`, { method: 'POST', body: { pollOptionId } })
    },

    // ---- Kalender & Agenda ----
    async fetchCalendar(month: string) {
      return await $fetch<any>(`/api/siswa/calendar?month=${month}`)
    },

    async addAgenda(data: { title: string; description?: string; date: string; timeStart: string; timeEnd?: string; color?: string }) {
      return await $fetch<any>('/api/siswa/calendar', { method: 'POST', body: data })
    },

    async updateAgenda(id: string, data: { title?: string; description?: string; date?: string; timeStart?: string; timeEnd?: string; color?: string }) {
      return await $fetch<any>(`/api/siswa/calendar/${id}`, { method: 'PUT', body: data })
    },

    async deleteAgenda(id: string) {
      await $fetch(`/api/siswa/calendar/${id}`, { method: 'DELETE' })
    },
  },
})
