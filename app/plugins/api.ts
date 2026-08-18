/**
 * Plugin ini menyisipkan token JWT (Bearer) ke SEMUA panggilan $fetch di browser.
 * Sebelumnya hampir semua request data (settings, users, dashboard, dll.) gagal 401
 * karena token tidak pernah dikirim. Dengan override global $fetch, seluruh aplikasi
 * ikut terautentikasi secara otomatis.
 */
export default defineNuxtPlugin(() => {
  // Token disimpan di localStorage — hanya relevan di browser.
  if (!process.client) return

  const publicRoutes = ['/api/auth/login', '/api/auth/register', '/api/auth/check-nis']

  // Hindari redirect 401 berulang-ulang saat banyak request gagal bersamaan.
  let redirectingToLogin = false

  const apiFetch = $fetch.create({
    onRequest({ request, options }) {
      const url = typeof request === 'string' ? request : (request as Request)?.url || ''
      // Hanya sisipkan token untuk request ke API lokal (relatif / same-origin)
      // agar token tidak bocor ke domain lain.
      const isLocal = url.startsWith('/') || url.startsWith(window.location.origin)
      if (!isLocal) return
      const token = localStorage.getItem('eh_token')
      if (token) {
        options.headers = {
          ...(options.headers as Record<string, string> || {}),
          Authorization: `Bearer ${token}`
        }
      }
    },
    onResponseError({ response, request }) {
      const url = typeof request === 'string' ? request : (request as Request)?.url || ''
      const isPublic = publicRoutes.some(r => url.startsWith(r))
      // Token tidak valid / kadaluarsa → kembali ke halaman login
      if (response.status === 401 && url.startsWith('/api/') && !isPublic) {
        localStorage.removeItem('eh_token')
        localStorage.removeItem('eh_user')
        localStorage.removeItem('eh_institution')
        document.cookie = 'eh_token=; path=/; max-age=0'
        if (!redirectingToLogin && window.location.pathname !== '/login') {
          redirectingToLogin = true
          window.location.href = '/login'
        }
      }
    }
  })

  // Override global $fetch Nuxt (auto-import merujuk ke globalThis.$fetch)
  globalThis.$fetch = apiFetch
})
