const express = require('express')
const router = express.Router;
const FabricController = require(`./controller/fabric-controller`)
const multer = require('multer')


const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './images/');
    },
    filename(req, file, callback) {
        callback(null, `${file.originalname}.jpg`);
    },
});
const upload = multer({ storage: storage });

router.get('/api/query/:info_index',FabricController.queryFinger)
router.post('/api/upload', upload.single('photo'),FabricController.upload)
router.get('/api/queryauth/:info_index',FabricController.queryAuth)
router.post('/api/addinfo',upload.single('photo'),FabricController.addInfo)

module.exports = router;
