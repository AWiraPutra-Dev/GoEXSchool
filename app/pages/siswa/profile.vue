<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const auth = useAuthStore()
const { confirm } = useConfirm()
const editMode = ref(false)
const saving = ref(false)
const saved = ref(false)
const pwModal = ref(false)
const pwError = ref('')
const pwSaving = ref(false)

const form = reactive({
  name: auth.user?.name ?? '',
  nis: auth.user?.nis ?? '',
  class: auth.user?.class ?? '',
  phone: auth.user?.phone ?? ''
})
const avatarUrl = ref<string | null>(auth.user?.avatar ?? null)
const uploading = ref(false)

async function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/shared/upload', { method: 'POST', body: fd })
    avatarUrl.value = res.url
  } catch (e: any) {
    alert(e.data?.message || 'Gagal upload foto profil.')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

function removeAvatar() { avatarUrl.value = null }

async function save() {
  saving.value = true
  try {
    const res = await $fetch<{ id: string; name: string; avatar: string | null }>('/api/siswa/profile', {
      method: 'PUT',
      body: { name: form.name, phone: form.phone, class: form.class, avatarUrl: avatarUrl.value }
    })
    if (auth.user) {
      auth.user.name = res.name
      auth.user.avatar = res.avatar ?? undefined
    }
    if (process.client) localStorage.setItem('eh_user', JSON.stringify(auth.user))
    saved.value = true
    editMode.value = false
    setTimeout(() => saved.value = false, 2000)
  } catch (e: any) {
    alert(e.data?.message || 'Gagal menyimpan profil')
  } finally {
    saving.value = false
  }
}

async function logoutWithConfirm() {
  const ok = await confirm({
    title: 'Keluar dari aplikasi?',
    message: 'Anda akan keluar dari sesi ini dan perlu login kembali untuk mengakses aplikasi.',
    confirmText: 'Ya, Keluar',
    danger: true,
  })
  if (!ok) return
  auth.logout()
}

const pwForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })

async function changePassword() {
  pwError.value = ''
  if (pwForm.newPassword !== pwForm.confirmPassword) {
    pwError.value = 'Konfirmasi password tidak cocok.'
    return
  }
  if (pwForm.newPassword.length < 6) {
    pwError.value = 'Password baru minimal 6 karakter.'
    return
  }
  pwSaving.value = true
  try {
    await $fetch('/api/siswa/change-password', {
      method: 'POST',
      body: { oldPassword: pwForm.oldPassword, newPassword: pwForm.newPassword }
    })
    pwModal.value = false
    pwForm.oldPassword = ''
    pwForm.newPassword = ''
    pwForm.confirmPassword = ''
    alert('Password berhasil diubah!')
  } catch (e: any) {
    pwError.value = e.data?.message || 'Gagal mengubah password'
  } finally {
    pwSaving.value = false
  }
}
</script>

<template>
  <div class="space-y-4 max-w-2xl">
    <h1 class="page-title">{{ ui.t('menu.myProfile') }}</h1>

    <div class="profile-header-card">
      <div class="avatar-edit-wrap">
        <div class="profile-avatar-large">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Foto profil" class="profile-avatar-img" />
          <span v-else>{{ auth.userInitials }}</span>
        </div>
        <div class="avatar-buttons">
          <label class="btn-outline avatar-btn">
            <Icon v-if="!uploading" name="i-lucide-camera" class="w-4 h-4" />
            <Icon v-else name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
            {{ uploading ? 'Mengupload...' : 'Ubah Foto' }}
            <input type="file" accept="image/*" hidden @change="handleAvatarUpload">
          </label>
          <button v-if="avatarUrl" class="avatar-remove" title="Hapus foto" @click="removeAvatar">
            <Icon name="i-lucide-x" class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div class="profile-header-info">
        <h2 class="text-[20px] font-bold" style="color: var(--text-primary);">{{ form.name }}</h2>
        <p style="color: var(--text-secondary); font-size: var(--text-sm);">Siswa · NIS {{ form.nis }}</p>
        <p style="color: var(--text-secondary); font-size: var(--text-sm);">Kelas {{ form.class }}</p>
      </div>
      <button v-if="!editMode" class="btn-outline" @click="editMode = true">Edit Profil</button>
    </div>

    <div class="form-card">
      <h3 class="form-card-title">Informasi Diri</h3>
      <div class="space-y-4">
        <div class="form-row">
          <div class="form-group"><label>Nama Lengkap</label><input v-model="form.name" :disabled="!editMode" class="form-input"></div>
          <div class="form-group"><label>NIS</label><input v-model="form.nis" disabled class="form-input" style="background: var(--bg-main);"></div>
        </div>
        <div class="form-row">
          <div class="form-group"><label>Kelas</label><input v-model="form.class" :disabled="!editMode" class="form-input"></div>
          <div class="form-group"><label>Telepon</label><input v-model="form.phone" :disabled="!editMode" class="form-input"></div>
        </div>

        <div v-if="editMode" class="form-actions">
          <button class="btn-cancel" @click="editMode = false">Batal</button>
          <button class="btn-primary" :disabled="saving" @click="save">
            <Icon v-if="saved" name="i-lucide-check" class="w-4 h-4" />
            {{ saved ? 'Tersimpan!' : saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>

    <div class="form-card">
      <h3 class="form-card-title">Akun</h3>
      <div class="flex items-center justify-between py-2">
        <div>
          <p class="font-medium text-[13px]">Password</p>
          <p style="color: var(--text-muted); font-size: var(--text-sm);">Terakhir diubah 3 bulan lalu</p>
        </div>
        <button class="btn-outline" @click="pwModal = true">Ubah Password</button>
      </div>
      <div class="flex items-center justify-between py-2 border-t border-[var(--border-light)] mt-3 pt-3">
        <div>
          <p class="font-medium text-[13px]">Role</p>
          <p style="color: var(--text-muted); font-size: var(--text-sm);">Siswa</p>
        </div>
        <button class="btn-danger" @click="logoutWithConfirm()">
          <Icon name="i-lucide-log-out" class="w-4 h-4" /> Keluar
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="pwModal" class="modal-overlay" @click.self="pwModal = false">
        <div class="modal-content">
          <h3 class="modal-title">Ubah Password</h3>
          <form @submit.prevent="changePassword" class="space-y-3">
            <div class="form-group">
              <label>Password Lama</label>
              <input v-model="pwForm.oldPassword" type="password" class="form-input" required>
            </div>
            <div class="form-group">
              <label>Password Baru</label>
              <input v-model="pwForm.newPassword" type="password" class="form-input" required minlength="6">
            </div>
            <div class="form-group">
              <label>Konfirmasi Password Baru</label>
              <input v-model="pwForm.confirmPassword" type="password" class="form-input" required minlength="6">
            </div>
            <p v-if="pwError" style="color: var(--text-red); font-size: var(--text-sm);">{{ pwError }}</p>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="pwModal = false">Batal</button>
              <button type="submit" class="btn-primary" :disabled="pwSaving">{{ pwSaving ? 'Menyimpan...' : 'Ubah Password' }}</button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 20px; border-radius: 6px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.btn-outline { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-primary); font-size: var(--text-sm); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; transition: all 0.2s; }
.btn-outline:hover { background: var(--bg-hover); }
.btn-danger { display: inline-flex; align-items: center; gap: 6px; background: white; color: var(--text-red); font-size: var(--text-sm); padding: 8px 16px; border-radius: 6px; border: 1px solid var(--text-red); cursor: pointer; transition: all 0.2s; }
.btn-danger:hover { background: rgba(204,68,68,0.05); }
.profile-header-card { display: flex; align-items: center; gap: 20px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 24px; }
.profile-avatar-large { width: 72px; height: 72px; border-radius: 50%; background: var(--olive-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: var(--font-bold); flex-shrink: 0; overflow: hidden; }
.profile-avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-edit-wrap { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }
.avatar-buttons { display: flex; align-items: center; gap: 6px; }
.avatar-btn { font-size: var(--text-xs); padding: 6px 12px; cursor: pointer; }
.avatar-remove { width: 30px; height: 30px; border-radius: 6px; border: 1px solid var(--border-light); background: var(--bg-card); color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.avatar-remove:hover { color: var(--text-red); border-color: var(--text-red); }
.spin-icon { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.profile-header-info { flex: 1; }
.form-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 24px; }
.form-card-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.form-input:disabled { background: var(--bg-main); color: var(--text-secondary); }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; padding-top: 8px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 450px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
</style>
