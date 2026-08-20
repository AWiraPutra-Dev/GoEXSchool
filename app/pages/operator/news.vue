<script setup lang="ts">
import type { NewsItem } from '~/stores/operator-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const ui = useUiStore()
const admin = useMasterDataStore()
const { myEkskul, isOperator, isScopedOperator } = useEkskulScope()
const { confirm } = useConfirm()
const showModal = ref(false)
const editMode = ref(false)
const form = reactive({ id: '', title: '', content: '', isPublic: false, extracurricularId: '', author: '' })

onMounted(() => { op.fetchAll(); admin.fetchReference() })

const { page, paged, totalPages } = usePagination(() => op.news)

// Status tampil di Event Board siswa
const displayLabels: Record<string, string> = {
  none: 'Belum diajukan',
  pending: 'Menunggu persetujuan admin',
  approved: 'Tampil di Event Board',
  rejected: 'Ditolak admin',
}
const displayClass: Record<string, string> = {
  none: 'disp-none',
  pending: 'disp-pending',
  approved: 'disp-approved',
  rejected: 'disp-rejected',
}

function openAdd() {
  editMode.value = false; Object.assign(form, { id: '', title: '', content: '', isPublic: false, extracurricularId: '', author: '' })
  // Operator ekskul: berita otomatis untuk ekskul miliknya
  if (isScopedOperator.value && myEkskul.value) form.extracurricularId = myEkskul.value.id
  showModal.value = true
}
function openEdit(n: NewsItem) { editMode.value = true; Object.assign(form, n); showModal.value = true }
function save() {
  if (editMode.value) op.updateNews(form.id, { title: form.title, content: form.content, isPublic: form.isPublic, extracurricularId: form.extracurricularId, author: form.author })
  else op.addNews({ title: form.title, content: form.content, isPublic: form.isPublic, extracurricularId: form.extracurricularId, author: form.author })
  showModal.value = false
}
async function removeNews(n: NewsItem) {
  const ok = await confirm({
    title: `Hapus berita "${n.title}"?`,
    message: 'Berita ini akan dihapus permanen.',
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  op.deleteNews(n.id)
}

async function requestDisplay(n: NewsItem) {
  const ok = await confirm({
    title: 'Ajukan tampil di Event Board?',
    message: 'Berita akan dikirim ke admin untuk disetujui. Setelah disetujui, berita tampil berjalan di dashboard siswa.',
    confirmText: 'Ya, Ajukan',
  })
  if (!ok) return
  await op.requestNewsDisplay(n.id)
}

async function withdrawDisplay(n: NewsItem) {
  const ok = await confirm({
    title: 'Tarik pengajuan tampil?',
    message: 'Berita tidak lagi menunggu persetujuan admin untuk tampil di Event Board.',
    confirmText: 'Ya, Tarik',
  })
  if (!ok) return
  await op.withdrawNewsDisplay(n.id)
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.news') }}</h1>
      <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tulis Berita</button>
    </div>
    <div class="news-list">
      <div v-for="n in paged" :key="n.id" class="news-card">
        <div class="news-top">
          <div class="news-meta">
            <span class="news-ekskul">
              <img v-if="n.ekskulLogo" :src="n.ekskulLogo" class="ekskul-logo-img" alt="" />
              {{ n.ekskul }}
            </span>
            <span class="scope-dot" :class="n.isPublic ? 'public' : 'internal'">{{ n.isPublic ? 'Publik' : 'Internal' }}</span>
            <span v-if="n.displayStatus && n.displayStatus !== 'none'" class="news-badge" :class="displayClass[n.displayStatus] || 'disp-none'">
              <Icon v-if="n.displayStatus === 'pending'" name="i-lucide-clock" class="w-3 h-3" />
              <Icon v-else-if="n.displayStatus === 'approved'" name="i-lucide-check-circle" class="w-3 h-3" />
              <Icon v-else-if="n.displayStatus === 'rejected'" name="i-lucide-x-circle" class="w-3 h-3" />
              {{ displayLabels[n.displayStatus] }}
            </span>
          </div>
          <div class="news-actions">
            <button class="action-btn" @click="openEdit(n)" title="Edit"><Icon name="i-lucide-pencil" class="w-4 h-4" /></button>
            <button class="action-btn danger" @click="removeNews(n)" title="Hapus"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
          </div>
        </div>
        <div v-if="n.coverImage" class="news-cover-wrap">
          <img :src="n.coverImage" :alt="n.title" class="news-cover-img" loading="lazy" />
        </div>
        <h3 class="news-title"><TranslatedText :text="n.title" /></h3>
            <p class="news-content"><TranslatedText :text="n.content" strip-html /></p>
        <div class="news-footer">
          <span class="news-uploader"><Icon name="i-lucide-user" class="w-3 h-3" /> {{ n.author }}</span>
          <div class="news-footer-right">
            <button v-if="n.displayStatus === 'none' || n.displayStatus === 'rejected'" class="btn-request" @click="requestDisplay(n)">
              <Icon name="i-lucide-megaphone" class="w-3.5 h-3.5" /> Ajukan Tampil
            </button>
            <button v-else-if="n.displayStatus === 'pending'" class="btn-withdraw" @click="withdrawDisplay(n)">
              <Icon name="i-lucide-undo-2" class="w-3.5 h-3.5" /> Tarik Pengajuan
            </button>
            <span v-else-if="n.displayStatus === 'approved'" class="disp-inline-approved">
              <Icon name="i-lucide-megaphone" class="w-3.5 h-3.5" /> Sedang tampil
            </span>
            <span>{{ n.date }}</span>
          </div>
        </div>
      </div>
    </div>
    <PaginationBar v-model:page="page" :total="op.news.length" />

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">{{ editMode ? 'Edit Berita' : 'Tulis Berita Baru' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-row">
              <div class="form-group"><label>Judul</label><input v-model="form.title" class="form-input" required></div>
              <div class="form-group">
                <label>Ekskul</label>
                <select v-if="!isOperator" v-model="form.extracurricularId" class="form-input" required><option disabled value="">Pilih Ekskul</option><option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option></select>
                <div v-else-if="myEkskul" class="scope-badge"><Icon name="i-lucide-shield" class="w-4 h-4" /> {{ myEkskul.name }}</div>
                <div v-else class="scope-warning"><Icon name="i-lucide-alert-circle" class="w-4 h-4" /> Akun belum diikat ke ekskul. Hubungi admin.</div>
              </div>
            </div>
            <div class="form-group"><label>Konten</label><textarea v-model="form.content" class="form-input" rows="4" required></textarea></div>
            <div class="form-row">
              <div class="form-group"><label>Penulis</label><input v-model="form.author" class="form-input" required></div>
              <div class="form-group d-flex items-center gap-2"><label><input type="checkbox" v-model="form.isPublic" style="margin-right:6px;">Publik</label></div>
            </div>
            <div class="modal-actions"><button type="button" class="btn-cancel" @click="showModal = false">Batal</button><button type="submit" class="btn-primary">{{ editMode ? 'Simpan' : 'Terbitkan' }}</button></div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.news-list { display: flex; flex-direction: column; gap: 12px; }
.news-card { background: var(--bg-card); border: 1px solid var(--border-light); padding: 14px 16px; }
.news-cover-wrap { width: 100%; max-height: 140px; overflow: hidden; margin-bottom: 10px; background: var(--bg-main); }
.news-cover-img { width: 100%; height: 140px; object-fit: cover; display: block; }
.news-uploader { display: inline-flex; align-items: center; gap: 5px; }
.news-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.news-meta { display: flex; align-items: center; gap: 8px; }
.news-ekskul { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-sm); color: var(--text-secondary); }
.ekskul-logo-img { width: 16px; height: 16px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.news-badge { font-size: var(--text-sm); font-weight: var(--font-medium); display: inline-flex; align-items: center; gap: 5px; color: var(--text-secondary); }
.news-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.disp-none { color: var(--text-muted); }
.disp-pending { color: var(--orange); }
.disp-pending::before { background: var(--orange); }
.disp-approved { color: var(--teal); }
.disp-approved::before { background: var(--teal); }
.disp-rejected { color: var(--red-orange); }
.disp-rejected::before { background: var(--red-orange); }
.news-footer-right { display: flex; align-items: center; gap: 10px; }
.btn-request { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-muted); font-weight: var(--font-medium); cursor: pointer; font-family: var(--font-family); background: none; border: none; padding: 0; }
.btn-request:hover { color: var(--text-primary); text-decoration: underline; }
.btn-withdraw { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-muted); font-weight: var(--font-medium); cursor: pointer; font-family: var(--font-family); background: none; border: none; padding: 0; }
.btn-withdraw:hover { color: var(--text-primary); text-decoration: underline; }
.disp-inline-approved { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-muted); font-weight: var(--font-medium); }
.news-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.news-content { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); }
.news-footer { display: flex; justify-content: space-between; font-size: var(--text-xs); color: var(--text-muted); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-light); }
.news-actions { display: flex; gap: 2px; }
.action-btn { background: none; border: none; cursor: pointer; padding: 4px 6px; border-radius: 4px; font-size: 14px; display: inline-flex; align-items: center; justify-content: center; transition: background 0.2s; }
.action-btn:hover { background: var(--bg-hover); }
.action-btn.danger { color: var(--red-orange); }
.action-btn.danger:hover { background: rgba(220,38,38,0.1); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.scope-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-secondary); }
.scope-warning { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--red-orange); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
</style>
