<script setup lang="ts">
// Kartu Absensi QR — desain poster "Buku Tamu" (mirip contoh di foto):
//   - Header logo sekolah + nama instansi
//   - Judul "Selamat Datang" + pill badge nama ekskul
//   - Kotak QR dengan logo sekolah di tengah + tombol "SCAN DI SINI"
//   - Branding aplikasi, instruksi, tiga keunggulan, dan banner footer biru tua.
// Bisa dicetak (window.print) atau diunduh sebagai PNG (komposisi canvas).
//
// QR yang ditampilkan digenerate ulang dengan error-correction level H (30%)
// lalu logo sekolah ditempel di tengah — tetap aman di-scan meski sebagian
// modul tertutup logo.

const props = withDefaults(defineProps<{
  qrDataUrl: string
  /** Tautan asli yang dikodekan ke QR — dipakai untuk regenerasi QR level H. */
  qrDeepLink?: string
  ekskulName: string
  institutionName: string
  institutionLogo?: string | null
  website?: string | null
  token: string
  expiresAt: string
  zone?: string
  locationName?: string | null
}>(), {
  qrDeepLink: '',
  institutionLogo: null,
  website: null,
  zone: '',
  locationName: null,
})

const emit = defineEmits<{ (e: 'close'): void }>()

// ===== Palet (biru muda + biru tua, mengikuti contoh desain) =====
const NAVY = '#1E3A8A'   // biru tua: judul, tombol, banner footer
const BLUE = '#2563EB'   // aksen biru: ikon, subtitle
const SKY = '#DBEAFE'    // biru muda: pill badge, lingkaran ikon
const SKY_BG = '#EFF6FF' // latar kotak QR
const BORDER = '#BFDBFE' // garis biru muda
const GRAY = '#475569'
const MUTED = '#64748B'

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function printCard() {
  window.print()
}

// ===== Regenerasi QR level H + logo sekolah di tengah =====
const cardQrUrl = ref('')
let cardQrPromise: Promise<string> | null = null

async function buildCardQr(): Promise<string> {
  const size = 640
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return props.qrDataUrl

  if (props.qrDeepLink) {
    const { toCanvas } = await import('qrcode')
    await toCanvas(canvas, props.qrDeepLink, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: size,
      color: { dark: '#0F172A', light: '#FFFFFF' },
    })
  } else {
    // Fallback (data QR lama): gambar langsung dari data URL yang diberikan.
    const img = await loadImage(props.qrDataUrl)
    if (img) ctx.drawImage(img, 0, 0, size, size)
  }

  // Logo sekolah di tengah QR (r ≈ 12% lebar — masih dalam toleransi ECC H)
  const c = size / 2
  const r = Math.round(size * 0.12)
  ctx.beginPath()
  ctx.arc(c, c, r, 0, Math.PI * 2)
  ctx.fillStyle = '#FFFFFF'
  ctx.fill()
  const logo = props.institutionLogo ? await loadImage(props.institutionLogo) : null
  if (logo) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(c, c, r - 6, 0, Math.PI * 2)
    ctx.clip()
    const side = (r - 6) * 2
    ctx.drawImage(logo, c - side / 2, c - side / 2, side, side)
    ctx.restore()
  } else {
    ctx.fillStyle = BLUE
    ctx.beginPath()
    ctx.arc(c, c, r - 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 46px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SB', c, c + 2)
  }
  return canvas.toDataURL('image/png')
}

function getCardQr(): Promise<string> {
  if (!cardQrPromise) cardQrPromise = buildCardQr()
  return cardQrPromise
}

onMounted(async () => {
  cardQrUrl.value = await getCardQr()
})

// ===== Helper gambar (canvas) =====
function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, start: number, min: number): number {
  let size = start
  while (size > min && ctx.measureText(text).width > maxWidth) {
    size -= 2
    ctx.font = `bold ${size}px sans-serif`
  }
  return size
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w
    if (!cur || ctx.measureText(test).width <= maxWidth) {
      cur = test
    } else {
      lines.push(cur)
      cur = w
    }
  }
  if (cur) lines.push(cur)
  return lines
}

// ---- Ikon vektor sederhana (stroke/fill manual, gaya lucide) ----
function drawCapIcon(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = s * 0.1
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(x - s * 0.44, y - s * 0.06)
  ctx.lineTo(x, y - s * 0.3)
  ctx.lineTo(x + s * 0.44, y - s * 0.06)
  ctx.lineTo(x, y + s * 0.12)
  ctx.closePath()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x + s * 0.44, y - s * 0.06)
  ctx.quadraticCurveTo(x + s * 0.44, y + s * 0.2, x, y + s * 0.28)
  ctx.quadraticCurveTo(x - s * 0.44, y + s * 0.2, x - s * 0.44, y - s * 0.06)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x, y - s * 0.3)
  ctx.lineTo(x + s * 0.06, y - s * 0.52)
  ctx.stroke()
}

function drawUserIcon(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y - s * 0.2, s * 0.2, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(x, y + s * 0.24, s * 0.4, 0, Math.PI, true)
  ctx.fill()
}

function drawShieldIcon(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x, y - s * 0.46)
  ctx.lineTo(x + s * 0.42, y - s * 0.3)
  ctx.lineTo(x + s * 0.42, y + s * 0.08)
  ctx.quadraticCurveTo(x + s * 0.42, y + s * 0.42, x, y + s * 0.5)
  ctx.quadraticCurveTo(x - s * 0.42, y + s * 0.42, x - s * 0.42, y + s * 0.08)
  ctx.lineTo(x - s * 0.42, y - s * 0.3)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = '#FFFFFF'
  ctx.lineWidth = s * 0.1
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(x - s * 0.16, y)
  ctx.lineTo(x - s * 0.04, y + s * 0.12)
  ctx.lineTo(x + s * 0.18, y - s * 0.12)
  ctx.stroke()
}

function drawLeafIcon(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(x + s * 0.42, y - s * 0.46)
  ctx.quadraticCurveTo(x - s * 0.12, y - s * 0.32, x - s * 0.46, y + s * 0.44)
  ctx.quadraticCurveTo(x + s * 0.08, y + s * 0.3, x + s * 0.46, y - s * 0.46)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = color
  ctx.lineWidth = s * 0.08
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x - s * 0.46, y + s * 0.44)
  ctx.quadraticCurveTo(x - s * 0.14, y + s * 0.18, x - s * 0.12, y + s * 0.04)
  ctx.stroke()
}

function drawScanIcon(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = s * 0.09
  ctx.lineCap = 'round'
  rr(ctx, x - s * 0.24, y - s * 0.4, s * 0.48, s * 0.8, s * 0.12)
  ctx.stroke()
  ctx.fillStyle = color
  const q = s * 0.09
  const left = x - s * 0.15
  const top = y - s * 0.27
  const right = x + s * 0.15 - q
  const bottom = y + s * 0.27 - q
  // Pola QR kecil di layar ponsel
  ctx.fillRect(left, top, q, q)
  ctx.fillRect(left + q + 1.6, top, q, q)
  ctx.fillRect(left, top + q + 1.6, q, q)
  ctx.fillRect(right, top, q, q)
  ctx.fillRect(left, bottom, q, q)
  ctx.fillRect(right, bottom, q, q)
  ctx.fillRect(x - q / 2, y - q / 2, q, q)
}

function drawSmartphoneIcon(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = s * 0.08
  ctx.lineCap = 'round'
  rr(ctx, x - s * 0.26, y - s * 0.42, s * 0.52, s * 0.84, s * 0.12)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - s * 0.09, y + s * 0.32)
  ctx.lineTo(x + s * 0.09, y + s * 0.32)
  ctx.stroke()
}

function drawBuildingIcon(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = s * 0.09
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(x - s * 0.4, y + s * 0.46)
  ctx.lineTo(x - s * 0.4, y - s * 0.2)
  ctx.lineTo(x, y - s * 0.46)
  ctx.lineTo(x + s * 0.4, y - s * 0.2)
  ctx.lineTo(x + s * 0.4, y + s * 0.46)
  ctx.closePath()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x - s * 0.12, y + s * 0.46)
  ctx.lineTo(x - s * 0.12, y + s * 0.06)
  ctx.lineTo(x + s * 0.12, y + s * 0.06)
  ctx.lineTo(x + s * 0.12, y + s * 0.46)
  ctx.stroke()
}

// ===== Komposisi canvas untuk unduh PNG =====
async function drawCard(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const cx = W / 2
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, W, H)

  // Bingkai luar biru muda
  ctx.strokeStyle = BORDER
  ctx.lineWidth = 6
  rr(ctx, 26, 26, W - 52, H - 52, 34)
  ctx.stroke()

  // ---- 1. Header: logo sekolah + nama instansi ----
  const headerY = 175
  ctx.textBaseline = 'alphabetic'
  const name = props.institutionName || 'Sekolah'
  const sub = 'EKSTRAKURIKULER'
  ctx.font = 'bold 46px sans-serif'
  const nameSize = fitFont(ctx, name, 600, 46, 30)
  const nameW = ctx.measureText(name).width
  ctx.font = '26px sans-serif'
  const subW = ctx.measureText(sub).width
  const logoD = 100
  const gap = 26
  const groupW = logoD + gap + Math.max(nameW, subW)
  const gx0 = cx - groupW / 2

  const instLogo = props.institutionLogo ? await loadImage(props.institutionLogo) : null
  if (instLogo) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(gx0 + logoD / 2, headerY, logoD / 2, 0, Math.PI * 2)
    ctx.clip()
    ctx.drawImage(instLogo, gx0, headerY - logoD / 2, logoD, logoD)
    ctx.restore()
    ctx.strokeStyle = BORDER
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(gx0 + logoD / 2, headerY, logoD / 2, 0, Math.PI * 2)
    ctx.stroke()
  } else {
    ctx.fillStyle = SKY_BG
    ctx.beginPath()
    ctx.arc(gx0 + logoD / 2, headerY, logoD / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = BORDER
    ctx.lineWidth = 4
    ctx.stroke()
    drawBuildingIcon(ctx, gx0 + logoD / 2, headerY, 54, BLUE)
  }

  const textX = gx0 + logoD + gap
  ctx.textAlign = 'left'
  ctx.font = `bold ${nameSize}px sans-serif`
  ctx.fillStyle = NAVY
  ctx.fillText(name, textX, headerY - 8)
  ctx.font = '26px sans-serif'
  ctx.fillStyle = BLUE
  ctx.fillText(sub, textX, headerY + 36)

  // ---- 2. Judul "Selamat Datang" + pill badge ekskul ----
  ctx.textAlign = 'center'
  ctx.fillStyle = NAVY
  ctx.font = 'bold 60px sans-serif'
  ctx.fillText('Selamat Datang', cx, 310)

  const badgeText = props.ekskulName || 'Ekskul'
  ctx.font = 'bold 34px sans-serif'
  const badgeSize = fitFont(ctx, badgeText, 620, 34, 24)
  const pillW = ctx.measureText(badgeText).width + 72
  const pillH = 74
  const pillY = 336
  ctx.fillStyle = SKY
  rr(ctx, cx - pillW / 2, pillY, pillW, pillH, pillH / 2)
  ctx.fill()
  ctx.fillStyle = NAVY
  ctx.font = `bold ${badgeSize}px sans-serif`
  ctx.fillText(badgeText, cx, pillY + pillH / 2 + badgeSize * 0.35)

  // Masa berlaku
  const val = props.expiresAt ? `Berlaku sampai: ${props.expiresAt}${props.zone ? ' ' + props.zone : ''}` : ''
  if (val) {
    ctx.font = '24px sans-serif'
    ctx.fillStyle = MUTED
    ctx.fillText(val, cx, pillY + pillH + 38)
  }

  // ---- 3. Kotak QR + tombol scan ----
  const boxW = 700
  const boxH = 640
  const boxX = cx - boxW / 2
  const boxY = 470
  ctx.fillStyle = SKY_BG
  rr(ctx, boxX, boxY, boxW, boxH, 30)
  ctx.fill()
  ctx.strokeStyle = BORDER
  ctx.lineWidth = 4
  rr(ctx, boxX, boxY, boxW, boxH, 30)
  ctx.stroke()

  const qrSize = 424
  const qrX = cx - qrSize / 2
  const qrY = boxY + 44
  const qrImg = await loadImage(cardQrUrl.value || props.qrDataUrl)
  ctx.fillStyle = '#FFFFFF'
  rr(ctx, qrX - 14, qrY - 14, qrSize + 28, qrSize + 28, 16)
  ctx.fill()
  ctx.strokeStyle = BORDER
  ctx.lineWidth = 3
  rr(ctx, qrX - 14, qrY - 14, qrSize + 28, qrSize + 28, 16)
  ctx.stroke()
  if (qrImg) {
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)
  } else {
    ctx.fillStyle = '#F1F5F9'
    ctx.fillRect(qrX, qrY, qrSize, qrSize)
    ctx.fillStyle = MUTED
    ctx.font = 'bold 44px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('QR', cx, qrY + qrSize / 2)
    ctx.textAlign = 'center'
  }

  // Tombol "SCAN DI SINI"
  const btnW = 520
  const btnH = 84
  const btnX = cx - btnW / 2
  const btnY = boxY + boxH - btnH - 52
  ctx.fillStyle = NAVY
  rr(ctx, btnX, btnY, btnW, btnH, btnH / 2)
  ctx.fill()
  drawScanIcon(ctx, btnX + 78, btnY + btnH / 2, 44, '#FFFFFF')
  ctx.textAlign = 'left'
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 30px sans-serif'
  ctx.fillText('SCAN DI SINI', btnX + 128, btnY + 34)
  ctx.font = '24px sans-serif'
  ctx.fillText('UNTUK ABSEN', btnX + 128, btnY + 66)
  ctx.textAlign = 'center'

  // ---- 4. Branding aplikasi ----
  const brandY = boxY + boxH + 88
  const iconS = 72
  ctx.font = 'bold 44px sans-serif'
  const brandName = 'StudentBase'
  const brandNW = ctx.measureText(brandName).width
  ctx.font = '24px sans-serif'
  const brandCW = ctx.measureText('Aplikasi').width
  const brandTextW = Math.max(brandNW, brandCW)
  const brandGap = 20
  const brandGroupW = iconS + brandGap + brandTextW
  const bGx = cx - brandGroupW / 2

  ctx.fillStyle = BLUE
  rr(ctx, bGx, brandY - iconS / 2, iconS, iconS, 16)
  ctx.fill()
  drawCapIcon(ctx, bGx + iconS / 2, brandY, 42, '#FFFFFF')

  ctx.textAlign = 'left'
  ctx.fillStyle = MUTED
  ctx.font = '24px sans-serif'
  ctx.fillText('Aplikasi', bGx + iconS + brandGap, brandY - 12)
  ctx.fillStyle = NAVY
  ctx.font = 'bold 44px sans-serif'
  ctx.fillText(brandName, bGx + iconS + brandGap, brandY + 32)
  ctx.textAlign = 'center'

  // ---- 5. Instruksi ----
  const insY = brandY + 74
  ctx.fillStyle = GRAY
  ctx.font = '27px sans-serif'
  ctx.fillText('Silakan scan QR Code di bawah untuk mengisi absensi ekskul.', cx, insY)
  ctx.fillText('Terima kasih atas partisipasi Anda.', cx, insY + 38)

  // ---- 6. Tiga keunggulan ----
  const features = [
    { icon: 'user', title: 'Mudah', desc: 'Isi cepat & praktis' },
    { icon: 'shield', title: 'Aman', desc: 'Data tersimpan aman' },
    { icon: 'leaf', title: 'Paperless', desc: 'Ramah lingkungan' },
  ]
  const featY = insY + 92
  const colW = boxW / 3
  features.forEach((f, i) => {
    const colCx = boxX + colW * (i + 0.5)
    ctx.fillStyle = SKY
    ctx.beginPath()
    ctx.arc(colCx, featY, 40, 0, Math.PI * 2)
    ctx.fill()
    if (f.icon === 'user') drawUserIcon(ctx, colCx, featY, 46, NAVY)
    else if (f.icon === 'shield') drawShieldIcon(ctx, colCx, featY, 46, NAVY)
    else drawLeafIcon(ctx, colCx, featY, 46, NAVY)

    ctx.fillStyle = NAVY
    ctx.font = 'bold 30px sans-serif'
    ctx.fillText(f.title, colCx, featY + 84)
    ctx.fillStyle = MUTED
    ctx.font = '22px sans-serif'
    const lines = wrapLines(ctx, f.desc, 215)
    lines.forEach((ln, li) => ctx.fillText(ln, colCx, featY + 116 + li * 27))
  })

  // ---- 7. Banner footer ----
  const bannerH = 84
  const bannerY = featY + 140
  ctx.fillStyle = NAVY
  rr(ctx, 60, bannerY, W - 120, bannerH, 24)
  ctx.fill()
  drawSmartphoneIcon(ctx, 134, bannerY + bannerH / 2, 40, '#FFFFFF')
  ctx.fillStyle = '#FFFFFF'
  ctx.font = 'bold 28px sans-serif'
  ctx.fillText('Digital, Praktis, dan Terpercaya', cx, bannerY + 36)
  ctx.font = '24px sans-serif'
  ctx.fillText('Bersama StudentBase', cx, bannerY + 68)

  if (props.website) {
    ctx.textAlign = 'right'
    ctx.fillStyle = MUTED
    ctx.font = '22px sans-serif'
    ctx.fillText(`More info: ${props.website}`, W - 56, bannerY + bannerH + 36)
    ctx.textAlign = 'center'
  }
}

// ---- Unduh kartu sebagai PNG ----
async function downloadPng() {
  const W = 1100
  const H = 1680
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Pastikan QR kartu sudah siap sebelum menggambar
  cardQrUrl.value = await getCardQr()
  await drawCard(ctx, W, H)

  canvas.toBlob((blob) => {
    if (!blob) return
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `kartu-absensi-${props.ekskulName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 5000)
  }, 'image/png')
}
</script>

<template>
  <div class="qr-card-shell">
    <!-- Aksi: unduh / cetak / tutup -->
    <div class="qr-card-actions">
      <button class="btn-cancel" @click="emit('close')"><Icon name="i-lucide-x" class="w-4 h-4" /> Tutup</button>
      <button class="btn-outline" @click="downloadPng"><Icon name="i-lucide-image-down" class="w-4 h-4" /> Unduh PNG</button>
      <button class="btn-primary" @click="printCard"><Icon name="i-lucide-printer" class="w-4 h-4" /> Cetak</button>
    </div>

    <!-- Kartu yang dicetak / diunduh (desain poster Buku Tamu) -->
    <div class="qr-card">
      <!-- 1. Header -->
      <div class="card-header">
        <div class="inst-logo">
          <img v-if="institutionLogo" :src="institutionLogo" alt="Logo Instansi" />
          <Icon v-else name="i-lucide-school" class="w-8 h-8" />
        </div>
        <div class="inst-text">
          <div class="inst-name">{{ institutionName || 'Sekolah' }}</div>
          <div class="inst-sub">Ekstrakurikuler</div>
        </div>
      </div>

      <!-- 2. Judul + badge -->
      <div class="welcome">Selamat Datang</div>
      <div class="badge-pill">{{ ekskulName }}</div>
      <div v-if="expiresAt" class="validity">
        <Icon name="i-lucide-clock" class="w-3.5 h-3.5" /> Berlaku sampai: {{ expiresAt }}{{ zone ? ' ' + zone : '' }}
      </div>

      <!-- 3. Kotak QR + tombol scan -->
      <div class="qr-box">
        <div class="qr-inner">
          <img :src="cardQrUrl || qrDataUrl" alt="QR Absensi" class="qr-img" />
        </div>
        <div class="scan-btn">
          <span class="scan-icon"><Icon name="i-lucide-scan-line" class="w-5 h-5" /></span>
          <span class="scan-text">
            <span class="scan-line1">SCAN DI SINI</span>
            <span class="scan-line2">UNTUK ABSEN</span>
          </span>
        </div>
      </div>

      <!-- 4. Branding aplikasi -->
      <div class="app-brand">
        <div class="app-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
            <path d="M22 10v6" />
            <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
          </svg>
        </div>
        <div class="app-text">
          <span class="app-caption">Aplikasi</span>
          <span class="app-name">StudentBase</span>
        </div>
      </div>

      <!-- 5. Instruksi -->
      <p class="instruct">
        Silakan scan QR Code di bawah untuk mengisi absensi ekskul.<br />
        Terima kasih atas partisipasi Anda.
      </p>

      <!-- 6. Tiga keunggulan -->
      <div class="features">
        <div class="feature">
          <div class="feature-icon"><Icon name="i-lucide-user" class="w-5 h-5" /></div>
          <div class="feature-title">Mudah</div>
          <div class="feature-desc">Isi absensi cepat &amp; praktis, cukup sekali scan.</div>
        </div>
        <div class="feature">
          <div class="feature-icon"><Icon name="i-lucide-shield-check" class="w-5 h-5" /></div>
          <div class="feature-title">Aman</div>
          <div class="feature-desc">Data kehadiran tersimpan aman dan rapi.</div>
        </div>
        <div class="feature">
          <div class="feature-icon"><Icon name="i-lucide-leaf" class="w-5 h-5" /></div>
          <div class="feature-title">Paperless</div>
          <div class="feature-desc">Hemat kertas, ramah lingkungan.</div>
        </div>
      </div>

      <!-- 7. Banner footer -->
      <div class="footer-banner">
        <span class="banner-icon"><Icon name="i-lucide-smartphone" class="w-6 h-6" /></span>
        <div class="banner-text">
          <b>Digital, Praktis, dan Terpercaya</b>
          <span>Bersama StudentBase</span>
        </div>
      </div>
      <div v-if="website" class="more-info">More info: {{ website }}</div>
    </div>
  </div>
</template>

<style scoped>
.qr-card-shell { text-align: center; }
.qr-card-actions { display: flex; justify-content: center; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; }
.btn-cancel { display: inline-flex; align-items: center; gap: 6px; background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.btn-cancel:hover { background: var(--bg-hover); }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-primary); font-size: var(--text-sm); font-weight: var(--font-medium); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.btn-outline:hover { background: var(--bg-hover); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 18px; border-radius: 6px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }

/* ===== Kartu (desain poster Buku Tamu, biru muda + biru tua) ===== */
.qr-card {
  width: 560px;
  max-width: 92vw;
  margin: 0 auto;
  background: #ffffff;
  border: 2px solid #bfdbfe;
  border-radius: 20px;
  padding: 24px 30px 20px;
  box-shadow: 0 10px 30px rgba(30, 58, 138, 0.12);
  text-align: center;
  color: #1e3a8a;
  font-family: 'Segoe UI', Roboto, 'Open Sans', sans-serif;
}

/* 1. Header */
.card-header { display: flex; align-items: center; justify-content: center; gap: 14px; text-align: left; }
.inst-logo {
  width: 58px; height: 58px; border-radius: 50%;
  border: 2px solid #bfdbfe; background: #eff6ff;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden; flex-shrink: 0; color: #2563eb;
}
.inst-logo img { width: 100%; height: 100%; object-fit: contain; }
.inst-name { font-size: 18px; font-weight: 800; color: #1e3a8a; line-height: 1.15; }
.inst-sub { font-size: 12px; font-weight: 700; letter-spacing: 0.16em; color: #2563eb; text-transform: uppercase; margin-top: 3px; }

/* 2. Judul + badge */
.welcome { font-size: 30px; font-weight: 800; color: #1e3a8a; line-height: 1; margin-top: 14px; }
.badge-pill {
  display: inline-flex; align-items: center;
  margin-top: 10px; padding: 7px 24px;
  background: #dbeafe; border: 1px solid #bfdbfe;
  color: #1e3a8a; font-weight: 800; font-size: 15px;
  border-radius: 4px; letter-spacing: 0.06em; max-width: 100%;
}
.validity { margin-top: 8px; font-size: 11px; color: #64748b; display: flex; align-items: center; justify-content: center; gap: 5px; }

/* 3. Kotak QR + tombol scan */
.qr-box { margin-top: 14px; background: #eff6ff; border: 2px solid #bfdbfe; border-radius: 18px; padding: 16px 16px 18px; }
.qr-inner { background: #ffffff; border: 1px solid #dbeafe; border-radius: 12px; padding: 8px; }
.qr-img { width: 100%; max-width: 290px; display: block; margin: 0 auto; }
.scan-btn {
  display: inline-flex; align-items: center; gap: 12px;
  margin-top: 14px; padding: 10px 30px;
  background: #1e3a8a; color: #ffffff;
  border-radius: 999px; text-align: left;
}
.scan-icon { display: flex; flex-shrink: 0; }
.scan-line1 { display: block; font-size: 13px; font-weight: 800; letter-spacing: 0.1em; line-height: 1.15; }
.scan-line2 { display: block; font-size: 12px; opacity: 0.88; letter-spacing: 0.08em; line-height: 1.2; }

/* 4. Branding aplikasi */
.app-brand { display: inline-flex; align-items: center; gap: 11px; margin-top: 16px; text-align: left; }
.app-icon {
  width: 42px; height: 42px; border-radius: 11px;
  background: #2563eb; color: #ffffff;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.app-caption { display: block; font-size: 12px; color: #64748b; line-height: 1.1; }
.app-name { display: block; font-size: 19px; font-weight: 800; color: #1e3a8a; line-height: 1.05; margin-top: 1px; }

/* 5. Instruksi */
.instruct { margin-top: 14px; font-size: 12px; color: #475569; line-height: 1.6; }

/* 6. Tiga keunggulan */
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 14px; }
.feature { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 8px 10px; }
.feature-icon {
  width: 38px; height: 38px; margin: 0 auto 6px;
  border-radius: 50%; background: #dbeafe; color: #1e3a8a;
  display: flex; align-items: center; justify-content: center;
}
.feature-title { font-size: 12px; font-weight: 800; color: #1e3a8a; }
.feature-desc { font-size: 9.5px; color: #64748b; margin-top: 3px; line-height: 1.35; }

/* 7. Banner footer */
.footer-banner {
  display: flex; align-items: center; gap: 12px;
  margin-top: 16px; padding: 12px 18px;
  background: #1e3a8a; color: #ffffff; border-radius: 16px; text-align: left;
}
.banner-icon { display: flex; flex-shrink: 0; }
.banner-text { flex: 1; text-align: center; }
.banner-text b { display: block; font-size: 13px; font-weight: 700; }
.banner-text span { display: block; font-size: 11px; opacity: 0.92; margin-top: 1px; }
.more-info { margin-top: 6px; font-size: 12px; color: #64748b; text-align: right; }

/* ===== Cetak: hanya kartu yang tampil =====
   Catatan: rule global harus pakai :global() karena style ini scoped. */
@media print {
  :global(body *), :global(html *) { visibility: hidden !important; }
  :global(.qr-card-shell), :global(.qr-card-shell *) { visibility: visible !important; }
  .qr-card-shell { position: fixed !important; inset: 0 !important; display: flex; align-items: center; justify-content: center; }
  .qr-card-actions { display: none !important; }
  .qr-card {
    width: 100%;
    max-width: none;
    box-shadow: none;
    border: 2px solid #bfdbfe;
    border-radius: 0;
    padding: 20px 24px;
  }
}
</style>
