const { Client, GatewayIntentBits } = require('discord.js');
const util = require('minecraft-server-util');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ================= CONFIG =================
const TOKEN = 'MTQ4OTU3MzU0MTI5MTYyNjU4Ng.G0ZVhB.6ZPrFkkpzDL4rYOrWHdR4KbFAO7slcDRrMZQwI';
const CHANNEL_ID = '1453661050606977239';

const HOST = 'game-gnl-sgp2.raznar.net:25163';
const PORT = 25163;
// ==========================================

let lastStatus = null;

client.once('ready', () => {
  console.log(`Bot nyala sebagai ${client.user.tag}`);

  setInterval(checkServer, 10000); // cek tiap 10 detik
});

async function checkServer() {
  try {
    const status = await util.status(HOST, PORT);

    if (lastStatus === false || lastStatus === null) {
      const channel = await client.channels.fetch(CHANNEL_ID);
      channel.send('🟢 Server Minecraft sekarang **ONLINE!**');
    }

    lastStatus = true;

  } catch (err) {
    if (lastStatus === true || lastStatus === null) {
      const channel = await client.channels.fetch(CHANNEL_ID);
      channel.send('🔴 Server Minecraft sekarang **OFFLINE!**');
    }

    lastStatus = false;
  }
}

client.login(TOKEN);
