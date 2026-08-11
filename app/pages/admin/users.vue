<script setup lang="ts">
import type { AppUser } from '~/stores/master-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const store = useMasterDataStore()

const allPermissions = [
  { id: 'dashboard', label: 'Dashboard', icon: 'i-lucide-layout-dashboard', desc: 'Melihat dashboard utama' },
  { id: 'students', label: 'Data Siswa', icon: 'i-lucide-users', desc: 'Mengelola data siswa (CRUD)' },
  { id: 'teachers', label: 'Data Guru', icon: 'i-lucide-user-check', desc: 'Mengelola data guru' },
  { id: 'classes', label: 'Kelas/Rombel', icon: 'i-lucide-school', desc: 'Mengelola kelas' },
  { id: 'extracurriculars', label: 'Ekskul', icon: 'i-lucide-shield', desc: 'Mengelola data ekstrakurikuler' },
  { id: 'users', label: 'User & Privileges', icon: 'i-lucide-user-cog', desc: 'Mengelola user (hanya admin)' },
  { id: 'reports', label: 'Laporan', icon: 'i-lucide-file-bar-chart', desc: 'Membuat dan melihat laporan' },
  { id: 'settings', label: 'Pengaturan', icon: 'i-lucide-settings', desc: 'Mengatur profil instansi' },
  { id: 'attendance', label: 'Absensi QR', icon: 'i-lucide-qr-code', desc: 'Membuat sesi absensi' },
  { id: 'assessments', label: 'Penilaian', icon: 'i-lucide-clipboard-check', desc: 'Input dan kelola nilai' },
  { id: 'schedule', label: 'Jadwal', icon: 'i-lucide-calendar', desc: 'Mengelola jadwal ekskul' },
  { id: 'members', label: 'Anggota', icon: 'i-lucide-users', desc: 'Mengelola anggota ekskul' },
  { id: 'polls', label: 'Voting', icon: 'i-lucide-vote', desc: 'Membuat dan kelola voting' },
  { id: 'news', label: 'Berita', icon: 'i-lucide-megaphone', desc: 'Membuat pengumuman/berita' },
  { id: 'gallery', label: 'Galeri', icon: 'i-lucide-images', desc: 'Upload dan kelola galeri' },
  { id: 'feed', label: 'Feed', icon: 'i-lucide-newspaper', desc: 'Melihat feed komunitas' },
  { id: 'achievements', label: 'Prestasi', icon: 'i-lucide-award', desc: 'Mengelola portofolio prestasi' },
  { id: 'profile', label: 'Profil', icon: 'i-lucide-user', desc: 'Mengelola profil pribadi' }
]

const search = ref('')
const showModal = ref(false)
const editMode = ref(false)
const saving = ref(false)
const selectedUser = ref<AppUser | null>(null)
const form = reactive({ id: '', name: '', username: '', password: '', role: 'operator', phone: '', email: '', status: 'active' as 'active' | 'inactive', permissions: [] as string[] })
const showPrivileges = ref(false)

onMounted(() => store.fetchAll())

const filtered = computed(() => store.appUsers.filter(u =>
  u.name.toLowerCase().includes(search.value.toLowerCase()) ||
  u.username.includes(search.value) ||
  u.role.toLowerCase().includes(search.value.toLowerCase())
))

function openAdd() {
  editMode.value = false; selectedUser.value = null
  Object.assign(form, { id: '', name: '', username: '', password: '', role: 'operator', phone: '', email: '', status: 'active', permissions: ['dashboard', 'attendance'] })
  showModal.value = true; showPrivileges.value = false
}
function openEdit(u: AppUser) {
  editMode.value = true; selectedUser.value = u
  form.id = u.id; form.name = u.name; form.username = u.username; form.password = ''
  form.role = u.role; form.phone = u.phone || ''; form.email = u.email || ''
  form.status = u.status; form.permissions = u.permissions.map(p => p.permissionId)
  showModal.value = true; showPrivileges.value = false
}
async function save() {
  saving.value = true
  try {
    if (editMode.value && selectedUser.value) {
      await store.updateUser(selectedUser.value.id, {
        name: form.name, phone: form.phone, email: form.email,
        status: form.status, permissions: form.permissions
      })
    } else {
      await store.addUser({
        username: form.username, password: form.password,
        name: form.name, role: form.role, phone: form.phone,
        email: form.email, permissions: form.permissions
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
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">User & Privileges</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ store.appUsers.length }} total user · {{ store.activeUsers }} aktif</p>
      </div>
      <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah User</button>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <input v-model="search" type="text" placeholder="Cari nama, username, atau role..." class="search-input">
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} dari {{ store.appUsers.length }} user</span>
      </div>
      <table class="data-table">
        <thead><tr><th>Nama</th><th>Username</th><th>Role</th><th>Kontak</th><th>Status</th><th>Akses</th><th class="text-right">Aksi</th></tr></thead>
        <tbody>
          <tr v-for="u in filtered" :key="u.id">
            <td>
              <div class="flex items-center gap-3">
                <div class="user-avatar">{{ u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }}</div>
                <div><div class="font-semibold text-[13px]">{{ u.name }}</div><div class="text-[11px]" style="color: var(--text-muted);">{{ u.email }}</div></div>
              </div>
            </td>
            <td><span class="nis-code">{{ u.username }}</span></td>
            <td><span class="role-tag">{{ u.role }}</span></td>
            <td style="color: var(--text-secondary); font-size: var(--text-sm);">{{ u.phone }}</td>
            <td>
              <button class="status-toggle" :class="u.status === 'active' ? 'toggle-on' : 'toggle-off'" @click="toggleUserStatus(u.id)">
                <span class="toggle-dot"></span><span>{{ u.status === 'active' ? 'Aktif' : 'Nonaktif' }}</span>
              </button>
            </td>
            <td><span class="perm-count">{{ (u.permissions || []).length }} izin</span></td>
            <td class="text-right action-cell">
              <button class="action-btn" @click="openEdit(u)" title="Edit Privileges">🔑</button>
              <button class="action-btn" @click="store.toggleUserStatus(u.id)" title="Toggle Status" style="color: var(--orange);">🔄</button>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="7" class="text-center py-8" style="color: var(--text-muted);">Tidak ada user ditemukan</td></tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3 class="modal-title">{{ editMode ? 'Edit User' : 'Tambah User Baru' }}</h3>
            <button @click="showModal = false" class="modal-close">✕</button>
          </div>
          <form @submit.prevent="save" class="space-y-4">
            <div class="form-row">
              <div class="form-group"><label>Nama Lengkap</label><input v-model="form.name" class="form-input" required></div>
              <div class="form-group"><label>Username</label><input v-model="form.username" class="form-input" required></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Role</label><select v-model="form.role" class="form-input"><option value="admin">Admin Sekolah</option><option value="operator">Operator</option></select></div>
              <div class="form-group"><label>Status</label><select v-model="form.status" class="form-input"><option value="active">Aktif</option><option value="inactive">Nonaktif</option></select></div>
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
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
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
.nis-code { font-family: 'Courier New', monospace; font-size: var(--text-xs); color: var(--text-secondary); }
.role-tag { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.perm-count { font-size: var(--text-xs); color: var(--text-muted); }
.status-toggle { display: inline-flex; align-items: center; gap: 6px; padding: 3px 10px; border-radius: 10px; border: none; cursor: pointer; font-size: var(--text-xs); font-weight: var(--font-medium); transition: all 0.2s; }
.toggle-on { background: rgba(74,158,158,0.15); color: var(--teal); }
.toggle-off { background: rgba(212,106,90,0.15); color: var(--red-orange); }
.toggle-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.action-cell { display: flex; gap: 4px; justify-content: flex-end; }
.action-btn { background: none; border: none; cursor: pointer; padding: 4px 6px; border-radius: 4px; font-size: 14px; }
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
</style>
