# 📱 Setup WhatsApp Bot di HP Android (Termux)

## ✅ Keuntungan Pakai HP Android:
- 💰 **GRATIS!** Pakai HP bekas yang gak kepakai
- ⚡ **Hemat listrik** (5-10 watt, vs laptop 50-100 watt)
- 🔋 **HP charging terus** = bot nyala 24/7
- 📶 **Pakai WiFi rumah** atau mobile data
- 🎯 **Session tersimpan**, gak perlu scan QR lagi

---

## 📋 Yang Dibutuhkan:

1. **HP Android** (bekas/lama gpp, minimal Android 7+)
2. **Charger** untuk nyalain terus
3. **WiFi** atau kuota
4. **Termux** (app gratis dari Play Store)

---

## 🚀 Langkah-Langkah Setup:

### **1️⃣ Install Termux**

1. Buka **Play Store** di HP Android
2. Cari **"Termux"**
3. Install app **Termux** (yang ikon hitam)
4. Buka Termux

**⚠️ ATAU download dari F-Droid (lebih update):**
- Download F-Droid: https://f-droid.org/
- Install Termux dari F-Droid

---

### **2️⃣ Setup Node.js di Termux**

Copy-paste command ini **satu per satu** di Termux:

```bash
# Update package manager
pkg update -y && pkg upgrade -y

# Install Node.js dan Git
pkg install -y nodejs git

# Install build tools (untuk canvas & sharp)
pkg install -y python3 make g++ libpng libjpeg-turbo

# Cek versi Node
node -v
npm -v
```

Tunggu sampai selesai install (5-10 menit tergantung internet).

---

### **3️⃣ Clone Project Bot**

```bash
# Masuk ke home directory
cd ~

# Clone project dari GitHub (ganti dengan URL repo kamu)
git clone https://github.com/username/wa-bot-faiz.git

# Masuk ke folder project
cd wa-bot-faiz

# Install dependencies
npm install
```

**⚠️ Catatan:** Install canvas & sharp di Termux bisa lama (10-20 menit).

---

### **4️⃣ Jalankan Bot**

```bash
# Jalankan bot
node index.js
```

**QR Code akan muncul!** Scan dengan WhatsApp di HP lain (HP chat), bukan HP yang jadi server.

---

### **5️⃣ Keep Bot Running (Tetap Jalan)**

#### **Opsi A: Pakai `tmux` (Recommended)**

```bash
# Install tmux
pkg install tmux -y

# Jalankan tmux session
tmux new -s wa-bot

# Jalankan bot
node index.js

# Detach dari tmux (bot tetap jalan):
# Tekan: Ctrl+B, lalu tekan D

# HP bisa di-sleep, bot tetap jalan!
```

**Command tmux berguna:**
```bash
# Lihat session yang jalan
tmux ls

# Attach kembali ke session
tmux attach -t wa-bot

# Kill session
tmux kill-session -t wa-bot
```

#### **Opsi B: Pakai `screen`**

```bash
# Install screen
pkg install screen -y

# Jalankan screen
screen -S wa-bot

# Jalankan bot
node index.js

# Detach: Tekan Ctrl+A, lalu D

# Attach kembali
screen -r wa-bot
```

---

## 🔧 Setup Agar Bot Auto-Start

Buat script untuk auto-start saat Termux dibuka:

```bash
# Buat file startup script
nano ~/start-bot.sh
```

Isi file:
```bash
#!/data/data/com.termux/files/usr/bin/bash
cd ~/wa-bot-faiz
tmux new-session -d -s wa-bot 'node index.js'
echo "✅ Bot started in tmux session 'wa-bot'"
echo "📝 Command: tmux attach -t wa-bot"
```

Save (Ctrl+X, Y, Enter), lalu:

```bash
# Beri permission
chmod +x ~/start-bot.sh

# Tambah ke .bashrc untuk auto-run
echo "~/start-bot.sh" >> ~/.bashrc
```

Sekarang, **setiap kali buka Termux**, bot otomatis start!

---

## ⚙️ Settings HP untuk 24/7

### **1. Disable Sleep/Lock Screen**

**Settings → Display → Sleep:** Set ke **Never** atau **30 minutes**

### **2. Disable Battery Optimization untuk Termux**

**Settings → Apps → Termux → Battery → Unrestricted**

### **3. Keep WiFi Always On**

**Settings → WiFi → Advanced → Keep WiFi on during sleep: Always**

### **4. Disable Auto-Updates**

**Play Store → Settings → Auto-update apps: Don't auto-update**

### **5. Charger Terus**

Colok charger 24/7. Pakai charger original atau bagus biar baterai awet.

---

## 📊 Monitor Bot

```bash
# Cek bot jalan?
tmux ls

# Masuk ke session bot
tmux attach -t wa-bot

# Lihat log
# (Setelah attach, scroll naik untuk lihat history)

# Keluar tanpa stop bot
# Ctrl+B, lalu D
```

---

## 🔄 Update Bot (Kalau ada perubahan)

```bash
# Masuk ke folder
cd ~/wa-bot-faiz

# Pull update dari GitHub
git pull

# Install dependencies baru (kalau ada)
npm install

# Restart bot
tmux kill-session -t wa-bot
tmux new -s wa-bot
node index.js
# Detach: Ctrl+B, D
```

---

## 🛠️ Troubleshooting

### **Error: canvas/sharp tidak bisa install**

```bash
# Install dependencies tambahan
pkg install -y libvips-dev

# Reinstall
npm install canvas sharp --force
```

### **Bot mati saat HP sleep**

- Pastikan Termux tidak di-optimize battery
- Pakai tmux/screen
- Jangan force stop Termux

### **WiFi disconnect**

- Settings → WiFi → Keep on during sleep: Always
- Atau pakai mobile data (hotspot dari HP lain)

### **QR Code tidak muncul**

- Pastikan terminal cukup besar
- Atau lihat di logs, pasti ada tulisan QR string

---

## 💡 Tips & Tricks

1. **HP panas?** Lepas case, taruh di tempat sejuk, atau kasih kipas mini USB
2. **Hemat baterai:** Turunin brightness ke minimum
3. **Backup session:** Copy folder `~/wa-bot-faiz/session` ke laptop secara berkala
4. **Pakai HP lama:** HP bekas Rp 500rb-1jt sudah cukup!
5. **Screen always on:** Install app "Keep Screen On" dari Play Store

---

## 🔐 Keamanan

- **Jangan install app random** di HP server
- **Jangan root HP** (gak perlu)
- **Password/PIN lock** HP
- **Backup session folder** secara rutin

---

## 📱 Rekomendasi HP untuk Server Bot

**Budget 500rb-1jt:**
- HP Android bekas minimal 2GB RAM
- Android 7 ke atas
- Baterai masih bagus (bisa charge terus)

**Merek yang oke:**
- Xiaomi Redmi (murah, kuat)
- Samsung J series
- Oppo/Realme bekas

---

## ✅ Checklist Setup

- [ ] Install Termux
- [ ] Install Node.js & Git
- [ ] Clone project
- [ ] npm install (tunggu selesai)
- [ ] Jalankan bot & scan QR
- [ ] Setup tmux/screen
- [ ] Disable battery optimization
- [ ] Set WiFi always on
- [ ] Charger terus
- [ ] Test bot (kirim .ping)

---

## 🎉 Selesai!

Bot sekarang jalan 24/7 di HP Android!

**Command penting:**
```bash
# Jalankan bot
~/start-bot.sh

# Attach ke session
tmux attach -t wa-bot

# Check status
tmux ls
```

HP charging terus + WiFi always on = Bot jalan terus! 🚀

---

## 💰 Biaya Listrik

HP Android pakai daya **5-10 watt** saat charging.

**Hitungan:**
- 10 watt × 24 jam × 30 hari = 7.2 kWh/bulan
- 7.2 kWh × Rp 1.500 = **~Rp 11.000/bulan**

**Jauh lebih murah dari VPS!** 💸
