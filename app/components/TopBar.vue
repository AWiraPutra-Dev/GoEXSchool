<script setup lang="ts">
const auth = useAuthStore()

// Real-time clock
const now = ref(new Date())
let timer: ReturnType<typeof setInterval>
onMounted(() => { timer = setInterval(() => (now.value = new Date()), 1000) })
onUnmounted(() => clearInterval(timer))

const clock = computed(() =>
  now.value.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
)
</script>

<template>
  <header class="top-bar">
    <!-- Kiri: User Info -->
    <div class="user-info">
      <div class="user-avatar">
        {{ auth.userInitials }}
      </div>
      <div>
        <div class="user-name">{{ auth.user?.name ?? 'User' }}</div>
        <div class="user-role">{{ auth.roleLabel }}</div>
      </div>
    </div>

    <!-- Tengah: Logo Sekolah + Judul -->
    <div class="school-brand">
      <div class="school-logo">
        <span class="text-white font-bold text-lg">E</span>
      </div>
      <div class="school-title">{{ auth.institution?.name ?? 'EskulHub' }}</div>
    </div>

    <!-- Kanan: Aplikasi Info -->
    <div class="app-info">
      <div class="app-label">Aplikasi Manajemen Ekstrakurikuler</div>
      <div style="display:flex;align-items:center;gap:8px;justify-content:flex-end;">
        <span class="app-name">Eskul</span>
        <span class="app-name" style="color:var(--olive-primary);">Hub</span>
        <span class="clock">{{ clock }}</span>
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
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 100;
}

/* Kiri: User Info */
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

/* Tengah: Logo Sekolah + Judul */
.school-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.school-logo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1E88E5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.school-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
}

/* Kanan: Aplikasi Info */
.app-info {
  text-align: right;
}

.app-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.app-name {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  font-style: italic;
}

.clock {
  font-size: var(--text-base);
  color: var(--text-secondary);
  font-family: 'Courier New', monospace;
  font-weight: var(--font-semibold);
}
</style>
