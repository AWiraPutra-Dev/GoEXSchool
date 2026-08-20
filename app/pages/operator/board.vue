<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const auth = useAuthStore()
const op = useOperatorDataStore()

const isOperator = computed(() => auth.user?.role === 'operator')
const myEkskul = computed(() => auth.myEkskul)

const myEkskulLogo = computed(() => {
  if (!myEkskul.value) return null
  return op.board.find(b => b.ekskulId === myEkskul.value!.id)?.ekskulLogo ?? null
})

onMounted(() => { if (myEkskul.value) op.fetchBoard() })
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="page-title">{{ ui.t('menu.board') }}</h1>
      <p class="text-[13px]" style="color: var(--text-secondary);">
        Struktur organisasi ekskul yang kamu kelola, kelola kartu pengurus dan tampilan struktur yang dilihat semua siswa. Warna mengikuti instansi.
      </p>
    </div>

    <div v-if="isOperator && !myEkskul" class="scope-warning">
      <Icon name="i-lucide-alert-circle" class="w-4 h-4" /> Akun belum diikat ke ekskul. Hubungi admin.
    </div>

    <div v-else-if="myEkskul" class="my-ekskul-bar">
      <img v-if="myEkskulLogo" :src="myEkskulLogo" class="ekskul-logo" alt="" />
      <div v-else class="ekskul-logo-fallback"><Icon name="i-lucide-shield" class="w-4 h-4" /></div>
      <div>
        <div class="ekskul-name">{{ myEkskul.name }}</div>
        <div class="ekskul-sub">Struktur organisasi ekskul ini tampil untuk semua siswa.</div>
      </div>
    </div>

    <StructureManager v-if="myEkskul" :ekskul-id="myEkskul.id" />
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.scope-warning { display: flex; align-items: center; gap: 8px; padding: 14px 16px; border-radius: 4px; background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.25); color: var(--red-orange); font-size: var(--text-sm); font-weight: var(--font-medium); }
.my-ekskul-bar { display: flex; align-items: center; gap: 12px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 12px; padding: 14px 16px; }
.ekskul-logo { width: 40px; height: 40px; border-radius: 10px; object-fit: contain; background: white; border: 1px solid var(--border-light); padding: 4px; }
.ekskul-logo-fallback { width: 40px; height: 40px; border-radius: 10px; background: var(--accent-soft); color: var(--accent); display: flex; align-items: center; justify-content: center; }
.ekskul-name { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); }
.ekskul-sub { font-size: var(--text-xs); color: var(--text-secondary); margin-top: 2px; }
</style>
