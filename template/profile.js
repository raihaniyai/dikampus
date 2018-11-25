const bot = require('./../bot.js');

var self = {
  main: function (profile, data) {
    flex = {
      "type": "flex",
      "altText": "Profile " + profile.displayName,
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "baseline",
          "contents": [
            {
              "type": "text",
              "text": ".",
              "flex": 0,
              "size": "xl",
              "align": "center",
              "weight": "bold",
              "color": "#00D54D"
            },
            {
              "type": "text",
              "text": "Profil",
              "flex": 1,
              "weight": "bold",
              "color": "#0B5ED7"
            }
          ]
        },
        "hero": {
          "type": "image",
          "url": profile.pictureUrl,
          "size": "full",
          "aspectRatio": "4:3",
          "aspectMode": "fit"
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "Nama",
                  "flex": 0,
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": profile.displayName,
                  "flex": 1,
                  "margin": "md",
                  "align": "end",
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "Nomor HP",
                  "flex": 0,
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.nomorHP,
                  "flex": 1,
                  "margin": "md",
                  "align": "end"
                }
              ]
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "Fakultas",
                  "flex": 0,
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.fakultas,
                  "flex": 1,
                  "margin": "md",
                  "align": "end",
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "Jurusan",
                  "flex": 0,
                  "margin": "md",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.jurusan,
                  "margin": "md",
                  "align": "end",
                  "wrap": true
                }
              ]
            },
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "text",
                  "text": "Points",
                  "flex": 0,
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": parseInt(data.points),
                  "flex": 1,
                  "margin": "md",
                  "align": "end",
                  "weight": "bold",
                  "wrap": true
                },
                {
                  "type": "text",
                  "text": "Points",
                  "flex": 0,
                  "margin": "sm",
                  "align": "end"
                }
              ]
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "Edit Profil",
                "text": "Edit Profil"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "Riwayat Pemesanan",
                "text": "Riwayat Pemesanan"
              },
              "color": "#0B5ED7",
              "style": "primary"
            }
          ]
        }
      }
    }
    return flex;
  }
};

module.exports = self;
