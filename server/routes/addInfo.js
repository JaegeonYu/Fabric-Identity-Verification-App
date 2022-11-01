
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


const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './images/');
    },
    filename(req, file, callback) {
        callback(null, `${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

//sign up function
router.post('/', upload.single('photo'), async function (req, res) { 
    try {
        let start = new Date();
        const finger = {image : ''};
        finger.image= Buffer.from(fs.readFileSync(`./images/${req.body.infoid}.jpg`)).toString('base64');
        const ccpPath = path.resolve(__dirname, '..','..', '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
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

module.exports = router;