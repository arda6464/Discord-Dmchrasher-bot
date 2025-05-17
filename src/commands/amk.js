const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const activedms = require('../data/activedms.js');

const activeDMs = activedms; 
const DEFULT_MESSAGE_CONTENT = config.defultmessage || "Varsayılan mesaj içeriği";
const MAX_MESSAGES = 100;
const PREMİUM_MESSAGE_COUNT = 250;
const ULTRA_PREMIUM_MESSAGE_COUNT = 500;

module.exports = {
  execute: async (message, client, botIndex, isModerator) => {
    // Değişken tanımları
    let logChannel, ownerLogChannel;
    const startTime = Date.now();
    
  /*  // Moderator kontrolü
    if (!isModerator) {
      try {
        await message.reply({
          content: "❌ Bu komutu sadece moderatörler kullanabilir!",
          ephemeral: true
        });
      } catch (error) {
        console.error("Moderatör uyarısı gönderilemedi:", error);
      }
      return;
    }*/

    // Kanal kontrolü
    if (message.channel.id !== config.commandChannelId) {
      if(isModerator) {
      try {
        await message.reply({
          content: `Bu komutu sadece <#${config.commandChannelId}> kanalında kullanabilirsin!`,
          ephemeral: true
        });
      } catch (error) {
        console.error("Kanal uyarısı gönderilemedi:", error);
      }
      return;
    }
    }

    // Argüman işlemleri
    const args = message.content.split(' ');
    const test = message.member;
    const isPremium = test.roles.cache.has(config.PremiumId) || test.roles.cache.has(config.ultrapremiumId);
    
    // Premium argüman kontrolü
    if (isPremium && args.length !== 4) {
      console.log('Args length (pre):', args.length);
      try {
        if(isModerator) {
        await message.reply({
          content: 'Kullanım: t!dm <kullanıcı_id> <mesaj_sayısı> <mesaj>',
          ephemeral: true
        });
        }
      } catch (error) {
        console.error("Premium kullanım hatası gönderilemedi:", error);
      }
      return;
    }
    
    // Normal kullanıcı argüman kontrolü
    if (!isPremium && args.length !== 3) {
      try {
        console.log('Args length:', args.length);
        if(isModerator) {
        await message.reply({
          content: 'Kullanım: t!dm <kullanıcı_id> <mesaj_sayısı>',
          ephemeral: true
        });
        }
      } catch (error) {
        console.error("Normal kullanım hatası gönderilemedi:", error);
      }
      return;
    }

    // Parametreleri ayıkla
    const hedef_Id = args[1];
    const mesaj_sayısı = parseInt(args[2]);
    const ozelmesaj = args.length === 4 ? args.slice(3).join(' ') : DEFULT_MESSAGE_CONTENT;
    const guild = message.guild;

    // Kullanıcıyı bul
    let kullanici;
    try {
      kullanici = await guild.members.fetch(hedef_Id);
    } catch (error) {
      console.error("Kullanıcı bulunamadı:", error);
     
      try {
          if(isModerator){
        await message.reply({
          content: "Geçersiz kullanıcı ID'si!",
          ephemeral: true
        });
      }
      
        
      } catch (replyError) {
        console.error("Hata mesajı gönderilemedi:", replyError);
      }
      return;
    }

    // Premium limit kontrolleri
    if (kullanici.roles.cache.has(config.ultrapremiumId)) {
      if (isNaN(mesaj_sayısı) || mesaj_sayısı < 1 || mesaj_sayısı > ULTRA_PREMIUM_MESSAGE_COUNT) {
        try {
          if(isModerator){
          await message.reply({
            content: `Mesaj sayısı 1-${ULTRA_PREMIUM_MESSAGE_COUNT} arası olmalı!`,
            ephemeral: true
          });
        }
        } catch (error) {
          console.error("Ultra premium limit hatası gönderilemedi:", error);
        }
        return;
      }
    } else if (kullanici.roles.cache.has(config.PremiumId)) {
      if (isNaN(mesaj_sayısı) || mesaj_sayısı < 1 || mesaj_sayısı > PREMİUM_MESSAGE_COUNT) {
        try {
          if(isModerator){
          await message.reply({
            content: `Mesaj sayısı 1-${PREMİUM_MESSAGE_COUNT} arası olmalı!`,
            ephemeral: true
          });
        }
        } catch (error) {
          console.error("Premium limit hatası gönderilemedi:", error);
        }
        return;
      }
    } else {
      if (isNaN(mesaj_sayısı) || mesaj_sayısı < 1 || mesaj_sayısı > MAX_MESSAGES) {
        try {
          if(isModerator){
          await message.reply({
            content: `Mesaj sayısı 1-${MAX_MESSAGES} arası olmalı!`,
            ephemeral: true
          });
        }
        } catch (error) {
          console.error("Normal limit hatası gönderilemedi:", error);
        }
        return;
      }
    }

    // Log kanallarını ayarla
    try {
      logChannel = await client.channels.fetch(config.logChannelId);
      if (config.ownerLogChannelId) {
        ownerLogChannel = await client.channels.fetch(config.ownerLogChannelId);
      }
    } catch (error) {
      console.error("Log kanalları bulunamadı:", error);
      try {
        if(isModerator){
        await message.reply({
          content: "Log kanalları yapılandırılmamış!",
          ephemeral: true
        });
      }
      } catch (replyError) {
        console.error("Log hatası gönderilemedi:", replyError);
      }
      return;
    }

    // Aktif işlem kontrolü
    if (activeDMs.has(hedef_Id)) {
      const existingJob = activeDMs.get(hedef_Id);
        if(isModerator){
      try {
      
        await message.reply({
          content: `Bu kullanıcıya zaten DM gönderiliyor!\nGönderilen: ${existingJob.gonderilen}/${existingJob.hedef}`,
          ephemeral: true
        });
        
        await message.reply({
          content: `Bu kullanıcıya zaten DM gönderiliyor!\nGönderilen: ${existingJob.gonderilen}/${existingJob.hedef}`,
          ephemeral: true
        });
      } catch (error) {
        console.error("Aktif işlem hatası gönderilemedi:", error);
      }
      return;
    }
    }
if(isModerator){
    try {
      if (kullanici.roles.cache.has(config.noSpamRoleId)) {
        const embed = new EmbedBuilder()
          .setColor('#ff0000')
          .setTitle('Koruma Engeli')
          .setDescription(`<@${hedef_Id}> koruma rolüne sahip!`)
          .addFields(
            { name: 'Moderatör', value: message.author.tag, inline: true },
            { name: 'Denenen Mesaj Sayısı', value: mesaj_sayısı.toString(), inline: true }
          )
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
        if (ownerLogChannel) await ownerLogChannel.send({ embeds: [embed] });

        try {
          await message.reply({
            content: "Bu kullanıcı korumalı!",
            ephemeral: true
          });
        } catch (error) {
          console.error("Koruma uyarısı gönderilemedi:", error);
        }
        return;
      }
    } catch (error) {
      console.error("Koruma rolü kontrol hatası:", error);
    }
  }
    // İşlemi başlat
    activeDMs.set(hedef_Id, {
      aktif: true,
      mesaj: ozelmesaj,
      baslatan: message.author.id,
      baslangic: Date.now(),
      hedef: mesaj_sayısı,
      gonderilen: 0,
      sonHata: null
    });
   if(isModerator){
    try {
      const hedef_hesap = await client.users.fetch(hedef_Id);
      
      // Başlangıç embed'i
      const startEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('DM Gönderimi Başladı')
        .setDescription(`**Bot ${botIndex + 1}** ile gönderim başlatıldı`)
        .addFields(
          { name: 'Hedef', value: hedef_hesap.tag, inline: true },
          { name: 'Miktar', value: `${mesaj_sayısı} mesaj`, inline: true },
          { name: 'Başlatan', value: message.author.tag, inline: true }
        )
        .setFooter({ text: `Başlangıç: ${new Date().toLocaleTimeString()}` })
        .setTimestamp();
      
      await logChannel.send({ embeds: [startEmbed] });
      if (ownerLogChannel) await ownerLogChannel.send({ embeds: [startEmbed] });

      // Mesaj gönderme döngüsü
      let basariliGonderim = 0;
      let dmKapali = false;

      for (let i = 0; i < mesaj_sayısı; i++) {
        if (dmKapali) break;
      
        try {
          await hedef_hesap.send(ozelmesaj);
          basariliGonderim++;
          
          // Map'i güncelle
          activeDMs.set(hedef_Id, { 
            ...activeDMs.get(hedef_Id),
            gonderilen: basariliGonderim,
            sonGuncelleme: Date.now()
          });

          // Rastgele bekleme (1-3 sn)
          await new Promise(resolve => setTimeout(resolve, 
            Math.floor(Math.random() * 2000) + 1000
          ));

        } catch (error) {
          if (error.code === 50007) {
            dmKapali = true;
            activeDMs.set(hedef_Id, {
              ...activeDMs.get(hedef_Id),
              sonHata: 'DM kapalı'
            });
          } else {
            console.error("Beklenmeyen hata:", error);
            activeDMs.set(hedef_Id, {
              ...activeDMs.get(hedef_Id),
              sonHata: error.message
            });
          }
        }
      }

      // Tamamlanma embed'i
      const successEmbed = new EmbedBuilder()
        .setColor('#00ff00')
        .setTitle('Gönderim Tamamlandı')
        .setDescription(`**${basariliGonderim}/${mesaj_sayısı}** mesaj gönderildi`)
        .addFields(
          { name: 'Süre', value: `${((Date.now() - startTime)/1000).toFixed(1)} sn`, inline: true },
          { name: 'Ortalama Hız', value: `${(basariliGonderim/((Date.now() - startTime)/1000)).toFixed(1)} msg/sn`, inline: true }
        )
        .setFooter({ text: `Bot ${botIndex + 1}` })
        .setTimestamp();

      await logChannel.send({ embeds: [successEmbed] });
      if (ownerLogChannel) await ownerLogChannel.send({ embeds: [successEmbed] });

      try {
        await message.reply({
          content: `Gönderim tamamlandı! ${basariliGonderim} mesaj iletildi.`,
          ephemeral: true
        });
      } catch (error) {
        console.error("Tamamlanma bilgisi gönderilemedi:", error);
      }

    } catch (error) {
      // Hata yönetimi
      console.error("Kritik hata:", error);
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Kritik Hata')
        .setDescription('Gönderim sırasında hata oluştu!')
        .addFields(
          { name: 'Hata Kodu', value: error.code || 'Bilinmiyor', inline: true },
          { name: 'Mesaj', value: error.message.slice(0, 1000), inline: true }
        )
        .setTimestamp();

      await logChannel.send({ embeds: [errorEmbed] });
      if (ownerLogChannel) await ownerLogChannel.send({ embeds: [errorEmbed] });

      try {
        await message.reply({
          content: "Gönderim sırasında kritik hata oluştu!",
          ephemeral: true
        });
      } catch (replyError) {
        console.error("Hata bilgisi gönderilemedi:", replyError);
      }

    } finally {
      // Temizlik
      if (activeDMs.has(hedef_Id)) {
        const job = activeDMs.get(hedef_Id);
        if (job.aktif) {
          activeDMs.set(hedef_Id, { ...job, aktif: false });
        }
      }
    }
  }
}
};