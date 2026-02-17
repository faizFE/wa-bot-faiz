# 📱 Termux Quick Start - Cheat Sheet

## 🚀 Setup Cepat (Copy-Paste)

```bash
# 1. Update & Install Node.js
pkg update -y && pkg upgrade -y
pkg install -y nodejs git python3 make g++ libpng libjpeg-turbo

# 2. Clone project (ganti URL dengan punya kamu)
cd ~
git clone https://github.com/username/wa-bot-faiz.git
cd wa-bot-faiz

# 3. Install dependencies
npm install

# 4. Install tmux (untuk keep bot running)
pkg install tmux -y

# 5. Jalankan bot di tmux
tmux new -s wa-bot
node index.js

# 6. Detach dari tmux (bot tetap jalan)
# Tekan: Ctrl+B, lalu tekan D
```

---

## 📋 Command Penting Termux

```bash
# Cek session yang jalan
tmux ls

# Attach kembali ke bot
tmux attach -t wa-bot

# Kill session
tmux kill-session -t wa-bot

# Restart bot
tmux kill-session -t wa-bot
tmux new -s wa-bot
cd ~/wa-bot-faiz && node index.js
# Ctrl+B, D untuk detach
```

---

## ⚙️ Settings HP

1. **Display Sleep:** Never
2. **Battery Optimization Termux:** Unrestricted
3. **WiFi during sleep:** Always on
4. **Auto-update apps:** Disabled
5. **Charger:** Colok 24/7

---

## 🔄 Update Bot

```bash
cd ~/wa-bot-faiz
git pull
npm install
tmux kill-session -t wa-bot
tmux new -s wa-bot
node index.js
# Ctrl+B, D
```

---

## 💡 Folder Session

Session tersimpan di: `~/wa-bot-faiz/session/`

**Backup session:**
```bash
# Zip session folder
cd ~/wa-bot-faiz
tar -czf session-backup.tar.gz session/

# Download via Termux (share file)
termux-setup-storage
cp session-backup.tar.gz ~/storage/downloads/
```

---

## ⚡ Cepat Start/Stop Bot

Buat file `~/bot.sh`:
```bash
nano ~/bot.sh
```

Isi:
```bash
#!/data/data/com.termux/files/usr/bin/bash

case "$1" in
  start)
    cd ~/wa-bot-faiz
    tmux new -d -s wa-bot 'node index.js'
    echo "✅ Bot started!"
    ;;
  stop)
    tmux kill-session -t wa-bot
    echo "❌ Bot stopped!"
    ;;
  restart)
    tmux kill-session -t wa-bot
    cd ~/wa-bot-faiz
    tmux new -d -s wa-bot 'node index.js'
    echo "🔄 Bot restarted!"
    ;;
  status)
    tmux ls
    ;;
  logs)
    tmux attach -t wa-bot
    ;;
  *)
    echo "Usage: ./bot.sh {start|stop|restart|status|logs}"
    ;;
esac
```

Save & beri permission:
```bash
chmod +x ~/bot.sh
```

**Command:**
```bash
~/bot.sh start    # Start bot
~/bot.sh stop     # Stop bot
~/bot.sh restart  # Restart bot
~/bot.sh status   # Cek status
~/bot.sh logs     # Lihat logs
```

---

## 🆘 Troubleshooting Cepat

**Bot mati terus:**
```bash
pkg install termux-services
sv-enable sshd
```

**Canvas error:**
```bash
pkg install libvips-dev
npm install canvas --force
```

**Memory full:**
```bash
pkg clean
npm cache clean --force
```

**WiFi disconnect:**
- Settings → WiFi → Advanced → Keep on: Always

---

## 📊 Monitor Resource

```bash
# Cek RAM
free -h

# Cek storage
df -h

# Cek process
top
# (tekan Q untuk keluar)
```

---

Lengkapnya baca: [TERMUX_SETUP.md](TERMUX_SETUP.md)
