<script setup lang="ts">
import type { GalleryItem } from '~/stores/operator-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const admin = useMasterDataStore()
const showModal = ref(false)
const showUploadModal = ref(false)
const selectedGallery = ref<GalleryItem | null>(null)
const saving = ref(false)

function openGallery(g: GalleryItem) { selectedGallery.value = g; showModal.value = true }

const form = reactive({ title: '', extracurricularId: '', color: '#4A9E9E' })
const colors = ['#4A9E9E', '#7BA87B', '#D4C089', '#D4956A', '#D46A5A', '#8B9467']

async function upload() {
  if (!form.title || !form.extracurricularId) return
  saving.value = true
  try {
    await op.addGallery({
      title: form.title,
      extracurricularId: form.extracurricularId,
      color: form.color
    })
    showUploadModal.value = false
    form.title = ''; form.extracurricularId = ''; form.color = '#4A9E9E'
  } finally { saving.value = false }
}

async function removeGallery(id: string) {
  if (confirm('Hapus galeri ini?')) await op.deleteGallery(id)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">Galeri Foto</h1>
      <button class="btn-primary" @click="showUploadModal = true"><Icon name="i-lucide-upload" class="w-4 h-4" /> Upload Foto</button>
    </div>

    <div class="gallery-grid">
      <div v-for="g in op.gallery" :key="g.id" class="gallery-card" @click="openGallery(g)">
        <div class="gallery-thumb" :style="{ background: g.color }">
          <Icon name="i-lucide-image" class="w-10 h-10 text-white/60" />
          <span class="gallery-count">{{ g.imageCount }} foto</span>
        </div>
        <div class="gallery-info">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="gallery-title">{{ g.title }}</h3>
              <p class="gallery-meta">{{ g.ekskul }} · {{ g.date }}</p>
            </div>
            <button class="gallery-delete-btn" @click.stop="removeGallery(g.id)" title="Hapus">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal && selectedGallery" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" style="width:600px;">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[18px] font-bold" style="color:var(--text-primary);">{{ selectedGallery.title }}</h3>
            <button @click="showModal = false" style="background:none;border:none;cursor:pointer;font-size:20px;color:var(--text-muted);">✕</button>
          </div>
          <div class="gallery-preview-grid">
            <div v-for="i in 6" :key="i" class="preview-photo" :style="{ background: selectedGallery.color + '40' }">
              <Icon name="i-lucide-image" class="w-6 h-6 text-white/40" />
            </div>
          </div>
          <p class="text-center text-[13px]" style="color:var(--text-muted);margin-top:16px;">{{ Math.min(6, selectedGallery.imageCount) }} dari {{ selectedGallery.imageCount }} foto</p>
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
            <div class="form-group">
              <label>Ekskul</label>
              <select v-model="form.extracurricularId" class="form-input" required>
                <option disabled value="">Pilih Ekskul</option>
                <option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Warna Tema</label>
              <div class="color-picker">
                <button v-for="c in colors" :key="c" type="button" class="color-swatch" :class="{ selected: form.color === c }" :style="{ background: c }" @click="form.color = c"></button>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showUploadModal = false">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving">{{ saving ? 'Mengupload...' : 'Upload' }}</button>
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
.gallery-thumb { height: 150px; display: flex; align-items: center; justify-content: center; position: relative; }
.gallery-count { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.5); color: white; font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; }
.gallery-info { padding: 12px 16px; }
.gallery-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.gallery-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.gallery-delete-btn { background: none; border: none; cursor: pointer; padding: 4px; border-radius: 4px; font-size: 14px; opacity: 0; transition: opacity 0.2s; }
.gallery-card:hover .gallery-delete-btn { opacity: 1; }
.gallery-delete-btn:hover { background: rgba(204,68,68,0.1); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.gallery-preview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.preview-photo { aspect-ratio: 4/3; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.color-picker { display: flex; gap: 8px; }
.color-swatch { width: 32px; height: 32px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: all 0.2s; }
.color-swatch.selected { border-color: var(--olive-primary); transform: scale(1.15); }
</style>
