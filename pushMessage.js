const bot = require('./bot.js')
const store = require('store2')

module.exports = {
  mitra: function (req, res) {
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
    res.send({
        success: "ok"
    });
  },
  website: function (req, res){
    var admin = bot.admin;
    var client = bot.client;
    // The topic name can be optionally prefixed with "/topics/".
    var topic = "12345";

    var message = {
     "data" : {
         "body" : "Pesanan sudah siap ganteng",
         "title": "Pesanan Datang!",
     },
     "topic" : topic
    }
    flex = laper.invoice(req.body)
    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(message)
      .then((response) => {
        return client.pushMessage(req.body.userId, flex)
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
    res.send({
        success: "ok"
    });
  }
};
