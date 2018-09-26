module.exports = {
  flex: function (thumbnail, warung, alamat, jamBuka, ongkir) {
    let flex = {
      "type": "bubble",
      "hero": {
        "type": "image",
        "url": thumbnail,
        "size": "full",
        "aspectRatio": "1:1",
        "aspectMode": "cover",
        "action": {
          "type": "message",
          "text": warung
        }
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "action": {
          "type": "message",
          "text": warung
        },
        "contents": [
          {
            "type": "text",
            "text": warung,
            "weight": "bold",
            "size": "xl"
          },
          {
            "type": "box",
            "layout": "vertical",
            "margin": "lg",
            "spacing": "sm",
            "contents": [
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "Alamat",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": alamat,
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 4
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "Buka",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": jamBuka,
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 4
                  }
                ]
              },
              {
                "type": "box",
                "layout": "baseline",
                "spacing": "sm",
                "contents": [
                  {
                    "type": "text",
                    "text": "Ongkir",
                    "color": "#aaaaaa",
                    "size": "sm",
                    "flex": 1
                  },
                  {
                    "type": "text",
                    "text": ongkir,
                    "wrap": true,
                    "color": "#666666",
                    "size": "sm",
                    "flex": 4
                  }
                ]
              }
            ]
          }
        ]
      },
      "footer": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "contents": [
          {
            "type": "button",
            "style": "link",
            "color": "#0B5ED7",
            "height": "sm",
            "action": {
              "type": "message",
              "label": "Pilih Warung",
              "text": warung
            }
          },
          {
            "type": "spacer",
            "size": "sm"
          }
        ],
        "flex": 0
      }
    };
    return flex;
  },
  lainnya: function (warung) {
    let flex = {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "action": {
          "type":"postback",
          "label":"Warung Lainnya",
          "data":"data=warung&warung="+warung
        },
        "contents": [
          {
            "type": "button",
            "flex": 1,
            "gravity": "center",
            "action": {
              "type":"postback",
              "label":"Warung Lainnya",
              "data":"data=warung&warung="+warung
            }
          }
        ]
      }
    };
    return flex;
  }
}
