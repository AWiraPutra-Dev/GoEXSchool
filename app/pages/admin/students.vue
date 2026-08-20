<script setup lang="ts">
import type { Student } from '~/stores/master-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const store = useMasterDataStore()
const { confirm } = useConfirm()
const search = ref('')
// Filter kelas: 'all' = semua kelas. Daftar kelas diambil dari data siswa
// yang ada supaya grouping selalu sesuai dengan data sekolah.
const classFilter = ref('all')
const showModal = ref(false)
const editMode = ref(false)
const saving = ref(false)
const importing = ref(false)
const importResult = ref<{ count: number; errors: Array<{ row: number; message: string }> } | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const form = reactive({ id: '', nis: '', name: '', class: '', gender: 'L', phone: '' })

const openContactId = ref<string | null>(null)
function toggleContact(e: MouseEvent, id: string) {
  openContactId.value = openContactId.value === id ? null : id
}
onMounted(() => {
  document.addEventListener('click', () => { openContactId.value = null })
  store.fetchAll()
})
onUnmounted(() => document.removeEventListener('click', () => {}))

// Daftar kelas + jumlah siswa per kelas (untuk chip filter & header grup)
const classList = computed(() => {
  const map = new Map<string, number>()
  for (const s of store.students) {
    map.set(s.class, (map.get(s.class) || 0) + 1)
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
})

const filtered = computed(() =>
  store.students.filter(s => {
    if (classFilter.value !== 'all' && s.class !== classFilter.value) return false
    return (
      s.name.toLowerCase().includes(search.value.toLowerCase()) ||
      s.nis.includes(search.value) ||
      s.class.toLowerCase().includes(search.value.toLowerCase())
    )
  })
)

// Siswa dikelompokkan per kelas (menggunakan kolom Kelas pada data siswa)
const grouped = computed(() => {
  const map = new Map<string, Student[]>()
  for (const s of filtered.value) {
    const list = map.get(s.class) || []
    list.push(s)
    map.set(s.class, list)
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
})

function openAdd() {
  editMode.value = false
  form.id = ''; form.nis = ''; form.name = ''; form.class = ''; form.gender = 'L'; form.phone = ''
  showModal.value = true
}

function openEdit(s: Student) {
  editMode.value = true
  form.id = s.id; form.nis = s.nis; form.name = s.name; form.class = s.class; form.gender = s.gender; form.phone = s.phone || ''
  showModal.value = true
}

async function save() {
  saving.value = true
  try {
    if (editMode.value) {
      await store.updateStudent(form.id, { name: form.name, class: form.class, gender: form.gender, phone: form.phone })
    } else {
      await store.addStudent({ name: form.name, class: form.class, gender: form.gender, phone: form.phone })
    }
    showModal.value = false
  } finally {
    saving.value = false
  }
}

async function removeStudent(s: Student) {
  const ok = await confirm({
    title: `Delete student "${s.name}"?`,
    message: 'Student data, extracurricular membership, and history will be permanently deleted.',
    confirmText: ui.t('confirm.yesDelete'),
    danger: true,
  })
  if (!ok) return
  await store.deleteStudent(s.id)
}

// ---- Status akun login siswa (toggle aktif/nonaktif) ----
async function toggleAccountStatus(s: Student) {
  if (!s.account) return
  await store.toggleStudentAccountStatus(s.id)
}

// ---- Reset password akun siswa ----
const showResetModal = ref(false)
const resetTarget = ref<Student | null>(null)
const resetPassword = ref('')
const resetting = ref(false)
const resetResult = ref<{ username: string; password: string } | null>(null)

function openReset(s: Student) {
  resetTarget.value = s
  resetPassword.value = ''
  resetResult.value = null
  showResetModal.value = true
}

async function submitReset() {
  if (!resetTarget.value) return
  resetting.value = true
  resetResult.value = null
  try {
    const res = await store.resetStudentPassword(resetTarget.value.id, resetPassword.value.trim() || undefined)
    resetResult.value = res
  } catch (e: any) {
    alert(e?.data?.message || e?.message || 'Failed to reset password.')
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

function downloadTemplate() {
  window.open('/api/admin/students/template', '_blank')
}

function triggerFileImport() { fileInput.value?.click() }

async function handleFileImport() {
  const file = fileInput.value?.files?.[0]
  if (!file) return

  importing.value = true
  importResult.value = null
  try {
    const res = await store.importStudents(file)
    importResult.value = res
  } catch (e: any) {
    alert(e.data?.message || 'Failed to import file. Make sure the format follows the template (NIS, Name, Class, Gender, Phone).')
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.students') }}</h1>
      <div class="flex gap-2">
        <button class="btn-outline" @click="downloadTemplate">
          <Icon name="i-lucide-download" class="w-4 h-4" />
          {{ ui.t('action.download') }} Template
        </button>
        <button class="btn-outline" :disabled="importing" @click="triggerFileImport">
          <Icon name="i-lucide-upload" class="w-4 h-4" />
          {{ importing ? ui.t('action.loading') + '...' : 'Import Excel' }}
        </button>
        <input ref="fileInput" type="file" accept=".xlsx,.xls,.csv" class="hidden" @change="handleFileImport">
        <button class="btn-primary" @click="openAdd">
          <Icon name="i-lucide-plus" class="w-4 h-4" />
          {{ ui.t('action.add') }} {{ ui.t('menu.students') }}
        </button>
      </div>
    </div>

    <div class="table-card">
      <div class="table-toolbar">
        <input v-model="search" type="text" :placeholder="ui.t('action.search')" class="search-input">
        <span class="text-[11px]" style="color: var(--text-muted);">{{ filtered.length }} dari {{ store.students.length }} siswa</span>
      </div>

      <!-- Filter & pengelompokan per kelas -->
      <div class="class-filter-bar">
        <button
          class="class-filter-chip"
          :class="{ active: classFilter === 'all' }"
          @click="classFilter = 'all'"
        >
          {{ ui.t('reports.allClasses') }}
          <span class="chip-count">{{ store.students.length }}</span>
        </button>
        <button
          v-for="[cls, count] in classList"
          :key="cls"
          class="class-filter-chip"
          :class="{ active: classFilter === cls }"
          @click="classFilter = cls"
        >
          {{ cls }}
          <span class="chip-count">{{ count }}</span>
        </button>
      </div>

      <!-- Hasil import -->
      <div v-if="importResult" class="import-result" :class="importResult.errors.length ? 'result-warn' : 'result-ok'">
        <p class="font-semibold">{{ importResult.count }} data siswa berhasil diimpor.</p>
        <ul v-if="importResult.errors.length">
          <li v-for="(e, i) in importResult.errors" :key="i">Baris {{ e.row }}: {{ e.message }}</li>
        </ul>
      </div>

      <!-- Daftar siswa dikelompokkan per kelas -->
      <div v-if="!grouped.length" class="empty-state">
        <p style="color: var(--text-muted);">{{ ui.t('common.noData') }}</p>
      </div>

      <div v-for="[cls, students] in grouped" :key="cls" class="class-group">
        <div class="class-group-header">
          <Icon name="i-lucide-users" class="w-4 h-4" />
          <span class="class-group-name">{{ cls }}</span>
          <span class="class-group-count">{{ students.length }}</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>{{ ui.t('common.nis') }}</th><th>{{ ui.t('common.name') }}</th><th>{{ ui.t('common.class') }}</th><th>{{ ui.t('common.gender') }}</th><th>{{ ui.t('common.phone') }}</th><th>{{ ui.t('common.status') }}</th><th class="text-center">{{ ui.t('table.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in students" :key="s.id">
              <td><span class="nis-code">{{ s.nis }}</span></td>
              <td class="font-semibold">{{ s.name }}</td>
              <td>{{ s.class }}</td>
              <td>{{ s.gender }}</td>
              <td style="color: var(--text-secondary);">
                <div class="contact-dropdown-wrap" @click.stop>
                  <button class="contact-dropdown-btn" @click="toggleContact($event, s.id)">
                    <Icon name="i-lucide-phone" class="w-3.5 h-3.5" />
                    <span>{{ s.phone || s.email ? 'Kontak' : '-' }}</span>
                  </button>
                  <div v-if="openContactId === s.id" class="contact-dropdown">
                    <div class="contact-item" v-if="s.phone"><Icon name="i-lucide-phone" class="w-3.5 h-3.5" /> {{ s.phone }}</div>
                    <div class="contact-item" v-if="s.email"><Icon name="i-lucide-mail" class="w-3.5 h-3.5" /> {{ s.email }}</div>
                    <div class="contact-item" v-if="!s.phone && !s.email" style="color: var(--text-muted);">-</div>
                  </div>
                </div>
              </td>
              <td>
                <template v-if="s.account">
                  <button
                    class="user-switch"
                    :class="{ on: s.account.status === 'active' }"
                    role="switch"
                    :aria-checked="s.account.status === 'active'"
                    :title="s.account.status === 'active' ? 'Klik untuk menonaktifkan akun' : 'Klik untuk mengaktifkan akun'"
                    @click="toggleAccountStatus(s)"
                  >
                    <span class="user-switch-track"><span class="user-switch-thumb"></span></span>
                  </button>
                </template>
                <span v-else class="status-badge status-pending">Belum Daftar</span>
              </td>
              <td class="text-center action-cell">
                <button v-if="s.account" class="action-btn" @click="openReset(s)" title="Reset Password"><Icon name="i-lucide-key" class="w-4 h-4" /></button>
                <button class="action-btn" @click="openEdit(s)" title="Edit"><Icon name="i-lucide-pencil" class="w-4 h-4" /></button>
                <button class="action-btn danger" @click="removeStudent(s)" title="Hapus"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">{{ editMode ? ui.t('action.edit') + ' ' + ui.t('menu.students') : ui.t('action.add') + ' ' + ui.t('menu.students') }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div v-if="editMode" class="form-row">
              <div class="form-group"><label>{{ ui.t('common.nis') }}</label><input :value="form.nis" type="text" disabled class="form-input"></div>
              <div class="form-group"><label>{{ ui.t('common.name') }}</label><input v-model="form.name" type="text" required class="form-input"></div>
            </div>
            <div v-else class="form-row">
              <div class="form-group"><label>{{ ui.t('common.nis') }} (auto)</label><input value="Auto-generate" type="text" disabled class="form-input"></div>
              <div class="form-group"><label>{{ ui.t('common.name') }}</label><input v-model="form.name" type="text" required class="form-input"></div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>{{ ui.t('common.class') }}</label>
                <select v-model="form.class" required class="form-input">
                  <option value="">Pilih kelas</option>
                  <option>10 IPA 1</option><option>10 IPA 2</option>
                  <option>11 IPA 1</option><option>11 IPA 2</option>
                  <option>11 IPS 1</option><option>11 IPS 2</option>
                  <option>12 IPA 1</option><option>12 IPA 2</option>
                </select>
              </div>
              <div class="form-group"><label>{{ ui.t('common.gender') }}</label>
                <select v-model="form.gender" class="form-input">
                  <option value="L">{{ ui.t('common.male') }}</option><option value="P">{{ ui.t('common.female') }}</option>
                </select>
              </div>
            </div>
            <div class="form-group"><label>{{ ui.t('common.phone') }}</label><input v-model="form.phone" type="text" class="form-input"></div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">{{ ui.t('action.cancel') }}</button>
              <button type="submit" class="btn-primary">{{ editMode ? ui.t('action.save') : ui.t('action.add') }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal Reset Password akun siswa -->
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
                <div class="text-[12px]" style="color: var(--text-muted);">NIS {{ resetTarget?.nis }} · {{ resetTarget?.class }}</div>
              </div>
            </div>
            <p class="text-[13px]" style="color: var(--text-secondary); margin: 12px 0;">
              Enter new password (minimum 6 characters). Leave empty to auto-generate a temporary password.
            </p>
            <div class="form-group">
              <label>New Password</label>
              <input v-model="resetPassword" type="text" class="form-input" minlength="6" placeholder="Minimum 6 characters (leave empty for auto)">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showResetModal = false">{{ ui.t('action.cancel') }}</button>
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
                  Account <strong>{{ resetResult.username }}</strong> now uses the new password below. Copy and send to the student.
                </p>
              </div>
            </div>
            <div class="reset-password-display">
              <span class="reset-password-value">{{ resetResult.password }}</span>
              <button class="action-btn" @click="copyResetPassword" title="Copy"><Icon name="i-lucide-copy" class="w-4 h-4" /></button>
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
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-primary); font-size: var(--text-sm); font-weight: var(--font-medium); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--bg-hover); }
.btn-outline:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.table-card { background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); overflow: hidden; }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid var(--border-light); }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); }
.search-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.data-table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.data-table th { text-align: left; padding: 10px 16px; font-weight: var(--font-semibold); background: var(--bg-main); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.3px; }
.data-table td { padding: 10px 16px; border-top: 1px solid var(--border-light); }
.nis-code { font-size: var(--text-xs); font-variant-numeric: tabular-nums; letter-spacing: 0.04em; font-weight: var(--font-medium); color: var(--text-secondary); }
.status-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; font-weight: var(--font-medium); }
.status-pending { background: rgba(212, 192, 137, 0.2); color: var(--orange); }
.action-cell { display: flex; gap: 4px; justify-content: center; align-items: center; }
.contact-dropdown-wrap { position: relative; }
.contact-dropdown-btn { display: inline-flex; align-items: center; gap: 4px; background: none; border: 1px solid var(--border-light); padding: 2px 8px; font-size: var(--text-sm); color: var(--text-secondary); cursor: pointer; }
.contact-dropdown-btn:hover { border-color: var(--olive-primary); color: var(--olive-primary); }
.contact-dropdown { position: absolute; top: 100%; left: 0; margin-top: 4px; width: 200px; background: var(--bg-card); border: 1px solid var(--border-light); padding: 4px; z-index: 50; }
.contact-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; font-size: var(--text-sm); color: var(--text-primary); }
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
.data-table th.text-center, .data-table td.text-center { text-align: center; }

/* ---- Toggle geser status akun siswa ---- */
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

/* ---- Modal header & reset password ---- */
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.modal-close { background: none; border: none; font-size: 20px; color: var(--text-muted); cursor: pointer; }
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--olive-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: var(--font-bold); flex-shrink: 0; }
.reset-user-info { display: flex; align-items: center; gap: 12px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 12px 14px; }
.reset-avatar { width: 38px; height: 38px; }
.reset-result-ok { display: flex; align-items: flex-start; gap: 10px; background: rgba(74,158,158,0.12); border: 1px solid rgba(74,158,158,0.3); border-radius: 8px; padding: 14px 16px; }
.reset-result-ok .w-6 { color: var(--teal); flex-shrink: 0; margin-top: 2px; }
.reset-password-display { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: var(--bg-main); border: 1px dashed var(--border-light); border-radius: 8px; padding: 12px 16px; margin-top: 14px; }
.reset-password-value { font-size: var(--text-lg); font-weight: var(--font-bold); letter-spacing: 0.06em; color: var(--text-primary); font-variant-numeric: tabular-nums; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.hidden { display: none; }

/* ---- Filter & grouping per kelas ---- */
.class-filter-bar { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-bottom: 1px solid var(--border-light); flex-wrap: wrap; }
.class-filter-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 4px; border: 1px solid var(--border-light); background: white; font-size: var(--text-xs); font-weight: var(--font-medium); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.class-filter-chip:hover { border-color: var(--olive-primary); color: var(--olive-primary); }
.class-filter-chip.active { background: var(--olive-primary); border-color: var(--olive-primary); color: white; }
.chip-count { font-size: 12px; background: var(--bg-hover); border-radius: 4px; padding: 1px 7px; }
.class-filter-chip.active .chip-count { background: rgba(255,255,255,0.25); }
.class-group { border-top: 1px solid var(--border-light); }
.class-group:first-of-type { border-top: none; }
.class-group-header { display: flex; align-items: center; gap: 8px; padding: 10px 16px; background: var(--bg-main); color: var(--text-primary); font-size: var(--text-sm); font-weight: var(--font-semibold); }
.class-group-name { letter-spacing: 0.02em; }
.class-group-count { font-size: 11px; font-weight: var(--font-medium); color: var(--text-muted); background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 4px; padding: 1px 8px; }
.empty-state { padding: 40px 16px; text-align: center; }

/* ---- Hasil import ---- */
.import-result { margin: 12px 16px; border-radius: 8px; padding: 12px 14px; font-size: var(--text-sm); }
.result-ok { background: rgba(74, 158, 158, 0.12); color: var(--teal-dark); }
.result-warn { background: rgba(212, 149, 106, 0.14); color: var(--orange); }
.import-result ul { margin: 6px 0 0 18px; list-style: disc; font-size: var(--text-xs); color: var(--text-secondary); }
</style>
