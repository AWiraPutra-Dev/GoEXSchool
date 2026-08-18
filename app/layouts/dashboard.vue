<template>
  <div class="dashboard-layout">
    <TopBar />
    <Sidebar />
    <main class="main-content">
      <BreadcrumbBar />
      <slot />
    </main>
    <AppFooter />
    <!-- Dialog konfirmasi global — dipakai semua halaman untuk aksi hapus -->
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  background: var(--bg-main);
}

.main-content {
  margin-top: 50px;
  margin-left: 260px;
  margin-bottom: 40px;
  padding: 20px;
  min-height: calc(100vh - 90px);
}

:root[dir="rtl"] .main-content {
  margin-left: 0;
  margin-right: 260px;
}
</style>
