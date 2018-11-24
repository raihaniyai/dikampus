const bot = require('./../bot.js');

module.exports = {
  main: function (message, replyToken, source, session) {
    var replyText = bot.replyText;
    var client = bot.client;
    var response;
    var sessions;
  },
  edit: function (replyToken, userId) {
    var replyText = bot.replyText
    var client = bot.client
    return client.replyMessage(replyToken, {
      "type": "text", // ①
      "text": "Mau ganti apa nih?",
      "quickReply": { // ②
        "items": [
          {
            "type": "action",
            "action": {
              "type": "message",
              "label": "Nomor HP",
              "text": "Nomor HP"
            }
          },
          {
            "type": "action",
            "imageUrl": "https://example.com/tempura.png",
            "action": {
              "type": "message",
              "label": "Jurusan",
              "text": "Jurusan"
            }
          }
        ]
      }
    })
  }
};
