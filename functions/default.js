const bot = require('./../bot.js');

module.exports = {
  main: function (text, replyToken, source) {
    var replyText = bot.replyText;
    var hasRegister = bot.hasRegister;
    var client = bot.client;
    if (text == 'profile') {

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
          return replyText(replyToken, 'Daftar dulu bosquu')
        } else {
          return laper.main(text, replyToken, source.userId, session)
        }
      })
    }
  }
};
