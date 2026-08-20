<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const op = useOperatorDataStore()
onMounted(() => op.fetchAll())
const search = ref('')
const filteredGallery = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return op.gallery
  return op.gallery.filter((g: any) =>
    (g.title || '').toLowerCase().includes(q) ||
    (g.ekskul || '').toLowerCase().includes(q)
  )
})
const { page, paged, totalPages } = usePagination(() => filteredGallery.value)
const showModal = ref(false)
const selected = ref<any>(null)

function openGallery(g: any) { selected.value = g; showModal.value = true }
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">{{ ui.t('menu.gallery') }}</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">{{ op.gallery.length }} album foto</p>

    <div class="table-toolbar">
      <input v-model="search" type="text" placeholder="Cari judul album atau ekskul..." class="search-input">
    </div>

    <div class="gallery-grid">
      <div v-for="g in paged" :key="g.id" class="gallery-card" @click="openGallery(g)">
        <div class="gallery-thumb" :style="{ background: g.color }">
          <img v-if="g.images?.[0]" :src="g.images[0].url" :alt="g.title" class="gallery-thumb-img" loading="lazy" />
          <Icon v-else name="i-lucide-image" class="w-10 h-10 text-white/60" />
          <span class="gallery-count">{{ g.imageCount }} foto</span>
        </div>
        <div class="gallery-info">
          <h3 class="gallery-title">{{ g.title }}</h3>
          <p class="gallery-meta">
            <span v-if="g.ekskulLogo" class="ekskul-logo-chip">
              <img :src="g.ekskulLogo" class="ekskul-logo-img" alt="" />
              {{ g.ekskul }}
            </span>
            <span v-else>{{ g.ekskul }}</span>
            · {{ g.date }}
          </p>
          <p class="gallery-uploader" v-if="g.author"><Icon name="i-lucide-user" class="w-3 h-3" /> Diunggah oleh {{ g.author }}</p>
        </div>
      </div>
    </div>
    <PaginationBar v-model:page="page" :total="filteredGallery.length" />

    <Teleport to="body">
      <div v-if="showModal && selected" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" style="width:600px;">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[18px] font-bold" style="color:var(--text-primary);">{{ selected.title }}</h3>
            <button @click="showModal = false" style="background:none;border:none;cursor:pointer;color:var(--text-muted);display:inline-flex;align-items:center;"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>
          <div class="gallery-preview-grid">
            <div v-for="(img, i) in selected.images" :key="i" class="preview-photo" :style="{ background: selected.color + '40' }">
              <img v-if="img" :src="img.url" :alt="selected.title" class="preview-img" loading="lazy" />
              <Icon v-else name="i-lucide-image" class="w-6 h-6 text-white/40" />
            </div>
          </div>
          <p class="text-center text-[13px]" style="color:var(--text-muted);margin-top:16px;">{{ Math.min(selected.images?.length || 0, selected.imageCount) }} dari {{ selected.imageCount }} foto</p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.table-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; }
.search-input { border: 1px solid var(--border-light); border-radius: 6px; padding: 8px 12px; font-size: var(--text-sm); width: 280px; color: var(--text-primary); background: var(--bg-card); }
.search-input:focus { outline: none; border-color: var(--olive-primary); box-shadow: 0 0 0 2px rgba(139,148,103,0.15); }
.gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.gallery-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
.gallery-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.gallery-thumb { height: 150px; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.gallery-thumb-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.3s; }
.gallery-card:hover .gallery-thumb-img { transform: scale(1.05); }
.gallery-count { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.5); color: white; font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; }
.gallery-info { padding: 12px 16px; }
.gallery-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); }
.gallery-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.gallery-uploader { display: inline-flex; align-items: center; gap: 4px; font-size: var(--text-xs); color: var(--text-secondary); margin-top: 6px; }
.ekskul-logo-chip { display: inline-flex; align-items: center; gap: 4px; }
.ekskul-logo-img { width: 18px; height: 18px; border-radius: 50%; object-fit: contain; background: white; border: 1px solid var(--border-light); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; max-width: 90vw; }
.gallery-preview-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.preview-photo { aspect-ratio: 4/3; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.preview-img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 8px; }
</style>
