'use strict';

const line = require('@line/bot-sdk')
const express = require('express')
const firebase = require('firebase-admin')
const store = require('store2')
const bodyParser = require('body-parser')
require('dotenv').config()

// another javascript file (one file = one feature)
const pushMessage = require('./pushMessage.js');
const laper = require('./functions/laper.js');
const register = require('./functions/register.js');
const profile = require('./functions/profile.js');
const fallback = require('./functions/default.js');

// postback file
const pbprofile = require('./postback/profile.js');
const pbregister = require('./postback/register.js');

// service account key for firebase
var serviceAccount = require('./serviceAccount.json');

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// base URL for webhook server
const baseURL = process.env.BASE_URL;

// create LINE SDK client
const client = new line.Client(config);
module.exports.client = client;

// create Express app
const app = express();

// initialize Firebase
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL
});
const db = firebase.database();
module.exports.database = db;
module.exports.admin = firebase;

// webhook Callback
app.post('/callback', line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }

  // handle events separately
  Promise.all(req.body.events.map(handleEvent))
  .then(() => res.end())
  .catch((err) => {
    console.error(err);
    res.status(500).end();
  });
});

// webhook Callback
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/push', (req, res) => {
  console.log(req.body.userId);
  console.log(req.body);
  if (req.body.source == 'website') {
    return pushMessage.website(req, res)
  } else if (req.body.source == 'mitra') {
    return pushMessage.mitra(req, res)
  } else {
    console.log("body kosong");
    // return pushMessage.website(req, res)
  }
});

// Simple Reply Function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};
module.exports.replyText = replyText;

// periksa apakah user sudah mengisi biodata atau belum, return null if has registered
const hasRegister = (userId, callback) => {
  var ref = db.ref("user/"+userId)
  ref.once("value", function(snapshot) {
    var data = snapshot.val();
    if (data) {
      if (!data.nomorHP) {
        callback('nomorHP')
      } else if (!data.jurusan) {
        callback('jurusan')
      } else {
        callback(null)
      }
    } else {
      callback('nomorHP')
    }
  });
}
module.exports.hasRegister = hasRegister;

const resetBot = (userId, replyToken) => {
  store.set(userId, {status: null})
  return replyText(replyToken, "Bot berhasil direset")
}
module.exports.hasRegister = hasRegister;

// check is the user has a session or not
const hasSession = (userId) => {
  if (store.has(userId)) {
    // Terdaftar di session
    return store.get(userId)
  } else {
    // Belum terdaftar di session
    store.set(userId, {status: null})
    return store.get(userId)
  }
};
module.exports.hasSession = hasSession;

// callback function to handle a single event
function handleEvent(event) {
  console.log(JSON.stringify(event)); //Giving Event Log to Heroku
  switch (event.type) {
    case 'message':
    const message = event.message;
    switch (message.type) {
      case 'text':
      	return handleText(message, event.replyToken, event.source);
    }
    break;
    case 'follow':
    var updateRef = db.ref("statistik/adders");
    updateRef.transaction(function(adders) {
      // If node/clicks has never been set, currentRank will be `null`.
      return (adders || 0) + 1;
    });
    return client.getProfile(event.source.userId)
    .then((profile) => client.replyMessage(event.replyToken, [
      {
      "type": "text",
      "text": `Hello, kak ${profile.displayName}! 􀰂􀄦wink􏿿`
      },
      {
      "type": "text",
      "text": `Kenalin namaku Dika 􀰂􀄤smiling􏿿 mahasiswa Telyu.\nAku bisa pesenin makanan 🍽️ ke warung yang ada di sekitar Telkom University loh!`
      },
      {
        "type": "text",
        "text": `Kalau kak ${profile.displayName} lagi laper bilang \"Laper\" aja ya, ga usah malu 􀰂􀄥excited􏿿`,
        "quickReply": {
          "items": [
            {
              "type": "action",
              "action": {
                "type": "message",
                "label": "Laper",
                "text": "Laper"
              }
            }
          ]
        }
      }
    ]));
    break;
    case 'unfollow':
    var updateRef = db.ref("statistik/adders");
    updateRef.transaction(function(adders) {
      // If node/clicks has never been set, currentRank will be `null`.
      return (adders) - 1;
    });
    return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
    break;
    case 'join':
    var updateRef = db.ref("statistik/groups/total");
    updateRef.transaction(function(total) {
      // If node/clicks has never been set, currentRank will be `null`.
      return (total || 0) + 1;
    });
    return replyText(event.replyToken, [
      `Kenalin namaku Dika 􀰂􀄤smiling􏿿 \naku bisa pesenin makanan 🍽️ kesukaanmu di sekitar Telkom University loh!`,
      `Kalau pada laper bilang "Laper" aja ya, ga usah malu 􀰂􀄥excited􏿿`,

    ]);
    break;
    case 'leave':
    var updateRef = db.ref("statistik/groups");
    updateRef.transaction(function(groups) {
      // If node/clicks has never been set, currentRank will be `null`.
      return (groups) - 1;
    });
    return console.log(`Left: ${JSON.stringify(event)}`);
    break;
    case 'postback':
    let data = event.postback.data;
    var session = hasSession(event.source.userId) // return data of session (local storage)
    if (session.status == 'register') {
      var res = {};
      var vars = data.split("&");
      for(var i=0; i < vars.length; i++){
        var str = vars[i].split("=");
        res[str[0]] = str[1];
      }
      return pbregister.main(event.replyToken, event.source.userId, session, res);
    } else {
      if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
        data += `(${JSON.stringify(event.postback.params)})`;
      }else if (data === 'leftGroup'){
        return replyText(event.replyToken, 'Dika pamit left group dulu yaa')
        .then(() => client.leaveGroup(event.source.groupId));
      }else if (data === 'leftRoom'){
        return replyText(event.replyToken, 'Dika pamit left multichat dulu yaa')
        .then(() => client.leaveRoom(event.source.roomId));
      }else if (data.startsWith("data=")) {
        var res = {};
        var vars = data.split("&");
        for(var i=0; i < vars.length; i++){
          var str = vars[i].split("=");
          res[str[0]] = str[1];
        }
        if (res.data=='profile') {
          pbprofile.main(event.replyToken, res, event.source.userId)
        }
        // return postback.response(event.replyToken, res, event.source.userId);
      }
    }
    break;
    default:
    throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    break;
  }
}

function handleText(message, replyToken, source) {
  client.getProfile(source.userId).then((profile) => console.log(profile.displayName+': '+profile.pictureUrl)); //Heroku Log Photo Profile User
  var text = message.text.toLowerCase()
  var session = hasSession(source.userId) // return data of session (local storage)
  console.log("Ini Sessionnya => " + source.userId + ": " + JSON.stringify(session));
  if (text == 'reset') resetBot(source.userId, replyToken)
  else if (session.status == 'laper') {
    // if status of session is laper
    return laper.main(text, replyToken, source.userId, session)
  } else if (session.status == 'register') {
    // if status of session is register
    return register.main(text, replyToken, source.userId, session)
  } else if (session.status == null) {
    // if status of session is null
    return fallback.main(text, replyToken, source, session)
  }
}

var staticFile = require('path').join(__dirname,'/public');
app.use(express.static(staticFile));

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
