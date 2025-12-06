# NutriScan AR - Marker Generation Guide

## 📍 Cara Membuat Custom Marker untuk Production

Aplikasi ini menggunakan **AR.js Pattern Markers** untuk mendeteksi makanan. Berikut panduan lengkap untuk membuat marker custom:

---

## 🎯 Step 1: Siapkan Gambar Marker

Untuk setiap makanan, siapkan gambar dengan kriteria:

- **Format**: PNG atau JPG
- **Ukuran**: Minimal 512x512 px, Maksimal 1024x1024 px
- **Konten**: Gambar yang mudah dibedakan (logo, ikon makanan, packaging)
- **Kontras**: Tinggi (warna terang/gelap kontras)
- **Kompleksitas**: Hindari gambar terlalu polos atau terlalu rumit

### Contoh Gambar Yang Bagus:

- Logo burger dengan outline jelas
- Ikon kentang goreng dengan detail
- Simbol minuman soda yang unik
- Packaging produk dengan desain khusus

### Yang Harus Dihindari:

- Background putih polos
- Warna yang terlalu mirip
- Gambar blur atau low quality
- Foto dengan banyak noise

---

## 🔧 Step 2: Generate Pattern File (.patt)

### Opsi A: Menggunakan AR.js Marker Training (Recommended)

1. Buka https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html

2. Upload gambar marker Anda

3. Klik "Download Marker"

4. Simpan file .patt dengan nama:

   - `pattern-burger.patt`
   - `pattern-fries.patt`
   - `pattern-soda.patt`
   - `pattern-chicken.patt`
   - `pattern-pizza.patt`

5. Letakkan file-file tersebut di folder: `assets/markers/`

### Opsi B: Menggunakan NFT (Natural Feature Tracking)

Untuk gambar yang lebih kompleks, gunakan AR.js NFT:

1. Install AR.js NFT Compiler:

```bash
npm install -g nft-marker-creator
```

2. Generate NFT marker:

```bash
nft-marker-creator --image path/to/marker-image.jpg --output assets/markers/marker-name
```

3. Update HTML untuk menggunakan NFT marker:

```html
<a-nft
  type="nft"
  url="assets/markers/marker-name"
  smooth="true"
  smoothCount="10"
  smoothTolerance=".01"
  smoothThreshold="5"
></a-nft>
```

---

## 🎨 Step 3: Print Marker untuk Testing

1. Buat dokumen A4 di Photoshop/Canva

2. Pasang gambar marker dengan ukuran:

   - **Minimum**: 10cm x 10cm
   - **Recommended**: 15cm x 15cm
   - **Maximum**: 20cm x 20cm

3. Tambahkan border hitam tebal (5-10mm) di sekeliling marker

4. Print dengan kualitas tinggi (300 DPI)

5. Laminating untuk durabilitas (optional)

---

## 📱 Step 4: Testing Marker

1. Deploy aplikasi ke server HTTPS (Vercel/Netlify)

2. Buka aplikasi di smartphone

3. Arahkan kamera ke marker yang sudah di-print

4. Verifikasi:
   - ✅ Marker terdeteksi dengan cepat (<2 detik)
   - ✅ Tracking stabil (tidak goyang)
   - ✅ Nutrition panel muncul
   - ✅ Data sesuai dengan makanan

### Troubleshooting:

- **Marker tidak terdeteksi**: Tingkatkan pencahayaan, pastikan marker flat
- **Tracking goyang**: Gunakan marker lebih besar atau improve contrast
- **Deteksi lambat**: Regenerate pattern dengan gambar yang lebih simple

---

## 🏭 Production Checklist

Sebelum launch, pastikan:

- [ ] Semua 5 marker sudah di-generate
- [ ] Pattern files (.patt) tersimpan di `assets/markers/`
- [ ] Setiap marker sudah di-test di device berbeda (Android + iOS)
- [ ] Marker printout sudah tersedia untuk user demo
- [ ] Documentation untuk user tentang cara scan marker
- [ ] Backup marker images di repository

---

## 🎯 Marker Placement Tips untuk User

Untuk hasil terbaik, instruksikan user:

1. **Pencahayaan**: Ruangan terang, hindari backlight
2. **Jarak**: 20-40 cm dari kamera
3. **Angle**: Marker tegak lurus kamera (90°)
4. **Stabilitas**: Tahan marker steady selama 1-2 detik
5. **Hindari**: Refleksi, bayangan, marker kusut

---

## 🚀 Quick Start untuk Development

Jika belum ada marker production-ready, gunakan preset Hiro marker:

```html
<a-marker preset="hiro">
  <!-- AR content here -->
</a-marker>
```

Print Hiro marker dari: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png

---

## 📚 Resources

- AR.js Documentation: https://ar-js-org.github.io/AR.js-Docs/
- Marker Generator: https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
- NFT Marker Creator: https://github.com/Carnaux/NFT-Marker-Creator
- Best Practices: https://ar-js-org.github.io/AR.js-Docs/marker-based/

---

**Next Steps:**

1. Generate marker patterns menggunakan tool di atas
2. Replace placeholder patterns di `assets/markers/`
3. Test di device fisik dengan marker printed
4. Deploy ke production!
