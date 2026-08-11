<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
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

function openCreate() {
  editMode.value = false
  Object.assign(form, { id: '', title: '', content: '', excerpt: '', category: 'general', tags: '', status: 'draft', coverImage: '' })
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
  showModal.value = true
}

async function save() {
  if (!form.title || !form.content) { alert('Judul dan konten wajib diisi.'); return }
  saving.value = true
  try {
    if (editMode.value) {
      await op.updateArticle(form.id, {
        title: form.title,
        content: form.content,
        excerpt: form.excerpt,
        category: form.category,
        tags: form.tags,
        status: form.status,
        coverImage: form.coverImage
      })
    } else {
      await op.createArticle({
        title: form.title,
        content: form.content,
        excerpt: form.excerpt,
        category: form.category,
        tags: form.tags,
        status: form.status,
        coverImage: form.coverImage
      })
    }
    showModal.value = false
  } finally { saving.value = false }
}

async function removeArticle(id: string) {
  if (confirm('Hapus artikel ini?')) await op.deleteArticle(id)
}

async function toggleStatus(article: any) {
  const newStatus = article.status === 'published' ? 'draft' : 'published'
  await op.updateArticle(article.id, { status: newStatus })
  article.status = newStatus
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
        <h1 class="page-title">Blog & Artikel</h1>
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
      <div v-for="article in filteredArticles" :key="article.id" class="article-card">
        <div class="article-top">
          <div class="article-meta">
            <span class="article-category">{{ categoryLabels[article.category] || article.category }}</span>
            <span class="article-status" :class="article.status === 'published' ? 'status-pub' : 'status-draft'">
              {{ article.status === 'published' ? 'Terbit' : 'Draft' }}
            </span>
          </div>
          <div class="article-actions">
            <button class="action-btn" @click="openEdit(article)" title="Edit">✏️</button>
            <button class="action-btn" @click="removeArticle(article.id)" title="Hapus" style="color: var(--text-red);">🗑️</button>
          </div>
        </div>
        <h3 class="article-title">{{ article.title }}</h3>
        <p class="article-excerpt" v-if="article.excerpt">{{ article.excerpt }}</p>
        <div class="article-footer">
          <span class="article-author">{{ article.author }}</span>
          <span class="article-date">{{ article.createdAt }}</span>
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

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" style="width:700px;max-height:90vh;overflow-y:auto;">
          <h3 class="modal-title">{{ editMode ? 'Edit Artikel' : 'Tulis Artikel Baru' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
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
                  <option value="published">Terbitkan</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label>URL Gambar Sampul (opsional)</label>
              <input v-model="form.coverImage" class="form-input" placeholder="https://...">
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="showModal = false">Batal</button>
              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Menyimpan...' : (editMode ? 'Simpan' : 'Terbitkan') }}
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
.btn-primary:disabled { opacity: 0.6; }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }

.tab-bar { display: flex; gap: 4px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); padding: 4px; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-secondary); background: none; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.tab-btn.active { background: var(--olive-primary); color: white; }
.tab-btn:not(.active):hover { background: var(--bg-hover); }
.tab-count { font-size: 10px; background: rgba(0,0,0,0.1); padding: 1px 6px; border-radius: 8px; }
.tab-btn.active .tab-count { background: rgba(255,255,255,0.2); }

.article-list { display: flex; flex-direction: column; gap: 12px; }
.article-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px 20px; transition: all 0.2s; }
.article-card:hover { border-color: var(--olive-light); }
.article-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.article-meta { display: flex; gap: 8px; }
.article-category { font-size: 10px; padding: 2px 8px; border-radius: 6px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.article-status { font-size: 10px; padding: 2px 8px; border-radius: 6px; font-weight: var(--font-medium); }
.status-pub { background: rgba(74,158,158,0.15); color: var(--teal); }
.status-draft { background: rgba(212,192,137,0.2); color: var(--orange); }
.article-actions { display: flex; gap: 4px; }
.action-btn { background: none; border: none; cursor: pointer; padding: 2px 6px; border-radius: 4px; font-size: 14px; transition: background 0.2s; }
.action-btn:hover { background: var(--bg-hover); }
.article-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 4px; }
.article-excerpt { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: 8px; }
.article-footer { display: flex; align-items: center; gap: 12px; font-size: var(--text-xs); color: var(--text-muted); padding-top: 12px; border-top: 1px solid var(--border-light); }
.article-author { font-weight: var(--font-medium); color: var(--text-secondary); }
.btn-toggle-status { font-size: 11px; padding: 4px 12px; border-radius: 6px; border: 1px solid; cursor: pointer; font-family: var(--font-family); margin-left: auto; }
.btn-publish { background: rgba(74,158,158,0.1); color: var(--teal); border-color: var(--teal); }
.btn-publish:hover { background: rgba(74,158,158,0.2); }
.btn-draft { background: rgba(212,106,90,0.1); color: var(--red-orange); border-color: var(--red-orange); }
.btn-draft:hover { background: rgba(212,106,90,0.2); }

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
