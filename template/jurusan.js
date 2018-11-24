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
  quickReply: function () {
    flex = {
      "items": [
        {
          "type": "action",
          "action": {
            "type": "message",
            "label": "Menu Serina",
            "text": "Menu"
          }
        }
      ]
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
        "data": "data=jurusan&fakultas=" + fakultas + "jurusan=" + jurusan
      },
      "contents": [
        {
          "type": "text",
          "text": jurusan,
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
  footer: function (fakultas) {
    flex = {
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "button",
          "style": "link",
          "action": {
            "type": "postback",
            "label": "See More",
            "data": "data=prodi&fakultas=" + fakultas
          },
          "color": "#0B5ED7"
        }
      ]
    };
    return flex
  }
};

module.exports = self;
