import { c as defineEventHandler, f as getQuery, p as prisma } from '../../../_/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:url';
import 'jsonwebtoken';
import '@iconify/utils';
import 'node:crypto';
import 'consola';
import 'node:path';

const DAY_INDEX = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6
};
const COLOR_MANDATORY = "#2D6A6A";
const COLOR_OPTIONAL = "#D4C089";
const COLOR_MANUAL = "#4A9E9E";
const calendar_get = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  const query = getQuery(event);
  const month = String(query.month || "").match(/^\d{4}-\d{2}$/) ? String(query.month) : "";
  const now = /* @__PURE__ */ new Date();
  const firstOfMonth = month ? /* @__PURE__ */ new Date(`${month}-01T00:00:00`) : new Date(now.getFullYear(), now.getMonth(), 1);
  const year = firstOfMonth.getFullYear();
  const mon = firstOfMonth.getMonth();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const startOfMonth = new Date(year, mon, 1);
  const endOfMonth = new Date(year, mon, daysInMonth, 23, 59, 59, 999);
  let ekskulFilter = { institutionId: auth.institutionId };
  if (auth.role === "student" && auth.studentId) {
    const members = await prisma.member.findMany({
      where: { studentId: auth.studentId, status: "active" },
      select: { extracurricularId: true }
    });
    ekskulFilter = { extracurricularId: { in: members.map((m) => m.extracurricularId) } };
  }
  const [schedules, manual] = await Promise.all([
    prisma.schedule.findMany({
      where: ekskulFilter,
      include: { extracurricular: { select: { name: true } } }
    }),
    prisma.agenda.findMany({
      where: { userId: auth.userId, date: { gte: startOfMonth, lte: endOfMonth } },
      orderBy: [{ date: "asc" }, { timeStart: "asc" }]
    })
  ]);
  const auto = [];
  for (const s of schedules) {
    const dayIdx = DAY_INDEX[s.day];
    if (dayIdx === void 0) continue;
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, mon, d);
      if (date.getDay() !== dayIdx) continue;
      const dateStr = `${year}-${String(mon + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      auto.push({
        id: `schedule:${s.id}:${dateStr}`,
        source: "schedule",
        title: s.extracurricular.name,
        description: `${s.coach} \xB7 ${s.location}`,
        date: dateStr,
        timeStart: s.timeStart,
        timeEnd: s.timeEnd || "",
        location: s.location,
        coach: s.coach,
        mandatory: s.mandatory,
        color: s.mandatory ? COLOR_MANDATORY : COLOR_OPTIONAL
      });
    }
  }
  return {
    month: `${year}-${String(mon + 1).padStart(2, "0")}`,
    colors: { mandatory: COLOR_MANDATORY, optional: COLOR_OPTIONAL, manual: COLOR_MANUAL },
    events: [
      ...auto,
      ...manual.map((a) => ({
        id: a.id,
        source: "manual",
        title: a.title,
        description: a.description,
        date: a.date.toISOString().slice(0, 10),
        timeStart: a.timeStart,
        timeEnd: a.timeEnd || "",
        location: "",
        coach: "",
        mandatory: false,
        color: a.color || COLOR_MANUAL
      }))
    ]
  };
});

export { calendar_get as default };
//# sourceMappingURL=calendar.get.mjs.map
