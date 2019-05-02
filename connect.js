
var {mongoose} = require('./db/mongoose');
try{
    console.log("connecting mongo");
    mongoose.connect(process.env.MONGODB_URI);
    console.log("discoconnecting mongo");
    mongoose.connection.close();
}
catch(e){
    console.log(e);
}