const bot = require('./../bot.js')
const store = require('store2')

module.exports = {
  main: function (text, replyToken, userId, session) {
    var request = require('request'); //HTTP Request
    var replyText = bot.replyText;
    var client = bot.client;
    var response;
    switch (session.action) {
      case 'nomorHP':
        store.transact(userId, function(data) data.status = 'register')
        return replyText(replyToken, 'Nomor hp nya berapa kak?');
        break;
      default:
      return replyText(replyToken, 'daftar dulu dongs');

    }
  }
};
