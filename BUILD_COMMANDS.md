# 📦 Build & Start Commands untuk Deploy

## 🌐 Render

### Di Web Dashboard:
Saat setup web service di Render, isi seperti ini:

**Build Command:**
```bash
npm install --production
```
atau
```bash
npm ci --production
```

**Start Command:**
```bash
node index.js
```

### Pakai render.yaml (Auto):
File `render.yaml` sudah ada di project, jadi saat connect GitHub, Render otomatis detect settings-nya.

---

## 🚀 Heroku

### Procfile
Buat file `Procfile` (tanpa extension):
```
worker: node index.js
```

**Build otomatis** dari `package.json` → `npm install`

---

## 🖥️ Railway

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npm start
```

---

## ⚙️ Manual di VPS

```bash
# Install dependencies
npm install --production

# Jalankan dengan PM2
pm2 start index.js --name wa-bot

# Atau langsung
node index.js
```

---

## 📝 package.json Scripts

Sudah saya tambahkan script di `package.json`:

```json
"scripts": {
  "start": "node index.js",
  "dev": "node index.js"
}
```

Jadi bisa pakai:
```bash
npm start
```

---

## ⚠️ PENTING untuk WhatsApp Bot

**Render/Heroku akan restart container secara periodik**, yang artinya:
- ❌ Session hilang
- ❌ Harus scan QR lagi
- ❌ File `session/` tidak persistent

**Solusi:**
1. Pakai **VPS** (recommended)
2. Pakai **PM2 di laptop** sendiri
3. Setup **persistent storage** (advanced, perlu config tambahan)

---

## 🔍 Troubleshooting

### Error: Cannot find module
**Cause:** Dependencies tidak terinstall
**Fix:** 
```bash
npm install
```

### Error: Port already in use
**Cause:** Ada bot lain yang jalan
**Fix:**
```bash
# Windows
Get-Process node | Stop-Process -Force

# Linux/Mac
killall node
```

### Bot restart terus di Render
**Normal!** Render free tier restart setiap 15 menit idle.

---

## 💡 Best Practice

### Development (Local):
```bash
node index.js
# atau
npm run dev
```

### Production (Server dengan PM2):
```bash
pm2 start ecosystem.config.js
```

### Production (Cloud Platform):
Gunakan start command dari platform:
- Render: `node index.js`
- Heroku: Procfile `worker: node index.js`
- Railway: `npm start`
