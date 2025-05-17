const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const hataLogla = require('../../logs/logs.js'); // fonksiyonu import et


const lastExecution = new Map();
const activeDMs = new Map();

let DEFULT_MAX_MESSAGES = 100;
let PREMİUM_MAX_MESSAGES = 250;
let ULTRA_PREMİUM_MAX_MESSAGES = 500;
let MESSAGE_CONTENT = config.defultmessage;

module.exports = {
  execute: async (message, client, botIndex, isModerator) => {
    if (message.channel.id !== config.commandChannelId) {
      if (isModerator) {
        try {
          await message.reply({
            content: `Bu komutu sadece <#${config.commandChannelId}> kanalında kullanabilirsin!`,
            ephemeral: true
          });
        } catch (error) {
          console.error(`Moderatör bot cevap veremedi:`, error);
          hataLogla(err, logChannel, 'mod bot cevap veremedi');
        }
      }
      return;
    }
    const args = message.content.split(' ');
    const test = message.member;
    const isPremium = test.roles.cache.has(config.PremiumId) || test.roles.cache.has(config.ultrapremiumId);
    const isUltraPremium = test.roles.cache.has(config.ultrapremiumId);
     const targetId = args[1];
    const messageCount = parseInt(args[2]);
    const ozelmesaj_ilk = args.slice(3).join(" ");
    

   // Premium argüman kontrolü
if (isPremium && args.length !== 4) {
  try {
    if (isModerator) {
      await message.reply({
        content: ' o komutu yanlış kullanıyorsun karşim Kullanım: t!dm <kullanıcı_id> <mesaj_sayısı> <mesaj>',
        ephemeral: true
      });
    }
  } catch (error) {
    console.error("Premium kullanım hatası gönderilemedi:", error);
    hataLogla(error, logChannel, 'premium bot cevap veremedi'); // Hatalı: `err` yerine `error` olmalıydı
  }
  return;
}
if (message.content.includes('https://') || message.content.includes('http://') || message.content.includes('www.')) {
  if (isModerator) {
    await message.reply('linkli mesaj göndermek için premium gerekli');
  }
  return;
}



// Normal kullanıcı argüman kontrolü
if (!isPremium && args.length !== 3) { // premium olmayanlar için 3 argüman
  try {
    if (isModerator) {
      await message.reply({
        content: 'Kullanım: t!dm <kullanıcı_id> <mesaj_sayısı>',
        ephemeral: true
      });
    }
  } catch (error) {
    console.error("Normal kullanım hatası gönderilemedi:", error);
    hataLogla(error, logChannel, 'normal bot cevap veremedi');
  }
  return;
}

// Komut içinde
if (lastExecution.has(message.author.id) && Date.now() - lastExecution.get(message.author.id) < 30000) {
  if (isModerator) {
    try {
      await message.reply({
        content: 'Bu komutu tekrar kullanmak için 30 saniye beklemelisin....',
        ephemeral: true
      });
    } catch (error) {
      console.error("Sonraki kullanım hatası gönderilemedi:", error);
      hataLogla(error, logChannel, 'sonraki bot cevap veremedi');
    }
  }
  return;
}
lastExecution.set(message.author.id, Date.now());

// Link kontrolü (öncelik sırasına göre yazıldı)
if (message.content.includes('discord.gg') || message.content.includes('.gg/')) {
  if (isModerator) {
    await message.reply('discord linki gönderemezsin karşim ?!!?!!');
  }
  return;
}

if (message.content.includes('https://') || message.content.includes('http://') || message.content.includes('www.')) {
  if(!isUltraPremium){
  if (isModerator) {
    await message.reply('linkli mesaj göndermek için premium gerekli <:a:nono:1371932269924712498> ');
  }
  
}
return;
}


   

    if(isPremium){
  DEFULT_MAX_MESSAGES = PREMİUM_MAX_MESSAGES;
}

if(isUltraPremium){
  DEFULT_MAX_MESSAGES = ULTRA_PREMİUM_MAX_MESSAGES;
}


    if (isNaN(messageCount) || messageCount < 1 || messageCount > DEFULT_MAX_MESSAGES) {
      if (isModerator) {
        try {
          await message.reply({
            content: `Mesaj sayısı 1 ile ${DEFULT_MAX_MESSAGES} arasında olmalı!`,
            ephemeral: true
          });
        } catch (error) {
          console.error(`Moderatör bot mesaj sayısı hatası gönderemedi:`, error);
          hataLogla(err, logChannel, 'mod bot mesaj sayısı hatası gönderemedi');
        }
      }
      return;
    }

    let logChannel;
    let ownerLogChannel;
    if (isModerator) {
      logChannel = await client.channels.fetch(config.logChannelId).catch(() => null);
      if (config.ownerLogChannelId) {
        ownerLogChannel = await client.channels.fetch(config.ownerLogChannelId).catch(() => null);
      }
      
      if (!logChannel) {
        try {
          await message.reply({
            content: 'Log kanalı bulunamadı, lütfen config.json dosyasını kontrol et.',
            ephemeral: true
          });
        } catch (error) {
          console.error(`Moderatör bot log kanalı hatası gönderemedi:`, error);
          hataLogla(err, logChannel, 'mod bot log kanalı hatası gönderemedi');
        }
        return;
      }
    }

    try {
      const targetUser = await client.users.fetch(targetId);
      if (activeDMs.has(targetId)) {
        if (isModerator) {
          try {
            await message.reply({
              content: 'Bu kullanıcıya zaten bir DM işlemi yapılıyor!',
              ephemeral: true
            });
          } catch (error) {
            console.error(`Moderatör bot aktif DM hatası gönderemedi:`, error);

          }
        }
        return;
      }

      // Rol kontrolü
      const guild = message.guild;
      const member = await guild.members.fetch(targetId).catch(() => null);
      if (member && member.roles.cache.has(config.noSpamRoleId)) {
        if (isModerator && logChannel) {
          const roleEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('❌ İşlem Tamamlanamadı')
            .setDescription(`<@${targetId}> kullanıcısına spam atılamaz, koruma rolüne sahip!`)
            .addFields(
              { name: 'Kullanıcı', value: `${targetUser.tag} (${targetId})`, inline: true },
              { name: 'Hata', value: 'Spam koruma rolü', inline: true }
            )
            .setTimestamp();
          await logChannel.send({ embeds: [roleEmbed] });
          await message.reply({
            content: `<@${targetId}> kullanıcısına spam atılamaz, koruma rolüne sahip!`,
            ephemeral: true
          });
          
          // Owner log kanalına da bildirim gönder
          if (ownerLogChannel) {
            const ownerRoleEmbed = new EmbedBuilder()
              .setColor('#FF0000')
              .setTitle('❌ KORUMALI KULLANICI')
              .setDescription(`<@${message.author.id}> kullanıcısı, koruma rolüne sahip <@${targetId}> kullanıcısına spam atmaya çalıştı!`)
              .addFields(
                { name: 'Hedef Kullanıcı', value: `${targetUser.tag} (${targetId})`, inline: true },
                { name: 'İsteyen Kullanıcı', value: `${message.author.tag} (${message.author.id})`, inline: true },
                { name: 'Mesaj Sayısı', value: `${messageCount}`, inline: true }
              )
              .setTimestamp();
            await ownerLogChannel.send({ embeds: [ownerRoleEmbed] });
          }
        }
        return;
      }
    
      activeDMs.set(targetId, true);
      
      // İşlem başlama mesajı
      if (isModerator && logChannel) {
        const startEmbed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('🚀 İşlem Başlatıldı')
          .setDescription(`**Onur ${botIndex + 1}** <@${targetId}> kullanıcısına ${messageCount} mesaj göndermeye başlıyor...`)
          .addFields(
            { name: 'Kullanıcı', value: `${targetUser.tag} (${targetId})`, inline: true },
            { name: 'Mesaj Sayısı', value: `${messageCount}`, inline: true },
            { name: 'Durum', value: '⏳ İşlem devam ediyor...', inline: true }
          )
          .setFooter({ text: `Tarafından: ${message.author.tag}` })
          .setTimestamp();
        await logChannel.send({ embeds: [startEmbed] });
      }
      
      // Owner log kanalına başlangıç mesajı
      if (ownerLogChannel) {
        const ownerStartEmbed = new EmbedBuilder()
          .setColor('#0099FF')
          .setTitle('🔥 YENİ SPAM İŞLEMİ BAŞLATILDI')
          .setDescription(`<@${message.author.id}> kullanıcısı, <@${targetId}> kullanıcısına **Onur ${botIndex + 1}** botu ile spam başlattı.`)
          .addFields(
            { name: 'Hedef Kullanıcı', value: `${targetUser.tag} (${targetId})`, inline: true },
            { name: 'İsteyen Kullanıcı', value: `${message.author.tag} (${message.author.id})`, inline: true },
            { name: 'Mesaj Sayısı', value: `${messageCount}`, inline: true },
            { name: 'Bot', value: `Onur ${botIndex + 1}`, inline: true },
            { name: 'Sunucu', value: message.guild.name, inline: true },
            { name: 'Kanal', value: message.channel.name, inline: true }
          )
          .setTimestamp();
        await ownerLogChannel.send({ embeds: [ownerStartEmbed] });
      }

      let sentCount = 0;
      let dmClosed = false;
      ozelmesaj = ozelmesaj_ilk ? ozelmesaj_ilk : MESSAGE_CONTENT;
      console.log('Mesaj:', ozelmesaj);
      let botIdSet = new Set(); // <-- farklı botları takip etmek için


      for (let i = 0; i < messageCount; i++) {
        try {
          await targetUser.send(ozelmesaj);
          botIdSet.add(client.user.id); // <-- mesaj atan botun ID’sini kaydet
          sentCount++;
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          if (error.code === 50007) {
            dmClosed = true;
            
            // DM kapatma embedli mesajı
            if (isModerator && logChannel) {
              const dmClosedEmbed = new EmbedBuilder()
                .setColor('#FF6347')
                .setTitle('⛔ DM Kapatıldı')
                .setDescription(`**KAŞAR <@${targetId}> DM KAPADI!**`)
                .addFields(
                  { name: 'Kullanıcı', value: `${targetUser.tag} (${targetId})`, inline: true },
                  { name: 'Gönderilen Mesaj', value: `${sentCount}/${messageCount}`, inline: true },
                  { name: 'Durum', value: '❌ Engellendi', inline: true }
                )
                .setImage('https://tenor.com/view/po-us-closed-gif-23306036')
                .setFooter({ text: 'DM Kapatmak Kurtarmaz xd' })
                .setTimestamp();
              await logChannel.send({ embeds: [dmClosedEmbed] });
              
              await message.reply({
                content: `<@${targetId}> korkak orosbu çoçuğunun DM'leri kapalı!`,
                ephemeral: true
              });
            }
            
            // Owner log kanalına DM kapatma bildirimi
            if (ownerLogChannel) {
              const ownerDmClosedEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('⛔ DM KAPATILDI')
                .setDescription(`<@${targetId}> kullanıcısı DM'lerini kapattı veya botu engelledi!`)
                .addFields(
                  { name: 'Hedef Kullanıcı', value: `${targetUser.tag} (${targetId})`, inline: true },
                  { name: 'İsteyen Kullanıcı', value: `${message.author.tag} (${message.author.id})`, inline: true },
                  { name: 'Gönderilen Mesaj', value: `${sentCount}/${messageCount}`, inline: true }
                 
                )
                .setTimestamp();
              await ownerLogChannel.send({ embeds: [ownerDmClosedEmbed] });
            }
            
            break;
          }
        }
      }

      // İşlem tamamlanma mesajı
      if (!dmClosed && isModerator && logChannel) {
        const successEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('✅ İşlem Tamamlandı')
          .setDescription(`<@${targetId}> kullanıcısına ${messageCount} mesaj başarıyla gönderildi.`)
          .addFields(
            { name: 'Kullanıcı', value: `${targetUser.tag} (${targetId})`, inline: true },
            { name: 'Mesaj Sayısı', value: `${messageCount}`, inline: true },
            { name: 'Kullanılan bot sayısı', value: `${botIdSet.size}`, inline: true },
            { name: 'Durum', value: '✅ Tamamlandı', inline: true }
          )
          .setFooter({ text: `Tarafından: ${message.author.tag}` })
          .setTimestamp();
        await logChannel.send({ embeds: [successEmbed] });
      }
      
      // Owner log kanalına tamamlanma bildirimi
      if (!dmClosed && ownerLogChannel) {
        const ownerSuccessEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('✅ SPAM İŞLEMİ TAMAMLANDI')
          .setDescription(`<@${targetId}> kullanıcısına başarıyla ${messageCount} mesaj gönderildi.`)
          .addFields(
            { name: 'Hedef Kullanıcı', value: `${targetUser.tag} (${targetId})`, inline: true },
            { name: 'İsteyen Kullanıcı', value: `${message.author.tag} (${message.author.id})`, inline: true },
            { name: 'Gönderilen Mesaj', value: `${messageCount}/${messageCount}`, inline: true },

            { name: 'Süre', value: `${messageCount} saniye`, inline: true }
          )
          .setTimestamp();
        await ownerLogChannel.send({ embeds: [ownerSuccessEmbed] });
      }

    } catch (error) {
      if (error.code !== 50007 && isModerator && logChannel) {
        const errorEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌ İşlem Tamamlanamadı')
          .setDescription(`<@${targetId}> kullanıcısına mesaj gönderilemedi.`)
          .addFields(
            { name: 'Kullanıcı', value: targetId, inline: true },
            { name: 'Hata', value: error.message || 'Bilinmeyen hata', inline: true }
          )
          .setTimestamp();
        await logChannel.send({ embeds: [errorEmbed] });
        await message.reply({
          content: 'Hata: Kullanıcı bulunamadı veya mesaj gönderilemedi.',
          ephemeral: true
        });
        
        // Owner log kanalına hata bildirimi
        if (ownerLogChannel) {
          const ownerErrorEmbed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('❌ SPAM İŞLEMİ BAŞARISIZ')
            .setDescription(`<@${targetId}> kullanıcısına mesaj gönderme işlemi başarısız oldu.`)
            .addFields(
              { name: 'Hedef Kullanıcı', value: targetId, inline: true },
              { name: 'İsteyen Kullanıcı', value: `${message.author.tag} (${message.author.id})`, inline: true },
              { name: 'Hata Mesajı', value: error.message || 'Bilinmeyen hata', inline: true },
              { name: 'Bot', value: `Onur ${botIndex + 1}`, inline: true },
              { name: 'Hata Kodu', value: error.code || 'Yok', inline: true }
            )
            .setTimestamp();
          await ownerLogChannel.send({ embeds: [ownerErrorEmbed] });
        }
      }
    } finally {
      activeDMs.delete(targetId);
    }
  }
};