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
    if (!grouped[s.day]) grouped[s.day] = []
    grouped[s.day].push({
      time: s.timeEnd ? `${s.timeStart} - ${s.timeEnd}` : s.timeStart,
      ekskul: s.extracurricular.name,
      coach: s.coach,
      location: s.location,
    })
  }
  return grouped
})
