const bot = require('./../bot.js')
const register = require('./../functions/register.js')
const store = require('store2')

var self = {
  main: function (replyToken, userId, session, res) {
    var replyText = bot.replyText;
    var client = bot.client;
    var type = res.type;
    var db = bot.database;
    if (res.action == 'jurusan') {
      return register.main(null, replyToken, userId, session, res);
    } else if (res.action == 'done') {
      store.set(userId, {status: null})
    }
  }
};

module.exports = self;
