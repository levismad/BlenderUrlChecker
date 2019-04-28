var exec = require('child_process').exec;
var urls = require('./config/urls.json').urls;

// for(var i = 0; i < urls.length; i++){
for(var i = 0; i < 100; i++){
console.log(`Docker ${i}/${urls[i]}`)
exec(`sudo docker run -t -i -e BARRAMENTO=${urls[i]} levismad/crawler`, function(error, stdout, stderr) {
    if (error) {
      console.log(error.code);
    }
    console.log(stdout);
  });
}