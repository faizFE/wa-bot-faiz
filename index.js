const pino = require("pino")
const qrcode = require("qrcode-terminal")

const { 
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const axios = require("axios")

// ====== GANTI ID KALIAN ======
// Set ke 'false' jika mau semua orang bisa pakai bot (tidak recommended!)
const useWhitelist = true

const allowedUsers = [
  "39101566845165@lid",
  "6282254089063@s.whatsapp.net", 
  "6285652128933@s.whatsapp.net" // Contoh: ganti dengan nomor teman kamu
  // Tambah nomor lain di sini (format: "628xxx@s.whatsapp.net")
]

// ====== CARA MENDAPATKAN ID TEMAN ======
// 1. Suruh teman kirim pesan ke bot
// 2. Lihat log terminal, akan muncul: "⛔ User not allowed: 628xxx@s.whatsapp.net"
// 3. Copy ID tersebut dan tambahkan ke array allowedUsers di atas
// 4. Restart bot (Ctrl+C, lalu node index.js)

// ====== FUNCTION BRAT ======
const sharp = require("sharp")
const { createCanvas } = require("canvas")

async function textToSticker(text) {
  const width = 512
  const height = 512

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext("2d")

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = "#000000"
  ctx.font = "bold 60px Arial"
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"

  ctx.fillText(text, width / 2, height / 2)

  const pngBuffer = canvas.toBuffer("image/png")

  const webpBuffer = await sharp(pngBuffer)
    .webp()
    .toBuffer()

  return webpBuffer
}



async function startBot() {
  try {
    console.log("🔄 Memulai bot...")
    
    if (useWhitelist) {
      console.log("🔒 Whitelist: AKTIF -", allowedUsers.length, "user diizinkan")
    } else {
      console.log("🌐 Whitelist: NONAKTIF - Semua orang bisa pakai bot")
    }

    const { state, saveCreds } = await useMultiFileAuthState("session")
    const { version } = await fetchLatestBaileysVersion()
    console.log("✅ Baileys version loaded")

    const sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: "fatal" }),
      printQRInTerminal: false,
      syncFullHistory: false,
      markOnlineOnConnect: true
    })
    console.log("✅ Socket created")

    sock.ev.on("creds.update", saveCreds)
    console.log("✅ Creds listener registered")

    sock.ev.on("connection.update", (update) => {
      console.log("📡 Connection update:", JSON.stringify(update))
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        console.log("📱 Scan QR code di bawah ini:")
        qrcode.generate(qr, { small: true })
      }

      if (connection === "open") {
        console.log("✅ BOT TERHUBUNG!")
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode
        const shouldReconnect = statusCode !== DisconnectReason.loggedOut
        
        console.log("❌ Koneksi terputus:", statusCode)
        
        // 440 = conflict (multiple devices), tunggu lebih lama
        if (statusCode === 440) {
          console.log("\n⚠️  CONFLICT ERROR 440 - Ada device lain yang menggunakan session ini!")
          console.log("\n📱 CARA MENGATASI:")
          console.log("1. Buka WhatsApp di HP kamu")
          console.log("2. Masuk ke: Menu (⋮) → Linked Devices / Perangkat Tertaut")
          console.log("3. LOGOUT/HAPUS SEMUA device yang terhubung (Web, Desktop, dll)")
          console.log("4. Setelah bersih, jalankan bot ini lagi\n")
          console.log("⏳ Bot akan coba lagi dalam 15 detik...\n")
          setTimeout(() => startBot(), 15000)
        } else if (shouldReconnect) {
          console.log("🔄 Reconnecting dalam 5 detik...")
          setTimeout(() => startBot(), 5000)
        } else {
          console.log("❌ Session logout. Hapus folder 'session' dan scan ulang QR")
        }
      }
    })
    console.log("✅ Connection listener registered")

    // ✅ LISTENER HARUS DI DALAM startBot
    sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages[0]
    if (!msg.message) return

    const from = msg.key.remoteJid
    
    // ✅ FILTER: Hanya respond ke private chat (skip grup)
    if (from.endsWith("@g.us")) {
      console.log("⏭️  Skip: Pesan dari grup")
      return
    }
    
    console.log("📩 FROM:", from)

    // ✅ WHITELIST CHECK (bisa dimatikan dengan set useWhitelist = false)
    if (useWhitelist && !allowedUsers.includes(from)) {
      console.log("⛔ User not allowed:", from)
      console.log("💡 Tip: Tambahkan ID ini ke 'allowedUsers' di index.js untuk mengizinkan user ini")
      
      // Kirim pesan ke user yang tidak diizinkan (optional)
      await sock.sendMessage(from, { 
        text: "❌ Maaf, kamu belum terdaftar untuk menggunakan bot ini." 
      })
      return
    }

    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      ""

    if (!text) return

    // ===== PING =====
    if (text.toLowerCase() === ".ping") {
      await sock.sendMessage(from, { text: "Bella Imuppp" })
    }

    // ===== BRAT =====
    if (text.toLowerCase().startsWith(".brat ")) {
      try {
        const input = text.slice(6).trim()

        if (!input) {
          return sock.sendMessage(from, {
            text: "❌ Contoh: .brat halo dunia"
          })
        }

        console.log("🎨 Membuat sticker:", input)
        await sock.sendMessage(from, { text: "⏳ Membuat sticker..." })
        
        const stickerBuffer = await textToSticker(input)

        await sock.sendMessage(from, {
          sticker: stickerBuffer
        })
        
        console.log("✅ Sticker berhasil dikirim")

      } catch (err) {
        console.error("❌ ERROR BRAT:", err.message)
        console.error("Stack:", err.stack)
        await sock.sendMessage(from, {
          text: `❌ Sticker error: ${err.message}`
        })
      }
    }
    })
    console.log("✅ Messages listener registered")
    console.log("✅ Bot siap!")
  
  } catch (error) {
    console.error("❌ ERROR FATAL:", error)
    console.error("Stack trace:", error.stack)
    console.log("🔄 Retry dalam 5 detik...")
    setTimeout(() => startBot(), 5000)
  }
}

// WAJIB ADA
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err)
  console.error('Stack:', err.stack)
  console.log("🔄 Mencoba restart...")
  setTimeout(() => startBot(), 5000)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection:', reason)
  console.log("🔄 Bot akan tetap berjalan...")
})

startBot()
