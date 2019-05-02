var Crawler = require("crawler");
var {mongoose} = require('./db/mongoose');
require('./config/config');
const {Site} = require('./models/site');
var urls = require('./config/urls.json').urls;
var destect = ["carrinho", "pedido","produto","adicionar","R\\$","entrega","pol.tica","troca","rastrei."];
var current = 0;
var sitios = [];
// var url = process.env.BARRAMENTO;
var omega = process.env.BARRAMENTO.split(",");
console.log(omega);
var c = new Crawler({
    callback : function (error, res, done) {
        try{
            console.log(++current);
            var body = {};
            if(error){
                body.Url = res.options.uri;
                body.Online = false;
                body.RegexRule = destect.join(",");
                body.Error = error.code || error.reason;
                // sitios.push(body);
            }else{
                var $ = res.$;
                body.Url = res.options.uri;      
                body.MatchCount = 0;
                body.RegexRule = destect.join(",");
                body.StatusCode = res.statusCode;
                body.StatusMessage = res.statusMessage;
                body.Online = true;
                var html = ($('body').html() || "");
                for(var i in destect){
                    var v = destect[i];
                    var regex = new RegExp(`.*${v}.*`, "gi");
                    body.MatchCount = body.MatchCount + ((html.match(regex) || []).length);
                };
                
            }
        }
        catch(e){
            console.log(e);
        }
        finally{                
            sitios.push(body);
        }        
        done();
    }
});
c.on('drain',async function(){
    console.log("done queue");
    await save();
});
for(var i = omega[0] ; i < omega[1]; i++){
    if(!!urls[i]){
        c.queue([{
            // uri: url,
            uri: urls[i],
            // timeout: 2000,
            jQuery: true,
            userAgent: "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1",
            retries: 0,
            rateLimit: 0,
            maxConnections:500,
            strictSSL: false
        }]);
    }
}

async function save(){
    try {
        console.log("connecting mongo");
        mongoose.connect(process.env.MONGODB_URI);
        for(var i = 0; i < sitios.length; i++){
            console.log("saving " + i)
            try {
                await saveOne(sitios[i]);
            } catch (error) {
                console.log(error);
            }
        }
        console.log("discoconnecting mongo");
        mongoose.connection.close();
    } catch (error) {
        await save();
    }
}
function saveOne(body){
    let site = new Site(body);
    return new Promise(async ( resolve, reject ) => {
        await site.save(function(err, doc) {
            if (err) return reject(err);
            else return resolve(doc.toObject());
        })
    })
}