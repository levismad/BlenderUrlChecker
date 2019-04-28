const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function execWithLog(command) {
  const { stdout, stderr } = await exec(command);

  if (stderr) {
    console.error(`error: ${stderr}`);
  }
  console.log(`Number of files ${stdout}`);
}

var urls = require('./config/urls.json').urls;
var batchSize = 1;

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
      await execWithLog(`sudo docker run-e BARRAMENTO=${urls[i]} levismad/crawler`);
    // }
  }
  console.log(`finalizando ultimas tasks`);
  await Promise.all(proms);
  
  await execWithLog(`sudo docker stop $(sudo docker ps -a -q)`);
  await execWithLog(`sudo docker rm $(sudo docker ps -a -q)`);
}
exe().then(function(){ console.log("done"); }).catch(function(e){ console.log(e); });