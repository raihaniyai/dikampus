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
        var refTransaksi = db.ref("warung/"+data.warung+"/transaksi/"+ idTransaksi);
        var total = 0;
        
        for(var key in data.pesanan){
            if(data.pesanan.hasOwnProperty(key)){
                total += data.pesanan[key].harga * data.pesanan[key].jumlah;
            }
        }
        
        var data_transaksi = {
            'item' : data.pesanan,
            'total_price' : total,
            'user' : data.user,
            'waktu' : data.waktu,
        };
        console.log(data);
        var tes = refTransaksi.set(data_transaksi, function(error){
            if(error){
                console.log("Error: "+error);
            }else{
                console.log("Transaction Saved")
            }
        });
    },
    viewsCounter : function(namaWarung, user, viewCategory){
        const db = bot.database;
        const time = new Date();
        let refCounter = db.ref("warung/"+namaWarung+"/analytic/views");
        let data = {
                'time' : time.toString(),  
                'user' : user,
                'view' : viewCategory
            };
        refCounter.push(data);
    },

    viewsRecommendedCounter : function(warung){
        const db = bot.database;
        var updateRef = db.ref("warung/"+warung+"/warungRecommended");
        updateRef.transaction(function(warungRecommended) {
          if (warungRecommended) {
            return (warungRecommended) + 1;
          }
        });
    },

    visitCounter : function(namaWarung){
        const db = bot.database;
        const time = new Date();
        let refCounter = db.ref("warung/"+namaWarung+"/analytic/visit");
        refCounter.push().set({
            'time' : time.toString()
        });
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
