# Rencana Implementasi — Game Tracing & Maze – Keluargaku

## Arah produk
MVP React statis berbahasa Indonesia untuk anak TK/PAUD: sebuah perjalanan belajar bertema keluarga yang menggabungkan tracing dan maze dalam antarmuka yang lembut, cerah, dan mudah disentuh. Semua game berjalan di sisi klien tanpa akun, backend, atau dependensi aset eksternal sehingga mudah dipublikasikan ke Netlify.

## Design system
- **Design movement:** playful neo-craft / modern kindergarten learning UI — bidang warna seperti kertas, outline tebal, kartu berujung bulat, dan ornamen bintang yang terasa dibuat untuk anak.
- **Core principles:** (1) satu fokus per layar, (2) CTA besar dan mudah diketuk, (3) feedback selalu positif, (4) visual membantu arah bermain tanpa membuat halaman ramai.
- **Color philosophy:** mint dan krem menjadi kanvas aman; coral memberi energi pada aksi; kuning menjadi penanda reward; teal menjadi warna jejak keberhasilan. Kontras dijaga pada teks dan outline.
- **Layout paradigm:** perjalanan berbentuk “storybook path”: panel utama di tengah dengan progress rail kecil di sisi/atas, lalu kartu level sebagai titik-titik perjalanan, bukan dashboard padat.
- **Signature elements:** pita judul bergelombang, badge bintang untuk progress, dan ilustrasi keluarga berbasis bentuk sederhana/emoji sebagai karakter ramah.
- **Interaction philosophy:** anak mencoba dulu, sistem membimbing lembut saat melenceng, tidak memakai bahasa gagal. Level berikutnya selalu terlihat sebagai ajakan.
- **Animation:** float pelan pada ornamen, pop pada kartu, confetti/bintang saat sukses, dan pulse pada START/FINISH. Animasi singkat, tidak mengganggu tracking.
- **Typography:** `Nunito`/`Arial Rounded`/system rounded untuk headline besar; system sans-serif untuk body. Headline memakai huruf besar singkat, body maksimal 2–3 baris per blok.
- **Brand essence:** “Teman bermain digital untuk mengenal keluarga sambil melatih tangan dan fokus.” Personality: hangat, ceria, sabar.
- **Brand voice:** CTA berbunyi “Ayo mulai!”, “Pilih petualangan”, “Coba lagi pelan-pelan.” Contoh apresiasi: “Hebat! Jejakmu rapi.” dan “Kamu menemukan jalannya!”
- **Wordmark & logo:** wordmark pita kuning dengan medali bintang kecil dan dua titik mata pada ikon jejak; diwujudkan lewat `brand-mark` CSS, bukan gambar generik.
- **Signature brand color:** `#F47C62` coral hangat yang dipakai pada tombol aksi dan jejak start.

## Struktur proyek
- `index.html` — shell HTML dan mount point React.
- `src/main.jsx` — state game, data 10 tracing + 5 maze, komponen UI, canvas tracing, maze interaction, audio feedback.
- `src/styles.css` — token warna, responsive layout, ilustrasi/ornamen, animasi, state komponen.
- `public/manus-routes.json` — manifest route untuk preview.
- `netlify.toml` — static build dan SPA fallback untuk Netlify.
- `app.config.ts` — metadata logo proyek.
- `TODO.md` — kriteria outcome yang diturunkan dari brief.

## Implementasi teknis
- Vite + React, JavaScript agar setup ringan.
- Canvas tracing menggunakan pointer events sehingga mendukung mouse, stylus, dan touch. Guide path memakai koordinat normalisasi agar adaptif terhadap ukuran layar.
- Maze menggunakan grid 8×6 dan jalur valid berurutan. Pointer hanya boleh melangkah ke sel tetangga yang benar; jalan buntu memberi feedback lembut dan reset.
- Progress level dan status selesai disimpan di `localStorage` dengan guard aman untuk browser.
- Audio sukses memakai Web Audio API sederhana; aplikasi tetap berfungsi tanpa audio.
- Tidak ada server atau database; build menghasilkan `dist/` yang bisa dipasang sebagai situs statis.
