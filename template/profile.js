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
                  "flex": 1,
                  "size": "sm",
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": profile.displayName,
                  "flex": 2,
                  "margin": "md",
                  "size": "sm",
                  "align": "start",
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
                  "flex": 1,
                  "size": "sm",
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.nomorHP,
                  "flex": 2,
                  "margin": "md",
                  "size": "sm",
                  "align": "start"
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
                  "flex": 1,
                  "size": "sm",
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.fakultas,
                  "flex": 2,
                  "margin": "md",
                  "size": "sm",
                  "align": "start",
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
                  "flex": 1,
                  "margin": "md",
                  "size": "sm",
                  "align": "start",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": data.jurusan,
                  "flex": 2,
                  "margin": "md",
                  "size": "sm",
                  "align": "start",
                  "wrap": true
                }
              ]
            },
            {
              "type": "separator",
              "margin": "md"
            },
            {
              "type": "box",
              "layout": "horizontal",
              "margin": "md",
              "contents": [
                {
                  "type": "text",
                  "text": "Points",
                  "flex": 1,
                  "size": "sm",
                  "color": "#AAAAAA"
                },
                {
                  "type": "text",
                  "text": "⭐ " + data.points.toString() + " pts",
                  "flex": 2,
                  "margin": "md",
                  "size": "sm",
                  "align": "start",
                  "weight": "bold"
                }
              ]
            },
            {
              "type": "separator",
              "margin": "md"
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
