import { defineStore } from 'pinia'

export interface Member {
  id: string; studentId: string; nis: string; name: string; class: string; ekskul: string; ekskulId: string; joinDate: string; status: 'active' | 'inactive'
}
export interface ScheduleEntry {
  id: string; day: string; date?: string | null; time: string; timeStart: string; timeEnd?: string; ekskul: string; ekskulId: string; coach: string; location: string; mandatory?: boolean
  latitude?: number | null; longitude?: number | null; radius?: number | null
  qrDuration?: number | null
  qrActiveFrom?: string | null
  qrActiveUntil?: string | null
}
export interface PollOption {
  id?: string; label: string; votes: number
}
export interface Poll {
  id: string; question: string; options: PollOption[]; ekskul: string; ekskulLogo?: string | null; ekskulId: string; endDate: string; active: boolean
}
export interface NewsItem {
  id: string; title: string; content: string; date: string; isPublic: boolean; ekskul: string; ekskulLogo?: string | null; ekskulId: string; author: string; coverImage?: string | null; displayStatus?: 'none' | 'pending' | 'approved' | 'rejected'
}
export interface GalleryItem {
  id: string; title: string; ekskul: string; ekskulLogo?: string | null; ekskulId: string; date: string; color: string; imageCount: number; author?: string | null
  images?: Array<{ id: string; url: string }>
}
export interface AttendanceHistoryItem {
  id: string; date: string; ekskul: string; hadir: number; total: number; status: string
  records?: Array<{ id: string; student: string; nis: string; class: string; status: string; time: string | null; notes: string | null }>
}
export interface BoardPosition {
  id: string; type: 'person' | 'image'; name: string; className: string | null; position: string; photoUrl: string | null; imageUrl?: string | null; sortOrder: number; ekskulId: string; ekskul: string; ekskulLogo?: string | null
}

export const useOperatorDataStore = defineStore('operatorData', {
  state: () => ({
    members: [] as Member[],
    schedule: [] as ScheduleEntry[],
    attendanceHistory: [] as AttendanceHistoryItem[],
    polls: [] as Poll[],
    news: [] as NewsItem[],
    gallery: [] as GalleryItem[],
    articles: [] as any[],
    materials: [] as any[],
    board: [] as BoardPosition[],
    loading: false,
    /** Waktu terakhir data operator berhasil dimuat (untuk cache antar navigasi) */
    loadedAt: null as number | null,
    articlesLoadedAt: null as number | null,
    materialsLoadedAt: null as number | null,
    boardLoadedAt: null as number | null,
  }),

  actions: {
    /**
     * Muat semua data operator. Data di-cache (TTL) sehingga pindah menu tidak
     * memicu fetch ulang — render langsung dari memori. Paksa dengan force=true.
     */
    async fetchAll(force = false) {
      if (!force && isFresh(this.loadedAt)) return
      if (this.loading) return
      this.loading = true
      try {
        const [members, schedule, polls, news, gallery, attendanceHistory] = await Promise.all([
          $fetch<Member[]>('/api/operator/members'),
          $fetch<ScheduleEntry[]>('/api/operator/schedule'),
          $fetch<Poll[]>('/api/operator/polls'),
          $fetch<NewsItem[]>('/api/operator/news'),
          $fetch<GalleryItem[]>('/api/operator/gallery'),
          $fetch<AttendanceHistoryItem[]>('/api/operator/attendance/history').catch(() => []),
        ])
        this.members = members
        this.schedule = schedule
        this.polls = polls
        this.news = news
        this.gallery = gallery
        this.attendanceHistory = attendanceHistory
        this.loadedAt = Date.now()
      } finally {
        this.loading = false
      }
    },

    /**
     * Muat ulang riwayat absensi saja (ringan) — dipakai polling halaman
     * absensi supaya siswa yang baru scan langsung terlihat (efek buku tamu).
     */
    async refreshAttendance() {
      try {
        this.attendanceHistory = await $fetch<AttendanceHistoryItem[]>('/api/operator/attendance/history')
      } catch {
        // Abaikan — data lama tetap ditampilkan.
      }
    },

    async fetchArticles(force = false) {
      if (!force && isFresh(this.articlesLoadedAt)) return
      try {
        this.articles = await $fetch<any[]>('/api/operator/articles')
        this.articlesLoadedAt = Date.now()
      } catch {}
    },

    async createArticle(data: { title: string; content: string; excerpt?: string; coverImage?: string; category?: string; tags?: string; status?: string }) {
      const article = await $fetch<any>('/api/operator/articles', { method: 'POST', body: data })
      this.articles.unshift(article)
      return article
    },

    async updateArticle(id: string, data: any) {
      await $fetch(`/api/operator/articles/${id}`, { method: 'PUT', body: data })
      const idx = this.articles.findIndex((a: any) => a.id === id)
      if (idx >= 0) Object.assign(this.articles[idx], data)
    },

    async deleteArticle(id: string) {
      await $fetch(`/api/operator/articles/${id}`, { method: 'DELETE' })
      this.articles = this.articles.filter((a: any) => a.id !== id)
    },

    async fetchMaterials(ekskulId?: string, force = false) {
      if (!force && isFresh(this.materialsLoadedAt)) return
      try {
        const url = ekskulId ? `/api/operator/materials?ekskulId=${ekskulId}` : '/api/operator/materials'
        this.materials = await $fetch<any[]>(url)
        this.materialsLoadedAt = Date.now()
      } catch {}
    },

    async createMaterial(data: { title: string; description?: string; fileUrl?: string; fileType?: string; content?: string; extracurricularId: string }) {
      const material = await $fetch<any>('/api/operator/materials', { method: 'POST', body: data })
      this.materials.unshift(material)
      return material
    },

    async deleteMaterial(id: string) {
      await $fetch(`/api/operator/materials/${id}`, { method: 'DELETE' })
      this.materials = this.materials.filter((m: any) => m.id !== id)
    },

    async addMember(data: { studentId: string; extracurricularId: string }) {
      const m = await $fetch<Member>('/api/operator/members', { method: 'POST', body: data })
      this.members.unshift(m)
    },

    async toggleMemberStatus(id: string) {
      await $fetch(`/api/operator/members/${id}`, { method: 'PUT' })
      const m = this.members.find(m => m.id === id)
      if (m) m.status = m.status === 'active' ? 'inactive' : 'active'
    },

    async deleteMember(id: string) {
      await $fetch(`/api/operator/members/${id}`, { method: 'DELETE' })
      this.members = this.members.filter(m => m.id !== id)
    },

    async addScheduleEntry(data: { day: string; date?: string; timeStart: string; timeEnd?: string; coach: string; location: string; extracurricularId: string; mandatory?: boolean; latitude?: number | null; longitude?: number | null; radius?: number | null; qrDuration?: number; qrActiveFrom?: string | null; qrActiveUntil?: string | null }) {
      const s = await $fetch<ScheduleEntry>('/api/operator/schedule', { method: 'POST', body: data })
      this.schedule.push(s)
    },

    async removeScheduleEntry(id: string) {
      await $fetch(`/api/operator/schedule/${id}`, { method: 'DELETE' })
      this.schedule = this.schedule.filter(s => s.id !== id)
    },

    async addPoll(data: { question: string; options: string[]; extracurricularId: string; endDate: string }) {
      const p = await $fetch<Poll>('/api/operator/polls', { method: 'POST', body: data })
      this.polls.unshift(p)
    },

    async updatePoll(id: string) {
      const res = await $fetch<{ active: boolean }>(`/api/operator/polls/${id}`, { method: 'PUT' })
      const p = this.polls.find(p => p.id === id)
      if (p) p.active = res.active
    },

    async deletePoll(id: string) {
      await $fetch(`/api/operator/polls/${id}`, { method: 'DELETE' })
      this.polls = this.polls.filter(p => p.id !== id)
    },

    async addNews(data: { title: string; content: string; isPublic: boolean; extracurricularId: string; author: string }) {
      const n = await $fetch<NewsItem>('/api/operator/news', { method: 'POST', body: data })
      this.news.unshift(n)
    },

    async updateNews(id: string, data: { title?: string; content?: string; isPublic?: boolean; extracurricularId?: string; author?: string }) {
      await $fetch(`/api/operator/news/${id}`, { method: 'PUT', body: data })
      const idx = this.news.findIndex(n => n.id === id)
      if (idx >= 0) Object.assign(this.news[idx], data)
    },

    async deleteNews(id: string) {
      await $fetch(`/api/operator/news/${id}`, { method: 'DELETE' })
      this.news = this.news.filter(n => n.id !== id)
    },

    /** Operator mengajukan berita agar tampil di Event Board siswa (menunggu persetujuan admin). */
    async requestNewsDisplay(id: string) {
      const res = await $fetch<{ displayStatus: string }>(`/api/operator/news/${id}`, { method: 'PUT', body: { displayStatus: 'pending' } })
      const n = this.news.find(n => n.id === id)
      if (n) n.displayStatus = res.displayStatus as any
    },

    /** Operator menarik pengajuan tampil. */
    async withdrawNewsDisplay(id: string) {
      const res = await $fetch<{ displayStatus: string }>(`/api/operator/news/${id}`, { method: 'PUT', body: { displayStatus: 'none' } })
      const n = this.news.find(n => n.id === id)
      if (n) n.displayStatus = res.displayStatus as any
    },

    /** Admin menyetujui / menolak / membatalkan tampil berita (Event Board siswa). */
    async setNewsDisplay(id: string, displayStatus: 'none' | 'pending' | 'approved' | 'rejected') {
      await $fetch(`/api/admin/news/${id}`, { method: 'PUT', body: { displayStatus } })
      const n = this.news.find(n => n.id === id)
      if (n) n.displayStatus = displayStatus
    },

    async addGallery(data: { title: string; extracurricularId: string; color?: string; imageUrls?: string[] }) {
      const g = await $fetch<GalleryItem>('/api/operator/gallery', { method: 'POST', body: data })
      this.gallery.unshift(g)
    },

    async deleteGallery(id: string) {
      await $fetch(`/api/operator/gallery/${id}`, { method: 'DELETE' })
      this.gallery = this.gallery.filter(g => g.id !== id)
    },

    // ---- Kepengurusan / struktur organisasi ekskul ----
    async fetchBoard(force = false) {
      if (!force && isFresh(this.boardLoadedAt)) return
      try {
        this.board = await $fetch<BoardPosition[]>('/api/operator/board')
        this.boardLoadedAt = Date.now()
      } catch {}
    },

    async addBoardPosition(data: { type?: 'person' | 'image'; name?: string; className?: string | null; position?: string; photoUrl?: string | null; imageUrl?: string | null; sortOrder?: number; extracurricularId: string }) {
      const p = await $fetch<BoardPosition>('/api/operator/board', { method: 'POST', body: data })
      this.board.push(p)
      this.board.sort((a, b) => a.sortOrder - b.sortOrder)
    },

    async updateBoardPosition(id: string, data: { type?: 'person' | 'image'; name?: string; className?: string | null; position?: string; photoUrl?: string | null; imageUrl?: string | null; sortOrder?: number }) {
      const p = await $fetch<BoardPosition>(`/api/operator/board/${id}`, { method: 'PUT', body: data })
      const idx = this.board.findIndex(b => b.id === id)
      if (idx >= 0) this.board[idx] = p
      this.board.sort((a, b) => a.sortOrder - b.sortOrder)
    },

    async deleteBoardPosition(id: string) {
      await $fetch(`/api/operator/board/${id}`, { method: 'DELETE' })
      this.board = this.board.filter(b => b.id !== id)
    },

  },
})
