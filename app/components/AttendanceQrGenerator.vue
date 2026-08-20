<script setup lang="ts">
// Generator sesi absensi QR — dipakai bersama halaman Admin & Operator Ekskul.
// - Admin (tidak terikat ekskul) → bebas memilih ekskul dari dropdown.
// - Operator ekskul              → terkunci otomatis ke ekskul miliknya.
// Server tetap memvalidasi ulang cakupan ekskul lewat assertScope.
import QRCode from 'qrcode'

const auth = useAuthStore()
const admin = useMasterDataStore()
const { myEkskul, isOperator, isScopedOperator } = useEkskulScope()

// Diberi tahu ke halaman saat sesi baru berhasil dibuat (untuk refresh daftar).
const emit = defineEmits<{ (e: 'created'): void }>()

onMounted(() => {
  admin.fetchReference()
  // Operator ekskul: QR otomatis untuk ekskul miliknya
  if (isScopedOperator.value && myEkskul.value) selectedEkskulId.value = myEkskul.value.id
})

const generating = ref(false)
const errorMsg = ref('')
const activeSession = ref<{ id: string; token: string; expiresAt: string; locationName?: string | null } | null>(null)
const selectedEkskulId = ref('')

// QR asli (bisa di-scan kamera/aplikasi) — berisi tautan langsung ke halaman
// absensi siswa dengan token terisi otomatis.
const qrDataUrl = ref('')
const qrDeepLink = ref('')
const showCard = ref(false)

// Lokasi geofencing untuk sesi absensi ini (diatur saat membuat QR).
// Default: titik & radius lokasi sekolah (bisa digeser/diubah per sesi).
const qrLocation = ref<{ latitude: number | null; longitude: number | null; radius: number; locationName?: string | null }>({
  latitude: auth.institution?.latitude ?? null,
  longitude: auth.institution?.longitude ?? null,
  radius: auth.institution?.attendanceRadius ?? 200,
  locationName: auth.institution?.address ?? null,
})

async function generateQr() {
  if (!selectedEkskulId.value) {
    errorMsg.value = 'Pilih ekskul terlebih dahulu.'
    return
  }
  generating.value = true
  errorMsg.value = ''
  try {
    const res = await $fetch<{ id: string; token: string; expiresAt: string; locationName?: string | null }>('/api/operator/attendance/session', {
      method: 'POST',
      body: {
        extracurricularId: selectedEkskulId.value,
        latitude: qrLocation.value.latitude,
        longitude: qrLocation.value.longitude,
        radius: qrLocation.value.radius,
        locationName: qrLocation.value.locationName,
      }
    })
    activeSession.value = res
    // Tautan langsung: saat QR di-scan kamera HP → halaman absensi siswa terbuka
    // dengan token sudah terisi → siswa tinggal klik Absen.
    qrDeepLink.value = `${window.location.origin}/siswa/attendance?token=${res.token}`
    qrDataUrl.value = await QRCode.toDataURL(qrDeepLink.value, {
      width: 640,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#0F172A', light: '#FFFFFF' },
    })
    emit('created')
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal membuat QR absensi.'
  }
  generating.value = false
}

function downloadQrPng() {
  if (!qrDataUrl.value) return
  const a = document.createElement('a')
  a.href = qrDataUrl.value
  a.download = `qr-absensi-${(selectedEkskulId.value && admin.extracurriculars.find(e => e.id === selectedEkskulId.value)?.name || 'ekskul').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`
  a.click()
}

function openCard() {
  if (!qrDataUrl.value || !activeSession.value) return
  showCard.value = true
}

const schoolZone = computed(() => getSchoolZone(auth.institution))
const ekskulName = computed(() => {
  if (myEkskul.value) return myEkskul.value.name
  return admin.extracurriculars.find(e => e.id === selectedEkskulId.value)?.name || 'Ekskul'
})
</script>

<template>
  <div class="qr-generator-card">
    <div class="gen-header">
      <div class="gen-header-icon"><Icon name="i-lucide-qr-code" class="w-4 h-4" /></div>
      <div>
        <h3 class="gen-title">Buat Sesi Absensi (QR)</h3>
        <p class="gen-sub">Siswa absen dengan memindai token QR, mereka wajib berada di dalam area lokasi yang ditentukan di bawah ini.</p>
      </div>
    </div>

    <div class="form-row" style="max-width: 400px;">
      <div class="form-group">
        <label>Ekskul</label>
        <select v-if="!isOperator" v-model="selectedEkskulId" class="form-input" required>
          <option disabled value="">Pilih Ekskul</option>
          <option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
        </select>
        <div v-else-if="myEkskul" class="scope-badge"><Icon name="i-lucide-shield" class="w-4 h-4" /> {{ myEkskul.name }}</div>
        <div v-else class="scope-warning"><Icon name="i-lucide-alert-circle" class="w-4 h-4" /> Akun belum diikat ke ekskul. Hubungi admin.</div>
      </div>
    </div>

    <div class="qr-location-box">
      <div class="form-group">
        <label>Titik Lokasi Absensi (siswa harus berada di area ini saat scan)</label>
        <SchoolLocationPicker v-model="qrLocation" :show-radius="true" />
      </div>
      <p class="loc-note">
        <Icon name="i-lucide-info" class="w-3.5 h-3.5" />
        Default mengikuti lokasi sekolah. Geser marker atau ketik alamat untuk menyesuaikan titik absensi sesi ini.
      </p>
    </div>

    <p v-if="errorMsg" class="error-badge">
      <Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
      <span>{{ errorMsg }}</span>
    </p>

    <button class="btn-primary" :disabled="generating" @click="generateQr">
      <Icon name="i-lucide-qr-code" class="w-4 h-4" />
      {{ generating ? 'Membuat QR...' : 'Buat QR Absensi' }}
    </button>

    <div v-if="activeSession" class="qr-result">
      <div class="qr-img-wrap">
        <img v-if="qrDataUrl" :src="qrDataUrl" alt="QR Absensi" class="qr-img" />
        <div v-else class="qr-loading"><Icon name="i-lucide-loader-2" class="w-6 h-6 spin-icon" /></div>
      </div>
      <div class="qr-info">
        <p class="qr-token">Token: <strong>{{ activeSession.token }}</strong></p>
        <p class="qr-expires">Berlaku sampai: {{ activeSession.expiresAt }} {{ schoolZone }}</p>
        <p v-if="activeSession.locationName" class="qr-location-name"><Icon name="i-lucide-map-pin" class="w-3.5 h-3.5" /> {{ activeSession.locationName }}</p>
        <p class="qr-hint" style="color: var(--text-muted); font-size: var(--text-sm);">Siswa scan QR ini dengan kamera HP, halaman absensi terbuka otomatis dan kehadiran langsung tercatat.</p>
        <div class="qr-actions">
          <button class="btn-small" @click="downloadQrPng"><Icon name="i-lucide-image-down" class="w-3.5 h-3.5" /> Unduh QR</button>
          <button class="btn-small btn-small-primary" @click="openCard"><Icon name="i-lucide-printer" class="w-3.5 h-3.5" /> Lihat &amp; Cetak Kartu</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal kartu absensi (cetak / unduh PNG) -->
  <Teleport to="body">
    <div v-if="showCard && activeSession" class="modal-overlay" @click.self="showCard = false">
      <div class="modal-content card-modal">
        <AttendanceQrCard
          :qr-data-url="qrDataUrl"
          :qr-deep-link="qrDeepLink"
          :ekskul-name="ekskulName"
          :institution-name="auth.institution?.name ?? 'Sekolah'"
          :institution-logo="auth.institution?.logo ?? null"
          :website="auth.institution?.website ?? null"
          :token="activeSession.token"
          :expires-at="activeSession.expiresAt"
          :zone="schoolZone"
          :location-name="activeSession.locationName ?? null"
          @close="showCard = false"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.qr-generator-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 24px; }
.gen-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; }
.gen-header-icon { width: 40px; height: 40px; border-radius: 10px; background: var(--olive-bg); color: var(--olive-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.gen-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); }
.gen-sub { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px; }
.form-row { margin-bottom: 16px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); background: var(--bg-card); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.scope-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--olive-bg); color: var(--olive-primary); border: 1px solid var(--olive-light); border-radius: 4px; font-size: var(--text-sm); font-weight: var(--font-semibold); }
.scope-warning { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: #fef2f2; color: var(--red-orange); border: 1px solid #fecaca; border-radius: 4px; font-size: var(--text-sm); font-weight: var(--font-medium); }
.qr-location-box { margin: 4px 0 16px; padding: 16px; background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 8px; }
.loc-note { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin-top: 10px; }
.error-badge { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; font-size: var(--text-sm); color: #dc2626; margin-bottom: 14px; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.qr-result { display: flex; gap: 24px; margin-top: 24px; align-items: center; flex-wrap: wrap; }
.qr-img-wrap {
  width: 190px; height: 190px; flex-shrink: 0;
  border: 1px solid var(--border-light); border-radius: 12px;
  background: white; padding: 10px; display: flex; align-items: center; justify-content: center;
}
.qr-img { width: 100%; height: 100%; object-fit: contain; display: block; }
.qr-loading { color: var(--text-muted); }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.qr-token { font-size: var(--text-md); margin-bottom: 4px; }
.qr-expires { font-size: var(--text-sm); color: var(--text-secondary); }
.qr-location-name { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 4px; }
.qr-actions { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
.btn-small { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; font-size: var(--text-xs); font-weight: var(--font-semibold); border: 1px solid var(--border-light); border-radius: 6px; background: white; color: var(--text-primary); cursor: pointer; transition: all 0.2s; }
.btn-small:hover { background: var(--bg-hover); border-color: var(--accent); }
.btn-small-primary { background: var(--olive-primary); border-color: var(--olive-primary); color: white; }
.btn-small-primary:hover { background: var(--olive-dark); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(2px); padding: 20px; }
.modal-content { background: var(--bg-card); border-radius: 14px; padding: 20px; max-width: 92vw; max-height: 92vh; overflow-y: auto; box-shadow: 0 20px 50px rgba(0,0,0,0.25); }
.card-modal { width: 680px; }
</style>
