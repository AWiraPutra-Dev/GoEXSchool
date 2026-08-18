<script setup lang="ts">
import type { GalleryItem } from '~/stores/operator-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const op = useOperatorDataStore()
const admin = useMasterDataStore()
const { myEkskul, isOperator, isScopedOperator } = useEkskulScope()
const { confirm } = useConfirm()
onMounted(() => { op.fetchAll(); admin.fetchReference() })
const search = ref('')
const filteredGallery = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return op.gallery
  return op.gallery.filter((g: any) =>
    (g.title || '').toLowerCase().includes(q) ||
    (g.ekskul || '').toLowerCase().includes(q)
  )
})
const { page, paged, totalPages } = usePagination(() => filteredGallery.value)
const showModal = ref(false)
const showUploadModal = ref(false)
const selectedGallery = ref<GalleryItem | null>(null)
const saving = ref(false)

function openGallery(g: GalleryItem) { selectedGallery.value = g; showModal.value = true }

const form = reactive({ title: '', extracurricularId: '', color: '#4A9E9E' })
const colors = ['#4A9E9E', '#7BA87B', '#D4C089', '#D4956A', '#D46A5A', '#8B9467']

// ---- Upload foto (bisa banyak sekaligus) ----
const photos = ref<{ url: string; name: string }[]>([])
const uploadingPhotos = ref(false)

async function handlePhotosUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  uploadingPhotos.value = true
  try {
    for (const file of Array.from(input.files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await $fetch<{ url: string; filename: string }>('/api/operator/upload', { method: 'POST', body: fd })
      photos.value.push({ url: res.url, name: res.filename })
    }
  } catch (e: any) {
    alert(e.data?.message || 'Gagal upload foto. Maksimal 10MB per file, format JPG/PNG/GIF/WEBP.')
  } finally {
    uploadingPhotos.value = false
    input.value = ''
  }
}

function removePhoto(index: number) { photos.value.splice(index, 1) }

function openUpload() {
  // Operator ekskul: otomatis terikat ke ekskul miliknya
  if (isScopedOperator.value && myEkskul.value) form.extracurricularId = myEkskul.value.id
  showUploadModal.value = true
}

async function upload() {
  if (!form.title || !form.extracurricularId) return
  saving.value = true
  try {
    await op.addGallery({
      title: form.title,
      extracurricularId: form.extracurricularId,
      color: form.color,
      imageUrls: photos.value.map(p => p.url)
    })
    showUploadModal.value = false
    form.title = ''; form.extracurricularId = ''; form.color = '#4A9E9E'
    photos.value = []
  } finally { saving.value = false }
}

async function removeGallery(g: GalleryItem) {
  const ok = await confirm({
    title: `Hapus galeri "${g.title}"?`,
    message: `Album beserta ${g.imageCount} foto di dalamnya akan dihapus permanen.`,
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  await op.deleteGallery(g.id)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.gallery') }}</h1>
      <button class="btn-primary" @click="openUpload"><Icon name="i-lucide-upload" class="w-4 h-4" /> Upload Foto</button>
    </div>

    <div class="table-toolbar">
      <input v-model="search" type="text" placeholder="Cari judul album atau ekskul..." class="search-input">
    </div>

    <div class="gallery-grid">
      <div v-for="g in paged" :key="g.id" class="gallery-card" @click="openGallery(g)">
        <div class="gallery-thumb" :style="{ background: g.color }">
          <img v-if="g.images?.length" :src="g.images?.[0]?.url" class="gallery-thumb-img" alt="">
          <Icon v-else name="i-lucide-image" class="w-10 h-10 text-white/60" />
          <span class="gallery-count">{{ g.imageCount }} foto</span>
        </div>
        <div class="gallery-info">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="gallery-title">{{ g.title }}</h3>
              <p class="gallery-meta">
                <span v-if="g.ekskulLogo" class="ekskul-logo-chip">
                  <img :src="g.ekskulLogo" class="ekskul-logo-img" alt="" />
                  {{ g.ekskul }}
                </span>
                <span v-else>{{ g.ekskul }}</span>
                · {{ g.date }}
              </p>
            </div>
            <button class="gallery-delete-btn" @click.stop="removeGallery(g)" title="Hapus"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
          </div>
        </div>
      </div>
      <div v-if="!filteredGallery.length" class="empty-state">
        <Icon name="i-lucide-images" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
        <p style="color: var(--text-muted); font-size: var(--text-sm);">Belum ada galeri yang cocok.</p>
      </div>
    </div>
    <PaginationBar v-model:page="page" :total="filteredGallery.length" />

    <Teleport to="body">
      <div v-if="showModal && selectedGallery" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" style="width:600px;">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[18px] font-bold" style="color:var(--text-primary);">{{ selectedGallery.title }}</h3>
            <button @click="showModal = false" style="background:none;border:none;cursor:pointer;color:var(--text-muted);display:inline-flex;align-items:center;"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>
          <div class="gallery-preview-grid">
            <template v-if="selectedGallery.images?.length">
              <img v-for="img in selectedGallery.images" :key="img.id" :src="img.url" class="preview-photo-img" alt="">
            </template>
            <template v-else>
              <div v-for="i in 6" :key="i" class="preview-photo" :style="{ background: selectedGallery.color + '40' }">
                <Icon name="i-lucide-image" class="w-6 h-6 text-white/40" />
              </div>
            </template>
          </div>
          <p class="text-center text-[13px]" style="color:var(--text-muted);margin-top:16px;">
            {{ selectedGallery.imageCount }} foto
          </p>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showUploadModal" class="modal-overlay" @click.self="showUploadModal = false">
        <div class="modal-content">
          <h3 class="modal-title">Upload Galeri Baru</h3>
          <form @submit.prevent="upload" class="space-y-3">
            <div class="form-group">
              <label>Judul Album</label>
              <input v-model="form.title" class="form-input" required placeholder="Contoh: Latihan Basket 2026">
            </div>

            <!-- Ekskul: dikunci otomatis untuk operator ekskul -->
            <div v-if="isOperator && myEkskul" class="form-group">
              <label>Ekskul</label>
              <div class="scope-badge">
                <Icon name="i-lucide-shield" class="w-4 h-4" />
                {{ myEkskul.name }}
              </div>
            </div>
            <div v-else-if="!isOperator" class="form-group">
              <label>Ekskul</label>
              <select v-model="form.extracurricularId" class="form-input" required>
                <option disabled value="">Pilih Ekskul</option>
                <option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
              </select>
            </div>
            <div v-else class="form-group">
              <label>Ekskul</label>
              <div class="scope-warning"><Icon name="i-lucide-alert-circle" class="w-4 h-4" /> Akun belum diikat ke ekskul. Hubungi admin.</div>
            </div>

            <!-- Foto -->
            <div class="form-group">
              <label>Foto (bisa pilih banyak)</label>
              <div class="photo-upload-area">
                <input type="file" accept="image/*" multiple class="photo-input-hidden" @change="handlePhotosUpload" />
                <div v-if="!uploadingPhotos && !photos.length" class="photo-dropzone">
                  <Icon name="i-lucide-image-plus" class="w-6 h-6" style="color: var(--text-muted);" />
                  <p style="font-size: var(--text-sm); color: var(--text-muted);">Klik untuk pilih foto (JPG, PNG, GIF, WEBP)</p>
                </div>
                <div v-if="uploadingPhotos" class="photo-uploading">
                  <div class="loading-spinner-sm"></div>
                  <span>Mengupload foto...</span>
                </div>
              </div>
              <div v-if="photos.length" class="photo-previews">
                <div v-for="(p, i) in photos" :key="p.url" class="photo-preview-item">
                  <img :src="p.url" class="photo-preview-img" alt="">
                  <button type="button" class="photo-remove-btn" title="Hapus" @click="removePhoto(i)"><Icon name="i-lucide-x" class="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p class="text-[11px]" style="color: var(--text-muted); margin-top: 4px;">
                {{ photos.length }} foto terpilih · maksimal 10MB per file
              </p>
            </div>

            <div class="form-group">
              <label>Warna Tema</label>
              <div class="color-picker">
                <button v-for="c in colors" :key="c" type="button" class="color-swatch" :class="{ selected: form.color === c }" :style="{ background: c }" @click="form.color = c"></button>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showUploadModal = false">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving || uploadingPhotos">{{ saving ? 'Mengupload...' : 'Upload' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.gallery-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
.gallery-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); background: var(--bg-card); }
.search-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.gallery-thumb { height: 150px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.gallery-thumb-img { width: 100%; height: 100%; object-fit: cover; }
.gallery-count { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.5); color: white; font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; }
.gallery-info { padding: 12px 16px; }
.gallery-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.gallery-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.ekskul-logo-chip { display: inline-flex; align-items: center; gap: 4px; }
.ekskul-logo-img { width: 18px; height: 18px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.gallery-delete-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; font-size: 14px; opacity: 0; transition: opacity 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.gallery-card:hover .gallery-delete-btn { opacity: 1; }
.gallery-delete-btn:hover { background: rgba(204,68,68,0.1); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.gallery-preview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.preview-photo { aspect-ratio: 4/3; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.preview-photo-img { width: 100%; aspect-ratio: 4/3; object-fit: cover; border-radius: 8px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.color-picker { display: flex; gap: 8px; }
.color-swatch { width: 32px; height: 32px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: all 0.2s; }
.color-swatch.selected { border-color: var(--olive-primary); transform: scale(1.15); }
.scope-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--olive-bg); color: var(--olive-primary); border: 1px solid var(--olive-light); border-radius: 6px; font-size: var(--text-sm); font-weight: var(--font-semibold); }
.scope-warning { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: #fef2f2; color: var(--red-orange); border: 1px solid #fecaca; border-radius: 6px; font-size: var(--text-sm); font-weight: var(--font-medium); }
.photo-upload-area { border: 1.5px dashed var(--border-light); border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; }
.photo-upload-area:hover { border-color: var(--olive-primary); background: var(--olive-bg); }
.photo-input-hidden { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.photo-dropzone { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.photo-uploading { display: flex; align-items: center; justify-content: center; gap: 8px; }
.loading-spinner-sm { width: 18px; height: 18px; border: 2px solid var(--border-light); border-top-color: var(--olive-primary); border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.photo-previews { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 8px; margin-top: 10px; }
.photo-preview-item { position: relative; }
.photo-preview-img { width: 100%; height: 80px; object-fit: cover; border-radius: 6px; border: 1px solid var(--border-light); }
.photo-remove-btn { position: absolute; top: -6px; right: -6px; width: 22px; height: 22px; border-radius: 50%; border: none; background: var(--red-orange); color: white; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.photo-remove-btn:hover { background: var(--text-red); }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
