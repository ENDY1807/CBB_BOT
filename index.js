const { Client, GatewayIntentBits } = require('discord.js');
const util = require('minecraft-server-util');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ================= CONFIG =================
const TOKEN = 'MTQ4OTU3MzU0MTI5MTYyNjU4Ng.G0ZVhB.6ZPrFkkpzDL4rYOrWHdR4KbFAO7slcDRrMZQwI';
const CHANNEL_ID = '1453661050606977239';

const HOST = 'game-gnl-sgp2.raznar.net';
const PORT = 25163;
// ==========================================

let lastStatus = null;
let lastOfflineTime = null;

client.once('ready', () => {
  console.log(`Bot nyala sebagai ${client.user.tag}`);
  setInterval(checkServer, 10000);
});

async function checkServer() {
  const channel = await client.channels.fetch(CHANNEL_ID);

  try {
    const status = await util.status(HOST, PORT);

    // Kalau sebelumnya OFFLINE
    if (lastStatus === false) {
      const now = Date.now();

      // cek apakah OFFLINE nya sebentar (<= 1 menit)
      if (lastOfflineTime && (now - lastOfflineTime <= 60000)) {
        channel.send('🔄 Server sedang **RESTART!**');
      } else {
        channel.send(`🟢 Server ONLINE! Player: ${status.players.online}/${status.players.max}`);
      }
    }

    // pertama kali nyala
    if (lastStatus === null) {
      channel.send(`🟢 Server ONLINE! Player: ${status.players.online}/${status.players.max}`);
    }

    lastStatus = true;

  } catch (err) {
    // kalau sebelumnya ONLINE → jadi OFFLINE
    if (lastStatus === true) {
      lastOfflineTime = Date.now();
      channel.send('🔴 Server OFFLINE!');
    }

    lastStatus = false;
  }
}

client.login(TOKEN);
