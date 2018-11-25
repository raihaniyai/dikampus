const bot = require('./../bot.js');
const template = require('./../template/profile.js');

module.exports = {
  main: function (replyToken, userId) {
    var replyText = bot.replyText;
    var client = bot.client;
    var db = bot.database;
    var ref = db.ref("user/" + userId)
    ref.once("value", function(snapshot) {
      data = snapshot.val();
      client.getProfile(userId).then((profile) => {
        var flex = template.main(profile, data)
        return client.replyMessage(replyToken, [
          {
            "type": "text",
            "text": "Profilnya nih kak"
          },
          flex
        ])
      });
    });
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
              "type": "postback",
              "label": "Nomor HP",
              "data": "data=profile&action=edit&profile=nomorHP"
            }
          },
          {
            "type": "action",
            "action": {
              "type": "postback",
              "label": "Jurusan",
              "data": "data=profile&action=edit&profile=jurusan"
            }
          }
        ]
      }
    })
  }
};
