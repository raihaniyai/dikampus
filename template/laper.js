const bot = require('./../bot.js');

var self = {
  imagemap: function () {
    flex = {
      "type": "imagemap",
      "baseUrl": "https://dikosan.herokuapp.com/images/imagemap_laper",
      "altText": "Laper",
      "baseSize": {
        "width": 1040,
        "height": 1040
      },
      "actions": [
        {
          "type": "uri",
          "linkUri": "https://instagram.com",
          "area": {
            "x": 0,
            "y": 0,
            "width": 1040,
            "height": 1040
          }
        }
      ]
    };
    return flex;
  }
};

module.exports = self;
