const bot = require('./../bot.js');

var self = {
  order: function (replyToken, idTransaksi, url, dataWarung) {
    var db = bot.database;
    var client = bot.client;
    var ref = db.ref("transaksi/"+idTransaksi);
    ref.once("value", function(snapshot) {
      data = snapshot.val();
      var pesanan = {};
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
                "text": data.pesanan.warung,
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
                      },
                      {
                        "type": "text",
                        "margin": "sm",
                        "text": "Jalan Sukabirus no D38, Gang Mesjid Istiqomah",
                        "wrap": true,
                        "size": "xs",
                        "color": "#111111",
                        "align": "start"
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
                      "uri": "https://linecorp.com"
                    }
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "uri",
                      "label": "Catatan Tambahan",
                      "uri": "https://linecorp.com"
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
        totalHarga += result.jumlah * result.harga;
        viewHarga = result.jumlah + ' x ' + result.harga;
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
        "text": totalHarga,
        "weight": "bold",
        "size": "sm",
        "color": "#111111",
        "align": "end"
      };
      flexMsg.contents.body.contents[4].contents[1+jmlData].contents.push(showTotal);
      return client.replyMessage(replyToken , flexMsg);
      process.exit();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

  },
  orderNote: function (replyToken, body, url) {
    var db = bot.database;
    var client = bot.client;
    var outputParam = body.result.contexts[0].parameters;
    var warung = outputParam.warung;

    return client.replyMessage(replyToken , {
      "type": "template",
      "altText": "Invoice",
      "template": {
          "type": "buttons",
          "text": "Invoice: " + outputParam.menu[0] + " " + outputParam.jumlah[0] + ", "+ outputParam.note + ", dikirim ke "+outputParam.alamat+", Aku sambungin ke warung "+outputParam.warung+" ya? 👨‍🍳 ",
          "actions": [
            {
              "type": "uri",
              "label": "Iya ✔️",
              "uri": url
            }
          ]
      }
    });
  },
  bar: function () {
    console.log("function bar");
  }
};

module.exports = self;
