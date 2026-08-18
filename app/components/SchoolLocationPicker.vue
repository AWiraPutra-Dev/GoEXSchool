<script setup lang="ts">
// Picker lokasi (sekolah / area absensi QR).
// Bisa: ketik nama tempat di kotak pencarian (geocoding OpenStreetMap/Nominatim),
// pakai lokasi GPS sendiri, klik peta, atau drag marker.
// Props:
//   modelValue → { latitude, longitude, radius, locationName? }
//   showRadius → tampilkan slider radius geofencing (default true).
//                Untuk Pengaturan Instansi (identitas & zona waktu) cukup false.
// Hanya berjalan di client (SSR dimatikan — aplikasi SPA murni).
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface SchoolLocationValue {
  latitude: number | null
  longitude: number | null
  radius: number
  locationName?: string | null
}

const props = withDefaults(defineProps<{
  modelValue: SchoolLocationValue
  showRadius?: boolean
}>(), { showRadius: true })
const emit = defineEmits<{ (e: 'update:modelValue', v: SchoolLocationValue): void }>()

const mapEl = ref<HTMLElement | null>(null)
const mapLoading = ref(false)
const locStatus = ref('')
let map: L.Map | null = null
let marker: L.Marker | null = null
let circle: L.Circle | null = null
let placed = false

// ---- Pencarian tempat (geocoding) ----
const query = ref(props.modelValue.locationName || '')
const results = ref<Array<{ lat: string; lon: string; name: string; display_name: string }>>([])
const searchLoading = ref(false)
const searchError = ref('')
let searchTimer: ReturnType<typeof setTimeout> | null = null

// Marker SVG custom agar ikon Leaflet default (png) tidak hilang
const iconUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 24 24"><path fill="#4F46E5" stroke="#fff" stroke-width="1.2" d="M12 0C7 0 3 4 3 9c0 6.5 9 15 9 15s9-8.5 9-15c0-5-4-9-9-9z"/><circle cx="12" cy="9" r="3.4" fill="#fff"/></svg>`)}`
const customIcon = L.icon({ iconUrl, iconSize: [34, 44], iconAnchor: [17, 42], popupAnchor: [0, -40] })

// Koordinat default: SMKN 4 Bandung (Jl. Kliningan No. 6, Lengkong)
const DEFAULT_LAT = -6.9047
const DEFAULT_LNG = 107.6137

// Gambar/geser marker di peta. `notify` = true saat interaksi user (emit ke parent).
function setMarker(lat: number, lng: number, name?: string | null, notify = true) {
  if (!map) return
  placed = true
  if (!marker) {
    marker = L.marker([lat, lng], { icon: customIcon, draggable: true }).addTo(map)
    marker.on('dragend', () => {
      const p = marker!.getLatLng()
      emitValue(p.lat, p.lng)
    })
  } else {
    marker.setLatLng([lat, lng])
  }
  map.setView([lat, lng], map.getZoom() < 16 ? 16 : map.getZoom())
  drawRadius()
  if (notify) emitValue(lat, lng, name)
}

function drawRadius() {
  if (!map || !placed || !props.showRadius) return
  const pos = props.modelValue.latitude != null && props.modelValue.longitude != null
    ? [props.modelValue.latitude, props.modelValue.longitude] as [number, number]
    : [DEFAULT_LAT, DEFAULT_LNG] as [number, number]
  if (!circle) {
    circle = L.circle(pos, { radius: props.modelValue.radius, color: '#4F46E5', weight: 2, fillColor: '#4F46E5', fillOpacity: 0.12 }).addTo(map)
  } else {
    circle.setLatLng(pos)
    circle.setRadius(props.modelValue.radius)
  }
}

function emitValue(lat: number, lng: number, name?: string | null) {
  emit('update:modelValue', {
    latitude: lat,
    longitude: lng,
    radius: props.modelValue.radius,
    locationName: name ?? props.modelValue.locationName,
  })
}

function onMapClick(e: L.LeafletMouseEvent) {
  setMarker(e.latlng.lat, e.latlng.lng)
  locStatus.value = `Lokasi ditandai: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`
}

// ---- Pencarian tempat via OpenStreetMap Nominatim (gratis, tanpa API key) ----
async function searchPlace() {
  const q = query.value.trim()
  if (!q) {
    results.value = []
    return
  }
  searchLoading.value = true
  searchError.value = ''
  try {
    const res = await $fetch<any[]>(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6`
    )
    results.value = (res || []).map((r) => ({
      lat: r.lat,
      lon: r.lon,
      name: r.name || r.display_name?.split(',')[0] || 'Hasil pencarian',
      display_name: r.display_name,
    }))
    if (!results.value.length) searchError.value = `Tidak ditemukan hasil untuk "${q}". Coba kata kunci lain.`
  } catch {
    searchError.value = 'Gagal mencari lokasi. Periksa koneksi internet lalu coba lagi.'
    results.value = []
  } finally {
    searchLoading.value = false
  }
}

function onQueryInput() {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(searchPlace, 450)
}

function pickResult(r: { lat: string; lon: string; display_name: string }) {
  const lat = Number(r.lat)
  const lng = Number(r.lon)
  query.value = r.display_name
  results.value = []
  setMarker(lat, lng, r.display_name)
  locStatus.value = `Lokasi dipilih: ${r.display_name}`
}

function clearSearch() {
  query.value = ''
  results.value = []
  searchError.value = ''
  if (searchTimer) clearTimeout(searchTimer)
}

function useMyLocation() {
  if (!navigator.geolocation) {
    locStatus.value = 'Browser ini tidak mendukung GPS.'
    return
  }
  mapLoading.value = true
  locStatus.value = 'Mendeteksi lokasi kamu...'
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      mapLoading.value = false
      locStatus.value = `Lokasi terdeteksi: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`
      setMarker(pos.coords.latitude, pos.coords.longitude)
    },
    (err) => {
      mapLoading.value = false
      locStatus.value = `Gagal mendeteksi lokasi: ${err.message}. Ketik nama tempat di pencarian atau klik pada peta untuk menandai lokasi.`
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  )
}

onMounted(() => {
  nextTick(() => {
    if (!mapEl.value) return
    const lat = props.modelValue.latitude ?? DEFAULT_LAT
    const lng = props.modelValue.longitude ?? DEFAULT_LNG
    map = L.map(mapEl.value, { scrollWheelZoom: true }).setView([lat, lng], 16)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)
    map.on('click', onMapClick)
    // Saat mount: tampilkan marker tanpa emit, supaya parent tidak
    // ke-overwrite dengan koordinat default sebelum user memilih.
    setMarker(lat, lng, null, false)
  })
})

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
  map?.remove()
  map = null
})

watch(() => props.modelValue.radius, () => drawRadius())
watch(() => props.modelValue.latitude, (v) => {
  if (v != null && props.modelValue.longitude != null) setMarker(v, props.modelValue.longitude, null, false)
})
</script>

<template>
  <div class="loc-picker">
    <div class="loc-map-wrap">
      <div ref="mapEl" class="loc-map"></div>

      <!-- Pencarian tempat / alamat di peta -->
      <div class="loc-search">
        <div class="loc-search-input-wrap">
          <Icon v-if="searchLoading" name="i-lucide-loader-2" class="loc-search-icon spin-icon" />
          <Icon v-else name="i-lucide-search" class="loc-search-icon" />
          <input
            v-model="query"
            type="text"
            class="loc-search-input"
            placeholder="Cari nama tempat / sekolah / alamat di peta…"
            @input="onQueryInput"
            @keydown.enter.prevent="searchPlace"
          >
          <button v-if="query" type="button" class="loc-search-clear" title="Bersihkan" @click="clearSearch">
            <Icon name="i-lucide-x" class="w-3.5 h-3.5" />
          </button>
        </div>
        <ul v-if="results.length" class="loc-results">
          <li v-for="(r, i) in results" :key="i" class="loc-result" @click="pickResult(r)">
            <Icon name="i-lucide-map-pin" class="loc-result-icon" />
            <div class="loc-result-text">
              <span class="loc-result-name">{{ r.name }}</span>
              <span class="loc-result-addr">{{ r.display_name }}</span>
            </div>
          </li>
        </ul>
        <p v-if="searchError" class="loc-search-error">{{ searchError }}</p>
      </div>
    </div>

    <div class="loc-controls">
      <button type="button" class="loc-btn" :disabled="mapLoading" @click="useMyLocation">
        <Icon v-if="mapLoading" name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
        <Icon v-else name="i-lucide-locate-fixed" class="w-4 h-4" />
        {{ mapLoading ? 'Mendeteksi...' : 'Pakai Lokasi Saya (GPS)' }}
      </button>
      <div v-if="showRadius" class="loc-radius">
        <label>Radius area absensi: <strong>{{ modelValue.radius }} m</strong></label>
        <input
          type="range"
          :value="modelValue.radius"
          min="50"
          max="2000"
          step="50"
          @input="emit('update:modelValue', { ...modelValue, radius: Number(($event.target as HTMLInputElement).value) })"
        >
        <span class="loc-hint">Siswa harus berada di dalam lingkaran ini untuk bisa absen QR. (Batas wajar area sekolah: 50–500 m)</span>
      </div>
    </div>
    <p v-if="locStatus" class="loc-status">{{ locStatus }}</p>
    <p class="loc-hint">
      Ketik nama tempat di kotak pencarian lalu pilih hasilnya, klik pada peta, atau drag marker untuk menyesuaikan lokasi.
      <template v-if="showRadius">Radius geofencing dipakai saat siswa scan QR absensi.</template>
      <template v-else>Lokasi ini dipakai sebagai identitas sekolah dan penentu zona waktu aplikasi (WIB/WITA/WIT).</template>
      <template v-if="modelValue.latitude != null && modelValue.longitude != null">Koordinat: {{ modelValue.latitude.toFixed(5) }}, {{ modelValue.longitude.toFixed(5) }}</template>
    </p>
  </div>
</template>

<style scoped>
.loc-picker { width: 100%; }
.loc-map-wrap { position: relative; }
.loc-map { height: 220px; border-radius: 8px; border: 1px solid var(--border-light); z-index: 0; }

/* ===== Pencarian tempat di peta ===== */
.loc-search { position: absolute; top: 12px; left: 12px; right: 12px; z-index: 500; max-width: 420px; }
.loc-search-input-wrap {
  display: flex; align-items: center; gap: 8px;
  background: var(--bg-card); border: 1px solid var(--border-medium);
  border-radius: 8px; padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12);
}
.loc-search-input-wrap:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent); }
.loc-search-icon { width: 16px; height: 16px; color: var(--text-muted); flex-shrink: 0; }
.loc-search-input { flex: 1; border: none; outline: none; background: transparent; font-size: var(--text-sm); color: var(--text-primary); min-width: 0; }
.loc-search-clear {
  width: 22px; height: 22px; border-radius: 6px; border: none; background: var(--bg-hover);
  color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.loc-search-clear:hover { color: var(--text-primary); }
.loc-results {
  list-style: none; margin: 6px 0 0; padding: 4px; max-height: 240px; overflow-y: auto;
  background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
}
.loc-result {
  display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px;
  border-radius: 6px; cursor: pointer; transition: background 0.15s;
}
.loc-result:hover { background: var(--bg-hover); }
.loc-result-icon { width: 16px; height: 16px; color: var(--accent); flex-shrink: 0; margin-top: 1px; }
.loc-result-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.loc-result-name { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.loc-result-addr { font-size: 11px; color: var(--text-muted); line-height: 1.4; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.loc-search-error { font-size: var(--text-xs); color: var(--red-orange); margin: 6px 2px 0; background: var(--bg-card); padding: 6px 10px; border-radius: 6px; border: 1px solid var(--border-light); }

/* ===== Kontrol bawah ===== */
.loc-controls { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 12px; }
.loc-btn {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--bg-main); border: 1px solid var(--border-light);
  border-radius: 8px; padding: 8px 14px; font-size: var(--text-sm);
  font-weight: var(--font-semibold); color: var(--text-primary);
  cursor: pointer; transition: all 0.2s;
}
.loc-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
.loc-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.loc-radius { flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 6px; }
.loc-radius label { font-size: var(--text-sm); color: var(--text-primary); }
.loc-radius input[type='range'] { width: 100%; accent-color: var(--accent, #4F46E5); }
.loc-hint { font-size: 11px; color: var(--text-muted); }
.loc-status { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 8px; }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
