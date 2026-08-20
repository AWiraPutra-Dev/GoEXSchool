<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const ui = useUiStore()
const { myEkskul, isScopedOperator } = useEkskulScope()
const { confirm } = useConfirm()
const showModal = ref(false)
const editMode = ref(false)
const saving = ref(false)
const activeTab = ref<'all' | 'published' | 'draft'>('all')

const form = reactive({
  id: '',
  title: '',
  content: '',
  excerpt: '',
  category: 'general',
  tags: '',
  status: 'draft' as 'draft' | 'published',
  coverImage: ''
})

// ---- Gambar sampul: upload dari perangkat ATAU URL (https) ----
const coverMode = ref<'upload' | 'url'>('url')
const uploading = ref(false)

// ---- Statistik pembaca ----
const showViews = ref(false)
const viewsLoading = ref(false)
const viewsData = ref<{ articleId: string; viewCount: number; viewers: any[] } | null>(null)

const categories = [
  { value: 'general', label: 'Umum' },
  { value: 'announcement', label: 'Pengumuman' },
  { value: 'achievement', label: 'Prestasi' },
  { value: 'event', label: 'Kegiatan' },
  { value: 'tip', label: 'Tips & Info' },
]

onMounted(() => op.fetchArticles())

const filteredArticles = computed(() => {
  if (activeTab.value === 'all') return op.articles
  return op.articles.filter((a: any) => a.status === activeTab.value)
})

const { page, paged, totalPages } = usePagination(() => filteredArticles.value)

// Paginasi daftar pembaca artikel (10 baris per halaman)
const viewerPage = ref(1)
const pagedViewers = computed(() => (viewsData.value?.viewers ?? []).slice((viewerPage.value - 1) * 10, viewerPage.value * 10))

// Artikel yang sedang dilihat isinya (klik kartu → modal baca)
const viewArticle = ref<any>(null)

function resetForm() {
  Object.assign(form, { id: '', title: '', content: '', excerpt: '', category: 'general', tags: '', status: 'draft', coverImage: '' })
  coverMode.value = 'url'
}

function openCreate() {
  editMode.value = false
  resetForm()
  showModal.value = true
}

function openEdit(article: any) {
  editMode.value = true
  Object.assign(form, {
    id: article.id,
    title: article.title,
    content: article.content || '',
    excerpt: article.excerpt || '',
    category: article.category || 'general',
    tags: article.tags || '',
    status: article.status,
    coverImage: article.coverImage || ''
  })
  coverMode.value = article.coverImage?.startsWith('/uploads') ? 'upload' : 'url'
  showModal.value = true
}

async function handleCoverUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) return
  const file = input.files[0]
  uploading.value = true
  try {
    const fd = new FormData()
    fd.append('file', file)
    const res = await $fetch<{ url: string }>('/api/operator/upload', { method: 'POST', body: fd })
    form.coverImage = res.url
  } catch (e: any) {
    alert(e.data?.message || 'Gagal upload gambar sampul.')
  } finally { uploading.value = false; input.value = '' }
}

function removeCover() {
  form.coverImage = ''
  coverMode.value = 'url'
}

async function save(status: 'draft' | 'published') {
  if (!form.title || !form.content) { alert('Judul dan konten wajib diisi.'); return }
  saving.value = true
  try {
    const data = {
      title: form.title,
      content: form.content,
      excerpt: form.excerpt,
      category: form.category,
      tags: form.tags,
      status,
      coverImage: form.coverImage
    }
    if (editMode.value) {
      await op.updateArticle(form.id, data)
    } else {
      await op.createArticle(data)
    }
    showModal.value = false
  } finally { saving.value = false }
}

async function removeArticle(article: any) {
  const ok = await confirm({
    title: `Hapus artikel "${article.title}"?`,
    message: 'Artikel beserta data pembaca akan dihapus permanen.',
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  await op.deleteArticle(article.id)
}

async function toggleStatus(article: any) {
  const newStatus = article.status === 'published' ? 'draft' : 'published'
  await op.updateArticle(article.id, { status: newStatus })
  article.status = newStatus
}

async function openViews(article: any) {
  showViews.value = true
  viewsLoading.value = true
  viewsData.value = null
  try {
    viewsData.value = await $fetch(`/api/operator/articles/${article.id}/views`)
  } catch {
    viewsData.value = { articleId: article.id, viewCount: 0, viewers: [] }
  } finally { viewsLoading.value = false }
}

const roleLabels: Record<string, string> = {
  student: 'Siswa',
  operator: 'Operator',
  admin: 'Admin',
  super_admin: 'Super Admin'
}

const categoryLabels: Record<string, string> = {
  general: 'Umum',
  announcement: 'Pengumuman',
  achievement: 'Prestasi',
  event: 'Kegiatan',
  tip: 'Tips & Info'
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">{{ ui.t('menu.blog') }}</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">{{ op.articles.length }} total artikel</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <Icon name="i-lucide-plus" class="w-4 h-4" /> Tulis Artikel
      </button>
    </div>

    <!-- Tab Filter -->
    <div class="tab-bar">
      <button v-for="tab in [['all', 'Semua'], ['published', 'Terbit'], ['draft', 'Draft']]" :key="tab[0]"
        class="tab-btn" :class="{ active: activeTab === tab[0] }" @click="activeTab = tab[0] as any">
        {{ tab[1] }}
        <span class="tab-count">{{ tab[0] === 'all' ? op.articles.length : op.articles.filter((a: any) => a.status === tab[0]).length }}</span>
      </button>
    </div>

    <!-- Article List -->
    <div class="article-list">
      <div v-for="article in paged" :key="article.id" class="article-card" title="Lihat artikel" @click="viewArticle = article">
        <div class="article-top">
          <div class="article-meta">
            <span v-if="article.ekskul" class="article-ekskul">
              <img v-if="article.ekskulLogo" :src="article.ekskulLogo" class="ekskul-logo-img" alt="" />
              <Icon v-else name="i-lucide-shield" class="w-3 h-3" />
              {{ article.ekskul }}
            </span>
            <span class="article-category">{{ categoryLabels[article.category] || article.category }}</span>
            <span class="article-status" :class="article.status === 'published' ? 'status-pub' : 'status-draft'">
              {{ article.status === 'published' ? 'Terbit' : 'Draft' }}
            </span>
          </div>
          <div class="article-actions" @click.stop>             <button class="action-btn" @click="openEdit(article)" title="Edit"><Icon name="i-lucide-pencil" class="w-4 h-4" /></button>
            <button class="action-btn danger" @click="removeArticle(article)" title="Hapus"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
          </div>
        </div>
        <h3 class="article-title"><TranslatedText :text="article.title" /></h3>
        <p class="article-excerpt" v-if="article.excerpt">{{ article.excerpt }}</p>
        <div class="article-footer" @click.stop>
          <span class="article-author">{{ article.author }}</span>
          <span class="article-date">{{ article.createdAt }}</span>
          <button class="btn-viewers" title="Lihat siapa saja yang membaca" @click="openViews(article)">
            <Icon name="i-lucide-eye" class="w-4 h-4" />
            {{ article.viewCount || 0 }} pembaca
          </button>
          <button class="btn-toggle-status" :class="article.status === 'published' ? 'btn-draft' : 'btn-publish'" @click="toggleStatus(article)">
            {{ article.status === 'published' ? 'Arsipkan' : 'Terbitkan' }}
          </button>
        </div>
      </div>
      <div v-if="!filteredArticles.length" class="empty-state">
        <Icon name="i-lucide-file-text" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
        <p style="color: var(--text-muted);">Belum ada artikel. Klik "Tulis Artikel" untuk membuat.</p>
      </div>
    </div>
    <PaginationBar v-model:page="page" :total="filteredArticles.length" />

    <!-- Modal: Tulis/Edit Artikel -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" style="width:700px;max-height:90vh;overflow-y:auto;">
          <h3 class="modal-title">{{ editMode ? 'Edit Artikel' : 'Tulis Artikel Baru' }}</h3>
          <form @submit.prevent="save('published')" class="space-y-3">
            <div v-if="isScopedOperator" class="scope-note">
              <Icon name="i-lucide-shield" class="w-4 h-4" />
              Artikel ini otomatis untuk ekskul <strong>{{ myEkskul?.name }}</strong>
            </div>
            <div class="form-row-2col">
              <div class="form-group">
                <label>Judul Artikel</label>
                <input v-model="form.title" class="form-input" required placeholder="Masukkan judul...">
              </div>
              <div class="form-group">
                <label>Kategori</label>
                <select v-model="form.category" class="form-input">
                  <option v-for="c in categories" :key="c.value" :value="c.value">{{ c.label }}</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>Konten</label>
              <textarea v-model="form.content" class="form-input text-editor" rows="10" required placeholder="Tulis konten artikel di sini... (HTML tags supported)"></textarea>
            </div>
            <div class="form-group">
              <label>Ringkasan (opsional)</label>
              <textarea v-model="form.excerpt" class="form-input" rows="2" placeholder="Ringkasan singkat artikel..."></textarea>
            </div>
            <div class="form-row-2col">
              <div class="form-group">
                <label>Tags (pisahkan dengan koma)</label>
                <input v-model="form.tags" class="form-input" placeholder="contoh: basket, latihan, kompetisi">
              </div>
              <div class="form-group">
                <label>Status</label>
                <select v-model="form.status" class="form-input">
                  <option value="draft">Draft</option>
                  <option value="published">Terbit</option>
                </select>
              </div>
            </div>

            <!-- Gambar Sampul: Upload dari perangkat ATAU URL -->
            <div class="form-group">
              <label>Gambar Sampul</label>
              <div class="cover-options">
                <button type="button" class="cover-option" :class="{ active: coverMode === 'upload' }" @click="coverMode = 'upload'">
                  <Icon name="i-lucide-upload" class="w-4 h-4" /> Upload dari perangkat
                </button>
                <button type="button" class="cover-option" :class="{ active: coverMode === 'url' }" @click="coverMode = 'url'">
                  <Icon name="i-lucide-link" class="w-4 h-4" /> URL gambar (https://)
                </button>
              </div>

              <div v-if="coverMode === 'upload'" class="cover-upload-area">
                <label class="file-upload-btn">
                  <Icon v-if="!uploading" name="i-lucide-image-plus" class="w-4 h-4" />
                  <Icon v-else name="i-lucide-loader-2" class="w-4 h-4 spin-icon" />
                  {{ uploading ? 'Mengupload...' : (form.coverImage ? 'Ganti Gambar' : 'Pilih Gambar dari Perangkat') }}
                  <input type="file" accept="image/*" hidden @change="handleCoverUpload">
                </label>
                <p class="cover-hint">Format JPG, PNG, GIF, atau WEBP. Maksimal 10MB.</p>
              </div>

              <div v-else>
                <input v-model="form.coverImage" class="form-input" placeholder="https://contoh.com/gambar-sampul.jpg">
              </div>

              <div v-if="form.coverImage" class="cover-preview-wrap">
                <img :src="form.coverImage" class="cover-preview" alt="Pratinjau sampul">
                <button type="button" class="cover-remove-btn" title="Hapus gambar" @click="removeCover">
                  <Icon name="i-lucide-x" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">Batal</button>
              <button type="button" class="btn-draft-save" :disabled="saving" @click="save('draft')">
                {{ saving ? 'Menyimpan...' : 'Simpan Draft' }}
              </button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Menyimpan...' : (editMode ? (form.status === 'draft' ? 'Terbitkan' : 'Simpan Perubahan') : 'Terbitkan') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Pembaca Artikel -->
    <Teleport to="body">
      <div v-if="showViews" class="modal-overlay" @click.self="showViews = false">
        <div class="modal-content" style="width:560px;">
          <div class="views-header">
            <h3 class="modal-title" style="margin-bottom:0;">Pembaca Artikel</h3>
            <button class="views-close" @click="showViews = false">
              <Icon name="i-lucide-x" class="w-4 h-4" />
            </button>
          </div>
          <p class="views-subtitle">
            <Icon name="i-lucide-eye" class="w-4 h-4" />
            Total <strong>{{ viewsData?.viewCount ?? 0 }}</strong> pembaca
          </p>

          <div v-if="viewsLoading" class="views-loading">
            <span class="spin-icon"><Icon name="i-lucide-loader-2" class="w-5 h-5" /></span>
            Memuat daftar pembaca...
          </div>

          <div v-else-if="viewsData?.viewers.length" class="views-list">
            <div v-for="v in pagedViewers" :key="v.id" class="viewer-row">
              <div class="viewer-avatar">{{ v.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) }}</div>
              <div class="viewer-info">
                <div class="viewer-name">{{ v.name }}</div>
                <div class="viewer-meta">
                  <span class="viewer-role">{{ roleLabels[v.role] || v.role }}</span>
                  <span class="viewer-time">Terakhir dibaca {{ v.viewedAt }}</span>
                </div>
              </div>
            </div>
            <PaginationBar v-model:page="viewerPage" :total="viewsData?.viewers.length ?? 0" />
          </div>

          <div v-else class="views-empty">
            <Icon name="i-lucide-eye-off" class="w-8 h-8 mb-2" style="color: var(--text-muted);" />
            <p style="color: var(--text-muted); font-size: var(--text-sm);">Belum ada yang membaca artikel ini.</p>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal: Baca artikel -->
    <ArticleViewer v-if="viewArticle" :article="viewArticle" @close="viewArticle = null" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.btn-draft-save { background: white; color: var(--orange); font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--orange); cursor: pointer; transition: all 0.2s; }
.btn-draft-save:hover:not(:disabled) { background: rgba(212,192,137,0.15); }
.btn-draft-save:disabled { opacity: 0.6; cursor: not-allowed; }

.tab-bar { display: flex; gap: 0; border-bottom: 1px solid var(--border-light); }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-muted); background: none; border: none; cursor: pointer; transition: all 0.15s; border-bottom: 2px solid transparent; }
.tab-btn.active { color: var(--text-primary); border-bottom-color: var(--text-primary); }
.tab-btn:not(.active):hover { color: var(--text-secondary); }
.tab-count { font-size: 11px; color: var(--text-muted); font-weight: var(--font-normal); }

.article-list { display: flex; flex-direction: column; gap: 12px; }
.article-card { background: var(--bg-card); border: 1px solid var(--border-light); padding: 16px 20px; transition: all 0.15s; cursor: pointer; }
.article-card:hover { border-color: var(--border-medium); }
.article-card:hover .article-title { color: var(--olive-primary); }
.article-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.article-meta { display: flex; gap: 8px; flex-wrap: wrap; }
.article-ekskul { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-secondary); font-weight: var(--font-medium); }
.ekskul-logo-img { width: 16px; height: 16px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.article-category { font-size: 12px; color: var(--text-secondary); }
.scope-note { display: flex; align-items: center; gap: 8px; padding: 10px 14px; font-size: var(--text-sm); color: var(--text-secondary); }
.article-status { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-secondary); }
.article-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.status-pub::before { background: var(--teal); }
.status-draft::before { background: var(--orange); }
.article-actions { display: flex; gap: 4px; }
.action-btn { background: none; border: none; cursor: pointer; padding: 2px 6px; border-radius: 4px; font-size: 14px; transition: background 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.action-btn:hover { background: var(--bg-hover); }
.action-btn.danger { color: var(--red-orange); }
.action-btn.danger:hover { background: rgba(220,38,38,0.1); }
.article-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 4px; }
.article-excerpt { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: 8px; }
.article-footer { display: flex; align-items: center; gap: 12px; font-size: var(--text-xs); color: var(--text-muted); padding-top: 12px; border-top: 1px solid var(--border-light); flex-wrap: wrap; }
.article-author { font-weight: var(--font-medium); color: var(--text-secondary); }
.btn-viewers { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--text-muted); cursor: pointer; background: none; border: none; padding: 0; font-family: var(--font-family); }
.btn-viewers:hover { color: var(--text-secondary); }
.btn-toggle-status { font-size: 11px; color: var(--text-muted); cursor: pointer; font-family: var(--font-family); margin-left: auto; background: none; border: none; padding: 0; text-decoration: underline; }
.btn-toggle-status:hover { color: var(--text-primary); }

/* Gambar sampul */
.cover-options { display: flex; gap: 8px; margin-bottom: 8px; }
.cover-option { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 6px; border: 1px solid var(--border-light); background: white; font-size: var(--text-xs); font-weight: var(--font-medium); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.cover-option.active { border-color: var(--olive-primary); color: var(--olive-primary); background: var(--olive-bg); font-weight: var(--font-semibold); }
.cover-upload-area { display: flex; flex-direction: column; gap: 4px; }
.file-upload-btn { display: inline-flex; align-items: center; gap: 6px; padding: 10px 16px; border-radius: 6px; border: 1px dashed var(--olive-primary); background: var(--olive-bg); color: var(--olive-primary); font-size: var(--text-sm); font-weight: var(--font-medium); cursor: pointer; transition: all 0.2s; width: fit-content; }
.file-upload-btn:hover { background: rgba(139,148,103,0.15); }
.cover-hint { font-size: 11px; color: var(--text-muted); }
.cover-preview-wrap { position: relative; display: inline-block; margin-top: 8px; }
.cover-preview { max-height: 140px; border-radius: 8px; border: 1px solid var(--border-light); display: block; }
.cover-remove-btn { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border-radius: 50%; border: none; background: rgba(0,0,0,0.55); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.cover-remove-btn:hover { background: var(--red-orange); }

/* Modal pembaca */
.views-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.views-close { width: 28px; height: 28px; border-radius: 6px; border: none; background: var(--bg-hover); color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.views-close:hover { background: rgba(212,106,90,0.12); color: var(--red-orange); }
.views-subtitle { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: 16px; }
.views-list { display: flex; flex-direction: column; max-height: 380px; overflow-y: auto; }
.viewer-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid var(--border-light); }
.viewer-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--olive-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: var(--font-bold); flex-shrink: 0; }
.viewer-info { flex: 1; min-width: 0; }
.viewer-name { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.viewer-meta { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--text-muted); margin-top: 2px; }
.viewer-role { color: var(--text-muted); }
.views-loading { display: flex; align-items: center; gap: 8px; padding: 32px; justify-content: center; color: var(--text-muted); font-size: var(--text-sm); }
.views-empty { display: flex; flex-direction: column; align-items: center; padding: 40px; }
.spin-icon { display: inline-flex; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.text-editor { font-family: 'Courier New', monospace; font-size: 13px; line-height: 1.6; resize: vertical; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 16px; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
