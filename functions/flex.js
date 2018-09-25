const bot = require('./../bot.js');
const analytics = require('./analytics.js');
// Require Flex Message
const invoice = require('./../flex/invoice.js');
const flexKategori = require('./../flex/kategori.js');
const flexMenu = require('./../flex/menu.js');
const flexWarung = require('./../flex/warung.js');

module.exports = {
  order: function (replyToken, idTransaksi, dataWarung) {
    var db = bot.database;
    var client = bot.client;
    var updateRef = db.ref("statistik/transaksi");
    updateRef.transaction(function(transCounter) {
      return (transCounter) + 1;
    });
    var ref = db.ref("transaksi/makanan/"+idTransaksi);
    ref.once("value", function(snapshot) {
      data = snapshot.val();
      var pesanan = {};
      var text = "[ dipesan via dikampus.id ]\n\nPesen ";
      for (var menu in data.pesanan) {
        text += menu + " (" + data.pesanan[menu].jumlah + "), "
      }
      analytics.saveTransaction(idTransaksi, data);
      text += "kirim ke " + data.alamat;
      text = encodeURIComponent(text);
      var url = "https://api.whatsapp.com/send?phone="+dataWarung.nomorWarung+"&text="+text;
      /* Calling invoice's flex.
      Value of parameter is 1) Warung 2) Alamat Warung 3) URL for Whatsapp API 4) Note for Transaction, in this case note is null */
      var flexMsg = invoice.flex(data.warung, dataWarung.alamat, url, null);
      var totalHarga = 0;
      var jmlData = 0;
      for (result in data.pesanan){
        totalHarga += data.pesanan[result].jumlah * data.pesanan[result].harga;
        viewHarga = data.pesanan[result].jumlah + ' x ' + data.pesanan[result].harga;
        pesanan = invoice.item(result, viewHarga);
        flexMsg.contents.body.contents[4].contents.unshift(pesanan);
        jmlData++;
      }
      var showTotal = {"type":"text","text":"Rp " + totalHarga.toString(),"weight":"bold","size":"sm","color":"#111111","align":"end"};
      var showAlamat = {"type":"text","margin":"sm","text":data.alamat,"wrap":true,"size":"xs","color":"#111111","align":"start"};
      ref.child('totalHarga').set(totalHarga);
      flexMsg.contents.body.contents[4].contents[1+jmlData].contents.push(showTotal);
      flexMsg.contents.body.contents[4].contents[3+jmlData].contents.push(showAlamat);
      return client.replyMessage(replyToken, [
        {
          "type": "text",
          "text": `Berikut invoice pemesanan kakak 􀰂􀄦wink􏿿`
        },
        flexMsg
      ]);
      process.exit();
    });

  },
  orderNote: function (replyToken, idTransaksi, dataWarung, note) {
    var db = bot.database;
    var client = bot.client;
    var replyText = bot.replyText;
    var ref = db.ref("transaksi/makanan/"+idTransaksi);
    ref.once("value", function(snapshot) {
      data = snapshot.val();
      var pesanan = {};
      var text = "[ dipesan via dikampus.id ]\n\nPesen ";
      for (menu in data.pesanan) {
        text += menu + " (" + data.pesanan[menu].jumlah + "), "
      }
      text += note + ", ";
      text += "kirim ke " + data.alamat;
      text = encodeURIComponent(text);
      var url = "https://api.whatsapp.com/send?phone="+dataWarung.nomorWarung+"&text="+text;
      /* Calling invoice's flex.
      Value of parameter is 1) Warung 2) Alamat Warung 3) URL for Whatsapp API 4) Note for Transaction */
      var flexMsg = invoice.flex(data.warung, dataWarung.alamat, url, null);
      var jmlData = 0;
      for (result in data.pesanan){
        viewHarga = data.pesanan[result].jumlah + ' x ' + data.pesanan[result].harga;
        pesanan = {"type":"box","layout":"horizontal","contents":[{"type":"text","text":result,"size":"sm","color":"#555555","flex":0},{"type":"text","text":viewHarga,"size":"sm","color":"#111111","align":"end"}]};
        flexMsg.contents.body.contents[4].contents.unshift(pesanan);
        jmlData++;
      }
      var showTotal = {"type": "text","text": "Rp " + data.totalHarga.toString(),"weight": "bold","size": "sm","color": "#111111","align": "end"};
      var showAlamat = {"type":"text","margin":"sm","text":data.alamat,"wrap":true,"size":"xs","color":"#111111","align":"start"};
      var showNote = {"type":"text","margin":"sm","text":data.note,"wrap":true,"size":"xs","color":"#111111","align":"start"};
      flexMsg.contents.body.contents[4].contents[1+jmlData].contents.push(showTotal);
      flexMsg.contents.body.contents[4].contents[3+jmlData].contents.push(showAlamat);
      flexMsg.contents.body.contents[5].contents.push(showNote);
      return client.replyMessage(replyToken, [
          {
            "type": "text",
            "text": `Terima kasih telah memesan via Dikampus 􀰂􀄥excited􏿿 \nSilakan tap tombol Pesan untuk melanjutkan transaksi`
          },
          flexMsg
        ]);
      process.exit();
    });
  },
  kategori: function (replyToken, warung, userID) {
    // analytics.viewsCounter(warung, userID, "visit");
    var db = bot.database;
    var client = bot.client;
    var ref = db.ref("warung/"+warung+"/menu").orderByChild('priority');
    ref.on("value", function(snapshot) {
      data = snapshot.val();
      var flexMsg = {
        "type": "flex",
        "altText": "Kategori di " + warung,
        "contents": {
          "type": "carousel",
          "contents": []
        }
      };
      var BreakException = {};
      var jmlKat = 1;
      try {
        snapshot.forEach(function(data){
          var kategori = data.key;
          var dataKategori = data.val();
          var res = {};
          res[kategori] = dataKategori;
          var itemKategori = res[kategori];
          var kategoriRes = flexKategori.flex(itemKategori.thumbnail, kategori);
          var jmlMenu = 0;
          var hargaMax = 0;
          var hargaMin = 10000000;
          for (var menu in itemKategori) {
            var itemMenu = itemKategori[menu];
            if (menu !== 'thumbnail' && menu !== 'priority' && menu !== 'kategoriCounter') {
              var menuRes =  {"type":"box","layout":"horizontal","margin":"xxl","contents":[{"type":"text","text":menu,"weight":"regular","size":"sm","margin":"sm","flex":0}]};
              kategoriRes.body.contents[1].contents.push(menuRes);
              jmlMenu++;
              if (jmlMenu >= 3) {
                break;
              }
            }
          }
          for (var menu in itemKategori) {
            var itemMenu = itemKategori[menu];
            if (menu !== 'thumbnail' && menu !== 'priority' && menu !== 'kategoriCounter') {
              if (itemMenu.harga > hargaMax) {
                hargaMax = itemMenu.harga;
              }
              if (itemMenu.harga < hargaMin) {
                hargaMin = itemMenu.harga;
              }
            }
          }
          kategoriRes.body.contents[1].contents.unshift({"type": "separator", "margin": "sm"});
          kategoriRes.body.contents[1].contents.unshift({"type": "text", "text": "Harga mulai dari : Rp " + hargaMin + " - Rp " + hargaMax, "wrap": true, "color": "#aaaaaa", "size": "xxs"});
          flexMsg.contents.contents.push(kategoriRes);
          jmlKat++;
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      var updateRef = db.ref("warung/"+warung+"/warungCounter");
      updateRef.transaction(function(warungCounter) {
        if (warungCounter) {
          return (warungCounter) + 1;
        }
      });

      return client.replyMessage(replyToken, [
      {
        "type": "text",
        "text": `Ini menu di ${warung} 􀰂􀄤smiling􏿿`
      },
      flexMsg
      ]);
      process.exit();
    });
  },
  menu: function (replyToken, warung, kategori, menus, userID) {
    var db = bot.database;
    var client = bot.client;
    var replyText = bot.replyText;
    var isFirst = true;
    var isFound = true;
    var updateRef = db.ref("warung/"+warung+"/menu/"+kategori+"/kategoriCounter");
    updateRef.transaction(function(kategoriCounter) {
      if (kategoriCounter) {
        return (kategoriCounter) + 1;
      }
    });
    var ref = db.ref("warung/"+warung+"/menu/"+kategori).orderByChild('priority');
    if (menus) {
      isFirst = false;
      isFound = false;
    }
    ref.on("value", function(snapshot) {
      if (snapshot.val()) {
        var flexMsg = {
          "type": "flex",
          "altText": "Menu Kategori " + kategori,
          "contents": {
            "type": "carousel",
            "contents": []
          }
        };
        var BreakException = {};
        var jmlMenu = 1;
        try {
          snapshot.forEach(function(data){
            var menu = data.key;
            var dataMenu = data.val();
            var res = {};
            if (!isFirst) {
              if (menu == menus) isFound = true;
              if (isFound) res[menu] = dataMenu;
            } else {
              res[menu]= dataMenu;
            }
            var itemMenu = res[menu];
            if (menu !== 'thumbnail' && menu !== 'priority' && isFound && menu !== "kategoriCounter") {
              if (jmlMenu > 9) {
                var lainnya = flexMenu.lainnya(warung, kategori, menu);
                flexMsg.contents.contents.push(lainnya);
                throw BreakException;
              }
              var menuRes = flexMenu.flex(itemMenu.thumbnail, menu, itemMenu.deskripsi, itemMenu.harga.toString());
              flexMsg.contents.contents.push(menuRes);
              jmlMenu++;
            }
          });
        } catch (e) {
          if (e !== BreakException) throw e;
        }

        if (isFirst) {
          // analytics.viewsCounter(warung, userID, "item");
          return client.replyMessage(replyToken, [
            {
              "type": "text",
              "text": `Ini daftar menu ${kategori} yang ada di ${warung} 􀰂􀄤smiling􏿿`
            },
            flexMsg
          ]);
        } else {
          return client.replyMessage(replyToken, flexMsg);
        }
      } else {
        return replyText(replyToken, "Kategori itu gaada kak di warung ini");
      }
      process.exit();
    });
  },
  warung: function (replyToken, warungs, userId) {
    var db = bot.database;
    var client = bot.client;
    var isFirst = true;
    var isFound = true;
    var ref = db.ref("warung").orderByChild("priority");
    if (warungs) {
      isFirst = false;
      isFound = false;
    }
    ref.on("value", function(snapshot) {
      var flexMsg = {
        "type": "flex",
        "altText": "Rekomendasi Warung",
        "contents": {
          "type": "carousel",
          "contents": []
        }
      };
      var jmlWarung = 1;
      var BreakException = {};
      try {
        snapshot.forEach(function(data){
          var warung = data.key;
          var dataWarung = data.val();
          var res = {};
          if (!isFirst) {
            if (warung == warungs) isFound = true;
            if (isFound) res[warung] = dataWarung;
          } else {
            res[warung] = dataWarung;
          }
          var itemWarung = res[warung];
          if (isFound) {
            if (jmlWarung > 9) {
              var lainnya = flexWarung.lainnya(warung);
              flexMsg.contents.contents.push(lainnya);
              throw BreakException;
            }
            var warungRes = flexWarung.flex(itemWarung.thumbnail, warung, itemWarung.alamat, itemWarung.jamBuka, itemWarung.ongkir);
            // analytics.viewsRecommendedCounter(warung);
            flexMsg.contents.contents.push(warungRes);
            jmlWarung++;
          }
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
      if (!isFirst) {
        return client.replyMessage(replyToken, flexMsg);
      } else {
        return client.replyMessage(replyToken,[
          {
            "type": "text",
            "text": `Ini rekomendasi warung dari Dika 􀰂􀄥excited􏿿`
          },
          flexMsg
        ]);
      }
      process.exit();
    });
  }
};
