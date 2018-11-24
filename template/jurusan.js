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
            "color": "#FFFFFF"
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": []
      },
      "styles": {
        "header": {
          "backgroundColor": "#ED1C24"
        }
      }
    };
    return flex
  },
  list: function (result) {
    var replyText = bot.replyText;
    var client = bot.client;
    flex = {
      "type": "box",
      "layout": "horizontal",
      "margin": "md",
      "action": {
        "type": "postback",
        "label": result.nama_prodi,
        "data": "data=prodi&prodi=" + result.nama_prodi
      },
      "contents": [
        {
          "type": "text",
          "text": result.nama_prodi,
          "flex": 1
        },
        {
          "type": "text",
          "text": result.akreditasi,
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
          "color": "#ED1C24"
        }
      ]
    };
    return flex
  }
};

module.exports = self;
