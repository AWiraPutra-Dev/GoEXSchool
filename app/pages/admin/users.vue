<script setup lang="ts">
import type { AppUser } from '~/stores/master-data'
import { PERMISSION_FEATURES, permKey, normalizePerm, ACTION_META, type PermissionAction } from '~/utils/permissions'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const auth = useAuthStore()
const store = useMasterDataStore()
const { confirm } = useConfirm()

// Format waktu login terakhir — mengikuti zona waktu sekolah.
function fmtLogin(ts?: string | null) {
  if (!ts) return 'Never logged in'
  return formatSchoolTime(new Date(ts), auth.institution, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Katalog permission CRUD per fitur (Lihat/Buat/Ubah/Hapus — disesuaikan per fitur)
const allPermissions = PERMISSION_FEATURES
const allActionKeys = PERMISSION_FEATURES.flatMap(f => f.actions.map(a => permKey(f.id, a)))
const totalActions = allActionKeys.length

const search = ref('')
const roleFilter = ref<'all' | 'admin' | 'operator' | 'student'>('all')
const showModal = ref(false)
const editMode = ref(false)
const saving = ref(false)
const selectedUser = ref<AppUser | null>(null)
const form = reactive({ id: '', name: '', username: '', password: '', role: 'operator', phone: '', email: '', status: 'active' as 'active' | 'inactive', permissions: [] as string[], extracurricularId: '', nis: '' })
const showPrivileges = ref(false)
const openContactId = ref<string | null>(null)
function toggleContact(e: MouseEvent, u: any) {
  openContactId.value = openContactId.value === u.id ? null : u.id
}
onMounted(() => {
  document.addEventListener('click', closeContact)
  store.fetchAll()
})
onUnmounted(() => document.removeEventListener('click', closeContact))
function closeContact() { openContactId.value = null }

const roleLabels: Record<string, string> = {
  admin: 'School Admin',
  operator: 'Operator',
  student: 'Student'
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
  Object.assign(form, { id: '', name: '', username: '', password: '', role: 'operator', phone: '', email: '', status: 'active', permissions: ['dashboard:read'], extracurricularId: '', nis: '' })
  studentMatch.value = null
  showModal.value = true; showPrivileges.value = false
}
function openEdit(u: AppUser) {
  editMode.value = true; selectedUser.value = u
  form.id = u.id; form.name = u.name; form.username = u.username; form.password = ''
  form.role = u.role; form.phone = u.phone || ''; form.email = u.email || ''
  form.status = u.status; form.permissions = u.permissions.map(p => normalizePerm(p.permissionId))
  form.extracurricularId = u.extracurricularId || ''
  showModal.value = true; showPrivileges.value = false
}
async function save() {
  // Operator ekskul wajib diikat ke satu ekskul sejak pembuatan akun
  if (form.role === 'operator' && !form.extracurricularId) {
    alert('Extracurricular operator must be assigned to one extracurricular. Select the one to manage.')
    return
  }
  // Akun siswa wajib memakai NIS yang sudah terdaftar di Data Siswa
  if (form.role === 'student') {
    if (!form.nis.trim()) {
      alert('NIS is required for student accounts.')
      return
    }
    if (!studentMatch.value || studentMatch.value.nis !== form.nis.trim()) lookupStudent()
    if (!studentMatch.value) {
      alert('NIS not found in Student Data. Make sure the NIS is registered before creating a student account.')
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
function toggleAction(featureId: string, action: PermissionAction) {
  const key = permKey(featureId, action)
  const idx = form.permissions.indexOf(key)
  if (idx >= 0) form.permissions.splice(idx, 1)
  else form.permissions.push(key)
}
function hasAction(featureId: string, action: PermissionAction) {
  return form.permissions.includes(permKey(featureId, action))
}
function selectAllPerms() { form.permissions = [...allActionKeys] }
function clearPerms() { form.permissions = [] }
async function toggleUserStatus(id: string) { await store.toggleUserStatus(id) }

// ---- Reset password user (admin) ----
const showResetModal = ref(false)
const resetTarget = ref<AppUser | null>(null)
const resetPassword = ref('')
const resetting = ref(false)
const resetResult = ref<{ username: string; password: string } | null>(null)

function openReset(u: AppUser) {
  resetTarget.value = u
  resetPassword.value = ''
  resetResult.value = null
  showResetModal.value = true
}

async function submitReset() {
  if (!resetTarget.value) return
  resetting.value = true
  resetResult.value = null
  try {
    const res = await store.resetUserPassword(resetTarget.value.id, resetPassword.value.trim() || undefined)
    resetResult.value = res
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to reset password.')
  } finally {
    resetting.value = false
  }
}

async function copyResetPassword() {
  if (!resetResult.value) return
  try {
    await navigator.clipboard.writeText(resetResult.value.password)
    alert('Password copied successfully.')
  } catch {
    alert('Failed to copy. Copy manually: ' + resetResult.value.password)
  }
}

async function removeUser(u: AppUser) {
  const ok = await confirm({
    title: `Delete user "${u.name}"?`,
    message: 'This action cannot be undone. Consider deactivating the account instead if still needed.',
    confirmText: ui.t('confirm.yesDelete'),
    danger: true,
    verify: 'HAPUS',
  })
  if (!ok) return
  try {
    await store.deleteUser(u.id)
  } catch (e: any) {
    alert(e?.data?.message || 'Failed to delete user. Consider deactivating the account instead.')
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
    alert(e?.data?.message || 'Failed to import file. Make sure the format follows the template.')
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
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ store.appUsers.length }} total users · {{ store.activeUsers }} active</p>
      </div>
      <div class="flex gap-2">
        <button class="btn-outline" @click="exportExcel"><Icon name="i-lucide-file-spreadsheet" class="w-4 h-4" /> Export Excel</button>
        <button class="btn-outline" @click="openImportModal"><Icon name="i-lucide-upload-cloud" class="w-4 h-4" /> Import Excel</button>
        <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> {{ ui.t('action.add') }} User</button>
      </div>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <input v-model="search" type="text" :placeholder="ui.t('action.search')" class="search-input">
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} of {{ store.appUsers.length }} users</span>
      </div>
      <div class="role-filter-bar">
        <button
          v-for="opt in [{ value: 'all', label: ui.t('common.all') }, { value: 'admin', label: 'Admin' }, { value: 'operator', label: 'Operator' }, { value: 'student', label: 'Student' }]"
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
        <thead><tr><th>{{ ui.t('common.name') }}</th><th>Username</th><th>Role</th><th>{{ ui.t('common.phone') }}</th><th>Last Login</th><th>{{ ui.t('common.status') }}</th><th>Access</th><th class="text-right">{{ ui.t('table.actions') }}</th></tr></thead>
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
            <td><span class="role-tag">{{ roleLabels[u.role] || u.role }}</span></td>
            <td style="color: var(--text-secondary); font-size: var(--text-sm);">
              <div class="contact-dropdown-wrap" @click.stop>
                <button class="contact-dropdown-btn" @click="toggleContact($event, u)">
                  <Icon name="i-lucide-phone" class="w-3.5 h-3.5" />
                  <span>{{ u.phone || u.email ? 'Kontak' : '-' }}</span>
                </button>
                <div v-if="openContactId === u.id" class="contact-dropdown">
                  <div class="contact-item" v-if="u.phone"><Icon name="i-lucide-phone" class="w-3.5 h-3.5" /> {{ u.phone }}</div>
                  <div class="contact-item" v-if="u.email"><Icon name="i-lucide-mail" class="w-3.5 h-3.5" /> {{ u.email }}</div>
                  <div class="contact-item" v-if="!u.phone && !u.email" style="color: var(--text-muted);">Tidak ada kontak</div>
                </div>
              </div>
            </td>
            <td>
              <div style="font-size: var(--text-xs); color: var(--text-secondary); white-space: nowrap;">{{ fmtLogin(u.lastLogin) }}</div>
            </td>
            <td>
              <button
                class="user-switch"
                :class="{ on: u.status === 'active' }"
                role="switch"
                :aria-checked="u.status === 'active'"
                :title="u.status === 'active' ? 'Klik untuk menonaktifkan akun' : 'Klik untuk mengaktifkan akun'"
                @click="toggleUserStatus(u.id)"
              >
                <span class="user-switch-track"><span class="user-switch-thumb"></span></span>
              </button>
            </td>
            <td><span class="perm-count">{{ (u.permissions || []).length }} izin</span></td>
            <td class="text-right action-cell">
              <button class="action-btn" @click="openEdit(u)" title="Edit Privileges"><Icon name="i-lucide-key-round" class="w-4 h-4" /></button>
              <button class="action-btn" @click="openReset(u)" title="Reset Password"><Icon name="i-lucide-key" class="w-4 h-4" /></button>
              <button v-if="u.role !== 'admin'" class="action-btn danger" @click="removeUser(u)" title="Hapus User"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
              <span v-else class="action-placeholder"></span>
            </td>
          </tr>
          <tr v-if="!filtered.length"><td colspan="8" class="text-center py-8" style="color: var(--text-muted);">{{ ui.t('common.noData') }}</td></tr>
        </tbody>
      </table>
      <PaginationBar v-model:page="page" :total="filtered.length" />
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content modal-lg">
          <div class="modal-header">
            <h3 class="modal-title">{{ editMode ? ui.t('action.edit') + ' User' : ui.t('action.add') + ' User' }}</h3>
            <button @click="showModal = false" class="modal-close"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>
          <form @submit.prevent="save" class="space-y-4">
            <div class="form-row">
              <div class="form-group"><label>{{ ui.t('common.name') }}</label><input v-model="form.name" class="form-input" required :readonly="!editMode && form.role === 'student'"></div>
              <div class="form-group"><label>Username</label>
                <input v-if="!(!editMode && form.role === 'student')" v-model="form.username" class="form-input" required>
                <input v-else :value="form.nis" class="form-input" readonly placeholder="Otomatis memakai NIS">
              </div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Role</label><select v-model="form.role" class="form-input"><option value="admin">School Admin</option><option value="operator">Extracurricular Operator</option><option value="student">Student</option></select></div>
              <div class="form-group"><label>{{ ui.t('common.status') }}</label><select v-model="form.status" class="form-input"><option value="active">{{ ui.t('common.active') }}</option><option value="inactive">{{ ui.t('common.inactive') }}</option></select></div>
            </div>
            <div v-if="!editMode && form.role === 'student'" class="form-group">
              <label>NIS <span style="color: var(--red-orange);">*</span></label>
              <input v-model="form.nis" type="text" class="form-input" placeholder="Contoh: 20250001" @blur="lookupStudent" required>
              <p v-if="studentMatch" class="nis-feedback nis-ok"><Icon name="i-lucide-check-circle" class="w-3.5 h-3.5" /> Student found: {{ studentMatch.name }} · Class {{ studentMatch.class }}</p>
              <p v-else-if="form.nis && !studentMatch" class="nis-feedback nis-error"><Icon name="i-lucide-alert-circle" class="w-3.5 h-3.5" /> NIS not found. Add the student in the Students menu first.</p>
            </div>
            <div v-if="form.role === 'operator'" class="form-group">
              <label>Managed Extracurricular <span style="color: var(--red-orange);">*</span></label>
              <select v-model="form.extracurricularId" class="form-input" :required="form.role === 'operator'">
                <option disabled value="">Select Extracurricular</option>
                <option v-for="e in store.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
              </select>
              <p class="text-[11px]" style="color: var(--text-muted); margin-top: 4px;">
                Required. Operator can only view & manage this extracurricular's data (polls, QR attendance, blog, materials, schedule, gallery).
              </p>
            </div>
            <div v-if="!editMode" class="form-group"><label>Password</label><input v-model="form.password" type="password" class="form-input" minlength="6" placeholder="Minimum 6 characters"></div>
            <div class="form-row">
              <div class="form-group"><label>{{ ui.t('common.phone') }}</label><input v-model="form.phone" class="form-input"></div>
              <div class="form-group"><label>{{ ui.t('common.email') }}</label><input v-model="form.email" type="email" class="form-input"></div>
            </div>

            <div class="privileges-section">
              <div class="privileges-header">
                <h4 class="font-semibold text-[14px]">Access Rights / Privileges</h4>
                <div class="privileges-actions">
                  <button type="button" class="btn-small" @click="selectAllPerms">Select All</button>
                  <button type="button" class="btn-small btn-small-outline" @click="clearPerms">Clear All</button>
                </div>
              </div>
              <p class="text-[12px]" style="color: var(--text-muted); margin-bottom: 12px;">
                {{ form.permissions.length }} of {{ totalActions }} access rights selected.
                <span v-if="!form.permissions.length" style="color: var(--red-orange);">Account won't be able to view anything.</span>
              </p>
              <div class="permissions-crud">
                <div
                  v-for="perm in allPermissions" :key="perm.id"
                  class="perm-row"
                  :class="{ 'perm-row-active': form.permissions.some(p => p.startsWith(perm.id + ':')) }"
                >
                  <div class="perm-row-head">
                    <div class="perm-icon-wrapper"><Icon :name="perm.icon" class="w-4 h-4" /></div>
                    <div class="perm-text">
                      <span class="perm-label">{{ perm.label }}</span>
                      <span class="perm-desc">{{ perm.desc }}</span>
                    </div>
                  </div>
                  <div class="perm-actions">
                    <label
                      v-for="action in perm.actions" :key="action"
                      class="action-chip"
                      :class="{ 'action-on': hasAction(perm.id, action) }"
                    >
                      <input type="checkbox" :checked="hasAction(perm.id, action)" @change="toggleAction(perm.id, action)" class="action-checkbox">
                      <span class="action-dot" :style="{ background: ACTION_META[action].color }"></span>
                      {{ ACTION_META[action].label }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">{{ ui.t('action.cancel') }}</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                <span v-if="saving" class="loading-spinner-sm"></span>
                <span v-else>{{ editMode ? ui.t('action.save') : ui.t('action.create') + ' User' }}</span>
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
            <h3 class="modal-title">Import Accounts from Excel</h3>
            <button @click="closeImportModal" class="modal-close"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>

          <!-- Fase 1: Tutorial -->
          <div v-if="!tutorialDone">
            <p class="import-intro">Create multiple accounts (Admin, Extracurricular Operator, or Student) in 3 easy steps:</p>
            <div class="tutorial-steps">
              <div class="tutorial-step">
                <div class="step-illustration" style="background: rgba(139,148,103,0.12); color: var(--olive-primary);">
                  <Icon name="i-lucide-file-down" class="w-7 h-7" />
                </div>
                <div class="step-num">1</div>
                <h4>Download Template</h4>
                <p>Download an Excel file with pre-formatted columns (Role, NIS, Username, Name, Class, Password, Extracurricular).</p>
              </div>
              <div class="tutorial-step">
                <div class="step-illustration" style="background: rgba(74,158,158,0.12); color: var(--teal);">
                  <Icon name="i-lucide-table" class="w-7 h-7" />
                </div>
                <div class="step-num">2</div>
                <h4>Fill Account Data</h4>
                <p>Fill each row: select Role, enter NIS for Students, extracurricular name for Operators, and password (min 6 characters).</p>
              </div>
              <div class="tutorial-step">
                <div class="step-illustration" style="background: rgba(212,149,106,0.14); color: var(--orange);">
                  <Icon name="i-lucide-upload-cloud" class="w-7 h-7" />
                </div>
                <div class="step-num">3</div>
                <h4>Upload &amp; Process</h4>
                <p>After filling the template, upload the file. The system creates all accounts at once and reports the results.</p>
              </div>
            </div>
            <div class="tutorial-footer">
              <button class="btn-gray" :disabled="!tutorialDone" @click="downloadTemplate">
                <Icon name="i-lucide-download" class="w-4 h-4" /> Download Template
              </button>
              <button class="btn-primary" @click="tutorialDone = true">
                <Icon name="i-lucide-check" class="w-4 h-4" /> Got it, Continue
              </button>
            </div>
          </div>

          <!-- Fase 2: Setelah paham tutorial -->
          <div v-else>
            <div class="import-ready">
              <div class="ready-check"><Icon name="i-lucide-check" class="w-5 h-5" /></div>
              <div>
                <h4 class="font-semibold" style="color: var(--text-primary);">Ready to Upload!</h4>
                <p style="font-size: var(--text-sm); color: var(--text-secondary);">Download the template if you haven't, fill in the data, then select an Excel file to process.</p>
              </div>
            </div>
            <div class="import-actions">
              <button class="btn-green" @click="downloadTemplate">
                <Icon name="i-lucide-download" class="w-4 h-4" /> Download Template
              </button>
              <button class="btn-primary" :disabled="importing" @click="triggerFileImport">
                <Icon v-if="importing" name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
                <Icon v-else name="i-lucide-upload-cloud" class="w-4 h-4" />
                {{ importing ? 'Processing...' : 'Select Excel File' }}
              </button>
              <input ref="fileInput" type="file" accept=".xlsx,.xls" class="hidden" @change="handleFileImport">
            </div>
            <div v-if="importResult" class="import-result" :class="importResult.errors.length ? 'result-warn' : 'result-ok'">
              <p class="font-semibold">{{ importResult.count }} accounts created successfully.</p>
              <ul v-if="importResult.errors.length">
                <li v-for="(e, i) in importResult.errors" :key="i">Baris {{ e.row }}: {{ e.message }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Reset Password -->
    <Teleport to="body">
      <div v-if="showResetModal" class="modal-overlay" @click.self="showResetModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Reset Password</h3>
            <button @click="showResetModal = false" class="modal-close"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>

          <template v-if="!resetResult">
            <div class="reset-user-info">
              <div class="user-avatar reset-avatar">{{ (resetTarget?.name || '?').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }}</div>
              <div>
                <div class="font-semibold text-[14px]">{{ resetTarget?.name }}</div>
                <div class="text-[12px]" style="color: var(--text-muted);">{{ resetTarget?.username }} · {{ roleLabels[resetTarget?.role || ''] || resetTarget?.role }}</div>
              </div>
            </div>
            <p class="text-[13px]" style="color: var(--text-secondary); margin: 12px 0;">
              Masukkan password baru (minimal 6 karakter). Kosongkan untuk otomatis membuat password sementara.
            </p>
            <div class="form-group">
              <label>New Password</label>
              <input v-model="resetPassword" type="text" class="form-input" minlength="6" placeholder="Minimum 6 characters (leave empty for auto)">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showResetModal = false">Batal</button>
              <button type="button" class="btn-primary" :disabled="resetting" @click="submitReset">
                <span v-if="resetting" class="loading-spinner-sm"></span>
                <span v-else>Reset Password</span>
              </button>
            </div>
          </template>

          <template v-else>
            <div class="reset-result-ok">
              <Icon name="i-lucide-check-circle" class="w-6 h-6" />
              <div>
                <p class="font-semibold" style="color: var(--teal);">Password reset successful!</p>
                <p class="text-[13px]" style="color: var(--text-secondary); margin-top: 4px;">
                  Account <strong>{{ resetResult.username }}</strong> now uses the new password below. Copy and send to the user.
                </p>
              </div>
            </div>
            <div class="reset-password-display">
              <span class="reset-password-value">{{ resetResult.password }}</span>
              <button class="action-btn" @click="copyResetPassword" title="Salin"><Icon name="i-lucide-copy" class="w-4 h-4" /></button>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-primary" @click="showResetModal = false">{{ ui.t('action.close') }}</button>
            </div>
          </template>
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
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--olive-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: var(--font-bold); flex-shrink: 0; }
.nis-code { font-size: var(--text-xs); font-variant-numeric: tabular-nums; letter-spacing: 0.04em; font-weight: var(--font-medium); color: var(--text-secondary); }
.role-tag { font-size: var(--text-xs); padding: 2px 10px; background: var(--bg-hover); color: var(--text-secondary); font-weight: var(--font-medium); }
.role-filter-bar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; }
.role-filter-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 4px; border: 1px solid var(--border-light); background: white; font-size: var(--text-xs); font-weight: var(--font-medium); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.role-filter-chip:hover { border-color: var(--olive-primary); color: var(--olive-primary); }
.role-filter-chip.active { background: var(--olive-primary); border-color: var(--olive-primary); color: white; }
.chip-count { font-size: 12px; background: var(--bg-hover); border-radius: 4px; padding: 1px 7px; }
.role-filter-chip.active .chip-count { background: rgba(255,255,255,0.25); }
.perm-count { font-size: var(--text-xs); color: var(--text-muted); }
.data-table th.text-right, .data-table td.text-right { text-align: right; }

/* ---- Switch geser aktif/nonaktif (gaya sama dengan toggle tema) ---- */
.user-switch { background: none; border: none; cursor: pointer; padding: 2px; display: inline-flex; align-items: center; }
.user-switch-track {
  position: relative;
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: var(--border-medium);
  display: block;
  transition: background-color 0.25s ease;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.06);
}
.user-switch.on .user-switch-track { background: var(--teal); }
.user-switch-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.25);
}
.user-switch.on .user-switch-thumb { transform: translateX(18px); }
.action-cell { display: flex; gap: 4px; justify-content: flex-end; align-items: center; }
.action-placeholder { width: 32px; flex-shrink: 0; display: inline-block; }
.contact-dropdown-wrap { position: relative; }
.contact-dropdown-btn { display: inline-flex; align-items: center; gap: 4px; background: none; border: 1px solid var(--border-light); border-radius: 4px; padding: 2px 8px; font-size: var(--text-xs); color: var(--text-secondary); cursor: pointer; transition: all 0.15s; }
.contact-dropdown-btn:hover { border-color: var(--olive-primary); color: var(--olive-primary); }
.contact-dropdown { position: absolute; top: 100%; left: 0; margin-top: 4px; width: 200px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 4px; z-index: 50; }
.contact-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; font-size: var(--text-xs); color: var(--text-primary); border-radius: 4px; }
.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  transition: all 0.2s;
}
.action-btn:hover { background: var(--bg-hover); }
.action-btn.danger { color: var(--red-orange); }
.action-btn.danger:hover { background: rgba(220,38,38,0.1); }
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
.permissions-crud { display: flex; flex-direction: column; gap: 8px; max-height: 420px; overflow-y: auto; padding-right: 4px; }
.perm-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
  background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 10px;
  padding: 10px 12px; transition: all 0.15s;
}
.perm-row:hover { border-color: var(--olive-light); }
.perm-row-active { border-color: var(--olive-primary); background: rgba(139,148,103,0.05); }
.perm-row-head { display: flex; align-items: center; gap: 8px; min-width: 190px; flex: 1; }
.perm-icon-wrapper { width: 30px; height: 30px; border-radius: 8px; background: var(--olive-bg); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--olive-primary); }
.perm-text { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.perm-label { font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--text-primary); }
.perm-desc { font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.perm-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.action-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 10px; border-radius: 4px; cursor: pointer; user-select: none;
  background: var(--bg-main); border: 1px solid var(--border-light);
  font-size: 11px; font-weight: var(--font-medium); color: var(--text-secondary);
  transition: all 0.15s;
}
.action-chip:hover { border-color: var(--olive-light); }
.action-chip.action-on { background: var(--olive-bg); border-color: var(--olive-primary); color: var(--olive-primary); font-weight: var(--font-semibold); }
.action-checkbox { position: absolute; opacity: 0; width: 0; height: 0; }
.action-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; opacity: 0.55; }
.action-chip.action-on .action-dot { opacity: 1; }

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

/* ---- Reset password user ---- */
.reset-user-info { display: flex; align-items: center; gap: 12px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 12px 14px; }
.reset-avatar { width: 38px; height: 38px; }
.reset-result-ok { display: flex; align-items: flex-start; gap: 10px; background: rgba(74,158,158,0.12); border: 1px solid rgba(74,158,158,0.3); border-radius: 8px; padding: 14px 16px; }
.reset-result-ok .w-6 { color: var(--teal); flex-shrink: 0; margin-top: 2px; }
.reset-password-display { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: var(--bg-main); border: 1px dashed var(--border-light); border-radius: 8px; padding: 12px 16px; margin-top: 14px; }
.reset-password-value { font-size: var(--text-lg); font-weight: var(--font-bold); letter-spacing: 0.06em; color: var(--text-primary); font-variant-numeric: tabular-nums; }
</style>
