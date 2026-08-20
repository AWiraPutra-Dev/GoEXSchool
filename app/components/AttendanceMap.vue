<script setup lang="ts">
// Peta absensi siswa: menampilkan zona absensi (lokasi pertemuan terpilih,
// atau fallback lokasi sekolah), radius area, posisi user, jarak, dan status.
// Marker memakai ikon SVG profesional — bukan emoji.
// leaflet dimuat on-demand (hanya saat peta benar-benar dirender) supaya
// bundle JS yang diunduh browser tidak membawa library peta (±150 KB) di
// halaman-halaman yang tidak menampilkan peta.
let L: any = null
async function getL() {
  if (!L) {
    L = (await import('leaflet')).default
    await import('leaflet/dist/leaflet.css')
  }
  return L
}

const props = withDefaults(defineProps<{
  // Zona lokasi spesifik (dari jadwal pertemuan). Jika kosong → pakai lokasi sekolah.
  zone?: { latitude: number | null; longitude: number | null; radius?: number | null; locationName?: string | null } | null
  // Logo instansi/ekskul untuk marker (opsional — tampil di pin)
  logo?: string | null
}>(), { zone: null, logo: null })

const emit = defineEmits<{
  (e: 'location', v: { latitude: number; longitude: number; distance: number; inside: boolean } | null): void
}>()

const mapEl = ref<HTMLElement | null>(null)
const locating = ref(true)
const locError = ref('')
// Mode manual: GPS diblokir browser (HTTP / bukan localhost) → user bisa
// menempatkan posisinya sendiri dengan klik pada peta supaya alur absensi
// tetap bisa diuji coba / dipakai.
const manualMode = ref(false)
const zoneLat = ref<number | null>(null)
const zoneLng = ref<number | null>(null)
const zoneRadius = ref(200)
const zoneName = ref('')
const userLat = ref<number | null>(null)
const userLng = ref<number | null>(null)
const distance = ref<number | null>(null)
const inside = ref(false)
const statusReady = ref(false)

let map: import('leaflet').Map | null = null
let zoneMarker: import('leaflet').Marker | null = null
let userMarker: import('leaflet').Marker | null = null
let radiusCircle: import('leaflet').Circle | null = null

// ===== Marker profesional: pin SVG dengan bangunan sekolah =====
function buildZoneIcon(logo?: string | null): import('leaflet').DivIcon {
  const inner = logo
    ? `<img src="${logo}" alt="" style="width:16px;height:16px;border-radius:4px;object-fit:contain;background:#fff;"/>`
    : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h1"/><path d="M9 13h1"/><path d="M9 17h1"/><path d="M14 9h1"/><path d="M14 13h1"/><path d="M14 17h1"/></svg>`
  return L.divIcon({
    className: 'loc-div-icon',
    html: `<div style="position:relative;width:34px;height:34px;">
      <svg width="34" height="34" viewBox="0 0 24 24" style="position:absolute;inset:0;filter:drop-shadow(0 2px 4px rgba(15,23,42,0.35));">
        <path fill="#4F46E5" stroke="#fff" stroke-width="1.1" d="M12 1.5C7.6 1.5 4 5.1 4 9.5c0 6.2 8 13 8 13s8-6.8 8-13c0-4.4-3.6-8-8-8z"/>
        <circle cx="12" cy="9.5" r="4.2" fill="#fff"/>
      </svg>
      <div style="position:absolute;top:5px;left:9px;width:16px;height:16px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:4px;">${inner}</div>
    </div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 32],
  })
}

// Marker user: titik biru muda dengan cincin putih (gaya Google Maps)
// Dibuat malas (lazy) karena membutuhkan leaflet yang dimuat on-demand.
let userIcon: any = null

// Hitung jarak (Haversine) — sama seperti di server
function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(a))
}

function emitLocation() {
  if (userLat.value == null || userLng.value == null) {
    emit('location', null)
    return
  }
  emit('location', {
    latitude: userLat.value,
    longitude: userLng.value,
    distance: distance.value ?? 0,
    inside: inside.value,
  })
}

function updateUserMarker() {
  if (!map || userLat.value == null || userLng.value == null) return
  if (!userIcon) {
    userIcon = L.divIcon({
      className: 'loc-div-icon',
      html: `<div style="width:18px;height:18px;border-radius:50%;background:#3B82F6;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    })
  }
  if (!userMarker) {
    userMarker = L.marker([userLat.value, userLng.value], { icon: userIcon }).addTo(map)
  } else {
    userMarker.setLatLng([userLat.value, userLng.value])
  }
  const cLat = zoneLat.value ?? userLat.value
  const cLng = zoneLng.value ?? userLng.value
  const bounds = L.latLngBounds([cLat, cLng], [userLat.value, userLng.value])
  map.fitBounds(bounds.pad(0.35), { maxZoom: 17 })
}

// Pesan jelas saat GPS diblokir karena koneksi tidak aman (HTTP / bukan localhost).
const INSECURE_MSG = 'GPS diblokir browser karena aplikasi diakses lewat HTTP biasa, fitur lokasi hanya berjalan di koneksi HTTPS atau localhost. Gunakan HTTPS, akses via localhost, atau klik "Atur Lokasi Manual" untuk menandai posisi di peta.'

function locate() {
  // Cek keamanan koneksi DULU: di HTTP (bukan localhost) browser memblokir GPS.
  if (typeof window !== 'undefined' && window.isSecureContext === false) {
    locating.value = false
    // Jangan timpa status jika posisi sudah terpasang (mode manual).
    if (userLat.value == null || userLng.value == null) {
      locError.value = INSECURE_MSG
      emitLocation()
    }
    return
  }
  if (!navigator.geolocation) {
    locError.value = 'Browser ini tidak mendukung GPS. Aktifkan izin lokasi browser atau gunakan "Atur Lokasi Manual".'
    locating.value = false
    return
  }
  locating.value = true
  locError.value = ''
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      userLat.value = pos.coords.latitude
      userLng.value = pos.coords.longitude
      if (zoneLat.value != null && zoneLng.value != null) {
        distance.value = Math.round(haversineMeters(pos.coords.latitude, pos.coords.longitude, zoneLat.value, zoneLng.value))
        inside.value = distance.value <= zoneRadius.value + 30
        statusReady.value = true
        updateUserMarker()
      }
      locating.value = false
      emitLocation()
    },
    (err) => {
      locating.value = false
      locError.value = `Gagal membaca lokasi: ${err.message}. Pastikan GPS aktif dan izin lokasi diberikan, atau gunakan "Atur Lokasi Manual".`
      emitLocation()
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
  )
}

// Mode manual: aktifkan & beri tahu user untuk klik peta.
function enableManualMode() {
  manualMode.value = true
  locError.value = ''
  locating.value = false
}

// Klik pada peta (hanya berlaku di mode manual) → posisi user dipasang di titik itu.
function onMapClick(e: import('leaflet').LeafletMouseEvent) {
  if (!manualMode.value) return
  userLat.value = e.latlng.lat
  userLng.value = e.latlng.lng
  if (zoneLat.value != null && zoneLng.value != null) {
    distance.value = Math.round(haversineMeters(userLat.value, userLng.value, zoneLat.value, zoneLng.value))
    inside.value = distance.value <= zoneRadius.value + 30
    statusReady.value = true
    updateUserMarker()
  }
  emitLocation()
}

function renderZone() {
  if (!map || zoneLat.value == null || zoneLng.value == null) return
  const pos: [number, number] = [zoneLat.value, zoneLng.value]
  if (!zoneMarker) {
    zoneMarker = L.marker(pos, { icon: buildZoneIcon(props.logo) }).addTo(map)
    zoneMarker!.bindPopup(zoneName.value || 'Lokasi Absensi')
  } else {
    zoneMarker.setLatLng(pos)
    zoneMarker.setIcon(buildZoneIcon(props.logo))
  }
  if (!radiusCircle) {
    radiusCircle = L.circle(pos, {
      radius: zoneRadius.value,
      color: '#4F46E5',
      weight: 2,
      fillColor: '#4F46E5',
      fillOpacity: 0.1,
    }).addTo(map)
  } else {
    radiusCircle.setLatLng(pos)
    radiusCircle.setRadius(zoneRadius.value)
  }
  map.setView(pos, 16)
}

// Sumber zona: prioritas prop `zone` (lokasi pertemuan) → lokasi sekolah.
async function resolveZone() {
  if (props.zone?.latitude != null && props.zone.longitude != null) {
    zoneLat.value = props.zone.latitude
    zoneLng.value = props.zone.longitude
    zoneRadius.value = props.zone.radius ?? 200
    zoneName.value = props.zone.locationName || ''
    return
  }
  try {
    const inst = await $fetch<any>('/api/settings')
    zoneLat.value = inst.latitude ?? null
    zoneLng.value = inst.longitude ?? null
    zoneRadius.value = inst.attendanceRadius ?? 200
    zoneName.value = inst.name || ''
  } catch {
    locError.value = 'Lokasi absensi belum tersedia. Hubungi admin untuk mengatur lokasi.'
  }
}

onMounted(async () => {
  await getL()
  await resolveZone()
  await nextTick()
  if (!mapEl.value) return
  const lat = zoneLat.value ?? -6.9047
  const lng = zoneLng.value ?? 107.6137
  const m = L.map(mapEl.value, { scrollWheelZoom: false }).setView([lat, lng], 16)
  map = m
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19,
  }).addTo(m)
  m.on('click', onMapClick)
  renderZone()
  locate()
})

watch(() => props.zone, async () => {
  await resolveZone()
  renderZone()
  // Hitung ulang status jika user sudah punya posisi
  if (userLat.value != null && userLng.value != null && zoneLat.value != null && zoneLng.value != null) {
    distance.value = Math.round(haversineMeters(userLat.value, userLng.value, zoneLat.value, zoneLng.value))
    inside.value = distance.value <= zoneRadius.value + 30
    statusReady.value = true
    updateUserMarker()
  }
})

onUnmounted(() => {
  map?.remove()
  map = null
})

defineExpose({ locate })
</script>

<template>
  <div class="att-map">
    <div ref="mapEl" class="att-map-canvas"></div>
    <div class="att-map-status">
      <div v-if="locating" class="att-locating">
        <Icon name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
        Mendeteksi lokasi kamu...
      </div>
      <div v-else-if="locError" class="att-error">
        <Icon name="i-lucide-map-pin-off" class="w-4 h-4" />
        <div>
          <p class="att-error-text">{{ locError }}</p>
          <div class="att-error-actions">
            <button class="att-retry" @click="locate">Coba lagi</button>
            <button class="att-retry" @click="enableManualMode">
              <Icon name="i-lucide-hand" class="w-3.5 h-3.5" /> Atur Lokasi Manual
            </button>
          </div>
        </div>
      </div>
      <div v-else-if="manualMode" class="att-manual-hint">
        <Icon name="i-lucide-mouse-pointer-click" class="w-4 h-4" />
        <span>
          Mode manual aktif, <strong>klik pada peta</strong> untuk menempatkan posisi kamu
          <template v-if="!statusReady">(GPS tidak tersedia di koneksi ini)</template>
          <template v-else>(klik lagi untuk menyesuaikan)</template>.
        </span>
        <button class="att-manual-close" @click="manualMode = false">Tutup</button>
      </div>
      <div v-else-if="statusReady" class="att-status-row" :class="{ ok: inside, fail: !inside }">
        <Icon :name="inside ? 'i-lucide-check-circle-2' : 'i-lucide-x-circle'" class="w-5 h-5" />
        <div>
          <p class="att-status-main">
            {{ inside ? 'Kamu berada di dalam area absensi' : 'Kamu berada di luar area absensi' }}
          </p>
          <p class="att-status-sub">
            Jarak ke titik: <strong>{{ distance }} m</strong> · Batas area: <strong>{{ zoneRadius + 30 }} m</strong>
            <template v-if="zoneName"> · {{ zoneName }}</template>
          </p>
        </div>
        <button class="att-retry" title="Perbarui lokasi" @click="locate">
          <Icon name="i-lucide-locate-fixed" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.att-map { width: 100%; }
.att-map-canvas { height: 190px; border-radius: 8px; border: 1px solid var(--border-light); z-index: 0; }
.att-map-status { margin-top: 8px; }
.att-locating { display: flex; align-items: center; gap: 8px; font-size: var(--text-sm); color: var(--text-secondary); }
.att-error { display: flex; align-items: flex-start; gap: 10px; background: rgba(212,106,90,0.08); border: 1px solid rgba(212,106,90,0.3); border-radius: 8px; padding: 10px 12px; color: var(--red-orange); }
.att-error-text { font-size: var(--text-sm); }
.att-error-actions { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
.att-error-actions .att-retry { margin-left: 0; border: 1px solid currentColor; border-radius: 6px; padding: 4px 10px; }
.att-manual-hint { display: flex; align-items: center; gap: 8px; background: rgba(79,70,229,0.08); border: 1px dashed var(--accent-border, rgba(79,70,229,0.45)); border-radius: 8px; padding: 8px 12px; font-size: var(--text-xs); color: var(--accent); margin-top: 8px; }
.att-manual-close { margin-left: auto; background: none; border: none; color: inherit; cursor: pointer; font-size: var(--text-xs); font-weight: var(--font-semibold); padding: 2px 6px; border-radius: 4px; }
.att-manual-close:hover { background: rgba(79,70,229,0.12); }
.att-status-row { display: flex; align-items: center; gap: 10px; border-radius: 8px; padding: 8px 12px; }
.att-status-row.ok { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.35); color: #0f9d6e; }
.att-status-row.fail { background: rgba(212,106,90,0.08); border: 1px solid rgba(212,106,90,0.3); color: var(--red-orange); }
.att-status-main { font-size: var(--text-sm); font-weight: var(--font-semibold); }
.att-status-sub { font-size: var(--text-xs); opacity: 0.85; margin-top: 2px; }
.att-retry { margin-left: auto; background: none; border: none; cursor: pointer; color: inherit; display: inline-flex; align-items: center; padding: 4px; border-radius: 6px; font-size: var(--text-xs); font-weight: var(--font-medium); }
.att-retry:hover { background: rgba(0,0,0,0.06); }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
