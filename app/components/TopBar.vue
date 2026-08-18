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
    <!-- Kiri: User Info -->
    <div class="user-info">
      <div class="user-avatar">
        <img v-if="auth.user?.avatar" :src="auth.user.avatar" alt="Foto profil" class="user-avatar-img" />
        <span v-else>{{ auth.userInitials }}</span>
      </div>
      <div>
        <div class="user-name">{{ auth.user?.name ?? 'User' }}</div>
        <div class="user-role">{{ auth.roleLabel }}</div>
      </div>
    </div>

    <!-- Tengah: Logo Sekolah + Nama Instansi -->
    <div class="school-brand">
      <div class="school-logo">
        <img v-if="auth.institution?.logo" :src="auth.institution.logo" class="school-logo-img" alt="Logo Sekolah" />
        <Icon v-else name="i-lucide-school" class="w-5 h-5" style="color: var(--text-secondary);" />
      </div>
      <div class="school-brand-text">
        <div class="school-title">{{ auth.institution?.name ?? 'StudentBase' }}</div>
        <div class="school-accent"><span></span></div>
      </div>
    </div>

    <!-- Kanan: Notifikasi + Jam -->
    <div class="app-info">
      <div style="display:flex;align-items:center;gap:14px;justify-content:flex-end;">
        <!-- Notifikasi -->
        <div class="notif-wrap">
          <button class="notif-btn" :class="{ 'notif-open': showNotif }" @click="toggleNotif" title="Notifikasi">
            <Icon name="i-lucide-bell" class="w-5 h-5" />
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
        <div class="app-name">StudentBase</div>
        <span class="clock" :title="`Zona waktu: ${schoolZone}`">
          <Icon name="i-lucide-clock" class="w-4 h-4" />
          {{ clock }}
          <span class="clock-zone">{{ schoolZone }}</span>
        </span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: var(--bg-topbar);
  /* Garis merah di batas antara top bar abu-abu dan konten putih di bawahnya */
  border-bottom: 2px solid var(--red-orange);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 36px;
  height: 36px;
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
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
  line-height: var(--leading-tight);
}

.user-role {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-weight: var(--font-normal);
}

.school-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Logo asli — tanpa lingkaran, tanpa latar, tanpa border: logo yang sudah
   dihapus background-nya menyatu langsung dengan warna top bar. */
.school-logo {
  width: 40px;
  height: 40px;
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

.school-brand-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.15;
  min-width: 0;
}

.school-title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Garis aksen tipis di bawah nama — sentuhan kecil agar brand terlihat
   rapi & berkelas tanpa teks tambahan. */
.school-accent {
  margin-top: 3px;
}
.school-accent span {
  display: block;
  width: 36px;
  height: 2.5px;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-light));
}

.app-info {
  text-align: right;
}

.app-name {
  font-size: var(--text-xl);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(90deg, var(--accent), var(--accent-dark));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.clock {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  color: var(--text-primary);
  background: transparent;
  border: none;
  white-space: nowrap;
}
.clock-zone {
  font-size: 10px;
  font-weight: var(--font-bold);
  letter-spacing: 0.06em;
  color: var(--accent);
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
  border-radius: 5px;
  padding: 2px 6px;
}

/* Notifikasi */
.notif-wrap { position: relative; }
.notif-btn {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.notif-btn:hover, .notif-open { background: var(--olive-bg); color: var(--olive-primary); border-color: var(--olive-light); }
.notif-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  background: var(--red-orange);
  color: white;
  font-size: 10px;
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}
.notif-dropdown {
  position: absolute;
  top: 44px;
  right: 0;
  width: 380px;
  max-width: calc(100vw - 40px);
  background: white;
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
</style>
