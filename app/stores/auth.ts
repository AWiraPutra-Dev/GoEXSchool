import { defineStore } from 'pinia'

// Token juga disimpan di cookie agar semua request $fetch (yang binding-nya
// ditangkap di module scope) tetap terautentikasi — browser otomatis mengirim
// cookie pada request same-origin. Server menerima token dari header ATAU cookie.
function setTokenCookie(token: string) {
  if (process.client) {
    // Sinkron dengan masa berlaku JWT (7 hari) agar sesi tidak putus di
    // tengah jalan saat cookie sudah kedaluwarsa tapi token masih valid.
    document.cookie = `eh_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`
  }
}

function clearTokenCookie() {
  if (process.client) {
    document.cookie = 'eh_token=; path=/; max-age=0'
  }
}

export interface AuthUser {
  id: string
  name: string
  role: 'super_admin' | 'admin' | 'operator' | 'student'
  nis?: string
  phone?: string
  avatar?: string
  class?: string
  /** Operator ekskul: ekskul yang dikelola (null = operator umum / bukan operator) */
  extracurricular?: { id: string; name: string } | null
  /** Hak akses tambahan per fitur (lihat app/utils/permissions.ts) */
  permissions?: string[]
}

export interface Institution {
  id: string
  name: string
  npsn?: string | null
  address?: string | null
  phone?: string | null
  email?: string | null
  website?: string | null
  headmaster?: string | null
  activeYear: string
  activeSemester: string
  logo?: string | null
  /** Warna aksen tema (hex) — diatur admin, berlaku untuk semua role */
  themeColor?: string | null
  latitude?: number | null
  longitude?: number | null
  attendanceRadius?: number | null
}

function getDefaultAuthState() {
  return {
    user: null as AuthUser | null,
    institution: null as Institution | null,
    token: null as string | null,
    isLoggedIn: false,
    /** Throttle sinkronisasi instansi (hindari fetch tiap navigasi) */
    lastInstitutionSync: 0
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => {
    if (process.client) {
      try {
        const savedToken = localStorage.getItem('eh_token')
        if (savedToken) {
          // Pastikan cookie token tersedia sejak awal (untuk user yang sudah login)
          setTokenCookie(savedToken)
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
      if (state.user?.role === 'operator' && state.user.extracurricular) {
        return `Operator Ekskul ${state.user.extracurricular.name}`
      }
      return labels[state.user?.role ?? ''] ?? ''
    },
    /** Ekskul yang dikelola operator (null jika bukan operator ekskul) */
    myEkskul: (state) => state.user?.extracurricular ?? null
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
        setTokenCookie(res.token)
      }

      // Prefetch data role di latar belakang agar menu pertama langsung terisi.
      if (process.client) refreshRoleData()
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
          localStorage.setItem('eh_user', JSON.stringify(res.user))
          localStorage.setItem('eh_institution', JSON.stringify(res.institution))
          setTokenCookie(savedToken)
          // Prefetch data role di latar belakang agar navigasi pertama instan.
          refreshRoleData()
        } catch {
          localStorage.removeItem('eh_token')
          localStorage.removeItem('eh_user')
          localStorage.removeItem('eh_institution')
          clearTokenCookie()
          this.token = null
          this.user = null
          this.institution = null
          this.isLoggedIn = false
        }
      }
    },

    /**
     * Mengambil data instansi TERBARU dari server.
     * Dipanggil saat navigasi, saat tab kembali aktif, dan berkala —
     * sehingga perubahan yang dilakukan admin langsung terlihat oleh semua role.
     */
    async refreshInstitution(force = false) {
      if (!this.token) return
      // Throttle: cukup sekali per 30 detik, kecuali dipaksa.
      if (!force && Date.now() - this.lastInstitutionSync < 30_000) return
      try {
        const inst = await $fetch<Institution>('/api/settings')
        this.institution = inst
        this.lastInstitutionSync = Date.now()
        if (process.client) localStorage.setItem('eh_institution', JSON.stringify(inst))
      } catch {
        // Abaikan error sinkronisasi — data lama tetap dipakai sampai berhasil.
      }
    },

    /**
     * Menerapkan data instansi ke store & localStorage secara langsung
     * (dipakai setelah admin menyimpan pengaturan instansi).
     */
    applyInstitution(data: Partial<Institution>) {
      this.institution = { ...(this.institution ?? {}), ...data } as Institution
      if (process.client && this.institution) {
        localStorage.setItem('eh_institution', JSON.stringify(this.institution))
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
        clearTokenCookie()
      }
      window.location.href = '/login'
    }
  }
})
