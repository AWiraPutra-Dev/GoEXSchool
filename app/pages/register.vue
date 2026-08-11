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
    <!-- Decorative Background -->
    <div class="bg-decor">
      <div class="decor-circle decor-circle-1"></div>
      <div class="decor-circle decor-circle-2"></div>
      <div class="decor-circle decor-circle-3"></div>
    </div>

    <div class="register-container" :class="{ 'step-done': step === 'done' }">
      <!-- Left Panel - Branding -->
      <div class="brand-panel">
        <div class="brand-content">
          <div class="brand-logo">
            <div class="logo-icon">
              <span>E</span>
            </div>
          </div>
          <h1 class="brand-title">Eskul<span class="text-[var(--olive-light)]">Hub</span></h1>
          <p class="brand-subtitle">Bergabung dengan platform manajemen ekskul terpadu</p>

          <div class="brand-steps">
            <div class="step-indicator" :class="{ active: step === 'form', done: step === 'done' }">
              <div class="step-number">
                <Icon v-if="step === 'done'" name="i-lucide-check" class="w-4 h-4" />
                <span v-else>1</span>
              </div>
              <div class="step-info">
                <span class="step-label">Langkah 1</span>
                <span class="step-desc">Lengkapi data diri</span>
              </div>
            </div>
            <div class="step-connector"></div>
            <div class="step-indicator" :class="{ active: step === 'done' }">
              <div class="step-number">
                <Icon v-if="step === 'done'" name="i-lucide-check" class="w-4 h-4" />
                <span v-else>2</span>
              </div>
              <div class="step-info">
                <span class="step-label">Langkah 2</span>
                <span class="step-desc">Konfirmasi & Selesai</span>
              </div>
            </div>
          </div>

          <div class="brand-testimonial">
            <div class="testimonial-quote">"</div>
            <p class="testimonial-text">Platform yang memudahkan pengelolaan ekskul sekolah secara digital. Sangat membantu!</p>
            <p class="testimonial-author">— Admin SMA Negeri 1 Bandung</p>
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
          <!-- FORM STEP -->
          <template v-if="step === 'form'">
            <div class="form-header">
              <h2 class="form-title">Daftar Akun Baru</h2>
              <p class="form-desc">Isi data diri untuk membuat akun</p>
            </div>

            <form @submit.prevent="handleRegister" class="register-form">
              <!-- Error Message -->
              <div v-if="errorMsg" class="error-badge">
                <Icon name="i-lucide-alert-circle" class="w-4 h-4" />
                <span>{{ errorMsg }}</span>
              </div>

              <!-- NIS -->
              <div class="input-group">
                <label class="input-label">NIS</label>
                <div class="input-row-nis">
                  <div class="input-wrapper flex-1">
                    <Icon name="i-lucide-id-card" class="input-icon" />
                    <input
                      v-model="nis"
                      type="text"
                      required
                      class="input-field"
                      placeholder="Masukkan NIS"
                      :disabled="nisChecked"
                    />
                  </div>
                  <button
                    v-if="!nisChecked"
                    type="button"
                    class="btn-cek"
                    :disabled="nisLoading || !nis"
                    @click="checkNis"
                  >
                    <span v-if="nisLoading" class="loading-spinner-sm"></span>
                    <span v-else>Cek NIS</span>
                  </button>
                  <button
                    v-else
                    type="button"
                    class="btn-ubah"
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
                <div class="input-group">
                  <label class="input-label">Nama Lengkap</label>
                  <div class="input-wrapper">
                    <Icon name="i-lucide-user" class="input-icon" />
                    <input
                      :value="studentName"
                      type="text"
                      class="input-field"
                      disabled
                    />
                  </div>
                </div>

                <!-- Password -->
                <div class="input-group">
                  <label class="input-label">Password</label>
                  <div class="input-wrapper">
                    <Icon name="i-lucide-lock" class="input-icon" />
                    <input
                      v-model="password"
                      type="password"
                      required
                      class="input-field"
                      placeholder="Minimal 8 karakter"
                    />
                  </div>
                </div>

                <!-- Confirm Password -->
                <div class="input-group">
                  <label class="input-label">Konfirmasi Password</label>
                  <div class="input-wrapper">
                    <Icon name="i-lucide-lock" class="input-icon" />
                    <input
                      v-model="confirmPassword"
                      type="password"
                      required
                      class="input-field"
                      placeholder="Ulangi password"
                    />
                  </div>
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
                :class="{ loading: loading }"
                :disabled="loading || !agreed"
              >
                <span v-if="!loading" class="btn-text">
                  Buat Akun
                  <Icon name="i-lucide-arrow-right" class="w-4 h-4" />
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
                <Icon name="i-lucide-check" class="w-8 h-8" />
              </div>
              <h2 class="success-title">Pendaftaran Berhasil!</h2>
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
                  <Icon name="i-lucide-arrow-right" class="w-4 h-4" />
                </span>
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== Page Layout ===== */
.register-page {
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
.register-container {
  display: flex;
  width: 100%;
  max-width: 920px;
  min-height: 600px;
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

/* ===== Step Indicators ===== */
.brand-steps {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 32px;
}

.step-indicator {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,0.5);
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.step-indicator.active .step-number,
.step-indicator.done .step-number {
  border-color: white;
  color: var(--olive-dark);
  background: white;
}

.step-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.step-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.step-indicator.active .step-label,
.step-indicator.done .step-label {
  color: rgba(255,255,255,0.8);
}

.step-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.step-indicator.active .step-desc {
  color: white;
  font-weight: 600;
}

.step-connector {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  margin-left: 15.5px;
}

/* ===== Testimonial ===== */
.brand-testimonial {
  margin-top: auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  margin-bottom: 20px;
}

.testimonial-quote {
  font-size: 36px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.2);
  line-height: 0.8;
  margin-bottom: 8px;
}

.testimonial-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  font-style: italic;
  line-height: 1.6;
  margin-bottom: 8px;
}

.testimonial-author {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.brand-footer { padding-top: 8px; }
.brand-version { font-size: 11px; color: rgba(255, 255, 255, 0.5); margin-bottom: 4px; }
.brand-copyright { font-size: 11px; color: rgba(255, 255, 255, 0.4); }

/* ===== Right Form Panel ===== */
.form-panel {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px;
  overflow-y: auto;
}

.form-wrapper {
  width: 100%;
  max-width: 380px;
}

.form-header {
  margin-bottom: 24px;
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

/* ===== Form ===== */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.input-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1.5px solid var(--border-light);
  border-radius: 10px;
  transition: all 0.2s ease;
  background: white;
}

.input-wrapper:focus-within {
  border-color: var(--olive-primary);
  box-shadow: 0 0 0 3px rgba(139, 148, 103, 0.12);
}

.input-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  color: var(--text-primary);
  background: transparent;
  font-family: var(--font-family);
}

.input-field::placeholder {
  color: var(--text-muted);
}

.input-field:disabled {
  background: var(--bg-disabled, #f5f5f5);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.input-row {
  display: flex;
  gap: 12px;
}

.input-row-nis {
  display: flex;
  gap: 8px;
}

.btn-cek {
  padding: 10px 16px;
  background: var(--olive-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  font-family: var(--font-family);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-cek:hover:not(:disabled) {
  background: var(--olive-dark);
}

.btn-cek:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-ubah {
  padding: 10px 16px;
  background: transparent;
  color: var(--olive-primary);
  border: 1.5px solid var(--olive-primary);
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  font-family: var(--font-family);
  transition: all 0.2s ease;
}

.btn-ubah:hover {
  background: var(--olive-bg);
}

.loading-spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.field-error {
  font-size: 11px;
  color: #dc2626;
  margin-top: 4px;
}

.field-success {
  font-size: 11px;
  color: var(--olive-primary);
  margin-top: 4px;
}

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
}

/* ===== Role Cards ===== */
.role-cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 4px;
}

.role-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid var(--border-light);
  border-radius: 10px;
  background: white;
  cursor: pointer;
  transition: all 0.25s ease;
}

.role-card:hover {
  border-color: var(--olive-light);
  background: var(--olive-bg);
}

.role-card.active {
  border-color: var(--olive-primary);
  background: rgba(139, 148, 103, 0.06);
  box-shadow: 0 0 0 3px rgba(139, 148, 103, 0.12);
}

.role-card-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.role-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.role-icon-admin { background: var(--teal-dark); }
.role-icon-operator { background: var(--orange); }
.role-icon-student { background: var(--green-soft); }

.role-card.active .role-icon-admin,
.role-card.active .role-icon-operator,
.role-card.active .role-icon-student {
  background: var(--olive-primary);
}

.role-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.role-check {
  width: 20px;
  height: 20px;
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

/* ===== Agreement ===== */
.agreement {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
  margin-top: 4px;
}

.agreement-checkbox {
  width: 18px;
  height: 18px;
  border: 1.5px solid var(--border-light);
  border-radius: 4px;
  cursor: pointer;
  accent-color: var(--olive-primary);
  margin-top: 2px;
  flex-shrink: 0;
}

.agreement-text {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.agreement-link {
  color: var(--olive-primary);
  font-weight: 600;
  text-decoration: none;
}

.agreement-link:hover {
  text-decoration: underline;
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
  text-decoration: none;
  display: block;
  text-align: center;
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

.submit-btn:hover:not(:disabled) {
  background: var(--olive-dark);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(139, 148, 103, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.99);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

/* ===== Success Step ===== */
.success-wrapper {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(139, 148, 103, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--olive-primary);
  margin-bottom: 20px;
  animation: successBounce 0.6s ease-out;
}

@keyframes successBounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

.success-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.success-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 24px;
}

.success-detail {
  width: 100%;
  background: var(--olive-bg);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 24px;
  text-align: left;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(139, 148, 103, 0.15);
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

.success-btn {
  text-decoration: none;
}

.success-btn:hover {
  background: var(--olive-dark);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(139, 148, 103, 0.3);
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .brand-panel {
    display: none;
  }
  .form-panel {
    padding: 32px 24px;
  }
  .register-container {
    max-width: 440px;
    min-height: auto;
  }
}
</style>
