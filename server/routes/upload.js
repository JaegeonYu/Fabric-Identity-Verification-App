
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const multer = require('multer')
const app = express();
app.use(bodyParser.json());
// Setting for Hyperledger Fabric
const { Gateway,Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
var request = require('request');

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './images/');
    },
    filename(req, file, callback) {
        callback(null, `${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.post('/', upload.single('photo'),async function (req, res) {
    try {
        let start = new Date();
        console.log('state : Upload INFO data, Finger Image To server')
        const data = req.body
        console.log('InfoID : ' + data.UserID)
        console.log('Select : ' + data.Select)
        const image1 = {image : ''};

        const ccpPath = path.resolve(__dirname,'..', '..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
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
        var geturl = 'http://localhost:8081/api/model/'+data.UserID;
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

module.exports = router;