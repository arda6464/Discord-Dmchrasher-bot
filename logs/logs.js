const fs = require('fs');
const path = require('path');
const { config } = require('process');



/**
 * Hataları hem logs klasörüne kaydeder hem de belirtilen logChannel'a gönderir.
 * 
 * 
 */
const logChannel = config.logChannel; // Log kanalını config dosyasından al

async function hataLogla(err, logChannel, context = 'Genel Hata') {
  const logKlasor = path.join(__dirname, '../logs');
  const logDosya = path.join(logKlasor, 'hatalar.txt');

  if (!fs.existsSync(logKlasor)) {
    fs.mkdirSync(logKlasor);
  }

  const zaman = new Date().toLocaleString('tr-TR');
  const hataMesaji = `[${zaman}] [${context}]\n${err.stack || err}\n\n`;

  // Dosyaya kaydet
  fs.appendFile(logDosya, hataMesaji, (fsErr) => {
    if (fsErr) console.error('Hata log dosyasına yazılamadı:', fsErr);
  });

  // Discord kanalına gönder
  if (logChannel && logChannel.send) {
    try {
      await logChannel.send({
        content: `⚠️ **Hata - ${context}**\n\`\`\`${(err.stack || err).slice(0, 1900)}\`\`\``
      });
    } catch (sendErr) {
      console.error('Log kanalına hata gönderilemedi:', sendErr);
    }
  }
}

module.exports = hataLogla;
