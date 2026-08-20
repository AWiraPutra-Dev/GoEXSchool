<script setup lang="ts">
// Tampilan Struktur Organisasi (grid 4 kolom) — dipakai
// halaman siswa (lihat) dan live preview di pengelola (admin/operator).
//
// Grid berisi tile kartu pengurus: foto + jabatan + nama + kelas.
//
// Semua warna diturunkan dari var(--accent) (warna utama instansi yang
// dipilih admin di menu Edit Instansi) — tanpa pilihan tema.

interface StructureTile {
  id: string
  type: 'person' | 'image'
  name: string
  className: string | null
  position: string
  photoUrl: string | null
  imageUrl?: string | null
  sortOrder: number
}

interface StructureDisplayData {
  id: string
  ekskul: string
  ekskulLogo?: string | null
  positions: StructureTile[]
}

const props = withDefaults(defineProps<{ ekskul: StructureDisplayData | null; editable?: boolean }>(), {
  ekskul: null,
  editable: false,
})

const emit = defineEmits<{
  add: []
  edit: [tile: StructureTile]
  delete: [tile: StructureTile]
  move: [tile: StructureTile, dir: 'up' | 'down' | 'left' | 'right']
}>()

// Hanya tampilkan tile person, filter image tile
const tiles = computed(() => (props.ekskul?.positions ?? []).filter(t => t.type === 'person'))

const personCount = computed(() => tiles.value.length)

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
</script>

<template>
  <div v-if="ekskul" class="structure-shell">
    <!-- Pita gradasi atas -->
    <div class="s-accent-bar"></div>

    <!-- Header ala profil IG -->
    <div class="ig-header">
      <div class="ig-avatar">
        <img v-if="ekskul.ekskulLogo" :src="ekskul.ekskulLogo" alt="" />
        <Icon v-else name="i-lucide-shield" class="w-9 h-9" />
      </div>
      <div class="ig-info">
        <h2 class="ig-name">{{ ekskul.ekskul }}</h2>
        <div class="ig-stats">
          <div class="ig-stat">
            <strong>{{ tiles.length }}</strong>
            <span>Pengurus</span>
          </div>
        </div>
        <p class="ig-tagline">Struktur Organisasi</p>
      </div>
    </div>

    <!-- Grid 4 kolom -->
    <div class="ig-grid">
      <div
        v-for="t in tiles"
        :key="t.id"
        class="ig-tile tile-person"
      >
        <!-- Tile person: foto + info -->
        <div class="tile-photo">
          <img v-if="t.photoUrl" :src="t.photoUrl" :alt="t.name" loading="lazy" />
          <span v-else class="tile-initials">{{ initials(t.name) }}</span>
        </div>
        <div class="tile-overlay">
          <span class="tile-pos">{{ t.position }}</span>
          <span class="tile-person-name">{{ t.name }}</span>
          <span v-if="t.className" class="tile-class">
            <Icon name="i-lucide-school" class="w-3 h-3" /> {{ t.className }}
          </span>
        </div>

        <!-- Kontrol edit langsung di grid (hanya saat mode edit) -->
        <div v-if="editable" class="tile-controls">
          <div class="tile-move-group">
            <button type="button" class="tile-ctl" title="Geser ke kiri" @click.stop="emit('move', t, 'left')">
              <Icon name="i-lucide-arrow-left" class="w-3.5 h-3.5" />
            </button>
            <div class="tile-move-middle">
              <button type="button" class="tile-ctl" title="Geser ke atas" @click.stop="emit('move', t, 'up')">
                <Icon name="i-lucide-arrow-up" class="w-3.5 h-3.5" />
              </button>
              <button type="button" class="tile-ctl" title="Geser ke bawah" @click.stop="emit('move', t, 'down')">
                <Icon name="i-lucide-arrow-down" class="w-3.5 h-3.5" />
              </button>
            </div>
            <button type="button" class="tile-ctl" title="Geser ke kanan" @click.stop="emit('move', t, 'right')">
              <Icon name="i-lucide-arrow-right" class="w-3.5 h-3.5" />
            </button>
          </div>
          <button type="button" class="tile-ctl" title="Edit" @click.stop="emit('edit', t)">
            <Icon name="i-lucide-pencil" class="w-3.5 h-3.5" />
          </button>
          <button type="button" class="tile-ctl ctl-danger" title="Hapus" @click.stop="emit('delete', t)">
            <Icon name="i-lucide-trash-2" class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Tile tambah (mode edit) -->
      <button v-if="editable" type="button" class="ig-tile tile-add" @click="emit('add')">
        <Icon name="i-lucide-plus" class="w-6 h-6" />
        <span>Tambah Pengurus</span>
      </button>

      <div v-if="!tiles.length && !editable" class="ig-empty">
        <Icon name="i-lucide-users" class="w-10 h-10" />
        <p>Belum ada isi struktur untuk ekskul ini.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   KERANGKA STRUKTUR — satu gaya, warnanya selalu mengikuti
   var(--accent) (warna utama instansi). Tanpa pilihan tema.
   ============================================================ */

.structure-shell {
  --s-shell-bg: linear-gradient(165deg,
    color-mix(in srgb, var(--accent) 14%, #F8FAFC) 0%,
    color-mix(in srgb, var(--accent) 4%, #FFFFFF) 48%,
    color-mix(in srgb, var(--accent) 10%, #F1F5F9) 100%);
  --s-shell-border: color-mix(in srgb, var(--accent) 22%, var(--border-light));
  --s-bar-a: var(--accent);
  --s-bar-b: color-mix(in srgb, var(--accent) 55%, #FF6B9D);
  --s-text: #0F172A;
  --s-text-sub: #64748B;

  background: var(--s-shell-bg);
  border: 1px solid var(--s-shell-border);
  border-radius: 18px;
  overflow: hidden;
  position: relative;
}

/* Pita gradasi atas */
.s-accent-bar {
  height: 5px;
  background: linear-gradient(90deg, var(--s-bar-a), var(--s-bar-b));
}

/* ===== Header ala profil IG ===== */
.ig-header {
  display: flex; align-items: center; gap: 18px;
  padding: 24px 26px 20px;
  border-bottom: 1px solid color-mix(in srgb, var(--accent) 16%, transparent);
}
.ig-avatar {
  width: 76px; height: 76px; border-radius: 50%; padding: 3px; flex-shrink: 0;
  background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #FF6B9D));
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 18%, transparent);
  display: flex; align-items: center; justify-content: center;
}
.ig-avatar img, .ig-avatar .iconify {
  width: 100%; height: 100%; border-radius: 50%; object-fit: cover;
  background: #FFFFFF; color: var(--accent);
}
.ig-info { min-width: 0; }
.ig-name { font-size: var(--text-xl); font-weight: var(--font-bold); color: var(--s-text); letter-spacing: -0.01em; }
.ig-stats { display: flex; gap: 22px; margin-top: 7px; flex-wrap: wrap; }
.ig-stat { display: flex; align-items: baseline; gap: 5px; }
.ig-stat strong { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--s-text); font-variant-numeric: tabular-nums; }
.ig-stat span { font-size: 11px; color: var(--s-text-sub); }
.ig-tagline { font-size: var(--text-xs); color: var(--s-text-sub); margin-top: 7px; }

/* ===== Grid 4 kolom ===== */
.ig-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 22px;
}

.ig-tile {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 14px;
  overflow: hidden;
  background: #FFFFFF;
  border: 1px solid color-mix(in srgb, var(--accent) 18%, var(--border-light));
  box-shadow: 0 4px 14px color-mix(in srgb, var(--accent) 10%, transparent);
  transition: transform 0.22s, box-shadow 0.22s;
}

.ig-tile:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px color-mix(in srgb, var(--accent) 24%, transparent);
}

/* Tile person: foto + overlay info */
.tile-photo {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
}
.tile-photo img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.35s ease;
}
.tile-person:hover .tile-photo img { transform: scale(1.05); }
.tile-initials {
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100%;
  font-size: 30px; font-weight: var(--font-bold);
  color: var(--accent);
  background: linear-gradient(135deg,
    color-mix(in srgb, var(--accent) 16%, #FFFFFF),
    color-mix(in srgb, var(--accent) 6%, #F1F5F9));
}

/* Overlay bawah ala IG: gradasi gelap + teks terang */
.tile-overlay {
  position: absolute; left: 0; right: 0; bottom: 0;
  padding: 26px 10px 10px;
  background: linear-gradient(to top, rgba(15, 23, 42, 0.88) 0%, rgba(15, 23, 42, 0.45) 55%, transparent 100%);
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  text-align: center;
}
.tile-pos {
  font-size: 9px; padding: 2px 10px; border-radius: 4px;
  background: var(--accent); color: #FFFFFF;
  font-weight: var(--font-semibold); letter-spacing: 0.02em;
  max-width: 92%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.tile-person-name {
  font-size: var(--text-sm); font-weight: var(--font-semibold); color: #FFFFFF; line-height: 1.3;
  max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.tile-class {
  display: inline-flex; align-items: center; gap: 4px;
  font-size: 12px; color: rgba(255, 255, 255, 0.75);
}

.ig-empty {
  grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 42px; color: var(--s-text-sub); font-size: var(--text-sm);
}

/* ===== Kontrol edit langsung di grid ===== */
.tile-controls {
  position: absolute; top: 6px; right: 6px;
  display: flex; flex-direction: column; gap: 4px;
  opacity: 0;
  transform: translateY(-3px);
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.ig-tile:hover .tile-controls { opacity: 1; transform: translateY(0); }
.tile-move-group {
  display: grid;
  grid-template-columns: 22px 22px 22px;
  grid-template-rows: 22px 22px;
  gap: 2px;
  justify-items: center;
  align-items: center;
}
.tile-move-middle {
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: center;
}
.tile-ctl {
  width: 22px; height: 22px; border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(15, 23, 42, 0.72); color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.25); cursor: pointer;
  transition: all 0.15s;
}
.tile-ctl:hover { background: var(--accent); border-color: var(--accent); }
.ctl-danger:hover { background: #EF4444; border-color: #EF4444; }

/* Tile tambah (mode edit) */
.tile-add {
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  border: 2px dashed color-mix(in srgb, var(--accent) 45%, var(--border-medium));
  background: color-mix(in srgb, var(--accent) 6%, transparent);
  color: var(--accent);
  font-size: var(--text-xs); font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all 0.2s;
}
.tile-add:hover {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  transform: translateY(-2px);
}

/* Responsif: 4 → 2 kolom di layar kecil */
@media (max-width: 720px) {
  .ig-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; padding: 16px; }
  .ig-header { padding: 18px 18px 16px; }
}
</style>