const dmCommand = require('./dm.js');
const targets = new Map(); // Kullanıcı ID => { count, content }

module.exports = {
  targets,

  checkAndSend: async (client) => {
    // Tüm hedefleri kontrol et
    for (const [userId, target] of targets) {
      let userFound = false;
      
      // Tüm sunucularda kullanıcıyı ara
      for (const guild of client.guilds.cache.values()) {
        if (guild.members.cache.has(userId)) {
          userFound = true;
          break;
        }
      }

      // Eğer kullanıcı bulunduysa
      if (userFound) {
        try {
          const user = await client.users.fetch(userId);
          
          // dmCommand.execute fonksiyonunu çağır
          await dmCommand.execute(
            { author: user }, // message objesi gibi davranacak sahte obje
            client,
            target.index, // dmCommand'ın beklediği index parametresi
            isModerator // moderator kontrolü
          );
          
          console.log(`✅ ${user.tag} kullanıcısına DM gönderildi`);
          targets.delete(userId); // İşlem tamamlandı, listeden çıkar
        } catch (err) {
          console.error('❌ DM gönderilemedi:', err);
        }
      }
    }
  },

  handleCommand: async (message, args) => {
    if (args.length < 4) {
      if(isModerator) {
        return message.reply('Kullanım: t!zdm <kullanıcı_id> <mesaj_sayısı> <mesaj>');
      }
     
    }

    const userId = args[1];
    const count = parseInt(args[2]);
    const content = args.slice(3).join(' ');

    if (isNaN(count)) {
      return message.reply('Mesaj sayısı geçerli bir sayı olmalı.');
    }

    // Hedefi Map'e ekle
    targets.set(userId, { 
      count,
      content,
      index: 0, // dmCommand.execute için gerekliyse
      isModerator: false // veya başka bir değer
    });

    return message.reply(`✅ ${userId} ID'li kullanıcı takip listesine eklendi.`);
  }
};