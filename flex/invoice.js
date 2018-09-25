module.exports = {
  flex: function (warung, alamatWarung, url, note) {
    let flex;
    if (note) {
      flex = {
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
                "text": warung,
                "weight": "bold",
                "size": "xxl",
                "margin": "md"
              },
              {
                "type": "text",
                "text": alamatWarung,
                "size": "xs",
                "color": "#aaaaaa",
                "wrap": true
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
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "spacer",
                    "size": "xl"
                  },
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#0B5ED7",
                    "action": {
                      "type": "uri",
                      "label": "PESAN",
                      "uri": url
                    }
                  },
                  {
                    "type": "button",
                    "action": {
                      "type": "message",
                      "label": "Catatan Tambahan",
                      "text": "Catatan tambahan dong"
                    }
                  }
                ]
              }
            ]
          }
        }
      };
    } else {
      flex = {
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
                "text": data.warung,
                "weight": "bold",
                "size": "xxl",
                "margin": "md"
              },
              {
                "type": "text",
                "text": dataWarung.alamat,
                "size": "xs",
                "color": "#aaaaaa",
                "wrap": true
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
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents":[
                  {"type":"spacer",
                    "size" : "xl"
                  },
                  {
                    "type": "text",
                    "text": "CATATAN",
                    "size": "sm",
                    "color": "#555555"
                  }
                ]
              },
              {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "spacer",
                    "size": "xl"
                  },
                  {
                    "type": "button",
                    "style": "primary",
                    "color": "#0B5ED7",
                    "action": {
                      "type": "uri",
                      "label": "PESAN",
                      "uri": url
                    }
                  }
                ]
              }
            ]
          }
        }
      };
    }
    return flex;
  },
  item: function (item, harga) {
    let flex = {
      "type": "box",
      "layout": "horizontal",
      "contents": [
        {
          "type": "text",
          "text": item,
          "size": "sm",
          "color": "#555555",
          "flex": 0
        },
        {
          "type": "text",
          "text": harga,
          "size": "sm",
          "color": "#111111",
          "align": "end"
        }
      ]
    };
    return flex;
  }
}
