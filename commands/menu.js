module.exports = async (sock, msg, args) => {
    await sock.sendMessage(msg.key.remoteJid, {
        text: `
╭───「 MENU BOT 」
│ .menu - Lihat daftar command
│ .ping - Test bot
│ .open - Buka view once
╰────────────

📋 .menu
Tampilkan daftar semua command bot

🏓 .ping
Bot akan jawab "Halo aku Faizbot ada yang bisa saya bantu?"

🔓 .open (reply view once)
Buka foto/video view once yang cuma bisa dilihat 1x
Reply pesan view once dengan .open
Bot akan kirim ulang jadi foto/video biasa!

────────────
🤖 Bot optimized untuk Termux
📱 Ringan dan stabil di HP
        `
    })
}
