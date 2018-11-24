const bot = require('./../bot.js')
const store = require('store2')

module.exports = {
  main: function (text, replyToken, userId, session) {
    var request = require('request'); //HTTP Request
    var replyText = bot.replyText;
    var client = bot.client;
    var response;
    switch (session.action) {
      case 'tanyaNomorHP':
        store.transact(userId, function(data) {
          data.status = 'register'
        })
        var phoneno = /^\d{10}$/;
        if (text.value.match(phoneno)) {
          return replyText(replyToken, 'Bener tuh nomor hp')
        } else {
          return replyText(replyToken, 'Nomor hp nya berapa kak?');
        }
        break;
      default:
      return replyText(replyToken, 'daftar dulu dongs');

    }
  }
};
