<script setup lang="ts">
// Scanner QR absensi — membuka kamera HP dan mendeteksi QR secara real-time.
// QR yang dibuat operator/admin berisi tautan absensi; hasil scan langsung
// dikirim ke halaman untuk memproses absensi otomatis.
// Catatan: kamera (getUserMedia) hanya berjalan di HTTPS / localhost.
import jsQR from 'jsqr'

const emit = defineEmits<{
  (e: 'scan', value: string): void
  (e: 'close'): void
}>()

const videoEl = ref<HTMLVideoElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const camStarting = ref(true)
const camError = ref('')

let stream: MediaStream | null = null
let rafId = 0
let stopped = false

async function startCamera() {
  camStarting.value = true
  camError.value = ''
  try {
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      camError.value = 'Kamera hanya berjalan di koneksi aman (HTTPS) atau localhost. Di koneksi ini, gunakan tombol input token manual.'
      camStarting.value = false
      return
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      camError.value = 'Browser ini tidak mendukung kamera. Gunakan tombol input token manual.'
      camStarting.value = false
      return
    }
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
      audio: false,
    })
    if (stopped) return
    if (!videoEl.value) return
    videoEl.value.srcObject = stream
    await videoEl.value.play()
    camStarting.value = false
    tick()
  } catch (e: any) {
    camStarting.value = false
    camError.value =
      e?.name === 'NotAllowedError'
        ? 'Izin kamera ditolak. Izinkan akses kamera di pengaturan browser, atau gunakan tombol input token manual.'
        : `Gagal membuka kamera (${e?.name || 'error'}). Gunakan tombol input token manual.`
  }
}

// Deteksi QR tiap frame video → decode dengan jsQR.
function tick() {
  if (stopped || !videoEl.value || !canvasEl.value) return
  const video = videoEl.value
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const canvas = canvasEl.value
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      try {
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' })
        if (code && code.data) {
          stopCamera()
          emit('scan', code.data)
          return
        }
      } catch {
        // Frame kosong / belum siap — lanjut ke frame berikutnya.
      }
    }
  }
  rafId = requestAnimationFrame(tick)
}

function stopCamera() {
  stopped = true
  cancelAnimationFrame(rafId)
  if (stream) {
    stream.getTracks().forEach(t => t.stop())
    stream = null
  }
}

onMounted(startCamera)
onUnmounted(stopCamera)
</script>

<template>
  <Teleport to="body">
    <div class="cam-overlay" @click.self="emit('close')">
      <div class="cam-modal">
        <div class="cam-header">
          <div class="cam-title-wrap">
            <div class="cam-icon"><Icon name="i-lucide-camera" class="w-4 h-4" /></div>
            <div>
              <h3 class="cam-title">Scan QR Absensi</h3>
              <p class="cam-sub">Arahkan kamera ke QR yang ditampilkan operator/admin</p>
            </div>
          </div>
          <button class="cam-close" title="Tutup" @click="emit('close')"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
        </div>

        <div class="cam-viewport">
          <video ref="videoEl" autoplay playsinline muted class="cam-video"></video>
          <div class="cam-frame">
            <span class="cam-corner tl"></span><span class="cam-corner tr"></span>
            <span class="cam-corner bl"></span><span class="cam-corner br"></span>
          </div>
          <div v-if="camStarting" class="cam-status">
            <Icon name="i-lucide-loader-2" class="w-5 h-5 spin-icon" />
            Menyalakan kamera...
          </div>
          <div v-else-if="camError" class="cam-status cam-status-error">
            <Icon name="i-lucide-alert-triangle" class="w-5 h-5" />
            <span>{{ camError }}</span>
          </div>
        </div>

        <!-- Canvas tersembunyi untuk decoding frame -->
        <canvas ref="canvasEl" class="cam-canvas-hidden"></canvas>

        <p class="cam-tip">
          <Icon name="i-lucide-info" class="w-3.5 h-3.5" />
          Posisikan seluruh QR di dalam bingkai. Absensi akan diproses otomatis begitu QR terbaca.
        </p>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.cam-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1200; backdrop-filter: blur(2px); padding: 20px; }
.cam-modal { background: var(--bg-card); border-radius: 16px; width: 420px; max-width: 94vw; overflow: hidden; box-shadow: 0 24px 60px rgba(0,0,0,0.35); }
.cam-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 14px 16px; border-bottom: 1px solid var(--border-light); }
.cam-title-wrap { display: flex; align-items: center; gap: 10px; min-width: 0; }
.cam-icon { width: 34px; height: 34px; border-radius: 9px; background: var(--olive-bg); color: var(--olive-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.cam-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); }
.cam-sub { font-size: var(--text-xs); color: var(--text-muted); margin-top: 1px; }
.cam-close { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; border-radius: 6px; }
.cam-close:hover { background: var(--bg-hover); color: var(--text-primary); }

.cam-viewport { position: relative; background: #0f172a; aspect-ratio: 1 / 1; overflow: hidden; }
.cam-video { width: 100%; height: 100%; object-fit: cover; display: block; }
.cam-frame { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.cam-corner { position: absolute; width: 44px; height: 44px; border: 3px solid var(--olive-primary); }
.cam-corner.tl { top: 18%; left: 22%; border-right: none; border-bottom: none; border-top-left-radius: 10px; }
.cam-corner.tr { top: 18%; right: 22%; border-left: none; border-bottom: none; border-top-right-radius: 10px; }
.cam-corner.bl { bottom: 18%; left: 22%; border-right: none; border-top: none; border-bottom-left-radius: 10px; }
.cam-corner.br { bottom: 18%; right: 22%; border-left: none; border-top: none; border-bottom-right-radius: 10px; }
.cam-status { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(15,23,42,0.7); color: white; font-size: var(--text-sm); text-align: center; padding: 20px; }
.cam-status-error { color: #fca5a5; }
.cam-canvas-hidden { display: none; }
.cam-tip { display: flex; align-items: flex-start; gap: 6px; font-size: var(--text-xs); color: var(--text-muted); padding: 12px 16px; }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
