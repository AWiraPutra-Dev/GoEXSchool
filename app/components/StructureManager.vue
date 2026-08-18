<script setup lang="ts">
// Pengelola Struktur Organisasi SATU ekskul:
// - mode tampilan: kartu anggota (dibuat di aplikasi) ATAU gambar desain (Canva/dll)
// - tema kartu: 3 pilihan (indigo, sunset, forest)
// - CRUD anggota: foto + nama + kelas + jabatan
const props = defineProps<{ ekskulId: string }>()
const emit = defineEmits<{ saved: [] }>()

const op = useOperatorDataStore()
const { confirm } = useConfirm()

onMounted(async () => {
  await Promise.all([op.fetchStructures(), op.fetchBoard()])
  syncForm()
})

// Pengaturan ekskul saat ini (dari store)
const settings = computed(() => op.structures.find(s => s.ekskulId === props.ekskulId))

const form = reactive({
  mode: 'cards' as 'cards' | 'image',
  imageUrl: '',
  theme: 'indigo',
})

const isCardsMode = computed(() => form.mode === 'cards')
const isImageMode = computed(() => form.mode === 'image')

const members = computed(() =>
  op.board
    .filter(b => b.ekskulId === props.ekskulId)
    .sort((a, b) => a.sortOrder - b.sortOrder)
)

function syncForm() {
  if (settings.value) {
    form.mode = settings.value.mode
    form.imageUrl = settings.value.imageUrl ?? ''
    form.theme = settings.value.theme
  } else {
    form.mode = 'cards'
    form.imageUrl = ''
    form.theme = 'indigo'
  }
}

watch(() => props.ekskulId, async () => {
  await Promise.all([op.fetchStructures(true), op.fetchBoard(true)])
  syncForm()
})

// ---- Tema tampilan kartu ----
const themes = [
  { id: 'indigo', name: 'Indigo Modern', desc: 'Bersih & profesional', colors: ['#6366F1', '#8B5CF6', '#C7D2FE'] },
  { id: 'sunset', name: 'Sunset Glow', desc: 'Hangat & energik', colors: ['#F97316', '#EC4899', '#FED7AA'] },
  { id: 'forest', name: 'Forest Premium', desc: 'Eksklusif & elegan', colors: ['#10B981', '#F59E0B', '#065F46'] },
]

// ---- Simpan pengaturan struktur ----
const saving = ref(false)
async function saveSettings() {
  if (form.mode === 'image' && !form.imageUrl.trim()) {
    alert('Upload gambar desain struktur dulu, atau pilih mode Kartu Anggota.')
    return
  }
  saving.value = true
  try {
    await op.updateStructure(props.ekskulId, {
      mode: form.mode,
      imageUrl: form.imageUrl.trim() || null,
      theme: form.theme,
    })
    emit('saved')
  } finally {
    saving.value = false
  }
}

// Ganti mode hanya mengubah tampilan form; tersimpan lewat tombol Simpan.
function setMode(mode: 'cards' | 'image') {
  form.mode = mode
}

// ---- Upload gambar desain struktur (mode image) ----
const uploadingImage = ref(false)
const designFileInput = ref<HTMLInputElement | null>(null)

async function handleDesignUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingImage.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/operator/upload', { method: 'POST', body: fd })
    form.imageUrl = res.url
    await saveSettings()
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal upload gambar desain.')
  } finally {
    uploadingImage.value = false
    if (designFileInput.value) designFileInput.value.value = ''
  }
}

function removeDesign() {
  form.imageUrl = ''
  saveSettings()
}

// ---- CRUD anggota (mode cards) ----
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
      sortOrder: members.value.length,
      extracurricularId: props.ekskulId,
    }
    if (editingMember.value && memberForm.id) {
      await op.updateBoardPosition(memberForm.id, data)
    } else {
      await op.addBoardPosition(data)
    }
    showMemberModal.value = false
    await op.fetchStructures(true)
    emit('saved')
  } finally {
    savingMember.value = false
  }
}

async function removeMember(p: any) {
  const ok = await confirm({
    title: `Hapus ${p.name} dari struktur?`,
    message: `Jabatan "${p.position}" akan dihapus dari struktur ekskul ini.`,
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  await op.deleteBoardPosition(p.id)
  await op.fetchStructures(true)
  emit('saved')
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<template>
  <div class="structure-manager">
    <template v-if="ekskulId">
      <!-- ===== Pilihan mode tampilan ===== -->
      <div class="mode-options">
        <button type="button" class="mode-card" :class="{ active: isCardsMode }" @click="setMode('cards')">
          <div class="mode-icon" style="background: rgba(99,102,241,0.12); color: #6366F1;">
            <Icon name="i-lucide-id-card" class="w-6 h-6" />
          </div>
          <div class="mode-text">
            <strong>Kartu Anggota</strong>
            <span>Buat langsung di aplikasi — foto, nama, kelas &amp; jabatan tiap pengurus dengan tema keren.</span>
          </div>
          <Icon v-if="isCardsMode" name="i-lucide-check-circle-2" class="mode-check" />
        </button>
        <button type="button" class="mode-card" :class="{ active: isImageMode }" @click="setMode('image')">
          <div class="mode-icon" style="background: rgba(244,114,182,0.12); color: #EC4899;">
            <Icon name="i-lucide-image" class="w-6 h-6" />
          </div>
          <div class="mode-text">
            <strong>Upload Desain (Gambar)</strong>
            <span>Unggah struktur jadi dari Canva / desain lain — tampil utuh sebagai satu gambar.</span>
          </div>
          <Icon v-if="isImageMode" name="i-lucide-check-circle-2" class="mode-check" />
        </button>
      </div>

      <!-- ===== Mode kartu: pilihan tema ===== -->
      <div v-if="isCardsMode" class="sm-section">
        <div class="sm-section-head">
          <div>
            <h3><Icon name="i-lucide-palette" class="sm-head-icon" /> Tema Tampilan</h3>
            <p>Pilih gaya kartu struktur yang tampil untuk semua siswa.</p>
          </div>
        </div>
        <div class="theme-options">
          <button
            v-for="t in themes" :key="t.id" type="button"
            class="theme-card" :class="{ active: form.theme === t.id }"
            @click="form.theme = t.id"
          >
            <div class="theme-swatches">
              <span v-for="(c, i) in t.colors" :key="i" :style="{ background: c }"></span>
            </div>
            <div class="theme-text">
              <strong>{{ t.name }}</strong>
              <span>{{ t.desc }}</span>
            </div>
            <Icon v-if="form.theme === t.id" name="i-lucide-check-circle-2" class="theme-check" />
          </button>
        </div>
      </div>

      <!-- ===== Mode gambar: upload desain ===== -->
      <div v-if="isImageMode" class="sm-section">
        <div class="sm-section-head">
          <div>
            <h3><Icon name="i-lucide-upload-cloud" class="sm-head-icon" /> Desain Struktur</h3>
            <p>Upload struktur jadi (mis. dari Canva, PPT, atau aplikasi desain lain).</p>
          </div>
        </div>
        <div class="design-upload">
          <template v-if="form.imageUrl">
            <div class="design-preview">
              <img :src="form.imageUrl" alt="Desain struktur" />
              <div class="design-preview-actions">
                <button class="btn-outline" @click="designFileInput?.click()"><Icon name="i-lucide-refresh-cw" class="w-4 h-4" /> Ganti</button>
                <button class="btn-danger-outline" @click="removeDesign"><Icon name="i-lucide-trash-2" class="w-4 h-4" /> Hapus</button>
              </div>
            </div>
          </template>
          <button v-else class="design-dropzone" @click="designFileInput?.click()">
            <Icon name="i-lucide-upload" class="w-8 h-8" style="color: var(--text-muted);" />
            <strong>Klik untuk upload gambar desain</strong>
            <span>PNG / JPG / WebP — maksimal 10MB</span>
          </button>
          <input ref="designFileInput" type="file" accept="image/*" hidden @change="handleDesignUpload">
        </div>
      </div>

      <!-- ===== Mode kartu: daftar anggota ===== -->
      <div v-if="isCardsMode" class="sm-section">
        <div class="sm-section-head">
          <div>
            <h3><Icon name="i-lucide-users" class="sm-head-icon" /> Anggota Struktur</h3>
            <p>Foto, nama, kelas &amp; jabatan pengurus. {{ members.length }} jabatan terdaftar.</p>
          </div>
          <button class="btn-primary" @click="openAddMember"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah</button>
        </div>

        <div class="member-list">
          <div v-for="(p, i) in members" :key="p.id" class="member-row">
            <span class="member-index">{{ i + 1 }}</span>
            <div class="member-photo">
              <img v-if="p.photoUrl" :src="p.photoUrl" alt="" />
              <div v-else>{{ initials(p.name) }}</div>
            </div>
            <div class="member-info">
              <div class="member-name">{{ p.name }}</div>
              <div class="member-meta">
                <span class="pos-badge">{{ p.position }}</span>
                <span v-if="p.className" class="class-tag"><Icon name="i-lucide-school" class="w-3 h-3" /> {{ p.className }}</span>
              </div>
            </div>
            <div class="member-actions">
              <button class="action-btn" title="Edit" @click="openEditMember(p)"><Icon name="i-lucide-pencil" class="w-4 h-4" /></button>
              <button class="action-btn action-delete" title="Hapus" @click="removeMember(p)"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
            </div>
          </div>
          <div v-if="!members.length" class="empty-state">
            <Icon name="i-lucide-user-plus" class="w-10 h-10 mb-2" style="color: var(--text-muted);" />
            <p style="color: var(--text-muted);">Belum ada anggota. Klik "Tambah" untuk membuat kartu pertama.</p>
          </div>
        </div>
      </div>

      <!-- ===== Simpan pengaturan ===== -->
      <div class="sm-actions">
        <button class="btn-primary" :disabled="saving" @click="saveSettings">
          <Icon v-if="saving" name="i-lucide-loader-2" class="w-4 h-4 spin" />
          <Icon v-else name="i-lucide-save" class="w-4 h-4" />
          {{ saving ? 'Menyimpan...' : 'Simpan Pengaturan' }}
        </button>
      </div>
    </template>

    <div v-else class="empty-state">
      <Icon name="i-lucide-shield" class="w-10 h-10 mb-2" style="color: var(--text-muted);" />
      <p style="color: var(--text-muted);">Pilih ekskul terlebih dahulu untuk mengelola strukturnya.</p>
    </div>

    <!-- ===== Modal tambah/edit anggota ===== -->
    <Teleport to="body">
      <div v-if="showMemberModal" class="modal-overlay" @click.self="showMemberModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">{{ editingMember ? 'Edit Anggota' : 'Tambah Anggota' }}</h3>
            <button class="modal-close" @click="showMemberModal = false"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="saveMember" class="space-y-4">
            <div class="photo-picker">
              <div class="photo-preview">
                <img v-if="memberForm.photoUrl" :src="memberForm.photoUrl" alt="Foto anggota" />
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
                {{ savingMember ? 'Menyimpan...' : (editingMember ? 'Simpan Perubahan' : 'Tambah Anggota') }}
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

/* ===== Pilihan mode ===== */
.mode-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px; }
.mode-card {
  display: flex; align-items: flex-start; gap: 12px; text-align: left;
  background: var(--bg-card); border: 2px solid var(--border-light); border-radius: 12px;
  padding: 16px; cursor: pointer; transition: all 0.2s; position: relative;
}
.mode-card:hover { border-color: var(--accent-border); transform: translateY(-1px); }
.mode-card.active { border-color: var(--accent); background: var(--accent-soft); }
.mode-icon {
  width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.mode-text { display: flex; flex-direction: column; gap: 3px; }
.mode-text strong { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.mode-text span { font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.45; }
.mode-check { width: 20px; height: 20px; color: var(--accent); flex-shrink: 0; margin-left: auto; }

/* ===== Section ===== */
.sm-section { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 16px; }
.sm-section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 14px; flex-wrap: wrap; }
.sm-section-head h3 { display: flex; align-items: center; gap: 8px; font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); }
.sm-section-head p { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 3px; }
.sm-head-icon { width: 18px; height: 18px; color: var(--accent); }

/* ===== Tema ===== */
.theme-options { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
.theme-card {
  display: flex; flex-direction: column; gap: 10px; text-align: left;
  background: var(--bg-main); border: 2px solid var(--border-light); border-radius: 10px;
  padding: 14px; cursor: pointer; transition: all 0.2s; position: relative;
}
.theme-card:hover { border-color: var(--accent-border); transform: translateY(-1px); }
.theme-card.active { border-color: var(--accent); background: var(--accent-soft); }
.theme-swatches { display: flex; gap: 6px; }
.theme-swatches span { width: 34px; height: 22px; border-radius: 6px; }
.theme-text { display: flex; flex-direction: column; gap: 2px; }
.theme-text strong { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.theme-text span { font-size: var(--text-xs); color: var(--text-secondary); }
.theme-check { position: absolute; top: 10px; right: 10px; width: 18px; height: 18px; color: var(--accent); }

/* ===== Upload desain ===== */
.design-dropzone {
  width: 100%; display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 36px 16px; border: 2px dashed var(--border-medium); border-radius: 12px;
  background: var(--bg-main); cursor: pointer; transition: all 0.2s;
}
.design-dropzone:hover { border-color: var(--accent); background: var(--accent-soft); }
.design-dropzone strong { font-size: var(--text-sm); color: var(--text-primary); }
.design-dropzone span { font-size: var(--text-xs); color: var(--text-muted); }
.design-preview { display: flex; flex-direction: column; gap: 10px; }
.design-preview img { max-width: 100%; max-height: 380px; border-radius: 10px; border: 1px solid var(--border-light); }
.design-preview-actions { display: flex; gap: 8px; }

/* ===== Daftar anggota ===== */
.member-list { display: flex; flex-direction: column; gap: 8px; }
.member-row {
  display: flex; align-items: center; gap: 12px; padding: 10px 12px;
  background: var(--bg-main); border: 1px solid var(--border-light); border-radius: 10px; transition: all 0.2s;
}
.member-row:hover { border-color: var(--accent-border); }
.member-index { width: 22px; height: 22px; border-radius: 6px; background: var(--accent-soft); color: var(--accent); font-size: 11px; font-weight: var(--font-bold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.member-photo { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: var(--accent-soft); display: flex; align-items: center; justify-content: center; }
.member-photo img { width: 100%; height: 100%; object-fit: cover; }
.member-photo div { font-size: 11px; font-weight: var(--font-bold); color: var(--accent); }
.member-info { flex: 1; min-width: 0; }
.member-name { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.member-meta { display: flex; align-items: center; gap: 8px; margin-top: 3px; flex-wrap: wrap; }
.pos-badge { font-size: 10px; padding: 2px 10px; border-radius: 10px; background: var(--accent-soft); color: var(--accent); font-weight: var(--font-semibold); }
.class-tag { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--text-secondary); }
.member-actions { display: flex; gap: 4px; flex-shrink: 0; }

/* ===== Aksi ===== */
.sm-actions { display: flex; justify-content: flex-end; }

/* ===== Tombol ===== */
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--accent); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--accent-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: var(--bg-card); color: var(--text-primary); font-size: var(--text-sm); font-weight: var(--font-medium); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--bg-hover); }
.btn-outline:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-danger-outline { display: inline-flex; align-items: center; gap: 6px; background: var(--bg-card); color: var(--red-orange); font-size: var(--text-sm); font-weight: var(--font-medium); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-danger-outline:hover { background: rgba(239,68,68,0.08); border-color: var(--red-orange); }
.btn-cancel { background: var(--bg-card); color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.action-btn { background: none; border: none; cursor: pointer; padding: 5px 7px; border-radius: 6px; color: var(--text-secondary); display: inline-flex; align-items: center; justify-content: center; transition: all 0.15s; }
.action-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
.action-delete:hover { background: rgba(239,68,68,0.1); color: var(--red-orange); }

/* ===== Modal ===== */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 24px; width: 480px; max-width: 94vw; max-height: 92vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.modal-close { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; }
.photo-picker { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.photo-preview { width: 76px; height: 76px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 2px solid var(--accent-border); background: var(--accent-soft); display: flex; align-items: center; justify-content: center; }
.photo-preview img { width: 100%; height: 100%; object-fit: cover; }
.photo-placeholder { color: var(--text-muted); }
.photo-actions { display: flex; flex-direction: column; gap: 6px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.req { color: var(--red-orange); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); outline: none; background: var(--bg-card); }
.form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--border-light); }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 36px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
