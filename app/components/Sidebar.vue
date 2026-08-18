<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()
const ui = useUiStore()

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
    { label: 'Data Pembimbing Ekskul', icon: 'i-lucide-user-check', to: '/admin/teachers', section: 'Data Master' },
    { label: 'Ekstrakurikuler', icon: 'i-lucide-shield', to: '/admin/extracurriculars', section: 'Data Master' },
    { label: 'Anggota Ekskul', icon: 'i-lucide-users', to: '/admin/members', section: 'Data Master' },
    { label: 'Kepengurusan', icon: 'i-lucide-user-cog', to: '/admin/board', section: 'Data Master' },
    { label: 'Jadwal Ekskul', icon: 'i-lucide-calendar', to: '/admin/schedule', section: 'Kegiatan' },
    { label: 'Absensi', icon: 'i-lucide-check-square', to: '/admin/attendance', section: 'Kegiatan' },
    { label: 'Surat Izin', icon: 'i-lucide-file-text', to: '/admin/izin', section: 'Kegiatan' },
    { label: 'Feed Komunitas', icon: 'i-lucide-newspaper', to: '/admin/feed', section: 'Konten' },
    { label: 'Blog & Artikel', icon: 'i-lucide-file-text', to: '/admin/blog', section: 'Konten' },
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
    { label: 'Surat Izin', icon: 'i-lucide-file-text', to: '/operator/izin', section: 'Kegiatan' },
    { label: 'Jadwal Ekskul', icon: 'i-lucide-calendar', to: '/operator/schedule', section: 'Kegiatan' },
    { label: 'Materi Ekskul', icon: 'i-lucide-book-open', to: '/operator/materials', section: 'Kegiatan' },
    { label: 'Anggota Ekskul', icon: 'i-lucide-users', to: '/operator/members', section: 'Data' },
    { label: 'Kepengurusan', icon: 'i-lucide-user-cog', to: '/operator/board', section: 'Data' },
    { label: 'Blog & Artikel', icon: 'i-lucide-file-text', to: '/operator/blog', section: 'Konten' },
    { label: 'Voting', icon: 'i-lucide-vote', to: '/operator/polls', section: 'Konten' },
    { label: 'Pengumuman & Berita', icon: 'i-lucide-megaphone', to: '/operator/news', section: 'Konten' },
    { label: 'Galeri Foto', icon: 'i-lucide-images', to: '/operator/gallery', section: 'Konten' },
    { label: 'Logo Ekskul', icon: 'i-lucide-image', to: '/operator/logo', section: 'Pengaturan' },
    { label: 'Profil Saya', icon: 'i-lucide-user', to: '/operator/profile', section: 'Akun' }
  ],
  student: [
    { label: 'Dashboard', icon: 'i-lucide-layout-dashboard', to: '/siswa', section: 'Utama' },
    { label: 'Jadwal Saya', icon: 'i-lucide-calendar', to: '/siswa/schedule', section: 'Aktivitas' },
    { label: 'Kalender', icon: 'i-lucide-calendar-days', to: '/siswa/calendar', section: 'Aktivitas' },
    { label: 'Kehadiran', icon: 'i-lucide-check-square', to: '/siswa/attendance', section: 'Aktivitas' },
    { label: 'Surat Izin', icon: 'i-lucide-file-text', to: '/siswa/izin', section: 'Aktivitas' },
    { label: 'Materi Ekskul', icon: 'i-lucide-book-open', to: '/siswa/materials', section: 'Aktivitas' },
    { label: 'Voting', icon: 'i-lucide-vote', to: '/siswa/polls', section: 'Partisipasi' },
    { label: 'Feed Komunitas', icon: 'i-lucide-newspaper', to: '/siswa/feed', section: 'Partisipasi' },
    { label: 'Pengumuman & Berita', icon: 'i-lucide-megaphone', to: '/siswa/news', section: 'Partisipasi' },
    { label: 'Blog & Artikel', icon: 'i-lucide-file-text', to: '/siswa/blog', section: 'Partisipasi' },
    { label: 'Galeri', icon: 'i-lucide-images', to: '/siswa/gallery', section: 'Partisipasi' },
    { label: 'Kepengurusan', icon: 'i-lucide-user-cog', to: '/siswa/board', section: 'Partisipasi' },
    { label: 'Portofolio Prestasi', icon: 'i-lucide-award', to: '/siswa/achievements', section: 'Partisipasi' },
    { label: 'Profil Saya', icon: 'i-lucide-user', to: '/siswa/profile', section: 'Akun' }
  ]
}

const menu = computed(() => menusByRole[auth.user?.role ?? 'student'] ?? [])

// Group menu items by section — setiap section menjadi grup dropdown.
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

// ---- Dropdown: anak fitur disembunyikan dulu, muncul saat judul fitur diklik ----
const openSections = ref<string[]>([])

function isOpen(name: string): boolean {
  return openSections.value.includes(name)
}

function toggleSection(name: string) {
  openSections.value = isOpen(name)
    ? openSections.value.filter(s => s !== name)
    : [...openSections.value, name]
}

// Buka otomatis grup yang berisi halaman aktif (saat pertama masuk & saat pindah halaman)
function openActiveSection() {
  const active = menu.value.find(item => isActive(item))
  if (active && !isOpen(active.section)) {
    openSections.value = [...openSections.value, active.section]
  }
}
watch(() => route.path, openActiveSection, { immediate: true })

// Terjemahkan label menu & section lewat kamus i18n.
const menuKeyMap: Record<string, string> = {
  Dashboard: 'menu.dashboard',
  'Data Siswa': 'menu.students',
  'Data Pembimbing Ekskul': 'menu.teachers',
  Ekstrakurikuler: 'menu.extracurriculars',
  'Anggota Ekskul': 'menu.members',
  'Jadwal Ekskul': 'menu.schedule',
  Absensi: 'menu.attendance',
  'Surat Izin': 'menu.izin',
  'Feed Komunitas': 'menu.feed',
  'Blog & Artikel': 'menu.blog',
  Voting: 'menu.polls',
  'Pengumuman & Berita': 'menu.news',
  'Galeri Foto': 'menu.gallery',
  Kepengurusan: 'menu.board',
  'Portofolio Prestasi': 'menu.achievements',
  'User & Privileges': 'menu.users',
  Laporan: 'menu.reports',
  'Pengaturan Instansi': 'menu.settings',
  'Absensi QR': 'menu.attendanceQr',
  'Materi Ekskul': 'menu.materials',
  'Logo Ekskul': 'menu.logo',
  'Jadwal Saya': 'menu.mySchedule',
  Kalender: 'menu.calendar',
  Kehadiran: 'menu.myAttendance',
  Galeri: 'menu.gallery',
  'Profil Saya': 'menu.myProfile',
}
const sectionKeyMap: Record<string, string> = {
  Utama: 'section.main',
  'Data Master': 'section.masterData',
  Kegiatan: 'section.activities',
  Konten: 'section.content',
  Data: 'section.data',
  Partisipasi: 'section.participation',
  Akun: 'section.account',
  Pengaturan: 'section.settings',
}

// Ikon tiap grup (main feature) agar judul grup tampil seperti menu item biasa
const sectionIconMap: Record<string, string> = {
  'Data Master': 'i-lucide-database',
  Kegiatan: 'i-lucide-calendar-days',
  Konten: 'i-lucide-layout-grid',
  Pengaturan: 'i-lucide-settings',
  Data: 'i-lucide-folder-open',
  Partisipasi: 'i-lucide-heart-handshake',
}
const sectionIcon = (name: string) => sectionIconMap[name] ?? 'i-lucide-folder'

const tMenu = (label: string) => ui.t(menuKeyMap[label] ?? label)
const tSection = (name: string) => ui.t(sectionKeyMap[name] ?? name)
</script>

<template>
  <aside class="sidebar">
    <nav>
      <template v-for="section in menuSections" :key="section.name">
        <!-- Grup isi 1 item → tampil langsung sebagai fitur utama -->
        <template v-if="section.items.length === 1">
          <NuxtLink
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            class="menu-item"
            :class="{ active: isActive(item) }"
            :prefetch="true"
          >
            <Icon :name="item.icon" class="menu-icon" />
            <span>{{ tMenu(item.label) }}</span>
          </NuxtLink>
        </template>

        <!-- Grup berisi beberapa fitur → dropdown: judul fitur + anak yang tersembunyi -->
        <div v-else class="menu-group">
          <button
            type="button"
            class="menu-group-header"
            :class="{ open: isOpen(section.name), 'has-active': section.items.some(isActive) }"
            :aria-expanded="isOpen(section.name)"
            @click="toggleSection(section.name)"
          >
            <Icon :name="sectionIcon(section.name)" class="menu-icon" />
            <span class="menu-group-title">{{ tSection(section.name) }}</span>
            <Icon name="i-lucide-chevron-down" class="menu-chevron" />
          </button>

          <Transition name="menu-drop">
            <div v-if="isOpen(section.name)" class="menu-group-items">
              <NuxtLink
                v-for="item in section.items"
                :key="item.to"
                :to="item.to"
                class="menu-item"
                :class="{ active: isActive(item) }"
                :prefetch="true"
              >
                <Icon :name="item.icon" class="menu-icon" />
                <span>{{ tMenu(item.label) }}</span>
              </NuxtLink>
            </div>
          </Transition>
        </div>
      </template>
    </nav>

    <!-- Logout -->
    <div class="logout-section">
      <button class="menu-item logout-item" @click="auth.logout()">
        <Icon name="i-lucide-log-out" class="menu-icon" />
        <span>{{ ui.t('menu.logout') }}</span>
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

:root[dir="rtl"] .sidebar {
  left: auto;
  right: 0;
  border-right: none;
  border-left: 1px solid var(--border-light);
}

.sidebar nav {
  flex: 1;
}

/* ===== Grup dropdown — minimalis, tampil seperti menu item biasa ===== */
.menu-group {
  margin-top: 2px;
}

.menu-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 20px;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--text-primary);
  cursor: pointer;
  background: transparent;
  border: none;
  border-left: 3px solid transparent;
  transition: background 0.2s ease, color 0.2s ease;
}

.menu-group-header:hover {
  background: var(--bg-hover);
}

.menu-group-title {
  flex: 1;
  text-align: left;
}

:root[dir="rtl"] .menu-group-title {
  text-align: right;
}

.menu-group-header.has-active {
  color: var(--accent);
  font-weight: var(--font-semibold);
}

/* Chevron kecil & samar — baru terlihat jelas saat hover/terbuka */
.menu-chevron {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
  opacity: 0.45;
  flex-shrink: 0;
  transition: transform 0.2s ease, opacity 0.2s ease, color 0.2s ease;
}

.menu-group-header:hover .menu-chevron {
  opacity: 1;
}

.menu-group-header.open .menu-chevron {
  transform: rotate(180deg);
  color: var(--accent);
  opacity: 1;
}

.menu-group-items {
  padding: 2px 0 4px;
}

/* Anak fitur menjorok jelas di bawah judul fiturnya */
.menu-group-items .menu-item {
  padding-left: 36px;
}

/* Transisi halus saat buka/tutup dropdown */
.menu-drop-enter-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.menu-drop-leave-active {
  transition: opacity 0.12s ease;
}
.menu-drop-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.menu-drop-leave-to {
  opacity: 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 20px;
  font-size: var(--text-sm);
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

/* Item aktif: highlight lembut (tint) alih-alih blok warna solid — lebih modern & profesional */
.menu-item.active {
  background: var(--accent-soft);
  color: var(--accent);
  font-weight: var(--font-semibold);
  border-left-color: var(--accent);
}

.menu-item.active .menu-icon {
  color: var(--accent);
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
