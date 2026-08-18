<script setup lang="ts">
import type { AppUser } from '~/stores/master-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const store = useMasterDataStore()
const { confirm } = useConfirm()

const allPermissions = [
  { id: 'dashboard', label: 'Dashboard', icon: 'i-lucide-layout-dashboard', desc: 'Melihat dashboard utama' },
  { id: 'students', label: 'Data Siswa', icon: 'i-lucide-users', desc: 'Mengelola data siswa (CRUD)' },
  { id: 'teachers', label: 'Data Pembimbing Ekskul', icon: 'i-lucide-user-check', desc: 'Mengelola data pembimbing ekskul' },
  { id: 'extracurriculars', label: 'Ekskul', icon: 'i-lucide-shield', desc: 'Mengelola data ekstrakurikuler' },
  { id: 'users', label: 'User & Privileges', icon: 'i-lucide-user-cog', desc: 'Mengelola user (hanya admin)' },
  { id: 'reports', label: 'Laporan', icon: 'i-lucide-file-bar-chart', desc: 'Membuat dan melihat laporan' },
  { id: 'settings', label: 'Pengaturan', icon: 'i-lucide-settings', desc: 'Mengatur profil instansi' },
  { id: 'attendance', label: 'Absensi QR', icon: 'i-lucide-qr-code', desc: 'Membuat sesi absensi' },
  { id: 'schedule', label: 'Jadwal', icon: 'i-lucide-calendar', desc: 'Mengelola jadwal ekskul' },
  { id: 'members', label: 'Anggota', icon: 'i-lucide-users', desc: 'Mengelola anggota ekskul' },
  { id: 'polls', label: 'Voting', icon: 'i-lucide-vote', desc: 'Membuat dan kelola voting' },
  { id: 'news', label: 'Berita', icon: 'i-lucide-megaphone', desc: 'Membuat pengumuman/berita' },
  { id: 'gallery', label: 'Galeri', icon: 'i-lucide-images', desc: 'Upload dan kelola galeri' },
  { id: 'feed', label: 'Feed', icon: 'i-lucide-newspaper', desc: 'Melihat feed komunitas' },
  { id: 'achievements', label: 'Prestasi', icon: 'i-lucide-award', desc: 'Mengelola portofolio prestasi' },
  { id: 'structure', label: 'Struktur Ekskul', icon: 'i-lucide-shield', desc: 'Mengelola struktur organisasi ekskul (foto, kelas, jabatan, tema)' },
  { id: 'profile', label: 'Profil', icon: 'i-lucide-user', desc: 'Mengelola profil pribadi' }
]

const search = ref('')
const roleFilter = ref<'all' | 'admin' | 'operator' | 'student'>('all')
const showModal = ref(false)
const editMode = ref(false)
const saving = ref(false)
const selectedUser = ref<AppUser | null>(null)
const form = reactive({ id: '', name: '', username: '', password: '', role: 'operator', phone: '', email: '', status: 'active' as 'active' | 'inactive', permissions: [] as string[], extracurricularId: '', nis: '' })
const showPrivileges = ref(false)

onMounted(() => store.fetchAll())

const roleLabels: Record<string, string> = {
  admin: 'Admin Sekolah',
  operator: 'Operator',
  student: 'Siswa'
}

const roleCounts = computed(() => ({
  all: store.appUsers.length,
  admin: store.appUsers.filter(u => u.role === 'admin').length,
  operator: store.appUsers.filter(u => u.role === 'operator').length,
  student: store.appUsers.filter(u => u.role === 'student').length
}))

const filtered = computed(() => store.appUsers.filter(u =>
  (roleFilter.value === 'all' || u.role === roleFilter.value) &&
  (u.name.toLowerCase().includes(search.value.toLowerCase()) ||
  u.username.includes(search.value) ||
  u.role.toLowerCase().includes(search.value.toLowerCase()))
))

const { page, paged, totalPages } = usePagination(() => filtered.value)

function openAdd() {
  editMode.value = false; selectedUser.value = null
  Object.assign(form, { id: '', name: '', username: '', password: '', role: 'operator', phone: '', email: '', status: 'active', permissions: ['dashboard', 'attendance'], extracurricularId: '', nis: '' })
  studentMatch.value = null
  showModal.value = true; showPrivileges.value = false
}
function openEdit(u: AppUser) {
  editMode.value = true; selectedUser.value = u
  form.id = u.id; form.name = u.name; form.username = u.username; form.password = ''
  form.role = u.role; form.phone = u.phone || ''; form.email = u.email || ''
  form.status = u.status; form.permissions = u.permissions.map(p => p.permissionId)
  form.extracurricularId = u.extracurricularId || ''
  showModal.value = true; showPrivileges.value = false
}
async function save() {
  // Operator ekskul wajib diikat ke satu ekskul sejak pembuatan akun
  if (form.role === 'operator' && !form.extracurricularId) {
    alert('Operator ekskul wajib diikat ke satu ekskul. Pilih ekskul yang dikelola.')
    return
  }
  // Akun siswa wajib memakai NIS yang sudah terdaftar di Data Siswa
  if (form.role === 'student') {
    if (!form.nis.trim()) {
      alert('NIS wajib diisi untuk akun siswa.')
      return
    }
    if (!studentMatch.value || studentMatch.value.nis !== form.nis.trim()) lookupStudent()
    if (!studentMatch.value) {
      alert('NIS tidak ditemukan di Data Siswa. Pastikan NIS sudah terdaftar sebelum membuat akun siswa.')
      return
    }
    form.username = form.nis.trim()
  }
  saving.value = true
  try {
    if (editMode.value && selectedUser.value) {
      await store.updateUser(selectedUser.value.id, {
        name: form.name, phone: form.phone, email: form.email,
        status: form.status, permissions: form.permissions,
        ...(form.role === 'operator' ? { extracurricularId: form.extracurricularId || null } : {})
      })
    } else {
      await store.addUser({
        username: form.username, password: form.password,
        name: form.name, role: form.role, phone: form.phone,
        email: form.email, permissions: form.permissions,
        ...(form.role === 'operator' ? { extracurricularId: form.extracurricularId || undefined } : {}),
        ...(form.role === 'student' ? { nis: form.nis.trim() } : {})
      })
    }
    showModal.value = false
  } finally { saving.value = false }
}
function togglePermission(permId: string) {
  const idx = form.permissions.indexOf(permId)
  if (idx >= 0) form.permissions.splice(idx, 1)
  else form.permissions.push(permId)
}
function selectAllPerms() { form.permissions = allPermissions.map(p => p.id) }
function clearPerms() { form.permissions = [] }
async function toggleUserStatus(id: string) { await store.toggleUserStatus(id) }
async function removeUser(u: AppUser) {
  const ok = await confirm({
    title: `Hapus user "${u.name}"?`,
    message: 'Aksi ini tidak dapat dibatalkan. Sebaiknya nonaktifkan akunnya saja bila masih dibutuhkan.',
    confirmText: 'Ya, Hapus User',
    danger: true,
    verify: 'HAPUS',
  })
  if (!ok) return
  try {
    await store.deleteUser(u.id)
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal menghapus user. Nonaktifkan akunnya saja.')
  }
}

// ---- Akun siswa: cari NIS di Data Siswa ----
const studentMatch = ref<{ id: string; nis: string; name: string; class: string } | null>(null)

function lookupStudent() {
  studentMatch.value = null
  const nis = form.nis.trim()
  if (!nis) { form.username = ''; return }
  const s = store.students.find(st => st.nis === nis)
  if (s) {
    studentMatch.value = { id: s.id, nis: s.nis, name: s.name, class: s.class }
    form.name = s.name
    form.username = s.nis
  } else {
    form.name = ''
    form.username = ''
  }
}

// ---- Import & export Excel ----
const showImportModal = ref(false)
const tutorialDone = ref(false)
const importing = ref(false)
const importResult = ref<{ count: number; errors: Array<{ row: number; message: string }> } | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function downloadTemplate() { window.open('/api/admin/users/template', '_blank') }
function exportExcel() { window.open('/api/admin/users/export', '_blank') }
function openImportModal() { tutorialDone.value = false; importResult.value = null; showImportModal.value = true }
function closeImportModal() { showImportModal.value = false }
function triggerFileImport() { fileInput.value?.click() }

async function handleFileImport() {
  const file = fileInput.value?.files?.[0]
  if (!file) return
  importing.value = true
  importResult.value = null
  try {
    const res = await store.importUsers(file)
    importResult.value = res
    await store.fetchAll(true)
  } catch (e: any) {
    alert(e?.data?.message || 'Gagal mengimpor file. Pastikan format mengikuti template.')
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">{{ ui.t('menu.users') }}</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ store.appUsers.length }} total user · {{ store.activeUsers }} aktif</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-outline" @click="exportExcel"><Icon name="i-lucide-file-spreadsheet" class="w-4 h-4" /> Export Excel</button>
        <button class="btn-outline" @click="openImportModal"><Icon name="i-lucide-upload-cloud" class="w-4 h-4" /> Import Excel</button>
        <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah User</button>
      </div>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <input v-model="search" type="text" placeholder="Cari nama, username, atau role..." class="search-input">
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} dari {{ store.appUsers.length }} user</span>
      </div>
      <div class="role-filter-bar">
        <button
          v-for="opt in [{ value: 'all', label: 'Semua' }, { value: 'admin', label: 'Admin' }, { value: 'operator', label: 'Operator' }, { value: 'student', label: 'Siswa' }]"
          :key="opt.value"
          class="role-filter-chip"
          :class="{ active: roleFilter === opt.value }"
          @click="roleFilter = opt.value as any"
        >
          {{ opt.label }}
          <span class="chip-count">{{ roleCounts[opt.value as keyof typeof roleCounts] }}</span>
        </button>
      </div>
      <table class="data-table">
        <thead><tr><th>Nama</th><th>Username</th><th>Role</th><th>Kontak</th><th>Status</th><th>Akses</th><th class="text-right">Aksi</th></tr></thead>
        <tbody>
          <tr v-for="u in paged" :key="u.id">
            <td>
              <div class="flex items-center gap-3">
                <div class="user-avatar">{{ u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }}</div>
                <div>
                  <div class="font-semibold text-[13px]">{{ u.name }}</div>
                  <div class="text-[11px]" style="color: var(--text-muted);">{{ u.email }}</div>
                  <div v-if="u.role === 'student'" class="text-[11px]" style="color: var(--text-muted);">NIS {{ u.nis || u.username }} · Kelas {{ u.class || '-' }}</div>
                  <div v-if="u.role === 'operator'" class="text-[11px]" style="color: var(--olive-primary); font-weight: var(--font-medium);">Ekskul: {{ u.ekskul || 'Semua Ekskul' }}</div>
                </div>
              </div>
            </td>
            <td><span class="nis-code">{{ u.username }}</span></td>
            <td><span class="role-tag" :class="`role-tag-${u.role}`">{{ roleLabels[u.role] || u.role }}</span></td>
            <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ u.phone }}</td>
            <td>
              <button class="status-toggle" :class="u.status === 'active' ? 'toggle-on' : 'toggle-off'" @click="toggleUserStatus(u.id)">
                <span class="toggle-dot"></span><span>{{ u.status === 'active' ? 'Aktif' : 'Nonaktif' }}</span>
              </button>
            </td>
            <td><span class="perm-count">{{ (u.permissions || []).length }} izin</span></td>
            <td class="text-right action-cell">
              <button class="action-btn" @click="openEdit(u)" title="Edit Privileges"><Icon name="i-lucide-key-round" class="w-4 h-4" /></button>
              <button class="action-btn" @click="store.toggleUserStatus(u.id)" title="Toggle Status" style="color: var(--orange);"><Icon name="i-lucide-power" class="w-4 h-4" /></button>
              <button v-if="u.role !== 'admin'" class="action-btn" @click="removeUser(u)" title="Hapus User" style="color: var(--red-orange);"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="7" class="text-center py-8" style="color: var(--text-muted);">Tidak ada user ditemukan</td></tr>
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="filtered.length" />
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3 class="modal-title">{{ editMode ? 'Edit User' : 'Tambah User Baru' }}</h3>
            <button @click="showModal = false" class="modal-close"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="save" class="space-y-4">
            <div class="form-row">
              <div class="form-group"><label>Nama Lengkap</label><input v-model="form.name" class="form-input" required :readonly="!editMode && form.role === 'student'"></div>
              <div class="form-group"><label>Username</label>
                <input v-if="!(!editMode && form.role === 'student')" v-model="form.username" class="form-input" required>
                <input v-else :value="form.nis" class="form-input" readonly placeholder="Otomatis memakai NIS">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Role</label><select v-model="form.role" class="form-input"><option value="admin">Admin Sekolah</option><option value="operator">Operator Ekskul</option><option value="student">Siswa</option></select></div>
              <div class="form-group"><label>Status</label><select v-model="form.status" class="form-input"><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></div>
            </div>
            <div v-if="!editMode && form.role === 'student'" class="form-group">
              <label>NIS <span style="color: var(--red-orange);">*</span></label>
              <input v-model="form.nis" type="text" class="form-input" placeholder="Contoh: 20250001" @blur="lookupStudent" required>
              <p v-if="studentMatch" class="nis-feedback nis-ok"><Icon name="i-lucide-check-circle" class="w-3.5 h-3.5" /> Siswa ditemukan: {{ studentMatch.name }} · Kelas {{ studentMatch.class }}</p>
              <p v-else-if="form.nis && !studentMatch" class="nis-feedback nis-error"><Icon name="i-lucide-alert-circle" class="w-3.5 h-3.5" /> NIS tidak ditemukan di Data Siswa. Tambahkan siswa di menu Data Siswa terlebih dahulu.</p>
            </div>
            <div v-if="form.role === 'operator'" class="form-group">
              <label>Ekskul yang Dikelola <span style="color: var(--red-orange);">*</span></label>
              <select v-model="form.extracurricularId" class="form-input" :required="form.role === 'operator'">
                <option disabled value="">Pilih Ekskul</option>
                <option v-for="e in store.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
              </select>
              <p class="text-[11px]" style="color: var(--text-muted); margin-top: 4px;">
                Wajib diisi. Operator ekskul HANYA bisa melihat & mengelola data ekskul ini saja (voting, absensi QR, blog, materi, jadwal, galeri).
              </p>
            </div>
            <div v-if="!editMode" class="form-group"><label>Password</label><input v-model="form.password" type="password" class="form-input" minlength="6" placeholder="Minimal 6 karakter"></div>
            <div class="form-row">
              <div class="form-group"><label>Telepon</label><input v-model="form.phone" class="form-input"></div>
              <div class="form-group"><label>Email</label><input v-model="form.email" type="email" class="form-input"></div>
            </div>

            <div class="privileges-section">
              <div class="privileges-header">
                <h4 class="font-semibold text-[14px]">Hak Akses / Privileges</h4>
                <div class="privileges-actions">
                  <button type="button" class="btn-small" @click="selectAllPerms">Pilih Semua</button>
                  <button type="button" class="btn-small btn-small-outline" @click="clearPerms">Hapus Semua</button>
                </div>
              </div>
              <p class="text-[12px]" style="color: var(--text-muted); margin-bottom: 12px;">{{ form.permissions.length }} dari {{ allPermissions.length }} fitur dipilih.</p>
              <div class="permissions-grid">
                <label v-for="perm in allPermissions" :key="perm.id" class="perm-item" :class="{ 'perm-selected': form.permissions.includes(perm.id) }">
                  <input type="checkbox" :checked="form.permissions.includes(perm.id)" @change="togglePermission(perm.id)" class="perm-checkbox">
                  <div class="perm-icon-wrapper"><Icon :name="perm.icon" class="w-4 h-4" /></div>
                  <div class="perm-text"><span class="perm-label">{{ perm.label }}</span><span class="perm-desc">{{ perm.desc }}</span></div>
                </label>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                <span v-if="saving" class="loading-spinner-sm"></span>
                <span v-else>{{ editMode ? 'Simpan Perubahan' : 'Buat User' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Import Excel (tutorial → paham → unduh template → unggah) -->
    <Teleport to="body">
      <div v-if="showImportModal" class="modal-overlay" @click.self="closeImportModal">
        <div class="modal-content import-modal">
          <div class="modal-header">
            <h3 class="modal-title">Import Akun dari Excel</h3>
            <button @click="closeImportModal" class="modal-close"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>

          <!-- Fase 1: Tutorial -->
          <div v-if="!tutorialDone">
            <p class="import-intro">Buat banyak akun (Admin, Operator Ekskul, atau Siswa) sekaligus dalam 3 langkah mudah:</p>
            <div class="tutorial-steps">
              <div class="tutorial-step">
                <div class="step-illustration" style="background: rgba(139,148,103,0.12); color: var(--olive-primary);">
                  <Icon name="i-lucide-file-down" class="w-7 h-7" />
                </div>
                <div class="step-num">1</div>
                <h4>Unduh Template</h4>
                <p>Unduh file Excel berisi kolom yang sudah siap diisi (Role, NIS, Username, Nama, Password, Ekskul).</p>
              </div>
              <div class="tutorial-step">
                <div class="step-illustration" style="background: rgba(74,158,158,0.12); color: var(--teal);">
                  <Icon name="i-lucide-table" class="w-7 h-7" />
                </div>
                <div class="step-num">2</div>
                <h4>Isi Data Akun</h4>
                <p>Isi tiap baris: pilih Role, isi NIS untuk Siswa, nama ekskul untuk Operator, dan password minimal 6 karakter.</p>
              </div>
              <div class="tutorial-step">
                <div class="step-illustration" style="background: rgba(212,149,106,0.14); color: var(--orange);">
                  <Icon name="i-lucide-upload-cloud" class="w-7 h-7" />
                </div>
                <div class="step-num">3</div>
                <h4>Unggah &amp; Proses</h4>
                <p>Setelah template diisi, unggah file-nya. Sistem membuat semua akun sekaligus dan melaporkan hasilnya.</p>
              </div>
            </div>
            <div class="tutorial-footer">
              <button class="btn-gray" :disabled="!tutorialDone" @click="downloadTemplate">
                <Icon name="i-lucide-download" class="w-4 h-4" /> Download Template
              </button>
              <button class="btn-primary" @click="tutorialDone = true">
                <Icon name="i-lucide-check" class="w-4 h-4" /> Paham, Lanjut
              </button>
            </div>
          </div>

          <!-- Fase 2: Setelah paham tutorial -->
          <div v-else>
            <div class="import-ready">
              <div class="ready-check"><Icon name="i-lucide-check" class="w-5 h-5" /></div>
              <div>
                <h4 class="font-semibold" style="color: var(--text-primary);">Siap Mengunggah!</h4>
                <p style="font-size: var(--text-sm); color: var(--text-secondary);">Unduh template jika belum, isi datanya, lalu pilih file Excel untuk diproses.</p>
              </div>
            </div>
            <div class="import-actions">
              <button class="btn-green" @click="downloadTemplate">
                <Icon name="i-lucide-download" class="w-4 h-4" /> Download Template
              </button>
              <button class="btn-primary" :disabled="importing" @click="triggerFileImport">
                <Icon v-if="importing" name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
                <Icon v-else name="i-lucide-upload-cloud" class="w-4 h-4" />
                {{ importing ? 'Memproses...' : 'Pilih File Excel' }}
              </button>
              <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="handleFileImport">
            </div>
            <div v-if="importResult" class="import-result" :class="importResult.errors.length ? 'result-warn' : 'result-ok'">
              <p class="font-semibold">{{ importResult.count }} akun berhasil dibuat.</p>
              <ul v-if="importResult.errors.length">
                <li v-for="(e, i) in importResult.errors" :key="i">Baris {{ e.row }}: {{ e.message }}</li>
              </ul>
            </div>
          </div>
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
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: var(--bg-card); color: var(--text-primary); font-size: var(--text-sm); font-weight: var(--font-medium); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--bg-hover); }
.btn-gray { display: inline-flex; align-items: center; gap: 6px; background: #CBD5E1; color: #64748B; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: not-allowed; }
.btn-green { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-green:hover { background: var(--olive-dark); }
.btn-small { padding: 4px 12px; font-size: var(--text-xs); border: 1px solid var(--olive-primary); border-radius: 4px; background: var(--olive-primary); color: white; cursor: pointer; }
.btn-small:hover { background: var(--olive-dark); }
.btn-small-outline { background: white; color: var(--text-primary); border-color: var(--border-light); }
.btn-small-outline:hover { background: var(--bg-hover); }
.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); outline: none; }
.search-input:focus { border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.3px; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); vertical-align: middle; }
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--olive-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: var(--font-bold); flex-shrink: 0; }
.nis-code { font-size: var(--text-xs); font-variant-numeric: tabular-nums; letter-spacing: 0.04em; font-weight: var(--font-medium); color: var(--text-secondary); }
.role-tag { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.role-tag-admin { background: rgba(74,158,158,0.15); color: var(--teal); }
.role-tag-operator { background: rgba(212,149,106,0.18); color: var(--orange); }
.role-tag-student { background: rgba(74,158,158,0.12); color: var(--teal-dark); }
.role-filter-bar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; }
.role-filter-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-light); background: white; font-size: var(--text-xs); font-weight: var(--font-medium); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.role-filter-chip:hover { border-color: var(--olive-primary); color: var(--olive-primary); }
.role-filter-chip.active { background: var(--olive-primary); border-color: var(--olive-primary); color: white; }
.chip-count { font-size: 10px; background: var(--bg-hover); border-radius: 10px; padding: 1px 7px; }
.role-filter-chip.active .chip-count { background: rgba(255,255,255,0.25); }
.perm-count { font-size: var(--text-xs); color: var(--text-muted); }
.status-toggle { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 10px; border: none; cursor: pointer; font-size: var(--text-xs); font-weight: var(--font-medium); transition: all 0.2s; }
.toggle-on { background: rgba(74,158,158,0.15); color: var(--teal); }
.toggle-off { background: rgba(212,106,90,0.15); color: var(--red-orange); }
.toggle-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.action-cell { display: flex; gap: 4px; justify-content: flex-end; }
.action-btn { background: none; border: none; cursor: pointer; padding: 4px 6px; border-radius: 4px; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; }
.action-btn:hover { background: var(--bg-hover); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; }
.modal-lg { width: 700px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.modal-close { background: none; border: none; font-size: 20px; color: var(--text-muted); cursor: pointer; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); outline: none; }
.form-input:focus { border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.12); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-light); }
.privileges-section { background: var(--olive-bg); border-radius: 8px; padding: 16px; }
.privileges-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
.privileges-actions { display: flex; gap: 6px; }
.permissions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 6px; }
.perm-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid transparent; border-radius: 6px; cursor: pointer; transition: all 0.15s; background: white; }
.perm-item:hover { border-color: var(--olive-light); }
.perm-selected { border-color: var(--olive-primary); background: rgba(139,148,103,0.06); }
.perm-checkbox { accent-color: var(--olive-primary); width: 16px; height: 16px; flex-shrink: 0; }
.perm-icon-wrapper { width: 28px; height: 28px; border-radius: 6px; background: var(--olive-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--olive-primary); }
.perm-text { display: flex; flex-direction: column; gap: 1px; overflow: hidden; }
.perm-label { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--text-primary); }
.perm-desc { font-size: 10px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* ---- Import Excel (tutorial) ---- */
.import-modal { width: 660px; max-width: 94vw; }
.import-intro { font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 16px; }
.tutorial-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
.tutorial-step { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 10px; padding: 16px; text-align: center; position: relative; }
.step-illustration { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; }
.step-num { position: absolute; top: 8px; right: 10px; width: 20px; height: 20px; border-radius: 50%; background: var(--olive-primary); color: white; font-size: 11px; font-weight: var(--font-bold); display: flex; align-items: center; justify-content: center; }
.tutorial-step h4 { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); margin-bottom: 6px; }
.tutorial-step p { font-size: 11px; line-height: 1.5; color: var(--text-muted); }
.tutorial-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 16px; border-top: 1px solid var(--border-light); }
.import-ready { display: flex; align-items: center; gap: 12px; background: var(--olive-bg); border: 1px solid var(--olive-border, var(--border-light)); border-radius: 10px; padding: 14px 16px; margin-bottom: 16px; }
.ready-check { width: 36px; height: 36px; border-radius: 50%; background: var(--olive-primary); color: white; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.import-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.import-result { margin-top: 16px; border-radius: 8px; padding: 12px 14px; font-size: var(--text-sm); }
.result-ok { background: rgba(74, 158, 158, 0.12); color: var(--teal-dark); }
.result-warn { background: rgba(212, 149, 106, 0.14); color: var(--orange); }
.import-result ul { margin: 6px 0 0 18px; list-style: disc; font-size: var(--text-xs); color: var(--text-secondary); }
.spin-icon { animation: spin 1s linear infinite; display: inline-flex; }
@keyframes spin { to { transform: rotate(360deg); } }
.hidden { display: none; }

/* ---- NIS lookup (akun siswa) ---- */
.nis-feedback { display: flex; align-items: center; gap: 5px; font-size: var(--text-xs); margin-top: 6px; }
.nis-ok { color: var(--teal); }
.nis-error { color: var(--red-orange); }
.form-input[readonly] { background: var(--bg-main); color: var(--text-secondary); }
</style>
