module.exports = {
  flex: function (thumbnail, kategori) {
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
          "text": kategori
        }
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "action": {
          "type": "message",
          "text": kategori
        },
        "contents": [
          {
            "type": "text",
            "text": kategori,
            "weight": "bold",
            "size": "sm",
            "margin": "sm",
            "flex": 0
          },
          {
            "type": "box",
            "layout": "vertical",
            "spacing": "sm",
            "contents": []
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
              "label": "Lihat Semua",
              "text": kategori
            }
          }
        ]
      }
    };
    return flex;
  }
}
