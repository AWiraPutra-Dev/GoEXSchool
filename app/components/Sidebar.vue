<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

interface MenuItem {
  label: string
  icon: string
  to: string
  badge?: string
  section: string
}

const menusByRole: Record<string, MenuItem[]> = {
  admin: [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/admin', section: 'Utama' },
    { label: 'Data Siswa', icon: 'i-lucide-users', to: '/admin/students', section: 'Data Master' },
    { label: 'Data Guru', icon: 'i-lucide-user-check', to: '/admin/teachers', section: 'Data Master' },
    { label: 'Kelas / Rombel', icon: 'i-lucide-school', to: '/admin/classes', section: 'Data Master' },
    { label: 'Ekstrakurikuler', icon: 'i-lucide-shield', to: '/admin/extracurriculars', section: 'Data Master' },
    { label: 'Anggota Ekskul', icon: 'i-lucide-users', to: '/admin/members', section: 'Data Master' },
    { label: 'Jadwal Ekskul', icon: 'i-lucide-calendar', to: '/admin/schedule', section: 'Kegiatan' },
    { label: 'Absensi', icon: 'i-lucide-check-square', to: '/admin/attendance', section: 'Kegiatan' },
    { label: 'Penilaian', icon: 'i-lucide-clipboard-check', to: '/admin/assessments', section: 'Kegiatan' },
    { label: 'Feed Komunitas', icon: 'i-lucide-newspaper', to: '/admin/feed', section: 'Konten' },
    { label: 'Voting', icon: 'i-lucide-vote', to: '/admin/polls', section: 'Konten' },
    { label: 'Pengumuman & Berita', icon: 'i-lucide-megaphone', to: '/admin/news', section: 'Konten' },
    { label: 'Galeri Foto', icon: 'i-lucide-images', to: '/admin/gallery', section: 'Konten' },
    { label: 'Portofolio Prestasi', icon: 'i-lucide-award', to: '/admin/achievements', section: 'Konten' },
    { label: 'User & Privileges', icon: 'i-lucide-user-cog', to: '/admin/users', section: 'Pengaturan' },
    { label: 'Laporan', icon: 'i-lucide-file-bar-chart', to: '/admin/reports', section: 'Pengaturan' },
    { label: 'Pengaturan Instansi', icon: 'i-lucide-settings', to: '/admin/settings', section: 'Pengaturan' }
  ],
  operator: [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/operator', section: 'Utama' },
    { label: 'Absensi QR', icon: 'i-lucide-qr-code', to: '/operator/attendance', section: 'Kegiatan' },
    { label: 'Penilaian', icon: 'i-lucide-clipboard-check', to: '/operator/assessments', section: 'Kegiatan' },
    { label: 'Jadwal Ekskul', icon: 'i-lucide-calendar', to: '/operator/schedule', section: 'Kegiatan' },
    { label: 'Materi Ekskul', icon: 'i-lucide-book-open', to: '/operator/materials', section: 'Kegiatan' },
    { label: 'Anggota Ekskul', icon: 'i-lucide-users', to: '/operator/members', section: 'Data' },
    { label: 'Blog & Artikel', icon: 'i-lucide-file-text', to: '/operator/blog', section: 'Konten' },
    { label: 'Voting', icon: 'i-lucide-vote', to: '/operator/polls', section: 'Konten' },
    { label: 'Pengumuman & Berita', icon: 'i-lucide-megaphone', to: '/operator/news', section: 'Konten' },
    { label: 'Galeri Foto', icon: 'i-lucide-images', to: '/operator/gallery', section: 'Konten' }
  ],
  student: [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/siswa', section: 'Utama' },
    { label: 'Jadwal Saya', icon: 'i-lucide-calendar', to: '/siswa/schedule', section: 'Aktivitas' },
    { label: 'Kehadiran', icon: 'i-lucide-check-square', to: '/siswa/attendance', section: 'Aktivitas' },
    { label: 'Penilaian', icon: 'i-lucide-clipboard-list', to: '/siswa/grades', section: 'Aktivitas' },
    { label: 'Materi Ekskul', icon: 'i-lucide-book-open', to: '/siswa/materials', section: 'Aktivitas' },
    { label: 'Voting', icon: 'i-lucide-vote', to: '/siswa/polls', section: 'Partisipasi' },
    { label: 'Feed Komunitas', icon: 'i-lucide-newspaper', to: '/siswa/feed', section: 'Partisipasi' },
    { label: 'Blog & Artikel', icon: 'i-lucide-file-text', to: '/siswa/blog', section: 'Partisipasi' },
    { label: 'Galeri', icon: 'i-lucide-images', to: '/siswa/gallery', section: 'Partisipasi' },
    { label: 'Portofolio Prestasi', icon: 'i-lucide-award', to: '/siswa/achievements', section: 'Partisipasi' },
    { label: 'Profil Saya', icon: 'i-lucide-user', to: '/siswa/profile', section: 'Akun' }
  ]
}

const menu = computed(() => menusByRole[auth.user?.role ?? 'student'] ?? [])

// Group menu items by section
const menuSections = computed(() => {
  const sections: { name: string; items: MenuItem[] }[] = []
  const grouped = new Map<string, MenuItem[]>()
  
  for (const item of menu.value) {
    if (!grouped.has(item.section)) {
      grouped.set(item.section, [])
    }
    grouped.get(item.section)!.push(item)
  }
  
  for (const [name, items] of grouped) {
    sections.push({ name, items })
  }
  return sections
})

function isActive(item: MenuItem): boolean {
  return route.path === item.to
}

function navigateToPage(path: string) {
  router.push(path)
}
</script>

<template>
  <aside class="sidebar">
    <nav>
      <template v-for="section in menuSections" :key="section.name">
        <div class="menu-section-title">{{ section.name }}</div>
        <template v-for="item in section.items" :key="item.to">
          <a
            :href="item.to"
            class="menu-item"
            :class="{ active: isActive(item) }"
            @click.prevent="navigateToPage(item.to)"
          >
            <Icon :name="item.icon" class="menu-icon" />
            <span>{{ item.label }}</span>
          </a>
        </template>
      </template>
    </nav>

    <!-- Logout -->
    <div class="logout-section">
      <button class="menu-item logout-item" @click="auth.logout()">
        <Icon name="i-lucide-log-out" class="menu-icon" />
        <span>Keluar Aplikasi</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 50px;
  left: 0;
  bottom: 40px;
  width: 260px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-light);
  overflow-y: auto;
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  z-index: 90;
}

.sidebar nav {
  flex: 1;
}

.menu-section-title {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px 20px 8px;
  margin-top: 8px;
  opacity: 0.7;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  font-size: var(--text-base);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  text-decoration: none;
}

.menu-item:hover {
  background: var(--bg-hover);
}

.menu-item:active {
  transform: scale(0.98);
}

.menu-item.active {
  background: var(--bg-active-menu);
  color: var(--text-light);
  font-weight: var(--font-semibold);
  border-left-color: var(--olive-dark);
}

.menu-item.active .menu-icon {
  color: var(--text-light);
}

.menu-icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.logout-section {
  border-top: 1px solid var(--border-light);
  padding-top: 8px;
  margin-top: auto;
}

.logout-item {
  color: var(--text-red) !important;
}

.logout-item .menu-icon {
  color: var(--text-red) !important;
}
</style>
