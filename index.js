var Crawler = require("crawler");
require('./config/config');
var {mongoose} = require('./db/mongoose');
const {Site} = require('./models/site');
var destect = ["compre", "agora","produto","frete","R\\$","promo..o"];
var current = 0;
var sitios = [];
var url = process.env.BARRAMENTO;
var c = new Crawler({
    maxConnections : 10000,
    callback : function (error, res, done) {
        console.log(++current);
        if(error){
            var body = {};
            body.Url = res.options.uri;
            body.Online = false;
            body.RegexRule = destect.join(",");
            
            sitios.push(body);
        }else{
            var $ = res.$;
            var body = {};
            body.Url = res.options.uri;
            body.HtmlLang = $("html").attr("lang");
            body.MetaLocale = $("meta[property='og:locale']").attr("content");            
            body.MatchCount = 0;
            body.RegexRule = destect.join(",");
            body.StatusCode = res.statusCode;
            body.StatusMessage = res.statusMessage;
            body.Products = [];
            body.Online = true;

            try{
                for(var i in destect){
                    var v = destect[i];
                    var regex = new RegExp(`.*${v}.*`, "gi");
                    body.MatchCount = body.MatchCount + ((($('body').html() || "").match(regex) || []).length);
                };
    
                if(body.StatusCode >= 200 && body.StatusCode < 400){
                    var products = $('a').filter(function(i,v) {
                        // console.log($(this).attr("href"));
                        return ($(this).attr("href") || "").indexOf("/products") > -1;
                    });
                    
                    for(var i = 0; i < products.length; i++){
                        body.Products.push($(products[i]).html());
                    }
                }
            }
            catch(e){

            }
            finally{                
                sitios.push(body);
            }

        }
        done();
    }
});

// for(var i = 0 ; i < 100; i++){
    // Queue URLs with custom callbacks & parameters
    c.queue([{
        uri: url,
        jQuery: true,
        userAgent: "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1",
        retries: 0
    }]);
// }
c.on('drain',async function(){
    console.log("done queue");
    await save();
});

async function save(){
 for(var i = 0; i < sitios.length; i++){
     console.log("saving " + i)
     try {
         await saveOne(sitios[i]);
     } catch (error) {
         
     }
 }
 mongoose.connection.close();
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