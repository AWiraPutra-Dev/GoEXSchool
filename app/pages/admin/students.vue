<script setup lang="ts">
import type { Student } from '~/stores/master-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const store = useMasterDataStore()
const { confirm } = useConfirm()
const search = ref('')
const showModal = ref(false)
const editMode = ref(false)
const saving = ref(false)
const importing = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const form = reactive({ id: '', nis: '', name: '', class: '', gender: 'L', phone: '' })

onMounted(() => store.fetchAll())

const filtered = computed(() =>
  store.students.filter(s =>
    s.name.toLowerCase().includes(search.value.toLowerCase()) ||
    s.nis.includes(search.value) ||
    s.class.toLowerCase().includes(search.value.toLowerCase())
  )
)

const { page, paged, totalPages } = usePagination(() => filtered.value)

function openAdd() {
  editMode.value = false
  form.id = ''; form.nis = ''; form.name = ''; form.class = ''; form.gender = 'L'; form.phone = ''
  showModal.value = true
}

function openEdit(s: Student) {
  editMode.value = true
  form.id = s.id; form.nis = s.nis; form.name = s.name; form.class = s.class; form.gender = s.gender; form.phone = s.phone || ''
  showModal.value = true
}

async function save() {
  saving.value = true
  try {
    if (editMode.value) {
      await store.updateStudent(form.id, { name: form.name, class: form.class, gender: form.gender, phone: form.phone })
    } else {
      await store.addStudent({ name: form.name, class: form.class, gender: form.gender, phone: form.phone })
    }
    showModal.value = false
  } finally {
    saving.value = false
  }
}

async function removeStudent(s: Student) {
  const ok = await confirm({
    title: `Hapus siswa "${s.name}"?`,
    message: 'Data siswa, keanggotaan ekskul, dan riwayatnya akan ikut terhapus.',
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  await store.deleteStudent(s.id)
}

function downloadTemplate() {
  window.open('/api/admin/students/template', '_blank')
}

function triggerFileImport() { fileInput.value?.click() }

async function handleFileImport() {
  const file = fileInput.value?.files?.[0]
  if (!file) return

  importing.value = true
  try {
    const text = await file.text()
    const lines = text.split('\n').filter(Boolean)
    const students = lines.slice(1).map(line => {
      const parts = line.split(',').map(s => s.trim())
      if (parts.length < 3) return null
      return { name: parts[0], class: parts[1], gender: parts[2], phone: parts[3] || '' }
    }).filter(Boolean) as Array<{ name: string; class: string; gender: string; phone?: string }>

    if (!students.length) {
      alert('Tidak ada data valid ditemukan di file.')
      return
    }

    const count = await store.importStudents(students)
    alert(`Berhasil mengimpor ${count} data siswa!`)
  } catch (e: any) {
    alert(e.data?.message || 'Gagal mengimpor file. Pastikan format CSV: Nama,Kelas,JK,Telepon')
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.students') }}</h1>
      <div class="flex gap-2">
        <button class="btn-outline" @click="downloadTemplate">
          <Icon name="i-lucide-download" class="w-4 h-4" />
          Download Template
        </button>
        <button class="btn-outline" :disabled="importing" @click="triggerFileImport">
          <Icon name="i-lucide-upload" class="w-4 h-4" />
          {{ importing ? 'Mengimpor...' : 'Import Excel' }}
        </button>
        <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleFileImport">
        <button class="btn-primary" @click="openAdd">
          <Icon name="i-lucide-plus" class="w-4 h-4" />
          Tambah Siswa
        </button>
      </div>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <input v-model="search" type="text" placeholder="Cari nama, NIS, atau kelas..." class="search-input">
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} dari {{ store.students.length }} siswa</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>NIS</th><th>Nama</th><th>Kelas</th><th>JK</th><th>Telepon</th><th>Status Akun</th><th class="text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in paged" :key="s.id">
            <td><span class="nis-code">{{ s.nis }}</span></td>
            <td class="font-semibold">{{ s.name }}</td>
            <td>{{ s.class }}</td>
            <td>{{ s.gender }}</td>
            <td style="color: var(--text-secondary);">{{ s.phone }}</td>
            <td>
              <span class="status-badge" :class="s.accountStatus === 'registered' ? 'status-active' : 'status-pending'">
                {{ s.accountStatus === 'registered' ? 'Akun Aktif' : 'Belum Daftar' }}
              </span>
            </td>
            <td class="text-right action-cell">
              <button class="action-btn" @click="openEdit(s)" title="Edit"><Icon name="i-lucide-pencil" class="w-4 h-4" /></button>
              <button class="action-btn" @click="removeStudent(s)" title="Hapus" style="color: var(--text-red);"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="7" class="text-center py-8" style="color: var(--text-muted);">Tidak ada data ditemukan</td>
          </tr>
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="filtered.length" />
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">{{ editMode ? 'Edit Siswa' : 'Tambah Siswa Baru' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div v-if="editMode" class="form-row">
              <div class="form-group"><label>NIS</label><input :value="form.nis" type="text" disabled class="form-input"></div>
              <div class="form-group"><label>Nama Lengkap</label><input v-model="form.name" type="text" required class="form-input"></div>
            </div>
            <div v-else class="form-row">
              <div class="form-group"><label>NIS (otomatis)</label><input value="Auto-generate" type="text" disabled class="form-input"></div>
              <div class="form-group"><label>Nama Lengkap</label><input v-model="form.name" type="text" required class="form-input"></div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Kelas</label>
                <select v-model="form.class" required class="form-input">
                  <option value="">Pilih kelas</option>
                  <option>10 IPA 1</option><option>10 IPA 2</option>
                  <option>11 IPA 1</option><option>11 IPA 2</option>
                  <option>11 IPS 1</option><option>11 IPS 2</option>
                  <option>12 IPA 1</option><option>12 IPA 2</option>
                </select>
              </div>
              <div class="form-group"><label>Jenis Kelamin</label>
                <select v-model="form.gender" class="form-input">
                  <option value="L">Laki-laki</option><option value="P">Perempuan</option>
                </select>
              </div>
            </div>
            <div class="form-group"><label>Telepon</label><input v-model="form.phone" type="text" class="form-input"></div>
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
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-primary); font-size: var(--text-sm); font-weight: var(--font-medium); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--bg-hover); }
.btn-outline:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); }
.search-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.3px; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.nis-code { font-size: var(--text-xs); font-variant-numeric: tabular-nums; letter-spacing: 0.04em; font-weight: var(--font-medium); color: var(--text-secondary); }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); }
.status-active { background: rgba(74, 158, 158, 0.15); color: var(--teal); }
.status-pending { background: rgba(212, 192, 137, 0.2); color: var(--orange); }
.action-cell { display: flex; gap: 4px; justify-content: flex-end; }
.action-btn { background: none; border: none; cursor: pointer; padding: 4px 6px; border-radius: 4px; font-size: 14px; transition: background 0.2s; display: inline-flex; align-items: center; justify-content: center; }
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
.hidden { display: none; }
</style>
