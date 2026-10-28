# Birthday Nafa 💙

## Menjalankan
Buka `index.html` di browser (Chrome/Safari/Edge). Semua fitur utama jalan lewat `file://`.
Jika ingin server lokal: `python3 -m http.server 8000` di folder ini, lalu buka http://localhost:8000.
Font cantik dimuat dari Google Fonts (butuh internet; tanpa internet tampil dengan font cadangan).

## Semua yang diedit ada di `config.js`
Nama, usia, tanggal, isi surat (`letter`), tanda tangan surat (`letterSign`), pesan hadiah (`gift`, `giftExtra`), foto, dan lagu.

## Mengedit (hanya lewat VS Code)
Website tidak punya fitur edit/unggah; semua perubahan dilakukan di file proyek, lalu simpan (Ctrl+S) dan refresh browser.
Tips: pasang ekstensi **Live Server** di VS Code, klik kanan `index.html` → "Open with Live Server" agar halaman otomatis refresh setiap kamu menyimpan.

## Mengganti foto
Ada 5 slot: `gallery-1` sampai `gallery-3` (galeri), `letter` (foto di surat), `cover` (cover lagu).
1. Salin fotomu ke folder `images/` (mis. `gallery-1.jpg`, lebar maksimal ~1200px).
2. Buka `config.js`, ubah `src` slot yang sesuai, mis. `src: "images/gallery-1.jpg"`. Caption dan alt text juga diubah di situ.

## Mengganti lagu
Salin file ke folder `music/` (mis. `birthday-song.mp3`), lalu ubah `music.src`, `title`, `artist` di `config.js`. Gunakan lagu milikmu atau musik bebas royalti. Musik tidak autoplay; tekan tombol play.
Link streaming (YouTube/Spotify) tidak bisa diputar di pemutar ini.

## Membagikan
Kirim seluruh folder (zip) atau upload ke hosting statis gratis (Netlify Drop, GitHub Pages).
