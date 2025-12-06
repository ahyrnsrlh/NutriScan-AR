# 🧪 NutriScan AR - Testing Guide

## ✅ Error 404 Fixed!

Pattern files untuk **soda**, **chicken**, dan **pizza** sudah ditambahkan.

---

## 🚀 Quick Testing (Sekarang)

### **Option 1: Test dengan Hiro Marker (Burger)** ⭐ RECOMMENDED

1. **Download Hiro Marker:**
   - Link: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png
   - Klik kanan → Save image

2. **Print atau Tampilkan:**
   - Print ke kertas (A4)
   - ATAU tampilkan di layar lain (tablet/laptop)

3. **Buka App:**
   - URL: https://nutriscanid.vercel.app
   - Izinkan camera permission

4. **Scan:**
   - Arahkan smartphone ke Hiro marker
   - Panel **"Burger Klasik"** akan muncul!
   - Test portion slider & bookmark

---

### **Option 2: Test dengan Kanji Marker (Kentang Goreng)**

1. **Download Kanji Marker:**
   - Link: https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/kanji.png

2. **Print/Tampilkan** seperti Hiro marker

3. **Scan:**
   - Panel **"Kentang Goreng"** akan muncul!

---

### **Option 3: Test dengan Custom Pattern (Soda/Chicken/Pizza)**

⚠️ **NOTE:** Pattern soda/chicken/pizza saat ini adalah **placeholder** dan belum di-train dengan gambar spesifik.

Untuk test custom pattern:

1. **Generate Marker Image** terlebih dahulu
2. Ikuti panduan di `MARKER_GUIDE.md`
3. Train pattern dengan gambar Anda
4. Replace file `.patt` di `assets/markers/`

---

## 📱 Testing Checklist

Saat testing, verifikasi:

- [ ] **Camera aktif** setelah izin diberikan
- [ ] **Marker terdeteksi** dalam 1-2 detik
- [ ] **Nutrition panel muncul** dengan data benar
- [ ] **Portion slider** update semua nilai real-time
- [ ] **Warning badges** muncul jika threshold terlewati
- [ ] **Bookmark button** save/remove dari localStorage
- [ ] **Modal bookmarks** bisa dibuka/ditutup
- [ ] **Panel tetap stabil** saat marker bergerak sedikit
- [ ] **Grace period** 1.5 detik saat marker hilang

---

## 🐛 Troubleshooting

### Problem: Marker tidak terdeteksi

**Cek:**
1. Marker cukup terang (good lighting)
2. Marker minimum 10x10 cm
3. Jarak kamera: 20-50 cm
4. Marker flat (tidak bengkok)
5. Camera fokus (tidak blur)

**Solution:**
- Tambah lampu
- Print marker lebih besar
- Stabilkan tangan
- Perpendicular angle (90°)

### Problem: Detection lambat

**Solution:**
- Gunakan Hiro/Kanji marker (sudah optimized)
- Improve lighting
- Gunakan device yang lebih powerful

### Problem: Panel goyang

**Solution:**
- Stabilkan marker
- Print marker dengan quality tinggi
- Laminating marker untuk permukaan smooth

---

## 🎯 Testing Flow

```
1. Buka app di smartphone
   ↓
2. Allow camera permission
   ↓
3. Print Hiro marker
   ↓
4. Hold marker steady (20-30cm distance)
   ↓
5. Wait 1-2 seconds
   ↓
6. ✅ Panel muncul dengan "Burger Klasik" data
   ↓
7. Test features:
   - Adjust portion slider
   - Check warning badges
   - Bookmark item
   - View bookmarks modal
   ↓
8. Move marker away → Panel hilang setelah 1.5s
   ↓
9. Bring marker back → Panel muncul lagi
```

---

## 📊 Expected Results

### Hiro Marker → Burger Klasik
```
✅ Nama: Burger Klasik
✅ Serving: 1 burger (200 g)
✅ Kalori: 520 kcal
✅ Protein: 22 g
✅ Lemak: 30 g
✅ Karbohidrat: 40 g
✅ Gula: 8 g
✅ Natrium: 950 mg
⚠️ Warning: Natrium Tinggi (>800mg)
```

### Kanji Marker → Kentang Goreng
```
✅ Nama: Kentang Goreng
✅ Serving: 1 porsi medium (117 g)
✅ Kalori: 365 kcal
✅ Protein: 4 g
✅ Lemak: 17 g
✅ Karbohidrat: 48 g
✅ Gula: 0 g
✅ Natrium: 246 mg
(No warnings at default portion)
```

---

## 🎨 Custom Marker Generation (For Production)

Untuk production dengan branding sendiri:

### Step 1: Design Marker Image
- Format: PNG (512x512 px minimum)
- High contrast (hitam & putih)
- Unique pattern (logo makanan)
- Avoid: gradients, blur, low contrast

### Step 2: Generate Pattern
1. Buka: https://ar-js-org.github.io/AR.js/three.js/examples/marker-training/examples/generator.html
2. Upload marker image
3. Download `.patt` file
4. Rename: `pattern-namaFood.patt`

### Step 3: Replace Placeholder
```bash
# Backup old pattern
mv assets/markers/pattern-soda.patt assets/markers/pattern-soda.patt.backup

# Upload new pattern
# Copy your-new-pattern.patt → assets/markers/pattern-soda.patt
```

### Step 4: Test
1. Print new marker
2. Deploy ke Vercel (auto-deploy dari GitHub)
3. Test detection
4. Adjust jika perlu (brightness, size, contrast)

---

## 📸 Marker Tips

### ✅ Good Marker Design:
- High contrast edges
- Asymmetric pattern (agar beda dari semua angle)
- Clear features (easy to distinguish)
- Non-reflective surface when printed

### ❌ Bad Marker Design:
- All black or all white
- Symmetric patterns (hard to track rotation)
- Low contrast
- Too complex (banyak detail kecil)
- Reflective/glossy surface

---

## 🚀 Production Deployment

Setelah semua test passed:

1. **Generate custom markers** untuk semua 5 makanan
2. **Replace placeholder patterns** di `assets/markers/`
3. **Test ulang** semua markers
4. **Print markers** dengan quality tinggi
5. **Deploy final** ke Vercel
6. **Document** marker usage untuk end users

---

## 📞 Support

Jika masih ada error:

1. Check browser console (F12)
2. Verify file paths benar
3. Test dengan Hiro marker dulu (proven to work)
4. Report issue di GitHub dengan:
   - Device info
   - Browser version
   - Console error screenshot

---

## 🎉 Current Status

✅ **All markers configured:**
- Hiro (Burger) - Preset AR.js
- Kanji (Kentang) - Preset AR.js
- Soda - Placeholder pattern
- Chicken - Placeholder pattern
- Pizza - Placeholder pattern

✅ **All features working:**
- AR detection
- Nutrition display
- Portion adjustment
- Health warnings
- Bookmarks

✅ **Deployed & Live:**
- https://nutriscanid.vercel.app

**Next:** Generate custom markers untuk branding! 🎨

---

*Happy Testing! 🧪*
