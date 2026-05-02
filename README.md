# Eco-Track — Abner Bagus

## Tentang Project
Eco-Track adalah aplikasi web yang membantu pengguna mengukur jejak karbon harian mereka berdasarkan aktivitas transportasi dan penggunaan energi. Tujuannya adalah meningkatkan kesadaran lingkungan melalui visualisasi data emisi yang interaktif dan personal.

## Masalah Iklim yang Ingin Disoroti
Banyak orang tidak menyadari seberapa besar kontribusi aktivitas sehari-hari mereka terhadap emisi karbon. Eco-Track hadir untuk menjawab pertanyaan "seberapa banyak CO2 yang aku hasilkan hari ini?" dengan cara yang mudah dipahami dan mendorong perubahan perilaku nyata melalui fitur Action Plan yang interaktif.

## Jalur Spesialisasi yang Dipilih

- [x] A1. Real-time UI Feedback 
- [x] A2. Interactive Tips (Action Plan)
- [ ] A3. Dynamic Result Display
- [ ] B1. Static File Serving
- [ ] B2. The Carbon API
- [ ] B3. Smart Validation

## Cara Menjalankan Project
1. Clone/extract project ini
2. Jalankan `npm install`
3. Jalankan dengan `node app.js` atau buka `public/index.html` langsung di browser

## Fitur Utama
- **Carbon Calculator** — hitung emisi harian berdasarkan jarak tempuh kendaraan, jam AC, dan jam laptop
- **Real-time Progress Bar** — bar kalkulator berubah warna (hijau/kuning/merah) sesuai total emisi
- **Monthly Progress** — bar di landing page terakumulasi otomatis per bulan dari localStorage
- **Action Plan Checklist** — 5 aksi nyata yang bisa dicentang, dengan pesan motivasi random per poin
- **Data Persistence** — input dan centang action plan tersimpan di localStorage, tidak hilang saat reload
- **Responsive Design** — tampilan menyesuaikan untuk mobile dan desktop

## Struktur Project

```
eco-track-project/
├── app.js               # Express server (pusat kendali backend)
├── package.json         # Metadata & daftar library (Express)
├── README.md            # Panduan project
└── public/              # Folder file statis yang diakses user
    ├── index.html       # Halaman utama aplikasi
    ├── main.js          # Logika kalkulator & manipulasi DOM
    ├── style.css        # Desain dan tata letak aplikasi
    └── background.jpg   # Gambar background
```


## Tantangan yang Dihadapi
Tantangan terbesar adalah memisahkan logika dua progress bar yang berbeda — bar kalkulator (harian, reset tiap sesi) dan bar landing page (bulanan, terakumulasi). Solusinya dengan menyimpan riwayat emisi sebagai array di localStorage dan memfilternya berdasarkan bulan berjalan menggunakan `getBulanTahunSekarang()`. Selain itu, bug fungsi duplikat `updateBarKalkulator` yang menyebabkan variabel tidak terdefinisi juga menjadi pelajaran penting tentang pentingnya menjaga kode tetap bersih dan terstruktur. Selain tantangan utama tersebut saya juga kesusahan dalam penggunaan logic JavaScript karena masih belum familiar untuk saya, oleh karena itu saya menonton video YouTube, bertanya pada AI, dan bertanya pada teman tentang logic JavaScript-nya. Untuk saya yang pengetahuan tentang web ini masih pemula, mengerjakan project ini benar-benar membantu saya mendapatkan banyak ilmu dalam dunia per web-an.
