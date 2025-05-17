const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json'); // Botlar için config dosyası
const dmCommand = require('./src/commands/dm.js');
let botaktif = 0;

// Her bir botu başlatan fonksiyon
function startBot(token, botIndex, isModerator) {
  const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  presence: {
    status: 'invisible', // invisible, online, idle, dnd
    activities: [
      {
        name: config.status, // buraya yazı
        type: 3 // 3 = İzliyor
      }
    ]
  }
});


  client.once('ready', () => {
    botaktif++;
    console.log(`${isModerator ? 'Moderatör' : 'arda64'} ${botIndex + 1} (${client.user.tag}) is ready!`);
  });

  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // .dm komutu geldiğinde çalışacak kod
    if (message.content.startsWith('.two')) {
      await dmCommand.execute(message, client, botIndex, isModerator);
    }


    if (message.content.startsWith('.aktif')) { 
      
      message.reply('total bot: ' + botaktif);
    }
  });

  // Token ile giriş yapmayı dener
  client.login(token).catch(err => {
    console.error(`${isModerator ? 'Moderatör' : 'arda64'} ${botIndex + 1} login failed:`, err);
  });
}

// Tüm botları başlatan fonksiyon
function startAllBots() {
  config.bots.forEach((bot, index) => {
    startBot(bot.token, index, bot.isModerator || false);
  });
}
console.log('Bot aktif ' + botaktif); 

module.exports = startAllBots;
