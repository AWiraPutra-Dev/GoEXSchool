<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const auth = useAuthStore()
const siswa = useSiswaDataStore()
onMounted(() => siswa.fetchBoard())

const selectedEkskulId = ref('')

// Semua ekskul yang punya isi struktur (endpoint sudah menyaring)
const ekskulOptions = computed(() => siswa.board)

const current = computed(() => ekskulOptions.value.find(e => e.id === selectedEkskulId.value) ?? null)

// Otomatis pilih ekskul pertama saat data dimuat
watch(() => siswa.board, (list) => {
  if (!selectedEkskulId.value && list[0]) {
    selectedEkskulId.value = list[0].id
  }
}, { immediate: true })

// ---- Hak kelola: hanya admin/super_admin, atau operator pemilik ekskul ini ----
const canManage = computed(() => {
  const role = auth.user?.role
  if (role === 'admin' || role === 'super_admin') return true
  if (role === 'operator') {
    return !!auth.myEkskul && auth.myEkskul.id === current.value?.id
  }
  return false
})

const showManager = ref(false)
function onManagerSaved() {
  siswa.fetchBoard(true)
  showManager.value = false
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between gap-3 flex-wrap">
      <div>
        <h1 class="page-title">{{ ui.t('menu.board') }}</h1>
        <p class="text-[13px]" style="color: var(--text-secondary);">Struktur organisasi semua ekskul di sekolah</p>
      </div>
      <button v-if="canManage && current" class="manage-btn" @click="showManager = true">
        <Icon name="i-lucide-settings-2" class="w-4 h-4" /> Kelola Struktur
      </button>
    </div>

    <!-- Pilih ekskul: deretan ala story IG -->
    <div v-if="ekskulOptions.length" class="ekskul-nav">
      <button
        v-for="e in ekskulOptions" :key="e.id"
        class="ekskul-chip" :class="{ active: selectedEkskulId === e.id }"
        @click="selectedEkskulId = e.id"
      >
        <span class="chip-avatar">
          <img v-if="e.ekskulLogo" :src="e.ekskulLogo" alt="" />
          <Icon v-else name="i-lucide-shield" class="w-5 h-5" />
        </span>
        <span class="chip-name">{{ e.ekskul }}</span>
      </button>
    </div>

    <!-- Struktur terpilih: komponen tampilan IG feed (grid 4 kolom, warna ikut instansi) -->
    <StructureDisplay :ekskul="current" />

    <div v-if="!ekskulOptions.length" class="empty-state">
      <Icon name="i-lucide-shield" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
      <p style="color: var(--text-muted);">Belum ada struktur ekskul yang ditambahkan.</p>
    </div>

    <!-- Modal kelola struktur (admin / operator / berprivilege) -->
    <Teleport to="body">
      <div v-if="showManager && current" class="modal-overlay" @click.self="showManager = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Kelola Struktur, {{ current.ekskul }}</h3>
            <button class="modal-close" @click="showManager = false"><Icon name="i-lucide-x" class="w-5 h-5" /></button>
          </div>
          <StructureManager :ekskul-id="current.id" @saved="onManagerSaved" />
          <div class="modal-footer">
            <button class="btn-done" @click="showManager = false">Selesai</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }

/* ===== Nav ekskul ala story IG ===== */
.ekskul-nav { display: flex; gap: 10px; overflow-x: auto; padding: 6px 2px 10px; }
.ekskul-nav::-webkit-scrollbar { height: 4px; }
.ekskul-chip {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  background: transparent; border: none; cursor: pointer; padding: 4px 6px;
  min-width: 64px; transition: transform 0.15s;
}
.ekskul-chip:hover { transform: translateY(-1px); }
.chip-avatar {
  width: 52px; height: 52px; border-radius: 50%; padding: 3px;
  background: linear-gradient(45deg, var(--border-medium), var(--text-muted));
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
}
.chip-avatar img, .chip-avatar .iconify {
  width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
  background: var(--bg-card); color: var(--text-muted);
}
.ekskul-chip.active .chip-avatar {
  background: linear-gradient(45deg, var(--accent), #EC4899);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.chip-name {
  font-size: 11px; font-weight: var(--font-medium); color: var(--text-secondary);
  max-width: 72px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ekskul-chip.active .chip-name { color: var(--accent); font-weight: var(--font-semibold); }

/* ===== Tombol kelola & modal ===== */
.manage-btn {
  display: inline-flex; align-items: center; gap: 6px;
  background: var(--accent); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold);
  padding: 8px 14px; border-radius: 8px; border: none; cursor: pointer; transition: all 0.2s;
}
.manage-btn:hover { background: var(--accent-dark); }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
.modal-content { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 14px; padding: 22px; width: 640px; max-width: 96vw; max-height: 92vh; overflow-y: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--text-primary); }
.modal-close { background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; }
.modal-footer { display: flex; justify-content: flex-end; padding-top: 14px; margin-top: 14px; border-top: 1px solid var(--border-light); }
.btn-done { background: var(--accent); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 22px; border-radius: 6px; border: none; cursor: pointer; }
.btn-done:hover { background: var(--accent-dark); }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
