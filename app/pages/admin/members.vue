<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const op = useOperatorDataStore()
const master = useMasterDataStore()

onMounted(async () => {
  await Promise.all([op.fetchAll(), master.fetchReference()])
  // Jika datang dari klik kartu ekskul (mis. /admin/members?ekskul=id),
  // langsung tampilkan anggota ekskul tersebut.
  const route = useRoute()
  const q = route.query.ekskul
  if (typeof q === 'string' && master.extracurriculars.some(e => e.id === q)) {
    filter.value = q
  }
})

// 'semua' | 'tanpa' | <ekskulId>
const filter = ref('semua')
const search = ref('')

interface MemberInfo {
  id: string
  ekskul: string
  ekskulId: string
  status: string
  joinDate: string
}

// Peta: studentId → daftar keanggotaan (bisa lebih dari satu ekskul)
const membersByStudent = computed<Record<string, MemberInfo[]>>(() => {
  const map: Record<string, MemberInfo[]> = {}
  for (const m of op.members) {
    const entry: MemberInfo = { id: m.id, ekskul: m.ekskul, ekskulId: m.ekskulId, status: m.status, joinDate: m.joinDate }
    if (!map[m.studentId]) map[m.studentId] = []
    map[m.studentId]!.push(entry)
  }
  return map
})

const filtered = computed(() => {
  let result = master.students
  if (filter.value === 'tanpa') {
    result = result.filter(s => !(membersByStudent.value[s.id]?.length))
  } else if (filter.value !== 'semua') {
    result = result.filter(s => membersByStudent.value[s.id]?.some(m => m.ekskulId === filter.value))
  }
  if (search.value) {
    const q = search.value.toLowerCase()
    result = result.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.nis.toLowerCase().includes(q) ||
      s.class.toLowerCase().includes(q)
    )
  }
  return result
})

const { page, paged, totalPages } = usePagination(() => filtered.value)

const stats = computed(() => {
  const total = master.students.length
  const tanpa = master.students.filter(s => !(membersByStudent.value[s.id]?.length)).length
  return { total, tanpa, ikut: total - tanpa }
})

function memberStatus(s: { id: string }) {
  const mems = membersByStudent.value[s.id] || []
  if (!mems.length) return { label: 'Tidak Mengikuti', cls: 'pending' }
  if (mems.some(m => m.status === 'active')) return { label: 'Aktif', cls: 'active' }
  return { label: 'Nonaktif', cls: 'inactive' }
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="page-title">{{ ui.t('menu.members') }}</h1>
      <p class="text-[13px]" style="color: var(--text-secondary);">Semua siswa di sekolah. Kelompokkan berdasarkan ekskul untuk melihat anggotanya.</p>
    </div>

    <!-- Ringkasan -->
    <div class="stats-grid">
      <div class="stat-card"><span class="stat-value">{{ stats.total }}</span><span class="stat-label">Total Siswa</span></div>
      <div class="stat-card"><span class="stat-value">{{ stats.ikut }}</span><span class="stat-label">Mengikuti Ekskul</span></div>
      <div class="stat-card"><span class="stat-value">{{ stats.tanpa }}</span><span class="stat-label">Tidak Mengikuti</span></div>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <div class="flex gap-3 items-center flex-wrap">
          <select v-model="filter" class="filter-select">
            <option value="semua">Semua Siswa ({{ stats.total }})</option>
            <option value="tanpa">Tidak Mengikuti Ekskul ({{ stats.tanpa }})</option>
            <option v-for="e in master.extracurriculars" :key="e.id" :value="e.id">{{ e.name }} ({{ e.members }} anggota)</option>
          </select>
          <input v-model="search" type="text" placeholder="Cari nama, NIS, atau kelas..." class="search-input">
        </div>
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} dari {{ stats.total }} siswa</span>
      </div>
      <table class="data-table">
        <thead><tr><th>NIS</th><th>Nama</th><th>Kelas</th><th>Ekskul</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="s in paged" :key="s.id">
            <td><span class="nis-code">{{ s.nis }}</span></td>
            <td class="font-semibold">{{ s.name }}</td>
            <td>{{ s.class }}</td>
            <td>
              <template v-if="membersByStudent[s.id]?.length">
                <span
                  v-for="m in membersByStudent[s.id]"
                  :key="m.id"
                  class="ekskul-tag"
                  :class="{ 'ekskul-inactive': m.status !== 'active' }"
                >{{ m.ekskul }}</span>
              </template>
              <span v-else class="text-[12px]" style="color: var(--text-muted);">-</span>
            </td>
            <td>
              <span class="status-dot" :class="memberStatus(s).cls">{{ memberStatus(s).label }}</span>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td colspan="5" class="text-center py-8" style="color: var(--text-muted);">Tidak ada siswa ditemukan</td>
          </tr>
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="filtered.length" />
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border-light); padding: 14px; text-align: center; }
.stat-value { display: block; font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.stat-label { font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; }
.table-card { background: var(--bg-card); border: 1px solid var(--border-light); }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); gap: 8px; flex-wrap: wrap; }
.filter-select, .search-input { border: 1px solid var(--border-light); padding: 7px 10px; font-size: var(--text-sm); color: var(--text-primary); background: white; }
.search-input { width: 220px; }
.filter-select:focus, .search-input:focus { outline: none; border-color: var(--olive-primary); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.3px; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); vertical-align: middle; }
.nis-code { font-size: var(--text-xs); font-variant-numeric: tabular-nums; letter-spacing: 0.04em; font-weight: var(--font-medium); color: var(--text-secondary); }
.ekskul-tag { display: inline-block; font-size: var(--text-sm); color: var(--text-secondary); margin: 2px 4px 2px 0; }
.ekskul-inactive { color: var(--red-orange); }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; font-weight: var(--font-medium); white-space: nowrap; }
.status-active { background: rgba(74,158,158,0.15); color: var(--teal); }
.status-inactive { background: rgba(212,106,90,0.15); color: var(--red-orange); }
.status-none { background: rgba(212,192,137,0.2); color: var(--orange); }
</style>
