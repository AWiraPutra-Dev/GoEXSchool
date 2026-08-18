<script setup lang="ts">
import type { Ekskul } from '~/stores/master-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const store = useMasterDataStore()
const { confirm } = useConfirm()
const showModal = ref(false)
const editMode = ref(false)
const saving = ref(false)
const deletingId = ref<string | null>(null)
const form = reactive({ id: '', name: '', quota: 20, scheduleInfo: '', description: '', logoUrl: null as string | null })

onMounted(() => store.fetchAll())

const search = ref('')
const filteredEkskul = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return store.extracurriculars
  return store.extracurriculars.filter((e: any) =>
    (e.name || '').toLowerCase().includes(q) ||
    (e.coach || '').toLowerCase().includes(q)
  )
})
const { page, paged, totalPages } = usePagination(() => filteredEkskul.value)

function openAdd() { editMode.value = false; Object.assign(form, { id: '', name: '', quota: 20, scheduleInfo: '', description: '', logoUrl: null }); showModal.value = true }
function openEdit(e: Ekskul) { editMode.value = true; form.id = e.id; form.name = e.name; form.quota = e.quota; form.scheduleInfo = e.scheduleInfo || ''; form.description = e.description || ''; form.logoUrl = (e as any).logoUrl || null; showModal.value = true }
async function save() {
  saving.value = true
  try {
    if (editMode.value) await store.updateEkskul(form.id, { name: form.name, quota: form.quota, scheduleInfo: form.scheduleInfo, description: form.description, logoUrl: form.logoUrl })
    else await store.addEkskul({ name: form.name, quota: form.quota, scheduleInfo: form.scheduleInfo, description: form.description, logoUrl: form.logoUrl })
    showModal.value = false
  } finally { saving.value = false }
}
async function removeEkskul(e: any) {
  const rc = e.relatedCounts ?? {}
  // Peringatan lengkap: semua data ekskul ikut terhapus permanen.
  const ok = await confirm({
    title: `Hapus ekskul "${e.name}"?`,
    message: 'Seluruh data yang terhubung dengan ekskul ini akan dihapus permanen dan tidak dapat dikembalikan.',
    confirmText: 'Ya, Hapus Ekskul',
    danger: true,
    verify: 'HAPUS',
    related: [
      { label: 'Anggota ekskul', count: rc.members || 0 },
      { label: 'Jadwal', count: rc.schedules || 0 },
      { label: 'Penilaian', count: rc.assessments || 0 },
      { label: 'Sesi absensi', count: rc.sessions || 0 },
      { label: 'Rekaman absensi', count: rc.records || 0 },
      { label: 'Voting', count: rc.polls || 0 },
      { label: 'Pengumuman & berita', count: rc.news || 0 },
      { label: 'Galeri foto', count: rc.galleries || 0 },
      { label: 'Prestasi', count: rc.achievements || 0 },
      { label: 'Postingan feed', count: rc.feed || 0 },
      { label: 'Artikel blog', count: rc.articles || 0 },
      { label: 'Materi ekskul', count: rc.materials || 0 },
      { label: 'Jabatan kepengurusan', count: rc.board || 0 },
      { label: 'Akun operator ekskul', count: rc.operators || 0 },
    ].filter(r => r.count > 0),
  })
  if (!ok) return
  deletingId.value = e.id
  try {
    await store.deleteEkskul(e.id)
  } finally {
    deletingId.value = null
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.extracurriculars') }}</h1>
      <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah Ekskul</button>
    </div>
    <div class="table-toolbar">
      <input v-model="search" type="text" placeholder="Cari nama atau pembina..." class="search-input">
    </div>
    <div class="ekskul-grid">
      <div v-for="e in paged" :key="e.id" class="ekskul-card">
        <div class="ekskul-card-header">
          <div class="ekskul-head-left">
            <div v-if="(e as any).logoUrl" class="ekskul-logo">
              <img :src="(e as any).logoUrl" alt="" class="ekskul-logo-img" />
            </div>
            <div>
              <h3 class="ekskul-name">{{ e.name }}</h3>
              <p class="ekskul-coach">{{ e.coach }}</p>
            </div>
          </div>
          <div class="ekskul-actions"><button @click="openEdit(e)" title="Edit" style="background:none;border:none;cursor:pointer;padding:2px 6px;display:inline-flex;align-items:center;"><Icon name="i-lucide-pencil" class="w-4 h-4" /></button>
             <button @click="removeEkskul(e)" title="Hapus" :disabled="deletingId === e.id" style="background:none;border:none;cursor:pointer;padding:2px 6px;color:var(--text-red);display:inline-flex;align-items:center;">
               <Icon v-if="deletingId === e.id" name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
               <Icon v-else name="i-lucide-trash-2" class="w-4 h-4" />
             </button>
          </div>
        </div>
        <p class="ekskul-desc">{{ e.description }}</p>
        <p class="ekskul-schedule"><Icon name="i-lucide-clock" class="w-3.5 h-3.5" /> {{ e.scheduleInfo || e.schedule }}</p>
        <div class="progress-bar"><div class="progress-fill" :style="{ width: `${(e.members / e.quota) * 100}%` }"></div></div>
        <p class="ekskul-count">{{ e.members }}/{{ e.quota }} anggota</p>
      </div>
    </div>
    <PaginationBar v-model:page="page" :total="filteredEkskul.length" />
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">{{ editMode ? 'Edit Ekskul' : 'Tambah Ekskul Baru' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-group"><label>Logo Ekskul</label><LogoUploader v-model="form.logoUrl" :size="72" /></div>
            <div class="form-row">
              <div class="form-group"><label>Nama Ekskul</label><input v-model="form.name" class="form-input" required></div>
              <div class="form-group"><label>Kuota</label><input v-model.number="form.quota" type="number" min="1" class="form-input" required></div>
            </div>
            <div class="form-group"><label>Jadwal</label><input v-model="form.scheduleInfo" class="form-input" placeholder="Contoh: Senin & Rabu 14.00-15.30"></div>
            <div class="form-group"><label>Deskripsi</label><textarea v-model="form.description" class="form-input" rows="2"></textarea></div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">Batal</button>
              <button type="submit" class="btn-primary">{{ editMode ? 'Simpan' : 'Tambah' }}</button>
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
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); background: var(--bg-card); }
.search-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.ekskul-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; }
.ekskul-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); padding: 20px; transition: transform 0.2s, box-shadow 0.2s; }
.ekskul-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.ekskul-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
.ekskul-head-left { display: flex; align-items: center; gap: 12px; }
.ekskul-logo { width: 44px; height: 44px; border-radius: 10px; border: 1px solid var(--border-light); background: white; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
.ekskul-logo-img { width: 100%; height: 100%; object-fit: contain; padding: 3px; }
.ekskul-name { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.ekskul-coach { font-size: var(--text-sm); color: var(--text-secondary); margin-top: 2px; }
.ekskul-desc { font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 8px; }
.ekskul-schedule { font-size: var(--text-sm); color: var(--text-muted); display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
.progress-bar { width: 100%; height: 6px; border-radius: 3px; background: var(--bg-main); overflow: hidden; margin-bottom: 4px; }
.progress-fill { height: 100%; border-radius: 3px; background: var(--olive-primary); transition: width 0.3s ease; }
.spin-icon { animation: spin 1s linear infinite; display: inline-flex; }
@keyframes spin { to { transform: rotate(360deg); } }
.ekskul-count { font-size: var(--text-xs); color: var(--text-muted); }
.ekskul-actions { display: flex; gap: 2px; font-size: 14px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
</style>
