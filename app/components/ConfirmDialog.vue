<script setup lang="ts">
/**
 * Dialog konfirmasi global — render sekali di layout (`<ConfirmDialog />`),
 * lalu panggil lewat `useConfirm().confirm({ ... })` dari halaman mana pun.
 */
const { state, closeConfirm } = useConfirm()

const verifyInput = ref('')
const busy = ref(false)

watch(() => state.open, (open) => {
  if (open) {
    verifyInput.value = ''
    busy.value = false
  }
})

const verified = computed(() => {
  const verify = state.options.verify
  if (!verify) return true
  return verifyInput.value.trim().toUpperCase() === verify.toUpperCase()
})

async function onConfirm() {
  if (!verified.value || busy.value) return
  busy.value = true
  closeConfirm(true)
  busy.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="state.open" class="confirm-overlay" @click.self="closeConfirm(false)">
      <div class="confirm-dialog" role="dialog" aria-modal="true">
        <!-- Ikon peringatan -->
        <div class="confirm-icon" :class="{ danger: state.options.danger }">
          <Icon :name="state.options.danger ? 'i-lucide-alert-triangle' : 'i-lucide-help-circle'" class="w-6 h-6" />
        </div>

        <h3 class="confirm-title">{{ state.options.title }}</h3>
        <p v-if="state.options.message" class="confirm-message">{{ state.options.message }}</p>

        <!-- Daftar data terkait yang ikut terhapus -->
        <div v-if="state.options.related?.length" class="related-list">
          <p class="related-title">
            <Icon name="i-lucide-info" class="w-3.5 h-3.5" />
            Data berikut ikut terhapus permanen:
          </p>
          <div class="related-row" v-for="(r, i) in state.options.related" :key="i">
            <span class="related-label">{{ r.label }}</span>
            <span class="related-count">{{ r.count }}</span>
          </div>
        </div>

        <!-- Verifikasi ketik -->
        <div v-if="state.options.verify" class="verify-box">
          <label class="verify-label">
            Ketik <strong>{{ state.options.verify }}</strong> untuk konfirmasi:
          </label>
          <input
            v-model="verifyInput"
            type="text"
            class="verify-input"
            :placeholder="`Ketik ${state.options.verify}`"
            autocomplete="off"
            @keyup.enter="onConfirm"
          />
          <p v-if="verifyInput && !verified" class="verify-error">Teks belum cocok. Ketik persis seperti diminta.</p>
        </div>

        <div class="confirm-actions">
          <button type="button" class="btn-cancel" @click="closeConfirm(false)">
            {{ state.options.cancelText || 'Batal' }}
          </button>
          <button
            type="button"
            class="btn-confirm"
            :class="{ danger: state.options.danger }"
            :disabled="!verified"
            @click="onConfirm"
          >
            {{ state.options.confirmText || 'Ya, Hapus' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  animation: fade-in 0.15s ease;
}
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }

.confirm-dialog {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 26px 28px;
  width: 440px;
  max-width: 100%;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: pop-in 0.18s ease;
}
@keyframes pop-in { from { transform: scale(0.96) translateY(6px); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.confirm-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 148, 103, 0.15);
  color: var(--olive-primary);
  flex-shrink: 0;
}
.confirm-icon.danger {
  background: rgba(239, 68, 68, 0.12);
  color: var(--red-orange);
}

.confirm-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--text-primary);
  line-height: 1.35;
}
.confirm-message {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: var(--leading-relaxed);
}

.related-list {
  background: var(--bg-main);
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.related-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--red-orange);
  margin-bottom: 2px;
}
.related-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
.related-count {
  font-weight: var(--font-bold);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  padding: 1px 10px;
  font-size: var(--text-xs);
}

.verify-box { display: flex; flex-direction: column; gap: 6px; }
.verify-label { font-size: var(--text-xs); color: var(--text-secondary); }
.verify-label strong { color: var(--red-orange); }
.verify-input {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--border-medium);
  border-radius: 8px;
  font-size: var(--text-sm);
  color: var(--text-primary);
  background: var(--bg-card);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.verify-input:focus { outline: none; border-color: var(--red-orange); box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15); }
.verify-error { font-size: var(--text-xs); color: var(--red-orange); }

.confirm-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 4px;
}
.btn-cancel {
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  padding: 9px 20px;
  border-radius: 8px;
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover { background: var(--bg-hover); color: var(--text-primary); }

.btn-confirm {
  background: var(--olive-primary);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  padding: 9px 20px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-confirm:hover:not(:disabled) { background: var(--olive-dark); }
.btn-confirm.danger { background: var(--red-orange); }
.btn-confirm.danger:hover:not(:disabled) { background: var(--red-orange-dark); }
.btn-confirm:disabled { opacity: 0.45; cursor: not-allowed; }
</style>
