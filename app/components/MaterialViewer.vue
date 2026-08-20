<script setup lang="ts">
// Penampil materi inline — materi dilihat LANGSUNG di web app (tidak diunduh
// secara paksa). Ringan untuk server & user:
//   - PDF  → preview asli browser (iframe) tanpa library tambahan
//   - Gambar → preview <img>
//   - Teks/konten → ditampilkan sebagai teks
//   - Video → HANYA tombol unduh (tidak embed player — berat untuk server)
//   - Dokumen (docx/xlsx) & link → tombol unduh/buka
const props = defineProps<{
  material: any | null
}>()
const emit = defineEmits<{ (e: 'close'): void }>()

const fileTypeIcons: Record<string, string> = {
  pdf: 'i-lucide-file-text',
  image: 'i-lucide-image',
  video: 'i-lucide-video',
  document: 'i-lucide-file',
  link: 'i-lucide-link',
  text: 'i-lucide-file-text',
}

const fileTypeColors: Record<string, string> = {
  pdf: 'var(--red-orange)',
  image: 'var(--teal)',
  video: 'var(--orange)',
  document: 'var(--olive-primary)',
  link: 'var(--teal-mid)',
  text: 'var(--green-soft)',
}

const isPdf = computed(() => props.material?.fileType === 'pdf' && !!props.material?.fileUrl)
const isImage = computed(() => props.material?.fileType === 'image' && !!props.material?.fileUrl)
const isText = computed(() => !!props.material?.content)
const isVideo = computed(() => props.material?.fileType === 'video')
const isLink = computed(() => props.material?.fileType === 'link' && !!props.material?.fileUrl)
const isDocument = computed(() => !!props.material?.fileUrl && !isPdf.value && !isImage.value && !isVideo.value && !isLink.value)

// Tutup dengan tombol Escape
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <div v-if="material" class="mv-overlay" @click.self="emit('close')">
      <div class="mv-modal">
        <!-- Header -->
        <div class="mv-header">
          <div class="mv-header-icon" :style="{ background: (fileTypeColors[material.fileType || 'link'] || 'var(--teal-mid)') + '20', color: fileTypeColors[material.fileType || 'link'] || 'var(--teal-mid)' }">
            <Icon :name="fileTypeIcons[material.fileType || 'link'] || 'i-lucide-file'" class="w-5 h-5" />
          </div>
          <div class="mv-header-text">
            <h3 class="mv-title">{{ material.title }}</h3>
            <p class="mv-meta">
              <span class="mv-ekskul">{{ material.ekskul }}</span>
              <span v-if="material.uploadedBy"> · {{ material.uploadedBy }}</span>
            </p>
          </div>
          <button class="mv-close" @click="emit('close')" title="Tutup">
            <Icon name="i-lucide-x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Deskripsi -->
        <p v-if="material.description" class="mv-desc">{{ material.description }}</p>

        <!-- Body: preview sesuai tipe -->
        <div class="mv-body">
          <!-- PDF: preview asli browser -->
          <iframe v-if="isPdf" :src="material.fileUrl" class="mv-frame" title="Preview PDF"></iframe>

          <!-- Gambar -->
          <div v-else-if="isImage" class="mv-img-wrap">
            <img :src="material.fileUrl" class="mv-img" alt="Preview gambar" />
          </div>

          <!-- Teks / konten -->
          <pre v-else-if="isText" class="mv-text">{{ material.content }}</pre>

          <!-- Video: HANYA tombol unduh — tidak embed player -->
          <div v-else-if="isVideo" class="mv-fallback">
            <div class="mv-fallback-icon" style="background: rgba(249,115,22,0.12); color: var(--orange);">
              <Icon name="i-lucide-video" class="w-10 h-10" />
            </div>
            <h4>Video Tersedia sebagai File Unduhan</h4>
            <p>Video tidak diputar langsung di aplikasi agar tetap ringan. Unduh videonya untuk menonton secara offline.</p>
            <a v-if="material.fileUrl" :href="material.fileUrl" target="_blank" rel="noopener" class="mv-download-btn" style="background: var(--orange);">
              <Icon name="i-lucide-download" class="w-4 h-4" /> Unduh Video
            </a>
          </div>

          <!-- Link eksternal -->
          <div v-else-if="isLink" class="mv-fallback">
            <div class="mv-fallback-icon" style="background: rgba(13,148,136,0.12); color: var(--teal-mid);">
              <Icon name="i-lucide-link" class="w-10 h-10" />
            </div>
            <h4>Materi Berupa Link</h4>
            <p>Materi ini berupa tautan eksternal. Buka tautannya untuk mengakses materi.</p>
            <a v-if="material.fileUrl" :href="material.fileUrl" target="_blank" rel="noopener" class="mv-download-btn" style="background: var(--teal-mid);">
              <Icon name="i-lucide-external-link" class="w-4 h-4" /> Buka Link
            </a>
          </div>

          <!-- Dokumen (docx/xlsx dll) -->
          <div v-else-if="isDocument" class="mv-fallback">
            <div class="mv-fallback-icon" style="background: rgba(79,70,229,0.1); color: var(--olive-primary);">
              <Icon name="i-lucide-file" class="w-10 h-10" />
            </div>
            <h4>File Dokumen</h4>
            <p>Format ini tidak bisa ditampilkan di aplikasi. Unduh atau buka filenya untuk melihat isi.</p>
            <a :href="material.fileUrl" target="_blank" rel="noopener" class="mv-download-btn">
              <Icon name="i-lucide-download" class="w-4 h-4" /> Unduh / Buka File
            </a>
          </div>

          <!-- Fallback -->
          <div v-else class="mv-fallback">
            <div class="mv-fallback-icon">
              <Icon name="i-lucide-file" class="w-10 h-10" />
            </div>
            <h4>Materi Ini Belum Punya Konten</h4>
            <p>Belum ada file atau konten yang bisa ditampilkan.</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="mv-footer">
          <span class="mv-footer-hint">
            <Icon name="i-lucide-shield-check" class="w-3.5 h-3.5" /> Dibagikan khusus anggota ekskul
          </span>
          <a v-if="material.fileUrl" :href="material.fileUrl" target="_blank" rel="noopener" class="mv-download-btn">
            <Icon name="i-lucide-download" class="w-4 h-4" /> Unduh File
          </a>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mv-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(2px);
}

.mv-modal {
  background: var(--bg-card);
  border-radius: 14px;
  width: 860px;
  max-width: 96vw;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.mv-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light);
}

.mv-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mv-header-text { flex: 1; min-width: 0; }

.mv-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mv-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.mv-ekskul { font-weight: var(--font-semibold); color: var(--olive-primary); }

.mv-close {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}
.mv-close:hover { background: var(--bg-hover); color: var(--text-primary); }

.mv-desc {
  padding: 12px 20px 0;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.mv-body {
  flex: 1;
  min-height: 320px;
  max-height: 60vh;
  overflow: auto;
  margin: 12px 20px 0;
  background: var(--bg-main);
  border: 1px solid var(--border-light);
  border-radius: 10px;
}

.mv-frame {
  width: 100%;
  height: 60vh;
  min-height: 320px;
  border: none;
  display: block;
}

.mv-img-wrap { padding: 16px; text-align: center; }
.mv-img { max-width: 100%; max-height: 55vh; border-radius: 8px; }

.mv-text {
  margin: 0;
  padding: 20px;
  font-size: var(--text-sm);
  font-family: var(--font-family);
  line-height: 1.8;
  color: var(--text-primary);
  white-space: pre-wrap;
  word-break: break-word;
}

.mv-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 56px 24px;
  text-align: center;
}

.mv-fallback-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: var(--bg-hover);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.mv-fallback h4 { font-size: var(--text-md); font-weight: var(--font-semibold); color: var(--text-primary); }
.mv-fallback p { font-size: var(--text-sm); color: var(--text-secondary); max-width: 420px; line-height: 1.6; }

.mv-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--olive-primary);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}
.mv-download-btn:hover { opacity: 0.88; }

.mv-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid var(--border-light);
}

.mv-footer-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  color: var(--text-muted);
}
</style>
