const bot = require('./../bot.js');

var self = {
  order: function (replyToken, body, url) {
    var db = bot.database;
    var client = bot.client;
    var outputParam = body.result.contexts[0].parameters;
    var warung = outputParam.warung;

    return client.replyMessage(replyToken , );
  },
  orderNote: function (replyToken, body, url) {
    var db = bot.database;
    var client = bot.client;
    var outputParam = body.result.contexts[0].parameters;
    var warung = outputParam.warung;

    return client.replyMessage(replyToken , {
      "type": "flex",
      "altText": "this is a flex message",
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
              "text": "Warung Munjul",
              "weight": "bold",
              "size": "xxl",
              "margin": "md"
            },
            {
              "type": "text",
              "text": "Jalan Sukabirus, Telkom University",
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
                  "type": "box",
                  "layout": "horizontal",
                  "contents": [
                    {
                      "type": "text",
                      "text": "Nasi + Ayam Suwir",
                      "size": "sm",
                      "color": "#555555",
                      "flex": 0
                    },
                    {
                      "type": "text",
                      "text": "10.000",
                      "size": "sm",
                      "color": "#111111",
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
                      "text": "Susu Milo",
                      "size": "sm",
                      "color": "#555555",
                      "flex": 0
                    },
                    {
                      "type": "text",
                      "text": "4.000",
                      "size": "sm",
                      "color": "#111111",
                      "align": "end"
                    }
                  ]
                },
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
                    },
                    {
                      "type": "text",
                      "text": "Rp 14.000",
                      "weight": "bold",
                      "size": "sm",
                      "color": "#111111",
                      "align": "end"
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
    });
  },
  bar: function () {
    console.log("function bar");
  }
};

module.exports = self;
