import { defineStore } from 'pinia'

export interface Student {
  id: string; nis: string; name: string; class: string; gender: string; phone: string | null; accountStatus: 'imported' | 'registered'
}
export interface Teacher {
  id: string; nip: string; name: string; subject: string; phone: string | null
}
export interface ClassItem {
  id: string; name: string; grade: string; major: string; studentCount: number; homeroom: string | null
}
export interface Ekskul {
  id: string; name: string; teacher?: { name: string } | null; _count?: { members: number }; coach?: string; members: number; quota: number; scheduleInfo: string | null; description: string | null
}
export interface AppUser {
  id: string; name: string; username: string; role: string; phone: string | null; email: string | null; status: 'active' | 'inactive'; permissions: { permissionId: string }[]
}

export const useMasterDataStore = defineStore('masterData', {
  state: () => ({
    students: [] as Student[],
    teachers: [] as Teacher[],
    classes: [] as ClassItem[],
    extracurriculars: [] as Ekskul[],
    appUsers: [] as AppUser[],
    loading: false
  }),

  getters: {
    totalStudents: (state) => state.students.length,
    totalTeachers: (state) => state.teachers.length,
    totalClasses: (state) => state.classes.length,
    totalEkskul: (state) => state.extracurriculars.length,
    totalUsers: (state) => state.appUsers.length,
    activeUsers: (state) => state.appUsers.filter(u => u.status === 'active').length
  },

  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const [students, teachers, classes, ekskuls, users] = await Promise.all([
          $fetch<Student[]>('/api/admin/students'),
          $fetch<Teacher[]>('/api/admin/teachers'),
          $fetch<ClassItem[]>('/api/admin/classes'),
          $fetch<Ekskul[]>('/api/admin/extracurriculars'),
          $fetch<AppUser[]>('/api/admin/users'),
        ])
        this.students = students
        this.teachers = teachers
        this.classes = classes
        this.extracurriculars = ekskuls.map(e => ({
          ...e,
          coach: e.teacher?.name || '',
          members: e._count?.members || 0,
          schedule: e.scheduleInfo
        }))
        this.appUsers = users
      } finally {
        this.loading = false
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

    async addClass(data: { name: string; grade: string; major?: string; homeroom?: string }) {
      const c = await $fetch<ClassItem>('/api/admin/classes', { method: 'POST', body: data })
      this.classes.push(c)
    },

    async updateClass(id: string, data: { name?: string; grade?: string; major?: string; homeroom?: string }) {
      const c = await $fetch<ClassItem>(`/api/admin/classes/${id}`, { method: 'PUT', body: data })
      const idx = this.classes.findIndex(cl => cl.id === id)
      if (idx >= 0) this.classes[idx] = c
    },

    async deleteClass(id: string) {
      await $fetch(`/api/admin/classes/${id}`, { method: 'DELETE' })
      this.classes = this.classes.filter(c => c.id !== id)
    },

    async importStudents(students: Array<{ name: string; class: string; gender: string; phone?: string }>) {
      const res = await $fetch<{ success: boolean; count: number; students: Student[] }>('/api/admin/students/import', { method: 'POST', body: { students } })
      this.students.push(...res.students)
      return res.count
    },

    async addEkskul(data: { name: string; quota?: number; scheduleInfo?: string; description?: string; teacherId?: string }) {
      const e = await $fetch<Ekskul>('/api/admin/extracurriculars', { method: 'POST', body: data })
      this.extracurriculars.push({ ...e, coach: e.teacher?.name || '', members: e._count?.members || 0, schedule: e.scheduleInfo })
    },

    async updateEkskul(id: string, data: { name?: string; quota?: number; scheduleInfo?: string; description?: string; teacherId?: string }) {
      const e = await $fetch<Ekskul>(`/api/admin/extracurriculars/${id}`, { method: 'PUT', body: data })
      const idx = this.extracurriculars.findIndex(ex => ex.id === id)
      if (idx >= 0) this.extracurriculars[idx] = { ...e, coach: e.teacher?.name || '', members: e._count?.members || 0, schedule: e.scheduleInfo }
    },

    async deleteEkskul(id: string) {
      await $fetch(`/api/admin/extracurriculars/${id}`, { method: 'DELETE' })
      this.extracurriculars = this.extracurriculars.filter(e => e.id !== id)
    },

    async addUser(data: { username: string; password: string; name: string; role: string; phone?: string; email?: string; permissions?: string[] }) {
      const u = await $fetch<AppUser>('/api/admin/users', { method: 'POST', body: data })
      this.appUsers.push(u)
    },

    async updateUser(id: string, data: { name?: string; phone?: string; email?: string; status?: string; permissions?: string[] }) {
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
    }
  }
})
