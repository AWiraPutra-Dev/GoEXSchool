<script setup lang="ts">
const route = useRoute()

interface BreadcrumbItem {
  label: string
  to?: string
}

const breadcrumbs = computed(() => {
  const parts = route.path.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = []
  
  // Map path to labels
  const labelMap: Record<string, string> = {
    admin: 'Admin',
    operator: 'Operator',
    siswa: 'Siswa',
    students: 'Data Siswa',
    teachers: 'Data Guru',
    classes: 'Kelas / Rombel',
    extracurriculars: 'Ekstrakurikuler',
    users: 'User & Privileges',
    reports: 'Laporan',
    settings: 'Pengaturan',
    attendance: 'Absensi QR',
    assessments: 'Penilaian',
    schedule: 'Jadwal',
    blog: 'Blog & Artikel',
    materials: 'Materi Ekskul',
    members: 'Anggota',
    news: 'Pengumuman & Berita',
    polls: 'Voting',
    gallery: 'Galeri',
    feed: 'Feed Komunitas',
    achievements: 'Portofolio Prestasi',
    grades: 'Penilaian',
    profile: 'Profil Saya'
  }
  
  for (let i = 0; i < parts.length; i++) {
    const path = '/' + parts.slice(0, i + 1).join('/')
    const label = labelMap[parts[i]] ?? parts[i].charAt(0).toUpperCase() + parts[i].slice(1)
    items.push({ label, to: path })
  }
  
  return items
})
</script>

<template>
  <div class="breadcrumb-bar" v-if="breadcrumbs.length > 0">
    <Icon name="i-lucide-home" class="breadcrumb-icon" />
    <template v-for="(crumb, i) in breadcrumbs" :key="crumb.to">
      <NuxtLink
        v-if="i < breadcrumbs.length - 1"
        :to="crumb.to!"
        class="breadcrumb-link"
      >
        {{ crumb.label }}
      </NuxtLink>
      <span v-else class="breadcrumb-text">{{ crumb.label }}</span>
      <Icon v-if="i < breadcrumbs.length - 1" name="i-lucide-chevron-right" class="breadcrumb-sep" />
    </template>
  </div>
</template>

<style scoped>
.breadcrumb-bar {
  background: var(--bg-header);
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 16px;
  border-radius: 4px;
  gap: 6px;
}

.breadcrumb-icon {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
  margin-right: 4px;
  flex-shrink: 0;
}

.breadcrumb-link {
  font-size: var(--text-base);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: var(--olive-primary);
}

.breadcrumb-text {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--text-primary);
}

.breadcrumb-sep {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
  flex-shrink: 0;
}
</style>
