const express =require('express')
const router = express.Router();
const ServeUser=require('../controller/ServeUser');
const auth =require('../util/auth');

router.post('/servelogin',ServeUser.Servelogin) 

router.get('/getBackuser',auth,ServeUser.getBackuser) //get All user
router.get('/getBackUserInfo',auth,ServeUser.getBackUserInfo) //get info by id
router.get('/getBackuserByDriverEmail',auth,ServeUser.getBackuserByDriverEmail) 
router.post('/InsertChatInfo',auth,ServeUser.InsertChatInfo) 
router.get('/getChatInfo',auth,ServeUser.getChatInfo) 


router.post('/InsertscheduleResult',auth,ServeUser.InsertscheduleResult) 
router.get('/getscheduleResult',auth,ServeUser.getscheduleResult) 



router.post('/insertProfileImg',auth,ServeUser.insertProfileImg) 

router.post('/InsertOrUpdateBackuser',auth,ServeUser.InsertOrUpdateBackuser) 

router.delete('/DeleteBackuser',auth,ServeUser.DeleteBackuser)




// role
router.get('/getallRoleName',auth,ServeUser.getallRoleName) 

router.post('/InsertOrUpdateBackRole',auth,ServeUser.InsertOrUpdateBackRole) 

router.delete('/DeleteBackRole',auth,ServeUser.DeleteBackRole) 

router.get('/getallpermission',auth,ServeUser.getallpermission) 

//email
router.get('/getServeEmailinfo',auth,ServeUser.getServeEmailinfo) 
router.post('/addServeEmailinfo',auth,ServeUser.addServeEmailinfo) 
router.delete('/DeleteServeEmailinfo',auth,ServeUser.DeleteServeEmailinfo) 

//order
router.get('/getOrderinfo',auth,ServeUser.getOrderinfo)
router.post('/addOrderinfo',auth,ServeUser.addOrderinfo) 
router.delete('/DeleteOrderinfo',auth,ServeUser.DeleteOrderinfo) 

// exam
router.get('/getExaminfo',auth,ServeUser.getExaminfo)
router.post('/addExaminfo',auth,ServeUser.addExaminfo) 
router.delete('/DeleteExaminfo',auth,ServeUser.DeleteExaminfo)
router.post('/submitQuestion',auth,ServeUser.submitQuestion)

router.get('/getsysticket',auth,ServeUser.getsysticket)
router.post('/insertsysticket',auth,ServeUser.insertsysticket) 
router.delete('/deletesysticket',auth,ServeUser.deletesysticket)
router.post('/UpdateSysTicket',auth,ServeUser.UpdateSysTicket) 

//driver team
router.get('/getDriverTrain',auth,ServeUser.getDriverTrain)
router.get('/getDriverTrainByemail',auth,ServeUser.getDriverTrainByemail)

router.delete('/Deletetrain',auth,ServeUser.Deletetrain)
router.post('/UpdateDriverTrain',auth,ServeUser.UpdateDriverTrain) 



router.get('/getdrivernews',ServeUser.getdrivernews)

router.get('/getDriverAchieve',auth,ServeUser.getDriverAchieve)
router.get('/getDriverDetail',ServeUser.getDriverDetail)
router.get('/getdriverraceinfo',ServeUser.getdriverraceinfo)
router.get('/getdriverqulifyinfo',ServeUser.getdriverqulifyinfo)
router.get('/getteamraceinfo',ServeUser.getteamraceinfo)
router.get('/getteampointinfo',ServeUser.getteampointinfo)

// router.get('/getDriverDetail',auth,ServeUser.getDriverDetail)
router.post('/addOrUpdateDriverdetail',auth,ServeUser.addOrUpdateDriverdetail)
router.post('/updateDriverLicensePoint',auth,ServeUser.updateDriverLicensePoint)

router.post('/addOrUpdateTeamdetail',auth,ServeUser.addOrUpdateTeamdetail)
router.get('/getTeamdetail',ServeUser.getTeamdetail)
router.delete('/DeleteScheduleDriver',auth,ServeUser.DeleteScheduleDriver)
router.get('/getDriverByTeam',auth,ServeUser.getDriverByTeam)
router.get('/getRaceRecordByTeam',auth,ServeUser.getRaceRecordByTeam)
router.get('/getRaceRecordByDriver',auth,ServeUser.getRaceRecordByDriver)

router.get('/getScheduleDriver',auth,ServeUser.getScheduleDriver)
router.post('/InsertDriverSchedule',auth,ServeUser.InsertDriverSchedule) 
router.post('/addTeaminfo',auth,ServeUser.addTeaminfo) //addOrUpdate

router.post('/InsertOruploadschedule',auth,ServeUser.InsertOruploadschedule) //addOrUpdate
router.delete('/Deleteschedule',auth,ServeUser.Deleteschedule)

// 批量插入
// var sql = "INSERT INTO Test (name, email, n) VALUES ?";
// var values = [
//     ['demian', 'demian@gmail.com', 1],
//     ['john', 'john@gmail.com', 2],
//     ['mark', 'mark@gmail.com', 3],
//     ['pete', 'pete@gmail.com', 4]
// ];
// conn.query(sql, [values], function(err) {
//     if (err) throw err;
//     conn.end();
// });

module.exports = router;