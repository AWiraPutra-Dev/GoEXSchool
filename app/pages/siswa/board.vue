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

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// ---- Hak kelola: admin, operator, atau user berprivilege 'structure' ----
const canManage = computed(() => {
  const role = auth.user?.role
  if (role === 'admin' || role === 'super_admin' || role === 'operator') return true
  return (auth.user?.permissions ?? []).includes('structure')
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

    <!-- Struktur terpilih -->
    <div v-if="current" :class="['structure-shell', `theme-${current.theme}`]">
      <!-- Header ala profil IG -->
      <div class="ig-header">
        <div class="ig-avatar">
          <img v-if="current.ekskulLogo" :src="current.ekskulLogo" alt="" />
          <Icon v-else name="i-lucide-shield" class="w-8 h-8" />
        </div>
        <div class="ig-info">
          <h2 class="ig-name">{{ current.ekskul }}</h2>
          <div class="ig-stats">
            <div class="ig-stat">
              <strong>{{ current.positions.length }}</strong>
              <span>Jabatan</span>
            </div>
            <div class="ig-stat">
              <strong>{{ current.positions.filter(p => p.photoUrl).length }}</strong>
              <span>Berfoto</span>
            </div>
          </div>
          <p class="ig-tagline">Struktur Organisasi</p>
        </div>
      </div>

      <!-- Mode gambar: desain jadi (Canva dll) -->
      <div v-if="current.mode === 'image' && current.imageUrl" class="structure-image-wrap">
        <img :src="current.imageUrl" class="structure-image" :alt="`Struktur ${current.ekskul}`" loading="lazy" />
      </div>

      <!-- Mode kartu: grid anggota ala feed -->
      <div v-else class="ig-grid">
        <div v-for="(p, i) in current.positions" :key="p.id" class="ig-card">
          <div class="ig-photo">
            <img v-if="p.photoUrl" :src="p.photoUrl" :alt="p.name" loading="lazy" />
            <span v-else class="ig-initials">{{ initials(p.name) }}</span>
          </div>
          <span class="ig-pos">{{ p.position }}</span>
          <span class="ig-person">{{ p.name }}</span>
          <span v-if="p.className" class="ig-class">
            <Icon name="i-lucide-school" class="w-3 h-3" /> {{ p.className }}
          </span>
        </div>

        <div v-if="!current.positions.length" class="ig-empty">
          <Icon name="i-lucide-users" class="w-10 h-10" />
          <p>Belum ada anggota struktur untuk ekskul ini.</p>
        </div>
      </div>
    </div>

    <div v-if="!ekskulOptions.length" class="empty-state">
      <Icon name="i-lucide-shield" class="w-12 h-12 mb-3" style="color: var(--text-muted);" />
      <p style="color: var(--text-muted);">Belum ada struktur ekskul yang ditambahkan.</p>
    </div>

    <!-- Modal kelola struktur (admin / operator / berprivilege) -->
    <Teleport to="body">
      <div v-if="showManager && current" class="modal-overlay" @click.self="showManager = false">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Kelola Struktur — {{ current.ekskul }}</h3>
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

/* ===== Kerangka struktur + TEMA =====
   Setiap tema hanya mengubah variabel di bawah; semua elemen memakainya. */
.structure-shell {
  --s-shell-bg: linear-gradient(165deg, #EEF2FF 0%, #F8FAFC 100%);
  --s-shell-border: var(--border-light);
  --s-card-bg: #FFFFFF;
  --s-card-border: rgba(148, 163, 184, 0.28);
  --s-card-shadow: 0 4px 14px rgba(79, 70, 229, 0.08);
  --s-ring-a: #6366F1;
  --s-ring-b: #8B5CF6;
  --s-text: #0F172A;
  --s-text-sub: #64748B;
  --s-pos-bg: rgba(99, 102, 241, 0.12);
  --s-pos-color: #4F46E5;
  --s-header-divider: rgba(100, 116, 139, 0.18);
  background: var(--s-shell-bg);
  border: 1px solid var(--s-shell-border);
  border-radius: 16px;
  overflow: hidden;
}

.theme-sunset {
  --s-shell-bg: linear-gradient(165deg, #FFF3EC 0%, #FFE9EF 100%);
  --s-shell-border: rgba(249, 115, 22, 0.2);
  --s-card-bg: #FFFFFF;
  --s-card-border: rgba(249, 115, 22, 0.22);
  --s-card-shadow: 0 4px 14px rgba(236, 72, 153, 0.1);
  --s-ring-a: #F97316;
  --s-ring-b: #EC4899;
  --s-text: #431407;
  --s-text-sub: #9A3412;
  --s-pos-bg: rgba(236, 72, 153, 0.12);
  --s-pos-color: #DB2777;
  --s-header-divider: rgba(154, 52, 18, 0.16);
}

.theme-forest {
  --s-shell-bg: linear-gradient(165deg, #03291F 0%, #064E3B 100%);
  --s-shell-border: rgba(16, 185, 129, 0.3);
  --s-card-bg: rgba(255, 255, 255, 0.06);
  --s-card-border: rgba(255, 255, 255, 0.14);
  --s-card-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  --s-ring-a: #F59E0B;
  --s-ring-b: #10B981;
  --s-text: #F0FDF4;
  --s-text-sub: #A7F3D0;
  --s-pos-bg: rgba(245, 158, 11, 0.16);
  --s-pos-color: #FBBF24;
  --s-header-divider: rgba(255, 255, 255, 0.14);
}

/* ===== Header ala profil IG ===== */
.ig-header {
  display: flex; align-items: center; gap: 16px;
  padding: 22px 24px 18px;
  border-bottom: 1px solid var(--s-header-divider);
}
.ig-avatar {
  width: 72px; height: 72px; border-radius: 50%; padding: 3px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--s-ring-a), var(--s-ring-b));
  display: flex; align-items: center; justify-content: center;
}
.ig-avatar img, .ig-avatar .iconify {
  width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
  background: var(--bg-card); color: var(--s-ring-a);
}
.ig-info { min-width: 0; }
.ig-name { font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--s-text); letter-spacing: -0.01em; }
.ig-stats { display: flex; gap: 20px; margin-top: 6px; }
.ig-stat { display: flex; align-items: baseline; gap: 5px; }
.ig-stat strong { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--s-text); font-variant-numeric: tabular-nums; }
.ig-stat span { font-size: 11px; color: var(--s-text-sub); }
.ig-tagline { font-size: var(--text-xs); color: var(--s-text-sub); margin-top: 6px; }

/* ===== Mode gambar ===== */
.structure-image-wrap { padding: 20px; }
.structure-image { width: 100%; height: auto; border-radius: 12px; display: block; box-shadow: var(--s-card-shadow); }

/* ===== Grid kartu ala feed ===== */
.ig-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px;
  padding: 20px;
}
.ig-card {
  display: flex; flex-direction: column; align-items: center; text-align: center;
  background: var(--s-card-bg); border: 1px solid var(--s-card-border);
  border-radius: 14px; padding: 18px 12px 16px; box-shadow: var(--s-card-shadow);
  transition: transform 0.2s, box-shadow 0.2s;
}
.ig-card:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); }
.ig-photo {
  width: 84px; height: 84px; border-radius: 50%; padding: 3px; margin-bottom: 10px;
  background: linear-gradient(135deg, var(--s-ring-a), var(--s-ring-b));
  display: flex; align-items: center; justify-content: center;
}
.ig-photo img, .ig-initials {
  width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
  background: var(--s-card-bg);
}
.ig-initials {
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: var(--font-bold); color: var(--s-ring-a);
}
.ig-pos {
  font-size: 10px; padding: 3px 12px; border-radius: 12px;
  background: var(--s-pos-bg); color: var(--s-pos-color);
  font-weight: var(--font-semibold); letter-spacing: 0.02em;
  margin-bottom: 7px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.ig-person { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--s-text); line-height: 1.35; }
.ig-class { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--s-text-sub); margin-top: 3px; }
.ig-empty { grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 40px; color: var(--s-text-sub); font-size: var(--text-sm); }

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
