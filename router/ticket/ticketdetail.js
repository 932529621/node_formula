const express =require('express')
const router = express.Router();

const ticketdetail=require('../../controller/ticket/ticketdetail');

router.get('/ticket/getticketdetailinfo',ticketdetail.getticketdetailinfo) //req.query
router.get('/ticket/getsingleticketinfo',ticketdetail.getsingleticketinfo)
router.post('/ticket/InsertOrUpdateTicketInfo',ticketdetail.InsertOrUpdateTicketInfo)
router.delete('/ticket/DeleteticketInfo',ticketdetail.DeleteticketInfo)
router.post('/ticket/InsertUserTicket',ticketdetail.InsertUserTicket)

//alipay
router.post('/ticket/GoToPay',ticketdetail.GoToPay)


module.exports = router;