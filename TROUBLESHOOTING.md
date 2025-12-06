# 🔧 Troubleshooting Guide - NutriScan AR

## ⚠️ Error: "Failed to initialize AR. Please check camera permissions"

### Penyebab Umum:

1. **Permission Kamera Tidak Diberikan**
2. **Browser Tidak Support WebAR**
3. **HTTPS Tidak Aktif** (wajib untuk production)
4. **iOS Safari Settings Memblokir Kamera**

---

## 📱 Solusi untuk iOS (iPhone/iPad)

### Langkah 1: Izinkan Akses Kamera di Safari

1. Buka **Settings** (Pengaturan) di iPhone
2. Scroll ke bawah, pilih **Safari**
3. Cari **Camera** - pastikan set ke **Ask** atau **Allow**
4. Pastikan **Motion & Orientation Access** juga di-enable

### Langkah 2: Bersihkan Cache & Reload

1. Buka Safari
2. Tutup semua tab
3. Settings → Safari → **Clear History and Website Data**
4. Buka ulang `https://nutriscanid.vercel.app`
5. Ketika popup muncul, tap **Allow** untuk camera access

### Langkah 3: Test di Chrome iOS (Alternatif)

1. Install **Chrome** dari App Store
2. Buka link di Chrome iOS
3. Allow camera permission

---

## 🤖 Solusi untuk Android

### Langkah 1: Izinkan Permission di Chrome

1. Buka Chrome
2. Akses `https://nutriscanid.vercel.app`
3. Ketika popup "Allow camera", tap **Allow**
4. Jika tidak muncul popup:
   - Tap ikon **🔒** (lock/info) di address bar
   - Pilih **Site Settings**
   - Set **Camera** ke **Allow**

### Langkah 2: Clear Site Data

1. Chrome → Menu (3 dots) → **Settings**
2. **Privacy and Security** → **Site Settings**
3. Cari site Anda → **Clear & Reset**
4. Reload page

---

## 💻 Test di Localhost (Development)

### Masalah: HTTPS Required

Camera API memerlukan **HTTPS** atau **localhost**.

#### Solusi untuk Laragon:

1. **Akses via localhost** (sudah support camera):

   ```
   http://localhost/NutriScan%20AR/
   ```

2. **Enable HTTPS di Laragon**:

   - Klik kanan Laragon tray icon
   - Menu → **Apache** → **SSL** → **Enabled**
   - Akses: `https://localhost/NutriScan%20AR/`

3. **Akses dari HP di network yang sama**:
   - Cek IP Windows: `ipconfig` (misal: `192.168.1.100`)
   - Akses dari HP: `http://192.168.1.100/NutriScan%20AR/`
   - **Note**: HTTP via IP akan gagal di iOS. Gunakan ngrok untuk HTTPS.

---

## 🌐 Solusi untuk Vercel Deployment

### Pastikan HTTPS Aktif

✅ Vercel otomatis provide HTTPS
✅ URL: `https://nutriscanid.vercel.app`

### Jika Masih Error:

1. **Check Console Browser**:

   - Buka Developer Tools (F12 atau inspect)
   - Lihat tab **Console** untuk error details

2. **Verifikasi File Ter-upload Lengkap**:

   ```
   ✓ index.html
   ✓ app.js
   ✓ style.css
   ✓ data/nutrition.json
   ✓ assets/markers/*.svg
   ✓ assets/icons/*.svg
   ✓ vercel.json
   ```

3. **Redeploy**:
   - Push update ke GitHub
   - Vercel akan auto-redeploy

---

## 🧪 Test Camera Permission

Buat file test sederhana `camera-test.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Camera Test</title>
  </head>
  <body>
    <h1>Camera Permission Test</h1>
    <video id="video" width="100%" autoplay playsinline></video>
    <p id="status">Requesting camera...</p>

    <script>
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: "environment" },
        })
        .then((stream) => {
          document.getElementById("video").srcObject = stream;
          document.getElementById("status").textContent = "✅ Camera working!";
        })
        .catch((err) => {
          document.getElementById("status").textContent =
            "❌ Error: " + err.message;
        });
    </script>
  </body>
</html>
```

Upload ke Vercel dan test. Jika ini work, berarti masalah di MindAR.

---

## 🔍 Common Error Messages

| Error                                            | Cause                      | Solution                               |
| ------------------------------------------------ | -------------------------- | -------------------------------------- |
| `NotAllowedError`                                | User denied permission     | Allow camera in browser settings       |
| `NotFoundError`                                  | No camera detected         | Use device with camera                 |
| `NotReadableError`                               | Camera in use by other app | Close other apps using camera          |
| `SecurityError`                                  | Non-HTTPS context          | Use HTTPS or localhost                 |
| `TypeError: Cannot read properties of undefined` | MindAR not loaded          | Check internet connection, reload page |

---

## 📋 Checklist Sebelum Deploy

- [ ] Test di localhost dulu
- [ ] Pastikan camera permission granted
- [ ] Verifikasi HTTPS aktif (Vercel auto)
- [ ] Test di real device (bukan emulator)
- [ ] Check console untuk error
- [ ] Pastikan lighting cukup untuk scan marker
- [ ] Print marker minimal 10cm x 10cm

---

## 🆘 Masih Error?

### Debug Mode

Edit `app.js`, tambahkan logging:

```javascript
console.log("Step 1: Checking secure context:", window.isSecureContext);
console.log("Step 2: Checking mediaDevices:", navigator.mediaDevices);
// dst...
```

### Contact Support

Jika masih error setelah semua solusi:

1. Screenshot error message
2. Screenshot browser console (F12)
3. Info device & browser version
4. Langkah yang sudah dicoba

---

**Good Luck! 🚀**
