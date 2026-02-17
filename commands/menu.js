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

📋 Menu
Lihat daftar command

🏓 Ping
Test bot hidup

✨ Brat
Buat sticker dari teks
Contoh: .brat hello world

🎬 Bratvid
Sticker animasi teks
Contoh: .bratvid hello

🖼️ STC
Reply foto dengan .stc
Jadikan foto jadi sticker

🔓 Open
Reply view once dengan .open
Buka foto/video 1x lihat
        `
    })
}
