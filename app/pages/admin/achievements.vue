<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const siswa = useSiswaDataStore()
const admin = useMasterDataStore()
const { confirm } = useConfirm()
onMounted(() => { siswa.fetchAchievements(); admin.fetchReference() })

const search = ref('')
const filteredAchievements = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return siswa.achievements
  return siswa.achievements.filter((a: any) =>
    (a.title || '').toLowerCase().includes(q) ||
    (a.studentName || '').toLowerCase().includes(q) ||
    (a.ekskul || '').toLowerCase().includes(q)
  )
})
const { page, paged, totalPages } = usePagination(() => filteredAchievements.value)

const selected = ref<any>(null)

function openDetail(a: any) { selected.value = a }
function closeDetail() { selected.value = null }

// ---- Edit & hapus (khusus admin) ----
const showEditModal = ref(false)
const saving = ref(false)
const deletingId = ref<string | null>(null)
const editForm = reactive({ id: '', title: '', description: '', date: '', type: 'juara', extracurricularId: '', level: 'sekolah', proof: '' })

function openEdit(a: any) {
  closeDetail()
  Object.assign(editForm, {
    id: a.id,
    title: a.title,
    description: a.description || '',
    date: a.dateIso || '',
    type: a.type,
    extracurricularId: a.ekskulId || '',
    level: a.level,
    proof: a.proof || '',
  })
  showEditModal.value = true
}

async function saveEdit() {
  saving.value = true
  try {
    await siswa.updateAchievementAdmin(editForm.id, {
      title: editForm.title,
      description: editForm.description,
      date: editForm.date,
      type: editForm.type,
      extracurricularId: editForm.extracurricularId,
      level: editForm.level,
      proof: editForm.proof,
    })
    showEditModal.value = false
  } finally {
    saving.value = false
  }
}

async function removeAchievement(a: any) {
  const ok = await confirm({
    title: `Hapus prestasi "${a.title}"?`,
    message: `Prestasi milik ${a.studentName || 'siswa'} akan dihapus permanen dari portofolio dan tidak dapat dikembalikan.`,
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  deletingId.value = a.id
  try {
    await siswa.deleteAchievementAdmin(a.id)
    if (selected.value?.id === a.id) closeDetail()
  } finally {
    deletingId.value = null
  }
}

const typeLabels: Record<string, string> = { juara: 'Juara', sertifikat: 'Sertifikat', partisipasi: 'Partisipasi', organisasi: 'Organisasi' }
const levelLabels: Record<string, string> = { sekolah: 'Sekolah', kecamatan: 'Kecamatan', kota: 'Kota', provinsi: 'Provinsi', nasional: 'Nasional' }
const typeColors: Record<string, string> = { juara: 'var(--yellow-cream)', sertifikat: 'var(--teal)', partisipasi: 'var(--green-soft)', organisasi: 'var(--olive-primary)' }
const levelColors: Record<string, string> = { sekolah: 'var(--teal)', kecamatan: 'var(--teal-mid)', kota: 'var(--yellow-cream)', provinsi: 'var(--orange)', nasional: 'var(--red-orange)' }

function initials(name: string) {
  return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">{{ ui.t('menu.achievements') }}</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">{{ siswa.achievements.length }} total prestasi siswa</p>

    <div class="table-toolbar">
      <input v-model="search" type="text" placeholder="Cari judul, siswa, atau ekskul..." class="search-input">
    </div>

    <div class="achievements-grid">
      <div v-for="a in paged" :key="a.id" class="achievement-card" @click="openDetail(a)">
        <!-- Foto dokumentasi / sertifikat -->
        <div v-if="a.proof" class="ach-photo">
          <img :src="a.proof" :alt="a.title" loading="lazy" />
        </div>
        <div v-else class="ach-photo ach-photo-empty" :style="{ background: typeColors[a.type] + '25', color: typeColors[a.type] }">
          <Icon name="i-lucide-image-off" class="w-8 h-8" />
          <span>Belum ada foto</span>
        </div>

        <div class="ach-body">
          <div class="ach-top">
            <div class="ach-badges">
              <span class="ach-type-badge" :style="{ background: typeColors[a.type] + '20', color: typeColors[a.type] }">{{ typeLabels[a.type] }}</span>
              <span class="ach-level-badge" :style="{ background: levelColors[a.level] + '20', color: levelColors[a.level] }">{{ levelLabels[a.level] }}</span>
            </div>
          </div>
          <h3 class="ach-title">{{ a.title }}</h3>
          <p class="ach-desc">{{ a.description }}</p>

          <!-- Siswa & kelas -->
          <div class="ach-student">
            <span class="ach-student-avatar" :style="{ background: typeColors[a.type] }">{{ initials(a.studentName || '?') }}</span>
            <span class="ach-student-info">
              <span class="ach-student-name">{{ a.studentName || '-' }}</span>
              <span class="ach-student-class">{{ a.studentClass ? 'Kelas ' + a.studentClass : '' }}</span>
            </span>
          </div>

          <div class="ach-footer">
            <span class="ach-ekskul">{{ a.ekskul }}</span>
            <span class="ach-date">{{ a.date }}</span>
            <div class="ach-actions">
              <button @click.stop="openEdit(a)" title="Edit" class="ach-action-btn"><Icon name="i-lucide-pencil" class="w-4 h-4" /></button>
              <button @click.stop="removeAchievement(a)" title="Hapus" class="ach-action-btn" style="color: var(--text-red);" :disabled="deletingId === a.id">
                <Icon v-if="deletingId === a.id" name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
                <Icon v-else name="i-lucide-trash-2" class="w-4 h-4" />
              </button>
            </div>
            <span class="ach-view-hint">
              <Icon name="i-lucide-eye" class="w-3.5 h-3.5" />
              Lihat detail
            </span>
          </div>
        </div>
      </div>

      <div v-if="!filteredAchievements.length" class="empty-state">
        <p style="color: var(--text-muted);">Belum ada prestasi tercatat.</p>
      </div>
    </div>

    <PaginationBar v-model:page="page" :total="filteredAchievements.length" />

    <!-- Modal Detail -->
    <Teleport to="body">
      <div v-if="selected" class="modal-overlay" @click.self="closeDetail">
        <div class="modal-content">
          <div class="modal-head">
            <h3 class="modal-title">Detail Prestasi</h3>
            <button class="modal-close" @click="closeDetail" title="Tutup"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>

          <div class="detail-photo">
            <img v-if="selected.proof" :src="selected.proof" :alt="selected.title" />
            <div v-else class="detail-photo-empty" :style="{ background: typeColors[selected.type] + '25', color: typeColors[selected.type] }">
              <Icon name="i-lucide-image-off" class="w-10 h-10" />
              <span>Belum ada foto dokumentasi</span>
            </div>
          </div>

          <div class="detail-badges">
            <span class="ach-type-badge" :style="{ background: typeColors[selected.type] + '20', color: typeColors[selected.type] }">{{ typeLabels[selected.type] }}</span>
            <span class="ach-level-badge" :style="{ background: levelColors[selected.level] + '20', color: levelColors[selected.level] }">{{ levelLabels[selected.level] }}</span>
          </div>

          <h3 class="detail-title">{{ selected.title }}</h3>
          <p class="detail-desc">{{ selected.description }}</p>

          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Siswa</span>
              <span class="detail-value">{{ selected.studentName || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Kelas</span>
              <span class="detail-value">{{ selected.studentClass || '-' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Ekskul</span>
              <span class="detail-value">{{ selected.ekskul }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tanggal</span>
              <span class="detail-value">{{ selected.date }}</span>
            </div>
          </div>

          <div class="modal-actions">
            <a v-if="selected.proof" :href="selected.proof" target="_blank" class="btn-outline">
              <Icon name="i-lucide-external-link" class="w-4 h-4" /> Buka Foto
            </a>
            <button class="btn-outline" @click="openEdit(selected)"><Icon name="i-lucide-pencil" class="w-4 h-4" /> Edit</button>
            <button class="btn-danger" @click="removeAchievement(selected)"><Icon name="i-lucide-trash-2" class="w-4 h-4" /> Hapus</button>
            <button class="btn-cancel" @click="closeDetail">Tutup</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Edit -->
    <Teleport to="body">
      <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
        <div class="modal-content" style="width: 560px;">
          <div class="modal-head">
            <h3 class="modal-title">Edit Prestasi</h3>
            <button class="modal-close" @click="showEditModal = false" title="Tutup"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="saveEdit" class="space-y-3">
            <div class="form-group"><label>Judul Prestasi</label><input v-model="editForm.title" class="form-input" required placeholder="Contoh: Juara 2 Basket Kota Bandung"></div>
            <div class="form-group"><label>Deskripsi</label><textarea v-model="editForm.description" class="form-input" rows="2"></textarea></div>
            <div class="form-row">
              <div class="form-group"><label>Tanggal</label><input v-model="editForm.date" type="date" class="form-input" required></div>
              <div class="form-group"><label>Ekskul</label>
                <select v-model="editForm.extracurricularId" class="form-input" required>
                  <option disabled value="">Pilih Ekskul</option>
                  <option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Jenis</label>
                <select v-model="editForm.type" class="form-input">
                  <option value="juara">Juara</option>
                  <option value="sertifikat">Sertifikat</option>
                  <option value="partisipasi">Partisipasi</option>
                  <option value="organisasi">Organisasi</option>
                </select>
              </div>
              <div class="form-group"><label>Tingkat</label>
                <select v-model="editForm.level" class="form-input">
                  <option value="sekolah">Sekolah</option>
                  <option value="kecamatan">Kecamatan</option>
                  <option value="kota">Kota</option>
                  <option value="provinsi">Provinsi</option>
                  <option value="nasional">Nasional</option>
                </select>
              </div>
            </div>
            <div class="form-group"><label>URL Foto Bukti (opsional)</label><input v-model="editForm.proof" class="form-input" placeholder="https://..."></div>
            <div class="modal-actions">
              <button type="button" class="btn-outline" @click="showEditModal = false">Batal</button>
              <button type="submit" class="btn-cancel" :disabled="saving">
                <Icon v-if="saving" name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
                <Icon v-else name="i-lucide-check" class="w-4 h-4" />
                Simpan
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
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); background: var(--bg-card); }
.search-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
.achievement-card {
  background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 10px;
  overflow: hidden; cursor: pointer; transition: all 0.2s;
}
.achievement-card:hover { box-shadow: 0 6px 16px rgba(15, 23, 42, 0.1); transform: translateY(-2px); }

/* Foto */
.ach-photo { width: 100%; aspect-ratio: 16/9; overflow: hidden; background: var(--bg-main); }
.ach-photo img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
.achievement-card:hover .ach-photo img { transform: scale(1.03); }
.ach-photo-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; font-size: var(--text-xs); color: var(--text-muted); }

.ach-body { padding: 16px 20px 20px; }
.ach-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
.ach-badges { display: flex; gap: 4px; flex-wrap: wrap; }
.ach-type-badge, .ach-level-badge { font-size: 10px; padding: 2px 8px; border-radius: 6px; font-weight: var(--font-medium); }
.ach-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.ach-desc { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: 12px; }

/* Siswa */
.ach-student { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--bg-main); border-radius: 8px; margin-bottom: 12px; }
.ach-student-avatar { width: 34px; height: 34px; border-radius: 50%; color: white; font-size: 11px; font-weight: var(--font-bold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ach-student-info { display: flex; flex-direction: column; min-width: 0; }
.ach-student-name { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.ach-student-class { font-size: var(--text-xs); color: var(--text-muted); }

.ach-footer { display: flex; align-items: center; gap: 8px; font-size: var(--text-xs); color: var(--text-muted); padding-top: 12px; border-top: 1px solid var(--border-light); }
.ach-ekskul { font-weight: var(--font-semibold); color: var(--olive-primary); }
.ach-date { margin-left: auto; }
.ach-actions { display: flex; gap: 4px; }
.ach-action-btn { background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 4px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; transition: background 0.2s; }
.ach-action-btn:hover { background: var(--bg-hover); }
.ach-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.spin-icon { animation: spin 1s linear infinite; display: inline-flex; }
@keyframes spin { to { transform: rotate(360deg); } }
.ach-view-hint { display: inline-flex; align-items: center; gap: 4px; color: var(--teal-mid); font-weight: var(--font-medium); }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: var(--bg-card); border-radius: 14px; padding: 24px; width: 620px; max-width: 95vw; max-height: 92vh; overflow-y: auto; }
.modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.modal-close { background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px; border-radius: 6px; transition: all 0.2s; }
.modal-close:hover { background: var(--bg-hover); color: var(--text-primary); }
.detail-photo { width: 100%; aspect-ratio: 16/9; border-radius: 10px; overflow: hidden; background: var(--bg-main); margin-bottom: 14px; }
.detail-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.detail-photo-empty { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; font-size: var(--text-sm); color: var(--text-muted); }
.detail-badges { display: flex; gap: 6px; margin-bottom: 10px; }
.detail-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.detail-desc { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: 16px; }
.detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
.detail-item { background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 8px; padding: 10px 14px; display: flex; flex-direction: column; gap: 2px; }
.detail-label { font-size: var(--text-xs); color: var(--text-muted); }
.detail-value { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: none; color: var(--text-primary); font-size: var(--text-sm); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; text-decoration: none; }
.btn-outline:hover { background: var(--bg-hover); }
.btn-cancel { background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-cancel:hover { background: var(--olive-dark); }
.btn-cancel:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-danger { display: inline-flex; align-items: center; gap: 6px; background: none; color: var(--text-red); font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--text-red); cursor: pointer; transition: all 0.2s; }
.btn-danger:hover { background: var(--text-red); color: white; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); background: var(--bg-card); }
.form-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
</style>
