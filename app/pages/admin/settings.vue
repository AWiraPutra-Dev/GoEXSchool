<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const auth = useAuthStore()
const saved = ref(false)
const loading = ref(false)
const saving = ref(false)
const errorMsg = ref('')

const form = reactive({
  name: '', npsn: '', address: '', phone: '', email: '',
  website: '', headmaster: '', activeYear: '', activeSemester: '', themeColor: '#4F46E5',
  logo: null as string | null,
  latitude: null as number | null,
  longitude: null as number | null,
  attendanceRadius: 200,
})

// Warna aksen tema — pilihan cepat + custom
const presetColors = [
  '#4F46E5', // Indigo
  '#2563EB', // Blue
  '#0891B2', // Cyan
  '#0D9488', // Teal
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#E11D48', // Rose
  '#9333EA', // Purple
]

function onThemeChange(color: string) {
  form.themeColor = color
  // Pratinjau langsung — seluruh tampilan ikut berubah tanpa menunggu simpan
  applyTheme(color)
}

// Zona waktu sekolah (WIB/WITA/WIT) — otomatis dari koordinat/alamat
const schoolZone = computed(() => getSchoolZone(form))

async function loadSettings() {
  loading.value = true
  errorMsg.value = ''
  try {
    const data = await $fetch<any>('/api/admin/settings')
    Object.assign(form, {
      name: data.name || '', npsn: data.npsn || '', address: data.address || '',
      phone: data.phone || '', email: data.email || '', website: data.website || '',
      headmaster: data.headmaster || '', activeYear: data.activeYear || '2025/2026',
      activeSemester: data.activeSemester || 'Ganjil',
      themeColor: data.themeColor || '#4F46E5',
      logo: data.logo || null,
      latitude: data.latitude ?? null,
      longitude: data.longitude ?? null,
      attendanceRadius: data.attendanceRadius ?? 200
    })
    // Sinkronkan store auth agar semua tampilan memakai data terbaru
    auth.applyInstitution({ ...form })
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal memuat pengaturan.'
  } finally { loading.value = false }
}

async function saveSettings() {
  saving.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/admin/settings', { method: 'PUT', body: form })
    // Terapkan langsung ke store + localStorage — semua tampilan (TopBar,
    // dashboard admin/operator/siswa) langsung ikut berubah tanpa reload.
    auth.applyInstitution({ ...form })
    saved.value = true
    setTimeout(() => saved.value = false, 2000)
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal menyimpan pengaturan.'
  } finally { saving.value = false }
}

onMounted(loadSettings)
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">{{ ui.t('menu.settings') }}</h1>
    <p class="page-subtitle">Identitas sekolah ini digunakan di seluruh aplikasi. Perubahan akan langsung berlaku untuk admin, operator, dan siswa.</p>

    <div v-if="errorMsg" class="error-badge">
      <Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
      <span>{{ errorMsg }}</span>
    </div>

    <div class="form-card">
      <h3 class="form-card-title">Identitas Sekolah</h3>
      <form @submit.prevent="saveSettings" class="space-y-4">
        <div class="form-group logo-group">
          <label>Logo Sekolah</label>
          <LogoUploader v-model="form.logo" :size="96" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Nama Sekolah</label>
            <input v-model="form.name" class="form-input" placeholder="Contoh: SMKN 4 Bandung">
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
        <h3 class="form-card-title">Warna Tema</h3>
        <p class="text-[13px]" style="color: var(--text-secondary); margin-bottom: 12px;">
          Warna aksen tampilan aplikasi berlaku untuk seluruh role (admin, operator, dan siswa).
          Perubahan langsung terlihat sebagai pratinjau, lalu tersimpan saat menekan Simpan.
        </p>
        <div class="theme-swatches">
          <button
            v-for="c in presetColors"
            :key="c"
            type="button"
            class="theme-swatch"
            :class="{ active: form.themeColor === c }"
            :style="{ background: c }"
            :title="c"
            @click="onThemeChange(c)"
          ></button>
          <label class="theme-swatch theme-custom" :class="{ active: !presetColors.includes(form.themeColor) }">
            <input v-model="form.themeColor" type="color" class="theme-color-input" @input="applyTheme(form.themeColor)">
            <Icon name="i-lucide-palette" class="w-4 h-4" />
            <span>Custom</span>
          </label>
        </div>
        <hr class="form-divider">
        <h3 class="form-card-title">Tahun Ajaran Aktif</h3>
        <div class="form-row">
          <div class="form-group"><label>Tahun Ajaran</label><select v-model="form.activeYear" class="form-input"><option>2024/2025</option><option>2025/2026</option><option>2026/2027</option></select></div>
          <div class="form-group"><label>Semester</label><select v-model="form.activeSemester" class="form-input"><option>Ganjil</option><option>Genap</option></select></div>
        </div>
        <hr class="form-divider">
        <h3 class="form-card-title">Lokasi Sekolah</h3>
        <p class="text-[13px]" style="color: var(--text-secondary); margin-bottom: 12px;">
          Tandai lokasi sekolah di peta agar data alamat akurat. Lokasi ini dipakai untuk identitas sekolah
          dan menentukan zona waktu aplikasi (WIB/WITA/WIT). Lokasi untuk absensi QR diatur oleh Operator saat membuat QR.
        </p>
        <SchoolLocationPicker
          :model-value="{ latitude: form.latitude, longitude: form.longitude, radius: form.attendanceRadius, locationName: form.address }"
          :show-radius="false"
          @update:model-value="(v: any) => { form.latitude = v.latitude; form.longitude = v.longitude; form.attendanceRadius = v.radius; form.address = v.locationName || form.address }"
        />
        <div class="tz-badge">
          <Icon name="i-lucide-globe" class="w-4 h-4" />
          <span>Zona waktu terdeteksi: <b>{{ schoolZone }}</b> (UTC+{{ SCHOOL_TZ[schoolZone].offset }}), jam aplikasi mengikuti zona ini.</span>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="saving">
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
.page-subtitle { font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 4px; }
.form-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 24px; }
.form-card-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.form-divider { border: none; border-top: 1px solid var(--border-light); margin: 20px 0; }
.form-actions { display: flex; justify-content: flex-end; padding-top: 8px; }
.theme-swatches { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.theme-swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid var(--bg-card);
  box-shadow: 0 0 0 1px var(--border-light);
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s, box-shadow 0.15s;
}
.theme-swatch:hover { transform: scale(1.12); }
.theme-swatch.active { box-shadow: 0 0 0 2px var(--accent); transform: scale(1.1); }
.theme-custom {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--text-secondary);
  position: relative;
  overflow: hidden;
  width: auto;
  padding: 0 12px;
  border-radius: 18px;
}
.theme-color-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 10px 24px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.error-badge { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; font-size: var(--text-sm); color: #dc2626; }
.tz-badge { display: inline-flex; align-items: center; gap: 8px; margin-top: 12px; font-size: var(--text-xs); color: var(--text-secondary); background: var(--olive-bg); border: 1px solid var(--border-light); padding: 8px 12px; border-radius: 4px; }
.tz-badge b { color: var(--olive-primary); }
:deep(.leaflet-container) { font-family: inherit; }
</style>
