const bot = require('./bot.js')
const store = require('store2')

module.exports = {
  main: function (req, res) {
    console.log("msuksini");
    var replyText = bot.replyText;
    var client = bot.client;
    var type = res.type;
    var db = bot.database;
    const message = {
      type: 'text',
      text: 'Hello World!'
    };

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
