<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const op = useOperatorDataStore()
const admin = useMasterDataStore()
const { myEkskul, isOperator, isScopedOperator } = useEkskulScope()
const { confirm } = useConfirm()
const showModal = ref(false)
const saving = ref(false)
const selectedEkskul = ref('')
const uploadedFile = ref<{ url: string; name: string } | null>(null)
const uploading = ref(false)

const form = reactive({
  title: '',
  description: '',
  extracurricularId: '',
  fileType: 'link',
  content: '',
})

onMounted(() => {
  admin.fetchReference()
  op.fetchMaterials()
})

const filteredMaterials = computed(() => {
  if (!selectedEkskul.value) return op.materials
  return op.materials.filter((m: any) => m.ekskulId === selectedEkskul.value)
})

const { page, paged, totalPages } = usePagination(() => filteredMaterials.value)

// Filter ekskul diambil dari data materi (sudah di-scope server per operator),
// bukan dari daftar umum — jadi operator tidak akan pernah melihat ekskul lain.
const ekskulList = computed(() => {
  const seen = new Map<string, string>()
  for (const m of op.materials as any[]) {
    if (m.ekskulId && !seen.has(m.ekskulId)) seen.set(m.ekskulId, m.ekskul)
  }
  return [
    { id: '', name: 'Semua Ekskul' },
    ...[...seen.entries()].map(([id, name]) => ({ id, name }))
  ]
})

function openCreate() {
  Object.assign(form, { title: '', description: '', extracurricularId: '', fileType: 'link', content: '' })
  // Operator ekskul: materi otomatis untuk ekskul miliknya
  if (isScopedOperator.value && myEkskul.value) form.extracurricularId = myEkskul.value.id
  uploadedFile.value = null
  showModal.value = true
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string; filename: string }>('/api/operator/upload', { method: 'POST', body: fd })
    uploadedFile.value = { url: res.url, name: res.filename }
    form.fileType = file.type?.includes('pdf') ? 'pdf' : file.type?.includes('image') ? 'image' : file.type?.includes('video') ? 'video' : 'document'
  } catch (e: any) {
    alert(e.data?.message || 'Gagal upload file.')
  } finally { uploading.value = false; input.value = '' }
}

async function save() {
  if (!form.title || (!form.extracurricularId)) { alert('Judul dan ekskul wajib diisi.'); return }
  if (!uploadedFile.value && !form.content) { alert('Upload file atau isi konten terlebih dahulu.'); return }
  saving.value = true
  try {
    await op.createMaterial({
      title: form.title,
      description: form.description,
      fileUrl: uploadedFile.value?.url || undefined,
      fileType: form.fileType,
      content: form.content || undefined,
      extracurricularId: form.extracurricularId,
    })
    showModal.value = false
  } finally { saving.value = false }
}

async function removeMaterial(m: any) {
  const ok = await confirm({
    title: `Hapus materi "${m.title}"?`,
    message: 'Materi ini akan dihapus permanen dan tidak bisa diakses siswa lagi.',
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  await op.deleteMaterial(m.id)
}

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
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">{{ ui.t('menu.materials') }}</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ op.materials.length }} total materi</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <Icon name="i-lucide-plus" class="w-4 h-4" /> Upload Materi
      </button>
    </div>

    <!-- Filter -->
    <div class="table-toolbar">
      <select v-model="selectedEkskul" class="filter-select" @change="op.fetchMaterials(selectedEkskul || undefined)">
        <option v-for="e in ekskulList" :key="e.id" :value="e.id">{{ e.name }}</option>
      </select>
      <span class="text-[11px]" style="color: var(--text-muted);">{{ filteredMaterials.length }} materi</span>
    </div>

    <!-- Materials Grid -->
    <div class="materials-grid">
      <div v-for="m in paged" :key="m.id" class="material-card">
        <div class="material-icon" :style="{ background: fileTypeColors[m.fileType || 'link'] + '20', color: fileTypeColors[m.fileType || 'link'] }">
          <Icon :name="fileTypeIcons[m.fileType || 'link'] || 'i-lucide-file'" class="w-6 h-6" />
        </div>
        <div class="material-info">
          <h3 class="material-title">{{ m.title }}</h3>
          <p class="material-desc" v-if="m.description">{{ m.description }}</p>
          <p class="material-meta">
            <span class="material-ekskul">{{ m.ekskul }}</span>
            <span> · {{ m.uploadedBy }} · {{ m.createdAt }}</span>
          </p>
        </div>
        <div class="material-actions">
          <a v-if="m.fileUrl" :href="m.fileUrl" target="_blank" class="material-download-btn" title="Download">
            <Icon name="i-lucide-download" class="w-4 h-4" />
          </a>
          <button class="material-delete-btn" @click="removeMaterial(m)" title="Hapus"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
        </div>
      </div>
      <div v-if="!filteredMaterials.length" class="empty-state">
        <Icon name="i-lucide-folder-open" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
        <p style="color: var(--text-muted);">Belum ada materi. Upload materi pembelajaran untuk siswa.</p>
      </div>
    </div>
    <PaginationBar v-model:page="page" :total="filteredMaterials.length" />

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" style="width:600px;">
          <h3 class="modal-title">Upload Materi Baru</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-row-2col">
              <div class="form-group">
                <label>Judul Materi</label>
                <input v-model="form.title" class="form-input" required placeholder="Contoh: Teknik Dasar Basket">
              </div>
              <div class="form-group">
                <label>Ekskul</label>
                <select v-if="!isOperator" v-model="form.extracurricularId" class="form-input" required>
                  <option disabled value="">Pilih Ekskul</option>
                  <option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
                </select>
                <div v-else-if="myEkskul" class="scope-badge"><Icon name="i-lucide-shield" class="w-4 h-4" /> {{ myEkskul.name }}</div>
                <div v-else class="scope-warning"><Icon name="i-lucide-alert-circle" class="w-4 h-4" /> Akun belum diikat ke ekskul. Hubungi admin.</div>
              </div>
            </div>
            <div class="form-group">
              <label>Deskripsi (opsional)</label>
              <textarea v-model="form.description" class="form-input" rows="2" placeholder="Deskripsi singkat materi..."></textarea>
            </div>

            <div class="form-group">
              <label>Upload File</label>
              <div class="file-upload-area">
                <input type="file" class="file-input-hidden" @change="handleFileUpload" accept=".pdf,.doc,.docx,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.txt" />
                <div v-if="!uploading && !uploadedFile" class="file-dropzone">
                  <Icon name="i-lucide-upload" class="w-6 h-6" style="color: var(--text-muted);" />
                  <p style="font-size: var(--text-sm); color: var(--text-muted);">Klik untuk upload (PDF, gambar, video, dokumen)</p>
                </div>
                <div v-if="uploading" class="file-uploading">
                  <div class="loading-spinner-sm"></div>
                  <span>Mengupload...</span>
                </div>
                <div v-if="uploadedFile && !uploading" class="file-uploaded">
                  <Icon name="i-lucide-check-circle" class="w-5 h-5" style="color: var(--teal);" />
                  <span>{{ uploadedFile.name }}</span>
                  <button type="button" class="file-remove-btn" @click="uploadedFile = null"><Icon name="i-lucide-x" class="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>

            <div class="form-divider-text">Atau</div>

            <div class="form-group">
              <label>Konten Teks</label>
              <textarea v-model="form.content" class="form-input" rows="4" placeholder="Atau tulis materi langsung di sini..."></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving || uploading">
                {{ saving ? 'Menyimpan...' : 'Upload Materi' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }

.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; }
.filter-select { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); color: var(--text-primary); background: white; width: 240px; }
.filter-select:focus { outline: none; border-color: var(--olive-primary); }

.materials-grid { display: flex; flex-direction: column; gap: 8px; }
.material-card { display: flex; align-items: center; gap: 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px 20px; transition: all 0.2s; }
.material-card:hover { border-color: var(--olive-light); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.material-icon { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.material-info { flex: 1; min-width: 0; }
.material-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); }
.material-desc { font-size: var(--text-sm); color: var(--text-secondary); margin-top: 2px; }
.material-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; }
.material-ekskul { font-weight: var(--font-medium); color: var(--olive-primary); }
.material-actions { display: flex; gap: 6px; flex-shrink: 0; }
.material-download-btn { width: 32px; height: 32px; border-radius: 6px; background: var(--olive-bg); color: var(--olive-primary); display: flex; align-items: center; justify-content: center; text-decoration: none; transition: all 0.2s; }
.material-download-btn:hover { background: var(--olive-primary); color: white; }
.material-delete-btn { width: 32px; height: 32px; border-radius: 6px; background: none; border: none; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; opacity: 0.4; transition: all 0.2s; }
.material-delete-btn:hover { opacity: 1; background: rgba(204,68,68,0.1); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.form-divider-text { text-align: center; font-size: var(--text-sm); color: var(--text-muted); position: relative; margin: 8px 0; }
.form-divider-text::before, .form-divider-text::after { content: ''; position: absolute; top: 50%; width: 42%; height: 1px; background: var(--border-light); }
.form-divider-text::before { left: 0; } .form-divider-text::after { right: 0; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }

.file-upload-area { border: 1.5px dashed var(--border-light); border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s; position: relative; }
.file-upload-area:hover { border-color: var(--olive-primary); background: var(--olive-bg); }
.file-input-hidden { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.file-dropzone { display: flex; flex-direction: column; align-items: center; gap: 8px; }
.file-uploading { display: flex; align-items: center; justify-content: center; gap: 8px; }
.loading-spinner-sm { width: 18px; height: 18px; border: 2px solid var(--border-light); border-top-color: var(--olive-primary); border-radius: 50%; animation: spin 0.6s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.file-uploaded { display: flex; align-items: center; justify-content: center; gap: 8px; }
.scope-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: var(--olive-bg); color: var(--olive-primary); border: 1px solid var(--olive-light); border-radius: 6px; font-size: var(--text-sm); font-weight: var(--font-semibold); }
.scope-warning { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: #fef2f2; color: var(--red-orange); border: 1px solid #fecaca; border-radius: 6px; font-size: var(--text-sm); font-weight: var(--font-medium); }
.file-remove-btn { background: none; border: none; cursor: pointer; color: var(--text-muted); font-size: 16px; display: inline-flex; align-items: center; justify-content: center; }
.file-remove-btn:hover { color: var(--text-red); }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
