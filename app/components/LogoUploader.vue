<script setup lang="ts">
// Komponen upload logo (sekolah / ekskul) — reusable.
// Props:
//   modelValue   → URL logo saat ini (string | null)
//   size         → ukuran pratinjau (px), default 80
// Emit: update:modelValue (URL baru / null saat dihapus)
const props = defineProps<{ modelValue?: string | null; size?: number }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string | null): void }>()

const uploading = ref(false)
const errorMsg = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const size = computed(() => props.size ?? 80)

// ---- Hapus background ----
// Dikerjakan di client pakai <canvas> — ringan, offline, tanpa API eksternal.
// Pratinjau digambar langsung ke <canvas> (tanpa encode PNG) supaya hasil
// muncul hampir instan — tidak ada lagi spinner yang muter lama.
const showBg = ref(false)
const bgBusy = ref(false)
const bgSaving = ref(false)
const ready = ref(false) // hasil siap disimpan?
const tolerance = ref(40) // kepekaan 0–100
const sourceImgEl = ref<HTMLImageElement | null>(null)
const resultCanvas = ref<HTMLCanvasElement | null>(null)
const previewCanvas = ref<HTMLCanvasElement | null>(null)

async function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorMsg.value = 'File harus berupa gambar (PNG/JPG/WebP).'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    errorMsg.value = 'Ukuran logo maksimal 2MB.'
    return
  }
  uploading.value = true
  errorMsg.value = ''
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/operator/upload', { method: 'POST', body: fd })
    emit('update:modelValue', res.url)
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal mengunggah logo.'
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

function removeLogo() {
  emit('update:modelValue', null)
}

function isCrossOrigin(url: string): boolean {
  try {
    return new URL(url, window.location.href).origin !== window.location.origin
  } catch {
    return true
  }
}

// Muat gambar. Untuk URL same-origin (kasus umum: /uploads/...) langsung pakai
// <img> tanpa fetch tambahan → lebih cepat. Untuk URL beda origin, ambil bytes
// dulu (object URL) supaya canvas tidak tainted.
function loadSourceImage(): Promise<HTMLImageElement> {
  if (!props.modelValue) return Promise.reject(new Error('Belum ada logo.'))
  const src = props.modelValue
  if (isCrossOrigin(src)) {
    return $fetch<Blob>(src, { responseType: 'blob' })
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image()
          img.onload = () => { URL.revokeObjectURL(url); resolve(img) }
          img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Gagal memuat gambar untuk diproses.')) }
          img.src = url
        })
      })
  }
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Gagal memuat gambar untuk diproses.'))
    img.src = src
  })
}

async function openBgPanel() {
  if (!props.modelValue) return
  errorMsg.value = ''
  showBg.value = true
  bgBusy.value = true
  ready.value = false
  try {
    sourceImgEl.value = await loadSourceImage()
    drawPreview() // gambar asli langsung tampil — tanpa menunggu proses
    processBg()   // proses hapus background — cepat, langsung ganti pratinjau
  } catch (e: any) {
    errorMsg.value = e?.message || 'Gagal membuka panel hapus background.'
    showBg.value = false
  } finally {
    bgBusy.value = false
  }
}

// Warna background diambil dari rata-rata 4 pojok gambar (logo biasanya
// background-nya polos di tepi). Menangani putih, abu-abu terang, maupun
// warna solid lainnya — bukan cuma putih murni.
function sampleBgColor(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const P = Math.max(2, Math.round(Math.min(w, h) * 0.05))
  const corners: [number, number][] = [
    [0, 0], [w - P, 0], [0, h - P], [w - P, h - P],
  ]
  let r = 0, g = 0, b = 0, n = 0
  for (const [x, y] of corners) {
    const d = ctx.getImageData(Math.max(0, x), Math.max(0, y), P, P).data
    for (let i = 0; i < d.length; i += 4) {
      r += d[i]!
      g += d[i + 1]!
      b += d[i + 2]!
      n++
    }
  }
  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) }
}

// Hapus piksel yang warnanya dekat dengan background → transparan, dengan
// zona transisi agar tepi logo tidak patah-patah. Loop ditulis ketat supaya
// sangat cepat (maks 512×512 px, jauh di bawah 100 ms).
function removeBg(img: HTMLImageElement, tol: number): HTMLCanvasElement {
  const MAX = 512
  const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight))
  const w = Math.max(1, Math.round(img.naturalWidth * scale))
  const h = Math.max(1, Math.round(img.naturalHeight * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, w, h)
  const bg = sampleBgColor(ctx, w, h)
  const imageData = ctx.getImageData(0, 0, w, h)
  const d = imageData.data
  const EDGE = 24 // lebar zona transisi agar tepi tidak patah
  const t = tol * 1.6
  const tEdge = t + EDGE
  const br = bg.r, bgc = bg.g, bb = bg.b
  for (let i = 0; i < d.length; i += 4) {
    let dr = d[i]! - br; if (dr < 0) dr = -dr
    let dg = d[i + 1]! - bgc; if (dg < 0) dg = -dg
    let db = d[i + 2]! - bb; if (db < 0) db = -db
    let dist = dr > dg ? dr : dg
    if (db > dist) dist = db
    if (dist <= t) {
      d[i + 3] = 0
    } else if (dist <= tEdge) {
      d[i + 3] = ((dist - t) / EDGE * (d[i + 3] ?? 255)) | 0
    }
  }
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

// Proses hapus background + langsung tampilkan ke canvas pratinjau.
function processBg() {
  if (!sourceImgEl.value) return
  resultCanvas.value = removeBg(sourceImgEl.value, tolerance.value)
  const cv = previewCanvas.value
  if (cv) {
    cv.width = resultCanvas.value.width
    cv.height = resultCanvas.value.height
  }
  drawPreview()
  ready.value = true
}

// Gambar asli (saat masih memuat/proses) atau hasil hapus background ke canvas.
function drawPreview() {
  const cv = previewCanvas.value
  if (!cv) return
  const ctx = cv.getContext('2d')
  if (!ctx) return
  ctx.clearRect(0, 0, cv.width, cv.height)
  if (resultCanvas.value) {
    ctx.drawImage(resultCanvas.value, 0, 0)
  } else if (sourceImgEl.value) {
    const img = sourceImgEl.value
    cv.width = img.naturalWidth
    cv.height = img.naturalHeight
    ctx.drawImage(img, 0, 0)
  }
}

// Slider: throttle dengan requestAnimationFrame supaya geser tetap mulus
// (proses ulang hanya sekali per frame, tidak menumpuk).
let rafId = 0
function onTolInput(e: Event) {
  tolerance.value = Number((e.target as HTMLInputElement).value)
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(processBg)
}

function closeBg() {
  showBg.value = false
  bgBusy.value = false
  bgSaving.value = false
  ready.value = false
  sourceImgEl.value = null
  resultCanvas.value = null
  errorMsg.value = ''
}

async function saveBg() {
  if (!resultCanvas.value || !ready.value) return
  bgSaving.value = true
  errorMsg.value = ''
  try {
    const blob = await new Promise<Blob | null>((resolve) => resultCanvas.value!.toBlob(resolve, 'image/png'))
    if (!blob) throw new Error('Gagal memproses gambar menjadi PNG.')
    const fd = new FormData()
    fd.append('file', blob, 'logo-tanpa-background.png')
    const res = await $fetch<{ url: string }>('/api/operator/upload', { method: 'POST', body: fd })
    emit('update:modelValue', res.url)
    closeBg()
  } catch (e: any) {
    errorMsg.value = e?.data?.message || e?.message || 'Gagal menyimpan logo tanpa background.'
  } finally {
    bgSaving.value = false
  }
}
</script>

<template>
  <div class="logo-uploader">
    <div class="logo-preview" :style="{ width: size + 'px', height: size + 'px' }">
      <img v-if="modelValue" :src="modelValue" alt="Logo" class="logo-img" />
      <Icon v-else name="i-lucide-image" class="w-8 h-8" style="color: var(--text-muted);" />
      <div v-if="uploading" class="logo-uploading">
        <Icon name="i-lucide-loader-2" class="w-5 h-5 spin-icon" />
      </div>
    </div>
    <div class="logo-actions">
      <button type="button" class="logo-btn" :disabled="uploading" @click="fileInput?.click()">
        <Icon name="i-lucide-upload" class="w-4 h-4" />
        {{ uploading ? 'Mengunggah...' : modelValue ? 'Ganti Logo' : 'Upload Logo' }}
      </button>
      <button v-if="modelValue" type="button" class="logo-btn" :disabled="bgBusy || bgSaving" title="Hapus background polos (putih/terang/warna solid) dari logo" @click="openBgPanel">
        <Icon :name="bgBusy ? 'i-lucide-loader-2' : 'i-lucide-eraser'" class="w-4 h-4" :class="{ 'spin-icon': bgBusy }" />
        {{ bgBusy ? 'Memproses...' : 'Hapus Background' }}
      </button>
      <button v-if="modelValue" type="button" class="logo-btn logo-btn-remove" @click="removeLogo">
        <Icon name="i-lucide-trash-2" class="w-4 h-4" />
        Hapus
      </button>
      <input ref="fileInput" type="file" accept="image/*" class="hidden-input" @change="onFileSelected">
    </div>

    <!-- Panel hapus background -->
    <div v-if="showBg" class="bg-panel">
      <div class="bg-panel-head">
        <span class="bg-panel-title">
          <Icon name="i-lucide-eraser" class="w-4 h-4" />
          Hapus Background
        </span>
        <button type="button" class="bg-close" title="Tutup" @click="closeBg">
          <Icon name="i-lucide-x" class="w-4 h-4" />
        </button>
      </div>

      <div class="bg-preview-wrap">
        <div class="bg-preview checker" :style="{ width: size + 'px', height: size + 'px' }">
          <canvas ref="previewCanvas" class="bg-canvas"></canvas>
        </div>
        <p class="bg-note">Pratinjau hasil. Area kotak-kotak artinya transparan. Hasil muncul seketika.</p>
      </div>

      <div class="bg-slider-row">
        <label>Kepekaan hapus</label>
        <input
          type="range"
          :value="tolerance"
          min="0"
          max="100"
          step="1"
          @input="onTolInput"
        >
        <span class="bg-tol-val">{{ tolerance }}</span>
      </div>
      <p class="bg-hint">Geser ke kanan untuk menghapus lebih banyak (hati-hati bagian logo yang warnanya mirip background ikut terhapus). Geser ke kiri agar lebih aman.</p>

      <div class="bg-actions">
        <button type="button" class="logo-btn" @click="closeBg">Batal</button>
        <button
          type="button"
          class="logo-btn logo-btn-primary"
          :disabled="bgBusy || bgSaving || !ready"
          @click="saveBg"
        >
          <Icon :name="bgSaving ? 'i-lucide-loader-2' : 'i-lucide-check'" class="w-4 h-4" :class="{ 'spin-icon': bgSaving }" />
          {{ bgBusy ? 'Memproses...' : bgSaving ? 'Menyimpan...' : 'Simpan Tanpa Background' }}
        </button>
      </div>
    </div>

    <p v-if="errorMsg" class="logo-error">
      <Icon name="i-lucide-alert-circle" class="w-4 h-4" /> {{ errorMsg }}
    </p>
    <p class="logo-hint">Format PNG/JPG/WebP, maks 2MB. Logo tampil di header, konten, dan kop surat. Logo yang berlatar polos (putih/terang/warna solid) bisa dihilangkan background-nya lewat tombol "Hapus Background".</p>
  </div>
</template>

<style scoped>
.logo-uploader { display: flex; flex-direction: column; gap: 12px; align-items: flex-start; }
.logo-preview {
  border: 2px dashed var(--border-light);
  border-radius: 12px;
  background: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}
/* Latar kotak-kotak agar transparansi terlihat jelas */
.checker {
  background:
    repeating-conic-gradient(#E2E8F0 0% 25%, #FFFFFF 0% 50%) 0 0 / 16px 16px;
}
.logo-img { width: 100%; height: 100%; object-fit: contain; background: transparent; }
.logo-uploading {
  position: absolute; inset: 0;
  background: rgba(255,255,255,0.85);
  display: flex; align-items: center; justify-content: center;
}
.bg-canvas { width: 100%; height: 100%; display: block; }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.logo-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.logo-btn {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--bg-card); color: var(--text-primary);
  font-size: var(--text-sm); font-weight: var(--font-semibold);
  padding: 8px 16px; border-radius: 6px;
  border: 1px solid var(--border-light); cursor: pointer;
  transition: all 0.2s;
}
.logo-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
.logo-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.logo-btn-remove { color: var(--red-orange); }
.logo-btn-remove:hover:not(:disabled) { border-color: var(--red-orange); background: #fef2f2; }
.logo-btn-primary { background: var(--accent); border-color: var(--accent); color: white; }
.logo-btn-primary:hover:not(:disabled) { background: var(--accent-dark); color: white; }
.hidden-input { display: none; }
.logo-error { display: flex; align-items: center; gap: 8px; font-size: var(--text-xs); color: #dc2626; }
.logo-hint { font-size: var(--text-xs); color: var(--text-muted); }

/* Panel hapus background */
.bg-panel {
  width: 100%; max-width: 420px;
  border: 1px solid var(--border-light); border-radius: 8px;
  background: var(--bg-main); padding: 14px;
  display: flex; flex-direction: column; gap: 12px;
}
.bg-panel-head { display: flex; align-items: center; justify-content: space-between; }
.bg-panel-title { display: inline-flex; align-items: center; gap: 8px; font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--text-primary); }
.bg-close {
  width: 26px; height: 26px; border-radius: 6px; border: none;
  background: var(--bg-hover); color: var(--text-muted); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.bg-close:hover { color: var(--text-primary); }
.bg-preview-wrap { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.bg-preview {
  border: 1px solid var(--border-light); border-radius: 8px;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
  background: var(--bg-card); flex-shrink: 0;
}
.bg-note { font-size: var(--text-xs); color: var(--text-muted); flex: 1; min-width: 140px; }
.bg-slider-row { display: flex; align-items: center; gap: 10px; }
.bg-slider-row label { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--text-secondary); white-space: nowrap; }
.bg-slider-row input[type='range'] { flex: 1; accent-color: var(--accent, #4F46E5); }
.bg-tol-val { font-size: var(--text-xs); font-weight: var(--font-bold); color: var(--accent); min-width: 26px; text-align: right; }
.bg-hint { font-size: 11px; color: var(--text-muted); }
.bg-actions { display: flex; gap: 8px; justify-content: flex-end; }
</style>
