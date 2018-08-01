const bot = require('./../bot.js');

var self = {
  food: function (replyToken, type, path) {
    var db = bot.database;
    var client = bot.client;
    var replyText = bot.replyText;
    var data;

    switch (type) {
      case 'warung':
      var ref = db.ref("warung");
      ref.once("value", function(snapshot) {
        data = snapshot.val();
        var message = {
          "type": "template",
          "altText": "Rekomendasi Warung",
          "template": {
            "type": "carousel",
            "columns": []
          }
        };
        for(var i in data) {
          var item = data[i];
          var deskripsi = item.jamBuka
          message.template.columns.push({
            "thumbnailImageUrl": item.thumbnail,
            "imageBackgroundColor": "#FFFFFF",
            "title": i,
            "text": deskripsi,
            "actions" : [
              {
                "type": "message",
                "label": "Lihat Menu",
                "text": i
              }
            ]
          });
        }
        return client.replyMessage(replyToken, [
          {
          "type": "text",
          "text": "Ini rekomendasi warung makan dari Dika"
          }, message
        ]);
        process.exit();
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
      break;
    }
  }
};

module.exports = self;
