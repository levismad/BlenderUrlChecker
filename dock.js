var exec = require('child_process').exec;
var urls = require('./config/urls.json').urls;
var batchSize = 31;
async function exe(){
var proms = [];
function promiseFromChildProcess(child) {
  return new Promise(function (resolve, reject) {
      child.addListener("error", reject);
      child.addListener("exit", resolve);
  });
}
// for(var i = 0; i < urls.length; i++){
  for(var i = 0; i < batchSize; i++){
    if(i > 0 && i%10 == 0){
      console.log(`aguardando`);
      await Promise.all(proms);
      proms = [];
      await promiseFromChildProcess(exec(`sudo docker stop $(sudo docker ps -a -q)`, function(error, stdout, stderr) {
        if (error) {
          console.log(error.code);
        }
        console.log(stdout);
        console.log(`fim docker stop`);
      }));
      await promiseFromChildProcess(exec(`sudo docker rm $(sudo docker ps -a -q)`, function(error, stdout, stderr) {
        if (error) {
          console.log(error.code);
        }
        console.log(stdout);
        console.log(`fim docker remove`);
      }));
    }
    // else{
      console.log(`Docker ${i}/${urls[i]}`)
      proms.push(promiseFromChildProcess(exec(`sudo docker run -t -i -e BARRAMENTO=${urls[i]} levismad/crawler`, function(error, stdout, stderr) {
        if (error) {
          console.log(error.code);
        }
        console.log(stdout);
      })));
    // }
  }
  console.log(`finalizando ultimas tasks`);
  await Promise.all(proms);
  
  await promiseFromChildProcess(exec(`sudo docker stop $(sudo docker ps -a -q)`, function(error, stdout, stderr) {
    if (error) {
      console.log(error.code);
    }
    console.log(stdout);
    console.log(`fim docker stop`);
  }));
  await promiseFromChildProcess(exec(`sudo docker rm $(sudo docker ps -a -q)`, function(error, stdout, stderr) {
    if (error) {
      console.log(error.code);
    }
    console.log(stdout);
    console.log(`fim docker remove`);
  }));
}
exe().then(function(){ console.log("done"); }).catch(function(){ console.log("done error"); });