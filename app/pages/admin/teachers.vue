<script setup lang="ts">
import type { Teacher } from '~/stores/master-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const store = useMasterDataStore()
const { confirm } = useConfirm()
const search = ref('')
const showModal = ref(false)
const editMode = ref(false)
const saving = ref(false)
const form = reactive({ id: '', nip: '', name: '', subject: '', phone: '' })

onMounted(() => store.fetchAll())

const filtered = computed(() => store.teachers.filter(t =>
  t.name.toLowerCase().includes(search.value.toLowerCase()) || t.nip.includes(search.value) || t.subject.toLowerCase().includes(search.value.toLowerCase())
))

const { page, paged, totalPages } = usePagination(() => filtered.value)

function openAdd() { editMode.value = false; Object.assign(form, { id: '', nip: '', name: '', subject: '', phone: '' }); showModal.value = true }
function openEdit(t: Teacher) { editMode.value = true; form.id = t.id; form.nip = t.nip; form.name = t.name; form.subject = t.subject; form.phone = t.phone || ''; showModal.value = true }
async function save() {
  saving.value = true
  try {
    if (editMode.value) await store.updateTeacher(form.id, { nip: form.nip, name: form.name, subject: form.subject, phone: form.phone })
    else await store.addTeacher({ nip: form.nip, name: form.name, subject: form.subject, phone: form.phone })
    showModal.value = false
  } finally { saving.value = false }
}
async function removeTeacher(t: Teacher) {
  const ok = await confirm({
    title: `Hapus pembimbing "${t.name}"?`,
    message: 'Data pembimbing ini akan dihapus permanen. Ekskul yang dibimbingnya tidak ikut terhapus.',
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  await store.deleteTeacher(t.id)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.teachers') }}</h1>
      <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah Pembimbing</button>
    </div>
    <div class="table-card">
      <div class="table-toolbar"><input v-model="search" type="text" placeholder="Cari nama, NIP, atau bidang..." class="search-input"></div>
      <table class="data-table">
        <thead><tr><th>NIP</th><th>Nama</th><th>Bidang</th><th>Telepon</th><th class="text-right">Aksi</th></tr></thead>
        <tbody>
          <tr v-for="t in paged" :key="t.id">
            <td><span class="nis-code">{{ t.nip }}</span></td>
            <td class="font-semibold">{{ t.name }}</td>
            <td>{{ t.subject }}</td>
            <td style="color: var(--text-secondary);">{{ t.phone }}</td>
            <td class="text-right action-cell">
              <button class="action-btn" @click="openEdit(t)" title="Edit"><Icon name="i-lucide-pencil" class="w-4 h-4" /></button>
              <button class="action-btn" @click="removeTeacher(t)" title="Hapus" style="color: var(--text-red);"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="6" class="text-center py-8" style="color: var(--text-muted);">Tidak ada data</td></tr>
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="filtered.length" />
    </div>
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">{{ editMode ? 'Edit Pembimbing' : 'Tambah Pembimbing Baru' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-row">
              <div class="form-group"><label>NIP</label><input v-model="form.nip" class="form-input" required></div>
              <div class="form-group"><label>Nama Lengkap</label><input v-model="form.name" class="form-input" required></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Bidang / Ekskul yang Dibimbing</label><input v-model="form.subject" class="form-input" required placeholder="Contoh: Olahraga, Seni Budaya, Pramuka"></div>
              <div class="form-group"><label>Telepon</label><input v-model="form.phone" class="form-input"></div>
            </div>
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
.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); }
.search-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.3px; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.nis-code { font-size: var(--text-xs); font-variant-numeric: tabular-nums; letter-spacing: 0.04em; font-weight: var(--font-medium); color: var(--text-secondary); }
.ekskul-tag { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.action-cell { display: flex; gap: 4px; justify-content: flex-end; }
.action-btn { background: none; border: none; cursor: pointer; padding: 4px 6px; border-radius: 4px; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }
.action-btn:hover { background: var(--bg-hover); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.text-right { text-align: right; }
</style>
