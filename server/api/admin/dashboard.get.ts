import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { institutionId: string }
  const instId = auth.institutionId

  const [students, classes, teachers, ekskuls, operators, logs, todaySchedule] = await Promise.all([
    prisma.student.count({ where: { institutionId: instId } }),
    prisma.class.count({ where: { institutionId: instId } }),
    prisma.teacher.count({ where: { institutionId: instId } }),
    prisma.extracurricular.count({ where: { institutionId: instId } }),
    prisma.user.count({ where: { institutionId: instId, role: 'operator', status: 'active' } }),
    prisma.activityLog.findMany({
      where: { institutionId: instId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true } } }
    }),
    prisma.schedule.findMany({
      where: { institutionId: instId, day: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] },
      include: { extracurricular: { select: { name: true } } },
      take: 5
    })
  ])

  return {
    students,
    classes,
    teachers,
    extracurriculars: ekskuls,
    activeOperators: operators,
    remainingQuota: 1288,
    todaySchedule: todaySchedule.map(s => ({
      id: s.id,
      time: `${s.timeStart} - ${s.timeEnd || 'selesai'}`,
      title: `Ekskul ${s.extracurricular.name} - ${s.coach}`
    })),
    activityLogs: logs.map(l => ({
      id: l.id,
      actor: l.user.name,
      action: l.action,
      timestamp: l.createdAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    }))
  }
})
