const bot = require('./../bot.js');
const template = require('./template.js');
const flex = require('./flex.js');

var self = {
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
        return template.food(replyToken, 'warung', null);
      } else {
        if (parameters.menu.length === 0){
          var warung = parameters.warung;
          return template.food(replyToken, 'menu', warung);
        } else {
          if (parameters.jumlah.length === 0){
            return replyText(replyToken, "Mau pesen "+parameters.menu[0]+" berapa banyak kak?");
          } else{
            return replyText(replyToken, "Mau dikirim kemana nih kak?")
          }
        }
      }
      break;
      case 'orderFood.Alamat':
      if (parameters.alamat === '') {
        return replyText(replyToken, "Mau dikirim kemana nih kak?")
      } else {
        var date = new Date();
        date = date.toLocaleString('id-ID');
        var outputParam = body.result.contexts[0].parameters;
        var warung = outputParam.warung;
        var ref = db.ref("warung/"+warung);
        ref.once("value", function(snapshot) {
          var dataWarung = snapshot.val();
          // Save transaction to realtime database
          var transaksi = {};
          var pesanan = {};
          var harga = dataWarung.menu[outputParam.menu[0]].harga;
          pesanan = {
            [outputParam.menu[0]] : {'jumlah' : outputParam.jumlah[0], ['harga'] : harga}
          }
          transaksi  = {
            'alamat': outputParam.alamat,
            'user': source.userId,
            'pesanan': pesanan,
            'waktu': date,
            'warung' : warung
          };
          var newRef = db.ref("transaksi");
          var post = newRef.push(transaksi);
          var idTransaksi = post.key;
          var userRef = db.ref("user/activeTransaction");
          userRef.child(source.userId).set(idTransaksi);
          // Sending invoice to user
          var nomorWarung = dataWarung.nomorWarung;
          var text = "Pesen " + outputParam.menu[0] + " " + outputParam.jumlah[0] + ", dikirim ke "+outputParam.alamat;
          text = encodeURIComponent(text);
          var url = "https://api.whatsapp.com/send?phone="+nomorWarung+"&text="+text;
          return flex.order(replyToken, idTransaksi, url, dataWarung);
          process.exit();
        }, function (errorObject) {
          console.log("The read failed: " + errorObject.code);
        });
      }
      break;

      case 'Note':
      if (body.result.fulfillment.speech !== "") {
        response = body.result.fulfillment.speech;
        return replyText(replyToken, response);
      } else {
        response = body.query.fulfillment.messages[0].payload.line;
        return client.replyMessage(replyToken, response);
      }
      break;

      case 'Note.Done':
      var outputParam = body.result.contexts[0].parameters;
      var warung = outputParam.warung;
      var ref = db.ref("warung/"+warung+"/nomorWarung");
      ref.once("value", function(snapshot) {
        var data = snapshot.val();
        // Sending Invoice to User
        var text = "Pesen " + outputParam.menu[0] + " " + outputParam.jumlah[0] + ", "+ outputParam.note + ", dikirim ke "+outputParam.alamat;
        text = encodeURIComponent(text);
        var url = "https://api.whatsapp.com/send?phone="+data+"&text="+text;
        var idRef = db.ref("user/activeTransaction/"+source.userId);
        idRef.once("value", function(snapshot) {
          var idTransaksi = snapshot.val();
          // Add notes to saved transaction database
          note  = {
            'note': outputParam.note
          };
          var newRef = db.ref("transaksi/"+idTransaksi);
          var post = newRef.set(note);
          return flex.orderNote(replyToken, idTransaksi, url, dataWarung);
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
  },
  bar: function () {
    console.log("function bar");
  }
};

module.exports = self;
