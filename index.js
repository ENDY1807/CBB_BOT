const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const util = require('minecraft-server-util');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ================= CONFIG =================
const TOKEN = process.env.TOKEN;
const CHANNEL_ID = '1489579354638778428';

const HOST = 'game-gnl-sgp2.raznar.net';
const PORT = 25163;
// ==========================================

let lastStatus = null;
let lastOfflineTime = null;

// lock ke 1 channel
async function getChannel() {
  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel || channel.id !== CHANNEL_ID) return null;
  return channel;
}

client.once('ready', () => {
  console.log(`Bot nyala sebagai ${client.user.tag}`);
  setInterval(checkServer, 10000);
});

async function checkServer() {
  const channel = await getChannel();
  if (!channel) return;

  try {
    const status = await util.status(HOST, PORT);

    // ================= ONLINE =================
    if (lastStatus === false) {
      const now = Date.now();

      // restart detect
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
            `Player sudah bisa bermain kembali di server` +
            `Selamat Bermamin 👋`
          )
          .setColor('Green')
          .setTimestamp();

        channel.send({ embeds: [embed] });
      }
    }

    // pertama kali nyala
    if (lastStatus === null) {
      const embed = new EmbedBuilder()
        .setTitle('🟢 STATUS SERVER')
        .setDescription(
          `Server terdeteksi dalam kondisi **ONLINE**.\n\n` +
          `👥 Player: **${status.players.online}/${status.players.max}**\n\n` +
          `Server siap digunakan`
        )
        .setColor('Green')
        .setTimestamp();

      channel.send({ embeds: [embed] });
    }

    lastStatus = true;

  } catch (err) {
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
