module.exports = {
  flex: function (thumbnail, menu, deskripsi, harga) {
    let flex = {
      "type": "bubble",
      "hero": {
        "type": "image",
        "size": "full",
        "aspectRatio": "1:1",
        "aspectMode": "cover",
        "url": thumbnail,
        "action": {
          "type": "message",
          "text": menu
        }
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "action": {
          "type": "message",
          "text": menu
        },
        "contents": [
          {
            "type": "text",
            "text": menu,
            "wrap": true,
            "weight": "bold",
            "size": "lg"
          },
          {
            "type": "text",
            "text": deskripsi,
            "wrap": true,
            "color": "#aaaaaa",
            "size": "xxs"
          },
          {
            "type": "separator",
            "margin": "lg"
          },
          {
            "type": "box",
            "layout": "baseline",
            "margin": "lg",
            "contents": [
              {
                "type": "text",
                "text": "Rp " + harga,
                "size" : "md",
                "wrap": true
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
            "style": "link",
            "color": "#0B5ED7",
            "action": {
              "type": "message",
              "label": "+ Tambahkan",
              "text": menu
            }
          }
        ]
      }
    };
    return flex;
  },
  lainnya: function (warung, kategori, menu) {
    let flex = {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "sm",
        "action": {
          "type":"postback",
          "label":"Menu Lainnya",
          "data":"data=menu&warung="+warung+"&kategori="+kategori+"&menu="+menu
        },
        "contents": [
          {
            "type": "button",
            "flex": 1,
            "gravity": "center",
            "action": {
              "type":"postback",
              "label":"Menu Lainnya",
              "data":"data=menu&warung="+warung+"&kategori="+kategori+"&menu="+menu
            }
          }
        ]
      }
    };
    return flex;
  }
}
