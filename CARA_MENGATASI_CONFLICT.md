# 🔧 Cara Mengatasi Error 440 (Conflict)

## ❗ Masalah
Bot terus disconnect dengan error **440 (conflict)** - artinya ada **device lain** yang menggunakan WhatsApp session yang sama.

## ✅ Solusi

### Langkah 1: Logout Semua Device
1. **Buka WhatsApp** di HP kamu
2. Klik **menu titik 3 (⋮)** di pojok kanan atas
3. Pilih **"Linked Devices"** atau **"Perangkat Tertaut"**
4. **LOGOUT/HAPUS SEMUA** device yang terhubung:
   - WhatsApp Web di browser
   - WhatsApp Desktop
   - Bot lama
   - Device lainnya

### Langkah 2: Jalankan Bot Fresh
```powershell
# Stop semua bot yang running
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Hapus session lama
Remove-Item -Path "session" -Recurse -Force
New-Item -ItemType Directory -Path "session" -Force

# Jalankan bot
node index.js
```

### Langkah 3: Scan QR Code
- Bot akan menampilkan QR code
- Scan dengan WhatsApp di HP
- Tunggu sampai muncul **"✅ BOT TERHUBUNG!"**

## 📝 Fitur Bot

### Filter Otomatis
✅ **Hanya respond private chat** - pesan dari grup otomatis di-skip

### Command yang Tersedia
- `.ping` - Cek bot aktif
- `.brat <text>` - Generate sticker dengan text

### User yang Diizinkan
Edit di `index.js` line 13-16:
```javascript
const allowedUsers = [
  "39101566845165@lid",  // Ganti dengan ID kamu
  "6281234567890@s.whatsapp.net"
]
```

## 🔍 Tips
- Pastikan **hanya 1 bot yang jalan**
- Jangan buka WhatsApp Web saat bot aktif
- Kalau masih conflict, logout semua device di HP lalu scan ulang
