<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const saved = ref(false)
const loading = ref(false)
const saving = ref(false)

const form = reactive({
  name: '', npsn: '', address: '', phone: '', email: '',
  website: '', headmaster: '', activeYear: '', activeSemester: ''
})

async function loadSettings() {
  loading.value = true
  try {
    const data = await $fetch<any>('/api/admin/settings')
    Object.assign(form, {
      name: data.name || '', npsn: data.npsn || '', address: data.address || '',
      phone: data.phone || '', email: data.email || '', website: data.website || '',
      headmaster: data.headmaster || '', activeYear: data.activeYear || '2025/2026',
      activeSemester: data.activeSemester || 'Ganjil'
    })
  } finally { loading.value = false }
}

async function saveSettings() {
  saving.value = true
  try {
    await $fetch('/api/admin/settings', { method: 'PUT', body: form })
    saved.value = true
    setTimeout(() => saved.value = false, 2000)
  } finally { saving.value = false }
}

onMounted(loadSettings)
</script>

<template>
  <div class="space-y-4 max-w-3xl">
    <h1 class="page-title">Pengaturan Instansi</h1>

    <div class="form-card">
      <h3 class="form-card-title">Identitas Sekolah</h3>
      <form @submit.prevent="saveSettings" class="space-y-4">
        <div class="form-row">
          <div class="form-group">
            <label>Nama Sekolah</label>
            <input v-model="form.name" class="form-input">
          </div>
          <div class="form-group">
            <label>NPSN</label>
            <input v-model="form.npsn" class="form-input">
          </div>
        </div>
        <div class="form-group">
          <label>Alamat</label>
          <textarea v-model="form.address" class="form-input" rows="2"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Telepon</label><input v-model="form.phone" class="form-input"></div>
          <div class="form-group"><label>Email</label><input v-model="form.email" class="form-input"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Website</label><input v-model="form.website" class="form-input"></div>
          <div class="form-group"><label>Kepala Sekolah</label><input v-model="form.headmaster" class="form-input"></div>
        </div>
        <hr class="form-divider">
        <h3 class="form-card-title">Tahun Ajaran Aktif</h3>
        <div class="form-row">
          <div class="form-group"><label>Tahun Ajaran</label><select v-model="form.activeYear" class="form-input"><option>2024/2025</option><option>2025/2026</option><option>2026/2027</option></select></div>
          <div class="form-group"><label>Semester</label><select v-model="form.activeSemester" class="form-input"><option>Ganjil</option><option>Genap</option></select></div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">
            <Icon v-if="saved" name="i-lucide-check" class="w-4 h-4" />
            {{ saved ? 'Tersimpan!' : 'Simpan Pengaturan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.form-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 24px; }
.form-card-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.form-divider { border: none; border-top: 1px solid var(--border-light); margin: 20px 0; }
.form-actions { display: flex; justify-content: flex-end; padding-top: 8px; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 10px 24px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--olive-dark); }
</style>
