const pino = require("pino")
const qrcode = require("qrcode-terminal")

const { 
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  downloadMediaMessage
} = require("@whiskeysockets/baileys")

const axios = require("axios")

// ====== BOT PUBLIK ======
// Semua orang yang chat ke nomor bot ini bisa pakai!

// ====== FUNCTION BRAT ======
const sharp = require("sharp")
const { createCanvas } = require("canvas")

async function textToSticker(text) {
  // Validasi panjang teks
  const minLength = 1
  const maxLength = 100
  
  if (!text || text.trim().length < minLength) {
    throw new Error(`Teks minimal ${minLength} karakter`)
  }
  
  if (text.length > maxLength) {
    throw new Error(`Teks maksimal ${maxLength} karakter`)
  }

  const width = 512
  const height = 512

  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext("2d")

  // Background putih
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, width, height)

  // Font size adaptif berdasarkan panjang teks
  let fontSize
  if (text.length <= 10) {
    fontSize = 100
  } else if (text.length <= 10) {
    fontSize = 90
  } else if (text.length <= 20) {
    fontSize = 65
  } else {
    fontSize = 50
  }

  ctx.fillStyle = "#000000"
  ctx.font = `bold ${fontSize}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "top"

  // Word wrapping untuk teks panjang
  const maxWidth = width - 40 // padding 20px kiri kanan
  const lineHeight = fontSize * 1.2
  const words = text.split(" ")
  const lines = []
  let currentLine = words[0]

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + " " + words[i]
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth) {
      lines.push(currentLine)
      currentLine = words[i]
    } else {
      currentLine = testLine
    }
  }
  lines.push(currentLine)

  // Hitung posisi Y untuk center vertikal
  const totalHeight = lines.length * lineHeight
  let y = (height - totalHeight) / 2

  // Draw semua lines
  for (let line of lines) {
    ctx.fillText(line, width / 2, y)
    y += lineHeight
  }

  const pngBuffer = canvas.toBuffer("image/png")

  const webpBuffer = await sharp(pngBuffer)
    .webp()
    .toBuffer()

  return webpBuffer
}

// ====== FUNCTION BRATVID (Animated Sticker) ======
const fs = require("fs")
const path = require("path")
const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path
ffmpeg.setFfmpegPath(ffmpegPath)

async function textToAnimatedSticker(text) {
  const minLength = 1
  const maxLength = 100
  
  if (!text || text.trim().length < minLength) {
    throw new Error(`Teks minimal ${minLength} karakter`)
  }
  
  if (text.length > maxLength) {
    throw new Error(`Teks maksimal ${maxLength} karakter untuk animasi`)
  }

  const width = 512
  const height = 512
  const fps = 15
  const tempDir = path.join(__dirname, "temp_frames")
  
  // Buat folder temporary
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  try {
    // Generate frames
    const frames = []
    
    for (let i = 0; i <= text.length; i++) {
      const currentText = text.substring(0, i)
      
      const canvas = createCanvas(width, height)
      const ctx = canvas.getContext("2d")

      // Background putih
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // Font size adaptif
      let fontSize
      if (text.length <= 10) {
        fontSize = 100
      } else if (text.length <= 20) {
        fontSize = 65
      } else if (text.length <= 30) {
        fontSize = 50
      } else if (text.length <= 50) {
        fontSize = 40
      } else if (text.length <= 75) {
        fontSize = 32
      } else {
        fontSize = 28
      }

      ctx.fillStyle = "#000000"
      ctx.font = `bold ${fontSize}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      if (currentText) {
        // Show cursor
        const displayText = i < text.length ? currentText + "|" : currentText

        // Word wrapping
        const maxWidth = width - 40
        const lineHeight = fontSize * 1.2
        const words = displayText.split(" ")
        const lines = []
        let currentLine = words[0] || ""

        for (let j = 1; j < words.length; j++) {
          const testLine = currentLine + " " + words[j]
          const metrics = ctx.measureText(testLine)
          
          if (metrics.width > maxWidth) {
            lines.push(currentLine)
            currentLine = words[j]
          } else {
            currentLine = testLine
          }
        }
        lines.push(currentLine)

        // Draw text centered
        const totalHeight = lines.length * lineHeight
        let y = (height - totalHeight) / 2

        for (let line of lines) {
          ctx.fillText(line, width / 2, y)
          y += lineHeight
        }
      }

      // Save frame as PNG
      const framePath = path.join(tempDir, `frame_${String(i).padStart(4, "0")}.png`)
      const buffer = canvas.toBuffer("image/png")
      fs.writeFileSync(framePath, buffer)
      frames.push(framePath)
    }

    // Hold last frame
    const lastFrame = frames[frames.length - 1]
    for (let i = 0; i < 15; i++) {
      const holdPath = path.join(tempDir, `frame_${String(text.length + 1 + i).padStart(4, "0")}.png`)
      fs.copyFileSync(lastFrame, holdPath)
    }

    // Convert frames to WebP animated sticker
    const outputWebp = path.join(__dirname, `bratvid_${Date.now()}.webp`)
    
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input(path.join(tempDir, "frame_%04d.png"))
        .inputFPS(fps)
        .outputOptions([
          "-vcodec libwebp",
          "-vf scale=512:512:force_original_aspect_ratio=decrease,fps=15,pad=512:512:-1:-1:color=white",
          "-loop 0",
          "-preset default",
          "-an",
          "-vsync 0"
        ])
        .toFormat("webp")
        .save(outputWebp)
        .on("end", resolve)
        .on("error", reject)
    })

    // Read webp file
    const webpBuffer = fs.readFileSync(outputWebp)
    
    // Cleanup
    fs.readdirSync(tempDir).forEach(file => {
      fs.unlinkSync(path.join(tempDir, file))
    })
    fs.rmdirSync(tempDir)
    if (fs.existsSync(outputWebp)) fs.unlinkSync(outputWebp)

    return webpBuffer

  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(tempDir)) {
      try {
        fs.readdirSync(tempDir).forEach(file => {
          try { fs.unlinkSync(path.join(tempDir, file)) } catch {}
        })
        fs.rmdirSync(tempDir)
      } catch {}
    }
    throw error
  }
}



async function startBot() {
  try {
    console.log("🔄 Memulai bot...")
    console.log("🌐 BOT PUBLIK - Semua orang bisa pakai!")

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

    // Track connection state
    let isConnected = false

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
        isConnected = true
      }

      if (connection === "close") {
        isConnected = false
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

    // // ✅ PENTING: Skip pesan dari bot sendiri (prevent loop)
    // if (msg.key.fromMe) {
    //   console.log("⏭️  Skip: Pesan dari bot sendiri")
    //   return
    // }

    const from = msg.key.remoteJid
    
    // ✅ FILTER: Hanya respond ke private chat (skip grup)
    if (from.endsWith("@g.us")) {
      console.log("⏭️  Skip: Pesan dari grup")
      return
    }
    
    console.log("📩 FROM:", from)

    const text =
      msg.message?.conversation ||
      msg.message?.extendedTextMessage?.text ||
      msg.message?.imageMessage?.caption ||
      msg.message?.videoMessage?.caption ||
      ""

    if (!text) return

    // ===== MENU =====
    if (text.toLowerCase() === ".menu") {
      try {
        const menuHandler = require("./commands/menu")
        await menuHandler(sock, msg, [])
      } catch (err) {
        console.error("❌ ERROR MENU:", err.message)
        await sock.sendMessage(from, {
          text: "❌ Error loading menu"
        })
      }
    }

    // ===== PING =====
    if (text.toLowerCase() === ".ping") {
      await sock.sendMessage(from, { text: "Halo aku faizbot ada Yang bisa saya bantu?" })
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

    // ===== BRATVID (Animated Sticker) =====
    if (text.toLowerCase().startsWith(".bratvid ")) {
      try {
        const input = text.slice(9).trim()

        if (!input) {
          return sock.sendMessage(from, {
            text: "❌ Contoh: .bratvid halo dunia"
          })
        }

        console.log("🎬 Membuat sticker animasi:", input)
        await sock.sendMessage(from, { text: "⏳ Membuat sticker animasi... (tunggu sebentar)" })
        
        const stickerBuffer = await textToAnimatedSticker(input)

        await sock.sendMessage(from, {
          sticker: stickerBuffer
        })
        
        console.log("✅ Sticker animasi berhasil dikirim")

      } catch (err) {
        console.error("❌ ERROR BRATVID:", err.message)
        console.error("Stack:", err.stack)
        await sock.sendMessage(from, {
          text: `❌ Sticker animasi error: ${err.message}`
        })
      }
    }

    // ===== STC (Image to Sticker) =====
    if (text.toLowerCase() === ".stc") {
      try {
        // Check if replying to a message
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        
        if (!quotedMsg) {
          return sock.sendMessage(from, {
            text: "❌ Reply foto dengan .stc untuk jadikan sticker"
          })
        }

        // Check if quoted message has image
        const imageMessage = quotedMsg.imageMessage
        
        if (!imageMessage) {
          return sock.sendMessage(from, {
            text: "❌ Pesan yang di-reply harus foto"
          })
        }

        console.log("🖼️ Converting image to sticker...")
        await sock.sendMessage(from, { text: "⏳ Membuat sticker..." })

        // Get quoted message key for download
        const quotedKey = msg.message.extendedTextMessage.contextInfo

        // Download image
        const mediaMsg = {
          key: {
            remoteJid: from,
            id: quotedKey.stanzaId,
            participant: quotedKey.participant
          },
          message: quotedMsg
        }

        console.log("📥 Downloading image...")
        const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {})
        console.log(`✅ Downloaded ${buffer.length} bytes`)

        // Convert to sticker (resize to 512x512 and convert to WebP)
        console.log("🔄 Converting to WebP sticker format...")
        const stickerBuffer = await sharp(buffer)
          .resize(512, 512, {
            fit: 'contain',
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          })
          .webp()
          .toBuffer()

        console.log(`✅ Sticker created: ${stickerBuffer.length} bytes`)

        // Send as sticker
        await sock.sendMessage(from, {
          sticker: stickerBuffer
        })

        console.log("✅ Sticker berhasil dikirim")

      } catch (err) {
        console.error("❌ ERROR STC:", err.message)
        console.error("Stack:", err.stack)
        await sock.sendMessage(from, {
          text: `❌ Gagal membuat sticker: ${err.message}`
        })
      }
    }

    // ===== OPEN (View Once Revealer) =====
    if (text.toLowerCase() === ".open") {
      // Check connection first
      if (!isConnected) {
        return sock.sendMessage(from, {
          text: "❌ Bot sedang tidak terhubung. Tunggu sebentar..."
        }).catch(() => console.log("⚠️ Tidak bisa kirim pesan, bot disconnect"))
      }
      
      try {
        // Check if replying to a message
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage
        
        if (!quotedMsg) {
          return sock.sendMessage(from, {
            text: "❌ Reply foto/video view once dengan .open"
          })
        }

        // DEBUG: Log struktur message yang di-reply
        console.log("🔍 DEBUG quotedMsg keys:", Object.keys(quotedMsg))
        console.log("🔍 DEBUG full quotedMsg:", JSON.stringify(quotedMsg, null, 2))

        // Check if quoted message is view once
        const viewOnceMessage = quotedMsg.viewOnceMessageV2 || quotedMsg.viewOnceMessage
        
        if (!viewOnceMessage) {
          console.log("⚠️ Tidak ada viewOnceMessage di quotedMsg")
          console.log("🔍 Mencoba cek imageMessage/videoMessage langsung...")
          
          // Check if it's a direct image/video message (view once that was already opened)
          const directImage = quotedMsg.imageMessage
          const directVideo = quotedMsg.videoMessage
          
          if (!directImage && !directVideo) {
            return sock.sendMessage(from, {
              text: "❌ Pesan yang di-reply bukan view once atau foto/video"
            })
          }
          
          // Use direct image/video message
          console.log("🔓 Found direct image/video, attempting to open...")
          
          if (!isConnected) {
            console.log("❌ Bot disconnect saat proses")
            return
          }
          
          await sock.sendMessage(from, { text: "🔓 Membuka media..." }).catch(e => {
            console.log("⚠️ Gagal kirim status:", e.message)
          })
          
          const quotedKey = msg.message.extendedTextMessage.contextInfo
          
          const mediaMsg = {
            key: {
              remoteJid: from,
              id: quotedKey.stanzaId,
              participant: quotedKey.participant
            },
            message: quotedMsg
          }
          
          console.log("📥 Downloading media...")
          const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {})
          console.log(`✅ Downloaded ${buffer.length} bytes`)
          
          if (!isConnected) {
            console.log("❌ Bot disconnect setelah download")
            return
          }
          
          if (directImage) {
            await sock.sendMessage(from, {
              image: buffer,
              caption: "🔓 Foto berhasil dibuka!"
            }).catch(e => {
              console.log("❌ Gagal kirim foto:", e.message)
              throw e
            })
          } else {
            await sock.sendMessage(from, {
              video: buffer,
              caption: "🔓 Video berhasil dibuka!"
            }).catch(e => {
              console.log("❌ Gagal kirim video:", e.message)
              throw e
            })
          }
          
          console.log("✅ Media revealed!")
          return
        }

        console.log("🔓 Opening view once message...")
        
        if (!isConnected) {
          console.log("❌ Bot disconnect saat proses")
          return
        }
        
        await sock.sendMessage(from, { text: "🔓 Membuka view once..." }).catch(e => {
          console.log("⚠️ Gagal kirim status:", e.message)
        })

        // Extract actual message
        const actualMessage = viewOnceMessage.message
        const isImage = actualMessage?.imageMessage
        const isVideo = actualMessage?.videoMessage

        if (!isImage && !isVideo) {
          return sock.sendMessage(from, {
            text: "❌ Format tidak didukung"
          }).catch(() => {})
        }

        console.log(`📸 Downloading ${isImage ? 'image' : 'video'}...`)

        // Get quoted message key
        const quotedKey = msg.message.extendedTextMessage.contextInfo

        // Download media
        const mediaMsg = {
          key: {
            remoteJid: from,
            id: quotedKey.stanzaId,
            participant: quotedKey.participant
          },
          message: actualMessage
        }

        console.log("📥 Downloading media...")
        const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {})
        console.log(`✅ Downloaded ${buffer.length} bytes`)

        if (!isConnected) {
          console.log("❌ Bot disconnect setelah download")
          return
        }

        // Send back as normal message
        if (isImage) {
          await sock.sendMessage(from, {
            image: buffer,
            caption: "🔓 Foto view once berhasil dibuka!"
          }).catch(e => {
            console.log("❌ Gagal kirim foto:", e.message)
            throw e
          })
        } else {
          await sock.sendMessage(from, {
            video: buffer,
            caption: "🔓 Video view once berhasil dibuka!"
          }).catch(e => {
            console.log("❌ Gagal kirim video:", e.message)
            throw e
          })
        }

        console.log("✅ View once revealed!")

      } catch (err) {
        console.error("❌ ERROR OPEN:", err.message)
        console.error("Stack:", err.stack)
        
        // Only try to send error message if connected
        if (isConnected) {
          sock.sendMessage(from, {
            text: `❌ Gagal membuka view once: ${err.message}`
          }).catch(e => {
            console.log("⚠️ Gagal kirim error message:", e.message)
          })
        } else {
          console.log("⚠️ Bot tidak terhubung, tidak bisa kirim pesan error")
        }
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
