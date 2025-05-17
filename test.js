const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');
const hataLogla = require('./logs/hatalogla'); // fonksiyonu import et
const logChannel = config.logChannel; // Log kanalını config dosyasından al

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', async () => {
  console.log(`Bot aktif: ${client.user.tag}`);

  // ✅ Hatalı işlem simülasyonu (örnek test)
  try {
    // Bilerek hata oluşturuyoruz
    let a = undefinedVariable + 1; // Bu değişken tanımlı değil, ReferenceError verir
  } catch (err) {
    const logChannel = await client.channels.fetch(config.logChannel).catch(() => null);
    await hataLogla(err, logChannel, 'TEST: Hatalı işlem denemesi');
  }
});

client.login("MTM3MDkxMTQ4NzIyODY0MTMxMA.GwUS_b.nk2evjJ89JEVMg03b7WTR6xz3WYFX5ZM_2Q74I");
