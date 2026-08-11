import { defineStore } from 'pinia'

export interface AuthUser {
  id: string
  name: string
  role: 'super_admin' | 'admin' | 'operator' | 'student'
  nis?: string
  phone?: string
  avatar?: string
  class?: string
}

export interface Institution {
  id: string
  name: string
  address?: string
  activeYear: string
  activeSemester: string
  logo?: string
}

function getDefaultAuthState() {
  return {
    user: null as AuthUser | null,
    institution: null as Institution | null,
    token: null as string | null,
    isLoggedIn: false
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    if (process.client) {
      try {
        const savedToken = localStorage.getItem('eh_token')
        if (savedToken) {
          return { ...getDefaultAuthState(), token: savedToken }
        }
      } catch {}
    }
    return getDefaultAuthState()
  },

  getters: {
    userInitials: (state) => {
      if (!state.user?.name) return '?'
      return state.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    roleLabel: (state) => {
      const labels: Record<string, string> = {
        super_admin: 'Super Admin',
        admin: 'Admin Sekolah',
        operator: 'Operator Ekskul',
        student: 'Siswa'
      }
      return labels[state.user?.role ?? ''] ?? ''
    }
  },

  actions: {
    async login(identifier: string, password: string, role: 'admin' | 'operator' | 'student') {
      const res = await $fetch<{ token: string; user: AuthUser; institution: Institution }>('/api/auth/login', {
        method: 'POST',
        body: { identifier, password, role }
      })

      this.token = res.token
      this.user = res.user
      this.institution = res.institution
      this.isLoggedIn = true

      if (process.client) {
        localStorage.setItem('eh_token', res.token)
        localStorage.setItem('eh_user', JSON.stringify(res.user))
        localStorage.setItem('eh_institution', JSON.stringify(res.institution))
      }
    },

    async restoreSession() {
      if (process.client) {
        const savedToken = localStorage.getItem('eh_token')
        if (!savedToken) return

        try {
          const res = await $fetch<{ user: AuthUser; institution: Institution }>('/api/auth/me', {
            headers: { authorization: `Bearer ${savedToken}` }
          })
          this.token = savedToken
          this.user = res.user
          this.institution = res.institution
          this.isLoggedIn = true
        } catch {
          localStorage.removeItem('eh_token')
          localStorage.removeItem('eh_user')
          localStorage.removeItem('eh_institution')
          this.token = null
          this.user = null
          this.institution = null
          this.isLoggedIn = false
        }
      }
    },

    logout() {
      this.user = null
      this.institution = null
      this.token = null
      this.isLoggedIn = false
      if (process.client) {
        localStorage.removeItem('eh_token')
        localStorage.removeItem('eh_user')
        localStorage.removeItem('eh_institution')
      }
      window.location.href = '/login'
    }
  }
})
