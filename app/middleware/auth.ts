export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  if (process.client) {
    if (!auth.user) {
      await auth.restoreSession()
    }

    if (!auth.user || !auth.token) {
      return navigateTo('/login')
    }

    const rolePrefix: Record<string, string> = {
      super_admin: '/platform',
      admin: '/admin',
      operator: '/operator',
      student: '/siswa'
    }

    const allowedPrefix = rolePrefix[auth.user.role]
    if (allowedPrefix && !to.path.startsWith(allowedPrefix)) {
      return navigateTo(allowedPrefix)
    }
  }
})
