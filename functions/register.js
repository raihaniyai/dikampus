const bot = require('./../bot.js')
const tempregister = require('./../template/register.js')
const store = require('store2')

module.exports = {
  main: function (text, replyToken, userId, session, res) {
    var request = require('request'); //HTTP Request
    var replyText = bot.replyText;
    var client = bot.client;
    var db = bot.database;
    var response;
    switch (session.action) {
      case 'nomorHP':
        store.transact(userId, function(data) {
          data.status = 'register'
        })
        var phoneno = /^\(?([0-9]{4})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/; // 12 digit number phone
        var phoneno2 = /^\(?([0-9]{4})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{3})$/; // 11 digit number phone
        if (text.match(phoneno) || text.match(phoneno2)) {
          var phone = text.indexOf('0') == 0 ? text.substring(1) : string
          phone = "62" + phone
          db.ref('user/' + userId + '/nomorHP').set(phone, function(error) {
            if (error) {
              // The write failed...
              return replyText(replyToken, 'Nomor hp nya berapa sih kak?');
            } else {
              // Data saved successfully!
              store.transact(userId, function(data) {
                data.action = 'jurusan'
              })
              var ref = db.ref("kampus/TEL-U/fakultas")
              ref.once("value", function(snapshot) {
                var flex = tempregister.flex()
                var count = 0
                data = snapshot.val();
                if (data) {
                  for (var fakultas in data) {
                    var bubble = tempregister.bubble(data[fakultas])
                    flex.contents.contents.push(bubble)
                    var prodi = data[fakultas].jurusan
                    for (var i = 1; i <= Object.keys(prodi).length; i++) {
                      var list = tempregister.list(data[fakultas].namaFakultas, prodi[i])
                      flex.contents.contents[count].body.contents.push(list)
                      if (i+1 < prodi.length) flex.contents.contents[count].body.contents.push({"type": "separator", "margin": "md"})
                    }
                    count++
                  }
                  return client.replyMessage(replyToken, flex);
                }
              });
            }
          });
        } else {
          return replyText(replyToken, 'Nomor hp nya berapa kak?');
        }
        break;
      case 'jurusan':
        if (text) {
          var ref = db.ref("kampus/TEL-U/fakultas")
          ref.once("value", function(snapshot) {
            var flex = tempregister.flex()
            var count = 0
            data = snapshot.val();
            if (data) {
              for (var fakultas in data) {
                var bubble = tempregister.bubble(data[fakultas])
                flex.contents.contents.push(bubble)
                var prodi = data[fakultas].jurusan
                for (var i = 1; i <= Object.keys(prodi).length; i++) {
                  var list = tempregister.list(data[fakultas].namaFakultas, prodi[i])
                  flex.contents.contents[count].body.contents.push(list)
                  if (i+1 < prodi.length) flex.contents.contents[count].body.contents.push({"type": "separator", "margin": "md"})
                }
                count++
              }
              return client.replyMessage(replyToken, flex);
            }
          });
        } else {
          db.ref('user/' + userId + '/fakultas').set(res.fakultas);
          db.ref('user/' + userId + '/jurusan').set(res.jurusan);
          var ref = db.ref("user/"+userId)
          ref.once("value", function(snapshot) {
            data = snapshot.val();
            client.getProfile(source.userId).then((profile) => {
              var flex = tempregister.profile(profile, data)
              return client.replyMessage(replyToken, flex)
            });
          });
        }
        break;
      default:
      return replyText(replyToken, 'daftar dulu dongs');

    }
  }
};
