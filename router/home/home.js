const express =require('express')
const Userauth =require('../../util/Userauth');
const router = express.Router();
const home=require('../../controller/home/home')
//Top
router.get('/getTopVideo',home.getTopVideo);

//topNew
router.get('/getTopNews',home.getTopNews);
router.get('/getTopNewsVideo',home.getTopNewsVideo);
router.get('/getHightlightVideo',home.getHightlightVideo);
router.get('/getcalendar',home.getcalendar);
router.get('/getStanding',home.getStanding);
router.get('/getStandingteam',home.getStandingteam)
router.get('/getpartnersinfo',home.getpartnersinfo)
router.get('/getnavinfoinfo',home.getnavinfoinfo)
router.get('/getVideos',home.getVideos)
router.get('/getVideosByid',home.getVideosByid)

router.get('/getAllcomment',home.getAllcomment)
router.post('/commentThumbDownOrUp',home.commentThumbDownOrUp)
router.post('/addcomment',Userauth,home.addcomment)

module.exports = router;