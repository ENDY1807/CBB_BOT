const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ================= CONFIG =================
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = '1489579354638778428';

const HOST = 'standardjava2.phantomic.web.id';
const PORT = 25566;
// ==========================================

let lastStatus = null;
let lastOfflineTime = null;

// ambil channel
async function getChannel() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || channel.id !== CHANNEL_ID) return null;
    return channel;
  } catch (err) {
    console.log('Gagal ambil channel:', err);
    return null;
  }
}

client.once('ready', () => {
  console.log(`Bot nyala sebagai ${client.user.tag}`);
  setInterval(checkServer, 10000);
});

async function checkServer() {
  const channel = await getChannel();
  if (!channel) return;

  try {
    // cek status server (pakai timeout biar gak ngegantung)
    const status = await util.status(HOST, PORT, { timeout: 5000 });

    // ================= ONLINE =================
    if (lastStatus === false) {
      const now = Date.now();

      // detect restart
      if (lastOfflineTime && (now - lastOfflineTime <= 60000)) {
        const embed = new EmbedBuilder()
          .setTitle('🔄 SERVER KEMBALI ONLINE')
          .setDescription(
            `Server Minecraft telah kembali **ONLINE** setelah beberapa saat tidak dapat diakses.\n\n` +
            `Server sudah bisa dimainkan kembali 🚀`
          )
          .setColor('Yellow')
          .setTimestamp();

        channel.send({ embeds: [embed] });

      } else {
        const embed = new EmbedBuilder()
          .setTitle('🟢 SERVER ONLINE')
          .setDescription(
            `Server Minecraft sekarang sudah **ONLINE**.\n\n` +
            `🌐 IP: **${HOST}:${PORT}**\n` +
            `Player sudah bisa bermain kembali di server\n` +
            `Selamat Bermain 👋`
          )
          .setColor('Green')
          .setTimestamp();

        channel.send({ embeds: [embed] });
      }
    }

    // pertama kali bot nyala
    if (lastStatus === null) {
      const embed = new EmbedBuilder()
        .setTitle('🟢 SERVER ONLINE')
        .setDescription(
          `Server CBB sekarang sudah **ONLINE**.\n\n` +
          `🌐 IP: **${HOST}:${PORT}**\n` +
          `Player sudah bisa bermain kembali di server\n` +
          `Selamat Bermain 👋`
        )
        .setColor('Green')
        .setTimestamp();

      channel.send({ embeds: [embed] });
    }

    lastStatus = true;

  } catch (err) {
    console.log('Server check error:', err.message);

    // ================= OFFLINE =================
    if (lastStatus === true) {
      lastOfflineTime = Date.now();

      const embed = new EmbedBuilder()
        .setTitle('🔴 SERVER OFFLINE')
        .setDescription(
          `Server Minecraft saat ini sedang **OFFLINE**.\n\n` +
          `Server untuk sementara tidak dapat diakses.\n` +
          `Silakan tunggu hingga server kembali online.`
        )
        .setColor('Red')
        .setTimestamp();

      channel.send({ embeds: [embed] });
    }

    lastStatus = false;
  }
}

client.login(TOKEN);
