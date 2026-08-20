<script setup lang="ts">
definePageMeta({ layout: false })

const role = ref<'admin' | 'operator' | 'student'>('admin')
const identifier = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const roleOptions = [
  { value: 'admin' as const, label: 'Admin', icon: 'i-lucide-building-2' },
  { value: 'operator' as const, label: 'Operator', icon: 'i-lucide-shield' },
  { value: 'student' as const, label: 'Siswa', icon: 'i-lucide-graduation-cap' }
]

const identifierPlaceholder = computed(() => {
  return role.value === 'student' ? 'Masukkan NIS' : 'Masukkan username'
})

async function handleLogin() {
  if (!identifier.value || !password.value) {
    errorMsg.value = 'Username/NIS dan password wajib diisi.'
    return
  }
  const auth = useAuthStore()
  loading.value = true
  errorMsg.value = ''
  try {
    await auth.login(identifier.value, password.value, role.value)
    const redirectMap: Record<string, string> = {
      super_admin: '/platform',
      admin: '/admin',
      operator: '/operator',
      student: '/siswa'
    }
    window.location.href = redirectMap[auth.user?.role ?? 'student'] || '/siswa'
  } catch (err: any) {
    errorMsg.value = err?.data?.message || err?.message || 'Login gagal. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <!-- Branding -->
      <div class="brand">
        <img src="/logos/studentbase.svg" alt="StudentBase" class="brand-logo-img" />
        <p class="brand-subtitle">Aplikasi Manajemen Ekstrakurikuler Sekolah</p>
      </div>

      <!-- Role Selection -->
      <div class="role-switch">
        <button
          v-for="opt in roleOptions"
          :key="opt.value"
          type="button"
          class="role-btn"
          :class="{ active: role === opt.value }"
          @click="role = opt.value"
        >
          <Icon :name="opt.icon" class="w-4 h-4" />
          <span>{{ opt.label }}</span>
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMsg" class="error-badge">
        <Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Form Fields -->
      <div class="form-fields">
        <div class="field-group">
          <label class="field-label">{{ identifierPlaceholder }}</label>
          <input
            v-model="identifier"
            type="text"
            class="field-input"
            :placeholder="identifierPlaceholder"
            @keyup.enter="handleLogin"
          />
        </div>
        <div class="field-group">
          <label class="field-label">Password</label>
          <input
            v-model="password"
            type="password"
            class="field-input"
            placeholder="Masukkan password"
            @keyup.enter="handleLogin"
          />
        </div>
      </div>

      <!-- Submit -->
      <button
        class="submit-btn"
        :disabled="loading"
        @click="handleLogin"
      >
        <span v-if="!loading" class="btn-text">
          Masuk
        </span>
        <span v-else class="btn-loading">
          <span class="loading-spinner"></span>
          Memproses...
        </span>
      </button>

      <!-- Footer -->
      <p class="form-footer-text">
        Belum punya akun?
        <NuxtLink to="/register" class="form-link">Daftar Baru</NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
/* ===== Halaman: latar bersih, kartu di tengah ===== */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-main);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 40px 36px;
  box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
}

/* ===== Branding ===== */
.brand {
  text-align: center;
  margin-bottom: 28px;
}

.brand-logo-img {
  height: 36px;
  width: auto;
  object-fit: contain;
  display: block;
  margin: 0 auto 14px;
}

.brand-subtitle {
  font-size: 13px;
  color: var(--text-muted);
}

/* ===== Role Selection: segmented control sederhana ===== */
.role-switch {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  background: var(--bg-hover);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 20px;
}

.role-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-family);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s ease;
}

.role-btn:hover {
  color: var(--text-primary);
}

.role-btn.active {
  background: var(--bg-card);
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
}

/* ===== Error ===== */
.error-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 4px;
  font-size: 12px;
  color: #dc2626;
  margin-bottom: 16px;
}

/* ===== Form Fields ===== */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.field-input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--border-medium);
  border-radius: 8px;
  font-size: 13px;
  font-family: var(--font-family);
  color: var(--text-primary);
  background: var(--bg-card);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  outline: none;
  box-sizing: border-box;
}

.field-input:focus {
  border-color: var(--text-secondary);
  box-shadow: 0 0 0 3px rgba(100, 116, 139, 0.12);
}

.field-input::placeholder {
  color: var(--text-muted);
}

/* ===== Submit Button: netral gelap, tanpa efek berlebihan ===== */
.submit-btn {
  width: 100%;
  padding: 13px 24px;
  background: var(--text-primary);
  color: var(--bg-card);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.88;
}

.submit-btn:active:not(:disabled) {
  opacity: 0.75;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(127, 127, 127, 0.35);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== Footer ===== */
.form-footer-text {
  text-align: center;
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 20px;
}

.form-link {
  color: var(--text-secondary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}

.form-link:hover {
  color: var(--text-primary);
  text-decoration: underline;
}
</style>
