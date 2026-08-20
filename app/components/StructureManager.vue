<script setup lang="ts">
// Pengelola Struktur Organisasi SATU ekskul dengan tampilan grid 4 kolom.
// Pratinjau langsung adalah permukaan edit: tekan "Edit Grid" untuk
// menampilkan kontrol tambah/ubah/hapus/urut langsung di atas grid.
// Tiap sel grid adalah kartu pengurus: foto + nama + kelas + jabatan.
// Warna selalu mengikuti warna utama instansi (tanpa pilihan tema).
const props = defineProps<{ ekskulId: string }>()
const emit = defineEmits<{ saved: [] }>()

const op = useOperatorDataStore()
const { confirm } = useConfirm()

onMounted(async () => {
  await op.fetchBoard()
})

// Semua tile (person) ekskul ini, urut sesuai posisi grid.
const tiles = computed(() =>
  op.board
    .filter(b => b.ekskulId === props.ekskulId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
)

watch(() => props.ekskulId, async () => {
  await op.fetchBoard(true)
})

// Pratinjau langsung: apa yang dilihat siswa, live dari tile.
const preview = computed(() => {
  if (!props.ekskulId) return null
  return {
    id: props.ekskulId,
    ekskul: tiles.value[0]?.ekskul ?? 'Struktur Ekskul',
    ekskulLogo: tiles.value[0]?.ekskulLogo ?? null,
    positions: tiles.value.map(t => ({
      id: t.id,
      type: t.type,
      name: t.name,
      className: t.className,
      position: t.position,
      photoUrl: t.photoUrl,
      imageUrl: t.imageUrl ?? null,
      sortOrder: t.sortOrder,
    })),
  }
})

// ---- Mode edit: kontrol muncul langsung di atas grid ----
const editing = ref(false)
function toggleEdit() {
  editing.value = !editing.value
}

// ---- Urutkan ulang tile (kiri/kanan/atas/bawah) ----
async function moveTile(tile: any, dir: 'up' | 'down' | 'left' | 'right') {
  const idx = tiles.value.findIndex(t => t.id === tile.id)
  const cols = 4 // grid 4 kolom
  let targetIdx: number | null = null

  switch (dir) {
    case 'up':
      targetIdx = idx - cols
      break
    case 'down':
      targetIdx = idx + cols
      break
    case 'left':
      targetIdx = idx - 1
      break
    case 'right':
      targetIdx = idx + 1
      break
  }

  if (targetIdx === null || targetIdx < 0 || targetIdx >= tiles.value.length) return
  const target = tiles.value[targetIdx]
  if (!target) return

  await Promise.all([
    op.updateBoardPosition(tile.id, { sortOrder: target.sortOrder }),
    op.updateBoardPosition(target.id, { sortOrder: tile.sortOrder }),
  ])
  await op.fetchBoard(true)
  emit('saved')
}

// ---- Tambah tile person langsung ----
function openAddPerson() {
  openAddMember()
}

// ---- CRUD tile person ----
interface MemberForm {
  id: string; name: string; className: string; position: string; photoUrl: string | null
}
const memberForm = reactive<MemberForm>({ id: '', name: '', className: '', position: '', photoUrl: null })
const showMemberModal = ref(false)
const editingMember = ref(false)
const savingMember = ref(false)
const uploadingPhoto = ref(false)
const photoInput = ref<HTMLInputElement | null>(null)

function resetMemberForm() {
  Object.assign(memberForm, { id: '', name: '', className: '', position: '', photoUrl: null })
  editingMember.value = false
}

function openAddMember() {
  resetMemberForm()
  showMemberModal.value = true
}

function openEditMember(p: any) {
  Object.assign(memberForm, {
    id: p.id,
    name: p.name,
    className: p.className ?? '',
    position: p.position,
    photoUrl: p.photoUrl,
  })
  editingMember.value = true
  showMemberModal.value = true
}

async function handlePhotoUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingPhoto.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/operator/upload', { method: 'POST', body: fd })
    memberForm.photoUrl = res.url
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal upload foto.')
  } finally {
    uploadingPhoto.value = false
    if (photoInput.value) photoInput.value.value = ''
  }
}

function removePhoto() { memberForm.photoUrl = null }

async function saveMember() {
  if (!memberForm.name.trim() || !memberForm.position.trim()) {
    alert('Nama dan jabatan wajib diisi.')
    return
  }
  savingMember.value = true
  try {
    const data = {
      name: memberForm.name.trim(),
      className: memberForm.className.trim() || null,
      position: memberForm.position.trim(),
      photoUrl: memberForm.photoUrl,
      sortOrder: tiles.value.length,
      extracurricularId: props.ekskulId,
    }
    if (editingMember.value && memberForm.id) {
      await op.updateBoardPosition(memberForm.id, data)
    } else {
      await op.addBoardPosition(data)
    }
    showMemberModal.value = false
    await op.fetchBoard(true)
    emit('saved')
  } finally {
    savingMember.value = false
  }
}

// ---- Edit tile dari grid ----
function onEditTile(tile: any) {
  openEditMember(tile)
}

// ---- Hapus tile ----
async function removeTile(tile: any) {
  const ok = await confirm({
    title: `Hapus dari struktur?`,
    message: `Kartu "${tile.name}" (${tile.position}) akan dihapus dari struktur.`,
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  await op.deleteBoardPosition(tile.id)
  await op.fetchBoard(true)
  emit('saved')
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<template>
  <div class="structure-manager">
    <template v-if="ekskulId">
      <!-- ===== Pratinjau langsung = permukaan edit ===== -->
      <div class="sm-section">
        <div class="sm-section-head">
          <div>
            <h3><Icon name="i-lucide-eye" class="sm-head-icon" /> Pratinjau Langsung</h3>
            <p>Inilah tampilan yang dilihat semua siswa. Tekan <strong>Edit Grid</strong> untuk mengubah langsung di sini, tambah, ubah, hapus, atau urutkan.</p>
          </div>
          <button class="btn-edit" :class="{ active: editing }" @click="toggleEdit">
            <Icon :name="editing ? 'i-lucide-check' : 'i-lucide-pencil'" class="w-4 h-4" />
            {{ editing ? 'Selesai' : 'Edit Grid' }}
          </button>
        </div>

        <StructureDisplay
          :ekskul="preview"
          :editable="editing"
          @add="openAddPerson"
          @edit="onEditTile"
          @delete="removeTile"
          @move="moveTile"
        />

        <p v-if="editing" class="edit-hint">
          <Icon name="i-lucide-mouse-pointer-click" class="w-4 h-4" />
          Arahkan kursor ke grid untuk tombol ubah/hapus/urutkan, klik <strong>+ Tambah Pengurus</strong> untuk menambah pengurus baru.
        </p>
      </div>
    </template>

    <div v-else class="empty-state">
      <Icon name="i-lucide-shield" class="w-10 h-10 mb-2" style="color: var(--text-muted);" />
      <p style="color: var(--text-muted);">Pilih ekskul terlebih dahulu untuk mengelola strukturnya.</p>
    </div>

    <!-- ===== Modal tambah/edit kartu pengurus ===== -->
    <Teleport to="body">
      <div v-if="showMemberModal" class="modal-overlay" @click.self="showMemberModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">{{ editingMember ? 'Edit Pengurus' : 'Tambah Pengurus' }}</h3>
            <button class="modal-close" @click="showMemberModal = false"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="saveMember" class="space-y-4">
            <div class="photo-picker">
              <div class="photo-preview">
                <img v-if="memberForm.photoUrl" :src="memberForm.photoUrl" alt="Foto pengurus" />
                <div v-else class="photo-placeholder"><Icon name="i-lucide-camera" class="w-6 h-6" /></div>
              </div>
              <div class="photo-actions">
                <button type="button" class="btn-outline" :disabled="uploadingPhoto" @click="photoInput?.click()">
                  <Icon v-if="uploadingPhoto" name="i-lucide-loader-2" class="w-4 h-4 spin" />
                  <Icon v-else name="i-lucide-upload" class="w-4 h-4" />
                  {{ uploadingPhoto ? 'Mengupload...' : (memberForm.photoUrl ? 'Ganti Foto' : 'Upload Foto') }}
                </button>
                <button v-if="memberForm.photoUrl" type="button" class="btn-danger-outline" @click="removePhoto">Hapus Foto</button>
                <input ref="photoInput" type="file" accept="image/*" hidden @change="handlePhotoUpload">
              </div>
            </div>

            <div class="form-group">
              <label>Nama Lengkap <span class="req">*</span></label>
              <input v-model="memberForm.name" class="form-input" placeholder="Contoh: Ahmad Rizki Fauzi" required>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Kelas</label>
                <input v-model="memberForm.className" class="form-input" placeholder="Contoh: XI IPA 1">
              </div>
              <div class="form-group">
                <label>Jabatan <span class="req">*</span></label>
                <input v-model="memberForm.position" class="form-input" placeholder="Contoh: Ketua" required>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showMemberModal = false">Batal</button>
              <button type="submit" class="btn-primary" :disabled="savingMember">
                <Icon v-if="savingMember" name="i-lucide-loader-2" class="w-4 h-4 spin" />
                <Icon v-else name="i-lucide-check" class="w-4 h-4" />
                {{ savingMember ? 'Menyimpan...' : (editingMember ? 'Simpan Perubahan' : 'Tambah Pengurus') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.structure-manager { display: flex; flex-direction: column; gap: 18px; }

/* ===== Section ===== */
.sm-section { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 16px; }
.sm-section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
.sm-section-head h3 { display: flex; align-items: center; gap: 8px; font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); }
.sm-section-head p { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 3px; line-height: 1.5; }
.sm-head-icon { width: 18px; height: 18px; color: var(--accent); }

/* ===== Tombol Edit Grid ===== */
.btn-edit {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--bg-main); color: var(--text-primary);
  font-size: var(--text-sm); font-weight: var(--font-semibold);
  padding: 8px 16px; border-radius: 8px;
  border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s;
}
.btn-edit:hover { border-color: var(--accent); color: var(--accent); }
.btn-edit.active { background: var(--accent); color: #FFFFFF; border-color: var(--accent); }

.edit-hint {
  display: flex; align-items: center; gap: 6px;
  margin-top: 12px; padding: 10px 14px;
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
  border-radius: 8px; font-size: var(--text-xs); color: var(--text-secondary);
}
.edit-hint .iconify { color: var(--accent); }

/* ===== Modal ===== */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 14px; padding: 22px; width: 520px; max-width: 96vw; max-height: 92vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.modal-close { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 14px; border-top: 1px solid var(--border-light); }
.btn-cancel { background: transparent; color: var(--text-secondary); font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.btn-cancel:hover { background: var(--bg-main); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--accent); color: #FFFFFF; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.15s; }
.btn-primary:hover { filter: brightness(1.1); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: transparent; color: var(--text-primary); font-size: var(--text-xs); font-weight: var(--font-semibold); padding: 6px 14px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.btn-outline:hover { border-color: var(--accent); color: var(--accent); }
.btn-danger-outline { display: inline-flex; align-items: center; gap: 6px; background: transparent; color: #EF4444; font-size: var(--text-xs); font-weight: var(--font-semibold); padding: 6px 14px; border-radius: 6px; border: 1px solid #FCA5A5; cursor: pointer; }
.btn-danger-outline:hover { background: #FEF2F2; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== Form ===== */
.form-group { display: flex; flex-direction: column; gap: 4px; }
.form-group label { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--text-secondary); }
.form-group .req { color: #EF4444; }
.form-input { padding: 9px 12px; border: 1px solid var(--border-light); border-radius: 8px; font-size: var(--text-sm); color: var(--text-primary); background: var(--bg-main); outline: none; }
.form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

/* ===== Photo ===== */
.photo-picker { display: flex; align-items: center; gap: 14px; }
.photo-preview { width: 72px; height: 72px; border-radius: 50%; overflow: hidden; background: var(--bg-main); border: 2px solid var(--border-light); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
.photo-preview img { width: 100%; height: 100%; object-fit: cover; }
.photo-placeholder { color: var(--text-muted); }
.photo-actions { display: flex; flex-wrap: wrap; gap: 6px; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>