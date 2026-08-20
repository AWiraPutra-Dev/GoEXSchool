<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const op = useOperatorDataStore()
const admin = useMasterDataStore()
const { myEkskul, isOperator, isScopedOperator } = useEkskulScope()
const { confirm } = useConfirm()
onMounted(() => { op.fetchAll(); admin.fetchReference() })
const selectedEkskul = ref('Semua')
const search = ref('')
const showModal = ref(false)
const form = reactive({ studentId: '', extracurricularId: '' })

const filtered = computed(() => {
  let result = op.members
  if (selectedEkskul.value !== 'Semua') result = result.filter(m => m.ekskul === selectedEkskul.value)
  if (search.value) result = result.filter(m => m.name.toLowerCase().includes(search.value.toLowerCase()) || m.class.toLowerCase().includes(search.value.toLowerCase()))
  return result
})

const { page, paged, totalPages } = usePagination(() => filtered.value)

const ekskulOptions = computed(() => {
  const names = [...new Set(op.members.map(m => m.ekskul))]
  return ['Semua', ...names]
})

function openModal() {
  form.studentId = ''; form.extracurricularId = ''
  // Operator ekskul: anggota otomatis masuk ke ekskul miliknya
  if (isScopedOperator.value && myEkskul.value) form.extracurricularId = myEkskul.value.id
  showModal.value = true
}

function addMember() {
  op.addMember({ studentId: form.studentId, extracurricularId: form.extracurricularId })
  showModal.value = false; form.studentId = ''; form.extracurricularId = ''
}

async function removeMember(m: any) {
  const ok = await confirm({
    title: `Keluarkan ${m.name} dari ${m.ekskul}?`,
    message: 'Anggota akan dikeluarkan dari ekskul ini. Riwayat kehadirannya tetap tersimpan.',
    confirmText: 'Ya, Keluarkan',
    danger: true,
  })
  if (!ok) return
  op.deleteMember(m.id)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.members') }}</h1>
      <button class="btn-primary" @click="openModal"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah Anggota</button>
    </div>
    <div class="table-card">
      <div class="table-toolbar">
        <div class="flex gap-3 items-center">
          <select v-model="selectedEkskul" class="filter-select">
            <option v-for="e in ekskulOptions" :key="e">{{ e }}</option>
          </select>
          <input v-model="search" type="text" placeholder="Cari nama atau kelas..." class="search-input">
        </div>
      </div>
      <table class="data-table">
        <thead><tr><th>Nama</th><th>Kelas</th><th>Ekskul</th><th>Bergabung</th><th>Status</th><th class="text-right">Aksi</th></tr></thead>
        <tbody>
          <tr v-for="m in paged" :key="m.id">
            <td class="font-semibold">{{ m.name }}</td><td>{{ m.class }}</td>
            <td><span class="ekskul-tag">{{ m.ekskul }}</span></td>
            <td style="color: var(--text-secondary);">{{ m.joinDate }}</td>
            <td>
              <span class="status-dot" :class="m.status === 'active' ? 'active' : 'inactive'" @click="op.toggleMemberStatus(m.id)" style="cursor:pointer;">
                {{ m.status === 'active' ? 'Aktif' : 'Nonaktif' }}
              </span>
            </td>
            <td class="text-right"><button class="delete-btn" @click="removeMember(m)" title="Hapus"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button></td>
          </tr>
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="filtered.length" />
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">Tambah Anggota Baru</h3>
          <form @submit.prevent="addMember" class="space-y-3">
            <div class="form-group"><label>Siswa</label><select v-model="form.studentId" class="form-input" required><option disabled value="">Pilih Siswa</option><option v-for="s in admin.students" :key="s.id" :value="s.id">{{ s.name }} ({{ s.nis }} - {{ s.class }})</option></select></div>
            <div class="form-group">
              <label>Ekskul</label>
              <select v-if="!isOperator" v-model="form.extracurricularId" class="form-input" required><option disabled value="">Pilih Ekskul</option><option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option></select>
              <div v-else-if="myEkskul" class="scope-badge"><Icon name="i-lucide-shield" class="w-4 h-4" /> {{ myEkskul.name }}</div>
              <div v-else class="scope-warning"><Icon name="i-lucide-alert-circle" class="w-4 h-4" /> Akun belum diikat ke ekskul. Hubungi admin.</div>
            </div>
            <div class="modal-actions"><button type="button" class="btn-cancel" @click="showModal = false">Batal</button><button type="submit" class="btn-primary">Tambah</button></div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 7px 14px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 7px 18px; border: 1px solid var(--border-light); cursor: pointer; }
.table-card { background: var(--bg-card); border: 1px solid var(--border-light); }
.table-toolbar { display: flex; align-items: center; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.filter-select, .search-input { border: 1px solid var(--border-light); padding: 7px 10px; font-size: var(--text-sm); color: var(--text-primary); }
.search-input { width: 200px; }
.filter-select:focus, .search-input:focus { outline: none; border-color: var(--olive-primary); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.ekskul-tag { font-size: var(--text-sm); color: var(--text-secondary); }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; font-weight: var(--font-medium); }
.status-active { background: rgba(74,158,158,0.15); color: var(--teal); }
.status-inactive { background: rgba(212,106,90,0.15); color: var(--red-orange); }
.delete-btn { background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px 8px; opacity: 0.5; transition: opacity 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.delete-btn:hover { opacity: 1; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; padding: 24px; width: 500px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 7px 10px; border: 1px solid var(--border-light); font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.scope-badge { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border: 1px solid var(--border-light); font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-secondary); }
.scope-warning { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border: 1px solid #fecaca; font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--red-orange); background: #fef2f2; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.data-table th.text-right, .data-table td.text-right { text-align: right; }
.text-right { text-align: right; }
</style>
