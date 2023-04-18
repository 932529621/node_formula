const express =require('express')
const router = express.Router();
const driverdetail=require('../../controller/driver/driverdetail')

//breif
router.get('/driverdetail/getdriverdetail',driverdetail.getdriverdetail) 
router.get('/driverdetail/getdriverSWiper',driverdetail.getdriverSWiper) 
router.get('/driverdetail/getdriverAlsoLike',driverdetail.getdriverAlsoLike) 

module.exports = router;