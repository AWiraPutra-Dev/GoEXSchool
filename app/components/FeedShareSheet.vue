<script setup lang="ts">
const props = defineProps<{ open: boolean; post: any }>()
const emit = defineEmits<{ close: [] }>()

const copied = ref(false)

const shareUrl = computed(() => {
  if (!props.post?.id) return ''
  return `${window.location.origin}${window.location.pathname}?post=${props.post.id}`
})

const shareText = computed(() => {
  if (!props.post) return ''
  const content = (props.post.content || '').slice(0, 120)
  return `${props.post.title}: ${content}`.trim()
})

async function copyLink() {
  const url = shareUrl.value
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // Fallback untuk browser non-secure context
    const ta = document.createElement('textarea')
    ta.value = url
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copied.value = true
  setTimeout(() => {
    copied.value = false
    emit('close')
  }, 1200)
}

function shareTo(platform: string) {
  const url = encodeURIComponent(shareUrl.value)
  const text = encodeURIComponent(shareText.value)
  const links: Record<string, string> = {
    whatsapp: `https://wa.me/?text=${text}%20${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    x: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
  }
  window.open(links[platform], '_blank', 'noopener,noreferrer,width=650,height=500')
  emit('close')
}

const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

async function nativeShare() {
  try {
    await navigator.share({ title: props.post?.title || '', text: shareText.value, url: shareUrl.value })
  } catch {
    // dibatalkan pengguna
  }
  emit('close')
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="share-overlay" @click.self="emit('close')">
        <div class="share-sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-title">
            <h3>Bagikan ke</h3>
            <button class="sheet-x" @click="emit('close')" aria-label="Tutup"><Icon name="i-lucide-x" class="w-4 h-4" /></button>
          </div>
          <p class="sheet-subtitle">Sebarkan postingan ini ke teman-temanmu</p>

          <div class="share-grid">
            <button class="share-item" @click="copyLink">
              <span class="share-icon" style="background: var(--olive-primary);">
                <svg v-if="!copied" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span class="share-label">{{ copied ? 'Tersalin!' : 'Salin Link' }}</span>
            </button>

            <button class="share-item" @click="shareTo('whatsapp')">
              <span class="share-icon" style="background: #25D366;">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </span>
              <span class="share-label">WhatsApp</span>
            </button>

            <button class="share-item" @click="shareTo('facebook')">
              <span class="share-icon" style="background: #1877F2;">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                </svg>
              </span>
              <span class="share-label">Facebook</span>
            </button>

            <button class="share-item" @click="shareTo('telegram')">
              <span class="share-icon" style="background: #26A5E4;">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="white">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </span>
              <span class="share-label">Telegram</span>
            </button>

            <button class="share-item" @click="shareTo('x')">
              <span class="share-icon" style="background: #14171A;">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
              </span>
              <span class="share-label">X</span>
            </button>

            <button v-if="canNativeShare" class="share-item" @click="nativeShare">
              <span class="share-icon" style="background: var(--teal-mid);">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </span>
              <span class="share-label">Lainnya</span>
            </button>
          </div>

          <button class="sheet-cancel" @click="emit('close')">Batal</button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.share-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: flex-end; justify-content: center; z-index: 1200; }
.share-sheet { background: var(--bg-card); width: 100%; max-width: 420px; border-radius: 20px 20px 0 0; padding: 12px 20px 20px; box-shadow: 0 -8px 30px rgba(0,0,0,0.15); }
.sheet-handle { width: 40px; height: 4px; border-radius: 2px; background: var(--border-light); margin: 0 auto 14px; }
.sheet-title { display: flex; align-items: center; justify-content: space-between; }
.sheet-title h3 { font-size: var(--text-md); font-weight: var(--font-bold); color: var(--text-primary); }
.sheet-x { background: none; border: none; cursor: pointer; font-size: 16px; color: var(--text-muted); padding: 4px; }
.sheet-subtitle { font-size: var(--text-xs); color: var(--text-muted); margin-top: 2px; margin-bottom: 18px; }
.share-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px 8px; }
.share-item { display: flex; flex-direction: column; align-items: center; gap: 8px; background: none; border: none; cursor: pointer; padding: 4px; border-radius: 10px; transition: background 0.15s; }
.share-item:hover { background: var(--bg-hover); }
.share-icon { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
.share-label { font-size: var(--text-xs); font-weight: var(--font-medium); color: var(--text-secondary); }
.sheet-cancel { width: 100%; margin-top: 18px; padding: 10px 0; border: none; border-radius: 10px; background: var(--bg-main); color: var(--text-primary); font-size: var(--text-sm); font-weight: var(--font-semibold); cursor: pointer; transition: background 0.15s; }
.sheet-cancel:hover { background: var(--bg-hover); }
.sheet-enter-active, .sheet-leave-active { transition: transform 0.25s ease, opacity 0.25s ease; }
.sheet-enter-from, .sheet-leave-to { transform: translateY(100%); opacity: 0; }
</style>
