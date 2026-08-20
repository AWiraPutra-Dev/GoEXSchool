<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const auth = useAuthStore()
const master = useMasterDataStore()
const saving = ref(false)
const saved = ref(false)
const errorMsg = ref('')
const logoUrl = ref<string | null>(null)

const myEkskul = computed(() => auth.user?.extracurricular ?? null)

onMounted(async () => {
  await master.fetchReference()
  const ekskul = master.extracurriculars.find(e => e.id === myEkskul.value?.id)
  if (ekskul && 'logoUrl' in ekskul) logoUrl.value = (ekskul as any).logoUrl ?? null
})

async function saveLogo() {
  if (!myEkskul.value?.id) return
  saving.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/operator/extracurricular/logo', { method: 'PUT', body: { logoUrl: logoUrl.value } })
    saved.value = true
    setTimeout(() => saved.value = false, 2000)
  } catch (e: any) {
    errorMsg.value = e?.data?.message || 'Gagal menyimpan logo.'
  } finally { saving.value = false }
}
</script>

<template>
  <div class="space-y-4 max-w-2xl">
    <h1 class="page-title">{{ ui.t('menu.logo') }}</h1>
    <p class="text-[13px]" style="color: var(--text-secondary);">
      Logo ekskul ini tampil di blog/artikel, voting, galeri, dan kop surat izin yang dibuat ekskul {{ myEkskul?.name ? `«${myEkskul.name}»` : 'Anda' }}.
    </p>

    <div v-if="!myEkskul" class="warning-card">
      <Icon name="i-lucide-alert-circle" class="w-5 h-5" />
      <span>Akun operator belum diikat ke ekskul. Hubungi admin untuk mengikat ekskul pada User &amp; Privileges.</span>
    </div>

    <div v-else class="form-card">
      <div class="form-card-title">
        <Icon name="i-lucide-shield" class="w-4 h-4" style="color: var(--accent);" />
        Logo {{ myEkskul.name }}
      </div>
      <LogoUploader v-model="logoUrl" :size="100" />
      <div v-if="errorMsg" class="error-badge">
        <Icon name="i-lucide-alert-circle" class="w-4 h-4 shrink-0" />
        <span>{{ errorMsg }}</span>
      </div>
      <div class="form-actions">
        <button class="btn-primary" :disabled="saving" @click="saveLogo">
          <Icon v-if="saved" name="i-lucide-check" class="w-4 h-4" />
          {{ saved ? 'Tersimpan!' : 'Simpan Logo' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.warning-card { display: flex; align-items: center; gap: 10px; padding: 14px 16px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; font-size: var(--text-sm); color: #dc2626; }
.form-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 24px; }
.form-card-title { display: flex; align-items: center; gap: 8px; font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); margin-bottom: 16px; }
.error-badge { display: flex; align-items: center; gap: 10px; padding: 12px 14px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; font-size: var(--text-sm); color: #dc2626; margin-top: 16px; }
.form-actions { display: flex; justify-content: flex-end; padding-top: 16px; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 10px 24px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
