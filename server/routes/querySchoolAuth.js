const express= require('express');
const router =express.Router();
const { Gateway,Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

router.get('/api/querySchoolAuth/:info_index', async function (req, res) {
    try {
        let start = new Date();
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
        const result = await contract.evaluateTransaction('queryInfoSchool', req.params.info_index);
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

module.exports = router;