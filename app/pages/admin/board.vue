<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const store = useMasterDataStore()

onMounted(() => store.fetchAll())

const selectedEkskulId = ref('')

const selectedEkskul = computed(() => store.extracurriculars.find(e => e.id === selectedEkskulId.value))
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="page-title">{{ ui.t('menu.board') }}</h1>
      <p class="text-[13px]" style="color: var(--text-secondary);">
        Atur struktur organisasi setiap ekskul — kartu anggota atau desain gambar (Canva), lengkap dengan pilihan tema.
      </p>
    </div>

    <!-- Pilih ekskul -->
    <div class="ekskul-picker">
      <div class="picker-icon"><Icon name="i-lucide-shield" class="w-5 h-5" /></div>
      <div class="picker-field">
        <label>Ekskul</label>
        <select v-model="selectedEkskulId" class="ekskul-select">
          <option disabled value="">Pilih ekskul untuk dikelola...</option>
          <option v-for="e in store.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option>
        </select>
      </div>
      <div v-if="selectedEkskul" class="picker-meta">
        <span class="meta-chip"><Icon name="i-lucide-users" class="w-3.5 h-3.5" /> {{ selectedEkskul.members }} anggota</span>
        <span v-if="selectedEkskul.quota" class="meta-chip"><Icon name="i-lucide-user-plus" class="w-3.5 h-3.5" /> Kuota {{ selectedEkskul.quota }}</span>
      </div>
    </div>

    <div v-if="!store.extracurriculars.length" class="empty-state">
      <Icon name="i-lucide-shield-alert" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
      <p style="color: var(--text-muted);">Belum ada ekskul. Tambahkan ekskul di menu Ekstrakurikuler terlebih dahulu.</p>
    </div>

    <StructureManager v-else-if="selectedEkskulId" :ekskul-id="selectedEkskulId" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.ekskul-picker {
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 14px 16px;
}
.picker-icon {
  width: 40px; height: 40px; border-radius: 10px; background: var(--accent-soft); color: var(--accent);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.picker-field { display: flex; flex-direction: column; gap: 3px; min-width: 240px; }
.picker-field label { font-size: 11px; font-weight: var(--font-semibold); color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.4px; }
.ekskul-select {
  padding: 9px 12px; border: 1px solid var(--border-light); border-radius: 8px;
  font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--text-primary);
  background: var(--bg-main); outline: none; cursor: pointer; min-width: 260px;
}
.ekskul-select:focus { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-soft); }
.picker-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-left: auto; }
.meta-chip {
  display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 14px;
  background: var(--accent-soft); color: var(--accent); font-size: var(--text-xs); font-weight: var(--font-medium);
}
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
