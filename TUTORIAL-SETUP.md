# Tutorial Setup EskulHub Prototype — Dari Nol Sampai Jalan di Browser

Ikuti urutan ini persis dari atas ke bawah. Jangan skip langkah, terutama
bagian versi Node.js — supaya hasil `npm install` kamu sama persis dengan
yang sudah saya siapkan di `package.json`.

---

## 1. Install Node.js versi yang tepat

Yang dipakai untuk menyusun project ini: **Node.js 22 LTS**.

1. Buka https://nodejs.org
2. Download tombol yang bertuliskan **LTS** (bukan "Current"/"Latest").
3. Install seperti install aplikasi biasa (Next → Next → Install → Finish).
4. Restart VS Code / terminal setelah instalasi selesai (wajib, supaya PATH ter-update).
5. Cek versi, buka terminal (PowerShell/CMD/Terminal), ketik:
   ```
   node -v
   ```
   Harus muncul versi **v22.x.x**. Kalau muncul versi 16/18/20, tidak masalah besar,
   tapi kalau ada error aneh nanti, ini kandidat pertama yang perlu diupgrade.
6. Cek npm ikut terpasang:
   ```
   npm -v
   ```
   Harus muncul versi **10.x.x** ke atas.

> Kalau kamu sudah pernah install Node versi lain sebelumnya dan mau kelola
> banyak versi Node sekaligus, boleh pakai **nvm-windows** (Windows) atau
> **nvm** (Mac/Linux) — tapi ini opsional, untuk pemula install biasa saja cukup.

---

## 2. Install VS Code + Extension

1. https://code.visualstudio.com → download → install.
2. Buka VS Code, klik ikon kotak susun (Extensions) di sidebar kiri, install:
   - **Vue - Official** (publisher: Vue) — wajib, ini yang bikin file `.vue` kebaca rapi.
   - **Tailwind CSS IntelliSense** (publisher: Tailwind Labs)
   - **ESLint** (publisher: Microsoft)

---

## 3. Extract project & buka di VS Code

1. Extract file zip yang saya kirim (`eskulhub-prototype.zip`) ke folder yang gampang
   diakses, misal `D:\Project\eskulhub-prototype` atau `Documents\eskulhub-prototype`.
2. **PENTING**: perhatikan hasil extract-nya. Beberapa aplikasi zip (termasuk Windows)
   kadang membuat folder pembungkus tambahan, jadi strukturnya bisa jadi:
   ```
   eskulhub-prototype.zip
   └── eskulhub-prototype/        <- folder pembungkus dari hasil extract
       └── eskulhub-prototype/    <- folder project sebenarnya (ada package.json di sini)
   ```
   Buka folder yang **isinya langsung ada file `package.json`**, itu yang harus kamu
   buka di VS Code — bukan folder pembungkus di luarnya. Cara cek gampang: buka
   foldernya, kalau langsung terlihat file `package.json`, `nuxt.config.ts`, folder
   `app/`, `server/` — berarti sudah benar.
3. `File > Open Folder` di VS Code, pilih folder project yang benar tadi.
4. Buka terminal: `Terminal > New Terminal`.
5. Pastikan posisi terminal ada di folder yang benar, ketik:
   ```
   dir
   ```
   (Windows) atau
   ```
   ls
   ```
   (Mac/Linux). Harus terlihat file `package.json` di hasil listing-nya. Kalau tidak
   terlihat, berarti posisi terminal masih salah — pakai `cd nama-folder` untuk masuk.

---

## 4. Isi package.json (sudah saya siapkan, versi terkunci)

Ini isi `package.json` yang sudah ada di dalam project kamu — **tidak perlu diubah**,
saya tampilkan di sini supaya kamu tahu persis versi apa saja yang akan ter-install:

```json
{
  "dependencies": {
    "nuxt": "4.5.0",
    "@nuxt/ui": "3.0.0",
    "@nuxt/icon": "1.0.0",
    "@pinia/nuxt": "0.7.0",
    "pinia": "2.2.0"
  }
}
```

Semua angka versi di atas **tidak pakai simbol `^` atau `~`** — artinya versi yang
ter-install akan **persis sama**, tidak akan otomatis update ke versi lebih baru
saat kamu `npm install`. Ini sengaja dikunci supaya langkah kamu tidak beda dengan
saya (masalah yang kemarin terjadi — Prisma otomatis narik versi 7 yang baru rilis —
tidak akan terjadi lagi karena project prototype ini malah tidak pakai Prisma sama sekali).

---

## 5. Install semua dependency

Di terminal, pastikan posisi masih di folder project (ada `package.json`), lalu:

```
npm install
```

Tunggu sampai selesai (biasanya 1–3 menit tergantung koneksi internet). Yang perlu
kamu perhatikan di akhir proses:

- **Aman/normal**: baris-baris `npm warn deprecated ...` berwarna kuning. Itu cuma
  peringatan dari package pendukung yang sudah lama, tidak menghentikan proses install.
- **Bermasalah**: baris `npm error` berwarna merah di paling akhir, dan proses install
  berhenti tanpa selesai. Kalau ini terjadi, screenshot dan kirim ke saya — biasanya
  penyebabnya koneksi internet putus di tengah jalan (`ECONNRESET`), tinggal ulangi:
  ```
  npm cache clean --force
  npm install
  ```

Setelah selesai tanpa error merah, cek ada folder baru bernama `node_modules` muncul
di file explorer VS Code sebelah kiri — itu tandanya berhasil.

---

## 6. Jalankan aplikasinya

```
npm run dev
```

Tunggu sampai muncul tulisan mirip ini di terminal:

```
Nuxt 4.5.0 with Nitro
  ➜ Local:    http://localhost:3000/
```

Buka link `http://localhost:3000/login` di browser (Chrome/Edge/Firefox).

---

## 7. Cara pakai prototype-nya

Karena ini **mode prototype tanpa database**, login-nya disederhanakan:

1. Di halaman login, ada dropdown **"Login sebagai"** — pilih salah satu:
   **Admin Sekolah**, **Operator Ekskul**, atau **Siswa**.
2. Isi NIS/Username & Password **bebas apa saja** (contoh: `test` / `test`), lalu klik Masuk.
3. Kamu akan diarahkan ke dashboard sesuai role yang dipilih, lengkap dengan sidebar
   menu, data statistik, dan halaman-halaman fitur — semuanya sudah bisa diklik-klik
   untuk lihat tampilannya, walau datanya masih data contoh (belum benar-benar
   tersimpan/berubah kalau kamu edit).

Halaman yang bisa kamu eksplorasi:

| Role | Halaman |
|---|---|
| Admin | Beranda, Data Siswa, Data Ekskul |
| Operator | Beranda, Absensi (generate QR), Voting, Pengumuman & Berita |
| Siswa | Beranda, Portofolio Prestasi, Feed Komunitas |

---

## 8. Kalau mau berhenti / lanjut lagi nanti

- Berhenti: tekan `Ctrl + C` di terminal tempat `npm run dev` jalan.
- Lanjut lagi lain waktu: buka folder project di VS Code lagi, buka terminal,
  langsung `npm run dev` saja (tidak perlu `npm install` ulang, kecuali kamu
  hapus folder `node_modules`).

---

## 9. Troubleshooting Cepat

| Gejala | Solusi |
|---|---|
| `npm install` error `ECONNRESET` / network | Cek koneksi internet, lalu `npm cache clean --force` dan ulangi `npm install` |
| Halaman putih kosong / blank di browser | Lihat pesan error di terminal `npm run dev` — biasanya nyebutin file & baris errornya |
| Port 3000 sudah dipakai aplikasi lain | Jalankan `npm run dev -- --port 3001`, buka `localhost:3001` |
| Style/warna tidak muncul (tampilan polos hitam-putih) | Pastikan tidak ada error merah di terminal, coba restart `npm run dev` |
| Klik menu sidebar tapi halamannya "404" | Berarti halaman itu belum saya buatkan filenya — cek tabel di bagian 7, hanya halaman di tabel itu yang sudah ada |

---

## 10. Langkah Selanjutnya (setelah tampilan OK)

Setelah kamu puas dengan tampilan & alurnya, baru kita lanjut ke:
1. Sambungkan ke database sungguhan (Prisma + PostgreSQL) — supaya data beneran tersimpan.
2. Bikin autentikasi asli (cek NIS ke database, bukan dropdown pilihan role).
3. Bikin halaman-halaman fitur lain yang masih kosong (menu di sidebar yang belum
   ada filenya) mengikuti pola halaman yang sudah ada.

Kasih tahu saya kalau sudah sampai tahap ini, saya bantu lanjutin satu-satu.
EOF
mv /tmp/tutorial.md /home/claude/eskulhub-prototype/TUTORIAL-SETUP.md 2>/dev/null
ls /home/claude/eskulhub-prototype