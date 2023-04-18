const express =require('express')
const router = express.Router();
const review=require('../../controller/review/review');
const auth =require('../../util/auth');
const Userauth =require('../../util/Userauth');
router.get('/Adminmenu/getreviewinfo',auth,review.getreviewinfo) 
router.get('/Adminmenu/getDriverReviewByID',auth,review.getDriverReviewByID) 
router.get('/Adminmenu/getDriverReviewByemail',auth,review.getDriverReviewByemail) 
router.get('/Adminmenu/DeleteReviewAfterEnter',auth,review.DeleteReviewAfterEnter) 

router.post('/Adminmenu/DriverEnterapply',auth,review.DriverEnterapply) 
router.post('/Adminmenu/InviteDriverapply',auth,review.InviteDriverapply) 

router.post('/Adminmenu/DriverExitapply',auth,review.DriverExitapply)
router.post('/Adminmenu/deletedriverDetailTeam',auth,review.deletedriverDetailTeam)
router.post('/Adminmenu/passedriverDetailTeam',auth,review.passedriverDetailTeam)
router.delete('/Adminmenu/DeleteReview',auth,review.DeleteReview) 
router.post('/Adminmenu/UpdateReviewInfo',auth,review.UpdateReviewInfo)
router.post('/Adminmenu/TeamExitreview',auth,review.TeamExitreview) 


router.get('/Adminmenu/getTeamreview',auth,review.getTeamreview) 
router.get('/Adminmenu/getTeamreviewByIdInfo',Userauth,review.getTeamreviewByIdInfo) 
router.post('/Adminmenu/UpdateTeamReview',auth,review.UpdateTeamReview) 
router.post('/Adminmenu/addOfflineReview',auth,review.addOfflineReview) 
router.delete('/Adminmenu/DeleteTeamReview',auth,review.DeleteTeamReview) 
router.post('/Adminmenu/UploadDriverDetail',auth,review.UploadDriverDetail) 
router.post('/Adminmenu/UploadDriverDetails',auth,review.UploadDriverDetails) 
// router.post('/Adminmenu/UploadDriverDetails',auth,review.UploadDriverDetails) 


module.exports = router;