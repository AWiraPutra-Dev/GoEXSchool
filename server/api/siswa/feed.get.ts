import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string; studentId?: string }
  const posts = await prisma.feedPost.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      extracurricular: { select: { name: true } },
      comments: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'asc' },
      },
      likes: { where: { userId: auth.userId }, select: { id: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { date: 'desc' },
  })
  const initialsOf = (name: string) => name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  // Field avatar dipakai untuk menampilkan inisial penulis. Jika berisi path file
  // (mis. '/avatars/coach-budi.png'), jangan dibocorkan ke UI — pakai inisial nama.
  const safeAvatar = (avatar: string | null, author: string) =>
    avatar && !avatar.includes('/') && avatar.length <= 3 ? avatar : initialsOf(author)
  return posts.map(p => ({
    id: p.id,
    type: p.type,
    title: p.title,
    content: p.content,
    author: p.author,
    ekskul: p.extracurricular.name,
    avatar: safeAvatar(p.avatar, p.author),
    date: p.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + p.createdAt.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    likes: p._count.likes,
    liked: p.likes.length > 0,
    comments: p.comments.map(c => ({
      id: c.id,
      user: c.user.name,
      avatar: c.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
      text: c.text,
      time: '',
    })),
    commentCount: p._count.comments,
  }))
})
