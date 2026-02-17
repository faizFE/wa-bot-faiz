module.exports = async (sock, msg, args) => {
    await sock.sendMessage(msg.key.remoteJid, {
        text: `
╭───「 MENU BOT 」
│ .menu
│ .ping
│ .brat teks
│ .bratvid teks
│ .stc (reply foto)
│ .open (reply view once)
╰────────────

📋 Menu = Lihat Command
Tampilkan daftar semua command bot

🏓 Ping = Test Bot
Bot akan jawab "Halo aku Faizbot ada yang bisa saya bantu?"

✨ Brat = Text Sticker
Buat sticker dari teks (background putih)
Contoh: .brat hello world

🎬 Bratvid = Animated Text Sticker
Sticker gerak dengan teks muncul satu-satu!
(Max 100 karakter)

🖼️ STC = Image to Sticker
Reply foto dengan .stc
Otomatis jadi sticker!

🔓 Open = View Once Revealer
Reply foto/video 1x lihat dengan .open
Bot akan kirim ulang jadi foto biasa!
        `
    })
}
