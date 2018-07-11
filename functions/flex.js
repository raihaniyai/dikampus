const bot = require('./../bot.js');

var self = {
  order: function (replyToken, body) {
    var db = bot.database;
    var client = bot.client;
    var outputParam = body.result.contexts[0].parameters;
    var warung = outputParam.warung;

    return client.replyMessage(replyToken , {
      "type": "template",
      "altText": "Invoice",
      "template": {
        "type": "confirm",
        "actions": [
          {
            "type": "message",
            "label": "Notes 📝",
            "text": "Catatan tambahan dong"
          },
          {
            "type": "uri",
            "label": "Iya ✔️",
            "uri": url
          }
        ],
        "text": "Invoice: " + outputParam.menu[0] + " " + outputParam.jumlah[0] + ", dikirim ke "+outputParam.alamat+", Aku sambungin ke warung "+outputParam.warung+" ya? 👨‍🍳 "
      }
    });
  },
  orderNote: function (replyToken, body) {
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
