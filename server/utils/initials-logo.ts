import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

// ===== Logo inisial otomatis =====
// Saat admin menambahkan ekskul TANPA mengunggah logo, buatkan logo SVG
// berisi inisial nama secara otomatis (mis. "Palang Merah Remaja" → "PMR").
// Warna diturunkan stabil dari nama (hash), jadi nama yang sama selalu
// menghasilkan warna yang sama.

const LOGO_DIR = join(process.cwd(), 'public', 'logos')
const FALLBACK_COLORS = [
  '#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#F43F5E', '#8B5CF6',
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#06B6D4', '#84CC16',
]

/** Inisial dari nama ekskul: kata majemuk → huruf pertama tiap kata (PMR);
 *  satu kata → 2-3 huruf pertama (Basket → BAS). */
export function initialsOf(name: string): string {
  const clean = name.trim().replace(/\s+/g, ' ')
  const words = clean.split(' ')
  if (words.length > 1) {
    return words.map(w => w[0] ?? '').join('').toUpperCase().slice(0, 4)
  }
  return clean.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 3) || 'EK'
}

/** Hash sederhana string → indeks warna stabil. */
function colorIndex(name: string): number {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) >>> 0
  }
  return h % FALLBACK_COLORS.length
}

/** Buat file logo inisial di public/logos/ dan kembalikan URL-nya.
 *  Mengembalikan null jika gagal menulis (mis. folder tidak bisa ditulis). */
export async function generateInitialsLogo(name: string): Promise<string | null> {
  const initials = initialsOf(name)
  const color = FALLBACK_COLORS[colorIndex(name)]!
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'ekskul'
  const filename = `initials-${slug}.svg`
  const url = `/logos/${filename}`

  // SVG 120×120, rounded rect gradasi warna + inisial putih — tampil bulat
  // di avatar aplikasi (object-fit: cover) dengan rapi.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${color}"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0.72"/>
    </linearGradient>
  </defs>
  <rect width="120" height="120" rx="24" fill="url(#g)"/>
  <text x="60" y="60" font-family="Arial, 'Segoe UI', sans-serif" font-size="${initials.length > 2 ? 34 : 42}" font-weight="bold" fill="#FFFFFF" text-anchor="middle" dominant-baseline="central">${initials}</text>
</svg>
`

  try {
    await writeFile(join(LOGO_DIR, filename), svg, 'utf8')
    return url
  } catch {
    // Folder tidak bisa ditulis — biarkan logo kosong (UI punya fallback ikon).
    return null
  }
}
