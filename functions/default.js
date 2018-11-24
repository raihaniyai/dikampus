const bot = require('./../bot.js')
const laper = require('./laper.js')
const register = require('./register.js')
const profile = require('./profile.js')
const store = require('store2')

module.exports = {
  main: function (text, replyToken, source, session) {
    var replyText = bot.replyText;
    var hasRegister = bot.hasRegister;
    var client = bot.client;
    var laper = ['laper', 'lapar', 'pengen makan', 'mau makan'] // Laper Entity
    console.log("Message: " + text);
    if (text == 'profile') {
      console.log("Masuk Profile");
      return replyText(replyToken, 'Ini nanti diisi Profile')
    } else if (text == 'bye') {
      switch (source.type) {
        case 'group':
        return client.replyMessage(replyToken, {
          type: 'template',
          altText: 'Kick Dikampus?',
          template: {
            type: 'confirm',
            text: 'Yakin mau ngekick Dika?',
            actions: [
              { label: 'Gajadi', type: 'message', text: 'Gajadi' },
              { label: 'Yakin', type: 'postback', data: 'leftGroup' },
            ],
          },
        });
        break;
        case 'room':
        return client.replyMessage(replyToken, {
          type: 'template',
          altText: 'Kick Dikampus?',
          template: {
            type: 'confirm',
            text: 'Yakin mau ngekick Dika?',
            actions: [
              { label: 'Gajadi', type: 'message', text: 'Gajadi' },
              { label: 'Yakin', type: 'postback', data: 'leftRoom' },
            ],
          },
        });
      }
    } else if (laper.indexOf(text) > -1) {
      hasRegister(source.userId, function(data){
        if (data != null){
          if (data == 'nomorHP') {
            store.add(source.userId, {action: 'nomorHP'})
            session.action = 'nomorHP'
            console.log(session);
            return register.main(text, replyToken, source.userId, session)
          } else if (data == 'jurusan') {
            store.add(source.userId, {action: 'jurusan'})
            session.action = 'jurusan'

          }
          return register.main(replyToken, source.userId, session);
        } else {
          return laper.main(text, replyToken, source.userId, session)
        }
      })
    }
  }
};
