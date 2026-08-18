<script setup lang="ts">
definePageMeta({ layout: false })

onMounted(async () => {
  if (process.client) {
    const auth = useAuthStore()
    await auth.restoreSession()

    if (auth.user) {
      const redirectMap: Record<string, string> = {
        super_admin: '/platform',
        admin: '/admin',
        operator: '/operator',
        student: '/siswa'
      }
      navigateTo(redirectMap[auth.user.role] ?? '/login')
    } else {
      navigateTo('/login')
    }
  }
})
</script>

<template>
  <div class="loading-page">
    <div class="loading-content">
      <div class="loading-logo">
        <span>E</span>
      </div>
      <h1 class="loading-title">StudentBase</h1>
      <div class="loading-spinner"></div>
      <p class="loading-text">Memuat...</p>
    </div>
  </div>
</template>

<style scoped>
.loading-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-main);
}

.loading-content {
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.loading-logo {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: var(--olive-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.loading-logo span {
  font-size: 32px;
  font-weight: 800;
  color: white;
}

.loading-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top-color: var(--olive-primary);
  border-radius: 50%;
  margin: 0 auto 12px;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
