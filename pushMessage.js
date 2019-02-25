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
    var replyText = bot.replyText;
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

    var flex = {
      "type": "flex",
      "altText": "Invoice",
      "contents": {
        "type": "bubble",
        "styles": {
          "footer": {
            "separator": true
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "INVOICE",
              "weight": "bold",
              "color": "#1DB446",
              "size": "sm"
            },
            {
              "type": "text",
              "text": req.body.nama_warung,
              "weight": "bold",
              "size": "xxl",
              "margin": "md"
            },
            {
              "type": "separator",
              "margin": "xxl"
            },
            {
              "type": "box",
              "layout": "vertical",
              "margin": "xxl",
              "spacing": "sm",
              "contents": [
                {
                  "type": "separator",
                  "margin": "xxl"
                },
                {
                  "type": "box",
                  "layout": "horizontal",
                  "margin": "xxl",
                  "contents": [
                    {
                      "type": "text",
                      "text": "TOTAL",
                      "size": "sm",
                      "color": "#555555"
                    }
                  ]
                },
                {
                  "type": "separator",
                  "margin": "xxl"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "margin": "xxl",
                  "contents": [
                    {
                      "type": "text",
                      "text": "ALAMAT PENGIRIMAN",
                      "size": "sm",
                      "color": "#555555"
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    };

    return client.pushMessage(req.body.userId, "vangke")
    // Send a message to devices subscribed to the provided topic.
    admin.messaging().send(message)
      .then((response) => {
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
