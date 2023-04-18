const express =require('express')
const router = express.Router();
const driverbreif=require('../../controller/driver/driverbrief')

//breif
router.get('/driverbrief/getdriverbrief',driverbreif.getdriverbrief) 



module.exports = router;