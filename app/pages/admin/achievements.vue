<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const siswa = useSiswaDataStore()

const typeLabels: Record<string, string> = { juara: '🥇 Juara', sertifikat: '📜 Sertifikat', partisipasi: '🤝 Partisipasi', organisasi: '👥 Organisasi' }
const levelLabels: Record<string, string> = { sekolah: 'Sekolah', kecamatan: 'Kecamatan', kota: 'Kota', provinsi: 'Provinsi', nasional: 'Nasional' }
const typeColors: Record<string, string> = { juara: 'var(--yellow-cream)', sertifikat: 'var(--teal)', partisipasi: 'var(--green-soft)', organisasi: 'var(--olive-primary)' }
const levelColors: Record<string, string> = { sekolah: 'var(--teal)', kecamatan: 'var(--teal-mid)', kota: 'var(--yellow-cream)', provinsi: 'var(--orange)', nasional: 'var(--red-orange)' }
</script>

<template>
  <div class="space-y-4">
    <h1 class="page-title">Portofolio Prestasi</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">{{ siswa.achievements.length }} total prestasi siswa</p>

    <div class="achievements-grid">
      <div v-for="a in siswa.achievements" :key="a.id" class="achievement-card">
        <div class="ach-top">
          <div class="ach-icon-wrapper" :style="{ background: typeColors[a.type] + '20', color: typeColors[a.type] }">
            <Icon :name="a.type === 'juara' ? 'i-lucide-trophy' : a.type === 'sertifikat' ? 'i-lucide-award' : a.type === 'partisipasi' ? 'i-lucide-handshake' : 'i-lucide-users'" class="w-6 h-6" />
          </div>
          <div class="ach-badges">
            <span class="ach-type-badge" :style="{ background: typeColors[a.type] + '20', color: typeColors[a.type] }">{{ typeLabels[a.type] }}</span>
            <span class="ach-level-badge" :style="{ background: levelColors[a.level] + '20', color: levelColors[a.level] }">{{ levelLabels[a.level] }}</span>
          </div>
        </div>
        <h3 class="ach-title">{{ a.title }}</h3>
        <p class="ach-desc">{{ a.description }}</p>
        <div class="ach-footer">
          <span class="ach-ekskul">{{ a.ekskul }}</span>
          <span class="ach-date">{{ a.date }}</span>
        </div>
      </div>
      <div v-if="!siswa.achievements.length" class="empty-state">
        <p style="color: var(--text-muted);">Belum ada prestasi tercatat.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 16px; }
.achievement-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 10px; padding: 20px; transition: all 0.2s; }
.achievement-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); transform: translateY(-1px); }
.ach-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
.ach-icon-wrapper { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ach-badges { display: flex; gap: 4px; flex-wrap: wrap; }
.ach-type-badge, .ach-level-badge { font-size: 10px; padding: 2px 8px; border-radius: 6px; font-weight: var(--font-medium); }
.ach-title { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 6px; }
.ach-desc { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-relaxed); margin-bottom: 12px; }
.ach-footer { display: flex; align-items: center; gap: 8px; font-size: var(--text-xs); color: var(--text-muted); padding-top: 12px; border-top: 1px solid var(--border-light); }
.ach-ekskul { font-weight: var(--font-semibold); color: var(--olive-primary); }
.ach-date { margin-left: auto; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 48px; background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 12px; }
</style>
