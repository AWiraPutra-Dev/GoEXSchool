<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const siswa = useSiswaDataStore()
const selectedEkskul = ref('all')
const expandedContent = ref<string | null>(null)

onMounted(() => siswa.fetchMaterials())

const ekskulList = computed(() => {
  const ekskuls = [...new Set(siswa.materials.map((m: any) => m.ekskul))]
  return ['all', ...ekskuls]
})

const filteredMaterials = computed(() => {
  if (selectedEkskul.value === 'all') return siswa.materials
  return siswa.materials.filter((m: any) => m.ekskul === selectedEkskul.value)
})

const { page, paged, totalPages } = usePagination(() => filteredMaterials.value)

const fileTypeIcons: Record<string, string> = {
  pdf: 'i-lucide-file-text',
  image: 'i-lucide-image',
  video: 'i-lucide-video',
  document: 'i-lucide-file',
  link: 'i-lucide-link',
  text: 'i-lucide-file-text',
}

const fileTypeColors: Record<string, string> = {
  pdf: 'var(--red-orange)',
  image: 'var(--teal)',
  video: 'var(--orange)',
  document: 'var(--olive-primary)',
  link: 'var(--teal-mid)',
  text: 'var(--green-soft)',
}

function toggleContent(id: string) {
  expandedContent.value = expandedContent.value === id ? null : id
}
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="page-title">{{ ui.t('menu.materials') }}</h1>
      <p class="text-[13px]" style="color: var(--text-secondary);">Materi dari ekstrakurikuler yang kamu ikuti</p>
    </div>

    <!-- Ekskul Filter -->
    <div class="filter-chips">
      <button v-for="ekskul in ekskulList" :key="ekskul"
        class="chip" :class="{ active: selectedEkskul === ekskul }"
        @click="selectedEkskul = ekskul">
        {{ ekskul === 'all' ? 'Semua' : ekskul }}
      </button>
    </div>

    <!-- Materials List -->
    <div class="materials-list">
      <div v-for="m in paged" :key="m.id" class="material-card" @click="toggleContent(m.id)">
        <div class="material-main">
          <div class="material-icon" :style="{ background: fileTypeColors[m.fileType || 'link'] + '20', color: fileTypeColors[m.fileType || 'link'] }">
            <Icon :name="fileTypeIcons[m.fileType || 'link'] || 'i-lucide-file'" class="w-6 h-6" />
          </div>
          <div class="material-info">
            <h3 class="material-title">{{ m.title }}</h3>
            <p class="material-desc" v-if="m.description">{{ m.description }}</p>
            <div class="material-meta">
              <span class="material-ekskul">{{ m.ekskul }}</span>
              <span> · {{ m.uploadedBy }} · {{ m.createdAt }}</span>
            </div>
          </div>
          <div class="material-actions" @click.stop>
            <a v-if="m.fileUrl" :href="m.fileUrl" target="_blank" class="material-download-btn" title="Buka/Downlad">
              <Icon name="i-lucide-download" class="w-4 h-4" />
              <span class="text-[11px]">Buka</span>
            </a>
            <button v-if="m.content" class="material-expand-btn" :class="{ expanded: expandedContent === m.id }">
              <Icon :name="expandedContent === m.id ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div v-if="m.content && expandedContent === m.id" class="material-content-preview">
          <div class="content-text">{{ m.content }}</div>
        </div>
      </div>
    </div>

    <div v-if="!filteredMaterials.length" class="empty-state">
      <Icon name="i-lucide-folder-open" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
      <p style="color: var(--text-muted);">Belum ada materi dari ekskul yang kamu ikuti.</p>
    </div>

    <PaginationBar v-model:page="page" :total="filteredMaterials.length" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.filter-chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border-light); background: white; font-size: var(--text-sm); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
.chip.active { background: var(--olive-primary); color: white; border-color: var(--olive-primary); }
.chip:not(.active):hover { background: var(--bg-hover); }

.materials-list { display: flex; flex-direction: column; gap: 8px; }
.material-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; cursor: pointer; transition: all 0.2s; }
.material-card:hover { border-color: var(--olive-light); box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.material-main { display: flex; align-items: center; gap: 16px; padding: 16px 20px; }
.material-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.material-info { flex: 1; min-width: 0; }
.material-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); }
.material-desc { font-size: var(--text-sm); color: var(--text-secondary); margin-top: 2px; }
.material-meta { font-size: var(--text-xs); color: var(--text-muted); margin-top: 4px; }
.material-ekskul { font-weight: var(--font-medium); color: var(--olive-primary); }
.material-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.material-download-btn { display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 6px; background: var(--olive-bg); color: var(--olive-primary); text-decoration: none; font-weight: var(--font-medium); transition: all 0.2s; }
.material-download-btn:hover { background: var(--olive-primary); color: white; }
.material-expand-btn { width: 32px; height: 32px; border-radius: 6px; background: none; border: 1px solid var(--border-light); cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: all 0.2s; }
.material-expand-btn:hover { background: var(--bg-hover); }
.material-expand-btn.expanded { background: var(--olive-bg); color: var(--olive-primary); border-color: var(--olive-primary); }
.material-content-preview { padding: 0 20px 16px; }
.content-text { font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.7; white-space: pre-wrap; background: var(--bg-main); padding: 16px; border-radius: 8px; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
