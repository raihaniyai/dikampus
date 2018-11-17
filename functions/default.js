const bot = require('./../bot.js');
const laper = require('./laper.js');
const register = require('./register.js');
const profile = require('./profile.js');

module.exports = {
  main: function (text, replyToken, source) {
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
      console.log("Masuk Laper");
      hasRegister(source.userId, function(data){
        if (data != null){
          return replyText(replyToken, 'Daftar dulu bosquu')
        } else {
          return laper.main(text, replyToken, source.userId, session)
        }
      })
    }
  }
};
