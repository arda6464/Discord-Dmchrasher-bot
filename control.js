const fs = require('fs');

// ok.txt dosyasını oku
fs.readFile('ok.txt', 'utf8', (err, data) => {
  if (err) {
    console.log("Bir hata oluştu:", err);
    return;
  }

  // ok.txt dosyasındaki token'ları bir diziye ayır
  const tokens = data.split('\n').map(line => line.trim()).filter(line => line.length > 0);

  // JSON formatında bir yapı oluştur
  const tokenList = tokens.map(token => {
    return { "token": token };
  });

  // test.json dosyasına yaz
  fs.writeFile('test.json', JSON.stringify(tokenList, null, 2), (err) => {
    if (err) {
      console.log("Dosyaya yazarken hata oluştu:", err);
    } else {
      console.log("Token'lar test.json dosyasına başarıyla yazıldı!");
    }
  });
});
