const bot = require('./bot.js')
const store = require('store2')
const laper = require('./template/laper.js')

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

    res.send({
        success: "ok"
    });
    return client.pushMessage(req.body.userId, message)

  },
  website: function (req, res){
    var admin = bot.admin;
    var client = bot.client;
    // The topic name can be optionally prefixed with "/topics/".
    var topic = req.body.id_warung;

    var bodyNotif = ["Ada pesanan masuk nih kak", "Ada rejeki dateng nih kak!", "Rejeki datang! Cepat diterima kak!", "Terima pesanannya sekarang", "Ada yang laper nih kak", "Ada pesanan nih kak.."]

    var message = {
     "data" : {
         "body" : bodyNotif[Math.floor(Math.random()*bodyNotif.length)],
         "title": "Ada Pesanan Baru",
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
