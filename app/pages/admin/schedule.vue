<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const ui = useUiStore()
const op = useOperatorDataStore()
const admin = useMasterDataStore()
const { confirm } = useConfirm()
onMounted(() => { op.fetchAll(); admin.fetchReference() })
const dayNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
const activeDay = ref('Senin')
const daySchedule = computed(() => op.schedule.filter(s => s.day === activeDay.value))
const dayDates = computed(() => [...new Set(daySchedule.value.map(s => s.date).filter(Boolean) as string[])].sort())
const { page, paged, totalPages } = usePagination(() => daySchedule.value)

const showModal = ref(false)
const form = reactive({ day: 'Senin', date: '', timeStart: '', timeEnd: '', ekskulId: '', coach: '', location: '', mandatory: true, qrEnabled: true, qrActiveFrom: '', qrActiveUntil: '' })
const meetingLocation = ref<{ latitude: number | null; longitude: number | null; radius: number; locationName?: string | null }>({
  latitude: null, longitude: null, radius: 200, locationName: null,
})

function openAddSchedule() {
  form.day = activeDay.value
  form.date = ''; form.timeStart = ''; form.timeEnd = ''; form.ekskulId = ''; form.coach = ''; form.location = ''; form.mandatory = true
  form.qrEnabled = true; form.qrActiveFrom = ''; form.qrActiveUntil = ''
  meetingLocation.value = { latitude: null, longitude: null, radius: 200, locationName: null }
  showModal.value = true
}

function addSchedule() {
  op.addScheduleEntry({
    day: form.day, date: form.date || undefined, timeStart: form.timeStart, timeEnd: form.timeEnd || undefined,
    coach: form.coach, location: form.location, extracurricularId: form.ekskulId, mandatory: form.mandatory,
    latitude: meetingLocation.value.latitude,
    longitude: meetingLocation.value.longitude,
    radius: meetingLocation.value.latitude != null ? meetingLocation.value.radius : undefined,
    qrDuration: form.qrEnabled ? 30 : 0,
    qrActiveFrom: form.qrEnabled && form.qrActiveFrom ? form.qrActiveFrom : null,
    qrActiveUntil: form.qrEnabled && form.qrActiveUntil ? form.qrActiveUntil : null,
  })
  showModal.value = false
  form.timeStart = ''; form.timeEnd = ''; form.date = ''; form.ekskulId = ''; form.coach = ''; form.location = ''; form.mandatory = true; form.qrEnabled = true; form.qrActiveFrom = ''; form.qrActiveUntil = ''
  meetingLocation.value = { latitude: null, longitude: null, radius: 200, locationName: null }
}

async function removeSchedule(s: any) {
  const ok = await confirm({
    title: `Hapus jadwal ${s.ekskul} (${s.time})?`,
    message: 'Jadwal ini akan dihapus permanen dan tidak tampil lagi di kalender siswa.',
    confirmText: 'Ya, Hapus',
    danger: true,
  })
  if (!ok) return
  op.removeScheduleEntry(s.id)
}

function formatDate(iso?: string | null) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h1 class="page-title">{{ ui.t('menu.schedule') }}</h1>
      <button class="btn-primary" @click="openAddSchedule"><Icon name="i-lucide-plus" class="w-4 h-4" /> Tambah Jadwal</button>
    </div>
    <p class="text-[13px]" style="color: var(--text-secondary);">Seluruh jadwal kegiatan ekstrakurikuler — kelola jadwal &amp; jendela QR absensi otomatis</p>

    <div class="day-tabs">
      <button v-for="d in dayNames" :key="d" class="day-tab" :class="{ active: activeDay === d }" @click="activeDay = d">{{ d }}</button>
    </div>

    <div class="schedule-dates" v-if="dayDates.length">
      <span class="schedule-date-badge" v-for="d in dayDates" :key="d">
        <Icon name="i-lucide-calendar" class="w-3.5 h-3.5" /> {{ formatDate(d) }}
      </span>
    </div>

    <div class="schedule-list">
      <div v-for="(s, i) in paged" :key="i" class="schedule-item">
        <div class="schedule-time">{{ s.time }}</div>
        <div class="schedule-info">
          <h4 class="font-semibold text-[13px]">{{ s.ekskul }}</h4>
          <p class="text-[12px]" style="color: var(--text-secondary);">{{ s.coach }} · {{ s.location }}</p>
          <p v-if="s.latitude != null && s.longitude != null" class="text-[11px] coord-text">
            <Icon name="i-lucide-crosshair" class="w-3 h-3" /> Titik absen: {{ s.latitude.toFixed(5) }}, {{ s.longitude.toFixed(5) }} · Radius {{ s.radius ?? 200 }} m
          </p>
          <p v-if="s.qrDuration != null && s.qrDuration > 0" class="text-[11px] coord-text qr-text" style="color: var(--teal);">
            <Icon name="i-lucide-qr-code" class="w-3 h-3" /> QR otomatis {{ s.qrActiveFrom && s.qrActiveUntil ? `aktif ${s.qrActiveFrom} – ${s.qrActiveUntil}` : 'ikut jam jadwal' }}
          </p>
        </div>
        <span v-if="s.mandatory === false" class="optional-badge">Tidak Wajib</span>
        <button class="delete-btn" @click="removeSchedule(s)" title="Hapus"><Icon name="i-lucide-trash-2" class="w-4 h-4" /></button>
      </div>
      <div v-if="!daySchedule.length" class="empty-state">
        <Icon name="i-lucide-calendar-off" class="w-8 h-8 mb-2" style="color: var(--text-muted);" />
        <p>Tidak ada jadwal di hari {{ activeDay }}.</p>
      </div>
    </div>
    <PaginationBar v-model:page="page" :total="daySchedule.length" />

    <div class="quick-actions-card">
      <div class="panel-header">Info</div>
      <div class="quick-links">
        <span class="info-text">Admin dapat menambah/menghapus jadwal dan mengatur jendela QR absensi otomatis (dari jam ke jam).</span>
        <NuxtLink to="/admin/extracurriculars" class="quick-link">Data Ekstrakurikuler</NuxtLink>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <h3 class="modal-title">Tambah Jadwal Baru</h3>
          <form @submit.prevent="addSchedule" class="space-y-3">
            <div class="form-row">
              <div class="form-group"><label>Hari</label><select v-model="form.day" class="form-input"><option v-for="d in dayNames" :key="d">{{ d }}</option></select></div>
              <div class="form-group"><label>Tanggal Pertemuan <span class="form-optional">(opsional)</span></label><input v-model="form.date" type="date" class="form-input"></div>
            </div>
            <p class="date-hint"><Icon name="i-lucide-info" class="w-3.5 h-3.5" /> Isi tanggal bila ini pertemuan sekali waktu (mis. seleksi). Kosongkan untuk jadwal rutin mingguan. Absensi siswa hanya bisa diisi saat ada jadwal pertemuan.</p>
            <div class="form-group">
              <label>Ekskul</label>
              <select v-model="form.ekskulId" class="form-input" required><option disabled value="">Pilih Ekskul</option><option v-for="e in admin.extracurriculars" :key="e.id" :value="e.id">{{ e.name }}</option></select>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Mulai</label><input v-model="form.timeStart" class="form-input" required placeholder="14:00"></div>
              <div class="form-group"><label>Selesai</label><input v-model="form.timeEnd" class="form-input" placeholder="15:30"></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>Pembina</label><input v-model="form.coach" class="form-input" required></div>
              <div class="form-group"><label>Lokasi (nama tempat)</label><input v-model="form.location" class="form-input" required placeholder="Lapangan Basket, Lab Komputer..."></div>
            </div>
            <div class="loc-picker-box">
              <label class="loc-picker-label">
                <Icon name="i-lucide-crosshair" class="w-4 h-4" />
                Titik Lokasi Absensi Pertemuan <span class="form-optional">(opsional, kosongkan agar ikuti lokasi sesi QR / sekolah)</span>
              </label>
              <SchoolLocationPicker v-model="meetingLocation" :show-radius="true" />
              <p class="date-hint"><Icon name="i-lucide-info" class="w-3.5 h-3.5" /> Siswa hanya bisa absen di dalam titik + radius ini saat pertemuan berlangsung. Jika tidak diatur, absensi mengikuti titik yang dipilih operator saat membuat QR.</p>
            </div>
            <label class="mandatory-toggle">
              <input v-model="form.mandatory" type="checkbox">
              <span>Jadwal Wajib (harus dihadiri anggota)</span>
            </label>
            <div class="qr-settings-box">
              <label class="mandatory-toggle">
                <input v-model="form.qrEnabled" type="checkbox">
                <span><Icon name="i-lucide-qr-code" class="w-4 h-4" style="color: var(--teal);" /> Aktifkan QR Absensi Otomatis</span>
              </label>
              <p class="date-hint" style="margin: 4px 0 10px;"><Icon name="i-lucide-info" class="w-3.5 h-3.5" /> QR + token dibuat otomatis begitu masuk jam aktif. Siswa men-scan/memasukkan token di halaman Absensi.</p>
              <div class="form-row" v-if="form.qrEnabled">
                <div class="form-group">
                  <label>QR Aktif Dari <span class="form-optional">(opsional)</span></label>
                  <input v-model="form.qrActiveFrom" type="time" class="form-input">
                </div>
                <div class="form-group">
                  <label>QR Aktif Sampai <span class="form-optional">(opsional)</span></label>
                  <input v-model="form.qrActiveUntil" type="time" class="form-input">
                </div>
              </div>
              <p v-if="form.qrEnabled" class="date-hint"><Icon name="i-lucide-info" class="w-3.5 h-3.5" /> Kosongkan untuk mengikuti jam mulai–selesai jadwal. Token berlaku hingga jam "QR Aktif Sampai" (dari jam ke jam).</p>
            </div>
            <div class="modal-actions"><button type="button" class="btn-cancel" @click="showModal = false">Batal</button><button type="submit" class="btn-primary">Tambah</button></div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.page-title { font-size: var(--text-2xl); font-weight: var(--font-bold); color: var(--text-primary); }
.day-tabs { display: flex; gap: 4px; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-light); padding: 4px; }
.day-tab { flex: 1; padding: 8px; text-align: center; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-secondary); background: none; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
.day-tab.active { background: var(--olive-primary); color: white; }
.day-tab:not(.active):hover { background: var(--bg-hover); }
.schedule-list { display: flex; flex-direction: column; gap: 8px; }
.schedule-dates { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 4px; }
.schedule-date-badge { display: inline-flex; align-items: center; gap: 5px; font-size: var(--text-xs); font-weight: var(--font-semibold); color: var(--text-secondary); background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 6px; padding: 5px 10px; }
.schedule-item { display: flex; align-items: center; gap: 16px; background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; padding: 14px 20px; transition: all 0.2s; }
.schedule-item:hover { border-color: var(--olive-primary); }
.schedule-date-text { display: inline-flex; align-items: center; gap: 4px; color: var(--text-muted); margin-top: 3px; }
.schedule-time { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--olive-primary); font-variant-numeric: tabular-nums; letter-spacing: 0.02em; background: var(--olive-bg); border: 1px solid var(--border-light); padding: 4px 10px; border-radius: 6px; white-space: nowrap; }
.schedule-info { flex: 1; }
.coord-text { display: inline-flex; align-items: center; gap: 4px; color: var(--text-muted); margin-top: 3px; font-variant-numeric: tabular-nums; }
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px; color: var(--text-muted); font-size: var(--text-sm); background: var(--bg-card); border: 1px dashed var(--border-light); border-radius: 8px; }
.quick-actions-card { background: var(--bg-card); border: 1px solid var(--border-light); border-radius: 8px; overflow: hidden; margin-top: 16px; }
.panel-header { display: flex; align-items: center; gap: 10px; background: var(--bg-card); color: var(--text-primary); font-weight: var(--font-semibold); text-transform: uppercase; font-size: 12px; padding: 12px 16px; letter-spacing: 0.02em; border-bottom: 1px solid var(--border-light); }
.panel-header::before { content: ''; width: 4px; height: 14px; border-radius: 2px; background: var(--accent); flex-shrink: 0; }
.quick-links { display: flex; gap: 12px; padding: 16px; flex-wrap: wrap; }
.quick-link { padding: 8px 16px; background: var(--olive-bg); border-radius: 6px; color: var(--text-primary); text-decoration: none; font-size: var(--text-sm); transition: all 0.2s; }
.quick-link:hover { background: var(--olive-primary); color: white; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; background: var(--olive-primary); color: white; font-size: var(--text-sm); font-weight: var(--font-semibold); padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; }
.btn-primary:hover { background: var(--olive-dark); }
.btn-cancel { background: white; color: var(--text-secondary); font-size: var(--text-sm); padding: 8px 20px; border-radius: 6px; border: 1px solid var(--border-light); cursor: pointer; }
.delete-btn { background: none; border: none; cursor: pointer; font-size: 14px; padding: 4px; opacity: 0.5; transition: opacity 0.2s; display: inline-flex; align-items: center; justify-content: center; }
.delete-btn:hover { opacity: 1; color: var(--red-orange); }
.optional-badge { font-size: var(--text-xs); padding: 2px 10px; border-radius: 4px; background: rgba(212,192,137,0.25); color: #A8863C; font-weight: var(--font-medium); white-space: nowrap; }
.form-optional { font-size: 12px; color: var(--text-muted); font-weight: var(--font-normal); }
.date-hint { display: flex; align-items: center; gap: 6px; font-size: var(--text-xs); color: var(--text-muted); margin: -6px 0 10px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-group { margin-bottom: 4px; }
.form-group label { display: block; font-size: var(--text-sm); font-weight: var(--font-medium); margin-bottom: 4px; color: var(--text-primary); }
.form-input { width: 100%; padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 6px; font-size: var(--text-sm); color: var(--text-primary); }
.form-input:focus { outline: none; border-color: var(--olive-primary); }
.mandatory-toggle { display: flex; align-items: center; gap: 8px; font-size: var(--text-sm); color: var(--text-primary); cursor: pointer; padding: 8px 0; }
.mandatory-toggle input { width: 16px; height: 16px; accent-color: var(--olive-primary); }
.loc-picker-box { border: 1px solid var(--border-light); border-radius: 8px; padding: 14px; background: var(--bg-main); }
.loc-picker-label { display: flex; align-items: center; gap: 6px; font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--text-primary); margin-bottom: 10px; }
.qr-settings-box { border: 1px solid var(--border-light); border-radius: 8px; padding: 14px; background: var(--bg-main); }
.qr-settings-box .mandatory-toggle { padding: 0; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 12px; padding: 24px; width: 640px; max-width: 94vw; max-height: 90vh; overflow-y: auto; }
.modal-title { font-size: var(--text-lg); font-weight: var(--font-bold); margin-bottom: 20px; color: var(--text-primary); }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }
.info-text { font-size: var(--text-sm); color: var(--text-secondary); padding: 8px 0; }
.qr-text { margin-top: 6px; }
</style>
