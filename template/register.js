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
      "altText": "Konfirmasi Profil " + profile.displayName,
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
              "align": "start",
              "weight": "bold",
              "color": "#00D54D"
            },
            {
              "type": "text",
              "text": "Konfirmasi Profil",
              "flex": 1,
              "align": "start",
              "weight": "bold",
              "color": "#0B5ED7"
            }
          ]
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
                  "flex": 1,
                  "size": "sm",
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": profile.displayName,
                  "flex": 2,
                  "margin": "md",
                  "size": "sm",
                  "align": "start",
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
                  "text": "Nomor HP",
                  "flex": 1,
                  "size": "sm",
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.nomorHP,
                  "flex": 2,
                  "margin": "md",
                  "size": "sm",
                  "align": "start",
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
                  "text": "Fakultas",
                  "flex": 1,
                  "size": "sm",
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.fakultas,
                  "flex": 2,
                  "margin": "md",
                  "size": "sm",
                  "align": "start",
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
                  "flex": 1,
                  "size": "sm",
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.jurusan,
                  "flex": 2,
                  "margin": "md",
                  "size": "sm",
                  "align": "start",
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
              },
              "color": "#0B5ED7"
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
