# Discord-Dmchrasher-bot

**DmChrasher**, Discord üzerinde kullanıcıların DM kanalına otomatik mesajlar gönderen ve belirli işlemler yapan basit bir bot projesidir.

---

## Özellikler

* Bot online olduğunda hazırda bekler.
* DM (Direct Message) kanalına otomatik mesaj gönderme.
* Kolay yapılandırma ve hızlı kurulum.

---

## Gereksinimler

* [Node.js](https://nodejs.org/) (v16 veya üzeri)
* Bir Discord bot token (Discord Developer Portal'dan alınmış)
* `config.json` dosyası için gerekli bilgiler

---

## Kurulum

1. Proje dosyalarını ZIP olarak indirin veya repoyu klonlayın:

   ```bash
   git clone https://github.com/arda6464/Discord-Dmchrasher-bot.git
   ```

2. ZIP dosyasını açtıysanız, içeriği seçtiğiniz bir klasöre çıkartın veya klonladıysanız o klasöre girin:

   ```bash
   cd Discord-Dmchrasher-bot
   ```

3. `config.json` dosyasını  düzenleyin 

4. Proje klasöründe terminali açın (örn. `Ctrl + Shift + `):

   ```bash
   npm install discord.js
   ```

   

5. Botu başlatın:

   ```bash
   node index.js
   ```

---

## Kullanım

* Botunuz çalışır hâle geldiğinde t!aktif  yazarak aktif bot sayısını görebilirsiniz.
* Prefix ile komutları tetikleyebilirsiniz. Örnek:

  ```bash
  t!help
  ```

### Mevcut Komutlar

| Komut                 | Açıklama                                 |
|-----------------------|------------------------------------------|
|`!help`                | Botun komut listesini gösterir.          |
|`!dm [id][sayı][mesaj]`| Belirtilen mesajı DM kanalına gönderir.  |
|`!pre`                 | premium özellikleri gösterir             |
|`!hesabım`             | kişinin hesabını gösterir                |
|`!lang` [dil]          | dil ayarı                                |


*Komut listesi ve açıklamalar geliştirilmeye açıktır.*

---

## Hata Giderme

* `Error: Token invalid` uyarısı alıyorsanız, `config.json` içerisindeki token bilgilerini kontrol edin.
* `Missing intents` hatası için `index.js` içinde gerekli intent ayarlarını gözden geçirin:

  ```js
  const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]});
  ```

---
## Not
* Bu altyapı discord.gg/vsc grubundan alınmıştır




© 2025 Time Ekibi
