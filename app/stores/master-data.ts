import { defineStore } from 'pinia'

export interface StudentAccount {
  id: string
  status: 'active' | 'inactive'
}
export interface Student {
  id: string; nis: string; name: string; class: string; gender: string; phone: string | null; accountStatus: 'imported' | 'registered'; account: StudentAccount | null
}
export interface Teacher {
  id: string; nip: string; name: string; subject: string; phone: string | null
}
export interface Ekskul {
  id: string; name: string; teacher?: { name: string } | null; _count?: { members: number }; coach?: string; members: number; quota: number; scheduleInfo: string | null; description: string | null; logoUrl?: string | null
}
export interface AppUser {
  id: string; name: string; username: string; role: string; phone: string | null; email: string | null; status: 'active' | 'inactive'; lastLogin?: string | null; permissions: { permissionId: string }[]; nis?: string | null; class?: string | null; extracurricularId?: string | null; ekskul?: string | null
}

export const useMasterDataStore = defineStore('masterData', {
  state: () => ({
    students: [] as Student[],
    teachers: [] as Teacher[],
    extracurriculars: [] as Ekskul[],
    appUsers: [] as AppUser[],
    loading: false,
    /** Waktu terakhir data master berhasil dimuat (untuk cache antar navigasi) */
    loadedAt: null as number | null
  }),

  getters: {
    totalStudents: (state) => state.students.length,
    totalTeachers: (state) => state.teachers.length,
    totalEkskul: (state) => state.extracurriculars.length,
    totalUsers: (state) => state.appUsers.length,
    activeUsers: (state) => state.appUsers.filter(u => u.status === 'active').length
  },

  actions: {
    /**
     * Muat semua data master. Data di-cache (TTL) sehingga pindah menu tidak
     * memicu fetch ulang — render langsung dari memori. Paksa dengan force=true.
     */
    async fetchAll(force = false) {
      if (!force && isFresh(this.loadedAt)) return
      // Dedup: jangan tumpuk request jika sudah ada yang berjalan.
      if (this.loading) return
      this.loading = true
      try {
        const [students, teachers, ekskuls, users] = await Promise.all([
          $fetch<Student[]>('/api/admin/students'),
          $fetch<Teacher[]>('/api/admin/teachers'),
          $fetch<Ekskul[]>('/api/admin/extracurriculars'),
          $fetch<AppUser[]>('/api/admin/users'),
        ])
        this.students = students
        this.teachers = teachers
        this.extracurriculars = ekskuls.map(e => ({
          ...e,
          coach: e.teacher?.name || '',
          members: e._count?.members || 0,
          schedule: e.scheduleInfo
        }))
        this.appUsers = users
        this.loadedAt = Date.now()
      } finally {
        this.loading = false
      }
    },

    /**
     * Mengambil data referensi bersama (siswa + ekskul) yang boleh diakses
     * SEMUA role — dipakai dropdown operator & siswa (bukan /api/admin/*).
     */
    async fetchReference(force = false) {
      if (!force && isFresh(this.loadedAt)) return
      if (this.loading) return
      this.loading = true
      try {
        const res = await $fetch<{ students: Student[]; extracurriculars: Ekskul[] }>('/api/shared/reference')
        this.students = res.students
        this.extracurriculars = res.extracurriculars.map(e => ({
          ...e,
          coach: e.teacher?.name || '',
          members: e._count?.members || 0,
          schedule: e.scheduleInfo
        }))
        this.applyEkskulScope()
        this.loadedAt = Date.now()
      } catch {
        // Abaikan — data lama tetap dipakai sampai berhasil.
      } finally {
        this.loading = false
      }
    },

    /**
     * Operator ekskul hanya boleh melihat ekskul miliknya — sembunyikan
     * ekskul lain dari dropdown (data master tetap difilter di server).
     */
    applyEkskulScope() {
      const auth = useAuthStore()
      const scope = auth.user?.extracurricular
      if (scope?.id) {
        this.extracurriculars = this.extracurriculars.filter(e => e.id === scope.id)
      }
    },

    async addStudent(data: { name: string; class: string; gender: string; phone?: string }) {
      const s = await $fetch<Student>('/api/admin/students', { method: 'POST', body: data })
      this.students.push(s)
    },

    async updateStudent(id: string, data: { name?: string; class?: string; gender?: string; phone?: string }) {
      const s = await $fetch<Student>(`/api/admin/students/${id}`, { method: 'PUT', body: data })
      const idx = this.students.findIndex(st => st.id === id)
      if (idx >= 0) this.students[idx] = s
    },

    async deleteStudent(id: string) {
      await $fetch(`/api/admin/students/${id}`, { method: 'DELETE' })
      this.students = this.students.filter(s => s.id !== id)
    },

    /** Aktifkan/nonaktifkan akun login siswa (dari halaman Data Siswa). */
    async toggleStudentAccountStatus(studentId: string) {
      const s = this.students.find(st => st.id === studentId)
      if (!s?.account) return
      const newStatus: 'active' | 'inactive' = s.account.status === 'active' ? 'inactive' : 'active'
      await this.updateUser(s.account.id, { status: newStatus })
      s.account.status = newStatus
    },

    /** Reset password akun siswa (hanya bila siswa sudah punya akun). */
    async resetStudentPassword(studentId: string, password?: string) {
      const s = this.students.find(st => st.id === studentId)
      if (!s?.account) throw new Error('Siswa belum memiliki akun login.')
      return await this.resetUserPassword(s.account.id, password)
    },

    async addTeacher(data: { nip: string; name: string; subject?: string; phone?: string }) {
      const t = await $fetch<Teacher>('/api/admin/teachers', { method: 'POST', body: data })
      this.teachers.push(t)
    },

    async updateTeacher(id: string, data: { nip?: string; name?: string; subject?: string; phone?: string }) {
      const t = await $fetch<Teacher>(`/api/admin/teachers/${id}`, { method: 'PUT', body: data })
      const idx = this.teachers.findIndex(tc => tc.id === id)
      if (idx >= 0) this.teachers[idx] = t
    },

    async deleteTeacher(id: string) {
      await $fetch(`/api/admin/teachers/${id}`, { method: 'DELETE' })
      this.teachers = this.teachers.filter(t => t.id !== id)
    },

    /** Import data siswa massal dari file Excel/CSV (template /api/admin/students/template). */
    async importStudents(file: File) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await $fetch<{ success: boolean; count: number; errors: Array<{ row: number; message: string }>; students: Student[] }>('/api/admin/students/import', {
        method: 'POST',
        body: fd,
      })
      this.students.push(...res.students)
      return res
    },

    async addEkskul(data: { name: string; quota?: number; scheduleInfo?: string; description?: string; teacherId?: string; logoUrl?: string | null }) {
      const e = await $fetch<Ekskul>('/api/admin/extracurriculars', { method: 'POST', body: data })
      this.extracurriculars.push({ ...e, coach: e.teacher?.name || '', members: e._count?.members || 0, schedule: e.scheduleInfo })
    },

    async updateEkskul(id: string, data: { name?: string; quota?: number; scheduleInfo?: string; description?: string; teacherId?: string; logoUrl?: string | null }) {
      const e = await $fetch<Ekskul>(`/api/admin/extracurriculars/${id}`, { method: 'PUT', body: data })
      const idx = this.extracurriculars.findIndex(ex => ex.id === id)
      if (idx >= 0) this.extracurriculars[idx] = { ...e, coach: e.teacher?.name || '', members: e._count?.members || 0, schedule: e.scheduleInfo }
    },

    async deleteEkskul(id: string) {
      const res = await $fetch<{ success: boolean; deleted?: number; related?: Array<{ label: string; count: number }> }>(`/api/admin/extracurriculars/${id}`, { method: 'DELETE' })
      this.extracurriculars = this.extracurriculars.filter(e => e.id !== id)
      return res
    },

    async addUser(data: { username: string; password: string; name: string; role: string; phone?: string; email?: string; permissions?: string[]; extracurricularId?: string; nis?: string }) {
      const u = await $fetch<AppUser>('/api/admin/users', { method: 'POST', body: data })
      this.appUsers.push(u)
    },

    /** Import akun user massal dari file Excel (admin/operator/siswa). */
    async importUsers(file: File) {
      const fd = new FormData()
      fd.append('file', file)
      return await $fetch<{ success: boolean; count: number; errors: Array<{ row: number; message: string }> }>('/api/admin/users/import', {
        method: 'POST',
        body: fd,
      })
    },

    async updateUser(id: string, data: { name?: string; phone?: string; email?: string; status?: string; permissions?: string[]; extracurricularId?: string | null }) {
      const u = await $fetch<AppUser>(`/api/admin/users/${id}`, { method: 'PUT', body: data })
      const idx = this.appUsers.findIndex(au => au.id === id)
      if (idx >= 0) this.appUsers[idx] = u
    },

    async toggleUserStatus(id: string) {
      const u = this.appUsers.find(au => au.id === id)
      if (!u) return
      const newStatus = u.status === 'active' ? 'inactive' : 'active'
      await this.updateUser(id, { status: newStatus })
    },

    async deleteUser(id: string) {
      await $fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
      this.appUsers = this.appUsers.filter(u => u.id !== id)
    },

    /** Reset password user (admin). Bila password dikirim, dipakai; jika tidak, server membuat sementara. */
    async resetUserPassword(id: string, password?: string) {
      return await $fetch<{ success: boolean; username: string; password: string }>(`/api/admin/users/${id}/reset-password`, {
        method: 'POST',
        body: { password: password || undefined },
      })
    }
  }
})
