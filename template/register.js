const bot = require('./../bot.js');

var self = {
  flex: function () {
    flex = {
      "type": "flex",
      "altText": "Fakultas dan Program Studi",
      "contents": {
        "type": "carousel",
        "contents": []
      }
    }
    return flex
  },
  bubble: function (result) {
    var replyText = bot.replyText;
    var client = bot.client;
    flex = {
      "type": "bubble",
      "direction": "ltr",
      "header": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": result.namaFakultas,
            "align": "center",
            "weight": "bold",
            "color": "#0B5ED7"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": []
      }
    };
    return flex
  },
  list: function (fakultas, jurusan) {
    var replyText = bot.replyText;
    var client = bot.client;
    flex = {
      "type": "box",
      "layout": "horizontal",
      "margin": "md",
      "action": {
        "type": "postback",
        "label": jurusan,
        "data": "data=jurusan&fakultas=" + fakultas + "&jurusan=" + jurusan
      },
      "contents": [
        {
          "type": "text",
          "text": jurusan,
          "wrap": true,
          "flex": 1
        },
        {
          "type": "text",
          "text": ">",
          "weight": "bold",
          "color": "#AAAAAA",
          "flex": 0
        }
      ]
    };
    return flex
  },
  profile: function (profile, data) {
    var replyText = bot.replyText;
    var client = bot.client;
    flex = {
      "type": "flex",
      "altText": "Konfirmasi profil " + nama,
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "baseline",
          "spacing": "none",
          "margin": "none",
          "contents": [
            {
              "type": "text",
              "text": ".",
              "flex": 0,
              "margin": "none",
              "size": "xl",
              "color": "#00D54D"
            },
            {
              "type": "text",
              "text": "PROFILE",
              "flex": 1,
              "margin": "none",
              "align": "start",
              "weight": "bold",
              "color": "#0B5ED7"
            }
          ]
        },
        "hero": {
          "type": "image",
          "url": profile.pictureUrl,
          "size": "full",
          "aspectRatio": "4:3",
          "aspectMode": "fit"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "Nama",
                  "flex": 0,
                  "align": "center",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": profile.displayName,
                  "flex": 1,
                  "margin": "md",
                  "align": "end",
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "Nomor",
                  "flex": 0,
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.nomorHP,
                  "flex": 1,
                  "margin": "md",
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
                  "text": "Fakultas",
                  "flex": 0,
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.fakultas,
                  "flex": 1,
                  "margin": "md",
                  "align": "end",
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "Jurusan",
                  "flex": 0,
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.jurusan,
                  "flex": 1,
                  "margin": "md",
                  "align": "end",
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
              "type": "button",
              "action": {
                "type": "uri",
                "label": "Edit",
                "uri": "https://linecorp.com"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "uri",
                "label": "Lanjut",
                "uri": "https://linecorp.com"
              },
              "color": "#0B5ED7",
              "style": "primary"
            }
          ]
        }
      }
    }
    return flex
  }
};

module.exports = self;
