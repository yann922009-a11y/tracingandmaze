# TODO — Outcome Produk

## 1. Shell aplikasi dan menu utama
- [ ] Aplikasi React menampilkan judul “Game Tracing & Maze – Keluargaku” dan tema “AYO MENGENAL KELUARGA SAMBIL BERMAIN!”.
- [ ] Menu utama menyediakan tombol GAME, MATERI, PETUNJUK, dan KELUAR, dengan ilustrasi keluarga kartun yang cerah, lucu, ramah, dan tidak terlalu ramai.
- [ ] Tampilan responsif untuk HP, tablet, dan komputer, dengan font besar, bulat, mudah dibaca, outline objek jelas, dan tombol besar.

## 2. Materi dan petunjuk
- [ ] Halaman Materi menjelaskan Tracing: mengikuti garis/bentuk/pola dengan jari atau mouse untuk melatih koordinasi mata-tangan, ketelitian, kerapian, dan kemampuan menulis dasar.
- [ ] Halaman Materi menjelaskan Maze: mencari jalan yang benar menuju tujuan untuk melatih fokus, kesabaran, menentukan arah, dan pemecahan masalah.
- [ ] Halaman Petunjuk menjelaskan langkah singkat untuk memilih game, memulai, mengikuti jalur, mengulang, kembali, dan melanjutkan level untuk kedua mode.

## 3. Mode Tracing
- [ ] Mode Tracing menyediakan 10 level: garis horizontal, vertikal, diagonal, zig-zag, melengkung, bergelombang, lingkaran, Ayah & Ibu, Kakek & Nenek, dan Rumah Keluarga.
- [ ] Anak dapat tracing dengan touch/mouse, melihat titik START/FINISH, indikator progres, tombol START, Ulangi/Restart, dan Kembali.
- [ ] Jalur tracing tervalidasi secara bertahap; ketika keluar jalur aplikasi memberi feedback lembut “Coba ikuti garisnya lagi.” dan mengizinkan percobaan ulang.

## 4. Mode Maze
- [ ] Mode Maze menyediakan 5 level bertahap: Anak → Ibu, Anak → Ayah, Kakak → Adik, Kakek/Nenek → Rumah, dan Semua Keluarga → Rumah.
- [ ] Setiap maze memiliki percabangan/jalur berliku/jalan buntu yang tetap dapat diselesaikan anak TK, serta titik START dan FINISH yang jelas.
- [ ] Saat masuk jalan buntu aplikasi memberi feedback sederhana dan tombol “Coba Lagi” tanpa membuat anak merasa gagal.

## 5. Feedback, penghargaan, dan persistensi
- [ ] Ketika level selesai aplikasi memberi animasi, efek audio sederhana jika tersedia, dan apresiasi seperti “Hebat!”, “Bagus sekali!”, “Kamu berhasil!”, “Luar biasa!”, atau “Ayo lanjut ke level berikutnya!”.
- [ ] Setelah semua 15 level selesai aplikasi menampilkan halaman penghargaan “SELAMAT! Kamu sudah menyelesaikan semua permainan!” dengan bintang, confetti, dan keluarga tersenyum.
- [ ] Progress level tersimpan di browser agar perjalanan anak tidak hilang saat halaman dibuka kembali.

## 6. Distribusi
- [ ] Proyek memakai build statis React yang dapat dijalankan di Netlify dengan SPA fallback.
- [ ] Manifest route `/manus-routes.json` tersedia dan menggambarkan route aplikasi.
