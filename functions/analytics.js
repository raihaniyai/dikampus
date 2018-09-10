// kalau bot, pakai ini
const bot = require('./../bot.js');

const db = bot.database;

// kalau local pakai ini
// const firebase = require("firebase-admin");
// var serviceAccount = require("./../serviceAccount.json");
// firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount),
//     databaseURL: "https://tesbor-733b7.firebaseio.com"
//   });
// const db = firebase.database();

var self = {
    saveTransaction : function(idTransaksi, data){
        console.log(data);
        var ref = db.ref("warung/"+data.warung+"/transaksi/"+ idTransaksi);
        var data_transaksi = {
            'item' : data.pesanan,
            'total_price' : data.totalHarga,
            'user' : data.user,
            'waktu' : data.waktu,
        };
        ref.push(data_transaksi);
        console.log("saved");

    },

    getTotalDeliveryAllShop: function(idTransaksi){
        var ref = db.ref("transaksi/makanan/");
        ref.once("value", function(snapshot){
            var item = new Object();
            // instantiate hashmap
            snapshot.forEach(function(child){
                var data = child.val();
                if(typeof data.pesanan != "undefined"){
                    item[data.warung] = new Object();
                    var date = String(data.waktu).split(" ")[0];
                    item[data.warung][date] = new Object();
                    item[data.warung][date]['total_delivery'] = 0;
                    item[data.warung][date]['total_item_terjual'] = 0;
                    item[data.warung][date]['total_transaksi_idr'] = 0;
                }
            });
            snapshot.forEach(function(child){
                var data = child.val();
                var date = String(data.waktu).split(" ")[0];
                if(typeof data.pesanan != "undefined"){
                    if(typeof item[data.warung][date] != "undefined")
                    item[data.warung][date]['total_delivery'] += 1; 
                }
            });
            console.log(item);
            
        })
    },
    tes: function(idTransaksi){
        var ref = db.ref("transaksi/makanan/");
        ref.once("value", function(snapshot){
            snapshot.forEach(function(child){
                var data = child.val();
                if(String(child.key).includes("-LLmesb-InP5NW_3vjvY")){
                    console.log(data);
                }
            });
        })
    },
    tes2: function(){
        console.log("Function called from analytics");
    }
    
};

module.exports = self;
