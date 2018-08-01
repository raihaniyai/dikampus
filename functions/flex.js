const bot = require('./../bot.js');

var self = {
  order: function (replyToken, idTransaksi, dataWarung) {
    var db = bot.database;
    var client = bot.client;
    var ref = db.ref("transaksi/"+idTransaksi);
    ref.once("value", function(snapshot) {
      data = snapshot.val();
      var pesanan = {};
      var text = "Pesen ";
      for (menu in data.pesanan) {
        text += menu + " " + data.pesanan[menu].jumlah + ", "
      }
      text += "kirim ke " + data.alamat;
      text = encodeURIComponent(text);
      var url = "https://api.whatsapp.com/send?phone="+dataWarung.nomorWarung+"&text="+text;
      var flexMsg = {
        "type": "flex",
        "altText": "Invoice",
        "contents": {
          "type": "bubble",
          "styles": {
            "footer": {
              "separator": true
            }
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "RECEIPT",
                "weight": "bold",
                "color": "#1DB446",
                "size": "sm"
              },
              {
                "type": "text",
                "text": data.warung,
                "weight": "bold",
                "size": "xxl",
                "margin": "md"
              },
              {
                "type": "text",
                "text": dataWarung.alamat,
                "size": "xs",
                "color": "#aaaaaa",
                "wrap": true
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "separator",
                    "margin": "xxl"
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "margin": "xxl",
                    "contents": [
                      {
                        "type": "text",
                        "text": "TOTAL",
                        "size": "sm",
                        "color": "#555555"
                      }
                    ]
                  },
                  {
                    "type": "separator",
                    "margin": "xxl"
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "margin": "xxl",
                    "contents": [
                      {
                        "type": "text",
                        "text": "ALAMAT PENGIRIMAN",
                        "size": "sm",
                        "color": "#555555"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "spacer",
                    "size": "xl"
                  },
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#0B5ED7",
                    "action": {
                      "type": "uri",
                      "label": "Order",
                      "uri": url
                    }
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "message",
                      "label": "Catatan Tambahan",
                      "text": "Catatan tambahan dong"
                    }
                  }
                ]
              }
            ]
          }
        }
      };
      var totalHarga = 0;
      var jmlData = 0;
      for (result in data.pesanan){
        totalHarga += data.pesanan[result].jumlah * data.pesanan[result].harga;
        viewHarga = data.pesanan[result].jumlah + ' x ' + data.pesanan[result].harga;
        pesanan = {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "text": result,
              "size": "sm",
              "color": "#555555",
              "flex": 0
            },
            {
              "type": "text",
              "text": viewHarga,
              "size": "sm",
              "color": "#111111",
              "align": "end"
            }
          ]
        };
        flexMsg.contents.body.contents[4].contents.unshift(pesanan);
        jmlData++;
      }
      var showTotal = {
        "type": "text",
        "text": "Rp " + totalHarga.toString(),
        "weight": "bold",
        "size": "sm",
        "color": "#111111",
        "align": "end"
      };
      var showAlamat = {
        "type": "text",
        "margin": "sm",
        "text": data.alamat,
        "wrap": true,
        "size": "xs",
        "color": "#111111",
        "align": "start"
      };
      ref.child('totalHarga').set(totalHarga);
      flexMsg.contents.body.contents[4].contents[1+jmlData].contents.push(showTotal);
      flexMsg.contents.body.contents[4].contents[3+jmlData].contents.push(showAlamat);
      return client.replyMessage(replyToken, flexMsg);
      process.exit();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

  },
  orderNote: function (replyToken, idTransaksi, dataWarung, note) {
    var db = bot.database;
    var client = bot.client;
    var ref = db.ref("transaksi/"+idTransaksi);

    ref.once("value", function(snapshot) {
      data = snapshot.val();
      var pesanan = {};
      var text = "Pesen ";
      for (menu in data.pesanan) {
        text += menu + " " + data.pesanan[menu].jumlah + ", "
      }
      text += note + ", ";
      text += "kirim ke " + data.alamat;
      text = encodeURIComponent(text);
      var url = "https://api.whatsapp.com/send?phone="+dataWarung.nomorWarung+"&text="+text;
      var flexMsg = {
        "type": "flex",
        "altText": "Invoice",
        "contents": {
          "type": "bubble",
          "styles": {
            "footer": {
              "separator": true
            }
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "text",
                "text": "RECEIPT",
                "weight": "bold",
                "color": "#1DB446",
                "size": "sm"
              },
              {
                "type": "text",
                "text": data.warung,
                "weight": "bold",
                "size": "xxl",
                "margin": "md"
              },
              {
                "type": "text",
                "text": dataWarung.alamat,
                "size": "xs",
                "color": "#aaaaaa",
                "wrap": true
              },
              {
                "type": "separator",
                "margin": "xxl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "xxl",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "separator",
                    "margin": "xxl"
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "margin": "xxl",
                    "contents": [
                      {
                        "type": "text",
                        "text": "TOTAL",
                        "size": "sm",
                        "color": "#555555"
                      }
                    ]
                  },
                  {
                    "type": "separator",
                    "margin": "xxl"
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "margin": "xxl",
                    "contents": [
                      {
                        "type": "text",
                        "text": "ALAMAT PENGIRIMAN",
                        "size": "sm",
                        "color": "#555555"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents":[
                  {"type":"spacer",
                    "size" : "xl"
                  },
                  {
                    "type": "text",
                    "text": "NOTES",
                    "size": "sm",
                    "color": "#555555"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "spacer",
                    "size": "xl"
                  },
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#0B5ED7",
                    "action": {
                      "type": "uri",
                      "label": "Order",
                      "uri": url
                    }
                  }
                ]
              }
            ]
          }
        }
      };
      var jmlData = 0;
      for (result in data.pesanan){
        viewHarga = data.pesanan[result].jumlah + ' x ' + data.pesanan[result].harga;
        pesanan = {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "text": result,
              "size": "sm",
              "color": "#555555",
              "flex": 0
            },
            {
              "type": "text",
              "text": viewHarga,
              "size": "sm",
              "color": "#111111",
              "align": "end"
            }
          ]
        };
        flexMsg.contents.body.contents[4].contents.unshift(pesanan);
        jmlData++;
      }
      var showTotal = {
        "type": "text",
        "text": "Rp " + data.totalHarga.toString(),
        "weight": "bold",
        "size": "sm",
        "color": "#111111",
        "align": "end"
      };
      var showAlamat = {
        "type": "text",
        "margin": "sm",
        "text": data.alamat,
        "wrap": true,
        "size": "xs",
        "color": "#111111",
        "align": "start"
      };
      var showNote = {
        "type": "text",
        "margin": "sm",
        "text": data.note,
        "wrap": true,
        "size": "xs",
        "color": "#111111",
        "align": "start"
      };
      flexMsg.contents.body.contents[4].contents[1+jmlData].contents.push(showTotal);
      flexMsg.contents.body.contents[4].contents[3+jmlData].contents.push(showAlamat);
      flexMsg.contents.body.contents[5].contents.push(showNote);
      return client.replyMessage(replyToken , flexMsg);
      process.exit();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  },
  kategori: function (replyToken, warung) {
    var db = bot.database;
    var client = bot.client;
    var ref = db.ref("warung/"+warung+"/menu");
    ref.once("value", function(snapshot) {
      data = snapshot.val();
      var flexMsg = {
        "type": "flex",
        "altText": "Kategori di " + warung,
        "contents": {
          "type": "carousel",
          "contents": [
          ]
        }
      };
      var jmlKat = 0;
      for (var kat in data) {
        var jmlMenu = 0;
        var itemKat = data[kat];
        var kategori = {
          "type": "bubble",
          "header": {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": kat,
                "weight": "bold",
                "color": "#222222",
                "size": "lg"
              }
            ]
          },
          "hero": {
            "type": "image",
            "url": itemKat.thumbnail,
            "size": "full",
            "aspectRatio": "20:13",
            "aspectMode": "cover",
            "action": {
              "type": "uri",
              "uri": "https://linecorp.com"
            }
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "action": {
              "type": "uri",
              "uri": "https://linecorp.com"
            },
            "contents": [
              {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "contents": []
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "spacer",
                "size": "xxl"
              },
              {
                "type": "button",
                "style": "link",
                "color": "#0B5ED7",
                "action": {
                  "type": "text",
                  "label": "Lihat Menu",
                  "message": kat
                }
              }
            ]
          }
        };
        for (var menu in itemKat) {
          var itemMenu = itemKat[menu];
          var flexMenu = {
            "type": "box",
            "layout": "baseline",
            "contents": [
              {
                "type": "text",
                "text": menu,
                "weight": "bold",
                "size": "sm",
                "margin": "sm",
                "flex": 0
              },
              {
                "type": "text",
                "text": itemMenu.harga.toString(),
                "size": "sm",
                "align": "end",
                "color": "#222222"
              }
            ]
          };
          var deskripsiMenu = {
            "type": "text",
            "text": itemMenu.deskripsi,
            "wrap": true,
            "color": "#aaaaaa",
            "size": "xxs"
          };
          kategori.body.contents[0].contents.push(flexMenu);
          kategori.body.contents[0].contents.push(deskripsiMenu);
          jmlMenu++;
          if (jmlMenu < 3) {
            break;
          } else {
            kategori.body.contents[0].contents.push({
              "type": "separator",
              "margin": "lg"
            });
          }
        }
        flexMsg.contents.contents.unshift(kategori);
        jmlKat++;
      }
      console.log(JSON.stringify(flexMsg));
      return client.replyMessage(replyToken, flexMsg);
      process.exit();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  },
  bar: function () {
    console.log("function bar");
  }
};

module.exports = self;
