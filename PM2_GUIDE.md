# 🚀 Quick Start - Deploy Lokal dengan PM2

## ✅ Cara Paling Mudah & Stabil

### 1. Install PM2
```powershell
npm install -g pm2
```

### 2. Jalankan Bot 24/7
```powershell
# Jalankan bot
pm2 start ecosystem.config.js

# Atau langsung:
pm2 start index.js --name wa-bot
```

### 3. Command PM2 yang Berguna

```powershell
# Lihat status bot
pm2 status

# Lihat logs real-time
pm2 logs wa-bot

# Stop bot
pm2 stop wa-bot

# Restart bot
pm2 restart wa-bot

# Delete bot dari PM2
pm2 delete wa-bot

# Auto-start saat PC nyala
pm2 startup
pm2 save
```

### 4. Scan QR Code
Setelah jalankan `pm2 start`, lihat logs:
```powershell
pm2 logs wa-bot --lines 100
```
Scan QR code yang muncul!

## 🎯 Keuntungan PM2:
- ✅ Bot jalan 24/7 di background
- ✅ Auto-restart kalau crash
- ✅ Session tetap tersimpan (gak hilang)
- ✅ Monitoring mudah
- ✅ Log tersimpan

## 📊 Monitoring
```powershell
# Monitor resource usage
pm2 monit

# Dashboard web
pm2 plus
```

---

**💡 Rekomendasi:** Pakai PM2 di laptop/PC kamu yang nyala 24/7, lebih stabil dari cloud platform gratis!
