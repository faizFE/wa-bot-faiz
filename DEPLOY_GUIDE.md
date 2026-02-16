# 🚀 Deploy WhatsApp Bot ke Render

## ⚠️ PENTING - Baca Ini Dulu!

**WhatsApp bot TIDAK DISARANKAN deploy ke Render/Heroku gratis karena:**
1. 🔄 **Container restart** → Session hilang → Harus scan QR lagi
2. 📁 **Ephemeral filesystem** → File session tidak persistent
3. ❌ **Render free tier sleep** → Bot offline setelah 15 menit idle

### ✅ Solusi yang Lebih Baik:
- **VPS murah** (Contorion, DigitalOcean, AWS EC2, dll) - Rp 50rb-100rb/bulan
- **Laptop/PC sendiri** yang selalu nyala
- **Pakai PM2** untuk auto-restart

---

## 📋 Cara Deploy ke Render (dengan risiko di atas)

### 1️⃣ Setup GitHub Repository

```powershell
# Di folder project
git init
git add .
git commit -m "Initial commit"

# Buat repo baru di GitHub, lalu:
git remote add origin https://github.com/username/wa-bot-faiz.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy ke Render

1. Buka [render.com](https://render.com)
2. Sign up/Login pakai GitHub
3. Klik **"New +"** → **"Web Service"**
4. Connect repository: `wa-bot-faiz`
5. Settings:
   - **Name:** `wa-bot-faiz`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Instance Type:** `Free`
6. Klik **"Create Web Service"**

### 3️⃣ Masalah Session di Cloud

**Render restart container = session hilang!**

**Cara mengatasinya (Advanced):**
- Pakai database untuk simpan session (PostgreSQL/MongoDB)
- Setup storage persistent (tapi Render gratis tidak support)
- Pakai pairing code instead of QR (butuh modifikasi code)

---

## 🖥️ Alternatif: Deploy Lokal dengan PM2 (RECOMMENDED)

### Install PM2
```powershell
npm install -g pm2
```

### Jalankan Bot 24/7
```powershell
# Start bot
pm2 start index.js --name wa-bot

# Status bot
pm2 status

# Log real-time
pm2 logs wa-bot

# Restart bot
pm2 restart wa-bot

# Stop bot
pm2 stop wa-bot

# Auto-start saat PC nyala
pm2 startup
pm2 save
```

### Keuntungan PM2:
- ✅ Bot jalan 24/7
- ✅ Auto-restart kalau crash
- ✅ Session tetap tersimpan
- ✅ Monitoring mudah
- ✅ Multi bot bisa jalan bersamaan

---

## 🌐 Deploy ke VPS (Paling Stabil)

### 1. Sewa VPS
- Contabo: ~€5/bulan
- DigitalOcean: $6/bulan
- Vultr: $6/bulan
- AWS EC2 t2.micro: Free tier 1 tahun

### 2. Setup VPS
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone project
git clone https://github.com/username/wa-bot-faiz.git
cd wa-bot-faiz
npm install

# Jalankan bot
pm2 start index.js --name wa-bot
pm2 startup
pm2 save
```

### 3. Scan QR Code di VPS
```bash
# Lihat logs untuk QR code
pm2 logs wa-bot
```

Bot akan tampilkan QR code di terminal VPS, scan dengan HP.

---

## 📊 Perbandingan

| Platform | Harga | Session Persistent | Recommended |
|----------|-------|-------------------|-------------|
| **Laptop/PC + PM2** | Gratis | ✅ Yes | ⭐⭐⭐⭐⭐ |
| **VPS** | $5-6/bln | ✅ Yes | ⭐⭐⭐⭐⭐ |
| **Render Free** | Gratis | ❌ No (restart = hilang) | ⭐⭐ |
| **Heroku** | $5-7/bln | ⚠️ Perlu setup khusus | ⭐⭐⭐ |

---

## 💡 Rekomendasi Saya:

1. **Untuk belajar/testing:** Pakai laptop sendiri + PM2
2. **Untuk production:** Pakai VPS murah (Contabo/DigitalOcean)
3. **Hindari:** Render/Heroku free tier untuk WhatsApp bot

---

## 🔐 Environment Variables (Kalau Deploy ke Cloud)

Buat file `.env`:
```env
NODE_ENV=production
```

Tambahkan di Render dashboard → Environment tab.

---

## 📝 Catatan

- Session folder **JANGAN** di-push ke GitHub (sudah ada di .gitignore)
- Kalau deploy ke cloud, scan QR lewat logs
- Render free tier restart setiap 15 menit idle = session hilang
- Backup folder `session` secara berkala!
