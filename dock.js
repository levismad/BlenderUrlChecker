var exec = require('child_process').exec;
var urls = require('./config/urls.json').urls;
var batchSize = 10;
async function exe(){
var proms = [];
  // for(var i = 0; i < urls.length; i++){
  for(var i = 0; i < batchSize + 1; i++){
    if(i%100 == 0){
      console.log(`aguardando`);
      await Promise.all(proms);
      console.log(`fim das ${i*batchSize} tasks`);
    }
    else{
      console.log(`Docker ${i}/${urls[i]}`)
      proms.push(exec(`sudo docker run -d -t -i -e BARRAMENTO=${urls[i]} levismad/crawler`, function(error, stdout, stderr) {
        if (error) {
          console.log(error.code);
        }
        console.log(stdout);
      }));
    }
  }
}