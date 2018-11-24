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
        "data": "data=jurusan&fakultas=" + fakultas + "jurusan=" + jurusan
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
  }
};

module.exports = self;
