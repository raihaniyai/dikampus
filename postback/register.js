const bot = require('./../bot.js');
const register = require('./../functions/register.js');
const template = require('./../template/register.js');

var self = {
  response: function (replyToken, res, source) {
    var replyText = bot.replyText;
    var client = bot.client;
    var type = res.type;
    var db = bot.database;
    if (type && !res.perusahaan) return loker.perusahaan(replyToken, source, type);
    else return loker.karir(replyToken, source, type, res.perusahaan);
  }
};

module.exports = self;
