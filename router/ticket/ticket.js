const express =require('express')
const router = express.Router();
const ticket=require('../../controller/ticket/ticket')

router.get('/ticket/getticketinfo',ticket.getticketinfo) //req.query
router.get('/ticket/getcheapestinfo',ticket.getcheapestinfo)
module.exports = router;