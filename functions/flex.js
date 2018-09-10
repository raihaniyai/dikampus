const bot = require('./../bot.js');
const analytics = require('./analytics.js');

var self = {
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
      console.log("orderNote");
      console.log(data);
      analytics.saveTransaction(idTransaksi, data);
      for (menu in data.pesanan) {
        text += menu + " (" + data.pesanan[menu].jumlah + "), "
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
    });
  },
  kategori: function (replyToken, warung) {
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
          var flexKategori = {
            "type": "bubble",
            "hero": {
              "type": "image",
              "url": itemKategori.thumbnail,
              "size": "full",
              "aspectRatio": "1:1",
              "aspectMode": "cover",
              "action": {
                "type": "message",
                "text": kategori
              }
            },
            "body": {
              "type": "box",
              "layout": "vertical",
              "spacing": "md",
              "action": {
                "type": "message",
                "text": kategori
              },
              "contents": [
                {
                  "type": "text",
                  "text": kategori,
                  "weight": "bold",
                  "size": "sm",
                  "margin": "sm",
                  "flex": 0
                },
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
                    "text": kategori
                  }
                }
              ]
            }
          }
          var jmlMenu = 0;
          var hargaMax = 0;
          var hargaMin = 10000000;
          for (var menu in itemKategori) {
            var itemMenu = itemKategori[menu];
            if (menu !== 'thumbnail' && menu !== 'priority' && menu !== 'kategoriCounter') {
              var flexMenu =  {
                "type": "box",
                "layout": "horizontal",
                "margin" : "xxl",
                "contents": [
                  {
                    "type": "text",
                    "text": menu,
                    "weight": "regular",
                    "size": "sm",
                    "margin": "sm",
                    "flex": 0
                  }
                ]
              };
              flexKategori.body.contents[1].contents.push(flexMenu);
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
          flexKategori.body.contents[1].contents.unshift({
            "type": "separator",
            "margin": "sm"
          });
          flexKategori.body.contents[1].contents.unshift({
                "type": "text",
                "text": "Harga mulai dari : Rp " + hargaMin + " - Rp " + hargaMax,
                "wrap": true,
                "color": "#aaaaaa",
                "size": "xxs"
              });
          flexMsg.contents.contents.push(flexKategori);
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
  menu: function (replyToken, warung, kategori, menus) {
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
                throw BreakException;
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
          });
        } catch (e) {
          if (e !== BreakException) throw e;
        }
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
      } else {
        return replyText(replyToken, "Kategori itu gaada kak di warung ini");
      }
      process.exit();
    });
  },
  warung: function (replyToken, warungs) {
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
              throw BreakException;
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
            flexMsg.contents.contents.push(flexWarung);
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

module.exports = self;
