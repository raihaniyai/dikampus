const bot = require('./bot.js')
const store = require('store2')

module.exports = {
  main: function (req, res) {
    var replyText = bot.replyText;
    var client = bot.client;
    var type = res.type;
    var db = bot.database;
    if (req.body.status == 'diproses') {
      answer = ['Pesanan kakak sedang diproses', 'lagi diproses nih', 'okayy, pesanan kakak diproses']
      var message = {
        type: 'text',
        text: answer[Math.floor(Math.random()*answer.length)]
      }
    } else if (req.body.status == 'diantar') {
      answer = ['Pesanannya otw kak', 'Otewee', 'Otw ya kak']
      var message = {
        type: 'text',
        text: answer[Math.floor(Math.random()*answer.length)]
      }
    } else {
      var message = {
        type: 'text',
        text: "answer[Math.floor(Math.random()*answer.length)]"
      }
    }

    return client.pushMessage(req.body.userId, message)
      // .then(() => {
      //   ...
      // })
      // .catch((err) => {
      //   console.log("Error");
      // });
    res.send({
        success: "ok"
    });
  }
};
