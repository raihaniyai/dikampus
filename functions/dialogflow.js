const bot = require('./../bot.js');
const template = require('./template.js');
const flex = require('./flex.js');
const analytics = require('./analytics.js');

module.exports = {
  response: function (message, replyToken, source) {
    var request = require('request'); //HTTP Request
    var replyText = bot.replyText;
    var client = bot.client;
    var response;
    var sessions;
    switch (source.type) {
      case 'user':
      sessions = source.userId; break;
      case 'group':
      sessions = source.groupId; break;
      case 'room':
      sessions = source.roomId; break;
    }
    var body = {"query":message,"timezone":"Asia/Jakarta","lang":"id","sessionId":sessions,"resetContexts":false};
    // give message to dialogflow
    request({
      url: "https://api.dialogflow.com/v1/query?v=20170712",
      method: "POST",
      headers: {
        'Authorization': process.env.DIALOGFLOW_AUTH,
        'Content-Type': 'application/json'
      },
      json: true,
      body: body
    }, function (error, response, body){
      if (body.status.code === 200){
        if (body.result.action != ""){
          return self.handleAction(body, replyToken, source);
        }else{
          if (body.result.fulfillment.speech != "") {
            response = body.result.fulfillment.speech;
            return replyText(replyToken, response);
          } else {
            response = body.result.fulfillment.messages[0].payload.line;
            return client.replyMessage(replyToken, response);
          }
        }
      }
    });
  },
  handleAction: function (body, replyToken, source) {
    var action = body.result.action;
    var parameters = body.result.parameters;
    var replyText = bot.replyText;
    var client = bot.client;
    var db = bot.database;

    switch (action) {
      case 'orderFood':
      if (parameters.warung === '') {
        // return flex for warung. param: 1) replyToken 2) warung 3)userId
        return flex.warung(replyToken, null, source.userId);
      } else {
        var warung = parameters.warung;
        transaksi  = {
          'user': source.userId,
          'warung' : warung
        };
        // add transaction into database
        var transRef = db.ref("transaksi/makanan");
        var post = transRef.push(transaksi);
        var idTransaksi = post.key;

        // add activeTransaction for spesific user into database
        var userRef = db.ref("user/activeTransaction");
        userRef.child(source.userId).set(idTransaksi);

        // add analytics
        analytics.viewsRecommendedCounter(warung);
        analytics.visitCounter(warung, source.userId);
        return flex.kategori(replyToken, warung, source.userId);
      }
      break;
      case 'orderFood.chooseMenu':
      var warung = parameters.warung;
      if (parameters.kategori === '') {
        return flex.kategori(replyToken, warung, source.userId);
      } else {
        if (parameters.menu === '') {
          // return flex for menu. param: 1) replyToken 2) warung 3) kategori 3) menu 4)userId
          return flex.menu(replyToken, warung, parameters.kategori, null, source.userId);
        } else {
          if (parameters.jumlah === ''){
            // increment of menu counter in database
            var updateRef = db.ref("warung/"+warung+"/menu/"+parameters.kategori+"/"+parameters.menu+"/menuCounter");
            updateRef.transaction(function(menuCounter) {
              if (menuCounter) {
                return (menuCounter) + 1;
              }
            });

            // return quickreplies that show number of food
            var ref = db.ref("warung/"+warung+"/menu/"+parameters.kategori+"/"+parameters.menu);
            ref.on("value", function(snapshot) {
              if (snapshot.val()) {
                return client.replyMessage(replyToken, {
                  "type": "text",
                  "text": "Mau pesen "+parameters.menu+" berapa banyak kak? 􀰂􀄫content􏿿",
                  "quickReply": {"items":[{"type":"action","action":{"type":"message","label":"1","text":"1"}},{"type":"action","action":{"type":"message","label":"2","text":"2"}},{"type":"action","action":{"type":"message","label":"3","text":"3"}},{"type":"action","action":{"type":"message","label":"4","text":"4"}},{"type":"action","action":{"type":"message","label":"5","text":"5"}}]}
                });
              } else {
                return replyText(replyToken, "Menunya gaada kak")
              }
            });
          } else {
            var ref = db.ref("user/activeTransaction/"+source.userId);
            ref.once("value", function(snapshot) {
              var idTransaksi = snapshot.val();
              var warungRef = db.ref("warung/"+warung+"/menu")
              warungRef.once("value", function(snapshot) {
                var dataWarung = snapshot.val();
                var harga = dataWarung[parameters.kategori][parameters.menu].harga;
                var orderRef = db.ref("transaksi/makanan/"+idTransaksi+"/pesanan");
                orderRef.child(parameters.menu).set({'jumlah' : parameters.jumlah, 'harga' : harga});
              });
              return client.replyMessage(replyToken, {
                "type": "template",
                "altText": "Ada tambahan lain?",
                "template": {"type":"confirm","text":"Ada tambahan lain ga nih kak?","actions":[{"type":"message","label":"Ada","text":"Ada"},{"type":"message","label":"Tidak Ada","text":"Tidak Ada"}]}
              });
              process.exit();
            }, function (errorObject) {
              console.log("The read failed: " + errorObject.code);
            });
          }
        }
      }
      break;
      case 'orderFood.next':
      var historyRef = db.ref("user/history/"+source.userId+"/alamat");
      historyRef = historyRef.limitToLast(3);
      historyRef.on("value", function(snapshot) {
        var alamat = snapshot.val();
        // if user have address history
        if (alamat) {
          // ask for address and send quickreplies that show history of user address
          var response = {"type": "text","text": "Mau dikirim kemana nih kak? 􀰂􀄤smiling􏿿","quickReply": {"items": []}};
          for (var res in alamat) {
            var label = alamat[res];
            // if length of string is > 20, then trim string. It's importart because quickreplies has maximum char on bubble (20 char)
            if (label.length > 20) {
              label = label.substring(0,17);
              label += "...";
            }
            var address = {"type": "action","action": {"type": "message","label": label,"text": alamat[res]}};
            response.quickReply.items.unshift(address);
          }
          return client.replyMessage(replyToken, response);
        } else {
            return replyText(replyToken, "Mau dikirim kemana nih kak? 􀰂􀄤smiling􏿿");
        }
        process.exit();
      });
      break;
      case 'orderFood.alamat':
      if (parameters.alamat === '') {
        return replyText(replyToken, "Mau dikirim kemana nih kak? 􀰂􀄤smiling􏿿");
      } else {
        var date = new Date();
        date = date.toLocaleString('id-ID');
        var warung = parameters.warung;
        var ref = db.ref("warung/"+warung);
        ref.once("value", function(snapshot) {
          var dataWarung = snapshot.val();
          // save transaction to realtime database
          var userRef = db.ref("user/activeTransaction/"+source.userId);
          userRef.once("value", function(snapshot) {
            var idTransaksi = snapshot.val();
            var transRef = db.ref("transaksi/makanan/" + idTransaksi);
            transRef.child('waktu').set(date);
            transRef.child('alamat').set(parameters.alamat);
            var historyRef = db.ref("user/history/"+source.userId+"/alamat");
            historyRef = historyRef.orderByValue().equalTo(parameters.alamat);
            historyRef.on("value", function(snapshot) {
              if (!snapshot.val()) {
                var ref = db.ref("user/history/"+source.userId+"/alamat");
                ref.push(parameters.alamat);
              }
            });
            var userRef = db.ref("user/history/"+source.userId+"/transCounter");
            userRef.transaction(function(transCounter) {
              return (transCounter || 0) + 1;
            });
            // Sending invoice to user
            return flex.order(replyToken, idTransaksi, dataWarung);
            process.exit();
          });
        });
      }
      break;

      case 'Note':
      return client.replyMessage(replyToken, {
        "type": "text",
        "text": "Ada catatan tambahan apa kak? 􀰂􀄫content􏿿\nKakak bisa bilang kayak gini, \"Sambelnya banyakin ya a\"",
        "quickReply": {"items":[{"type":"action","action":{"type":"message","label":"Uang saya 20 ribu","text":"Uang saya 20 ribu"}},{"type":"action","action":{"type":"message","label":"Uang saya 50 ribu","text":"Uang saya 50 ribu"}},{"type":"action","action":{"type":"message","label":"Uang saya 100 ribu","text":"Uang saya 100 ribu"}},{"type":"action","action":{"type":"message","label":"Level 1","text":"Level 1"}},{"type":"action","action":{"type":"message","label":"Level 2","text":"Level 2"}},{"type":"action","action":{"type":"message","label":"Level 3","text":"Level 3"}}]}
      });
      break;

      case 'Note.Done':
      var warung = parameters.warung;
      var note = parameters.note
      var ref = db.ref("warung/"+warung);
      ref.once("value", function(snapshot) {
        var dataWarung = snapshot.val();
        // Sending Invoice to User
        var userRef = db.ref("user/activeTransaction/"+source.userId);
        userRef.once("value", function(snapshot) {
          var idTransaksi = snapshot.val();
          // Add notes to saved transaction database
          var newRef = db.ref("transaksi/makanan/"+idTransaksi);
          var post = newRef.child('note').set(parameters.note);
          return flex.orderNote(replyToken, idTransaksi, dataWarung, note);
          process.exit();
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });
      break;
      default:
      if (body.result.fulfillment.speech !== "") {
        if (source.type == 'user'){
          response = body.result.fulfillment.speech;
          return replyText(replyToken, response);
        }
      }
      break;
    }
  }
};
