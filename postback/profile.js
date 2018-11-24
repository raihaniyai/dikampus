const bot = require('./../bot.js')
const templateregister = require('./../template/register.js')
const store = require('store2')

var self = {
  main: function (replyToken, res, userId) {
    var replyText = bot.replyText;
    var client = bot.client;
    var type = res.type;
    var db = bot.database;
    if (res.action == 'edit') {
      switch (res.profile) {
        case 'nomorHP':
          store.transact(userId, function(data) {
            data.status = 'register'
            data.action = 'nomorHP'
          })
          return replyText(replyToken, 'Nomor hp nya berapa kak?');
        break;
        case 'jurusan':
          store.transact(userId, function(data) {
            data.status = 'register'
            data.action = 'jurusan'
          })
          var ref = db.ref("kampus/TEL-U/fakultas")
          ref.once("value", function(snapshot) {
            var flex = templateregister.flex()
            var count = 0
            data = snapshot.val();
            if (data) {
              for (var fakultas in data) {
                var bubble = templateregister.bubble(data[fakultas])
                flex.contents.contents.push(bubble)
                var prodi = data[fakultas].jurusan
                for (var i = 1; i <= Object.keys(prodi).length; i++) {
                  var list = templateregister.list(data[fakultas].namaFakultas, prodi[i])
                  flex.contents.contents[count].body.contents.push(list)
                  if (i+1 < prodi.length) flex.contents.contents[count].body.contents.push({"type": "separator", "margin": "md"})
                }
                count++
              }
              return client.replyMessage(replyToken, flex);
            }
          });
        break;
      }
    }
  }
};

module.exports = self;
