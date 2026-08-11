import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string; userId: string; studentId?: string }
  const posts = await prisma.feedPost.findMany({
    where: { institutionId: auth.institutionId },
    include: {
      comments: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'asc' },
      },
      likes: { where: { userId: auth.userId }, select: { id: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { date: 'desc' },
  })
  return posts.map(p => ({
    id: p.id,
    type: p.type,
    title: p.title,
    content: p.content,
    author: p.author,
    avatar: p.avatar || p.author.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
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
