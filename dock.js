var exec = require('child_process').exec;
var urls = require('./config/urls.json').urls;
var batchSize = 31;

async function execWithLog(command){
  await promiseFromChildProcess(exec(command, function(error, stdout, stderr) {
    if (error) {
      console.log(error.code);
    }
    console.log(stdout);
  }));
}
function promiseFromChildProcess(child) {
  return new Promise(function (resolve, reject) {
      child.addListener("error", reject);
      child.addListener("exit", resolve);
  });
}

async function exe(){
var proms = [];
// for(var i = 0; i < urls.length; i++){
  for(var i = 0; i < batchSize; i++){
    if(i > 0 && i%10 == 0){
      console.log(`aguardando`);
      await Promise.all(proms);
      proms = [];
      await execWithLog(`sudo docker stop $(sudo docker ps -a -q)`);
      await execWithLog(`sudo docker rm $(sudo docker ps -a -q)`);
    }
    // else{
      console.log(`Docker ${i}/${urls[i]}`);
      await execWithLog(`sudo docker run -t -i -e BARRAMENTO=${urls[i]} levismad/crawler`);
    // }
  }
  console.log(`finalizando ultimas tasks`);
  await Promise.all(proms);
  
  await execWithLog(`sudo docker stop $(sudo docker ps -a -q)`);
  await execWithLog(`sudo docker rm $(sudo docker ps -a -q)`);
}
// exe().then(function(){ console.log("done"); }).catch(function(){ console.log("done error"); });
execWithLog('sudo docker run -t -i -e BARRAMENTO=https://www.001skincare.com/collections/all?sort_by=best-selling levismad/crawler')
.then(function(){ console.log("done"); }).catch(function(){ console.log("done error"); });