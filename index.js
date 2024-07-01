import baileys from "@whiskeysockets/baileys";
const {
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  makeWASocket,
} = baileys;
import chalk from "chalk";
import pino from "pino";
import chatGpt from "./system/component.js";

async function systemStart() {
  const { state, saveCreds } = await useMultiFileAuthState("sessions");
  const irull = makeWASocket({
    logger: pino({ level: "fatal" }).child({ level: "fatal" }),
    printQRInTerminal: true,
        auth: {
           creds: state.creds,
           keys: baileys.makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
    browser: ["Ubuntu", "Chrome", "20.0.04"],
  });
  
// Koneksi Update

irull.ev.on("creds.update", saveCreds);

irull.ev.on("connection.update", (update) => {
  const { connection, lastDisconnect, qr } = update;
    if (connection === "close") {
      if (typeof lastDisconnect !== "undefined" && lastDisconnect !== null) {
        const shouldReconnect =
          typeof lastDisconnect !== "undefined" &&
          typeof lastDisconnect.error !== "undefined" &&
          typeof lastDisconnect.error.output !== "undefined" &&
          typeof lastDisconnect.error.output.statusCode !== "undefined" &&
          lastDisconnect.error.output.statusCode != DisconnectReason.loggedOut;
        if (shouldReconnect) {
          systemStart();
        }
      }
    } else if (connection === "open") {
      console.clear();
      console.log(chalk.bgCyan("Koneksi Dibuka"));
      console.log(chalk.green("Chat AI created by @irull2nd"));
    }
  });
  
// Merespon Pesan

irull.ev.on("messages.upsert", async ({ messages }) => {
    const m = messages[0];
    if (!m.message) return;
    if (!m.isBaileys && !m.fromMe) console.log(`📨 Message Received`);
    console.log(chalk.cyan(m.pushName + ' Send messages to AI chat'));
    

    if (typeof m.key.remoteJid !== "undefined" && m.key.remoteJid !== null) {
      try {
        const messageType = Object.keys(m.message)[0];

        const Jid = m.key.remoteJid;
        const senderMessage =
          m.message?.conversation ||
          m.message?.extendedTextMessage?.text ||
          m.message?.imageMessage?.caption;
          
          const command = senderMessage?.match(/[a-z]+/)?.[0];
          
  
        // Pesan Teks
        if (
          messageType === "conversation" ||
          messageType === "extendedTextMessage"
        ) {
        const isPrivate = Jid.endsWith('@g.us')
        let tobrut = ['composing', 'recording']
        let rndm = tobrut[Math.floor(tobrut.length * Math.random())]
          const message = senderMessage?.replace(command, "").trim();
          if (!m.key.fromMe && !isPrivate) {
            chatGpt(irull, Jid, message, m);
            await irull.readMessages([m.key]) // Buat Read Message
            await irull.sendPresenceUpdate(rndm, Jid) // Buat typing
          }
        }
      } catch (error) {
        console.log(`Ada kesalahan: ${error}`);
      }
    }
  });
}
  
//Memulai...
systemStart();