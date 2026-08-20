<script setup lang="ts">
definePageMeta({ layout: false })

const step = ref<'form' | 'done'>('form')
const nis = ref('')
const password = ref('')
const confirmPassword = ref('')
const studentName = ref('')
const nisChecked = ref(false)
const nisLoading = ref(false)
const nisError = ref('')
const loading = ref(false)
const errorMsg = ref('')
const agreed = ref(false)

async function checkNis() {
  if (!nis.value) return
  nisLoading.value = true
  nisError.value = ''
  nisChecked.value = false
  try {
    const res = await $fetch<{ name: string }>('/api/auth/check-nis', {
      method: 'POST',
      body: { nis: nis.value }
    })
    studentName.value = res.name
    nisChecked.value = true
  } catch (err: any) {
    nisError.value = err?.data?.message || 'NIS tidak ditemukan.'
    studentName.value = ''
  } finally {
    nisLoading.value = false
  }
}

async function handleRegister() {
  if (!nisChecked.value || !password.value || password.value.length < 8) {
    errorMsg.value = 'Password minimal 8 karakter.'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Konfirmasi password tidak cocok.'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { nis: nis.value, password: password.value }
    })
    step.value = 'done'
  } catch (err: any) {
    errorMsg.value = err?.data?.message || 'Registrasi gagal.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-page">
    <div class="register-card">
      <!-- Branding -->
      <div class="brand">
        <img src="/logos/studentbase.svg" alt="StudentBase" class="brand-logo-img" />
        <p class="brand-subtitle">Daftar akun siswa untuk mengikuti ekskul</p>
      </div>

      <!-- FORM STEP -->
      <template v-if="step === 'form'">
        <div class="form-header">
          <h2 class="form-title">Daftar Akun Baru</h2>
          <p class="form-desc">Isi data diri untuk membuat akun</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <!-- Error Message -->
          <div v-if="errorMsg" class="error-badge">
            <Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
            <span>{{ errorMsg }}</span>
          </div>

          <!-- NIS -->
          <div class="field-group">
            <label class="field-label">NIS</label>
            <div class="input-row">
              <input
                v-model="nis"
                type="text"
                required
                class="field-input"
                placeholder="Masukkan NIS"
                :disabled="nisChecked"
              />
              <button
                v-if="!nisChecked"
                type="button"
                class="btn-secondary"
                :disabled="nisLoading || !nis"
                @click="checkNis"
              >
                <span v-if="nisLoading" class="loading-spinner-sm"></span>
                <span v-else>Cek NIS</span>
              </button>
              <button
                v-else
                type="button"
                class="btn-secondary"
                @click="nisChecked = false; nis = ''; studentName = ''"
              >
                Ubah
              </button>
            </div>
            <p v-if="nisError" class="field-error">{{ nisError }}</p>
            <p v-if="nisChecked" class="field-success">NIS terdaftar atas nama <strong>{{ studentName }}</strong></p>
          </div>

          <template v-if="nisChecked">
            <!-- Nama Siswa (read-only) -->
            <div class="field-group">
              <label class="field-label">Nama Lengkap</label>
              <input
                :value="studentName"
                type="text"
                class="field-input"
                disabled
              />
            </div>

            <!-- Password -->
            <div class="field-group">
              <label class="field-label">Password</label>
              <input
                v-model="password"
                type="password"
                required
                class="field-input"
                placeholder="Minimal 8 karakter"
              />
            </div>

            <!-- Confirm Password -->
            <div class="field-group">
              <label class="field-label">Konfirmasi Password</label>
              <input
                v-model="confirmPassword"
                type="password"
                required
                class="field-input"
                placeholder="Ulangi password"
              />
            </div>
          </template>

          <!-- Agreement -->
          <label class="agreement">
            <input type="checkbox" v-model="agreed" class="agreement-checkbox" />
            <span class="agreement-text">
              Saya setuju dengan <a href="#" class="agreement-link">Syarat & Ketentuan</a> dan <a href="#" class="agreement-link">Kebijakan Privasi</a>
            </span>
          </label>

          <!-- Submit -->
          <button
            type="submit"
            class="submit-btn"
            :disabled="loading || !agreed"
          >
            <span v-if="!loading" class="btn-text">
              Buat Akun
            </span>
            <span v-else class="btn-loading">
              <span class="loading-spinner"></span>
              Memproses...
            </span>
          </button>
        </form>

        <p class="form-footer-text">
          Sudah punya akun?
          <NuxtLink to="/login" class="form-link">Masuk</NuxtLink>
        </p>
      </template>

      <!-- SUCCESS STEP -->
      <template v-else-if="step === 'done'">
        <div class="success-wrapper">
          <div class="success-icon">
            <Icon name="i-lucide-check" class="w-7 h-7" />
          </div>
          <h2 class="success-title">Pendaftaran Berhasil</h2>
          <p class="success-desc">
            Akun untuk <strong>{{ studentName }}</strong> (NIS: {{ nis }}) berhasil dibuat.
            Silakan login menggunakan NIS dan password yang sudah dibuat.
          </p>

          <div class="success-detail">
            <div class="detail-item">
              <span class="detail-label">Nama</span>
              <span class="detail-value">{{ studentName }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">NIS</span>
              <span class="detail-value">{{ nis }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Role</span>
              <span class="detail-value">Siswa</span>
            </div>
          </div>

          <NuxtLink to="/login" class="submit-btn success-btn">
            <span class="btn-text">
              Masuk Sekarang
            </span>
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ===== Halaman: latar bersih, kartu di tengah ===== */
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-main);
  padding: 20px;
}

.register-card {
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

/* ===== Form Header ===== */
.form-header {
  margin-bottom: 20px;
}

.form-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.form-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

/* ===== Form ===== */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
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

.field-input:disabled {
  background: var(--bg-hover);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.input-row {
  display: flex;
  gap: 8px;
}

.input-row .field-input {
  flex: 1;
}

.btn-secondary {
  padding: 11px 16px;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-medium);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(127, 127, 127, 0.35);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.field-error {
  font-size: 11px;
  color: #dc2626;
}

.field-success {
  font-size: 11px;
  color: #15803d;
}

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
}

/* ===== Agreement ===== */
.agreement {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.agreement-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  cursor: pointer;
  accent-color: var(--text-primary);
  margin-top: 1px;
  flex-shrink: 0;
}

.agreement-text {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.agreement-link {
  color: var(--text-secondary);
  font-weight: 600;
  text-decoration: none;
}

.agreement-link:hover {
  color: var(--text-primary);
  text-decoration: underline;
}

/* ===== Submit Button ===== */
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
  text-decoration: none;
  display: block;
  text-align: center;
  box-sizing: border-box;
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
  justify-content: center;
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

/* ===== Success Step ===== */
.success-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.success-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.success-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.success-detail {
  width: 100%;
  background: var(--bg-hover);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 6px 16px;
  margin-bottom: 24px;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.detail-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}
</style>
