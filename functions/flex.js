const bot = require('./../bot.js');

var self = {
  order: function (replyToken, idTransaksi, dataWarung) {
    var db = bot.database;
    var client = bot.client;
    var ref = db.ref("transaksi/makanan/"+idTransaksi);
    ref.once("value", function(snapshot) {
      data = snapshot.val();
      console.log(data);
      var pesanan = {};
      var text = "Pesen ";
      for (var menu in data.pesanan) {
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
                "text": "INVOICE",
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
                      "label": "PESAN",
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
      console.log(JSON.stringify(flexMsg));
      return client.replyMessage(replyToken, [
        {
          "type": "text",
          "text": `Berikut invoice pemesanan kakak 􀰂􀄦wink􏿿`
        },
        flexMsg
      ]);
      process.exit();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

  },
  orderNote: function (replyToken, idTransaksi, dataWarung, note) {
    var db = bot.database;
    var client = bot.client;
    var ref = db.ref("transaksi/makanan/"+idTransaksi);

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
                "text": "INVOICE",
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
                    "text": "CATATAN",
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
                      "label": "PESAN",
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
      return client.replyMessage(replyToken, [
          {
            "type": "text",
          "text": `Terima kasih telah memesan via Dikampus 􀰂􀄥excited􏿿 \nSilakan tap tombol Pesan untuk melanjutkan transaksi`
          },
          flexMsg
        ]);
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
          "contents": []
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
            "aspectRatio": "1:1",
            "aspectMode": "cover",
            "action": {
              "type": "message",
              "text": kat
            }
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "action": {
              "type": "message",
              "text": kat
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
                "type": "button",
                "style": "link",
                "color": "#0B5ED7",
                "action": {
                  "type": "message",
                  "label": "Lihat Semua",
                  "text": kat
                }
              }
            ]
          }
        }
        for (var menu in itemKat) {
          var itemMenu = itemKat[menu];
          if (menu !== 'thumbnail') {
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
          }
          jmlMenu++;
          if (jmlMenu >= 3) {
            break;
          } else {
            kategori.body.contents[0].contents.push({
              "type": "separator",
              "margin": "lg"
            });
          }
        }
        flexMsg.contents.contents.push(kategori);
        jmlKat++;
      }
      return client.replyMessage(replyToken, [
      {
        "type": "text",
        "text": `Ini menu di ${warung} 􀰂􀄤smiling􏿿`
      },
      flexMsg
      ]);
      process.exit();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  },
  menu: function (replyToken, warung, kategori, res) {
    var db = bot.database;
    var client = bot.client;
    var isFirst = true;
    var ref = db.ref("warung/"+warung+"/menu/"+kategori);
    if (res) {
      isFirst = false;
      ref = ref.orderByKey().startAt(res);
    }
    ref.once("value", function(snapshot) {
      data = snapshot.val();
      var flexMsg = {
        "type": "flex",
        "altText": "Menu Kategori " + kategori,
        "contents": {
          "type": "carousel",
          "contents": []
        }
      };
      var jmlMenu = 1;
      for (var menu in data) {
        var itemMenu = data[menu];
        if (menu !== "thumbnail") {
          if (jmlMenu > 9) {
            var lainnya = {
              "type": "bubble",
              "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "sm",
                "action": {
                   "type":"postback",
                   "label":"Menu Lainnya",
                   "data":"data=menu&warung="+warung+"&kategori="+kategori+"&menu="+menu
                },
                "contents": [
                  {
                    "type": "button",
                    "flex": 1,
                    "gravity": "center",
                    "action": {
                       "type":"postback",
                       "label":"Menu Lainnya",
                       "data":"data=menu&warung="+warung+"&kategori="+kategori+"&menu="+menu
                    }
                  }
                ]
              }
            };
            flexMsg.contents.contents.push(lainnya);
            break;
          }
          var flexMenu = {
            "type": "bubble",
            "hero": {
              "type": "image",
              "size": "full",
              "aspectRatio": "1:1",
              "aspectMode": "cover",
              "url": itemMenu.thumbnail,
              "action": {
                "type": "message",
                "text": menu
              }
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "action": {
                "type": "message",
                "text": menu
              },
              "contents": [
                {
                  "type": "text",
                  "text": menu,
                  "wrap": true,
                  "weight": "bold",
                  "size": "lg"
                },
                {
                  "type": "text",
                  "text": itemMenu.deskripsi,
                  "wrap": true,
                  "color": "#aaaaaa",
                  "size": "xxs"
                },
                {
                  "type": "separator",
                  "margin": "lg"
                },
                {
                  "type": "box",
                  "layout": "baseline",
                  "margin": "lg",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Rp " + itemMenu.harga.toString(),
                      "size" : "md",
                      "wrap": true
                    }
                  ]
                }
              ]
            },
            "footer": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "button",
                  "style": "link",
                  "color": "#0B5ED7",
                  "action": {
                    "type": "message",
                    "label": "+ Tambahkan",
                    "text": menu
                  }
                }
              ]
            }
          };
          flexMsg.contents.contents.push(flexMenu);
          jmlMenu++;
        }
      }
      console.log(flexMsg);
      if (isFirst) {
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
      process.exit();
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  },
  warung: function (replyToken, warung) {
    var db = bot.database;
    var client = bot.client;
    var isFirst = true;
    var ref = db.ref("warung");
    if (warung !== null) {
      isFirst = false;
      ref = ref.orderByKey().startAt(warung);
    }
    ref.once("value", function(snapshot) {
      data = snapshot.val();
      var flexMsg = {
        "type": "flex",
        "altText": "Rekomendasi Warung",
        "contents": {
          "type": "carousel",
          "contents": []
        }
      };
      var jmlWarung = 1;
      for (var warung in data) {
        var itemWarung = data[warung];
        if (jmlWarung > 9) {
          var lainnya = {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "spacing": "sm",
              "action": {
                 "type":"postback",
                 "label":"Warung Lainnya",
                 "data":"data=warung&warung="+warung
              },
              "contents": [
                {
                  "type": "button",
                  "flex": 1,
                  "gravity": "center",
                  "action": {
                     "type":"postback",
                     "label":"Warung Lainnya",
                     "data":"data=warung&warung="+warung
                  }
                }
              ]
            }
          };
          flexMsg.contents.contents.push(lainnya);
          break;
        }
        var flexWarung = {
          "type": "bubble",
          "hero": {
            "type": "image",
            "url": itemWarung.thumbnail,
            "size": "full",
            "aspectRatio": "1:1",
            "aspectMode": "cover",
            "action": {
              "type": "message",
              "text": warung
            }
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "action": {
              "type": "message",
              "text": warung
            },
            "contents": [
              {
                "type": "text",
                "text": warung,
                "weight": "bold",
                "size": "xl"
              },
              {
                "type": "box",
                "layout": "vertical",
                "margin": "lg",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Alamat",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": itemWarung.alamat,
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 4
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Buka",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": itemWarung.jamBuka,
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 4
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "baseline",
                    "spacing": "sm",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Ongkir",
                        "color": "#aaaaaa",
                        "size": "sm",
                        "flex": 1
                      },
                      {
                        "type": "text",
                        "text": itemWarung.ongkir,
                        "wrap": true,
                        "color": "#666666",
                        "size": "sm",
                        "flex": 4
                      }
                    ]
                  }
                ]
              }
            ]
          },
          "footer": {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": [
              {
                "type": "button",
                "style": "link",
                "color": "#0B5ED7",
                "height": "sm",
                "action": {
                  "type": "message",
                  "label": "Pilih Warung",
                  "text": warung
                }
              },
              {
                "type": "spacer",
                "size": "sm"
              }
            ],
            "flex": 0
          }
        }
        jmlWarung++;
        flexMsg.contents.contents.push(flexWarung);
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
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  },
  bar: function () {
    console.log("function bar");
  }
};

module.exports = self;
