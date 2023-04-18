const express =require('express');

const router=express.Router();
// user相关
router.use(require('./user'));

//home
router.use('/home',require('./home/home'))
//latestNews
router.use(require('./latest/latestNews'))

//standingDetail
router.use(require('./standing/standingDetail'))

//team
router.use(require('./team/team'))

//teamDetail
router.use(require('./team/teamDetail'))

//driver
router.use(require('./driver/driver'))

//driverdetail
router.use(require('./driver/driverdetail'))

//ticket
router.use(require('./ticket/ticket'))

//ticketdetail
router.use(require('./ticket/ticketdetail'))

//Backmenu
router.use(require('./menu/menu'))

// backServeUser
router.use(require('./ServeUser'))

// backreview
router.use(require('./review/review'))



module.exports=router;