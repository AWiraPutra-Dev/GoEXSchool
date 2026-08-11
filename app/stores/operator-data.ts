import { defineStore } from 'pinia'

export interface Member {
  id: string; studentId: string; nis: string; name: string; class: string; ekskul: string; ekskulId: string; joinDate: string; status: 'active' | 'inactive'
}
export interface Assessment {
  id: string; student: string; studentId: string; ekskul: string; ekskulId: string; score: number; grade: string; notes: string; date: string
}
export interface ScheduleEntry {
  id: string; day: string; time: string; timeStart: string; timeEnd?: string; ekskul: string; ekskulId: string; coach: string; location: string
}
export interface PollOption {
  id?: string; label: string; votes: number
}
export interface Poll {
  id: string; question: string; options: PollOption[]; ekskul: string; ekskulId: string; endDate: string; active: boolean
}
export interface NewsItem {
  id: string; title: string; content: string; date: string; isPublic: boolean; ekskul: string; ekskulId: string; author: string
}
export interface GalleryItem {
  id: string; title: string; ekskul: string; ekskulId: string; date: string; color: string; imageCount: number
}
export interface AttendanceHistoryItem {
  id: string; date: string; ekskul: string; hadir: number; total: number; status: string
}

export const useOperatorDataStore = defineStore('operatorData', {
  state: () => ({
    members: [] as Member[],
    assessments: [] as Assessment[],
    schedule: [] as ScheduleEntry[],
    attendanceHistory: [] as AttendanceHistoryItem[],
    polls: [] as Poll[],
    news: [] as NewsItem[],
    gallery: [] as GalleryItem[],
    articles: [] as any[],
    materials: [] as any[],
    loading: false,
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const [members, assessments, schedule, polls, news, gallery, attendanceHistory] = await Promise.all([
          $fetch<Member[]>('/api/operator/members'),
          $fetch<Assessment[]>('/api/operator/assessments'),
          $fetch<ScheduleEntry[]>('/api/operator/schedule'),
          $fetch<Poll[]>('/api/operator/polls'),
          $fetch<NewsItem[]>('/api/operator/news'),
          $fetch<GalleryItem[]>('/api/operator/gallery'),
          $fetch<AttendanceHistoryItem[]>('/api/operator/attendance/history').catch(() => []),
        ])
        this.members = members
        this.assessments = assessments
        this.schedule = schedule
        this.polls = polls
        this.news = news
        this.gallery = gallery
        this.attendanceHistory = attendanceHistory
      } finally {
        this.loading = false
      }
    },

    async fetchArticles() {
      try {
        this.articles = await $fetch<any[]>('/api/operator/articles')
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

    async fetchMaterials(ekskulId?: string) {
      try {
        const url = ekskulId ? `/api/operator/materials?ekskulId=${ekskulId}` : '/api/operator/materials'
        this.materials = await $fetch<any[]>(url)
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

    async addAssessment(data: { studentId: string; extracurricularId: string; score: number; notes?: string }) {
      const a = await $fetch<Assessment>('/api/operator/assessments', { method: 'POST', body: data })
      this.assessments.unshift(a)
    },

    async addScheduleEntry(data: { day: string; timeStart: string; timeEnd?: string; coach: string; location: string; extracurricularId: string }) {
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

    async addGallery(data: { title: string; extracurricularId: string; color?: string; imageUrls?: string[] }) {
      const g = await $fetch<GalleryItem>('/api/operator/gallery', { method: 'POST', body: data })
      this.gallery.unshift(g)
    },

    async deleteGallery(id: string) {
      await $fetch(`/api/operator/gallery/${id}`, { method: 'DELETE' })
      this.gallery = this.gallery.filter(g => g.id !== id)
    },

    async updateAssessment(id: string, data: { score?: number; notes?: string }) {
      const a = await $fetch<Assessment>(`/api/operator/assessments/${id}`, { method: 'PUT', body: data })
      const idx = this.assessments.findIndex(as => as.id === id)
      if (idx >= 0) this.assessments[idx] = a
    },

    async deleteAssessment(id: string) {
      await $fetch(`/api/operator/assessments/${id}`, { method: 'DELETE' })
      this.assessments = this.assessments.filter(a => a.id !== id)
    },
  },
})
