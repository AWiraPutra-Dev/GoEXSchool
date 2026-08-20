<script setup lang="ts">
const auth = useAuthStore()
const ui = useUiStore()

// Real-time clock — mengikuti zona waktu sekolah (WIB/WITA/WIT)
const now = ref(new Date())
let timer: ReturnType<typeof setInterval>
onMounted(() => { timer = setInterval(() => (now.value = new Date()), 1000) })
onUnmounted(() => clearInterval(timer))

const schoolZone = computed(() => getSchoolZone(auth.institution))
const clock = computed(() => schoolClock(now.value, auth.institution))

// ---- Notifikasi (semua role) ----
const notifications = ref<any[]>([])
const unreadCount = ref(0)
const showNotif = ref(false)
let notifTimer: ReturnType<typeof setInterval>

const typeIcon: Record<string, string> = {
  feed: 'i-lucide-newspaper',
  achievement: 'i-lucide-award',
  schedule: 'i-lucide-calendar',
  poll: 'i-lucide-vote',
  news: 'i-lucide-megaphone',
}
const typeColor: Record<string, string> = {
  feed: 'var(--teal-mid)',
  achievement: 'var(--yellow-cream)',
  schedule: 'var(--olive-primary)',
  poll: 'var(--orange)',
  news: 'var(--red-orange)',
}

async function loadNotifications() {
  if (!auth.isLoggedIn) return
  try {
    const res = await $fetch<{ unread: number; list: any[] }>('/api/siswa/notifications')
    notifications.value = res.list
    unreadCount.value = res.unread
  } catch {
    // Abaikan — beranda utama tetap jalan.
  }
}

async function markAllRead() {
  try {
    await $fetch('/api/siswa/notifications/read', { method: 'POST', body: {} })
    unreadCount.value = 0
    notifications.value.forEach(n => (n.read = true))
  } catch {}
}

function toggleNotif() {
  showNotif.value = !showNotif.value
  if (showNotif.value) loadNotifications()
}

function goToNotif(n: any) {
  if (!n.read) {
    $fetch('/api/siswa/notifications/read', { method: 'POST', body: { id: n.id } }).catch(() => {})
    n.read = true
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }
  showNotif.value = false
  if (n.link) navigateTo(n.link)
}

onMounted(() => {
  loadNotifications()
  notifTimer = setInterval(loadNotifications, 30_000)
})
onUnmounted(() => clearInterval(notifTimer))
</script>

<template>
  <header class="top-bar">
    <!-- Garis sidebar: garis vertikal yang menyambung dari sidebar ke atas,
         tembus kedua baris header (abu + putih). -->
    <div class="sidebar-divider"></div>

    <!-- Logo sekolah + nama sekolah — nempel langsung di kanan garis sidebar,
         positioned absolute agar tepat bersisian dengan garis vertikal. -->
    <div class="school-brand">
      <div class="school-logo">
        <img v-if="auth.institution?.logo" :src="auth.institution.logo" class="school-logo-img" alt="Logo Sekolah" />
        <Icon v-else name="i-lucide-school" class="w-5 h-5" style="color: var(--text-secondary);" />
      </div>
      <div class="school-title">{{ auth.institution?.name ?? 'StudentBase' }}</div>
    </div>

    <!-- ===== Baris 1 (abu): info sistem + aksi global ===== -->
    <div class="tb-top">
      <div class="sys-info">
        <Icon name="i-lucide-shield-check" class="sys-info-icon" />
        <span class="sys-text">{{ ui.t('topbar.tagline') }}</span>
      </div>

      <div class="sys-actions">
        <!-- Jam sekolah -->
        <span class="clock" :title="`Zona waktu: ${schoolZone}`">
          <Icon name="i-lucide-clock" class="w-4 h-4" />
          {{ clock }}
          <span class="clock-zone">{{ schoolZone }}</span>
        </span>

        <!-- Notifikasi -->
        <div class="notif-wrap">
          <button class="notif-btn" :class="{ 'notif-open': showNotif }" @click="toggleNotif" :title="ui.t('topbar.notifications')">
            <Icon name="i-lucide-bell" class="w-4 h-4" />
            <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
          </button>

          <div v-if="showNotif" class="notif-dropdown" @click.stop>
            <div class="notif-header">
              <span>{{ ui.t('topbar.notifications') }}</span>
              <button v-if="unreadCount > 0" class="notif-mark-all" @click="markAllRead">{{ ui.t('topbar.markAllRead') }}</button>
            </div>
            <div class="notif-list">
              <button
                v-for="n in notifications"
                :key="n.id"
                class="notif-item"
                :class="{ unread: !n.read }"
                @click="goToNotif(n)"
              >
                <div class="notif-icon" :style="{ background: typeColor[n.type] + '22', color: typeColor[n.type] }">
                  <Icon :name="typeIcon[n.type] || 'i-lucide-bell'" class="w-4 h-4" />
                </div>
                <div class="notif-text">
                  <div class="notif-title">{{ n.title }}</div>
                  <div v-if="n.body" class="notif-body">{{ n.body }}</div>
                  <div class="notif-time">{{ formatSchoolTime(new Date(n.createdAt), auth.institution, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }}</div>
                </div>
                <span v-if="!n.read" class="notif-dot"></span>
              </button>
              <div v-if="!notifications.length" class="notif-empty">
                <Icon name="i-lucide-bell-off" class="w-6 h-6" style="color: var(--text-muted);" />
                <p>{{ ui.t('topbar.noNotifications') }}</p>
              </div>
            </div>
          </div>
        </div>

        <ThemeToggle />
        <LangSwitcher />

        <!-- Logout -->
        <button class="icon-btn icon-btn-danger" :title="ui.t('topbar.logout')" @click="auth.logout()">
          <Icon name="i-lucide-door-open" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- ===== Baris 2 (putih): profil user + brand sekolah + meta aplikasi ===== -->
    <div class="tb-bottom">
      <!-- Profil user di ujung kiri (sejajar dengan sidebar) -->
      <div class="user-info">
        <div class="user-avatar">
          <img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="Foto profil" class="user-avatar-img" />
          <span v-else>{{ auth.userInitials }}</span>
        </div>
        <div class="user-text">
          <div class="user-name">{{ auth.user?.name ?? 'User' }}</div>
          <div class="user-role">{{ auth.roleLabel }}</div>
        </div>
      </div>

      <!-- Spacer selebar sidebar (260px) + garis (1px) — menjaga alignment konten kanan -->
      <div class="sidebar-spacer"></div>

      <!-- Kanan: meta aplikasi + brand -->
      <div class="tb-bottom-right">
        <div class="app-meta">
          <span class="meta-label">{{ ui.t('topbar.appLabel') }}</span>
          <span class="meta-value">{{ ui.t('app.tagline') }}</span>
        </div>
        <div class="meta-sep"></div>
        <div class="powered-by">
          <span class="meta-label">{{ ui.t('topbar.poweredBy') }}</span>
          <img src="/logos/studentbase.svg" alt="StudentBase" class="app-logo" />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Header dua baris: baris atas abu (info sistem + aksi), baris bawah putih
   (profil user + brand sekolah) dengan garis aksen tema di ujung bawah. */
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  background: var(--bg-header);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

/* ===== Baris atas (abu) ===== */
.tb-top {
  height: 36px;
  background: var(--bg-hover);
  border-bottom: 1px solid var(--red-orange);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 14px;
}

.sys-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.sys-info-icon {
  width: 16px;
  height: 16px;
  color: var(--accent);
  flex-shrink: 0;
}

.sys-text {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sys-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

/* Tombol ikon (baris atas) — compact, tanpa border-radius, seamless */
.icon-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}
.icon-btn:hover { background: rgba(0,0,0,0.04); }
.icon-btn-danger { color: var(--red-orange); }
.icon-btn-danger:hover { background: rgba(239,68,68,0.1); color: var(--red-orange-dark); }


/* ===== Baris bawah (putih) ===== */
.tb-bottom {
  position: relative;
  height: 56px;
  background: var(--bg-header);
  display: flex;
  align-items: center;
  /* Garis aksen tipis di ujung bawah header — mengikuti warna tema sekolah */
  box-shadow: inset 0 -2px 0 var(--accent);
}

/* Garis sidebar — hanya di baris putih (tb-bottom), tidak tembus ke baris
   abu (tb-top). Garis merah horizontal jadi batas atasnya. */
.sidebar-divider {
  position: absolute;
  top: 36px;
  bottom: 0;
  left: 260px;
  width: 1px;
  background: var(--border-light);
  pointer-events: none;
  z-index: 1;
}

/* Profil user (foto + nama + role) di ujung kiri paling atas — sejajar
   dengan sidebar, duduk di area selebar sidebar (260px) sebelum garis. */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-shrink: 0;
  padding-inline-start: 14px;
  max-width: 246px;
}

.user-text {
  min-width: 0;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--border-light);
  background: var(--olive-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  flex-shrink: 0;
  overflow: hidden;
}
.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.user-role {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-weight: var(--font-normal);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

/* Spacer selebar sidebar — mendorong brand ke kanan tepat setelah garis. */
.sidebar-spacer {
  width: 260px;
  flex-shrink: 0;
}

/* Brand sekolah (logo + nama) — positioned absolute, nempel langsung di
   sebelah kanan garis sidebar divider. Vertically centered di tb-bottom. */
.school-brand {
  position: absolute;
  left: 261px; /* 260px sidebar + 1px divider = tepat nempel di kanan garis */
  top: 36px; /* mulai dari bawah tb-top (36px) */
  height: 56px; /* sama dengan tinggi tb-bottom */
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding-left: 10px;
  z-index: 2;
}

/* Logo asli — tanpa lingkaran, tanpa latar, tanpa border: logo yang sudah
   dihapus background-nya menyatu langsung dengan warna bar. */
.school-logo {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}
.school-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: transparent;
}

.school-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

/* ===== Kanan baris bawah: meta aplikasi + brand ===== */
.tb-bottom-right {
  margin-inline-start: auto;
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  padding-inline-end: 16px;
}

.app-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1px;
  min-width: 0;
}

.meta-label {
  font-size: 12px;
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.meta-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

.meta-sep {
  width: 1px;
  height: 30px;
  background: var(--border-light);
  flex-shrink: 0;
}

.powered-by {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-align: center;
  min-width: 80px;
}
.powered-by .meta-label {
  display: block;
  width: 100%;
}

.app-logo {
  height: 16px;
  width: auto;
  object-fit: contain;
  display: block;
  opacity: 0.9;
  margin: 0 auto;
}

/* ===== Jam ===== */
.clock {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.03em;
  color: var(--text-secondary);
  background: none;
  border: none;
  padding: 0 6px;
  white-space: nowrap;
}
.clock-zone {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  background: none;
  border: none;
  padding: 0;
}

/* ===== Notifikasi ===== */
.notif-wrap { position: relative; }
.notif-btn {
  position: relative;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.notif-btn:hover, .notif-open { background: rgba(0,0,0,0.04); color: var(--olive-primary); }
.notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  border-radius: 4px;
  background: var(--red-orange);
  color: white;
  font-size: 12px;
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
.notif-dropdown {
  position: absolute;
  top: 40px;
  right: 0;
  width: 380px;
  max-width: calc(100vw - 40px);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0,0,0,0.15);
  overflow: hidden;
  z-index: 200;
}
.notif-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--olive-primary);
  color: white;
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
}
.notif-mark-all { background: none; border: none; color: white; font-size: var(--text-xs); cursor: pointer; text-decoration: underline; }
.notif-list { max-height: 380px; overflow-y: auto; }
.notif-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s;
}
.notif-item:hover { background: var(--bg-hover); }
.notif-item.unread { background: rgba(139,148,103,0.06); }
.notif-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.notif-text { flex: 1; min-width: 0; }
.notif-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.notif-body { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.notif-time { font-size: 11px; color: var(--text-muted); margin-top: 4px; }
.notif-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--red-orange); flex-shrink: 0; margin-top: 4px; }
.notif-empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 32px; color: var(--text-muted); font-size: var(--text-sm); }

/* ===== Responsif: rapi di layar sempit ===== */
@media (max-width: 1000px) {
  .app-meta, .meta-sep { display: none; }
}
@media (max-width: 760px) {
  .sys-text { display: none; }
  .clock-zone { display: none; }
}
</style>
