'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const firebase = require("firebase-admin");
const dialogflow = require('./functions/dialogflow.js');
require('dotenv').config();

// service account key for firebase
var serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

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

//Webhook Callback
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

// Simple Reply Function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};
module.exports.replyText = replyText;

// callback function to handle a single event
function handleEvent(event) {
  console.log(JSON.stringify(event)); //Giving Event Log to Heroku
  switch (event.type) {
    case 'message':
    const message = event.message;
    switch (message.type) {
      case 'text':
      return handleText(message, event.replyToken, event.source);
      break;
      default:
      throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      break;
    }
    break;
    case 'follow':
    return client.getProfile(event.source.userId)
    .then((profile) => client.replyMessage(event.replyToken, [
      {
      "type": "text",
      "text": "Hello, ${profile.displayName}! 􀰂􀄦wink􏿿"
      },
      {
      "type": "text",
      "text": "Kenalin namaku Dika 😄, \naku bisa pesenin makanan 🍽️ kesukaanmu di sekitar Telkom University loh!"
      },
      {
        "type": "text",
        "text": "Kalau kamu lagi laper bilang \"Laper\" aja ya, ga usah malu 􀰂􀄥excited􏿿",
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

    ]);(
      event.replyToken,
      [
        `Hello, ${profile.displayName}! 􀰂􀄦wink􏿿`,
        `Kenalin namaku Dika 😄, \naku bisa pesenin makanan 🍽️ kesukaanmu di sekitar Telkom University loh!`,
        `Kalau kamu laper bilang "Laper" aja ya, ga usah malu :)`,
      ]
    ));
    break;
    case 'unfollow':
    return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
    break;
    case 'join':
    return replyText(event.replyToken, [
      `Kenalin namaku Dika 􀰂􀄤smiling􏿿 \naku bisa pesenin makanan 🍽️ kesukaanmu di sekitar Telkom University loh!`,
      `Kalau pada laper bilang "Laper" aja ya, ga usah malu 􀰂􀄥excited􏿿`,

    ]);
    break;
    case 'leave':
    return console.log(`Left: ${JSON.stringify(event)}`);
    break;
    case 'postback':
    let data = event.postback.data;
    if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
      data += `(${JSON.stringify(event.postback.params)})`;
    }else if (data === 'leftGroup'){
      return replyText(event.replyToken, 'Dika pamit left group dulu yaa')
      .then(() => client.leaveGroup(event.source.groupId));
    }else if (data === 'leftRoom'){
      return replyText(event.replyToken, 'Dika pamit left multichat dulu yaa')
      .then(() => client.leaveRoom(event.source.roomId));
    }
    break;
    case 'beacon':
    return replyText(event.replyToken, `Got beacon: ${event.beacon.hwid}`);
    break;
    default:
    throw new Error(`Unknown event: ${JSON.stringify(event)}`);
    break;
  }
}

function handleText(message, replyToken, source) {
  client.getProfile(source.userId).then((profile) => console.log(profile.displayName+': '+profile.pictureUrl)); //Heroku Log Photo Profile User
  switch (message.text) {
    case 'profile':
    if (source.userId) {
      return client.getProfile(source.userId)
      .then((profile) => replyText(
        replyToken,
        [
          `Display name: ${profile.displayName}`,
          `Status message: ${profile.statusMessage}`,
        ]
      ));
    } else {
      return replyText(replyToken, 'Bot can\'t use profile API without user ID');
    }
    break;
    case 'bye':
    switch (source.type) {
      case 'user':
      return replyText(replyToken, 'Bot can\'t leave from 1:1 chat');
      case 'group':
      return client.replyMessage(replyToken, {
        type: 'template',
        altText: 'Kick Dikampus?',
        template: {
          type: 'confirm',
          text: 'Yakin mau ngekick Dika?',
          actions: [
            { label: 'Gajadi', type: 'message', text: 'Gajadi' },
            { label: 'Yakin', type: 'postback', data: 'leftGroup' },
          ],
        },
      });
      break;
      case 'room':
      return client.replyMessage(replyToken, {
        type: 'template',
        altText: 'Kick Dikampus?',
        template: {
          type: 'confirm',
          text: 'Yakin mau ngekick Dika?',
          actions: [
            { label: 'Gajadi', type: 'message', text: 'Gajadi' },
            { label: 'Yakin', type: 'postback', data: 'leftRoom' },
          ],
        },
      });
    }
    break;
    default:
    return dialogflow.response(message.text, replyToken, source);
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
