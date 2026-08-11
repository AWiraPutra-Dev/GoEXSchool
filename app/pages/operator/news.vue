<script setup lang="ts">
import type { NewsItem } from '~/stores/operator-data'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const op = useOperatorDataStore()
const showModal = ref(false)
const editMode = ref(false)
const form = reactive({ id: 0, title: '', content: '', isPublic: false, ekskul: 'Basket', author: '' })

function openAdd() { editMode.value = false; Object.assign(form, { id: 0, title: '', content: '', isPublic: false, ekskul: 'Basket', author: '' }); showModal.value = true }
function openEdit(n: NewsItem) { editMode.value = true; Object.assign(form, n); showModal.value = true }
function save() {
  if (editMode.value) op.updateNews(form.id, { title: form.title, content: form.content, isPublic: form.isPublic, ekskul: form.ekskul, author: form.author })
  else op.addNews({ title: form.title, content: form.content, isPublic: form.isPublic, ekskul: form.ekskul, author: form.author, date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) })
  showModal.value = false
}
function removeNews(id: number) { if (confirm('Hapus berita ini?')) op.deleteNews(id) }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">Pengumuman & Berita</h1>
      <button class="btn-primary" @click="openAdd"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tulis Berita</button>
    </div>
    <div class="news-list">
      <div v-for="n in op.news" :key="n.id" class="news-card">
        <div class="news-top">
          <div class="news-meta">
            <span class="news-ekskul">{{ n.ekskul }}</span>
            <span class="news-badge" :class="n.isPublic ? 'badge-public' : 'badge-internal'">{{ n.isPublic ? 'Publik' : 'Internal' }}</span>
          </div>
          <div class="news-actions">
            <button @click="openEdit(n)" title="Edit" style="background:none;border:none;cursor:pointer;">✏️</button>
            <button @click="removeNews(n.id)" title="Hapus" style="background:none;border:none;cursor:pointer;color:var(--text-red);">🗑️</button>
          </div>
        </div>
        <h3 class="news-title">{{ n.title }}</h3>
        <p class="news-content">{{ n.content }}</p>
        <div class="news-footer"><span>{{ n.author }}</span><span>{{ n.date }}</span></div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">{{ editMode ? 'Edit Berita' : 'Tulis Berita Baru' }}</h3>
          <form @submit.prevent="save" class="space-y-3">
            <div class="form-row">
              <div class="form-group"><label>Judul</label><input v-model="form.title" class="form-input" required></div>
              <div class="form-group"><label>Ekskul</label><select v-model="form.ekskul" class="form-input"><option>Basket</option><option>Paduan Suara</option><option>Robotik</option><option>Pramuka</option><option>KIR</option><option>Seni Tari</option><option>Futsal</option><option>English Club</option></select></div>
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
.news-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 16px 20px; }
.news-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.news-meta { display: flex; align-items: center; gap: 8px; }
.news-ekskul { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; background: rgba(139,148,103,0.15); color: var(--olive-primary); font-weight: var(--font-medium); }
.news-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; font-weight: var(--font-medium); }
.badge-public { background: rgba(74,158,158,0.15); color: var(--teal); }
.badge-internal { background: rgba(212,192,137,0.2); color: var(--orange); }
.news-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.news-content { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); }
.news-footer { display: flex; justify-content: space-between; font-size: var(--text-xs); color: var(--text-muted); margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-light); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 500px; max-width: 90vw; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
</style>
