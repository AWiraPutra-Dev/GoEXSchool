import { c as defineEventHandler, k as setHeader } from '../../../../_/nitro.mjs';
import XLSX from 'xlsx';
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

const template_get = defineEventHandler(async (event) => {
  const wb = XLSX.utils.book_new();
  const wsData = [
    ["Nama Lengkap", "Kelas", "Jenis Kelamin", "Telepon"],
    ["Contoh: Ahmad Rizki", "11 IPA 1", "L", "081234567890"],
    ["Contoh: Siti Nurhaliza", "11 IPA 2", "P", ""]
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!cols"] = [
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 }
  ];
  XLSX.utils.book_append_sheet(wb, ws, "Template");
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  setHeader(event, "Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  setHeader(event, "Content-Disposition", 'attachment; filename="template-import-siswa.xlsx"');
  return buf;
});

export { template_get as default };
//# sourceMappingURL=template.get.mjs.map
