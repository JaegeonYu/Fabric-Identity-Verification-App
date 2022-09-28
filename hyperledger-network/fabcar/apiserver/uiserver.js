
const express = require('express');
const bodyParser = require('body-parser');
const {spwan, spawn} = require('child_process');
const multer = require('multer')
const app = express();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var request = require('request');
app.use(bodyParser.json());
// Setting for Hyperledger Fabric
const { Gateway,Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const http= require('http');

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './images/');
    },
    filename(req, file, callback) {
        callback(null, `${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

app.get('/api/query/:info_index', async function (req, res) {
    try {
        
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        const contract = network.getContract('fabinfo');

        const result = await contract.evaluateTransaction('queryFinger', req.params.info_index);
        
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
        res.status(200).json({response: result.toString()});
} catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
    }
});
//Log in function
app.post('/api/upload', upload.single('photo'),async function (req, res) {
    try {
        let start = new Date();
        console.log('state : Upload INFO data, Finger Image To server')
        const data = req.body
        console.log('InfoID : ' + data.UserID)
        console.log('Select : ' + data.Select)
        const image1 = {image : ''};

        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabinfo');
        // Evaluate the specified transaction.
        
        console.log('state : Query to Block Chain to get Figner Image');
        const result = await contract.evaluateTransaction('queryFinger', data.UserID);
        var cut = result.toString().split('"');
        image1.image = Buffer.from(cut[1],'base64');
        fs.writeFileSync(`./images/${data.UserID}_block.jpg`, image1.image); 
       
        console.log('state : Images Compare to Use Python code');
        var geturl = 'http://localhost:808/api/model/'+data.UserID;
        var dataToSend=""
        request.get({
            url: geturl
        }, function(error, response, body){
          
          var ex = JSON.parse(body);
          dataToSend=ex.result;
          if (dataToSend.includes('yes'))
          { console.log(`state : matched :: images between are matched success!!!`)

              res.status(200).json({what:'matched'});
              // clean(`./images/${req.body.UserID}.jpg`);
              // clean(`./images/${req.body.UserID}_block.jpg`);
              console.log("login USERID : ",req.body.UserID);
              let finish = new Date();
              console.log('state : Images Compare Finish');
              console.log('state : Log in runtime',finish - start,'ms');
              return;
      }else if(dataToSend.includes('no')){
              console.log(`state : unmatched :: images between  are unmateched `);
              res.status(200).json({what:`unmatched`});
              //clean(`./images/${data.UserID}.jpg`);
              //clean(`./images/${data.UserId}_block.jpg`);
              console.log('state : Images Compare Finish');
              let finish = new Date();
              console.log('state : Log in runtime',finish - start,'ms');
              return;
      }
        })
        
} catch (error) {
    if(error.code=="ENOENT"){
        console.log("file delete error create");
    }
        console.error(`state : no InfoID in blockchain: ${error}`);
        res.status(200).json({what: "noID"});
        process.exit(1);
    }
});
//age check function 
app.get('/api/queryauth/:info_index', async function (req, res) {
    try {
        let start = new Date();
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabinfo');
        // Evaluate the specified transaction.
        const result = await contract.evaluateTransaction('queryInfoAge', req.params.info_index);
        //clean(`./images/${req.params.info_index}.jpg`);
        //clean(`./images/${req.params.info_index}_block.jpg`);
        console.log(`state : Transaction has been evaluated, result is: ${result.toString()}`);
        console.log(JSON.parse(result.toString()));
        res.json(JSON.parse(result.toString()));
        let finish = new Date();
        console.log('state : QuaryAuth runtime : ',finish - start,'ms');
       
} catch (error) {
    
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({error: error});
        process.exit(1);
        
    }
    
});
//sign up function
app.post('/api/addinfo/', upload.single('photo'), async function (req, res) { 
    try {
        let start = new Date();
        const finger = {image : ''};
        finger.image= Buffer.from(fs.readFileSync(`./images/${req.body.infoid}.jpg`)).toString('base64');
        const ccpPath = path.resolve(__dirname, '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
     
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

     
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
      
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });
        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('fabinfo');
        console.log('state : upload INFO to singup')
    
        await contract.submitTransaction('createInfo', req.body.infoid, req.body.name, finger.image, req.body.age, req.body.inf);

        //console.log(req.body.infoid, req.body.name, finger.image, req.body.age, req.body.inf);
        console.log('state : Transaction has been submitted');
        console.log('state : sigup complete')
        
        res.json({signup : "complete"});
        //clean(`./images/${req.body.infoid}.jpg`);
        console.log('state : image delete')
        let finish = new Date();
        console.log("state : Signup runtime : " , finish - start ,'ms');
        gateway.disconnect();
} catch (error) {
        console.error(`state : Failed to submit transaction: ${error}`);
        process.exit(1);
    }
})
async function clean(file){
    fs.unlinkSync(file, function(err){
        if(err){
            console.log("Error :", err)
        }
    })
}


app.listen(8080);