import { prisma } from '~~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const auth = event.context.auth as { studentId: string }
  const myMemberEkskulIds = (
    await prisma.member.findMany({ where: { studentId: auth.studentId }, select: { extracurricularId: true } })
  ).map(m => m.extracurricularId)
  const schedules = await prisma.schedule.findMany({
    where: { extracurricularId: { in: myMemberEkskulIds } },
    include: { extracurricular: { select: { name: true } } },
    orderBy: [{ day: 'asc' }, { timeStart: 'asc' }],
  })
  const grouped: Record<string, any[]> = {}
  const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  for (const d of dayOrder) grouped[d] = []
  for (const s of schedules) {
    const day = s.day || 'Lainnya'
    if (!grouped[day]) grouped[day] = []
    grouped[day].push({
      time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
      date: s.date ? s.date.toISOString().slice(0, 10) : null,
      ekskul: s.extracurricular.name,
      coach: s.coach,
      location: s.location,
    })
  }
  return grouped
})
