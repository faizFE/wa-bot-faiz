module.exports = async (sock, msg, args) => {
    if (!args[0]) {
        return sock.sendMessage(msg.key.remoteJid, {
            text: "Masukin teks dong 😭"
        })
    }

    const text = args.join(" ")
    await sock.sendMessage(msg.key.remoteJid, {
        text: `Brat Mode 😈: ${text}`
    })
}
