// kalau bot, pakai ini
const bot = require('./../bot.js');

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
        const db = bot.database;
        var refTransaksi = db.ref("warung/"+data.warung+"/transaksi/"+ idTransaksi;);
        var data_transaksi = {
            'item' : data.pesanan,
            'total_price' : data.totalHarga,
            'user' : data.user,
            'waktu' : data.waktu,
        };
        console.log(data_transaksi);
        var tes = refTransaksi.push(data_transaksi, function(error){
            if(error){
                console.log("Error: "+error);
            }else{
                console.log("Transaction Saved")
            }
        });
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
        console.log("Saving Transaction");
        var ref = db.ref("warung/"+'data.warung'+"/transaksi/"+ 'idTransaksi');
        var data_transaksi = {
            'item' : 'data.pesanan',
            'total_price' : 'data.totalHarga',
            'user' : 'data.user',
            'waktu' : 'data.waktu',
        };
        ref.push(data_transaksi, function(error){
            if(error){
                console.log("Error: "+error);
            }else{
                console.log("Transaction Saved")
            }
        });
    }
    
};

module.exports = self;
