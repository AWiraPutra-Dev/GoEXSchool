<script setup lang="ts">
import type { Achievement } from '~/stores/siswa-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()
const showModal = ref(false)
const editMode = ref(false)
const admin = useMasterDataStore()
const saved = ref(false)
const form = reactive({ id: '', title: '', description: '', date: '', type: 'juara' as Achievement['type'], extracurricularId: '', level: 'sekolah' as Achievement['level'], proof: '' })
const filterType = ref<string>('all')
const filterLevel = ref<string>('all')

const filteredAchievements = computed(() => {
  let result = siswa.achievements
  if (filterType.value !== 'all') result = result.filter(a => a.type === filterType.value)
  if (filterLevel.value !== 'all') result = result.filter(a => a.level === filterLevel.value)
  return result
})

const stats = computed(() => ({
  total: siswa.achievements.length,
  juara: siswa.achievements.filter(a => a.type === 'juara').length,
  sertifikat: siswa.achievements.filter(a => a.type === 'sertifikat').length,
  partisipasi: siswa.achievements.filter(a => a.type === 'partisipasi').length
}))

function openAdd() {
  editMode.value = false
  Object.assign(form, { id: '', title: '', description: '', date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }), type: 'juara', extracurricularId: '', level: 'sekolah', proof: '' })
  showModal.value = true
}

function openEdit(a: Achievement) {
  editMode.value = true
  Object.assign(form, a)
  showModal.value = true
}

function save() {
  if (editMode.value) { siswa.updateAchievement(form.id, { title: form.title, description: form.description, date: form.date, type: form.type, extracurricularId: form.extracurricularId, level: form.level }) }
  else { siswa.addAchievement({ title: form.title, description: form.description, date: form.date, type: form.type, extracurricularId: form.extracurricularId, level: form.level }) }
  saved.value = true
  setTimeout(() => { saved.value = false; showModal.value = false }, 800)
}

function removeAchievement(id: string) { if (confirm('Hapus prestasi ini?')) siswa.deleteAchievement(id) }

const typeLabels: Record<string, string> = { juara: '🥇 Juara', sertifikat: '📜 Sertifikat', partisipasi: '🤝 Partisipasi', organisasi: '👥 Organisasi' }
const levelColors: Record<string, string> = { sekolah: 'var(--teal)', kecamatan: 'var(--teal-mid)', kota: 'var(--yellow-cream)', provinsi: 'var(--orange)', nasional: 'var(--red-orange)' }
const levelLabels: Record<string, string> = { sekolah: 'Sekolah', kecamatan: 'Kecamatan', kota: 'Kota', provinsi: 'Provinsi', nasional: 'Nasional' }
const typeColors: Record<string, string> = { juara: 'var(--yellow-cream)', sertifikat: 'var(--teal)', partisipasi: 'var(--green-soft)', organisasi: 'var(--olive-primary)' }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">Portofolio Prestasi</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">Kumpulan pencapaian dan prestasi selama mengikuti ekskul</p>
      </div>
      <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah Prestasi</button>
    </div>

    <div class="stats-row">
      <div class="stat-mini-card" style="border-color: var(--olive-primary);"><span class="stat-value" style="color: var(--olive-primary);">{{ stats.total }}</span><span class="stat-label">Total Prestasi</span></div>
      <div class="stat-mini-card" style="border-color: var(--yellow-cream);"><span class="stat-value" style="color: var(--yellow-cream);">{{ stats.juara }}</span><span class="stat-label">Juara</span></div>
      <div class="stat-mini-card" style="border-color: var(--teal);"><span class="stat-value" style="color: var(--teal);">{{ stats.sertifikat }}</span><span class="stat-label">Sertifikat</span></div>
      <div class="stat-mini-card" style="border-color: var(--green-soft);"><span class="stat-value" style="color: var(--green-soft);">{{ stats.partisipasi }}</span><span class="stat-label">Partisipasi</span></div>
    </div>

    <div class="filter-bar">
      <div class="filter-group">
        <span class="filter-label">Jenis:</span>
        <button v-for="opt in [['all', 'Semua'], ['juara', '🏆 Juara'], ['sertifikat', '📜 Sertifikat'], ['partisipasi', '🤝 Partisipasi']]" :key="opt[0]" class="filter-chip" :class="{ active: filterType === opt[0] }" @click="filterType = opt[0]">{{ opt[1] }}</button>
      </div>
      <div class="filter-group">
        <span class="filter-label">Tingkat:</span>
        <button v-for="opt in [['all', 'Semua'], ['sekolah', 'Sekolah'], ['kota', 'Kota'], ['provinsi', 'Provinsi'], ['nasional', 'Nasional']]" :key="opt[0]" class="filter-chip" :class="{ active: filterLevel === opt[0] }" @click="filterLevel = opt[0]">{{ opt[1] }}</button>
      </div>
    </div>

    <div class="achievements-grid">
      <div v-for="a in filteredAchievements" :key="a.id" class="achievement-card">
        <div class="ach-top">
          <div class="ach-icon-wrapper" :style="{ background: typeColors[a.type] + '20', color: typeColors[a.type] }">
            <Icon :name="a.type === 'juara' ? 'i-lucide-trophy' : a.type === 'sertifikat' ? 'i-lucide-award' : a.type === 'partisipasi' ? 'i-lucide-handshake' : 'i-lucide-users'" class="w-6 h-6" />
          </div>
          <div class="ach-badges">
            <span class="ach-type-badge" :style="{ background: typeColors[a.type] + '20', color: typeColors[a.type] }">{{ typeLabels[a.type] }}</span>
            <span class="ach-level-badge" :style="{ background: levelColors[a.level] + '20', color: levelColors[a.level] }">{{ levelLabels[a.level] }}</span>
          </div>
        </div>
        <h3 class="ach-title">{{ a.title }}</h3>
        <p class="ach-desc">{{ a.description }}</p>
        <div class="ach-footer">
          <span class="ach-ekskul">{{ a.ekskul }}</span>
          <span class="ach-date">{{ a.date }}</span>
          <div class="ach-actions">
            <button @click="openEdit(a)" title="Edit" class="ach-action-btn">✏️</button>
            <button @click="removeAchievement(a.id)" title="Hapus" class="ach-action-btn" style="color: var(--text-red);">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!filteredAchievements.length" class="empty-state">Tidak ada prestasi ditemukan.</div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" style="width:550px;">
          <h3 class="modal-title">{{ editMode ? 'Edit Prestasi' : 'Tambah Prestasi Baru' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-group"><label>Judul Prestasi</label><input v-model="form.title" class="form-input" required placeholder="Contoh: Juara 2 Basket Kota Bandung"></div>
            <div class="form-group"><label>Deskripsi</label><textarea v-model="form.description" class="form-input" rows="2"></textarea></div>
            <div class="form-row">
              <div class="form-group"><label>Tanggal</label><input v-model="form.date" type="date" class="form-input" required></div>
              <div class="form-group"><label>Ekskul</label><select v-model="form.extracurricularId" class="form-input" required><option disabled value="">Pilih Ekskul</option><option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option></select></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Jenis</label><select v-model="form.type" class="form-input"><option value="juara">🏆 Juara</option><option value="sertifikat">📜 Sertifikat</option><option value="partisipasi">🤝 Partisipasi</option><option value="organisasi">👥 Organisasi</option></select></div>
              <div class="form-group"><label>Tingkat</label><select v-model="form.level" class="form-input"><option value="sekolah">Sekolah</option><option value="kecamatan">Kecamatan</option><option value="kota">Kota</option><option value="provinsi">Provinsi</option><option value="nasional">Nasional</option></select></div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">Batal</button>
              <button type="submit" class="btn-primary">
                <Icon v-if="saved" name="i-lucide-check" class="w-4 h-4" />
                {{ saved ? 'Tersimpan!' : (editMode ? 'Simpan' : 'Tambah') }}
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
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-mini-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px; text-align: center; border-left: 3px solid; }
.stat-value { display: block; font-size: var(--text-xl); font-weight: var(--font-bold); }
.stat-label { font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; }

.filter-bar { display: flex; flex-direction: column; gap: 8px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 12px 16px; }
.filter-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.filter-label { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--text-muted); min-width: 50px; }
.filter-chip { padding: 4px 12px; border-radius: 14px; border: 1px solid var(--border-light); background: white; font-size: var(--text-xs); cursor: pointer; transition: all 0.2s; color: var(--text-secondary); }
.filter-chip.active { background: var(--olive-primary); color: white; border-color: var(--olive-primary); }
.filter-chip:hover:not(.active) { background: var(--bg-hover); }

.achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
.achievement-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 10px; padding: 20px; transition: all 0.2s; }
.achievement-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); transform: translateY(-1px); }
.ach-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
.ach-icon-wrapper { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ach-badges { display: flex; gap: 4px; flex-wrap: wrap; justify-content: flex-end; }
.ach-type-badge, .ach-level-badge { font-size: 10px; padding: 2px 8px; border-radius: 6px; font-weight: var(--font-medium); }
.ach-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.ach-desc { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: 12px; }
.ach-footer { display: flex; align-items: center; gap: 8px; font-size: var(--text-xs); color: var(--text-muted); padding-top: 12px; border-top: 1px solid var(--border-light); }
.ach-ekskul { font-weight: var(--font-semibold); color: var(--olive-primary); }
.ach-date { margin-left: auto; }
.ach-actions { display: flex; gap: 4px; }
.ach-action-btn { background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px; border-radius: 4px; transition: background 0.2s; }
.ach-action-btn:hover { background: var(--bg-hover); }
.empty-state { text-align: center; padding: 40px; color: var(--text-muted); font-size: var(--text-sm); background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 8px; }

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
