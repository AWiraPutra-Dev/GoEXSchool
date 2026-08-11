<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()
const showModal = ref(false)
const selected = ref<any>(null)

function openGallery(g: any) { selected.value = g; showModal.value = true }
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Galeri Kegiatan</h1>
    <div class="gallery-grid">
      <div v-for="g in siswa.gallery" :key="g.id" class="gallery-card" @click="openGallery(g)">
        <div class="gallery-thumb" :style="{ background: g.color }">
          <Icon name="i-lucide-image" class="w-10 h-10 text-white/60" />
          <span class="gallery-count">{{ g.imageCount }} foto</span>
        </div>
        <div class="gallery-info">
          <h3 class="gallery-title">{{ g.title }}</h3>
          <p class="gallery-meta">{{ g.ekskul }} · {{ g.date }}</p>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal && selected" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" style="width:600px;">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[18px] font-bold" style="color:var(--text-primary);">{{ selected.title }}</h3>
            <button @click="showModal = false" style="background:none;border:none;cursor:pointer;font-size:20px;color:var(--text-muted);">✕</button>
          </div>
          <div class="gallery-preview-grid">
            <div v-for="(img, i) in selected.previews" :key="i" class="preview-photo" :style="{ background: selected.color + '40' }">
              <Icon name="i-lucide-image" class="w-6 h-6 text-white/40" />
            </div>
          </div>
          <p class="text-center text-[13px]" style="color:var(--text-muted);margin-top:16px;">{{ Math.min(selected.previews.length || selected.imageCount, selected.imageCount) }} dari {{ selected.imageCount }} foto</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.gallery-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
.gallery-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.gallery-thumb { height: 150px; display: flex; align-items: center; justify-content: center; position: relative; }
.gallery-count { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.5); color: white; font-size: var(--text-xs); padding: 2px 10px; border-radius: 10px; }
.gallery-info { padding: 12px 16px; }
.gallery-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.gallery-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; max-width: 90vw; }
.gallery-preview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.preview-photo { aspect-ratio: 4/3; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
</style>
