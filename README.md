# Game Tracing & Maze – Keluargaku

Media pembelajaran digital interaktif berbahasa Indonesia untuk anak TK/PAUD. Aplikasi ini adalah situs React statis dengan dua mode permainan: **Tracing** dan **Maze**.

## Menjalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Build produksi

```bash
npm run build
```

Output static berada di folder `dist`.

## Deploy ke Netlify

Repositori ini sudah memiliki `netlify.toml` dengan pengaturan `npm run build`, folder publish `dist`, dan SPA fallback ke `index.html`. Di Netlify, hubungkan repositori lalu gunakan pengaturan default dari file tersebut.

## Fitur utama

- Menu GAME, MATERI, PETUNJUK, dan KELUAR.
- 10 level tracing dengan kontrol touch/mouse.
- 5 level maze bertema keluarga dengan jalur buntu dan percabangan.
- Feedback positif, efek audio sederhana, animasi sukses, confetti, dan layar penghargaan.
- Progress tersimpan di browser melalui `localStorage`.
