<script setup lang="ts">
definePageMeta({ layout: false })

const role = ref<'admin' | 'operator' | 'student'>('admin')
const identifier = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const roleOptions = [
  { value: 'admin' as const, label: 'Admin Sekolah', icon: 'i-lucide-building-2', desc: 'Kelola master data & pengaturan' },
  { value: 'operator' as const, label: 'Operator Ekskul', icon: 'i-lucide-shield', desc: 'Kelola kegiatan & absensi' },
  { value: 'student' as const, label: 'Siswa', icon: 'i-lucide-graduation-cap', desc: 'Akses jadwal & portofolio' }
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
    window.location.href = redirectMap[auth.user?.role ?? 'student']
  } catch (err: any) {
    errorMsg.value = err?.data?.message || err?.message || 'Login gagal. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <!-- Decorative Background -->
    <div class="bg-decor">
      <div class="decor-circle decor-circle-1"></div>
      <div class="decor-circle decor-circle-2"></div>
      <div class="decor-circle decor-circle-3"></div>
    </div>

    <div class="login-container">
      <!-- Left Panel - Branding -->
      <div class="brand-panel">
        <div class="brand-content">
          <div class="brand-logo">
            <div class="logo-icon">
              <span>E</span>
            </div>
          </div>
          <h1 class="brand-title">Eskul<span class="text-[var(--olive-light)]">Hub</span></h1>
          <p class="brand-subtitle">Aplikasi Manajemen Ekstrakurikuler Sekolah</p>
          
          <div class="brand-features">
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Manajemen pendaftaran ekskul</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Absensi digital dengan QR Code</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Portofolio prestasi siswa</span>
            </div>
            <div class="feature-item">
              <div class="feature-dot"></div>
              <span>Multi-level akses terpadu</span>
            </div>
          </div>

          <div class="brand-footer">
            <p class="brand-version">v1.0.0 — Prototype</p>
            <p class="brand-copyright">© 2026 EskulHub</p>
          </div>
        </div>
      </div>

      <!-- Right Panel - Form -->
      <div class="form-panel">
        <div class="form-wrapper">
          <!-- Header -->
          <div class="form-header">
            <h2 class="form-title">Selamat Datang</h2>
            <p class="form-desc">Pilih role untuk masuk ke dashboard</p>
          </div>

          <!-- Role Selection Cards -->
          <div class="role-cards">
            <button
              v-for="opt in roleOptions"
              :key="opt.value"
              type="button"
              class="role-card"
              :class="{ active: role === opt.value }"
              @click="role = opt.value"
            >
              <div class="role-card-left">
                <div class="role-icon" :class="`role-icon-${opt.value}`">
                  <Icon :name="opt.icon" class="w-5 h-5" />
                </div>
                <div class="role-text">
                  <span class="role-label">{{ opt.label }}</span>
                  <span class="role-desc">{{ opt.desc }}</span>
                </div>
              </div>
              <div class="role-check" :class="{ checked: role === opt.value }">
                <Icon v-if="role === opt.value" name="i-lucide-check" class="w-3.5 h-3.5" />
              </div>
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="errorMsg" class="error-badge">
            <Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
            <span>{{ errorMsg }}</span>
          </div>

          <!-- Login Form Fields -->
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

          <!-- Submit Button -->
          <button
            class="submit-btn"
            :class="{ loading: loading }"
            :disabled="loading"
            @click="handleLogin"
          >
            <span v-if="!loading" class="btn-text">
              Masuk sebagai {{ roleOptions.find(o => o.value === role)?.label }}
              <Icon name="i-lucide-arrow-right" class="w-4 h-4" />
            </span>
            <span v-else class="btn-loading">
              <span class="loading-spinner"></span>
              Memproses...
            </span>
          </button>

          <!-- Footer Link -->
          <p class="form-footer-text">
            Belum punya akun?
            <NuxtLink to="/register" class="form-link">Daftar Baru</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Page Layout ===== */
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-main);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* ===== Decorative Background ===== */
.bg-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.decor-circle {
  position: absolute;
  border-radius: 50%;
}
.decor-circle-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(139,148,103,0.08) 0%, transparent 70%);
  top: -200px; right: -200px;
}
.decor-circle-2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(139,148,103,0.06) 0%, transparent 70%);
  bottom: -150px; left: -100px;
}
.decor-circle-3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(139,148,103,0.05) 0%, transparent 70%);
  top: 40%; left: 30%;
}

/* ===== Main Container ===== */
.login-container {
  display: flex;
  width: 100%;
  max-width: 920px;
  min-height: 580px;
  background: var(--bg-card);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 8px 20px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  position: relative;
  z-index: 1;
  animation: containerIn 0.6s ease-out;
}

@keyframes containerIn {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* ===== Left Brand Panel ===== */
.brand-panel {
  width: 380px;
  background: linear-gradient(135deg, var(--olive-dark) 0%, var(--olive-primary) 50%, var(--olive-light) 100%);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.brand-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30Z' fill='none' stroke='rgba(255,255,255,0.04)' stroke-width='1'/%3E%3C/svg%3E");
  opacity: 0.3;
}

.brand-content {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.brand-logo { margin-bottom: 8px; }

.logo-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
.logo-icon span {
  font-size: 28px;
  font-weight: 800;
  color: white;
}

.brand-title {
  font-size: 32px;
  font-weight: 800;
  color: white;
  line-height: 1.2;
  margin-bottom: 8px;
}

.brand-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
  margin-bottom: 36px;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
}

.feature-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.brand-footer {
  margin-top: auto;
  padding-top: 24px;
}
.brand-version {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
}
.brand-copyright {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
}

/* ===== Right Form Panel ===== */
.form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.form-wrapper {
  width: 100%;
  max-width: 380px;
}

.form-header {
  margin-bottom: 28px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.form-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

/* ===== Role Cards ===== */
.role-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
}

.role-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 14px 16px;
  border: 1.5px solid var(--border-light);
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.25s ease;
  text-align: left;
}

.role-card:hover {
  border-color: var(--olive-light);
  background: var(--olive-bg);
  transform: translateX(4px);
}

.role-card:active {
  transform: scale(0.99);
}

.role-card.active {
  border-color: var(--olive-primary);
  background: rgba(139, 148, 103, 0.06);
  box-shadow: 0 0 0 3px rgba(139, 148, 103, 0.12);
}

.role-card-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.role-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.role-icon-admin { background: var(--teal-dark); }
.role-icon-operator { background: var(--orange); }
.role-icon-student { background: var(--green-soft); }

.role-card.active .role-icon-admin { background: var(--olive-primary); }
.role-card.active .role-icon-operator { background: var(--olive-primary); }
.role-card.active .role-icon-student { background: var(--olive-primary); }

.role-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.role-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.role-desc {
  font-size: 11px;
  color: var(--text-muted);
}

.role-check {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid var(--border-light);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  flex-shrink: 0;
  color: white;
}

.role-check.checked {
  background: var(--olive-primary);
  border-color: var(--olive-primary);
}

/* ===== Error Badge ===== */
.error-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
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
  gap: 4px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
}

.field-input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid var(--border-light);
  border-radius: 10px;
  font-size: 13px;
  font-family: var(--font-family);
  color: var(--text-primary);
  background: white;
  transition: all 0.2s ease;
  outline: none;
  box-sizing: border-box;
}

.field-input:focus {
  border-color: var(--olive-primary);
  box-shadow: 0 0 0 3px rgba(139, 148, 103, 0.12);
}

.field-input::placeholder {
  color: var(--text-muted);
}

/* ===== Submit Button ===== */
.submit-btn {
  width: 100%;
  padding: 14px 24px;
  background: var(--olive-primary);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
  font-family: var(--font-family);
}

.submit-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s;
}

.submit-btn:hover::before {
  opacity: 1;
}

.submit-btn:hover {
  background: var(--olive-dark);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(139, 148, 103, 0.3);
}

.submit-btn:active {
  transform: translateY(0) scale(0.99);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
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
  color: var(--olive-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s;
}

.form-link:hover {
  color: var(--olive-dark);
  text-decoration: underline;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .brand-panel {
    display: none;
  }
  .form-panel {
    padding: 32px 24px;
  }
  .login-container {
    max-width: 440px;
    min-height: auto;
  }
}
</style>
