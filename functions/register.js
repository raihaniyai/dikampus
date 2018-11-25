const bot = require('./../bot.js')
const template = require('./../template/register.js')
const store = require('store2')

module.exports = {
  main: function (text, replyToken, userId, session, res) {
    var replyText = bot.replyText
    var client = bot.client
    var db = bot.database
    switch (session.action) {
      case 'nomorHP':
        store.transact(userId, function(data) {
          data.status = 'register'
          data.counter++
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
              var userRef = db.ref("user/"+userId)
              userRef.once("value", function(snapshot) {
                data = snapshot.val();
                if (data.fakultas) {
                  client.getProfile(userId).then((profile) => {
                    var flex = template.profile(profile, data)
                    store.transact(userId, function(data) {
                      data.status = null
                    })
                    return client.replyMessage(replyToken, flex)
                  });
                } else {
                  store.transact(userId, function(data) {
                    data.action = 'jurusan'
                  })
                  var ref = db.ref("kampus/TEL-U/fakultas")
                  ref.once("value", function(snapshot) {
                    var flex = template.flex()
                    var count = 0
                    data = snapshot.val();
                    if (data) {
                      for (var fakultas in data) {
                        var bubble = template.bubble(data[fakultas])
                        flex.contents.contents.push(bubble)
                        var prodi = data[fakultas].jurusan
                        for (var i = 1; i <= Object.keys(prodi).length; i++) {
                          var list = template.list(data[fakultas].namaFakultas, prodi[i])
                          flex.contents.contents[count].body.contents.push(list)
                          if (i+1 < prodi.length) flex.contents.contents[count].body.contents.push({"type": "separator", "margin": "md"})
                        }
                        count++
                      }
                      return client.getProfile(userId)
                      .then((profile) => {
                        answer = [`Kak ${profile.displayName} jurusan apa nih? 􀰂􀄥excited􏿿`, `Kak ${profile.displayName} jurusan apa? \nLangsung dipilih aja ya kak 􀰂􀄤smiling􏿿`, `Kak ${profile.displayName} kuliahnya jurusan apa? Langsung tap aja jurusan kakak di bawah :D`]
                        client.replyMessage(replyToken, [
                          {
                            "type": "text",
                            "text": answer[Math.floor(Math.random()*answer.length)]
                          },
                          flex
                        ]);
                      });
                    }
                  });
                }
              })
            }
          });
        } else {
          return client.getProfile(userId)
          .then((profile) => {
            console.log("Session counter:"+session.counter);
            if (session.counter > 0) answer = [`Dika butuh 📱 nomor hp kak ${profile.displayName} nih􀰂􀄤smiling􏿿`, `Sebelum order makanan, Dika minta 📱 nomor hp kak ${profile.displayName} dong 􀰂􀄤smiling􏿿`, `📱 Nomor hp kak ${profile.displayName} berapa nih? 􀰂􀄤smiling􏿿`]
            else answer = [`Kayaknya 📱 nomor hp kak ${profile.displayName} masih salah nih, kirim ulang nomor hp nya ya kak􀰂􀄤smiling􏿿`, `Kayaknya 📱 nomor hp kak ${profile.displayName} belum bener deh, coba dikirim ulang ya kak􀰂􀄤smiling􏿿`, `Kayaknya \'${text}\' bukan nomor hp deh kak.. Minta nomor hp nya dong kak􀰂􀄤smiling􏿿`]
            client.replyMessage(replyToken, [
              {
                "type": "text",
                "text": answer[Math.floor(Math.random()*answer.length)]
              }
            ]);
          });
        }
        break;
      case 'jurusan':
        store.transact(userId, function(data) {
          data.status = 'register'
        })
        if (text) {
          var ref = db.ref("kampus/TEL-U/fakultas")
          ref.once("value", function(snapshot) {
            var flex = template.flex()
            var count = 0
            data = snapshot.val();
            if (data) {
              for (var fakultas in data) {
                var bubble = template.bubble(data[fakultas])
                flex.contents.contents.push(bubble)
                var prodi = data[fakultas].jurusan
                for (var i = 1; i <= Object.keys(prodi).length; i++) {
                  var list = template.list(data[fakultas].namaFakultas, prodi[i])
                  flex.contents.contents[count].body.contents.push(list)
                  if (i+1 < prodi.length) flex.contents.contents[count].body.contents.push({"type": "separator", "margin": "md"})
                }
                count++
              }
              return client.getProfile(userId)
              .then((profile) => {
                answer = [`Kak ${profile.displayName} jurusan apa nih? 􀰂􀄥excited􏿿`, `Kak ${profile.displayName} jurusan apa? \nLangsung dipilih aja ya kak 􀰂􀄤smiling􏿿`, `Kak ${profile.displayName} kuliahnya jurusan apa? Langsung tap aja jurusan kakak di bawah :D`]
                client.replyMessage(replyToken, [
                  {
                    "type": "text",
                    "text": answer[Math.floor(Math.random()*answer.length)]
                  },
                  flex
                ]);
              });
            }
          });
        } else {
          db.ref('user/' + userId + '/fakultas').set(res.fakultas);
          db.ref('user/' + userId + '/jurusan').set(res.jurusan);
          db.ref('user/' + userId + '/points').set(0);
          var ref = db.ref("user/" + userId)
          ref.once("value", function(snapshot) {
            data = snapshot.val();
            client.getProfile(userId).then((profile) => {
              var flex = template.profile(profile, data)
              store.transact(userId, function(data) {
                data.status = null
              })
              return client.getProfile(userId)
              .then((profile) => {
                answer = [`Profil kak ${profile.displayName} udah bener belum nih?\nKalau udah bener, langsung lanjut aja kak􀰂􀄥excited􏿿`, `Profilnya udah bener kan kak ${profile.displayName}?\nKalau udah bener langsung lanjut aja kak􀰂􀄤smiling􏿿`, `Kak ${profile.displayName} masih mau edit profil atau lanjut nih? 􀰂􀄤smiling􏿿`]
                client.replyMessage(replyToken, [
                  {
                    "type": "text",
                    "text": answer[Math.floor(Math.random()*answer.length)]
                  },
                  flex
                ]);
              });
            });
          });
        }
        break;
    }
  }
};
