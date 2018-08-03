const bot = require('./../bot.js');
const template = require('./template.js');
const flex = require('./flex.js');

var self = {
  response: function (replyToken, res) {
    var data = res.data;
    switch (data) {
      case 'warung':
      var warung = res.warung;
      return flex.warung(replyToken, warung);
      break;
      case 'menu':
      var warung = res.warung;
      var kategori = res.kategori;
      var menu = res.menu;
      return flex.menu(replyToken, warung, kategori, menu);
      break;
    }
  }
};

module.exports = self;