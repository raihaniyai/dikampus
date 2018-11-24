const bot = require('./../bot.js')
const store = require('store2')

module.exports = {
  main: function (text, replyToken, userId, session) {
    var request = require('request'); //HTTP Request
    var replyText = bot.replyText;
    var client = bot.client;
    var db = bot.db;
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
          db.ref('user/' + userId).set({
            nomorHP: phone,
          }, function(error) {
            if (error) {
              // The write failed...
              return replyText(replyToken, 'Nomor hp nya berapa kak?');
            } else {
              // Data saved successfully!
              return replyText(replyToken, 'Data tersimpan, sekarang masukin jurusannya');
            }
          });

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
