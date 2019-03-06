const bot = require('./../bot.js');

var self = {
  imagemap: function () {
    flex = {
      "type": "imagemap",
      "baseUrl": "https://dikosan.herokuapp.com/images/imagemap_laper",
      "altText": "Laper",
      "baseSize": {
        "width": 1040,
        "height": 1040
      },
      "actions": [
        {
          "type": "uri",
          "linkUri": "https://instagram.com",
          "area": {
            "x": 0,
            "y": 0,
            "width": 1040,
            "height": 1040
          }
        }
      ]
    };
    return flex;
  },
  invoice: function (body) {
    order = []
    tmpBody = body.transaction_items
    for (var menu in tmpBody) {
      tmpMenu = {
        "type": "box",
        "layout": "horizontal",
        "spacing": "md",
        "contents": [
          {
            "type": "text",
            "text": tmpBody[menu].item.namaMenu,
            "wrap": true
          },
          {
            "type": "text",
            "text": tmpBody[menu].item.kuantitas + " x " + body.rupiah(tmpBody[menu].item.harga),
            "flex": 0,
            "align": "end"
          }
        ]
      }
      order.push(tmpMenu)
    }

    flex = {
      "type": "flex",
      "altText": "Invoice " + body.nama_warung,
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "baseline",
          "contents": [
            {
              "type": "text",
              "text": ".",
              "flex": 0,
              "size": "xl",
              "weight": "bold",
              "color": "#00D54D"
            },
            {
              "type": "text",
              "text": "Invoice",
              "weight": "bold",
              "color": "#0B5ED7"
            }
          ]
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "spacing": "lg",
          "contents": [
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": body.nama_warung,
                  "size": "lg",
                  "align": "start",
                  "weight": "bold"
                },
                {
                  "type": "text",
                  "text": body.alamat_warung,
                  "size": "sm",
                  "color": "#ABABAB",
                  "wrap": true
                }
              ]
            },
            {
              "type": "separator"
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "md",
              "contents": order
            },
            {
              "type": "separator"
            },
            {
              "type": "box",
              "layout": "vertical",
              "spacing": "md",
              "contents": [
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Ongkir",
                      "color": "#222222",
                      "wrap": true
                    },
                    {
                      "type": "text",
                      "text": bot.rupiah(body.ongkir),
                      "flex": 0,
                      "align": "end"
                    }
                  ]
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Total",
                      "wrap": true
                    },
                    {
                      "type": "text",
                      "text": "Rp " + bot.rupiah(body.total_price),
                      "flex": 0,
                      "align": "end",
                      "weight": "bold"
                    }
                  ]
                }
              ]
            },
            {
              "type": "separator"
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "ALAMAT",
                  "color": "#888888"
                },
                {
                  "type": "text",
                  "text": body.alamat,
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "CATATAN",
                  "color": "#888888"
                },
                {
                  "type": "text",
                  "text": body.catatan_tambahan,
                  "wrap": true
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "text",
              "text": "Transaction ID",
              "color": "#ABABAB"
            },
            {
              "type": "text",
              "text": body.trans_id.substr(trans_id.length - 5),
              "flex": 0,
              "align": "end"
            }
          ]
        },
        "styles": {
          "body": {
            "separator": true,
            "separatorColor": "#0B5ED7"
          },
          "footer": {
            "separator": true,
            "separatorColor": "#0B5ED7"
          }
        }
      }
    }

    return flex;
  }
};

module.exports = self;
