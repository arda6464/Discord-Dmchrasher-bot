const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');  // MessageEmbed yerine EmbedBuilder'ı import ettik
const config = require('./config.json');
const dmCommand = require('./src/commands/dm.js');
const iptalCommand = require('./src/commands/zdm.js');
const hataLogla = require('./logs/logs.js'); // fonksiyonu import et
const fs = require("fs");
const Prefix = "t!"; // Botun prefixi
let botaktif = 0; // Botların aktif olup olmadığını kontrol etmek için bir sayaç
const targets = new Map();


// Botların her biri için giriş yapılacak
config.bots.forEach((bot, index) => {
 const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  presence: {
    status: 'online', // invisible, online, idle, dnd
    
  }
});

 client.once('ready', () => {
  botaktif++;
    
  const guildNames = client.guilds.cache.map(guild => guild.name).join(', ');
  console.log(`${bot.isModerator ? 'Moderatör' : 'arda64'} ${index + 1} (${client.user.tag}) giriş yaptı - Sunucular: ${guildNames}`);
});


  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // .dm komutunu dinleyip çalıştır
    if (message.content.startsWith(Prefix + 'dm')) {
      await dmCommand.execute(message, client, index, bot.isModerator);
    }
 // çalışıyormu???
   if (message.content.startsWith(Prefix +"iptal")) {
    if (bot.isModerator) {
  const args = message.content.trim().split(" ");
  await iptalCommand(message, args, bot.isModerator);

 
}

    }
 if (message.content.startsWith('t!zdm')) {
  if (!bot.isModerator) return;

  const args = message.content.trim().split(' ').slice(1); // ilk kelime komut

  if (args.length < 3) {
    return message.reply('Kullanım: t!zdm <kullanıcı_id> <mesaj_sayısı> <mesaj>');
  }

  const userId = args[0];
  const messageCount = parseInt(args[1]);
  const content = args.slice(2).join(' '); // Geri kalan tüm mesaj içeriği

  if (isNaN(messageCount)) {
    return message.reply('Mesaj sayısı bir sayı olmalı!');
  }
  // buraya hedefe ekleme işlemleri gelir
  message.reply(`🎯 ID eklendi: ${userId}, mesaj: "${content}" (${messageCount} defa)`);
  targets.set(userId, { messageCount, content }); // hedefe ekle

}


   if (message.content.startsWith(Prefix + "aktif")) {
    if (bot.isModerator) {
      message.reply('total bot: ' + botaktif); 
   }
    }
    if (message.content.startsWith(Prefix + "lang")) {
    if (bot.isModerator) {
      message.reply(  "bakım"); 
   }
    }
     if (message.content.startsWith(Prefix + "help")) {


    if (bot.isModerator) {
      // Komut yardım menüsünü oluşturma


  const guildbanner = message.guild;    
  const embedtest = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("📘 Komut Yardım Menüsü")
    .setDescription("Aşağıda mevcut tüm komutların listesi bulunmaktadır.")
    .setThumbnail(guildbanner.banner) // Logo ya da sunucu görseli önerilir
    .addFields(
      { name: '📩 t!dm', value: 'Belirttiğiniz kullanıcıya spam mesajları yollar', inline: false },
      { name: '📢 t!pre', value: 'pre avantajları', inline: false },
    //  { name: '🛠️ t!ayarlar', value: 'Bot ayarlarını görüntüler veya düzenlersiniz.', inline: false },
      { name: '🛠️ t!lang', value: 'dil ayarı', inline: false },
      //{ name: '🎉 t!iptal', value: 'spam iptal', inline: false },
      { name: '🎉 t!hesabım', value: 'hesabınız hakkında bilgiler', inline: false },
    )
    .setFooter({ text: "✨ Yardım için moderatörlere ulaşın!", iconURL: message.guild.iconURL() })
    .setTimestamp();

  message.channel.send({ embeds: [embedtest] });

   }
}
const lastCommandUsed =null;
const guild = message.guild;
const member = message.member;
 const İsprem = member.roles.cache.some(role => role.id === config.PremiumId) || member.roles.cache.some(role => role.id === config.UltraPremiumId);
const girisTarihi = guild.members.cache.get(message.author.id).joinedAt;
const formattedDate = girisTarihi ? girisTarihi.toLocaleDateString('tr-TR') : 'Bilinmiyor';
    if(message.content.startsWith(Prefix + "hesabım")) {
      if (bot.isModerator) {
        // Ayarlar menüsünü oluşturma
        const hesapEmbed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle("Hesabım")
          .setDescription("hesabınızın bilgileri")
          .setThumbnail(member.user.displayAvatarURL())
          .addFields(
            { name: 'Hesap adı', value: member.user.username,   inline: false },
            { name: 'İD', value: member.user.id,   inline: false },
            { name: 'sunucuya katılım tarihi', value: formattedDate,   inline: false },
            { name: 'Kullanılabilir bot sayısı', value: (İsprem ? 50 : 20).toString(), inline: false },
            { name: 'Son kullanım', value: lastCommandUsed || "Bilinmiyor", inline: false },
            { name: 'Premium', value:  member.roles.cache.has(config.PremiumId) || member.roles.cache.has(config.UltraPremiumId) ? "Aktif" : "Deaktif", inline: false },
            { name: 'Premium bitiş tarihi', value:  "0", inline: false }
          )
          .setFooter({ text: "✨ Yardım için moderatörlere ulaşın!", iconURL: message.guild.iconURL() })
          .setTimestamp();

        message.channel.send({ embeds: [hesapEmbed] });
      }
    }
    // .pre komutu ile premium özelliklerini göster
    if (message.content.toLowerCase() === Prefix + 'pre') {
     if(bot.isModerator){  
      const premiumFeatures = [
        'Özel komutlar: Premium kullanıcılar için özel komutlar mevcuttur.',
        'Hızlı yanıtlar: Premium kullanıcılar, yanıtlarını daha hızlı alır.',
        'Özelleştirilmiş emoji desteği: Premium kullanıcılar, özel emojiler kullanabilir.',
        'Özel DM ile bildirimler: Premium kullanıcılar, özel DM bildirimleri alır.',
        'Özel kanal erişimi: Premium kullanıcılar özel kanallara erişebilir.'
      ];

      // Premium özellikleri gösteren embed mesajı oluşturma
      const preembed = new EmbedBuilder()
        .setColor('#ffcc00')  // Altın rengi seçildi
        .setTitle('Ultra Premium Özellikler')  // Embed başlığı
        .setDescription('Bu özellikler sadece Premium kullanıcılar için geçerlidir.')  // Embed alt başlık
        .addFields(
          { name: 'Özellikler:', value: premiumFeatures.join('\n') }  // Premium özelliklerin listesi
        )
        .setFooter({ text: 'Premium üyelikle ilgili daha fazla bilgi için bot yöneticisine başvurun.' })  // Alt footer mesajı
        .setTimestamp();  // Zaman damgası ekle

      // Embed mesajını gönder
      message.channel.send({ embeds: [preembed] });
     const ultrapremiumFeatures = [
        'Özel komutlar: Premium kullanıcılar için özel komutlar mevcuttur.',
        'Hızlı yanıtlar: Premium kullanıcılar, yanıtlarını daha hızlı alır.',
        'Özelleştirilmiş emoji desteği: Premium kullanıcılar, özel emojiler kullanabilir.',
        'Özel DM ile bildirimler: Premium kullanıcılar, özel DM bildirimleri alır.',
        'Özel kanal erişimi: Premium kullanıcılar özel kanallara erişebilir.'
      ];

      // Premium özellikleri gösteren embed mesajı oluşturma
      const ultrapreembed = new EmbedBuilder()
        .setColor('#ffcc00')  // Altın rengi seçildi
        .setTitle('Premium Özellikler')  // Embed başlığı
        .setDescription('Bu özellikler sadece Premium kullanıcılar için geçerlidir.')  // Embed alt başlık
        .addFields(
          { name: 'Özellikler:', value: ultrapremiumFeatures.join('\n') }  // Premium özelliklerin listesi
        )
        .setFooter({ text: 'Premium üyelikle ilgili daha fazla bilgi için bot yöneticisine başvurun.' })  // Alt footer mesajı
        .setTimestamp();  // Zaman damgası ekle 
         message.channel.send({ embeds: [ultrapreembed] });
    }
    }
  });
  

  // Her bot için giriş yapma
  client.login(bot.token).catch(err => {
    console.error(`${bot.isModerator ? 'Moderatör' : 'arda64'} ${index + 1} login failed:`, err);
    hataLogla(err, null, `Giriş Hatası - ${bot.isModerator ? 'Moderatör' : 'arda64'} ${index + 1}`); // Hata loglama  
  });
});
