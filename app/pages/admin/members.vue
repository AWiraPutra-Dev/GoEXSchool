<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const selectedEkskul = ref('Semua')
const search = ref('')

const filtered = computed(() => {
  let result = op.members
  if (selectedEkskul.value !== 'Semua') result = result.filter(m => m.ekskul === selectedEkskul.value)
  if (search.value) result = result.filter(m => m.name.toLowerCase().includes(search.value.toLowerCase()) || m.class.toLowerCase().includes(search.value.toLowerCase()))
  return result
})

const ekskulOptions = ['Semua', ...new Set(op.members.map(m => m.ekskul))]
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Anggota Ekskul</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">{{ op.members.length }} total anggota</p>

    <div class="table-card">
      <div class="table-toolbar">
        <div class="flex gap-3 items-center">
          <select v-model="selectedEkskul" class="filter-select">
            <option v-for="e in ekskulOptions" :key="e">{{ e }}</option>
          </select>
          <input v-model="search" type="text" placeholder="Cari nama atau kelas..." class="search-input">
        </div>
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} anggota</span>
      </div>
      <table class="data-table">
        <thead><tr><th>Nama</th><th>Kelas</th><th>Ekskul</th><th>Bergabung</th><th>Status</th></tr></thead>
        <tbody>
          <tr v-for="m in filtered" :key="m.id">
            <td class="font-semibold">{{ m.name }}</td><td>{{ m.class }}</td>
            <td><span class="ekskul-tag">{{ m.ekskul }}</span></td>
            <td style="color: var(--text-secondary);">{{ m.joinDate }}</td>
            <td><span class="status-badge" :class="m.status === 'active' ? 'status-active' : 'status-inactive'">{{ m.status === 'active' ? 'Aktif' : 'Nonaktif' }}</span></td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="5" class="text-center py-8" style="color: var(--text-muted);">Tidak ada data</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.filter-select, .search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); color: var(--text-primary); }
.search-input { width: 200px; }
.filter-select:focus, .search-input:focus { outline: none; border-color: var(--olive-primary); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.ekskul-tag { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); }
.status-active { background: rgba(74,158,158,0.15); color: var(--teal); }
.status-inactive { background: rgba(212,106,90,0.15); color: var(--red-orange); }
</style>
